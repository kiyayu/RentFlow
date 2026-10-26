import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/layout/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getErrorMessage } from "@/lib/errors";
import { useTranslation } from "@/lib/i18n";
import {
  useArchiveProduct,
  useCreateProduct,
  useManagedProductList,
  useUpdateProduct,
} from "../hooks/useProducts";
import type { CreateProductInput, Product } from "../types/product.types";
import { ProductForm } from "./ProductForm";

export function ProductManagement() {
  const { t } = useTranslation("product");
  const products = useManagedProductList({ page: 1, limit: 100 });
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const archive = useArchiveProduct();
  const [editor, setEditor] = useState<"create" | Product | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Product | null>(null);

  const closeEditor = () => {
    if (!create.isPending && !update.isPending) setEditor(null);
  };

  const submit = (input: CreateProductInput) => {
    if (editor === "create") {
      create.mutate(input, {
        onSuccess: () => {
          toast.success(t("create.success"));
          setEditor(null);
        },
      });
      return;
    }

    if (editor) {
      update.mutate(
        { id: editor.id, input },
        {
          onSuccess: () => {
            toast.success(t("manage.updated"));
            setEditor(null);
          },
        },
      );
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <Button icon={<Plus />} onClick={() => setEditor("create")}>
          {t("manage.add")}
        </Button>
      </div>

      {products.isPending && (
        <p className="text-sm text-muted-foreground">{t("catalog.loading")}</p>
      )}
      {products.isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {t("manage.loadFailed")}
        </div>
      )}
      {products.data?.products.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
          {t("manage.empty")}
        </div>
      )}
      {products.data && products.data.products.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.data.products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle>{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {product.brand ?? t("manage.noBrand")}
                    </p>
                  </div>
                  <span
                    className={
                      product.status === "active"
                        ? "rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
                        : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {t(`manage.status.${product.status}`)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {product.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: product.rentalPricing.currency,
                  }).format(product.rentalPricing.amount)}{" "}
                  {t("manage.perDay")}
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Pencil />}
                  onClick={() => setEditor(product)}
                >
                  {t("manage.edit")}
                </Button>
                {product.status === "active" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 />}
                    onClick={() => setArchiveTarget(product)}
                  >
                    {t("manage.archive")}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={editor !== null}
        onOpenChange={(open) => !open && closeEditor()}
      >
        <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-3xl overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editor === "create" ? t("create.title") : t("manage.editTitle")}
            </DialogTitle>
            <DialogDescription>
              {editor === "create"
                ? t("create.description")
                : t("manage.editDescription")}
            </DialogDescription>
          </DialogHeader>
          {editor !== null && (
            <ProductForm
              key={editor === "create" ? "create" : editor.id}
              product={editor === "create" ? undefined : editor}
              onSubmit={submit}
              isPending={create.isPending || update.isPending}
              error={create.error ?? update.error}
              submitLabel={
                editor === "create" ? t("form.submit") : t("form.save")
              }
              pendingLabel={
                editor === "create" ? t("form.creating") : t("form.saving")
              }
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={archiveTarget !== null}
        onOpenChange={(open) => !open && setArchiveTarget(null)}
        title={t("manage.archiveTitle")}
        description={t("manage.archiveDescription", {
          name: archiveTarget?.name ?? "",
        })}
        confirmLabel={t("manage.archive")}
        isPending={archive.isPending}
        error={archive.error ? getErrorMessage(archive.error) : undefined}
        onConfirm={() =>
          archiveTarget &&
          archive.mutate(archiveTarget.id, {
            onSuccess: () => {
              toast.success(t("manage.archived"));
              setArchiveTarget(null);
            },
          })
        }
      />
    </>
  );
}

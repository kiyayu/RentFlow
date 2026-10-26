import { useState } from "react";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/errors";
import { useTranslation } from "@/lib/i18n";
import { useProductList } from "@/features/product";
import {
  useCreateUnit,
  useInventory,
  useMarkUnitReady,
  useRetireUnit,
  useUpdateUnit,
} from "../hooks/useInventory";
import {
  unitFormSchema,
  type UnitFormValues,
} from "../schemas/inventory.schema";
import type { InventoryUnit } from "../types/inventory.types";

const fieldClassName =
  "h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function UnitEditor({
  unit,
  onClose,
}: {
  unit: InventoryUnit | null;
  onClose: () => void;
}) {
  const { t } = useTranslation("inventory");
  const products = useProductList({ page: 1, limit: 100 });
  const create = useCreateUnit();
  const update = useUpdateUnit();
  const editing = Boolean(unit);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: unit
      ? {
          productId: unit.productId,
          assetTag: unit.assetTag,
          serialNumber: unit.serialNumber ?? "",
          condition: unit.condition,
          operationalStatus: unit.operationalStatus,
          custodyStatus: unit.custodyStatus,
          notes: unit.notes ?? "",
        }
      : {
          productId: "",
          assetTag: "",
          serialNumber: "",
          condition: "good",
          operationalStatus: "available",
          custodyStatus: "in_stock",
          notes: "",
        },
  });
  const pending = create.isPending || update.isPending;
  const submit = (values: UnitFormValues) => {
    const input = {
      serialNumber: values.serialNumber || undefined,
      condition: values.condition,
      operationalStatus: values.operationalStatus,
      notes: values.notes || undefined,
    };
    if (unit)
      update.mutate(
        { id: unit.id, input },
        {
          onSuccess: () => {
            toast.success(t("updated"));
            onClose();
          },
        },
      );
    else
      create.mutate(
        {
          productId: values.productId,
          assetTag: values.assetTag,
          serialNumber: values.serialNumber || undefined,
          condition: values.condition,
          notes: values.notes || undefined,
        },
        {
          onSuccess: () => {
            toast.success(t("created"));
            onClose();
          },
        },
      );
  };
  const error = create.error ?? update.error;
  return (
    <form className="space-y-5" onSubmit={handleSubmit(submit)} noValidate>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {getErrorMessage(error)}
        </p>
      )}
      <label className="grid gap-1.5 text-sm font-medium text-foreground">
        {t("form.equipment")}
        <select
          className={fieldClassName}
          disabled={editing || products.isPending || pending}
          {...register("productId")}
        >
          <option value="">{t("form.selectEquipment")}</option>
          {products.data?.products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        {errors.productId && (
          <span className="text-xs text-destructive">
            {errors.productId.message}
          </span>
        )}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t("form.assetTag")}
          disabled={editing}
          {...register("assetTag")}
          error={errors.assetTag?.message}
        />
        <Input
          label={t("form.serialNumber")}
          {...register("serialNumber")}
          error={errors.serialNumber?.message}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-1.5 text-sm font-medium text-foreground">
          {t("form.condition")}
          <select
            className={fieldClassName}
            disabled={pending}
            {...register("condition")}
          >
            <option value="new">{t("condition.new")}</option>
            <option value="good">{t("condition.good")}</option>
            <option value="fair">{t("condition.fair")}</option>
            <option value="damaged">{t("condition.damaged")}</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-foreground">
          {t("form.operationalStatus")}
          <select
            className={fieldClassName}
            disabled={pending}
            {...register("operationalStatus")}
          >
            <option value="available">{t("operational.available")}</option>
            <option value="maintenance">{t("operational.maintenance")}</option>
            <option value="retired">{t("operational.retired")}</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-foreground">
          {t("form.custodyStatus")}
          <select
            className={fieldClassName}
            disabled
            {...register("custodyStatus")}
          >
            <option value="in_stock">{t("custody.in_stock")}</option>
            <option value="checked_out">{t("custody.checked_out")}</option>
            <option value="inspection_required">
              {t("custody.inspection_required")}
            </option>
          </select>
        </label>
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="unit-notes"
          className="text-sm font-medium text-foreground"
        >
          {t("form.notes")}
        </label>
        <Textarea
          id="unit-notes"
          rows={4}
          {...register("notes")}
          aria-invalid={Boolean(errors.notes)}
        />
        {errors.notes && (
          <p className="text-xs text-destructive">{errors.notes.message}</p>
        )}
      </div>
      <Button type="submit" disabled={pending}>
        {pending
          ? t("form.saving")
          : editing
            ? t("form.save")
            : t("form.create")}
      </Button>
    </form>
  );
}

export function InventoryManagement() {
  const { t } = useTranslation("inventory");
  const [page, setPage] = useState(1);
  const inventory = useInventory(page);
  const markReady = useMarkUnitReady();
  const retire = useRetireUnit();
  const [editor, setEditor] = useState<"create" | InventoryUnit | null>(null);
  const [retireTarget, setRetireTarget] = useState<InventoryUnit | null>(null);
  return (
    <>
      <div className="flex justify-end">
        <Button icon={<Plus />} onClick={() => setEditor("create")}>
          {t("add")}
        </Button>
      </div>
      {inventory.isPending && (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      )}
      {inventory.isError && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {getErrorMessage(inventory.error, t("loadFailed"))}
        </p>
      )}
      {inventory.data?.units.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
          {t("empty")}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {inventory.data?.units.map((unit) => (
          <Card key={unit.id}>
            <CardHeader>
              <CardTitle>{unit.assetTag}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {unit.serialNumber ?? t("noSerial")}
              </p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">
                  {t("labels.condition")}:{" "}
                </span>
                {t(`condition.${unit.condition}`)}
              </p>
              <p>
                <span className="text-muted-foreground">
                  {t("labels.operational")}:{" "}
                </span>
                {t(`operational.${unit.operationalStatus}`)}
              </p>
              <p>
                <span className="text-muted-foreground">
                  {t("labels.custody")}:{" "}
                </span>
                {t(`custody.${unit.custodyStatus}`)}
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                size="sm"
                variant="outline"
                icon={<Pencil />}
                onClick={() => setEditor(unit)}
              >
                {t("edit")}
              </Button>
              {unit.operationalStatus !== "retired" && (
                unit.custodyStatus === "inspection_required" &&
                unit.condition !== "damaged" && (
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Check />}
                    disabled={markReady.isPending}
                    onClick={() =>
                      markReady.mutate(unit.id, {
                        onSuccess: () => toast.success(t("ready")),
                      })
                    }
                  >
                    {t("markReady")}
                  </Button>
                )
              )}
              {unit.operationalStatus !== "retired" && (
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<Trash2 />}
                  onClick={() => setRetireTarget(unit)}
                >
                  {t("retire")}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      {(inventory.data?.pagination.totalPage ?? 0) > 1 && (
        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            {t("pagination.page", {
              current: inventory.data?.pagination.currentPage ?? page,
              total: inventory.data?.pagination.totalPage ?? 1,
            })}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              {t("pagination.previous")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= (inventory.data?.pagination.totalPage ?? 1)}
              onClick={() => setPage((current) => current + 1)}
            >
              {t("pagination.next")}
            </Button>
          </div>
        </div>
      )}
      <Dialog
        open={editor !== null}
        onOpenChange={(open) => !open && setEditor(null)}
      >
        <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-2xl overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editor === "create" ? t("createTitle") : t("editTitle")}
            </DialogTitle>
            <DialogDescription>
              {editor === "create"
                ? t("createDescription")
                : t("editDescription")}
            </DialogDescription>
          </DialogHeader>
          {editor !== null && (
            <UnitEditor
              key={editor === "create" ? "create" : editor.id}
              unit={editor === "create" ? null : editor}
              onClose={() => setEditor(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={retireTarget !== null}
        onOpenChange={(open) => !open && setRetireTarget(null)}
        title={t("retireTitle")}
        description={t("retireDescription", {
          tag: retireTarget?.assetTag ?? "",
        })}
        confirmLabel={t("retire")}
        isPending={retire.isPending}
        error={retire.error ? getErrorMessage(retire.error) : undefined}
        onConfirm={() =>
          retireTarget &&
          retire.mutate(retireTarget.id, {
            onSuccess: () => {
              toast.success(t("retired"));
              setRetireTarget(null);
            },
          })
        }
      />
    </>
  );
}

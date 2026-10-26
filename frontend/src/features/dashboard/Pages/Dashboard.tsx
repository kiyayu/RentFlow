import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Boxes,
  CalendarClock,
  CircleAlert,
  PackageCheck,
  ReceiptText,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { sessionQueryOptions } from "@/features/auth";
import { useInventory } from "@/features/inventory";
import { useProductList } from "@/features/product";
import { useMyReservations } from "@/features/reservation";
import { formatDateTime } from "@/lib/format";
import { useTranslation } from "@/lib/i18n";

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 pt-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div className="rounded-lg bg-primary/10 p-3 text-primary">{icon}</div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { t } = useTranslation("dashboard");
  const { data: user } = useQuery(sessionQueryOptions);
  const staff = user?.role === "staff" || user?.role === "admin";
  const catalog = useProductList({ page: 1, limit: 1 });
  const inventory = useInventory(1, staff);
  const reservations = useMyReservations();
  const units = inventory.data?.units ?? [];
  const customerReservations = Array.isArray(reservations.data) ? reservations.data : [];
  const availableUnits = units.filter(
    (unit) =>
      unit.operationalStatus === "available" &&
      unit.custodyStatus === "in_stock",
  ).length;
  const attentionUnits = units.filter(
    (unit) =>
      unit.operationalStatus === "maintenance" ||
      unit.condition === "damaged" ||
      unit.custodyStatus === "inspection_required",
  ).length;
  const pendingReservations = customerReservations.filter(
    (reservation) => reservation.status === "pending_payment",
  ).length;
  const confirmedReservations = customerReservations.filter(
    (reservation) => reservation.status === "confirmed",
  ).length;
  const nextReservation = customerReservations
    .filter(
      (reservation) =>
        new Date(reservation.endAt) > new Date() &&
        ["pending_payment", "confirmed"].includes(reservation.status),
    )
    .sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
    )[0];

  return (
    <PageContainer width="wide" className="space-y-8 py-8">
      <PageHeader
        title={t("title", { name: user?.name ?? "" })}
        description={staff ? t("staffDescription") : t("customerDescription")}
        actions={
          <Button asChild>
            <Link to={staff ? paths.app.products : paths.app.equipment}>
              {staff ? t("addEquipment") : t("browseEquipment")}
            </Link>
          </Button>
        }
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label={t("metrics.listed")}
          value={catalog.data?.pagination.total ?? "—"}
          icon={<Boxes className="size-5" />}
        />
        {staff ? (
          <>
            <Metric
              label={t("metrics.available")}
              value={inventory.isPending ? "—" : availableUnits}
              icon={<PackageCheck className="size-5" />}
            />
            <Metric
              label={t("metrics.attention")}
              value={inventory.isPending ? "—" : attentionUnits}
              icon={<CircleAlert className="size-5" />}
            />
            <Metric
              label={t("metrics.confirmed")}
              value={confirmedReservations}
              icon={<ReceiptText className="size-5" />}
            />
          </>
        ) : (
          <>
            <Metric
              label={t("metrics.pending")}
              value={pendingReservations}
              icon={<ReceiptText className="size-5" />}
            />
            <Metric
              label={t("metrics.confirmed")}
              value={confirmedReservations}
              icon={<CalendarClock className="size-5" />}
            />
            <Metric
              label={t("metrics.available")}
              value={catalog.data?.pagination.total ?? "—"}
              icon={<PackageCheck className="size-5" />}
            />
          </>
        )}
      </section>
      {staff ? (
        <section className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-5">
            <h2 className="font-semibold text-foreground">
              {t("operations.title")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("operations.description")}
            </p>
          </div>
          <div className="p-6">
            {attentionUnits === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("operations.empty")}
              </p>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-foreground">
                  {attentionUnits} {t("metrics.attention").toLocaleLowerCase()}
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to={paths.app.inventory}>{t("inventory.title")}</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-5">
            <h2 className="font-semibold text-foreground">
              {t("upcoming.title")}
            </h2>
          </div>
          <div className="p-6">
            {nextReservation ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {(Array.isArray(nextReservation.items) ? nextReservation.items : [])
                      .map((item) => item.productNameSnapshot)
                      .join(", ")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDateTime(nextReservation.startAt)} —{" "}
                    {formatDateTime(nextReservation.endAt)}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to={paths.app.reservations}>
                    {t("reservations.title")}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {t("upcoming.empty")}
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  icon={<ArrowRight />}
                  iconPosition="end"
                >
                  <Link to={paths.app.equipment}>{t("browseEquipment")}</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}
    </PageContainer>
  );
}

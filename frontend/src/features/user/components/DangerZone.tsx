//src/features/user/components/DangerZone.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/layout/ConfirmDialog"
import { getErrorMessage } from "@/lib/errors"
import { useDeactivateAccount, useDeleteAccount } from "../hooks/useUserMutations"

type Dialog = "deactivate" | "delete" | null

export function DangerZone() {
  const [dialog, setDialog] = useState<Dialog>(null)
  const deactivate = useDeactivateAccount()
  const remove = useDeleteAccount()

  const close = () => {
    setDialog(null)
    deactivate.reset()
    remove.reset()
  }

  return (
    <div className="divide-y divide-border">
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Deactivate account</p>
          <p className="text-sm text-muted-foreground">Sign out everywhere and disable your account.</p>
        </div>
        <Button variant="outline" onClick={() => setDialog("deactivate")}>Deactivate</Button>
      </div>

      <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-destructive">Delete account</p>
          <p className="text-sm text-muted-foreground">Permanently delete your account and data. This cannot be undone.</p>
        </div>
        <Button variant="destructive" onClick={() => setDialog("delete")}>Delete</Button>
      </div>

      <ConfirmDialog
        open={dialog === "deactivate"}
        onOpenChange={(o) => !o && close()}
        title="Deactivate your account?"
        description="You will be signed out on every device and cannot log in until the account is reactivated."
        confirmLabel="Deactivate"
        isPending={deactivate.isPending}
        error={deactivate.error ? getErrorMessage(deactivate.error) : undefined}
        onConfirm={() => deactivate.mutate()}
      />

      <ConfirmDialog
        open={dialog === "delete"}
        onOpenChange={(o) => !o && close()}
        title="Delete your account permanently?"
        description="All your data will be removed. This cannot be undone."
        confirmLabel="Delete forever"
        confirmText="DELETE"
        isPending={remove.isPending}
        error={remove.error ? getErrorMessage(remove.error) : undefined}
        onConfirm={() => remove.mutate()}
      />
    </div>
  )
}
//src/components/layout/ConfirmDialog.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  confirmText?: string  
  isPending?: boolean
  error?: string
  onConfirm: () => void
}

export function ConfirmDialog({
  open, onOpenChange, title, description, confirmLabel,
  confirmText, isPending, error, onConfirm,
}: Props) {
  const [typed, setTyped] = useState("")
  const canConfirm = !isPending && (!confirmText || typed === confirmText)

  const handleOpenChange = (next: boolean) => {
    if (isPending) return // never close mid-request
    if (!next) setTyped("")
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-base font-semibold text-foreground">{title}</DialogTitle>
        <p className="text-sm text-muted-foreground">{description}</p>

        {confirmText && (
          <Input
            label={`Type "${confirmText}" to confirm`}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
          />
        )}

        {error && (
          <p role="alert" className="px-3 py-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={!canConfirm}>
            {isPending ? "Working..." : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
//src/features/user/components/DangerZone.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/layout/ConfirmDialog'
import { getErrorMessage } from '@/lib/errors'
import { useTranslation } from '@/lib/i18n'
import { useDeactivateAccount, useDeleteAccount } from '../hooks/useUserMutations'

type Dialog = 'deactivate' | 'delete' | null

export function DangerZone() {
  const { t } = useTranslation('settings')
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
          <p className="text-sm font-medium text-foreground">{t('privacy.deactivateTitle')}</p>
          <p className="text-sm text-muted-foreground">{t('privacy.deactivateText')}</p>
        </div>
        <Button variant="outline" onClick={() => setDialog('deactivate')}>
          {t('privacy.deactivate')}
        </Button>
      </div>

      <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-destructive">{t('privacy.deleteTitle')}</p>
          <p className="text-sm text-muted-foreground">{t('privacy.deleteText')}</p>
        </div>
        <Button variant="destructive" onClick={() => setDialog('delete')}>
          {t('privacy.delete')}
        </Button>
      </div>

      <ConfirmDialog
        open={dialog === 'deactivate'}
        onOpenChange={(o) => !o && close()}
        title={t('privacy.deactivateConfirmTitle')}
        description={t('privacy.deactivateConfirmText')}
        confirmLabel={t('privacy.deactivate')}
        isPending={deactivate.isPending}
        error={deactivate.error ? getErrorMessage(deactivate.error) : undefined}
        onConfirm={() => deactivate.mutate()}
      />

      <ConfirmDialog
        open={dialog === 'delete'}
        onOpenChange={(o) => !o && close()}
        title={t('privacy.deleteConfirmTitle')}
        description={t('privacy.deleteConfirmText')}
        confirmLabel={t('privacy.deleteConfirmLabel')}
        confirmText={t('privacy.deleteWord')}
        isPending={remove.isPending}
        error={remove.error ? getErrorMessage(remove.error) : undefined}
        onConfirm={() => remove.mutate()}
      />
    </div>
  )
}
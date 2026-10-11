//src/features/auth/components/PasswordHint.tsx
import { useTranslation } from '@/lib/i18n'

export function PasswordHint() {
  const { t } = useTranslation('auth')
  return <p className="text-xs text-muted-foreground">{t('register.passwordHint')}</p>
}
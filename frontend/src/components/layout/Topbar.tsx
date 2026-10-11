//src/components/layout/Topbar.tsx
import { Link } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/lib/i18n'
import { appConfig } from './nav.config'

export type ShellUser = { name: string; email: string; avatarUrl?: string }

export function Topbar({
  user,
  onLogout,
  notifications,
}: {
  user?: ShellUser
  onLogout?: () => void
  notifications?: React.ReactNode // slot: the shell never imports a feature
}) {
  const { t } = useTranslation('layout')

  return (
    <div className="flex items-center gap-1 ml-auto">
      {notifications}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('account.menu')}
              icon={
                user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="rounded-full size-7" />
                ) : (
                  <User />
                )
              }
            />
          }
        />
        <DropdownMenuContent align="end" className="w-52">
          {user && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuLabel className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}
          {appConfig.account.map(({ labelKey, to, icon: Icon }) => (
            <DropdownMenuItem key={to} render={<Link to={to} />}>
              <Icon />
              <span>{t(labelKey)}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout} disabled={!onLogout}>
            <LogOut />
            <span>{t('account.logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
 //src/features/auth/components/GoogleButton.tsx
import { Button } from '@/components/ui/button'
import { API_BASE_URL } from '@/lib/axios'

// Full-page navigation on purpose: /auth/google redirects to Google, not JSON.
const googleUrl = `${API_BASE_URL.replace(/\/$/, '')}/auth/google`

export function GoogleButton() {
  return (
    <>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button asChild variant="outline" className="w-full">
        <a href={googleUrl}>Continue with Google</a>
      </Button>
    </>
  )
}
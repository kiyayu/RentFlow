//src/features/auth/components/AuthSwitch.tsx
import { Link } from 'react-router-dom'

export function AuthSwitch({ text, label, to }: { text: string; label: string; to: string }) {
  return (
    <p className="text-sm text-center text-muted-foreground">
      {text}{' '}
      <Link to={to} className="font-medium text-primary hover:underline">
        {label}
      </Link>
    </p>
  )
}

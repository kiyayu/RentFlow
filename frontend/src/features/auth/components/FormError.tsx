//src/features/auth/components/FormError.tsx
export function FormError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="px-3 py-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg"
    >
      {message}
    </p>
  )
}
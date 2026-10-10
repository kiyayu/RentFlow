//src/components/layout/ErrorPage.tsx
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { paths } from "@/config/paths"

export function ErrorPage({ homePath = paths.home, homeLabel = "Go home" }: {
  homePath?: string
  homeLabel?: string
}) {
  const error = useRouteError()
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  const title = isNotFound ? "Page not found" : "Something went wrong"
  const description = isNotFound
    ? "The page you are looking for does not exist or was moved."
    : "An unexpected error occurred. You can try again or go back home."

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-4 space-y-6 text-center bg-background">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">{isNotFound ? "404" : "Error"}</p>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        {!isNotFound && (
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
        )}
       <Button asChild>
    <Link to={homePath}>{homeLabel}</Link>
  </Button>
      </div>
    </div>
  )
}
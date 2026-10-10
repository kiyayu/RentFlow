//src/components/layout/ErrorPanel.tsx
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { paths } from "@/config/paths"

export function ErrorPanel() {
  const error = useRouteError()
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className="flex flex-col items-center justify-center p-6 py-20 space-y-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">{isNotFound ? "404" : "Error"}</p>
        <h1 className="text-xl font-semibold text-foreground">
          {isNotFound ? "Page not found" : "Something went wrong"}
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {isNotFound
            ? "This page does not exist inside the app."
            : "An unexpected error occurred. Try again or go back to the dashboard."}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        {!isNotFound && (
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
        )}
        <Button asChild>
          <Link to={paths.app.dashboard}>Back to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
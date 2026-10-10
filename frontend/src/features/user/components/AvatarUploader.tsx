//src/features/user/components/AvatarUploader.tsx
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FileDropzone } from '@/components/ui/file-dropzone'
import { getErrorMessage } from '@/lib/errors'
import { sessionQueryOptions } from '@/features/auth'
import { useUpload } from '@/features/uploads'
import { useRemoveAvatar, useSetAvatar } from '../hooks/useUserMutations'

// Mirrors the backend rule for "avatar". The server enforces the real limits.
const AVATAR_RULE = { types: ['image/png', 'image/jpeg', 'image/webp'], maxBytes: 2 * 1024 * 1024 }

export function AvatarUploader() {
  const { data: user } = useQuery(sessionQueryOptions)
  const upload = useUpload('avatar')
  const setAvatar = useSetAvatar()
  const removeAvatar = useRemoveAvatar()

  const busy = upload.isPending || setAvatar.isPending || removeAvatar.isPending

  const onFile = (file: File) =>
    upload.mutate(file, {
      onSuccess: (fileKey) =>
        setAvatar.mutate(fileKey, {
          onSuccess: () => toast.success('Avatar updated'),
          onError: (e) => toast.error(getErrorMessage(e)),
        }),
      onError: (e) => toast.error(getErrorMessage(e, 'Upload failed. Please try again.')),
    })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
          <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
        </Avatar>
        {user?.avatarUrl && (
          <Button variant="outline" size="sm" disabled={busy}
            onClick={() => removeAvatar.mutate(undefined, {
              onSuccess: () => toast.success('Avatar removed'),
              onError: (e) => toast.error(getErrorMessage(e)),
            })}>
            Remove
          </Button>
        )}
      </div>

      <FileDropzone rule={AVATAR_RULE} onFile={onFile} disabled={busy}
        label={busy ? 'Uploading...' : 'Drop an image here or click to choose'} />

      {upload.isPending && (
        <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar"
          aria-valuenow={upload.progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full transition-all bg-primary" style={{ width: `${upload.progress}%` }} />
        </div>
      )}
    </div>
  )
}
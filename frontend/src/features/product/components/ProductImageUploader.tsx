import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { LoaderCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FileDropzone } from '@/components/ui/file-dropzone'
import { getErrorMessage } from '@/lib/errors'
import { uploadApi, useUpload } from '@/features/uploads'

const IMAGE_RULE = { types: ['image/png', 'image/jpeg', 'image/webp'], maxBytes: 10 * 1024 * 1024 }

type Props = {
  value: string[]
  onChange: (images: string[]) => void
  onBusyChange: (busy: boolean) => void
  disabled?: boolean
}

export function ProductImageUploader({ value, onChange, onBusyChange, disabled }: Props) {
  const { t } = useTranslation('product')
  const upload = useUpload('attachment')
  const [fileKeys, setFileKeys] = useState<Record<string, string>>({})
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    onBusyChange(upload.isPending || isConfirming)
  }, [isConfirming, onBusyChange, upload.isPending])

  const addImage = async (fileKey: string) => {
    setIsConfirming(true)
    try {
      const uploaded = await uploadApi.confirm({ purpose: 'attachment', fileKey })
      setFileKeys((current) => ({ ...current, [uploaded.fileUrl]: fileKey }))
      onChange([...value, uploaded.fileUrl])
    } catch (error) {
      await uploadApi.remove(fileKey).catch(() => undefined)
      toast.error(getErrorMessage(error, t('upload.confirmFailed')))
    } finally {
      setIsConfirming(false)
    }
  }

  const removeImage = (url: string) => {
    const fileKey = fileKeys[url]
    setFileKeys((current) => {
      const next = { ...current }
      delete next[url]
      return next
    })
    onChange(value.filter((image) => image !== url))
    if (fileKey) void uploadApi.remove(fileKey).catch(() => undefined)
  }

  const onFile = (file: File) => {
    upload.mutate(file, {
      onSuccess: (fileKey) => { void addImage(fileKey) },
      onError: (error) => toast.error(getErrorMessage(error, t('upload.failed'))),
    })
  }

  return (
    <div className="space-y-3">
      <FileDropzone
        rule={IMAGE_RULE}
        onFile={onFile}
        disabled={disabled || upload.isPending || isConfirming || value.length >= 10}
        label={value.length >= 10 ? t('upload.limit') : t('upload.label')}
      />
      {upload.isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" /> {t('upload.uploading', { progress: upload.progress })}
        </div>
      )}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url) => (
            <div key={url} className="relative overflow-hidden rounded-lg border border-border bg-muted aspect-square">
              <img src={url} alt="" className="size-full object-cover" />
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                className="absolute top-2 right-2"
                aria-label={t('upload.remove')}
                disabled={disabled}
                onClick={() => removeImage(url)}
                icon={<X />}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

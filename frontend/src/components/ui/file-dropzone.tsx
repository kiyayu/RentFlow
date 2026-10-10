//src/components/ui/file-dropzone.tsx
import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatBytes, validateFile, type FileRule } from '@/lib/files'

type Props = {
  rule: FileRule
  onFile: (file: File) => void
  disabled?: boolean
  label?: string
}

export function FileDropzone({ rule, onFile, disabled, label = 'Drop a file here or click to choose' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handle = (file?: File) => {
    if (!file) return
    const problem = validateFile(file, rule)
    setError(problem)
    if (!problem) onFile(file)
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]) }}
        className={cn(
          'flex flex-col items-center justify-center w-full gap-2 p-6 text-sm text-muted-foreground bg-card border border-dashed border-border rounded-lg transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
          dragging && 'bg-muted border-primary'
        )}
      >
        <Upload className="size-5" />
        <span>{label}</span>
        <span className="text-xs">Max {formatBytes(rule.maxBytes)}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={rule.types.join(',')}
        onChange={(e) => { handle(e.target.files?.[0]); e.target.value = '' }}
      />
      {error && <p role="alert" className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}
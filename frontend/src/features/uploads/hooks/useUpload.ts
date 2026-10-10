//src/features/uploads/hooks/useUpload.ts
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { uploadApi, type UploadPurpose } from '../api/upload.api'

// Returns the fileKey. The caller decides what to do with it (avatar, attachment...).
export function useUpload(purpose: UploadPurpose) {
  const [progress, setProgress] = useState(0)

  const mutation = useMutation({
    mutationFn: async (file: File): Promise<string> => {
      setProgress(0)
      const signed = await uploadApi.sign({ purpose, contentType: file.type, size: file.size })
      await uploadApi.sendToStorage(signed, file, setProgress)
      return signed.fileKey
    },
  })

  return { ...mutation, progress }
}
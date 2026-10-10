import { type Control, Controller, type FieldValues, type Path } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormSelectProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  label?: string
  placeholder?: string
  options: { label: string; value: string }[]
  error?: string
}

export function FormSelect<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select an option",
  options,
  error,
}: FormSelectProps<TFieldValues>) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium leading-none text-foreground">
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value ?? ""} onValueChange={field.onChange}>
            <SelectTrigger aria-invalid={!!error}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}
import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, Minus } from "lucide-react"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  indeterminate?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate, checked, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => innerRef.current!)

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate ?? false
      }
    }, [indeterminate])

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          ref={innerRef}
          checked={checked}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "h-5 w-5 shrink-0 rounded-md border-2 border-white/30 bg-white/5 transition-all",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-vision-blue peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-vision-navy",
            "peer-checked:border-vision-cyan peer-checked:bg-vision-cyan",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            "flex items-center justify-center",
            className
          )}
        >
          {checked && !indeterminate && (
            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
          )}
          {indeterminate && (
            <Minus className="h-3.5 w-3.5 text-white" strokeWidth={3} />
          )}
        </div>
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

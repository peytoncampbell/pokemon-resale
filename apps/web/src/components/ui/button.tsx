import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue focus-visible:ring-offset-2 focus-visible:ring-offset-vision-navy disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-vision-blue to-vision-cyan text-white hover:shadow-lg hover:shadow-vision-blue/25 active:scale-[0.98] active:shadow-none",
        success: "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98] active:bg-red-700",
        outline: "border border-white/20 bg-transparent text-white hover:bg-white/10 active:scale-[0.98] active:bg-white/15",
        secondary: "bg-white/10 text-white hover:bg-white/20 active:scale-[0.98]",
        ghost: "text-white/60 hover:text-white hover:bg-white/10 active:bg-white/15",
        link: "text-vision-cyan underline-offset-4 hover:underline active:opacity-80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

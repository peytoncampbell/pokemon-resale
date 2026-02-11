import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { animations, borderRadius } from "@/lib/design-tokens"

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-vision-blue focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-vision-blue text-white",
        secondary: "border-transparent bg-white/10 text-white",
        destructive: "border-transparent bg-destructive text-white",
        outline: "border-white/20 text-white/80 bg-transparent",
        success: "border-transparent bg-vision-green text-white",
        warning: "border-transparent bg-vision-orange text-white",
        info: "border-transparent bg-vision-cyan text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const badgeStyles = {
  borderRadius: borderRadius.lg,
  transition: animations.transition.normal,
}

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant }), className)} 
      style={{ ...badgeStyles, ...style }}
      {...props} 
    />
  )
}

export { Badge, badgeVariants }

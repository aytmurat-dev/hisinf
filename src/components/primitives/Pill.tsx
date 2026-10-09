import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const pillVariants = cva(
  'inline-flex items-center justify-center gap-2.5 rounded-full font-medium transition-[transform,box-shadow,background-color,color] duration-200 cursor-pointer select-none leading-none',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-fg shadow-btn hover:translate-y-0.5 hover:shadow-[0_2px_0_var(--fg)] active:translate-y-1 active:shadow-none hover:text-primary-fg',
        outline:
          'border border-line text-fg bg-transparent hover:bg-fg hover:text-bg',
        dark:
          'bg-fg text-bg hover:-translate-y-0.5 hover:shadow-[0_4px_0_var(--primary)] hover:text-bg',
        filter:
          'border text-[13px] data-[on=true]:border-fg data-[on=true]:bg-fg data-[on=true]:text-bg data-[on=false]:border-border data-[on=false]:bg-card data-[on=false]:text-fg hover:border-line',
        light:
          'bg-primary-fg text-primary hover:translate-x-1',
        ghost:
          'bg-transparent text-fg hover:bg-surface-2',
      },
      size: {
        lg: 'px-[26px] py-4 text-[15.5px]',
        md: 'px-[18px] py-[11px] text-[14px]',
        sm: 'px-[15px] py-[9px] text-[13px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface PillProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pillVariants> {
  asChild?: boolean
  active?: boolean
}

const Pill = React.forwardRef<HTMLButtonElement, PillProps>(
  ({ className, variant, size, asChild = false, active, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(pillVariants({ variant, size }), className)}
        data-on={active !== undefined ? String(active) : undefined}
        {...props}
      />
    )
  },
)
Pill.displayName = 'Pill'

export { Pill, pillVariants }

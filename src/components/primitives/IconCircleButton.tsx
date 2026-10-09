import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/cn'

export interface IconCircleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const IconCircleButton = React.forwardRef<HTMLButtonElement, IconCircleButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(
          'grid size-10 place-items-center rounded-full border border-border text-fg bg-transparent transition-colors hover:border-line cursor-pointer shrink-0',
          className,
        )}
        {...props}
      />
    )
  },
)
IconCircleButton.displayName = 'IconCircleButton'

export { IconCircleButton }

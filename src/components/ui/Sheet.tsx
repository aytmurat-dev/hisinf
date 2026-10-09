'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close
const SheetPortal = DialogPrimitive.Portal

const sheetOverlayVariants = cva(
  'fixed inset-0 z-50 bg-[rgba(20,14,8,0.45)] backdrop-blur-xs data-[state=open]:animate-hf-pop',
)

const sheetVariants = cva(
  'fixed z-50 bg-paper border-line p-8 overflow-y-auto transition-transform focus:outline-none',
  {
    variants: {
      side: {
        left: 'top-0 bottom-0 left-0 w-[min(420px,88vw)] border-r data-[state=open]:animate-hf-slide',
        right: 'top-0 bottom-0 right-0 w-[min(420px,88vw)] border-l data-[state=open]:animate-hf-slide',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
)

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  showCloseButton?: boolean
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, showCloseButton = true, ...props }, ref) => (
  <SheetPortal>
    <DialogPrimitive.Overlay className={sheetOverlayVariants()} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          className="absolute top-4 right-4 grid size-10 place-items-center rounded-full border border-line text-fg bg-transparent hover:bg-surface-2 transition-colors cursor-pointer font-mono text-sm leading-none"
          aria-label="Yopish"
        >
          ✕
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = 'SheetContent'

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-2 mb-6', className)} {...props} />
}

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('font-serif text-2xl font-semibold text-fg', className)}
    {...props}
  />
))
SheetTitle.displayName = 'SheetTitle'

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('font-sans text-sm text-muted', className)}
    {...props}
  />
))
SheetDescription.displayName = 'SheetDescription'

export {
  Sheet,
  SheetPortal,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
}

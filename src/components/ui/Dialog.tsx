'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const dialogOverlayVariants = cva(
  'fixed inset-0 z-50 bg-[rgba(20,14,8,0.45)] backdrop-blur-xs data-[state=open]:animate-hf-pop',
)

const dialogContentVariants = cva('z-50 focus:outline-none', {
  variants: {
    variant: {
      center:
        'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(480px,92vw)] bg-card border border-line rounded-[12px] p-7 shadow-[0_24px_60px_var(--shadow)] data-[state=open]:animate-hf-pop',
      right:
        'fixed right-0 top-0 bottom-0 w-[min(560px,100vw)] bg-paper border-l border-line p-10 overflow-auto data-[state=open]:animate-hf-slide',
      full: 'fixed inset-0 bg-[rgba(15,10,6,0.88)] p-6 overflow-auto flex flex-col justify-center items-center',
    },
  },
  defaultVariants: {
    variant: 'center',
  },
})

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  showCloseButton?: boolean
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, variant = 'center', showCloseButton = true, ...props }, ref) => (
  <DialogPortal>
    <DialogPrimitive.Overlay className={dialogOverlayVariants()} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ variant }), className)}
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
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-2 mb-5', className)} {...props} />
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6', className)}
      {...props}
    />
  )
}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('font-serif text-2xl font-semibold leading-tight text-fg', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('font-sans text-sm text-muted leading-relaxed', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

const DialogOverlay = DialogPrimitive.Overlay

import React from 'react'
import type { Media } from '@/payload-types'
import { MediaImage } from './MediaImage'
import { cn } from '@/lib/cn'

export interface PlateFrameProps {
  media?: Media | number | string | null
  label?: string
  alt?: string
  height?: number | string
  aspect?: string
  inset?: 8 | 10 | 12 | number
  caption?: string
  priority?: boolean
  sizes?: string
  className?: string
  innerClassName?: string
  children?: React.ReactNode
}

export function PlateFrame({
  media,
  label,
  alt,
  height,
  aspect,
  inset = 10,
  caption,
  priority = false,
  sizes,
  className,
  innerClassName,
  children,
}: PlateFrameProps) {
  const hasImage = Boolean(media && (typeof media === 'string' || (typeof media === 'object' && media.url)))

  return (
    <div className={cn('flex flex-col', className)}>
      <div
        className="border border-line bg-card relative w-full"
        style={{
          padding: `${inset}px`,
          height: height ?? undefined,
          aspectRatio: aspect ?? undefined,
        }}
      >
        <div
          className={cn(
            'size-full border border-line bg-hatch relative overflow-hidden grid place-items-center',
            innerClassName,
          )}
        >
          {hasImage ? (
            <MediaImage
              media={media}
              alt={alt || caption || label}
              fill
              priority={priority}
              sizes={sizes}
            />
          ) : children ? (
            children
          ) : label ? (
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted bg-card border border-border px-3 py-2 text-center whitespace-pre-line leading-relaxed max-w-[85%] select-none">
              {label}
            </span>
          ) : null}
        </div>
      </div>
      {caption && (
        <p className="font-serif italic text-[14px] text-muted pt-3 px-1 m-0 leading-normal">
          {caption}
        </p>
      )}
    </div>
  )
}

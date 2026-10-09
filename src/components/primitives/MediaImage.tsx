import React from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/cn'

export interface MediaImageProps {
  media?: Media | number | string | null
  alt?: string
  fill?: boolean
  priority?: boolean
  sizes?: string
  className?: string
  style?: React.CSSProperties
  width?: number
  height?: number
}

export function MediaImage({
  media,
  alt: customAlt,
  fill = false,
  priority = false,
  sizes,
  className,
  style,
  width,
  height,
}: MediaImageProps) {
  if (!media) return null

  // If media is a string URL
  if (typeof media === 'string') {
    return (
      <Image
        src={media}
        alt={customAlt || ''}
        fill={fill}
        width={fill ? undefined : width || 800}
        height={fill ? undefined : height || 600}
        priority={priority}
        sizes={sizes}
        unoptimized
        className={cn('object-cover', className)}
        style={style}
      />
    )
  }

  // If media is an ID number without doc
  if (typeof media === 'number') {
    return null
  }

  const src = media.url
  if (!src) return null

  const altText = customAlt || media.alt || ''

  const focalStyle: React.CSSProperties =
    media.focalX !== undefined &&
    media.focalX !== null &&
    media.focalY !== undefined &&
    media.focalY !== null
      ? {
          objectPosition: `${media.focalX * 100}% ${media.focalY * 100}%`,
          ...style,
        }
      : style || {}

  const w = width || media.width || 800
  const h = height || media.height || 600

  return (
    <Image
      src={src}
      alt={altText}
      fill={fill}
      width={fill ? undefined : w}
      height={fill ? undefined : h}
      priority={priority}
      sizes={sizes}
      unoptimized
      className={cn('object-cover', className)}
      style={focalStyle}
    />
  )
}

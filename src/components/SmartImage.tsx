'use client'

import React, { useState, useEffect } from 'react'
import Image, { type ImageProps } from 'next/image'
import { DEFAULT_COVER } from '@/lib/resolve-cover-image'

export function SmartImage({ src, alt, unoptimized, ...rest }: ImageProps) {
  const sanitizeSrc = (inputSrc: ImageProps['src']): ImageProps['src'] => {
    if (typeof inputSrc === 'string') {
      const trimmed = inputSrc.trim()
      return trimmed.length > 0 ? trimmed : DEFAULT_COVER
    }
    return inputSrc || DEFAULT_COVER
  }

  const [currentSrc, setCurrentSrc] = useState<ImageProps['src']>(sanitizeSrc(src))
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setCurrentSrc(sanitizeSrc(src))
    setHasError(false)
  }, [src])

  const isDataUrl = typeof currentSrc === 'string' && currentSrc.startsWith('data:')
  const isSvg = typeof currentSrc === 'string' && currentSrc.split('?')[0]?.endsWith('.svg')
  const shouldBeUnoptimized = Boolean(unoptimized || isDataUrl || isSvg)

  if (hasError) {
    return (
      <div
        className={`bg-surface-2 flex items-center justify-center text-muted select-none ${
          rest.className || ''
        }`}
        style={rest.fill ? { width: '100%', height: '100%' } : { width: rest.width, height: rest.height }}
      >
        <span className="font-mono text-[10px] opacity-60">HISINF</span>
      </div>
    )
  }

  return (
    <Image
      {...rest}
      src={currentSrc}
      alt={alt || 'HISINF'}
      unoptimized={shouldBeUnoptimized}
      onError={() => {
        if (currentSrc !== DEFAULT_COVER) {
          setCurrentSrc(DEFAULT_COVER)
        } else {
          setHasError(true)
        }
      }}
    />
  )
}

'use client'

import React, { useState } from 'react'
import Image, { type ImageProps } from 'next/image'
import { DEFAULT_COVER } from '@/lib/resolve-cover-image'

export function SmartImage({ src, alt, ...rest }: ImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)

  return (
    <Image
      {...rest}
      src={currentSrc}
      alt={alt || 'HISINF'}
      onError={() => {
        if (currentSrc !== DEFAULT_COVER) {
          setCurrentSrc(DEFAULT_COVER)
        }
      }}
    />
  )
}

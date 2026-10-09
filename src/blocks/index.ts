import { QuoteBlock } from './Quote'
import { FootnoteBlock } from './Footnote'
import { SourceBlock } from './Source'
import { GalleryBlock } from './Gallery'
import { CalloutBlock } from './Callout'
import { DocumentEmbedBlock } from './DocumentEmbed'
import { YouTubeBlock } from './YouTube'
import { PersonCardBlock } from './PersonCard'
import { EventsTimelineBlock } from './EventsTimeline'
import { MapEmbedBlock } from './MapEmbed'
import { ArchiveItemBlock } from './ArchiveItem'

export {
  QuoteBlock,
  FootnoteBlock,
  SourceBlock,
  GalleryBlock,
  CalloutBlock,
  DocumentEmbedBlock,
  YouTubeBlock,
  PersonCardBlock,
  EventsTimelineBlock,
  MapEmbedBlock,
  ArchiveItemBlock,
}

export const postBlocks = [
  QuoteBlock,
  SourceBlock,
  GalleryBlock,
  CalloutBlock,
  DocumentEmbedBlock,
  YouTubeBlock,
  PersonCardBlock,
  EventsTimelineBlock,
  MapEmbedBlock,
  ArchiveItemBlock,
]

export const inlineBlocks = [FootnoteBlock]

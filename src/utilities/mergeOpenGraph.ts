import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'An independent birdwatching journal about birds, habitats and patient observation.',
  images: [
    {
      url: `${getServerSideURL()}/birds/heron.jpg`,
    },
  ],
  siteName: 'Field Notes',
  title: 'Field Notes',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}

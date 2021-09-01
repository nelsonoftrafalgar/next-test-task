export interface IArticles {
  uuid: string
  link: string
  date: string
  headline: string
  teaser_title: string | null
  teaser_text: string | null
  leadin: string
  authors: string[]
  updated: string | null
  video_teaser: string | null
  category: {
    name: string
    id: string
    slug: string
  }
  images: {
    preview: string
    thumbnail: string
  }
  flags: string[]
  locked: boolean
  lock: string
  tags: {
    uuid: string
    type: string
    name: string
    slug: string
  }[]
  absolute_url: string
  embedded_event_id: string | null
  tag: string | null
}

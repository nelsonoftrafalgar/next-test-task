export interface IDataItem {
  uuid: string
  link: string
  date: string
  headline: string | null
  teaser_title: string | null
  teaser_text: string | null
  leadin: string | null
  authors: string[] | null
  updated: string | null
  video_teaser: string | null
  category: {
    name: string
    id: string
    slug: string
  }
  images: {
    preview: string | null
    thumbnail: string | null
  }
  flags: string[]
  locked: boolean
  lock: string
  tags: ITag[]
  absolute_url: string
  embedded_event_id: string | null
  tag: string | null
}

export interface ITag {
  uuid: string
  type: string
  name: string
  slug: string
}

export interface IInfiniteScrollData {
  articles: IDataItem[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface ISingleArticle {
  body: {
    type: 'headline' | 'x-im/image' | 'preamble' | 'body'
    content?: string
    url?: string
  }[]
}

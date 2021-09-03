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

export interface ICategoriesData {
  news: IDataItem[]
  investor: IDataItem[]
}

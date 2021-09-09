import { IDataItem } from 'api/articles/types'

export const filterByTag = (data: IDataItem[], tag: string) =>
  data.filter(({ tags }) =>
    !tag ? true : tags.find(({ name }) => name === tag)
  )

import { IDataItem, ITag } from 'api/articles/types'

export const extractTags = (acc: ITag[], val: IDataItem) => [
  ...acc,
  ...val.tags,
]

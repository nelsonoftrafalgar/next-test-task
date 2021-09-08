import { IDataItem, ISingleArticle } from './types'

import axios from 'axios'

export const getInitialArticles = async () => {
  const { data } = await axios.get<{ articles: IDataItem[] }>(
    'https://listapi.aripaev.ee/v1/category?categories=cm&exclude_categories=static&exclude_uuids=&limit=6&page=1',
    {
      headers: {
        'X-Channel-Id': 'laanevirumaa',
      },
    }
  )
  return data
}

export const getSingleArticle = async (url: string) => {
  const { data } = await axios.get<ISingleArticle>(
    `https://frontcontentapi.aripaev.ee/v2/article?url=${url}&body=1`,
    {
      headers: {
        'X-Url': url,
        'X-Channel-Id': 'laanevirumaa',
      },
    }
  )
  return data
}

import { IDataItem } from './types'
import axios from 'axios'

export const getInitialArticles = async () => {
  try {
    const { data } = await axios.get<IDataItem[]>(
      'https://listapi.aripaev.ee/v1/category/news?channel_id=aripaev'
    )
    return data
  } catch (error) {
    console.log(error)
  }
}

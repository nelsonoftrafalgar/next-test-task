import axios from 'axios'

export const getArticles = async () => {
  try {
    const response = await axios.get(
      'https://listapi.aripaev.ee/v1/category/news?channel_id=aripaev'
    )
    return response.data
  } catch (error) {
    console.log(error)
  }
}

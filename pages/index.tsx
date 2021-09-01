import useSWR, { SWRConfig } from 'swr'

import { FC } from 'react'
import { IArticles } from 'api/articles/types'
import { getArticles } from 'api/articles'

interface IHomeProps {
  fallback: {
    [key: string]: IArticles
  }
}

const Articles = () => {
  const { data } = useSWR('/api/articles', getArticles)
  return <pre>{JSON.stringify(data, undefined, 2)}</pre>
}

const Home: FC<IHomeProps> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Articles />
    </SWRConfig>
  )
}

export default Home

export async function getStaticProps() {
  const articles = await getArticles()
  return {
    props: {
      fallback: {
        '/api/articles': articles,
      },
    },
  }
}

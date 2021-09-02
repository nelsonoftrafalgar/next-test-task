import Articles from 'components/Articles'
import { FC } from 'react'
import { IArticles } from 'api/articles/types'
import { SWRConfig } from 'swr'
import { getArticles } from 'api/articles'

interface IProps {
  fallback: {
    [key: string]: IArticles[]
  }
}

const Home: FC<IProps> = ({ fallback }) => {
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

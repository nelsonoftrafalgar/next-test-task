import Articles from 'components/Articles'
import { FC } from 'react'
import { IDataItem } from 'api/articles/types'
import { SWRConfig } from 'swr'
import { getInitialArticles } from 'api/articles'

interface IProps {
  fallback: {
    [key: string]: IDataItem[]
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
  const articles = await getInitialArticles()
  return {
    props: {
      fallback: {
        '/api/articles': articles,
      },
    },
  }
}

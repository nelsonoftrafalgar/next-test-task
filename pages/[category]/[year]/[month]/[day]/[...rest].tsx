import Article from 'components/Article'
import { getSingleArticle } from 'api/articles'
import { useRouter } from 'next/dist/client/router'
import useSWR from 'swr'

const DynamicArticle = () => {
  const router = useRouter()

  const { data } = useSWR(router.isReady ? router.asPath : null, () =>
    getSingleArticle(router.asPath.slice(1))
  )
  if (!data) return <p>Loading...</p>

  return <Article article={data} />
}

export default DynamicArticle

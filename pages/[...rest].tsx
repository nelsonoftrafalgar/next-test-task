import { useRouter } from 'next/dist/client/router'

const DynamicArticle = () => {
  const router = useRouter()
  return <p>hello from dynamic article {router.isReady && router.asPath}</p>
}

export default DynamicArticle

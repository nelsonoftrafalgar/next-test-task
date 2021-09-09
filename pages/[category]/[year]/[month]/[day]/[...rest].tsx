import Image from 'next/image'
import { getSingleArticle } from 'api/articles'
import { useRouter } from 'next/dist/client/router'
import useSWR from 'swr'

const DynamicArticle = () => {
  const router = useRouter()
  const { data } = useSWR(router.isReady ? router.asPath : null, () =>
    getSingleArticle(router.asPath.slice(1))
  )

  if (!data) return <p>Loading...</p>

  return (
    <div className='w-75 pt-4'>
      {data.body.map((item, idx) => {
        switch (item.type) {
          case 'headline':
            return (
              <h3 key={idx} className='fw-bold my-3'>
                {item.content}
              </h3>
            )
          case 'x-im/image':
            return (
              <div key={idx} className='article-image-container my-3'>
                <Image
                  src={item.url || 'https://via.placeholder.com/150'}
                  alt=''
                  layout='fill'
                  className='image'
                />
              </div>
            )
          case 'body':
            return (
              <div
                key={idx}
                className='my-3'
                dangerouslySetInnerHTML={{ __html: item.content! }}
              />
            )
          case 'preamble':
            return (
              <p key={idx} className='my-3'>
                {item.content}
              </p>
            )
          default:
            return null
        }
      })}
    </div>
  )
}

export default DynamicArticle

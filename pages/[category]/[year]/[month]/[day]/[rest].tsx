import { FC, useEffect } from 'react'
import { buildErrorLogData, buildLogData } from 'utils/buildLogData'

import { AxiosError } from 'axios'
import { GetServerSideProps } from 'next'
import { ISingleArticle } from 'api/articles/types'
import Image from 'next/image'
import { buildClientLogData } from 'utils/buildLogData'
import { getSingleArticle } from 'api/articles'
import { logger } from 'services/logger'
import { useRouter } from 'next/router'
import useSWR from 'swr'

// import { winstonLogger } from 'services/winston'

interface IProps {
  article?: ISingleArticle
}

const DynamicArticle: FC<IProps> = ({ article }) => {
  const { asPath } = useRouter()
  const { data } = useSWR(!article ? asPath.slice(1) : null, getSingleArticle, {
    revalidateOnFocus: false,
  })

  useEffect(() => {
    if (data) {
      const logClientData = async () =>
        await logger(JSON.stringify(buildClientLogData(data)))
      logClientData()
    }
  }, [data])

  const clientSideData = article || data?.data

  if (!clientSideData) return <p>Loading...</p>

  return (
    <div className='w-75 pt-4'>
      {clientSideData.body.map((item, idx) => {
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
                  loading='eager'
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const path = Object.values(query).join('/')
  if (req.headers['sec-fetch-site'] === 'same-origin') {
    return {
      props: {
        article: null,
      },
    }
  }

  try {
    const apiResponse = await getSingleArticle(path)
    const logData = buildLogData(apiResponse, req)
    await logger(JSON.stringify(logData))

    return {
      props: {
        article: apiResponse.data,
      },
    }
  } catch (error) {
    const errorLogData = buildErrorLogData(error as AxiosError, req)
    await logger(JSON.stringify(errorLogData))

    return {
      notFound: true,
    }
  }
}

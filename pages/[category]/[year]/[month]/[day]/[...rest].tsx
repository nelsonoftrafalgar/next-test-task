import { FC } from 'react'
import { GetServerSideProps } from 'next'
import { ISingleArticle } from 'api/articles/types'
import Image from 'next/image'
import { buildLogData } from 'utils/buildLogData'
import { getSingleArticle } from 'api/articles'
import { logger } from 'services/logger'

// import { winstonLogger } from 'services/winston'

interface IProps {
  article: ISingleArticle
}

const DynamicArticle: FC<IProps> = ({ article }) => {
  if (!article) return <p>Loading...</p>

  return (
    <div className='w-75 pt-4'>
      {article.body.map((item, idx) => {
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
  resolvedUrl,
}) => {
  const apiResponse = await getSingleArticle(resolvedUrl.slice(1))
  const logData = buildLogData(apiResponse, req)
  await logger(JSON.stringify(logData))

  // winstonLogger.info('DynamicArticle getServerSideProps info')

  return {
    props: {
      article: apiResponse.data,
    },
  }
}

import React, { FC } from 'react'
import { getInitialArticles, getSingleArticle } from 'api/articles'

import { GetStaticProps } from 'next'
import { ISingleArticle } from 'api/articles/types'
import Image from 'next/image'

interface IProps {
  article: ISingleArticle
}

const Article: FC<IProps> = ({ article }) => {
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

export default Article

export const getStaticPaths = async () => {
  const { articles } = await getInitialArticles()

  const paths = articles.map((item) => {
    const [category, year, month, day, article] = item.link.split('/')
    return { params: { category, year, month, day, article } }
  })

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const link = Object.values(params!).join('/')
  const article = await getSingleArticle(link)
  return {
    props: {
      article,
    },
  }
}

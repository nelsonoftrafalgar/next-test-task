import React, { FC } from 'react'

import { GetStaticProps } from 'next'
import { IDataItem } from 'api/articles/types'
import Image from 'next/image'
import { getInitialArticles } from 'api/articles'
import { trimmLink } from 'utils/trimmLink'

interface IProps {
  article: IDataItem
}

const Article: FC<IProps> = ({ article }) => {
  return (
    <div className='w-75 pt-4'>
      <a href={article.absolute_url} target='_blank' rel='noopener noreferrer'>
        <div className='articles-image-container'>
          <Image
            src={article.images.preview || 'https://via.placeholder.com/150'}
            alt=''
            layout='fill'
            className='image'
          />
        </div>
        <h3 className='fw-bold my-3'>
          {article.headline || 'Headline placeholder'}
        </h3>
        <p>{article.leadin}</p>
      </a>
    </div>
  )
}

export default Article

export const getStaticPaths = async () => {
  const articles = await getInitialArticles()

  const paths = articles.map((article) => ({
    params: { article: trimmLink(article.link) },
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const articles = await getInitialArticles()
  const article = articles.find(
    (item) => trimmLink(item.link) === params?.article
  )
  return {
    props: {
      article,
    },
  }
}

import { Feed } from 'feed'
import { GetServerSideProps } from 'next'
import { IInfiniteScrollData } from 'api/articles/types'
import axios from 'axios'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  query,
}) => {
  const {
    data: { articles },
  } = await axios.get<IInfiniteScrollData>(
    `https://listapi.aripaev.ee/v1/category?categories=&exclude_categories=static&exclude_uuids=&limit=${
      query.limit || 6
    }&page=1`,
    {
      headers: {
        'X-Channel-Id': 'laanevirumaa',
      },
    }
  )

  const siteURL = process.env.SITE_URL
  const date = new Date()

  const feed = new Feed({
    title: siteURL!,
    link: siteURL,
    description: 'Test description',
    language: 'et-EE',
    id: siteURL!,
    copyright: `All rights reserved ${date.getFullYear()} ${siteURL}`,
    image: `${siteURL}/vercel.svg`,
    favicon: `${siteURL}/favicon.ico`,
  })

  articles.forEach((article) => {
    feed.addItem({
      guid: article.absolute_url,
      title: article.headline || '',
      link: article.absolute_url,
      description: article.headline || '',
      category: [{ name: article.category.name }],
      date: new Date(article.date),
    })
  })

  res.setHeader('content-type', 'text/xml')
  res.write(feed.rss2())
  res.end()

  return {
    props: {},
  }
}

const RssPage = () => null

export default RssPage

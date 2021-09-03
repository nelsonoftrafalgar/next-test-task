import { Col, Container, Row } from 'react-bootstrap'
import { ICategoriesData, IDataItem } from 'api/articles/types'
import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'
import { getInitialArticles } from 'api/articles'
import useSWR from 'swr'

const Articles = () => {
  const [articles, setArticles] = useState<IDataItem[]>([])
  const [hasMore, setHasMore] = useState(true)
  const { data } = useSWR('/api/articles', getInitialArticles)
  const page = useRef(1)

  const getMoreArticles = async () => {
    try {
      const { data } = await axios.get<ICategoriesData>(
        `https://listapi.aripaev.ee/v1/category/grouped?categories=news,investor&channel_id=aripaev&page=${page.current}`
      )

      if (!data.investor.length && !data.news.length) setHasMore(false)

      page.current += 1
      setArticles((articles) => [...articles, ...data.investor, ...data.news])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMoreArticles()
  }, [])

  return (
    <Container>
      <Row>
        {data?.slice(0, 1).map((item) => (
          <Col md={8} key={item.uuid}>
            <div className='articles-image-container'>
              <Image
                src={item.images.preview || 'https://via.placeholder.com/150'}
                alt=''
                layout='fill'
                className='image'
              />
            </div>
            <h3 className='my-3 fw-bold'>
              {item.headline || 'Headline placeholder'}
            </h3>
          </Col>
        ))}
        <Col md={4}>
          <Row>
            {data?.slice(1, 3).map((item) => (
              <Col xs={6} md={12} key={item.uuid}>
                <div className='articles-image-container'>
                  <Image
                    src={
                      item.images.preview || 'https://via.placeholder.com/150'
                    }
                    alt=''
                    layout='fill'
                    className='image'
                  />
                </div>
                <h3 className='article-headline my-3'>
                  {item.headline || 'Headline placeholder'}
                </h3>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <InfiniteScroll
        dataLength={articles.length}
        next={getMoreArticles}
        hasMore={hasMore}
        loader={<h3> Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
      >
        <Row>
          {data?.slice(3).map((item) => (
            <Col
              xs={6}
              md={12}
              key={item.uuid}
              className='d-flex flex-sm-column flex-md-row mb-4'
            >
              <div className='articles-image-container small'>
                <Image
                  src={item.images.preview || 'https://via.placeholder.com/150'}
                  alt=''
                  layout='fill'
                  className='image'
                />
              </div>
              <div>
                <h3 className='my-sm-3 ms-md-3 my-md-0 article-headline'>
                  {item.headline || 'Headline placeholder'}
                </h3>
                <p className='d-sm-none d-md-block ms-3'>{item.leadin}</p>
              </div>
            </Col>
          ))}
          {articles.map((item) => (
            <Col
              xs={6}
              md={12}
              key={item.uuid + page.current}
              className='d-flex flex-sm-column flex-md-row mb-4'
            >
              <div className='articles-image-container small'>
                <Image
                  src={item.images.preview || 'https://via.placeholder.com/150'}
                  alt=''
                  layout='fill'
                  className='image'
                />
              </div>
              <div>
                <h3 className='my-sm-3 ms-md-3 my-md-0 article-headline'>
                  {item.headline || 'Headline placeholder'}
                </h3>
                <p className='d-sm-none d-md-block ms-3'>{item.leadin}</p>
              </div>
            </Col>
          ))}
        </Row>
      </InfiniteScroll>
    </Container>
  )
}

export default Articles

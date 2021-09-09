import { Col, Container, Row } from 'react-bootstrap'

import { IInfiniteScrollData } from 'api/articles/types'
import Image from 'next/image'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'
import axios from 'axios'
import { getInitialArticles } from 'api/articles'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { useState } from 'react'

const Articles = () => {
  const [hasMore, setHasMore] = useState(true)
  const { data: initialData } = useSWR('/api/articles', getInitialArticles)
  const { size, setSize, data } = useSWRInfinite(
    (index: number) => {
      return `https://listapi.aripaev.ee/v1/category?categories=&exclude_categories=static&exclude_uuids=&limit=8&page=${
        index + 1
      }`
    },
    (url: string) =>
      axios
        .get<IInfiniteScrollData>(url, {
          headers: {
            'X-Channel-Id': 'laanevirumaa',
          },
        })
        .then(({ data }) => {
          if (data.meta.current_page === data.meta.last_page) setHasMore(false)
          return data.articles
        })
  )

  const infiniteData = data?.reduce((acc, val) => [...acc, ...val], []) || []
  const handleNext = () => {
    setSize && size && setSize(size + 1)
  }

  return (
    <Container className='pt-3'>
      <Row>
        {initialData?.articles?.slice(0, 1).map((item) => (
          <Col md={8} key={item.uuid}>
            <Link href={item.link}>
              <a>
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
                <h3 className='my-3 fw-bold'>
                  {item.headline || 'Headline placeholder'}
                </h3>
              </a>
            </Link>
          </Col>
        ))}
        <Col md={4}>
          <Row>
            {initialData?.articles?.slice(1, 3).map((item) => (
              <Col xs={6} md={12} key={item.uuid}>
                <Link href={item.link}>
                  <a>
                    <div className='articles-image-container'>
                      <Image
                        src={
                          item.images.preview ||
                          'https://via.placeholder.com/150'
                        }
                        alt=''
                        layout='fill'
                        className='image'
                      />
                    </div>
                    <h3 className='article-headline my-3'>
                      {item.headline || 'Headline placeholder'}
                    </h3>
                  </a>
                </Link>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <InfiniteScroll
        dataLength={infiniteData.length}
        next={handleNext}
        hasMore={hasMore}
        loader={<h3> Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
        className='articles-infinite-scroll-container'
      >
        <Row>
          {initialData?.articles?.slice(3).map((item) => (
            <Col xs={6} md={12} key={item.uuid} className='mb-4'>
              <Link href={item.link}>
                <a className='d-flex flex-sm-column flex-md-row'>
                  <div className='articles-image-container small'>
                    <Image
                      src={
                        item.images.preview || 'https://via.placeholder.com/150'
                      }
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
                </a>
              </Link>
            </Col>
          ))}
          {infiniteData.map((item) => (
            <Col
              xs={6}
              md={12}
              key={item.uuid}
              className='d-flex flex-sm-column flex-md-row mb-4'
            >
              <Link href='/[...rest]' as={item.link}>
                <a className='d-flex flex-sm-column flex-md-row'>
                  <div className='articles-image-container small'>
                    <Image
                      src={
                        item.images.preview || 'https://via.placeholder.com/150'
                      }
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
                </a>
              </Link>
            </Col>
          ))}
        </Row>
      </InfiniteScroll>
    </Container>
  )
}

export default Articles
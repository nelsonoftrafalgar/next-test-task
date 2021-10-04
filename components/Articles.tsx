import { Col, Container, Row } from 'react-bootstrap'

import ArticlesMenu from './ArticlesMenu'
import { IInfiniteScrollData } from 'api/articles/types'
import Image from 'next/image'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'
import axios from 'axios'
import { filterByTag } from 'utils/filterByTag'
import { getInitialArticles } from 'api/articles'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { useState } from 'react'

const Articles = () => {
  const [selectedTag, setSelectedTag] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const { data: initialData } = useSWR('/api/articles', getInitialArticles, {
    revalidateOnFocus: false,
  })
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
        }),
    { revalidateOnFocus: false }
  )

  const infiniteData = data?.reduce((acc, val) => [...acc, ...val], []) || []
  const filteredInitialData = filterByTag(initialData!.articles, selectedTag)
  const filteredInfiniteData = filterByTag(infiniteData, selectedTag)
  const path = '/[category]/[year]/[month]/[day]/[rest]'

  return (
    <>
      <ArticlesMenu
        initialData={initialData!.articles}
        infiniteData={infiniteData}
        setSelectedTag={setSelectedTag}
        selectedTag={selectedTag}
      />
      <Container className='pt-5'>
        <Row className='pt-5'>
          {filteredInitialData
            .slice(0, 1)
            .map(({ uuid, link, images, headline }) => (
              <Col md={8} key={uuid}>
                <Link href={path} as={link}>
                  <a>
                    <div className='articles-image-container'>
                      <Image
                        src={
                          images.preview || 'https://via.placeholder.com/150'
                        }
                        alt=''
                        layout='fill'
                        className='image'
                        loading='eager'
                      />
                    </div>
                    <h3 className='my-3 fw-bold'>
                      {headline || 'Headline placeholder'}
                    </h3>
                  </a>
                </Link>
              </Col>
            ))}
          <Col md={4}>
            <Row>
              {filteredInitialData
                .slice(1, 3)
                .map(({ uuid, link, images, headline }) => (
                  <Col xs={6} md={12} key={uuid}>
                    <Link href={path} as={link}>
                      <a>
                        <div className='articles-image-container'>
                          <Image
                            src={
                              images.preview ||
                              'https://via.placeholder.com/150'
                            }
                            alt=''
                            layout='fill'
                            className='image'
                            loading='eager'
                          />
                        </div>
                        <h3 className='article-headline my-3'>
                          {headline || 'Headline placeholder'}
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
          next={() => setSize && size && setSize(size + 1)}
          hasMore={!selectedTag && hasMore}
          loader={<h3>Loading...</h3>}
          endMessage={
            <h4>
              {selectedTag
                ? 'Reset tag filter to load more data'
                : 'Nothing more to show'}
            </h4>
          }
          className='articles-infinite-scroll-container'
        >
          <Row>
            {filteredInitialData
              .slice(3)
              .map(({ uuid, link, images, headline, leadin }) => (
                <Col xs={6} md={12} key={uuid} className='mb-4'>
                  <Link href={path} as={link}>
                    <a className='d-flex flex-column flex-md-row'>
                      <div className='articles-image-container small'>
                        <Image
                          src={
                            images.preview || 'https://via.placeholder.com/150'
                          }
                          alt=''
                          layout='fill'
                          className='image'
                          loading='eager'
                        />
                      </div>
                      <div>
                        <h3 className='my-sm-3 ms-md-3 my-md-0 article-headline'>
                          {headline || 'Headline placeholder'}
                        </h3>
                        <p className='d-sm-none d-md-block ms-3'>{leadin}</p>
                      </div>
                    </a>
                  </Link>
                </Col>
              ))}
            {filteredInfiniteData.map(
              ({ uuid, link, images, headline, leadin }) => (
                <Col xs={6} md={12} key={uuid} className='mb-4'>
                  <Link href={path} as={link}>
                    <a className='d-flex flex-column flex-md-row'>
                      <div className='articles-image-container small'>
                        <Image
                          src={
                            images.preview || 'https://via.placeholder.com/150'
                          }
                          alt=''
                          layout='fill'
                          className='image'
                        />
                      </div>
                      <div>
                        <h3 className='my-sm-3 ms-md-3 my-md-0 article-headline'>
                          {headline || 'Headline placeholder'}
                        </h3>
                        <p className='d-sm-none d-md-block ms-3'>{leadin}</p>
                      </div>
                    </a>
                  </Link>
                </Col>
              )
            )}
          </Row>
        </InfiniteScroll>
      </Container>
    </>
  )
}

export default Articles

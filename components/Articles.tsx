import { Col, Container, Row } from 'react-bootstrap'

import { IArticles } from 'api/articles/types'
import Image from 'next/image'
import { getArticles } from 'api/articles'
import useSWR from 'swr'

const Articles = () => {
  const { data } = useSWR<IArticles[]>('/api/articles', getArticles)
  // return <pre>{JSON.stringify(data, undefined, 2)}</pre>
  return (
    <Container>
      <Row>
        {data?.slice(0, 1).map((item) => (
          <Col md={8} key={item.uuid}>
            <div className='articles-image-container'>
              <Image
                src={item.images.preview}
                alt=''
                layout='fill'
                className='image'
              />
            </div>
            <h3 className='my-3 fw-bold'>{item.headline}</h3>
          </Col>
        ))}
        <Col md={4}>
          <Row>
            {data?.slice(1, 3).map((item) => (
              <Col xs={6} md={12} key={item.uuid}>
                <div className='articles-image-container'>
                  <Image
                    src={item.images.preview}
                    alt=''
                    layout='fill'
                    className='image'
                  />
                </div>
                <h3 className='article-headline my-3'>{item.headline}</h3>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
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
                src={item.images.preview}
                alt=''
                layout='fill'
                className='image'
              />
            </div>
            <div>
              <h3 className='my-sm-3 ms-md-3 my-md-0 article-headline'>
                {item.headline}
              </h3>
              <p className='d-sm-none d-md-block ms-3'>{item.leadin}</p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default Articles

import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { IDataItem, ITag } from 'api/articles/types'

import classnames from 'classnames'
import { extractTags } from 'utils/extractTags'

interface IProps {
  infiniteData: IDataItem[]
  initialData: IDataItem[]
  setSelectedTag: Dispatch<SetStateAction<string>>
  selectedTag: string
}

const ArticlesMenu: FC<IProps> = ({
  infiniteData,
  initialData,
  setSelectedTag,
  selectedTag,
}) => {
  const tagsRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const tagsFromInfiniteData = infiniteData.reduce<ITag[]>(extractTags, [])
  const tagsFromInitialData = initialData.reduce<ITag[]>(extractTags, [])
  const tags = [...tagsFromInitialData, ...tagsFromInfiniteData].reduce<ITag[]>(
    (acc, val) =>
      val.type === 'subscription-tag' &&
      !acc.find((item) => item.name === val.name)
        ? [...acc, val]
        : acc,
    []
  )

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        !toggleRef.current?.contains(e.target as Node) &&
        !tagsRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [isOpen])

  return (
    <nav className='articles-menu'>
      <div className='articles-menu-buttons'>
        <button
          ref={toggleRef}
          onClick={() => setIsOpen(!isOpen)}
          className={classnames('articles-menu-toggle', { active: isOpen })}
        >
          Tags
        </button>
        <button
          onClick={() => setSelectedTag('')}
          className='article-tag reset'
        >
          Reset tag filter
        </button>
      </div>
      <div
        ref={tagsRef}
        className={classnames('articles-menu-tags', { 'is-open': isOpen })}
      >
        {tags.map(({ name, uuid }) => (
          <button
            onClick={() =>
              selectedTag === name ? setSelectedTag('') : setSelectedTag(name)
            }
            className={classnames('article-tag', {
              active: selectedTag === name,
            })}
            key={uuid}
          >
            {name}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default ArticlesMenu

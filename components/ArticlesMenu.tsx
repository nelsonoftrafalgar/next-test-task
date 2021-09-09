import { IDataItem, ITag } from 'api/articles/types'
import React, { Dispatch, FC, SetStateAction } from 'react'

import { extractTags } from 'utils/extractTags'

interface IProps {
  infiniteData: IDataItem[]
  initialData: IDataItem[]
  setSelectedTag: Dispatch<SetStateAction<string>>
}

const ArticlesMenu: FC<IProps> = ({
  infiniteData,
  initialData,
  setSelectedTag,
}) => {
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

  return (
    <nav className='articles-menu'>
      <select
        onChange={(e) => setSelectedTag(e.currentTarget.value)}
        className='articles-menu-select'
      >
        <option value=''>Filter by subscription tag</option>
        {tags.map(({ name, uuid }) => (
          <option key={uuid} value={name}>
            {name}
          </option>
        ))}
      </select>
    </nav>
  )
}

export default ArticlesMenu

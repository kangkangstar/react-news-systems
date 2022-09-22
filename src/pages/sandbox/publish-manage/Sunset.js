import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
import { Button } from 'antd'

export default function Sunset() {
    // 3 === 已下线的，调用自己hooks的方法
    const { dataSource, handleDelete } = usePublish(3)

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={() => handleDelete(id)}>删除</Button>} ></NewsPublish>
        </div>

    )
}

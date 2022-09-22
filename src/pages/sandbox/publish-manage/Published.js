import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
import { Button } from 'antd'

export default function Unpublished() {
    // 2 === 已发布的
    const { dataSource, handleSunset } = usePublish(2)

    return (
        // 按钮借助props以属性形式传给子组件去渲染
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={() => handleSunset(id)}>下线</Button>}></NewsPublish>
        </div>

    )
}

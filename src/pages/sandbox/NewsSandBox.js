import React, { useEffect } from 'react'
// 引入组件
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
// 引入单独封装的路由
import NewsRouter from '../../components/sandbox/NewsRouter'
import NProgress from 'nprogress'
// css
import './NewsSandBox.css'
import 'nprogress/nprogress.css'

// 引入antd
import { Layout } from 'antd'
const { Content } = Layout

export default function NewsSandBox() {
    // 进度条开始
    NProgress.start();

    useEffect(() => {
        // 进度条结束
        NProgress.done();
    })

    return (
        <Layout >
            {/* 一般组件 */}
            <SideMenu></SideMenu>
            <Layout className="site-layout">
                {/* 头部 */}
                <TopHeader style={{ padding: '0 16px' }}></TopHeader>
                {/* 内容区 */}
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: 'auto'
                    }}>
                    {/* 导入封装好的路由 */}
                    <NewsRouter></NewsRouter>
                </Content>
            </Layout>
        </Layout>
    )
}
import React, { useState } from 'react'
// 引入一般组件
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
// 引入单独封装的路由组件
import NewsRouter from '../../components/sandbox/NewsRouter'
// css
import './NewsSandBox.css'

// 引入antd
import { Layout } from 'antd'
import { ConfigProvider } from 'antd'
import enUS from 'antd/es/locale/en_US'
import moment from 'moment'
const { Content } = Layout

export default function NewsSandBox() {
    // 侧边栏如果再用路由懒加载，会出现抖动问题
    // const SideMenu = lazy(() => import('../../components/sandbox/SideMenu'));

    // const TopHeader = lazy(() => import('../../components/sandbox/TopHeader'));
    // 默认是英文
    const [locale, setLocal] = useState(enUS);

    // 改变语言的回调
    const changeLocale = (e) => {
        // 获取并保存现在的值
        const localeValue = e.target.value;
        setLocal(localeValue);
        // console.log(localeValue);

        if (!localeValue) {
            moment.locale('en');
        } else {
            moment.locale('zh-cn');
        }
    };


    return (
        <ConfigProvider locale={locale}>
            <Layout >
                {/* 一般组件:侧边栏 */}
                <SideMenu></SideMenu>
                <Layout className="site-layout">
                    {/* 一般组件：头部 */}
                    <TopHeader changeLocale={changeLocale} locale={locale}></TopHeader>
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
        </ConfigProvider>
    )
}
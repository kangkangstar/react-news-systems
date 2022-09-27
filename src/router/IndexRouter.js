// 项目路由结构的文件
import React, { Suspense, lazy } from 'react'
import {
    HashRouter, Redirect, Route, Switch
} from 'react-router-dom'
// 一般路由
import Login from '../pages/login/Login'
// import News from '../pages/news/News'
// import Detail from '../pages/news/Detail'
// 单独封装的路由组件
import NewsSandBox from '../pages/sandbox/NewsSandBox'


export default function IndexRouter() {
    const News = lazy(() => import('../pages/news/News'));
    const Detail = lazy(() => import('../pages/news/Detail'));


    // Switch实现路由精准匹配，提高匹配效率
    return (
        <Suspense fallback={<div>loading</div>}>
            <HashRouter>
                <Switch >
                    <Route path='/login' component={Login} />
                    <Route path='/news' component={News} />
                    <Route path='/detail/:id' component={Detail} />
                    {/* 通过三元实现token为真显示，无则重定向到login */}
                    <Route path='/' render={() =>
                        sessionStorage.getItem('token') ?
                            <NewsSandBox></NewsSandBox> :
                            <Redirect to='/login' />} />
                </Switch >
            </HashRouter>
        </Suspense>
    )
}
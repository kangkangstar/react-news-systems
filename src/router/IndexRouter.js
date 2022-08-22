// 项目路由结构的文件
import React from 'react'
import {
    HashRouter, Redirect, Route, Switch
} from 'react-router-dom'
import Login from '../pages/login/Login'
import NewsSandBox from '../pages/sandbox/NewsSandBox'
import News from '../pages/news/News'
import Detail from '../pages/news/Detail'

export default function IndexRouter() {
    // Switch实现路由精准匹配，提高匹配效率
    return (
        <HashRouter>
            <Switch >
                <Route path='/login' component={Login} />
                <Route path='/news' component={News} />
                <Route path='/detail/:id' component={Detail} />
                {/* <Route path='/' component={NewsSandBox} /> */}
                {/* 通过三元实现token为真显示，无则重定向到login */}
                <Route path='/' render={() =>
                    localStorage.getItem('token') ?
                        <NewsSandBox></NewsSandBox> :
                        <Redirect to='/login' />} />
            </Switch >
        </HashRouter>
    )
}
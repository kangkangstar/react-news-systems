// 项目路由结构的文件
import React from 'react'
import {
    HashRouter, Route, Routes
} from 'react-router-dom'
import Login from '../pages/login/Login'
import NewsSandBox from '../pages/sandbox/NewsSandBox'
// import News from '../pages/news/News'
// import Detail from '../pages/news/Detail'
import AuthComponent from "../utils/AuthComponent"
// import UserList from "../pages/sandbox/user-manage/UserList"

export default function IndexRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route path='/login' element={<Login />}></Route>
                {/* <Route path='/user-manage/list' element={<UserList />}></Route> */}
                {/* 路由拦截与重定向 */}
                <Route path='/*' element={<AuthComponent> <NewsSandBox></NewsSandBox> </AuthComponent>}></Route>
            </Routes >
        </HashRouter >
    )
}
//AuthComponent 路由拦截组件的封装
import { Navigate } from 'react-router-dom'

function AuthComponent({ children }) {
    // 获取token,如果有token就加载传递过来的路由组件，没有的话就重定向至login页面
    const islocation = localStorage.getItem('token')
    return islocation ? children : <Navigate to='/login' />
}

export default AuthComponent
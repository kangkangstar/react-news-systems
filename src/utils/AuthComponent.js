//路由拦截组件的封装
import { Navigate } from 'react-router-dom'

function AuthComponent({ children }) {
    const islocation = localStorage.getItem('token')
    return islocation ? children : <Navigate to='/login' />
}

export default AuthComponent
import React from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

// 封装withRouter高阶函数，返回一个新函数
export default function withRouter(Component) {
    return function(props) {
        const push = useNavigate()
        const match = useParams()
        const location = useLocation()

        return <Component {...props} history={push, match, location} />
    }
}
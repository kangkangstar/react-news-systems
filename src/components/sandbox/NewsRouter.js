import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import axios from 'axios'
import Home from '../../pages/sandbox/home/Home'
import UserList from '../../pages/sandbox/user-manage/UserList'
import RoleList from '../../pages/sandbox/right-manage/RoleList'
import RightList from '../../pages/sandbox/right-manage/RightList'
import NoPermission from '../../pages/sandbox/nopermission/NoPermission'
import NewAdd from '../../pages/sandbox/news-manage/NewAdd'
import NewDraft from '../../pages/sandbox/news-manage/NewDraft'
import NewCategory from '../../pages/sandbox/news-manage/NewCategory'
import Audit from '../../pages/sandbox/audit-manage/Audit'
import AuditList from '../../pages/sandbox/audit-manage/AuditList'
import Unpublished from '../../pages/sandbox/publish-manage/Unpublished'
import Published from '../../pages/sandbox/publish-manage/Published'
import Sunset from '../../pages/sandbox/publish-manage/Sunset'
import NewPreview from '../../pages/sandbox/news-manage/NewPreview'
import NewUpdate from '../../pages/sandbox/news-manage/NewUpdate'
import { Spin } from 'antd'
import { connect } from 'react-redux'

// 路由数据
const LocalRouterMap = {
    '/home': Home,
    '/user-manage/list': UserList,
    '/right-manage/role/list': RoleList,
    '/right-manage/right/list': RightList,
    '/news-manage/add': NewAdd,
    '/news-manage/draft': NewDraft,
    "/news-manage/category": NewCategory,
    "/news-manage/preview/:id": NewPreview,
    "/news-manage/update/:id": NewUpdate,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
}

function NewsRouter(props) {
    const [BackRouteList, setBackRouteList] = useState([])

    useEffect(() => {
        // 分别获取后，再做合并，使用Promise.all等结果全都请求成功后一起处理
        Promise.all([
            axios.get('/rights'),
            axios.get('/children')
        ]).then(res => {
            setBackRouteList([...res[0].data, ...res[1].data])
            //console.log(BackRouteList);//异步更新的打印不出来
        })
    }, [])

    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))

    // 检查本地包括此项路由且是可配置
    const checkRoute = (item) => {
        // 本地有路径且 页面权限或路由权限是开的就行
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    // 角色的权限列表包括此项此项
    const checkUserPermission = (item) => {
        return rights.includes(item.key) //从本地存储读取，需要重新登录才能生效
    }

    return (
        <Spin size="large" spinning={props.isLoading}>
            {/* 路由组件 */}
            <Switch>
                {/* 根据角色权限动态渲染路由组件 */}
                {
                    BackRouteList.map(item => {
                        if (checkRoute(item) && checkUserPermission(item)) {
                            return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact />
                        }
                        return null
                    }
                    )
                }
                {/* 精准匹配，/ 自动到home */}
                <Redirect from='/' to='/home' exact />
                {/* 匹配其他路径,返回数据大于0的情况下渲染，如果是空的不渲染 */}
                {
                    BackRouteList.length > 0 && <Route path='*' component={NoPermission} />
                }
            </Switch>
        </Spin>
    )
}

const mapStateToProps = ({ Loading: { isLoading } }) => {
    return {
        isLoading
    }
}


export default connect(mapStateToProps)(NewsRouter)

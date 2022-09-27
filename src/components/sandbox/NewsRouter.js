import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import axios from 'axios'
import Home from '../../pages/sandbox/home/Home'
import NoPermission from '../../pages/sandbox/nopermission/NoPermission'
import { Spin } from 'antd'
import { connect } from 'react-redux'

// 路由懒加载
const LocalRouterMap = {
    '/home': Home,
    '/user-manage/list': lazy(() => import('../../pages/sandbox/user-manage/UserList')),
    '/right-manage/role/list': lazy(() => import('../../pages/sandbox/right-manage/RoleList')),
    '/right-manage/right/list': lazy(() => import('../../pages/sandbox/right-manage/RightList')),
    '/news-manage/add': lazy(() => import('../../pages/sandbox/news-manage/NewAdd')),
    '/news-manage/draft': lazy(() => import('../../pages/sandbox/news-manage/NewDraft')),
    "/news-manage/category": lazy(() => import('../../pages/sandbox/news-manage/NewCategory')),
    "/news-manage/preview/:id": lazy(() => import('../../pages/sandbox/news-manage/NewPreview')),
    "/news-manage/update/:id": lazy(() => import('../../pages/sandbox/news-manage/NewUpdate')),
    "/audit-manage/audit": lazy(() => import('../../pages/sandbox/audit-manage/Audit')),
    "/audit-manage/list": lazy(() => import('../../pages/sandbox/audit-manage/AuditList')),
    "/publish-manage/unpublished": lazy(() => import('../../pages/sandbox/publish-manage/Unpublished')),
    "/publish-manage/published": lazy(() => import('../../pages/sandbox/publish-manage/Published')),
    "/publish-manage/sunset": lazy(() => import('../../pages/sandbox/publish-manage/Sunset')),
}

function NewsRouter(props) {
    // 存储一级和二级分类数据的数据
    const [BackRouteList, setBackRouteList] = useState([])

    // 获取权限及子权限数据并保存
    useEffect(() => {
        // 分别获取后，再做合并，使用Promise.all等结果全都请求成功后一起处理
        Promise.all([
            axios.get('/rights'),
            axios.get('/children')
        ]).then(res => {
            setBackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])

    // 从本地存储解构权限数据
    const { role: { rights } } = JSON.parse(sessionStorage.getItem('token'))

    // 计算出本地路由中有权限且路由权限是开的那部分路由
    const checkRoute = (item) => {
        // 本地有路径且 页面权限或路由权限是开的就行
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    // 本地存储中的权限列表包含的项返回
    const checkUserPermission = (item) => {
        return rights.includes(item.key) //从本地存储读取，需要重新登录才能生效
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            {/* 使用 spin包裹组件，好添加loading效果 */}
            < Spin size="large" spinning={props.isLoading} >
                {/* 路由组件展示位置，使用 switch提高匹配效率 */}
                < Switch >
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
            </Spin >
        </Suspense>
    )
}

const mapStateToProps = ({ Loading: { isLoading } }) => {
    return {
        isLoading
    }
}


export default connect(mapStateToProps)(NewsRouter)

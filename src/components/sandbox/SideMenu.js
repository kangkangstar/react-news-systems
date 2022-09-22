import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    UserOutlined,
    UnorderedListOutlined,
    LockOutlined,
    TeamOutlined,
    SolutionOutlined,
    ReadOutlined,
    FormOutlined,
    DeleteOutlined,
    PieChartOutlined,
    ContainerOutlined,
    CheckSquareOutlined,
    OrderedListOutlined,
    FolderAddOutlined,
    InteractionOutlined,
    UploadOutlined,
    VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import './index.css'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import { connect } from 'react-redux'
import { useTranslation } from "react-i18next";

const { Sider } = Layout;
const { SubMenu } = Menu

// 使用kv形式将路径与图标进行匹配
const iconList = {
    '/home': <HomeOutlined />,
    '/user-manage': <UserOutlined />,
    '/user-manage/list': <UnorderedListOutlined />,
    '/right-manage': <LockOutlined />,
    '/right-manage/role/list': <TeamOutlined />,
    '/right-manage/right/list': <SolutionOutlined />,
    '/news-manage': <ReadOutlined />,
    '/news-manage/add': <FormOutlined />,
    '/news-manage/draft': <DeleteOutlined />,
    '/news-manage/category': <PieChartOutlined />,
    '/audit-manage': <ContainerOutlined />,
    '/audit-manage/audit': <CheckSquareOutlined />,
    '/audit-manage/list': <OrderedListOutlined />,
    '/publish-manage': <FolderAddOutlined />,
    '/publish-manage/unpublished': <InteractionOutlined />,
    '/publish-manage/published': <UploadOutlined />,
    '/publish-manage/sunset': <VerticalAlignBottomOutlined />
}

function SideMenu(props) {
    // 解构函数
    const { t } = useTranslation();
    // 存储导航菜单数据
    const [menu, setMenu] = useState([])
    // 获取菜单数据——用于导航栏展示,每次都新请求
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            // 返回的数组决定了菜单的展示顺序
            const list = res.data
            list.map((item) => {
                // children数据为空，代表只有一级没有二级菜单
                if (item.children?.length === 0) {
                    return item.title = t(`sidemenu.${item.key}`)
                } else {
                    // 不为空代表有二级菜单
                    item.children.map((data) => {
                        return data.title = t(`sidemenu.${data.key}`)
                    })
                    return item.title = t(`sidemenu.${item.key}`)
                }
            })
            setMenu(list)
            localStorage.setItem("rights", JSON.stringify(list))
        })
        // 一定要检测 langname变化，导航区才能根据语言变化
    }, [props.langname, t])

    // 解构token中的字段
    const { role: { rights } } = JSON.parse(sessionStorage.getItem('token'))

    // 是否在侧边栏展示:pagepermisson=1显示，否则不显示,根据不同角色显示不同的权限
    // 存储的时候 key就是url ，刚好用于后面的路由跳转
    const checkPermission = (item) => {
        return item.pagepermisson === 1 && rights.includes(item.key)
    }

    // 菜单渲染函数
    const renderMenu = (menuList) => {
        return menuList.map(item => {
            // 是否有children会决定生成的样式
            //  1、如果有，使用 <SubMenu> 渲染，里面还可以嵌套 <Menu.Item>
            if (item.children?.length > 0 && checkPermission(item)) {
                return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }
            // 2、如果没有，直接使用 <Menu.Item> 渲染
            return checkPermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
                // 路由跳转
                props.history.push(item.key)
            }}>
                {item.title}
            </Menu.Item>
        })
    }
    // selectedKeys：当前选中的菜单项 key 数组
    const selectKeys = [props.location.pathname]
    // defaultOpenKeys：初始展开的 SubMenu 菜单项 key 数组
    const openKeys = ['/' + props.location.pathname.split('/')[1]]

    return (
        <Sider trigger={null} collapsible collapsed={props.isClollapse}>
            <div style={{ display: 'flex', height: '100%', "flexDirection": 'column' }}>
                <div className="logo">{t("sidemenu.title")}</div>
                {/* 设置滚动条 */}
                <div style={{ flex: '1', "overflow": "auto" }}>
                    <Menu theme='dark' mode='inline'
                        selectedKeys={selectKeys}
                        defaultOpenKeys={openKeys}>
                        {renderMenu(menu)}
                    </Menu>
                </div>
            </div>
        </Sider >
    )
}
const mapStateToProps = (props) => {
    const { isClollapse } = props.Collapse
    const { langname } = props.Lang
    return {
        isClollapse,
        langname
    }

}


export default connect(mapStateToProps)(withRouter(SideMenu))

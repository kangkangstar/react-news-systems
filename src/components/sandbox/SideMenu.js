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

const { Sider } = Layout;
const { SubMenu } = Menu

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

    const [menu, setMenu] = useState([])
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            setMenu(res.data)
        })
    }, [])

    // 解构token中的字段
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))

    // 是否在侧边栏展示:pagepermisson=1显示，否则不显示,根据不同角色显示不同的权限
    const checkPermission = (item) => {
        return item.pagepermisson === 1 && rights.includes(item.key)
    }

    const renderMenu = (menuList) => {
        return menuList.map(item => {
            // 是否有children会决定生成的样式，内层使用递归思想，再次调用函数自身
            if (item.children?.length > 0 && checkPermission(item)) {
                return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }
            return checkPermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
                // console.log(props);
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
                <div className="logo">全球新闻发布管理系统</div>
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
const mapStateToProps = ({ Collapse: { isClollapse } }) => {
    return {
        isClollapse
    }
}


export default connect(mapStateToProps)(withRouter(SideMenu))

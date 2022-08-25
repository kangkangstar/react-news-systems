import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
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
import withRouter from '../../utils/withRouter'
import axios from 'axios';
import { connect } from 'react-redux'

const { Sider } = Layout;
const { SubMenu } = Menu

// 图表的列表
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
    // console.log(props);

    const [menu, setMenu] = useState([])
    const navigate = useNavigate()// 获取路由跳转的钩子
    // const history = useLocation() // 获取pathname的钩子

    // 获取权限的子权限列表，方便侧边栏展示
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            setMenu(res.data)
        })
    }, [])

    // 从token中解构当前用户的权限列表数据
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))

    // 是否在侧边栏展示:pagepermisson=1显示，否则不显示,判断当前角色用户的权限,将包含的权限渲染出来
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
                // 重定向的用法    
                navigate(item.key)
            }}>
                {item.title}
            </Menu.Item>
        })
    }
    // selectedKeys：当前选中的菜单项 key 数组---控制高亮，让组件变成受控的，重定向时也能正确高亮
    const selectKeys = [props.history?.pathname]
    console.log('sidemenu', props);
    // defaultOpenKeys：初始展开的 SubMenu 菜单项 key 数组---控制父亲展开
    const openKeys = ['/' + props.history?.pathname.split('/')[1]]

    return (
        <Sider trigger={null} collapsible collapsed={props.isClollapsed}>
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

// 读取redux中的state状态值
const mapStateToProps = (state) => {
    // 解构折叠属性
    const { Collapsed: { isClollapsed } } = state
    return {
        isClollapsed
    }
}

export default connect(mapStateToProps)(withRouter(SideMenu))


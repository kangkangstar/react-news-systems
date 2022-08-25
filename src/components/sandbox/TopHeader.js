import React from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux'
import { useNavigate } from "react-router-dom"
const { Header } = Layout;


function TopHeader(props) {
    // 重定向
    const navigate = useNavigate()

    // 改变头部-左侧图标的折叠还是打开
    const changeCollapsed = () => {
        // 改变state中的isCollapsed
        props.changeCollapsed() //reducer中就可以接收action进行处理
    }

    // 解构token中的字段
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))

    // Dropdown的数据
    const menu = (
        <Menu>
            <Menu.Item key={1}>
                {roleName}
            </Menu.Item>
            <Menu.Item danger key={2} onClick={() => {
                // 移出token
                localStorage.removeItem('token')
                // 重定向至登录页面
                navigate('/login')
            }}>
                退出
            </Menu.Item>
        </Menu>
    );



    return (
        < Header className="site-layout-background"
            style={{ padding: '0px 16px' }} >
            {/*动态渲染展示哪个图标*/}
            {
                props.isClollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }
            {/*右侧欢迎语和头像下拉框*/}
            <div style={{ float: 'right' }}>
                <span>欢迎{username}回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </ Header>

    )
}

// 映射state成props
const mapStateToProps = (state) => {
    const { Collapsed: { isClollapsed } } = state
    return {
        isClollapsed
    }
}

// 映射dispatch成props
const mapDispatchToProps = {
    // 传递一个函数，返回值就是一个action
    changeCollapsed() {
        return {
            type: 'change_collapsed'
        }
    }
}

// 使用connect包装，第一次可以接收2个参数，state和dispatch可以映射成props
export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)


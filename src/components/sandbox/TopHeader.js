import React from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
const { Header } = Layout;


function TopHeader(props) {
    // const [collapsed, setCollapsed] = useState(true)

    // 改变左侧收起图标的样式--collapsed回调
    function changeCollapsed() {
        // 改变state中的isClollapse的状态
        props.changeCollapsed()
    }

    // 解构token中的字段
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))

    const menu = (
        <Menu>
            <Menu.Item>
                {roleName}
            </Menu.Item>
            <Menu.Item danger onClick={() => {
                localStorage.removeItem('token')
                props.history.replace('/login')
            }}>
                退出
            </Menu.Item>
        </Menu>
    );

    return (
        <Header
            className="site-layout-background"
            style={{ padding: '0px 16px' }}
        >
            {
                props.isClollapse ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }
            <div style={{ float: 'right' }}>
                <span>欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>

        </Header>
    )
}

/*  
connect(
    mapStateToProps,
    mapDispatchToProps
    )(UI组件-被包装的组件)
*/

const mapStateToProps = ({ Collapse: { isClollapse } }) => {
    return {
        isClollapse
    }
}

const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: 'change_collapsed'  // action
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))
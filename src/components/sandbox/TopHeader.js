import React from 'react'
import { Layout, Dropdown, Menu, Avatar, Button } from 'antd'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.css'
import { useTranslation } from "react-i18next";
const { Header } = Layout

function TopHeader(props) {

    // 解构函数
    const { t, i18n } = useTranslation();
    // 改变语言的函数
    // 英文
    function handleClick1() {
        // 修改 langname
        props.change_en()
        // 使用新的langname就行修改
        i18n.changeLanguage(props.langname);
    }

    // 中文
    function handleClick2() {
        props.change_de()
        i18n.changeLanguage(props.langname);
    }


    // 改变左侧收起图标的样式--collapsed回调
    function changeCollapsed() {
        // 改变state中的isClollapse的状态
        props.changeCollapsed()
    }

    // 解构token中的字段
    const { role: { roleName }, username } = JSON.parse(sessionStorage.getItem('token'))

    // 下拉框的数据
    const menu = (
        <Menu>
            <Menu.Item>
                {roleName}
            </Menu.Item>
            {/* 退出的时候要清除token,同时路由跳转到 login页面 */}
            <Menu.Item danger onClick={() => {
                sessionStorage.removeItem('token')
                props.history.replace('/login')
            }}>
                {t("topheader.logout")}
            </Menu.Item>
        </Menu>
    );

    return (
        <Header
            className="site-layout-background"
            style={{ padding: '0px 16px' }}
        >
            {/* 左侧折叠图标根据 isClollapse 动态展示*/}
            {
                props.isClollapse ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }
            {/* 右侧展示区 */}
            <div style={{ float: 'right' }}>
                <Button
                    onClick={() => handleClick1()}
                >
                    中文
                </Button>
                <Button
                    onClick={() => handleClick2()}
                >
                    English
                </Button>
                <span>{t("topheader.welcome")} <span style={{ color: '#1890ff' }}>{username}</span>{t("topheader.back")}</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>

        </Header >
    )
}

/*  
connect(
    mapStateToProps,
    mapDispatchToProps
    )(UI组件-被包装的组件)
*/

// 映射props属性到自身
const mapStateToProps = (props) => {
    const { isClollapse } = props.Collapse
    const { langname } = props.Lang
    return {
        isClollapse,
        langname
    }

}

// 映射dispatch
const mapDispatchToProps = {
    // 改变折叠属性的dispatch
    changeCollapsed() {
        return {
            type: 'change_collapsed'  // action
        }
    },
    // 改变语言的dispatch
    change_de() {
        return {
            type: 'change_de'
        }
    },
    change_en() {
        return {
            type: 'change_en'
        }
    }

}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))

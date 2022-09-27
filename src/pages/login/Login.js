import React, { useCallback } from 'react'
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './login.css'
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import particlesOptions from "./particles.json";
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { connect } from 'react-redux'

function Login(props) {
    // 解构国际化需要的函数
    const { t, i18n } = useTranslation();

    // 粒子效果初始值的回调
    const particlesInit = useCallback(main => {
        loadFull(main);
    }, [])


    // 收集表单数据---点击登录的时候请求home页的数据
    const onFinish = (values) => {
        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
            if (res.data.length === 0) {
                message.error("用户名或密码不匹配")
            } else {
                // 将用户信息存储到本地后跳转到home页
                sessionStorage.setItem("token", JSON.stringify(res.data[0]))
                props.history.push("/")
            }
        })
        // 浏览最多
        axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
            sessionStorage.setItem("newssort", JSON.stringify(res.data));
        })
        // 点赞最多
        axios.get(`/news?publishState=2&_expand=category&_sort=start&_order=desc&_limit=6`).then(res => {
            sessionStorage.setItem("newsstart", JSON.stringify(res.data));
        })
    }

    // 改变语言的函数
    // 英文
    function handleClick1() {
        // props.langname = 'en'
        // 修改 langname
        props.change_en()
        // 使用新的langname进行修改
        i18n.changeLanguage(props.langname);
    }

    // 中文
    function handleClick2() {
        props.change_de()
        i18n.changeLanguage(props.langname);
    }

    return (
        <div style={{ backgroundColor: 'rgb(35,39,65)', height: '100%', overflow: 'hidden' }}>
            {/* 粒子效果 */}
            <Particles options={particlesOptions} init={particlesInit} height={document.documentElement.clientHeight} />
            <div className='formContainer'>
                <div className='logintitle'>{t("login.title")}</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: t("user.namem") }]}
                    >
                        {/* 解决chrome覆盖浏览器Input输入框自带背景颜色，第一种方式关闭自动填充  <input type="text" autocomplete="off"> */}
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder={t("user.username")} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: t("user.passwordm") }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder={t("user.password")}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            {t("login.login")}
                        </Button>
                        <span style={{ float: 'right', color: 'white' }}>
                            <span
                                style={{ padding: '0 10px' }}
                                onClick={() => handleClick1()}
                            >
                                中文版
                            </span>
                            <span
                                onClick={() => handleClick2()}
                            >
                                EnglishVersion
                            </span>
                        </span>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}


// 映射props属性到自身
const mapStateToProps = (props) => {
    const { langname } = props.Lang
    return {
        langname
    }

}

// 映射dispatch
const mapDispatchToProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Login)
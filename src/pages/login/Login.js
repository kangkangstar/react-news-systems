import React, { useCallback } from 'react'
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './login.css'
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import particlesOptions from "./particles.json";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'


export default function Login(props) {

    // 粒子效果初始值的回调
    const particlesInit = useCallback(main => {
        loadFull(main);
    }, [])

    const navigate = useNavigate()


    // 收集表单数据
    const onFinish = (values) => {
        // 1.从收集的表单数据中解构密码和用户名
        const { username, password } = values
        // 2.发get请求校验用户名，密码及用户状态，同时获取用户的权限
        axios.get(`/users?username=${username}&password=${password}&roleState=true&_expand=role`).then(res => {
            // 3.获取回来的数据为空，则提示错误
            if (res.data.length === 0) {
                message.error("用户名或密码不匹配")
            } else {
                // 4.不为空，则保存token，需要转化为json字符串，同时重定向到首页
                // res.data是当前用户打开状态下的角色数据
                localStorage.setItem('token', JSON.stringify(res.data[0]))
                navigate('/home')
            }
        })
    }

    return (
        <div style={{ backgroundColor: 'rgb(35,39,65)', height: '100%', overflow: 'hidden' }}>
            {/* 粒子效果,需要占满屏幕 */}
            <Particles options={particlesOptions} init={particlesInit} height={document.documentElement.clientHeight} />
            <div className='formContainer'>
                <div className='logintitle'>全球新闻发布管理系统</div>
                {/* 登录表单 */}
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入你的用户名!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入你的密码!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
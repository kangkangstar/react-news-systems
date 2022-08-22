import React, { useCallback } from 'react'
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './login.css'
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import particlesOptions from "./particles.json";
import axios from 'axios';


export default function Login(props) {

    // 粒子效果初始值的回调
    const particlesInit = useCallback(main => {
        loadFull(main);
    }, [])


    // 收集表单数据
    const onFinish = (values) => {
        // console.log(values)

        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
            console.log(res.data)
            if (res.data.length === 0) {
                message.error("用户名或密码不匹配")
            } else {
                localStorage.setItem("token", JSON.stringify(res.data[0]))
                props.history.push("/")
            }
        })
    }

    return (
        <div style={{ backgroundColor: 'rgb(35,39,65)', height: '100%', overflow: 'hidden' }}>
            {/* 粒子效果 */}
            <Particles options={particlesOptions} init={particlesInit} height={document.documentElement.clientHeight}

            />
            <div className='formContainer'>
                <div className='logintitle'>全球新闻发布管理系统</div>
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
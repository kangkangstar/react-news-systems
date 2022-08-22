import React, { forwardRef, useState } from 'react'
import { Form, Input, Select } from 'antd'
import { useEffect } from 'react';
const { Option } = Select;

// forwardRef解决封装组件无法传递ref的问题,接收两个参数，一个是props，另一个就是传进来的ref。
const UserForm = forwardRef((props, ref) => {
    const [isDisable, setIsDisable] = useState(false)
    // 依赖的值改变就重新渲染
    useEffect(() => {
        setIsDisable(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])

    const { roleId, region } = JSON.parse(localStorage.getItem('token'))
    const roleObj = {
        "1": 'superadmin',
        "2": 'admin',
        "3": 'editor'
    }

    // 根据角色控制‘region’选项是否调整，需拆分创建还是更新用户信息
    const checkRegionDisabled = (item) => {
        if (props.isUpdate) {
            // 超级管理用不禁用，其他的禁用
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return true
            }
        } else {
            // 超级管理用不禁用，其他的禁用
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                // 同一区域不禁用，非同一区域禁用
                return item.value !== region
            }
        }
    }
    // 根据角色控制‘角色’选项是否调整，
    const checkRoleDisabled = (item) => {
        if (props.isUpdate) {
            if (roleObj[roleId] === "superadmin") {
                return false // 不禁用
            } else {
                return true  // 禁用
            }
        } else {
            if (roleObj[roleId] === "superadmin") {
                return false // 不禁用
            } else {
                // editor返回真，禁用，其他类型返回假，不禁用
                return roleObj[item.id] !== "editor"
            }
        }
    }

    return (
        <Form
            ref={ref}
            layout="vertical" //垂直布局，默认水平布局
            size='small'
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: '请输入密码!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisable ? [] : [
                    {
                        required: true,
                        message: '请输入区域!',
                    },
                ]}
            >
                <Select disabled={isDisable}>
                    {
                        props.regionList.map((item) => {
                            return <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: '请输入角色!',
                    },
                ]}
            >
                <Select onChange={(value) => {
                    if (value === 1) {
                        setIsDisable(true)
                        // 通过ref的current拿到方法设置初始值
                        ref.current.setFieldsValue({
                            region: ''
                        })

                    } else {
                        setIsDisable(false)
                    }
                }}>
                    {
                        props.roleList.map((item) => {
                            return <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                        })
                    }
                </Select>
            </Form.Item>


        </Form>
    )
})

export default UserForm

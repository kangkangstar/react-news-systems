import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select;

// forwardRef解决封装组件无法传递ref的问题,接收两个参数，一个是props，另一个就是传进来的ref。
const UserForm = forwardRef((props, ref) => {
    const [isDisable, setIsDisable] = useState(false)
    // 依赖的值改变就重新渲染,获取父组件传递过来的区域是否禁用的属性
    useEffect(() => {
        setIsDisable(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])

    // 解构判断region和roleId是否禁用需要的属性
    const { roleId, region } = JSON.parse(localStorage.getItem('token'))

    // 角色名称对象
    const roleObj = {
        "1": 'superadmin',
        "2": 'admin',
        "3": 'editor'
    }

    // 动态判断region中的options是否禁用
    const checkRegionDisabled = (item) => {
        if (props.isUpdate) {
            // 如果是更新用户，超级管理员不禁用能操作所有人，其他的禁用
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return true
            }
        } else {
            // 如果是创建用户，超级管理不禁用能操作所有人，区域管理员只有和自己区域不同的值才会被禁用
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                // 同一区域不禁用，非同一区域禁用
                return item.value !== region
            }
        }
    }
    // 动态判断roleId中的options是否禁用-----超值管理员能操作所有人的数据,所以总返回不禁用
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
                // 修改region的验证规则，超级管理员的区域为空时也能正常提交
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
                    // 如果选择超级管理员，则region禁用内容清空，其他角色不禁用
                    if (value === 1) {
                        // 区域下拉框禁用
                        setIsDisable(true)
                        // 通过ref的current拿到方法设置初始值
                        ref.current.setFieldsValue({
                            region: ''
                        })

                    } else {
                        setIsDisable(false)
                    }
                }}>
                    {/* 遍历生成下拉框的options的选项 */}
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

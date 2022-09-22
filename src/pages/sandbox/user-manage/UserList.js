import React, { useEffect, useState, useRef } from 'react'
import UserForm from '../../../components/user-manage/UserForm';
import axios from 'axios'
import { Table, Button, Switch, Modal } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
// import { withRouter } from 'react-router-dom'
const { confirm } = Modal


function UserList() {
    const [dataSource, setDataSource] = useState([]) // table数据
    const [visible, setVisible] = useState(false); // 添加模态框是否可见
    const [isUpdateVisible, setisUpdateVisible] = useState(false) // 更新模态框是否可见
    const [roleList, setRoleList] = useState([]) // 角色数据
    const [regionList, setRegionList] = useState([])//区域数据
    const [current, setcurrent] = useState(null)// 更新时保存当前点击的item

    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)// 控制区域按钮是否可用
    const addForm = useRef(null)
    const updateForm = useRef(null)

    // 结构信息，方便筛选要展示的数据
    const { roleId, region, username } = JSON.parse(sessionStorage.getItem('token'))

    // 用户联表角色数据
    useEffect(() => {
        // 角色名称对象
        const roleObj = {
            "1": 'superadmin',
            "2": 'admin',
            "3": 'editor'
        }
        axios.get('/users?_expand=role').then(res => {
            const list = res.data
            // 如果是超级管理员展示全部列表，如果不是展示自己和同区域的编辑的数据
            setDataSource(roleObj[roleId] === 'superadmin' ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
            ])

        })
    }, [roleId, region, username])

    // 全部角色数据---传递给UserForm
    useEffect(() => {
        const roles = JSON.parse(localStorage.getItem("roles"))
        if (!roles) {
            axios.get('/roles').then(res => {
                setRoleList(res.data)
                localStorage.setItem('roles', JSON.stringify(res.data))
            })
        }
    }, [])

    // 区域数据--筛选项用和传递给UserForm
    useEffect(() => {
        const regions = JSON.parse(localStorage.getItem("regions"))
        if (!regions) {
            axios.get('/regions').then(res => {
                setRegionList(res.data)
                localStorage.setItem('regions', JSON.stringify(res.data))
            })
        }
    }, [])

    // 解构函数
    const { t } = useTranslation();

    // 表格标题
    const columns = [
        {
            title: t("user.region"),
            dataIndex: 'region',
            // 筛选项需要处理下，将区域为空的替换为全球
            filters: [
                ...regionList.map(item => ({
                    text: item.title,
                    value: item.value
                })), {
                    text: '全球',
                    value: '全球'
                }
            ],
            // 过滤规则，传一个函数
            onFilter: (value, item) => {
                if (value === '全球') {
                    return item.region === ''
                }
                return item.region === value
            },
            // 正常要渲染数据
            render: (region) => {
                return <b>{region === '' ? '全球' : region}</b>
            }
        },
        {
            title: t("user.rolename"),
            dataIndex: 'role',
            // 需要向上联表去查询对应的角色名称
            render: (role) => {
                return role.roleName
            }
        },
        {
            title: t("user.username"),
            dataIndex: 'username',
            render: (username) => {
                return username
            }
        },
        {
            title: t("user.rolestate"),
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)} />
            }
        },
        {
            title: t("common.manage"),
            render: (item) => {
                return (
                    <div>
                        <Button danger shape="circle" icon={<DeleteOutlined />}
                            onClick={() => confirmMethod(item)} disabled={item.default} />

                        <Button type="primary" shape="circle" icon={<EditOutlined />}
                            disabled={item.default}
                            onClick={() => handleUpdate(item)} />

                    </div>
                )
            }
        }
    ]
    // 更新按钮的点击回调---显示模态框，保存点击的item，注意：
    const handleUpdate = (item) => {
        // 1.显示Modal,务必放在定时器外面，不然会出现第一次点击不显示用户数据的情况
        setisUpdateVisible(true)
        // 2.使用异步方式，等Modal显示出来后再去获取当前数据，避免出现form没创建完成就去获取数据，react中数据更新不是同步的
        setTimeout(() => {
            if (item.roleId === 1) {
                // 区域禁用
                setisUpdateDisabled(true)
            } else {
                // 区域不禁用
                setisUpdateDisabled(false)
            }
            // 3.表单创建完成后，再去获取当前项的数据，有属性就用，没有不用管
            updateForm.current?.setFieldsValue(item)
        }, 0)
        // 保存当前的item
        setcurrent(item)
    }

    // switch更新信息的回调--将角色状态取反，然后更新数据通知服务器
    const handleChange = (item) => {
        item.roleState = !item.roleState
        setDataSource([...dataSource])
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
        })
    }

    // 删除-确定方法
    const confirmMethod = (item) => {
        confirm({
            title: t("common.deleteconfirm"),
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
            },
            okText: t("common.ok"),
            cancelText: t("common.cancel")
        });
    }

    // 删除用户的回调
    const deleteMethod = (item) => {
        // 更新数据
        setDataSource(dataSource.filter(data => data.id !== item.id))
        // 通知数据库删除
        axios.delete(`/users/${item.id}`)
    }

    // 添加用户-确认的回调
    const addFormOK = () => {
        addForm.current.validateFields().then(value => {
            // 关闭模态框
            setVisible(false)
            // 清空输入框
            addForm.current.resetFields(null)
            // post到后端生成id,再设置datasource，方面后面的删除和更新
            axios.post('/users', {
                ...value,
                "roleState": true,
                "default": false,//是否可以删除
            }).then(res => {
                setDataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter(item => item.id === value.roleId)[0]
                }])

            })
        }).catch(err => {
            console.log(err);
        })
    }

    // 更新用户-确认的回调
    const UpdateFormOK = () => {
        // 数据验证
        updateForm.current?.validateFields().then(value => {
            // 关闭更新用户的模态框
            setisUpdateVisible(false)
            setDataSource(dataSource.map(item => {
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...value,//新更新的值
                        role: roleList.filter(data => data.id === value.roleId)[0]//users和roles联表查询的role字段的值
                    }
                }
                return item
            }))
            setisUpdateDisabled(!isUpdateDisabled)// 更新区域是否可以点击
            axios.patch(`/users/${current.id}`, value)
        })

    }


    return (
        <div>
            {/* 添加用户就让模态框显示出来就行，剩下的逻辑在模态框里做 */}
            <Button type='primary' onClick={() => setVisible(true)}>{t("user.adduser")}</Button>
            <Table dataSource={dataSource} columns={columns}
                pagination={{ pageSize: 5, position: ['bottomCenter'], showSizeChanger: true }}
                rowKey={(item) => item.id}
            />
            {/* 添加的模态框 */}
            <Modal
                visible={visible}
                title={t("user.adduser")}
                onCancel={() => {
                    setVisible(false)
                }}
                okText={t("common.ok")}
                cancelText={t("common.cancel")}
                onOk={() => {
                    addFormOK()
                }}
            >
                {/* 引入封装组件，渲染添加用户的表格 */}
                <UserForm regionList={regionList} roleList={roleList} ref={addForm} ></UserForm>

            </Modal>
            {/* 更新的模态框 */}
            <Modal
                visible={isUpdateVisible}
                title={t("user.updateuser")}
                onCancel={() => {
                    setisUpdateVisible(false)
                    setisUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => {
                    UpdateFormOK()
                }}
                okText={t("common.ok")}
                cancelText={t("common.cancel")}
            >
                {/* 引入封装组件，渲染更新用户的表格,用isUpdate={true}做标记 */}
                <UserForm regionList={regionList} roleList={roleList}
                    ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>

            </Modal>

        </div>
    )
}

export default UserList
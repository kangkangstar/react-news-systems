import React, { useEffect, useState, useRef } from 'react'
import UserForm from '../../../components/user-manage/UserForm';
import axios from 'axios'
import { Table, Button, Switch, Modal } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal

export default function UserList() {
    const [dataSource, setDataSource] = useState([])
    const [visible, setVisible] = useState(false);
    const [isUpdateVisible, setisUpdateVisible] = useState(false)
    const [roleList, setRoleList] = useState([])
    const [regionList, setRegionList] = useState([])
    const [current, setcurrent] = useState(null)

    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
    const addForm = useRef(null)
    const updateForm = useRef(null)

    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))

    // 用户联表角色数据
    useEffect(() => {
        const roleObj = {
            "1": 'superadmin',
            "2": 'admin',
            "3": 'editor'
        }
        axios.get('/users?_expand=role').then(res => {
            const list = res.data
            setDataSource(roleObj[roleId] === 'superadmin' ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
            ])

        })
    }, [roleId, region, username])

    // 全部角色数据
    useEffect(() => {
        axios.get('/roles').then(res => {
            setRoleList(res.data)
        })
    }, [])

    // 区域数据
    useEffect(() => {
        axios.get('/regions').then(res => {
            setRegionList(res.data)
        })
    }, [])

    // 表格标题
    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionList.map(item => ({
                    text: item.title,
                    value: item.value
                })), {
                    text: '全球',
                    value: '全球'
                }
            ],
            onFilter: (value, item) => {
                if (value === '全球') {
                    return item.region === ''
                }
                return item.region === value
            },
            render: (region) => {
                return <b>{region === '' ? '全球' : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            // 需要向上联表去查询对应的角色名称
            render: (role) => {
                return role.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
            render: (username) => {
                return username
            }
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)} />
            }
        },
        {
            title: '操作',
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
    // 编辑按钮的点击回调
    const handleUpdate = (item) => {
        // console.log(updateForm);
        setisUpdateVisible(true)
        // 异步中同步触发，解决模态框先出来再出数据，react中数据更新不是同步的
        setTimeout(() => {
            if (item.roleId === 1) {
                setisUpdateDisabled(true)
            } else {
                setisUpdateDisabled(false)
            }
            updateForm.current?.setFieldsValue(item)
        }, 0)
        setcurrent(item)
    }


    // switch更新信息的回调
    const handleChange = (item) => {
        // console.log(item);
        item.roleState = !item.roleState
        setDataSource([...dataSource])
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
        })
    }

    // 删除-确定方法
    const confirmMethod = (item) => {
        confirm({
            title: '确定要删除吗?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            // content: 'Some descriptions',
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
                // console.log('Cancel');
            },
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
                console.log(res.data);
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
            <Button type='primary' onClick={() => setVisible(true)}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns}
                pagination={{ pageSize: 5 }}
                rowKey={(item) => item.id}
            />
            <Modal
                visible={visible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setVisible(false)
                }}
                onOk={() => {
                    console.log('add', addForm);
                    addFormOK()
                }}
            >
                {/* 引入封装组件，渲染添加用户的表格 */}
                <UserForm regionList={regionList} roleList={roleList} ref={addForm} ></UserForm>

            </Modal>

            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setisUpdateVisible(false)
                    setisUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => {
                    UpdateFormOK()
                }}
            >
                {/* 引入封装组件，渲染更新用户的表格,用isUpdate={true}做标记 */}
                <UserForm regionList={regionList} roleList={roleList}
                    ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>

            </Modal>

        </div>
    )
}

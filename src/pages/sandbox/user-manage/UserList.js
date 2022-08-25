import React, { useEffect, useState, useRef } from 'react'
import UserForm from '../../../components/user-manage/UserForm';
import axios from 'axios'
import { Table, Button, Switch, Modal } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import confirmMethod from "../../../utils/cofirmDeleteMethod"

export default function UserList() {
    // table数据
    const [dataSource, setDataSource] = useState([])
    // 添加和更新用户模态框是否可见
    const [visible, setVisible] = useState(false);
    const [isUpdateVisible, setisUpdateVisible] = useState(false)
    // 角色和区域数据
    const [roleList, setRoleList] = useState([])
    const [regionList, setRegionList] = useState([])
    // 
    const [current, setcurrent] = useState(null)
    // 子组件区域下拉框是否禁用受现在父组件的控制,如果是超级管理员禁用,否则不禁用
    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
    // 添加和更新用户的ref
    const addForm = useRef(null)
    const updateForm = useRef(null)

    // 从token中解构出id，区域和用户名信息
    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))

    // 用户联表角色数据
    useEffect(() => {
        // 角色名称列表
        const roleObj = {
            "1": 'superadmin',
            "2": 'admin',
            "3": 'editor'
        }
        axios.get('/users?_expand=role').then(res => {
            const list = res.data
            // 超级管理员有全部权限，非超级管理只能看到自身和同一个区域下的编辑
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
            // filters属性来指定需要筛选菜单的列
            // 过滤项：region列表+自写的全球
            filters: [
                ...regionList.map(item => ({
                    text: item.title,
                    value: item.value
                })), {
                    text: '全球',
                    value: '全球'
                }
            ],
            // onFilter用于筛选当前数据，传一个函数
            onFilter: (value, item) => {
                // 如果搜索的是全球就返回区域为空的数据
                if (value === '全球') {
                    return item.region === ''
                }
                return item.region === value
            },
            render: (region) => {
                // region如果为空替换为全球，不为空直接显示
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
                        {/* 删除按钮 */}
                        <Button danger shape="circle" icon={<DeleteOutlined />}
                            onClick={() => confirmMethod(item, deleteMethod)} disabled={item.default} />
                        {/* 更新用户 */}
                        <Button type="primary" shape="circle" icon={<EditOutlined />}
                            disabled={item.default}
                            onClick={() => handleUpdate(item)} style={{ marginLeft: '5px' }} />
                    </div>
                )
            }
        }
    ]
    // 编辑按钮的点击回调---显示模态框,获取当前用户数据
    const handleUpdate = (item) => {
        // 1.显示Modal,务必放在定时器外面，不然会出现第一次点击不显示用户数据的情况
        setisUpdateVisible(true)
        // 2.使用异步方式，等Modal显示出来后再去获取当前数据，避免出现form没创建完成就去获取数据,react更新不是同步的
        setTimeout(() => {
            if (item.roleId === 1) {
                // 区域禁用
                setisUpdateDisabled(true)
            } else {
                // 区域不禁用
                setisUpdateDisabled(false)
            }
            // 3.表单创建完成后，再去获取当前项的数据
            updateForm.current?.setFieldsValue(item)
        }, 0)
        setcurrent(item)//保存当前数据，方便更新用户表单的提交按钮去调用
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
    // const confirmMethod = (item) => {
    //     confirm({
    //         title: '确定要删除吗?',
    //         icon: <ExclamationCircleOutlined />,
    //         okText: '确认',
    //         cancelText: '取消',
    //         // content: 'Some descriptions',
    //         onOk() {
    //             deleteMethod(item)
    //         },
    //         onCancel() {
    //             // console.log('Cancel');
    //         },
    //     });
    // }

    // 删除用户的回调
    const deleteMethod = (item) => {
        // 更新数据
        setDataSource(dataSource.filter(data => data.id !== item.id))
        // 通知数据库删除
        axios.delete(`/users/${item.id}`)
    }

    // 添加用户-确认的回调
    const addFormOK = () => {
        // 提交时进行数据校验
        addForm.current.validateFields().then(value => {
            // 关闭模态框
            setVisible(false)
            // 清空输入框
            addForm.current.resetFields(null)
            // post到后端生成id,再设置datasource，方面后面的删除和更新
            axios.post('/users', {
                ...value,
                "roleState": true,// 用户状态是否打开
                "default": false,//是否可以删除
            }).then(res => {
                // 先获取之前的数据,把新的数据放进入,但这里需要注意:用户经没办法自动获取角色名,需要手动刷新,需要自行添加一个字段
                // 产生的原因:table展示的数据是user和role联表的结果,但添加用户的时候 role没有就会出现无法显示的问题
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
                    // 如果当前项和遍历项的id相同,进行数据合并
                    return {
                        ...item,
                        ...value,//新更新的值
                        role: roleList.filter(data => data.id === value.roleId)[0]//users和roles联表查询的role字段的值
                    }
                }
                return item
            }))
            setisUpdateDisabled(!isUpdateDisabled)// 更新区域是否可以点击
            axios.patch(`/users/${current.id}`, value)// 同步数据库更新
        })

    }


    return (
        <div>
            <Button type='primary' onClick={() => setVisible(true)} style={{ marginBottom: '10px' }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns}
                pagination={{ pageSize: 5 }}
                rowKey={(item) => item.id}
            />
            {/* 添加用户模态框 */}
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
            {/* 更新用户的模态框 */}
            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setisUpdateVisible(false) // 隐藏模态框
                    setisUpdateDisabled(!isUpdateDisabled) // 数据取反赋值避免出现错误
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

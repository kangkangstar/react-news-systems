import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal

export default function RightList() {

    // 指定表格的数据源
    const [dataSource, setDataSource] = useState([])

    // 挂载后请求表格的数据源
    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {
            const list = res.data
            // 二级菜单为空的则对应的表格行不可展开
            list.forEach(item => {
                if (item.children.length === 0) {
                    item.children = '' //空串无法展开
                }
            })
            setDataSource(list)
        })
    }, [])

    // 表格的标题
    const columns = [
        // dataIndex的值要和后端对应的key相同
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title'
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                // Tag标签：进行标记和分类的小标签。color定义标签色
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title: '操作',
            //  render：生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引
            render: (item) => {
                return (
                    <div>
                        {/* 删除按钮 */}
                        <Button danger shape="circle" icon={<DeleteOutlined />}
                            onClick={() => confirmMethod(item)} />
                        {/* 
                            编辑按钮+气泡卡片
                            Popover：点击/鼠标移入元素，弹出气泡式的卡片浮层。 
                            content:卡片内容
                            title:卡片标题
                            trigger：触发方式，鼠标移入、聚集、点击。
                        */}

                        <Popover
                            title="页面配置项"
                            content={<div style={{ textAlign: 'center' }}>
                                <Switch checked={item.pagepermisson}
                                    onChange={() => switchMethod(item)}  >
                                </Switch>
                            </div>}
                            trigger={item.pagepermisson === undefined ? '' : "click"}
                        >
                            <Button type="primary" shape="circle"
                                icon={<EditOutlined />}
                                disabled={item.pagepermisson === undefined} />
                        </Popover>
                    </div>
                )

            }
        }
    ];

    // 更新配置项开关的回调
    const switchMethod = (item) => {
        // 开关默认值取反后重新赋值
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        // 更新页面
        setDataSource([...dataSource])
        // 通知数据库补丁更新
        if (item.grade === 1) {
            axios.patch(`/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })

        } else {
            axios.patch(`/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }
    }

    // 删除-确定方法
    const confirmMethod = (item) => {
        // 调用Modal对话框的Modal.confirm方法
        confirm({
            title: '确定要删除吗?',
            icon: <ExclamationCircleOutlined />,//自定义图标
            okText: '确认',//确认按钮文字
            cancelText: '取消',//设置 Modal.confirm 取消按钮文字
            content: '温馨提示：删除操作不可撤销',
            onOk() {
                deleteMethod(item)
            },//点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
            onCancel() {
            },//取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
        });
    }

    // 删除-确定-删除方法
    const deleteMethod = (item) => {
        // 一级分类
        if (item.grade === 1) {
            // 过滤掉删除的项，更新页面显示
            setDataSource(dataSource.filter(data => data.id !== item.id))
            // 通知数据库删除
            axios.delete(`/rights/${item.id}`)
        } else {
            // 获取对应的一级分类
            let list = dataSource.filter(data => data.id === item.rightId)
            // 更新一级分类对应的二级分类,list[0]获取到对应一级的对象
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            // 更新页面，不能直接放，需要使用扩展运算符
            setDataSource([...dataSource])
            // 通知数据库删除
            axios.delete(`/children/${item.id}`)
        }

    }

    return (
        <div>
            {/* 
                dataSource:数据数组
                columns:表格列的配置描述，具体项见下表
                pagination:分页器，设为 false 时不展示和进行分页。每页条数：pageSize:5
                树形数据展示：当数据中有children字段时会自动展示为树形表格
            */}
            <Table dataSource={dataSource} columns={columns}
                pagination={{ pageSize: 5 }}
            />

        </div>
    )
}

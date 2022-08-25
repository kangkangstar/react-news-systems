import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Table, Button, Tag, notification } from 'antd'

// 此模块可以看到自己提交到审核中的新闻

export default function AuditList(props) {
    const [dataSource, setDatasource] = useState([])
    const navigate = useNavigate()

    // 解构用户名，好去获取该用户的数据
    const { username } = JSON.parse(localStorage.getItem('token'))
    // 请求作者为登录用户本人 && auditState不等于0 && publishState小于等于1的
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            setDatasource(res.data)
        })
    }, [username])

    // 表格的标题
    const columns = [
        // dataIndex的值要和后端对应的key相同
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                // Tag标签：进行标记和分类的小标签。color定义标签色
                const colorList = ['', 'orange', 'green', 'red']
                const audiList = ['待审核', '审核中', '已通过', '未通过']
                return <Tag color={colorList[auditState]}>{audiList[auditState]}</Tag>
            }
        },
        {
            title: '操作',
            //  render：生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引
            render: (item) => {
                return (
                    <div>
                        {/* 根据审核状态显示不同得按钮 */}
                        {
                            item.auditState === 1 && <Button danger onClick={() => handleRervert(item)}>撤销</Button>
                        }
                        {
                            item.auditState === 2 && <Button onClick={() => handlePublish(item)}>发布</Button>
                        }
                        {
                            item.auditState === 3 && <Button type='primary' onClick={() => { handleUpdate(item) }}>更新</Button>
                        }
                    </div>
                )

            }
        }
    ];

    // 撤销按钮的回调
    const handleRervert = (item) => {
        // 使用filter删除此项数据，同时将状态改为0，未审核
        setDatasource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState: 0
        }).then(res => {
            // 通知确认框--右下角弹出
            notification.info({
                message: `通知`,
                description: `您可以到草稿箱中查看您的新闻`,
                placement: 'bottomRight',
            });
        })
    }

    // 更新按钮的回调---带id跳转到新闻更新页面
    const handleUpdate = (item) => {
        navigate.push(`/news-manage/update/${item.id}`)
    }

    // 发布按钮的回调
    const handlePublish = (item) => {
        // 1.发请求更新发布状态
        axios.patch(`/news/${item.id}`, {
            'publishState': 2,
            'publishTime': Date.now()
        }).then(res => {
            // 2.路由跳转
            navigate('/publish-manage/published')
            // 3.通知确认框--右下角弹出
            notification.info({
                message: `通知`,
                description: `您可以到【发布管理/已发布】中查看您的新闻`,
                placement: 'bottomRight',
            });
        })
    }


    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{ pageSize: 5 }} rowKey={item => item.id}
            />
        </div>
    )
}

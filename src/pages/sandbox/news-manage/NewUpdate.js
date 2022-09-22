import React, { useState, useEffect, useRef } from 'react'
import NewsEditor from '../../../components/news-manage/NewsEditor'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd';
import style from './newadd.module.css'
import axios from 'axios'
const { Step } = Steps;
const { Option } = Select

export default function NewUpdate(props) {
    const [current, setcurrent] = useState(0)
    const [categoryList, setcategoryList] = useState([])
    const [formInfo, setformInfo] = useState({})
    const [content, setContent] = useState('')

    // 如果是第一步，进行数据校验，然后current+1
    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                setformInfo(res)
                setcurrent(current + 1)
            }).catch(error => {
                console.log(error);
            })
        } else {
            if (content === '' || content.trim() === '<p></p>') {
                message.error('输入内容不能为空')
            } else {
                setcurrent(current + 1)
            }

        }

    }
    // 上一步的回调
    const handlePrevious = () => {
        setcurrent(current - 1)
    }

    // 请求新闻分类的数据
    useEffect(() => {
        axios.get('/categories').then(res => {
            setcategoryList(res.data)
        })
    }, [])

    // 请求新闻的详细数据，通过id查找
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            let { title, categoryId, content } = res.data
            NewsForm.current.setFieldsValue({
                title, categoryId
            })
            setContent(content)
        })
    }, [props.match.params.id])

    // 给表单绑定ref对象
    const NewsForm = useRef(null)
    // const User = JSON.parse(localStorage.getItem('token'))

    // 保存草稿或提交审核的回调--补丁更新
    const handlesave = (auditState) => {
        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            'content': content,
            "auditState": auditState,
        }).then(res => {
            // 如果状态为0跳草稿箱，状态为1跳审核列表
            props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

            // 通知确认框--右下角弹出
            notification.info({
                message: `通知`,
                description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                placement: 'bottomRight',
            });
        })
    }

    return (
        <div>
            {/* 页头 */}
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                onBack={() => {
                    props.history.goBack()
                }}
                subTitle="This is a subtitle"
            />
            {/* 步骤条 */}
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主题内容" />
                <Step title="新闻提交" description="保存草稿或提交审核" />
            </Steps>
            {/* 编辑区 */}
            <div style={{ margin: '30px' }} >
                {/* 通过控制显示和隐藏，保证输入框的数据不丢失 */}
                {/* 1.选择框 */}
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        name="basic"
                        labelCol={{ span: 2 }} // 占8份
                        wrapperCol={{ span: 22 }} // 占16份
                        labelAlign='left'
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: '请输入标题!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: '请选择分类!' }]}
                        >
                            <Select>
                                {
                                    categoryList.map(item => {
                                        return <Option key={item.id} value={item.id}>{item.title}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>

                </div>
                {/* 2.编辑器 */}
                <div className={current === 1 ? '' : style.active}>
                    {/* 编辑器 */}
                    <NewsEditor getContent={(value) => {
                        setContent(value)
                    }} content={content}></NewsEditor>
                </div>
                {/*  */}
                <div className={current === 2 ? '' : style.active}>
                </div>
            </div>
            {/* 按钮区域---通过current控制按钮的显示逻辑 */}
            <div style={{ marginTop: '50px' }}>
                {
                    current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }
                {
                    current < 2 && <Button type='primary' onClick={handleNext} >下一步</Button>
                }
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => handlesave(0)}>保存草稿</Button>
                        <Button danger onClick={() => handlesave(1)}>提交审核</Button>
                    </span>
                }

            </div>
        </div >
    )
}


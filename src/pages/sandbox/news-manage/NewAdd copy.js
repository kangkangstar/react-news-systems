import React, { useState, useEffect, useRef } from 'react'
import NewsEditor from '../../../components/news-manage/NewsEditor'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd';
import style from './newadd.module.css'
import axios from 'axios'
const { Step } = Steps;
const { Option } = Select

export default function NewAdd(props) {
    const [current, setcurrent] = useState(0)
    const [categoryList, setcategoryList] = useState([])
    const [formInfo, setformInfo] = useState({})
    // 存储从子组件获取到的文章信息
    const [content, setContent] = useState('')

    // 如果是第一步，进行数据校验，然后current+1
    const handleNext = () => {
        if (current === 0) {
            // 触发表单验证
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

    // 获取文章分类列表
    useEffect(() => {
        axios.get('/categories').then(res => {
            setcategoryList(res.data)
        })
    }, [])

    // 给表单绑定ref对象
    const NewsForm = useRef(null)
    const User = JSON.parse(sessionStorage.getItem('token'))


    // 保存草稿或提交审核的回调
    const handlesave = (auditState) => {
        axios.post('/news', {
            ...formInfo,
            'content': content,
            "region": User.region ? User.region : '全球',
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
        }).then(res => {
            // 如果状态为0跳草稿箱，状态为1跳审核列表
            props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

            // 通知确认框--右下角弹出
            notification.info({
                message: `通知`,
                description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的文章`,
                placement: 'bottomRight',
            });
        })
    }
    // 通过 Hooks 创建 Ref
    const childRef = useRef(null);
    const clear = () => {
        childRef.current.clearMessage();
    }

    return (
        <div>
            {/* 页头 */}
            <PageHeader
                className="site-page-header"
                title="撰写文章"
                subTitle="This is a subtitle"
            />
            {/* 步骤条 */}
            <Steps current={current}>
                <Step title="基本信息" description="文章标题，文章分类" />
                <Step title="文章内容" description="文章主题内容" />
                <Step title="文章提交" description="保存草稿或提交审核" />
            </Steps>
            {/* 编辑区 */}
            <div style={{ margin: '30px' }} >
                {/* 通过类名的display控制元素的显示和隐藏，保证输入框的数据不丢失,不用总发请求再去设置 */}
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
                            label="文章标题"
                            name="title"
                            rules={[{ required: true, message: '请输入标题!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="文章分类"
                            name="categoryId"
                            rules={[{ required: true, message: '请选择分类!' }]}
                        >
                            <Select>
                                {/* 遍历生成文章列表 */}
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
                    }} ref={childRef}></NewsEditor>
                </div>
                {/* 3.第3步没有填写区，只有按钮 */}
                <div className={current === 2 ? '' : style.active}>
                </div>
            </div>
            {/* 按钮区域---通过current控制按钮的显示逻辑 */}
            <div style={{ marginTop: '50px' }}>
                {
                    current > 0 && <Button onClick={handlePrevious} style={{ marginLeft: '5px' }}>上一步</Button>
                }
                {
                    current < 2 && <Button type='primary' onClick={handleNext} style={{ marginLeft: '5px' }}>下一步</Button>
                }
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => handlesave(0)} style={{ marginLeft: '5px' }}>保存草稿</Button>
                        <Button danger onClick={() => handlesave(1)} style={{ marginLeft: '5px' }}>提交审核</Button>
                    </span>
                }
                {
                    current === 1 && <Button type="primary" onClick={clear} style={{ marginLeft: '5px' }}>清空内容</Button>
                }

            </div>
        </div >
    )
}

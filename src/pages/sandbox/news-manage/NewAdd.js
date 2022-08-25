import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import NewsEditor from '../../../components/news-manage/NewsEditor'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd';
import style from './newadd.module.css'
import axios from 'axios'
const { Step } = Steps;
const { Option } = Select

export default function NewAdd(props) {
    // 当前第几步
    const [current, setcurrent] = useState(0)
    // 新闻分类数据
    const [categoryList, setcategoryList] = useState([])
    // 点击下一步的时候保存的
    const [formInfo, setformInfo] = useState({})// 表单数据
    // 子组件传递过来的
    const [content, setContent] = useState('')// 文本编辑器数据
    const navigate = useNavigate()

    // 获取新闻分类列表
    useEffect(() => {
        axios.get('/categories').then(res => {
            setcategoryList(res.data)
        })
    }, [])

    //第一步的表单数据收集
    const NewsForm = useRef(null)

    // 如果是第一步，进行数据校验，然后current+1
    const handleNext = () => {
        //  第一步是表单需要进行验证，其他时候无需验证
        if (current === 0) {
            // 触发表单验证
            NewsForm.current.validateFields().then(res => {
                // 通过保存表单信息，进入下一步
                setformInfo(res)
                setcurrent(current + 1)
            }).catch(error => {
                console.log(error);
            })
        } else {
            console.log(formInfo, content);
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

    // 解构用户信息
    const User = JSON.parse(localStorage.getItem('token'))

    // 保存草稿或提交审核的回调-----通过auditState区分跳草稿还是审核，保存完路由跳转加提醒
    const handlesave = (auditState) => {
        // 1.将新增的新闻post到数据库，格式看后台现有的格式
        // 用auditState=0代表未审核，跳转草稿箱，auditState=1代表正在审核，跳转审核列表
        axios.post('/news', {
            ...formInfo,
            'content': content,
            "region": User.region ? User.region : '全球',
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0, // 未发布
            "createTime": Date.now(),// 创建时间
            "star": 0, //点赞开始都是0
            "view": 0, // 浏览默认为0
            // "publishTime": 0
        }).then(res => {
            // 2.路由跳转：如果状态为0跳草稿箱，状态为1跳审核列表
            navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
            // 3.通知确认框--右下角弹出
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
                title="撰写新闻"
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
                {/* 通过类名的display控制元素的显示和隐藏，保证输入框的数据不丢失,不用总发请求再去设置 */}
                {/* 1.选择框 */}
                <div className={current === 0 ? '' : style.hidde}>
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
                                {/* 遍历生成新闻列表 */}
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
                <div className={current === 1 ? '' : style.hidde}>
                    {/* 编辑器，单独封装组件，方便更新时复用 */}
                    <NewsEditor getContent={(value) => {
                        setContent(value)
                    }}></NewsEditor>
                </div>
                {/* 3.啥都不显示 */}
                <div className={current === 2 ? '' : style.hidde}>
                </div>
            </div>
            {/* 按钮区域---通过current控制按钮的显示逻辑 */}
            <div style={{ marginTop: '50px' }}>
                {
                    current > 0 && <Button onClick={handlePrevious} style={{ marginLeft: '5px' }}>上一步</Button>
                }
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => handlesave(0)} style={{ marginLeft: '5px' }}>保存草稿</Button>
                        <Button danger onClick={() => handlesave(1)} style={{ marginLeft: '5px' }}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type='primary' onClick={handleNext} style={{ marginLeft: '5px' }}>下一步</Button>
                }
            </div>
        </div >
    )
}

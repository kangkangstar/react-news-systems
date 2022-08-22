import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import axios from 'axios';
import * as Echarts from 'echarts'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
const { Meta } = Card;

function Home(props) {
    //#region 
    /*  const getMessage = () => {
         // 取数据，也可以带参数查询  get
         // axios.get('http://localhost:8000/list/1').then(res => {
         //     console.log(res.data);
         // })
         // 增数据  post
         // axios.post('http://localhost:8000/list', {
         //     "name": "逛街",
         //     "flag": false
         // })
         // 全部替换更新 put 改后的对象直接替换旧的，有的字段没改就会删除
         // axios.put('http://localhost:8000/list/1', {
         //     name: '打游戏',
         //     flag: true
         // })
 
         // 局部更新数据  patch
         // axios.patch('http://localhost:8000/list/1', {
         //     name: '打代码'
         // })
 
         // 删除 delete 关联的数据也会被删除
         // axios.delete('http://localhost:8000/list/3')
 
         // _embed 向下联合查询
         // axios.get('http://localhost:8000/list/1?_embed=content').then(res => {
         //     console.log(res.data);
         // })
 
         // _expand 向上联合查询
         // axios.get('http://localhost:8000/contents?_expand=list').then(res => {
         //     console.log(res.data);
         // })
     } */
    //#endregion
    const [viewList, setviewList] = useState([])
    const [startList, setstartList] = useState([])
    const [allList, setallList] = useState([])
    const [visible, setvisible] = useState(false)
    const [pieChart, setpieChart] = useState(null)
    // 给ECharts容器打标识
    const mainRef = useRef()
    const pieRef = useRef()



    // 浏览最多
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
            setviewList(res.data);

        })
    }, [])

    // 点赞最多
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=start&_order=desc&_limit=6`).then(res => {
            setstartList(res.data);
        })
    }, [])

    // 请求已发布的所有新闻
    useEffect(() => {
        // 请求已发布的所有新闻
        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            // console.log(res.data)
            // 数据按照_.groupBy方法第二个参数进行分组
            renderBarView(_.groupBy(res.data, item => item.category.title))

            setallList(res.data)
        })

        // 销毁前将视口改变的回调清空
        return () => {
            window.onresize(null)
        }


    }, [])

    // 柱形图数据初始化的回调
    const renderBarView = (Obj) => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = Echarts.init(mainRef.current);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(Obj),//动态读取分类标题
                axisLabel: {
                    rotate: 45, // 标签旋转的角度
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1  // 最小间隔
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(Obj).map(item => item.length) // 动态读取数量
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        // 让图标跟随视口自动改变
        window.onresize = () => {
            myChart.resize()
            // console.log(1111);
        }
    }

    // 饼状图数据初始化的回调
    const renderPieView = () => {
        // 数据处理工作
        var currentList = allList.filter(item => item.author === username)
        var groupObj = _.groupBy(currentList, item => item.category.title)

        var list = []
        for (var i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length
            })
        }

        // 要初始化的节点：pieRef.current
        var myChart
        if (!pieChart) {
            myChart = Echarts.init(pieRef.current);
            setpieChart(myChart)
        } else {
            myChart = pieChart
        }
        var option;

        option = {
            title: {
                text: '当前用户新闻分类图示',
                // subtext: 'Fake Data',
                left: 'center',
                top: '15%'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '0'
                // orient: 'vertical',
                // left: 'left'
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);
    }


    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最长浏览" bordered >
                        <List
                            dataSource={viewList}
                            renderItem={item => (
                                <List.Item>
                                    {/* 带id跳转到预览页面 */}
                                    <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered>
                        <List
                            dataSource={startList}
                            renderItem={item => (
                                <List.Item>
                                    <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={() => {
                                // 先让抽屉显示，让初始化饼状图，解决首次初始化没完就设置显示报错的问题
                                setvisible(true)
                                setTimeout(() => {
                                    renderPieView()
                                }, 0);
                            }} />,
                            <EditOutlined key="edit" onClick={() => {
                                // this.$router.push('/user-manage/list')
                                props.history.replace('/user-manage/list')
                            }} />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={username}
                            description={
                                <div>
                                    <b>{region ? region : '全球'}</b>
                                    <span style={{ paddingLeft: '20px' }}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            {/* 抽屉组件 */}
            <Drawer width='500px' title="个人新闻分类" placement="right" closable onClose={() => { setvisible(false) }} visible={visible}>
                <div ref={pieRef} style={{ height: '400px', marginTop: '30px' }}></div>
            </Drawer>
            {/* <!-- 为 ECharts 准备一个定义了宽高的 DOM --> */}
            <div ref={mainRef} style={{ height: '400px', marginTop: '30px' }}></div>
        </div >
    )
}

export default withRouter(Home)

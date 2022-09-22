import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import axios from 'axios';
import * as Echarts from 'echarts'
import _ from 'lodash'
import { useTranslation } from "react-i18next";
import { useCallback } from 'react';
const { Meta } = Card;

function Home(props) {

    const [allList, setallList] = useState([])
    const [visible, setvisible] = useState(false)
    const [pieChart, setpieChart] = useState(null)
    // 给ECharts容器打标识
    const mainRef = useRef()
    const pieRef = useRef()

    // 最长浏览和点赞最多的数据从本地存储获取
    const viewList = JSON.parse(sessionStorage.getItem("newssort"))
    const startList = JSON.parse(sessionStorage.getItem("newsstart"))

    const { t } = useTranslation();

    // 柱形图数据初始化的回调
    const renderBarView = useCallback(
        (Obj) => {
            // 基于准备好的dom，初始化echarts实例
            var myChart = Echarts.init(mainRef.current);

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: t("home.newstitle")
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
            }
        }, [t],
    )
    // 数据请求
    useEffect(() => {
        // 请求已发布的所有新闻
        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            // 数据按照_.groupBy方法第二个参数进行分组
            renderBarView(_.groupBy(res.data, item => item.category.title))
            setallList(res.data)
        })

        // 销毁前将视口改变的回调清空
        return () => {
            window.onresize(null)
        }

    }, [props.langname, renderBarView])



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


    const { username, region, roleId } = JSON.parse(sessionStorage.getItem('token'))
    const rolenameList = {
        1: "superadmin",
        2: "regionadmin",
        3: "regionedit"
    }

    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title={t("home.carttitle1")} bordered >
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
                    <Card title={t("home.carttitle2")} bordered>
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
                            avatar={<Avatar src="./logo512.png" />}
                            title={username}
                            description={
                                <div>
                                    <b>{region ? region : t("home.global")}</b>
                                    <span style={{ paddingLeft: '20px' }}>{t(`home.${rolenameList[roleId]}`)}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            {/* 抽屉组件 */}
            <Drawer width='500px' title={t("home.pertitle")} placement="right" closable onClose={() => { setvisible(false) }} visible={visible}>
                <div ref={pieRef} style={{ height: '400px', marginTop: '30px' }}></div>
            </Drawer>
            {/* <!-- 为 ECharts 准备一个定义了宽高的 DOM --> */}
            <div ref={mainRef} style={{ height: '400px', marginTop: '30px' }}></div>
        </div >
    )
}

export default Home

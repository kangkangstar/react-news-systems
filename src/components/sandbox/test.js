import {
    Button,
    Calendar,
    ConfigProvider,
    DatePicker,
    Modal,
    Pagination,
    Popconfirm,
    Radio,
    Select,
    Table,
    TimePicker,
    Transfer,
} from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React, { useState } from 'react';
moment.locale('en');
const { Option } = Select;
const { RangePicker } = DatePicker;

// page组件，里面都可以国际化的组件
const Page = () => {
    const [open, setOpen] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };

    const info = () => {
        Modal.info({
            title: 'some info',
            content: 'some info',
        });
    };

    const confirm = () => {
        Modal.confirm({
            title: 'some info',
            content: 'some info',
        });
    };

    return (
        <div className="locale-components">
            <div className="example">
                <Pagination defaultCurrent={1} total={50} showSizeChanger />
            </div>
            <div className="example">
                <Select
                    showSearch
                    style={{
                        width: 200,
                    }}
                >
                    <Option value="jack">jack</Option>
                    <Option value="lucy">lucy</Option>
                </Select>
                <DatePicker />
                <TimePicker />
                <RangePicker
                    style={{
                        width: 200,
                    }}
                />
            </div>
            <div className="example">
                <Button type="primary" onClick={showModal}>
                    Show Modal
                </Button>
                <Button onClick={info}>Show info</Button>
                <Button onClick={confirm}>Show confirm</Button>
                <Popconfirm title="Question?">
                    <a href="#">Click to confirm</a>
                </Popconfirm>
            </div>
            <div className="example">
                <Transfer dataSource={[]} showSearch targetKeys={[]} />
            </div>
            <div className="site-config-provider-calendar-wrapper">
                <Calendar fullscreen={false} value={moment()} />
            </div>
            <div className="example">
                <Table dataSource={[]} columns={columns} />
            </div>
            <Modal title="Locale Modal" open={open} onCancel={hideModal}>
                <p>Locale Modal</p>
            </Modal>
        </div>
    );
};

const App = () => {
    // 语言设置
    const [locale, setLocal] = useState(enUS);

    // 改变语法设置
    const changeLocale = (e) => {
        const localeValue = e.target.value;
        setLocal(localeValue);

        if (!localeValue) {
            moment.locale('en');
        } else {
            moment.locale('zh-cn');
        }
    };

    return (
        <div>
            <div className="change-locale">
                {/* 开头那句话 */}
                <span>
                    Change locale of components:{' '}
                </span>
                {/* 单选按钮 */}
                <Radio.Group value={locale} onChange={changeLocale}>
                    <Radio.Button key="en" value={enUS}>
                        English
                    </Radio.Button>
                    <Radio.Button key="cn" value={zhCN}>
                        中文
                    </Radio.Button>
                </Radio.Group>
            </div>
            {/* 页面上的示例组件 */}
            <ConfigProvider locale={locale}>
                <Page
                    key={
                        locale ? locale.locale : 'en'
                        /* Have to refresh for production environment */
                    }
                />
            </ConfigProvider>
        </div>
    );
};

export default App;
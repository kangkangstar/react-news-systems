// prestate老状态给一个初始值 false，不折叠
export const Collapsed = (preState = { isClollapsed: false }, action) => {
    //接收组件传递过来的action
    let { type } = action
    switch (type) {
        case 'change_collapsed':
            let newstate = { ...preState }  //复制老的状态
            newstate.isClollapsed = !newstate.isClollapsed
            return newstate
        default:
            return preState;
    }
}
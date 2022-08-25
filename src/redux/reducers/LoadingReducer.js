
export const Loading = (preState = { isLoading: false }, action) => {
    // console.log(action);//接收组件传递过来的action
    let { type, payload } = action
    switch (type) {
        case 'change_loading':
            let newstate = { ...preState }  //复制老的状态
            newstate.isLoading = payload //直接将payload的值赋值
            return newstate
        default:
            return preState;
    }
}
export const Loading = (preState = { isLoading: false }, action) => {
    let { type } = action
    switch (type) {
        case 'change_loading':
            let newstate = { ...preState }  //复制老的状态
            newstate.isLoading = !newstate.isLoading
            return newstate
        default:
            return preState;

    }
}
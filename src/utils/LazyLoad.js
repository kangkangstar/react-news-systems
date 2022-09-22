// 基于react懒加载机制进行自定义封装，build打包后会单独拆分成单独的文件，需要的时候再去加载
import React from 'react'

export default function LazyLoad(path) {
    const Comp = React.lazy(() => import(`/router/${path}`)) // views就是路由对应的文件夹，改成对应的
    return (
        <React.Suspense fallback={<div>加载中</div>}>
            <Comp />
        </React.Suspense>
    )
}

// createStore弃用，使用configureStore
import { configureStore, combineReducers } from '@reduxjs/toolkit'
// 折叠
import { Collapsed } from './reducers/CollapaseReducer'
// loading
import { Loading } from './reducers/LoadingReducer'
// 1.引入持久化相关的文件
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

// 2.创建持久化规则
const persistConfig = {
    key: 'hello',
    storage,
    blacklist: ['Loading']// 黑名单：不做持久化 还有白名单,指定给谁做持久化
}


// 汇总多个reducer
const AllReducer = combineReducers({
    Collapsed,
    Loading
})

// 3.借助规则生成可持久化的reducer
const persistedReducer = persistReducer(persistConfig, AllReducer)
// 4.借助可持久化的reducer生成store，此处需要写成对象形式，直接封装了reducer、middleware、devTools、enhancers等默认值
const store = configureStore({ reducer: persistedReducer })
// 5.生成可持久化的store，本质也是保存到localstorge中去
const persistor = persistStore(store)
// 6.分别暴露
export { store, persistor }

/* 
store.dispatch()
store.subsribe()

*/
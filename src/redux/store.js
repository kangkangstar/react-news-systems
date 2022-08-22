import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { Collapse } from './reducers/CollapaseReducer'
import { Loading } from './reducers/LoadingReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'hello',
    storage,
    blacklist: ['Loading']
}


// 汇总多个reducer
const AllReducer = combineReducers({
    Collapse,
    Loading
})

// 包装成可持久化的reducer
const persistedReducer = persistReducer(persistConfig, AllReducer)

// 包装成可持久化的store
const store = configureStore({ reducer: persistedReducer })

const persistor = persistStore(store)

export { store, persistor }

/* 
store.dispatch()
store.subsribe()

*/
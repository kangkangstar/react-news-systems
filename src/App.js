import React from "react"
import IndexRouter from "./router/IndexRouter"
import { Provider } from 'react-redux'
import { store, persistor } from "./redux/store"
import './App.css'
import { PersistGate } from 'redux-persist/integration/react'

function App() {
  // 借助Provider包裹，然后传递store
  return <Provider store={store}>
    {/*PersistGate包裹，解决刷新页面后侧边栏出现折叠到不折叠过渡的问题 */}
    <PersistGate loading={null} persistor={persistor}>
      <IndexRouter> </IndexRouter>
    </PersistGate>
  </Provider>
}
export default App
import React from "react"
import IndexRouter from "./router/IndexRouter"
import { Provider } from 'react-redux'
import { store, persistor } from "./redux/store"
import './App.css'
import { PersistGate } from 'redux-persist/integration/react'

function App() {
  // Provider包裹，然后通过传递store
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <IndexRouter> </IndexRouter>
    </PersistGate>
  </Provider>
}
export default App
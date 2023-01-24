import React from 'react'
import ReactDOM from 'react-dom/client';
import Count from './Container/count';
import store from './Redux/store';
import { Provider } from 'react-redux';
const root = ReactDOM.createRoot(document.getElementById('root'))



root.render(
    <Provider store={store}>
        <Count />
    </Provider>
)

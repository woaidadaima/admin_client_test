import React from 'react'
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login'
import Admin from './pages/Admin'
export default function App() {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/*' element={<Admin />} />
        </Routes>
    )
}

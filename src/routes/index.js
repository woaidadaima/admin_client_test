import { Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Categories from "../pages/Categories/category";
import Products from "../pages/Products";
import Bar from "../pages/Charets/Bar";
import Line from "../pages/Charets/Line";
import Pie from "../pages/Charets/Pie";
import Roles from '../pages/Roles'
import Orders from "../pages/Orders";
import Users from '../pages/Users'
import Detail from "../pages/Products/detail";
import AddUpdate from "../pages/Products/add-update";
import NotFound from "../pages/NotFound";
/* 路由表 */
const routes = [
    {
        path: '/home',
        element: <Home />
    },
    {
        path: '/products',
        // element: <Products />,
        children: [
            {
                path: 'category',
                element: <Categories />
            },
            {
                path: 'home',
                element: <Products />,
                children: [
                    {
                        path: 'detail',
                        element: <Detail />
                    },
                    {
                        path: 'addupdate',
                        element: <AddUpdate />
                    }
                ]
            },
        ]
    },
    {
        path: '/user',
        element: <Users />
    },
    {
        path: '/role',
        element: <Roles />
    },
    {
        path: '/charts',
        children: [
            {
                path: 'bar',
                element: <Bar />
            },
            {
                path: 'line',
                element: <Line />
            },
            {
                path: 'pie',
                element: <Pie />
            },
        ]
    },
    {
        path: '/order',
        element: <Orders />
    },
    {
        path: '/',
        element: <Navigate to='/home' />
    },
    {
        path: '/*',
        element: <NotFound />
    }
]
export default routes
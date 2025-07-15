import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import AddCategory from "../pages/AddCategory/AddCategory";
import PrivateRoute from "../routes/PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component:RootLayout,
    children:[
        {
            index:true,
            Component:Home
        },
        {
          path:'addCategory',
          element:<PrivateRoute><AddCategory></AddCategory></PrivateRoute>
        }
    ]
  },
  {
    path:'/',
    Component:AuthLayout,
    children:[
   {
       path:'login',
       Component:Login

   },
   {
    path:'register',
    Component:Register
   }
    ]
  }
]);
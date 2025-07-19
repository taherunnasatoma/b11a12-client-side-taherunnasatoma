import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import AddCategory from "../pages/AddCategory/AddCategory";
import PrivateRoute from "../routes/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import ManageCategory from "../pages/AdminDashboard/ManageCategory/ManageCategory";
import ManageMedicines from "../pages/SellerDashboard/ManageMedicines";
import Shop from "../pages/Shop/Shop";
import CategoryDetails from "../pages/Home/Home/Category/CategoryDetails";
import CartPage from "../pages/Card/CardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: 'addCategory',
        element: <PrivateRoute><AddCategory></AddCategory></PrivateRoute>
      },
      {
        path: 'shop',
        Component: Shop
      },
      {
        path: "category/:categoryName",
        element: <CategoryDetails></CategoryDetails>
      },
       { path: '/cart', 
        element: <PrivateRoute><CartPage></CartPage></PrivateRoute> }
    ]
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: Login

      },
      {
        path: 'register',
        Component: Register
      }
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoute>
      <DashboardLayout></DashboardLayout>
    </PrivateRoute>,
    children: [
      {
        path: 'manageCategory',
        Component: ManageCategory
      },
      {
        path: 'manageMedicines',
        Component: ManageMedicines
      }

    ]
  }
]);
import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";

import PrivateRoute from "../routes/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import ManageCategory from "../pages/AdminDashboard/ManageCategory/ManageCategory";
import ManageMedicines from "../pages/SellerDashboard/ManageMedicines";
import Shop from "../pages/Shop/Shop";
import CategoryDetails from "../pages/Home/Home/Category/CategoryDetails";
import CartPage from "../pages/Card/CardPage";
import Payment from "../pages/Dashboard/Payment/Payment";
import MyOrders from "../pages/UserDasboard/MyOrder/MyOrders";
import InvoicePage from "../pages/UserDasboard/InvoicePage/InvoicePage";
import SellerAdvertisement from "../pages/SellerDashboard/SellerAdvertisement/SellerAdvertisement";
import ManageAdvertisement from "../pages/AdminDashboard/ManageAdvertisement/ManageAdvertisement";
import ManageUsers from "../pages/AdminDashboard/ManageUsers/ManageUsers";
import Forbidden from "../pages/Forbidden/Forbidden";
import AdminRoute from "../routes/AdminRoute";
import PaymentManagement from "../pages/AdminDashboard/PaymentManagement/PaymentManagement";
import SellerPaymentHistory from "../pages/SellerDashboard/SellerPaymentHistory/SellerPaymentHistory";
import AdminSalesReport from "../pages/AdminDashboard/AdminSalesReport/AdminSalesReport";
import AdminHome from "../pages/AdminDashboard/AdminHome/AdminHome";
import SellerHome from "../pages/SellerDashboard/SellerHome/SellerHome";


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
        path: 'shop',
        Component: Shop
      },
      {
        path: "category/:categoryName",
        element: <CategoryDetails></CategoryDetails>
      },
      {
        path: '/cart',
        element: <PrivateRoute><CartPage></CartPage></PrivateRoute>
      },
      {
        path: 'forbidden',
        Component: Forbidden
      }
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
        path: 'manageMedicines',
        Component: ManageMedicines
      },
      {
        path: 'payment',
        Component: Payment
      },
      {
        path: 'myOrders',
        Component: MyOrders
      },
      {
        path: 'invoice/:invoiceNumber',
        Component: InvoicePage
      },
      {
        path: 'adminHome',
        element:<AdminRoute><AdminHome></AdminHome></AdminRoute>
      },
      {
        path: 'manageCategory',
        element:<AdminRoute><ManageCategory></ManageCategory></AdminRoute>
      },
      {
        path: 'manageAdvertise',
       element:<AdminRoute><ManageAdvertisement></ManageAdvertisement></AdminRoute>
      },
      {
        path:'adminSales',
        element:<AdminRoute><AdminSalesReport></AdminSalesReport></AdminRoute>

      },

      {

        path: 'manageUsers',
        element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>

      },
      {

        path: 'paymentManagement',
        element: <AdminRoute><PaymentManagement></PaymentManagement></AdminRoute>

      },
      {
        path: 'sellerAdvertise',
        Component: SellerAdvertisement
      },
      {
        path:'sellerPayment',
        Component:SellerPaymentHistory
      },
      {
        path:'sellerHome',
        Component:SellerHome
      }



    ]
  }
]);
import React from 'react';
import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Layout from './templates/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import RequireAuth from './molecules/RequireAuth';
import Profil from './pages/User/Profil';
import UserList from './pages/User/List';
import Company from './pages/Company';
import MyUserList from './pages/User/MyUserList';
import CreateUser from './pages/User/Create';
import Star from './pages/Star';
import CustomerList from './pages/Customer/List';
import AddCustomer from './pages/Customer/create';
import ProducList from './pages/Product/List';
import ProductCreate from './pages/Product/Create';
import ProductDetail from './pages/Product/Detail';
import ProductEdit from './pages/Product/Edit';
import ProductHistory from './pages/ProductHistory';
import ProcurementHistory from './pages/ProcurementHistory';
import ProductPreview from './pages/Product/Preview';
import OrderList from './pages/Order/List';
import OrderCreate from './pages/Order/Create';
import OrderShow from './pages/Order/Show';
import InvoiceList from './pages/Invoice';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* public route */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/star" element={<Star />} />

        {/* we want to protect these routes */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profil" element={<Profil />} />

          <Route path="/users" element={<UserList />} />
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/users/company" element={<MyUserList />} />
          <Route path="/my/company/:action" element={<Company />} />

          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/create/:action" element={<AddCustomer />} />

          <Route path="/products" element={<ProducList />} />
          <Route path="/products/create" element={<ProductCreate />} />
          <Route path="/products/show/:id/:slug" element={<ProductDetail />} />
          <Route path="/products/edit/:id/:slug" element={<ProductEdit />} />
          <Route path="/products/history/all" element={<ProductHistory />} />
          <Route path='/products/procurements' element={<ProcurementHistory />} />
          <Route path='/products/preview/list' element={<ProductPreview />} />

          <Route path='/orders' element={<OrderList />} />
          <Route path='/orders/create' element={<OrderCreate />} />
          <Route path='/orders/show/:id/:reference' element={<OrderShow />} />

          <Route path='/invoices' element={<InvoiceList />} />
          
          {/* orders/show */}
          {/* custumers/create */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App;

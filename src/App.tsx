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
          {/* custumers/create */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App;

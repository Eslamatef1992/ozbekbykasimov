import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import MenuItems from './pages/MenuItems';
import Orders from './pages/Orders';
import Reservations from './pages/Reservations';
import Users from './pages/Users';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="menu-items" element={<MenuItems />} />
        <Route path="orders" element={<Orders />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

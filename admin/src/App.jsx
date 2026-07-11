import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import MenuItems from './pages/MenuItems';
import MenuItemForm from './pages/MenuItemForm';
import Orders from './pages/Orders';
import Reservations from './pages/Reservations';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Admins from './pages/Admins';
import AdminForm from './pages/AdminForm';
import Coupons from './pages/Coupons';
import Extras from './pages/Extras';
import SocialLinks from './pages/SocialLinks';
import DeliveryAreas from './pages/DeliveryAreas';

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
        <Route path="menu-items/new" element={<MenuItemForm />} />
        <Route path="menu-items/:id/edit" element={<MenuItemForm />} />
        <Route path="orders" element={<Orders />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admins" element={<Admins />} />
        <Route path="admins/new" element={<AdminForm />} />
        <Route path="admins/:id/edit" element={<AdminForm />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="extras" element={<Extras />} />
        <Route path="social-links" element={<SocialLinks />} />
        <Route path="delivery-areas" element={<DeliveryAreas />} />
      </Route>
    </Routes>
  );
}

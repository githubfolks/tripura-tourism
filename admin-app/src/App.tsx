import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Destinations } from './pages/Destinations';
import { Packages } from './pages/Packages';
import { Bookings } from './pages/Bookings';
import { Settlements } from './pages/Settlements'; // New page

// System Pages
import { Roles } from './pages/system/Roles';
import { Permissions } from './pages/system/Permissions';
import { RolePermissions } from './pages/system/RolePermissions';
import { UserActivityLogs } from './pages/system/UserActivityLogs';
import { Amenities } from './pages/system/Amenities';

// Partner Pages
import { ApiPartners } from './pages/partners/ApiPartners';
import { ApiCredentials } from './pages/partners/ApiCredentials';
import { ApiAccessLogs } from './pages/partners/ApiAccessLogs';
import { OnboardPartner } from './pages/partners/OnboardPartner';

// CRUD Pages
import { BookingDetails } from './pages/BookingDetails';
import { CreateDestination } from './pages/CreateDestination';
import { CreatePackage } from './pages/CreatePackage';
import { CreateUser } from './pages/CreateUser';

// Placeholder components for routes we haven't built yet
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-4 bg-white rounded-lg shadow border border-slate-200">
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p className="text-slate-500">This module is under construction.</p>
  </div>
);

// Protected Route Component
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// Admin Only Route
function AdminRoute() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="bookings/:id" element={<BookingDetails />} />
              <Route path="settlements" element={<Settlements />} />

              {/* Admin Only Routes */}
              <Route element={<AdminRoute />}>
                <Route path="users" element={<Users />} />
                <Route path="users/new" element={<CreateUser />} />

                <Route path="destinations" element={<Destinations />} />
                <Route path="destinations/new" element={<CreateDestination />} />

                <Route path="packages" element={<Packages />} />
                <Route path="packages/new" element={<CreatePackage />} />

                <Route path="bookmarks" element={<Placeholder title="Bookmarks" />} />
                <Route path="reports" element={<Placeholder title="Reports & Analytics" />} />

                {/* System Routes */}
                <Route path="system/roles" element={<Roles />} />
                <Route path="system/permissions" element={<Permissions />} />
                <Route path="system/role-permissions" element={<RolePermissions />} />
                <Route path="system/logs" element={<UserActivityLogs />} />
                <Route path="system/amenities" element={<Amenities />} />

                {/* Partner Routes */}
                <Route path="partners" element={<ApiPartners />} />
                <Route path="partners/onboard" element={<OnboardPartner />} />
                <Route path="partners/credentials" element={<ApiCredentials />} />
                <Route path="partners/logs" element={<ApiAccessLogs />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import Sidebar from '../components/admin/Sidebar';

export default function AdminLayout() {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">chargement...</div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-800">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 max-w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

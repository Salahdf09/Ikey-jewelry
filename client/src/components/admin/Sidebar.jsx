import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, LogOut } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const links = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/produits', label: 'Produits', icon: Package },
  { to: '/admin/commandes', label: 'Commandes', icon: ClipboardList },
];

export default function Sidebar() {
  const { admin, logout } = useAdminAuth();

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-200 flex flex-col min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="font-semibold text-white">ikey. admin</span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`
            }
          >
            <Icon size={17} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div className="px-3 py-2 text-xs text-slate-500 truncate">{admin?.email}</div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors"
        >
          <LogOut size={17} strokeWidth={1.75} />
          déconnexion
        </button>
      </div>
    </aside>
  );
}

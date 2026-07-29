import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth.store';
import { SITE_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/posts', label: 'Posts' },
    { to: '/admin/comments', label: 'Comments' },
    { to: '/admin/media', label: 'Media' },
    { to: '/admin/categories', label: 'Categories' },
    { to: '/admin/tags', label: 'Tags' },
    { to: '/admin/profile', label: 'Profile' },
    { to: '/admin/password', label: 'Password' },
    { to: '/admin/settings', label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 border-r border-border bg-card p-4 transform transition-transform duration-200 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-6 flex items-center justify-between">
          <Link to="/admin" className="text-lg font-bold">{SITE_NAME} Admin</Link>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="rounded-md px-3 py-2 text-sm hover:bg-muted" onClick={() => setSidebarOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></button>
            <span className="text-sm text-foreground/70">Welcome, {user?.name ?? 'User'}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

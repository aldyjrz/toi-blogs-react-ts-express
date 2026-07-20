import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth.store';
import { SITE_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/posts', label: 'Posts' },
    { to: '/admin/categories', label: 'Categories' },
    { to: '/admin/tags', label: 'Tags' },
    { to: '/admin/media', label: 'Media' },
    { to: '/admin/settings', label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 border-r border-border bg-card p-4 hidden md:block">
        <Link to="/admin" className="mb-6 block text-lg font-bold">{SITE_NAME} Admin</Link>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="rounded-md px-3 py-2 text-sm hover:bg-muted">
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm text-foreground/70">Welcome, {user?.name ?? 'User'}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

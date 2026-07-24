import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { SITE_NAME } from '@/lib/constants';

export function BlogLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-bold">{SITE_NAME}</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/blog" className="hover:underline">Blog</Link>
            <Link to="/about" className="hover:underline">About</Link>
             <Link to="/contact" className="hover:underline">Contact</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link to="/privacy-policy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/disclaimer" className="hover:underline">Disclaimer</Link>
            <Link to="/rss.xml" className="hover:underline">RSS</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

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
            <Link to="/about" className="hover:underline">About me?</Link>
             <Link to="/contact" className="hover:underline">Contact</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-bold">{SITE_NAME}</h3>
              <p className="text-sm text-foreground/70">AldyTois blog for sharing insights, tutorials, and stories.</p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-foreground/70 hover:underline">Home</Link></li>
                <li><Link to="/blog" className="text-foreground/70 hover:underline">Blog</Link></li>
                <li><Link to="/about" className="text-foreground/70 hover:underline">About</Link></li>
                <li><Link to="/contact" className="text-foreground/70 hover:underline">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/blog" className="text-foreground/70 hover:underline">All Posts</Link></li>
                <li><Link to="/privacy-policy" className="text-foreground/70 hover:underline">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-foreground/70 hover:underline">Terms of Service</Link></li>
                <li><Link to="/disclaimer" className="text-foreground/70 hover:underline">Disclaimer</Link></li>
              </ul>
            </div>
             
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-foreground/60">
            <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { SITE_NAME } from '@/lib/constants';

export default function Header() {
    return (
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
    )
}
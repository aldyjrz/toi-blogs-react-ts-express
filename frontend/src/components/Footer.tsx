import { Link } from 'react-router-dom';
import { SITE_NAME } from '@/lib/constants';

export default function Footer() {
    return (
        <footer className="border-t border-border">
            <div className="mx-auto max-w-5xl px-4 py-12">
                <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
                    {/* Kiri */}
                    <div className="max-w-sm">
                        <h3 className="mb-4 text-lg font-bold">{SITE_NAME}</h3>
                        <p className="text-sm text-foreground/70">
                            AldyTois blog for sharing insights, tutorials, and stories.
                        </p>
                    </div>

                    {/* Kanan */}
                    <div className="flex gap-12">
                        <div>
                            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                                Quick Links
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/blog">Blog</Link></li>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                                Categories
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/blog">All Posts</Link></li>
                                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                                <li><Link to="/terms">Terms of Service</Link></li>
                                <li><Link to="/disclaimer">Disclaimer</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-border pt-8 text-center text-sm text-foreground/60">
                    <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

import { Link } from 'react-router-dom';
import { Seo } from '@/components/Seo';

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" noindex />
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-foreground/70">The page you are looking for does not exist.</p>
        <Link to="/" className="mt-6 rounded-md bg-primary px-5 py-2 text-sm text-background">Back to home</Link>
      </section>
    </>
  );
}

import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth.store';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Seo } from '@/components/Seo';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@blog.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError((err as { message?: string }).message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Admin Login" noindex />
      <div className="flex min-h-screen items-center justify-center px-4">
        <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-border bg-card p-6">
          <h1 className="mb-6 text-2xl font-bold">Sign in</h1>
          {error && <p className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</p>}
          <div className="space-y-3">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Signing in…' : 'Sign in'}</Button>
          </div>
          
        </form>
      </div>
    </>
  );
}

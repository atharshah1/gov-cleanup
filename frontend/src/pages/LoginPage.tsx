import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { dashboardPathForRole, isUserRole, loginPathForRole, roleLabel, signupPathForRole, USER_ROLES } from '../lib/navigation';
import type { LoginResponse, UserRole } from '../lib/types';
import { useSessionStore } from '../store/session';

export function LoginPage() {
  const { role: roleParam } = useParams();
  const navigate = useNavigate();
  const user = useSessionStore((state) => state.user);
  const setSession = useSessionStore((state) => state.setSession);
  const expectedRole: UserRole | null = isUserRole(roleParam) ? roleParam : null;
  const hasInvalidRolePath = Boolean(roleParam && !expectedRole);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user && (!expectedRole || user.role === expectedRole)) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />;
  }

  if (hasInvalidRolePath) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-6 py-10">
        <section className="glass-card w-full max-w-lg rounded-[2rem] p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose-600">Invalid portal</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">Unknown login role</h1>
          <p className="mt-4 text-slate-600">Use one of the supported role portals below.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {USER_ROLES.map((role) => (
              <Link key={role} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white" to={loginPathForRole(role)}>
                {roleLabel(role)} login
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const response = await api.post<LoginResponse>('/auth/login', { phone, password });
      if (expectedRole && response.data.user.role !== expectedRole) {
        setErrorMessage(`This portal is only for ${roleLabel(expectedRole)} accounts. Please use the correct login.`);
        return;
      }
      setSession(response.data.access_token, response.data.user);
      navigate(dashboardPathForRole(response.data.user.role));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-6 py-10">
      <section className="glass-card w-full max-w-md rounded-[2rem] p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600">Welcome back</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">
          {expectedRole ? `${roleLabel(expectedRole)} login` : 'Login to EcoSync'}
        </h1>
        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">Phone<input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="+1 555 0100" value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Password
            <div className="relative">
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          <div className="flex items-center justify-between gap-4">
            <Link className="text-sm font-bold text-emerald-700" to="/forgot-password">Forgot password?</Link>
            <button className="rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-60" type="submit" disabled={isSubmitting}>Login</button>
          </div>
        </form>
        {errorMessage ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p> : null}
        <p className="mt-6 text-sm text-slate-600">
          Need an account?{' '}
          <Link className="font-bold text-emerald-700" to={expectedRole ? signupPathForRole(expectedRole) : '/signup'}>
            Register here
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          {USER_ROLES.map((role) => (
            <Link key={role} className="rounded-full bg-white px-3 py-1.5 font-semibold text-slate-700" to={loginPathForRole(role)}>
              {roleLabel(role)} portal
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

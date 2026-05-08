import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-6 py-10">
      <section className="glass-card w-full max-w-md rounded-[2rem] p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600">Welcome back</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Login to EcoSync</h1>
        <form className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">Phone<input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="+1 555 0100" /></label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">Password<input className="rounded-2xl border border-slate-200 px-4 py-3" type="password" placeholder="••••••••" /></label>
          <button className="rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white" type="button">Login</button>
        </form>
        <p className="mt-6 text-sm text-slate-600">New household? <Link className="font-bold text-emerald-700" to="/register">Register here</Link>.</p>
      </section>
    </main>
  );
}

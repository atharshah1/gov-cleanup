import { Link } from 'react-router-dom';

export function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="glass-card mx-auto max-w-2xl rounded-[2rem] p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600">Household verification</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Register for smart waste pickups</h1>
        <form className="mt-8 grid gap-4 sm:grid-cols-2">
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Full name" />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Phone" />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email" />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" type="password" placeholder="Password" />
          <textarea className="rounded-2xl border border-slate-200 px-4 py-3 sm:col-span-2" placeholder="Household address" rows={4} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3 sm:col-span-2" placeholder="Electricity bill file path or upload URL" />
          <button className="rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white sm:col-span-2" type="button">Request OTP & Register</button>
        </form>
        <p className="mt-6 text-sm text-slate-600">Already registered? <Link className="font-bold text-emerald-700" to="/login">Login</Link>.</p>
      </section>
    </main>
  );
}

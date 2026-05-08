import { ArrowRight, BarChart3, MapPinned, Recycle, ShieldCheck, Truck, UsersRound } from 'lucide-react';
import { Route, Routes } from 'react-router-dom';

const metrics = [
  { label: 'Smart pickups', value: '24/7', icon: Truck },
  { label: 'Verified households', value: '18k+', icon: ShieldCheck },
  { label: 'Waste streams', value: '4', icon: Recycle },
  { label: 'Live insights', value: '99%', icon: BarChart3 }
];

function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <section className="relative isolate px-6 py-10 sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-ecosync-gradient opacity-90" />
        <div className="absolute left-1/2 top-10 -z-10 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-emerald-600">
              <Recycle className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">EcoSync</span>
          </div>
          <a className="hidden rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-civic-mint sm:inline-flex" href="/login">
            Municipal login
          </a>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              Smart city waste operations in one platform
            </p>
            <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Cleaner neighborhoods with intelligent pickup coordination.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-cyan-50/90">
              EcoSync connects citizens, drivers, and municipal administrators with verified households, pickup scheduling, complaints, rewards, route visibility, and analytics.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white shadow-xl transition hover:-translate-y-0.5" href="/register">
                Register household <ArrowRight className="h-5 w-5" />
              </a>
              <a className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/15 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/25" href="/dashboard">
                View dashboard
              </a>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6 text-slate-900">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-200">Live route</p>
                  <h2 className="text-2xl font-bold">Ward 12 Collection</h2>
                </div>
                <MapPinned className="h-8 w-8 text-emerald-300" />
              </div>
              <div className="grid gap-3">
                {['Verified request', 'Driver assigned', 'Wet waste collected', 'Reward issued'].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-400 font-bold text-slate-950">{index + 1}</span>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {metrics.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-3xl bg-white/80 p-4">
                  <Icon className="mb-3 h-6 w-6 text-emerald-600" />
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-sm text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-6">
      <section className="glass-card max-w-xl rounded-[2rem] p-8 text-center">
        <UsersRound className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
        <h1 className="text-3xl font-black text-slate-950">{title}</h1>
        <p className="mt-3 text-slate-600">This route is reserved for the next EcoSync implementation task tracked in tasks.json.</p>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PlaceholderPage title="Login" />} />
      <Route path="/register" element={<PlaceholderPage title="Register" />} />
      <Route path="/dashboard" element={<PlaceholderPage title="Role dashboard" />} />
    </Routes>
  );
}

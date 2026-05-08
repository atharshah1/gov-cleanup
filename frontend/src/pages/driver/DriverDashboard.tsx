import { MapPinned, Navigation, PackageCheck, Truck } from 'lucide-react';
import { StatCard } from '../../components/StatCard';

const stops = ['Sector 4 wet waste', 'Library dry waste', 'Civic block e-waste'];

export function DriverDashboard() {
  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Assigned pickups" value="12" icon={Truck} />
        <StatCard label="Completed today" value="8" icon={PackageCheck} tone="blue" />
        <StatCard label="Route efficiency" value="91%" icon={Navigation} tone="amber" />
      </div>
      <article className="glass-card rounded-[2rem] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Route Management</h2>
            <p className="text-slate-600">Optimized stop list with status updates.</p>
          </div>
          <MapPinned className="h-10 w-10 text-emerald-600" />
        </div>
        <div className="mt-6 grid gap-3">
          {stops.map((stop, index) => (
            <div key={stop} className="flex items-center justify-between rounded-2xl bg-white/80 p-4">
              <span className="font-bold text-slate-800">{index + 1}. {stop}</span>
              <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">Update status</button>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

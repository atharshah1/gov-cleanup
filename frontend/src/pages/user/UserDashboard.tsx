import { Gift, MessageSquareWarning, Recycle, Truck } from 'lucide-react';
import { EmptyState } from '../../components/EmptyState';
import { SkeletonCard } from '../../components/SkeletonCard';
import { StatCard } from '../../components/StatCard';

export function UserDashboard() {
  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Upcoming pickups" value="2" icon={Truck} />
        <StatCard label="Reward points" value="460" icon={Gift} tone="amber" />
        <StatCard label="Recycled kg" value="128" icon={Recycle} tone="blue" />
        <StatCard label="Open complaints" value="1" icon={MessageSquareWarning} tone="rose" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="glass-card rounded-[2rem] p-6">
          <h2 className="text-2xl font-black text-slate-950">Schedule Pickup</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <select className="rounded-2xl border border-slate-200 px-4 py-3"><option>Wet waste</option><option>Dry waste</option><option>E-waste</option><option>Bulky</option></select>
            <input className="rounded-2xl border border-slate-200 px-4 py-3" type="date" />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" type="time" />
            <button className="rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white">Schedule</button>
          </div>
        </article>
        <SkeletonCard />
      </div>
      <EmptyState title="No completed pickups yet" description="Completed route history and recycling rewards will appear here." />
    </section>
  );
}

import { BarChart3, CircleAlert, Truck, UsersRound } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StatCard } from '../../components/StatCard';

const data = [
  { area: 'Ward 1', pickups: 64 },
  { area: 'Ward 2', pickups: 48 },
  { area: 'Ward 3', pickups: 72 },
  { area: 'Ward 4', pickups: 55 }
];

export function AdminDashboard() {
  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Verified users" value="18k" icon={UsersRound} />
        <StatCard label="Active drivers" value="42" icon={Truck} tone="blue" />
        <StatCard label="Open complaints" value="17" icon={CircleAlert} tone="rose" />
        <StatCard label="Pickup efficiency" value="93%" icon={BarChart3} tone="amber" />
      </div>
      <article className="glass-card rounded-[2rem] p-6">
        <h2 className="text-2xl font-black text-slate-950">Area-wise analytics</h2>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pickups" fill="#10b981" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}

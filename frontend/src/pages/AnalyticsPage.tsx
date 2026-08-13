import React, { useState } from 'react';
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users, Calendar, TrendingUp, DollarSign,
  Activity, UserCheck, ArrowUpRight, ArrowDownRight,
  Stethoscope, BarChart2, PieChart as PieIcon, Lock,
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAnalytics } from '../hooks/useAnalytics';

// ─── Custom Tooltip ───────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur border border-white/10 rounded-xl p-3 shadow-2xl">
        <p className="text-slate-400 text-xs font-medium mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-300 capitalize">{entry.name}:</span>
            <span className="text-white font-semibold">
              {typeof entry.value === 'number' && entry.name?.toLowerCase().includes('revenue')
                ? `ETB ${entry.value.toLocaleString()}`
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Summary Card ─────────────────────────────────────────────
interface SummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: number;
  gradient: string;
  delay?: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title, value, subtitle, icon, trend, gradient, delay = 0,
}) => (
  <div
    className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl"
    style={{
      background: gradient,
      animationDelay: `${delay}ms`,
    }}
  >
    {/* decorative blob */}
    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
    <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5 blur-2xl" />

    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-extrabold tracking-tight mt-1">{value}</p>
        <p className="text-white/60 text-xs mt-2">{subtitle}</p>
      </div>
      <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm">
        {icon}
      </div>
    </div>

    {trend !== undefined && (
      <div className={`relative z-10 flex items-center gap-1 mt-4 text-xs font-semibold ${trend >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
        {trend >= 0
          ? <ArrowUpRight size={14} />
          : <ArrowDownRight size={14} />}
        {Math.abs(trend)}% vs last month
      </div>
    )}
  </div>
);

// ─── Section Header ───────────────────────────────────────────
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({
  icon, title, subtitle,
}) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2.5 bg-sky-50 rounded-xl text-sky-500">{icon}</div>
    <div>
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  </div>
);

// ─── Chart Card ───────────────────────────────────────────────
const ChartCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ${className}`}>
    {children}
  </div>
);

// ─── Specialization Row ───────────────────────────────────────
const SpecRow: React.FC<{ name: string; count: number; pct: number; color: string }> = ({
  name, count, pct, color,
}) => (
  <div className="flex items-center gap-3">
    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
    <span className="text-sm text-slate-700 flex-1 truncate">{name}</span>
    <span className="text-sm font-semibold text-slate-800 w-8 text-right">{count}</span>
    <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
    </div>
    <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
  </div>
);

// ─── Loading Skeleton ─────────────────────────────────────────
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

// ─── Main Page ────────────────────────────────────────────────
const AnalyticsPage: React.FC = () => {
  const { data, isLoading, error, canViewAnalytics } = useAnalytics();
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');

  // ── Access guard ──────────────────────────────────────────
  if (!canViewAnalytics) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <div className="p-5 bg-red-50 rounded-full">
            <Lock size={40} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-700">Access Restricted</h2>
          <p className="text-slate-500 text-center max-w-sm">
            Analytics are available to <strong>Admin</strong> and <strong>Doctor</strong> roles only.
          </p>
        </div>
      </Layout>
    );
  }

  // ── Loading state ─────────────────────────────────────────
  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-72" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
          <Skeleton className="h-80" />
        </div>
      </Layout>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (error || !data) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-red-500">{error || 'No data available.'}</p>
        </div>
      </Layout>
    );
  }

  const { summary, weeklyAppointments, patientGrowth, specializationBreakdown } = data;

  return (
    <Layout>
      <div className="space-y-8">

        {/* ── Page Header ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Analytics{' '}
              <span className="bg-gradient-to-r from-sky-500 to-emerald-600 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Real-time insights for NovaCare Clinic · Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'weekly'
                  ? 'bg-white text-sky-500 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'monthly'
                  ? 'bg-white text-sky-500 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* ── Summary Cards ────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <SummaryCard
            title="Active Patients"
            value={(summary?.activePatients ?? 0).toLocaleString()}
            subtitle={`${(summary?.totalPatients ?? 0).toLocaleString()} total registered`}
            icon={<UserCheck size={22} />}
            trend={summary?.patientGrowthRate ?? 0}
            gradient="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
            delay={0}
          />
          <SummaryCard
            title="Total Appointments"
            value={(summary?.totalAppointments ?? 0).toLocaleString()}
            subtitle={`${(summary?.completedAppointments ?? 0).toLocaleString()} completed`}
            icon={<Calendar size={22} />}
            trend={8.2}
            gradient="linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)"
            delay={100}
          />
          <SummaryCard
            title="Monthly Revenue"
            value={`ETB ${(summary?.monthlyRevenue ?? 0).toLocaleString()}`}
            subtitle={`ETB ${(summary?.totalRevenue ?? 0).toLocaleString()} lifetime`}
            icon={<DollarSign size={22} />}
            trend={15.3}
            gradient="linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)"
            delay={200}
          />
          <SummaryCard
            title="Daily Average"
            value={`${summary?.avgAppointmentsPerDay ?? 0}`}
            subtitle="appointments per day"
            icon={<Activity size={22} />}
            trend={4.1}
            gradient="linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
            delay={300}
          />
        </div>

        {/* ── Row 2: Appointments Chart + Specialization ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Appointments per Week — Area + Bar combo */}
          <ChartCard className="lg:col-span-2">
            <SectionHeader
              icon={<BarChart2 size={20} />}
              title="Appointments per Week"
              subtitle="Booked vs completed vs cancelled"
            />
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={weeklyAppointments} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradBooked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  name="Booked"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#gradBooked)"
                  dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#gradCompleted)"
                  dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
                <Area
                  type="monotone"
                  dataKey="cancelled"
                  name="Cancelled"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="none"
                  strokeDasharray="4 3"
                  dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Specialization Breakdown — Pie + list */}
          <ChartCard>
            <SectionHeader
              icon={<PieIcon size={20} />}
              title="By Specialization"
              subtitle="Doctor distribution"
            />
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={specializationBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {specializationBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl">
                          <p className="font-semibold">{d.specialization}</p>
                          <p className="text-gray-300">{d.count} doctors · {d.percentage}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend list */}
            <div className="mt-3 space-y-2.5">
              {specializationBreakdown.map((s, i) => (
                <SpecRow
                  key={i}
                  name={s.specialization}
                  count={s.count}
                  pct={s.percentage}
                  color={s.fill}
                />
              ))}
            </div>
          </ChartCard>
        </div>

        {/* ── Row 3: Patient Growth ────────────────────────── */}
        <ChartCard>
          <SectionHeader
            icon={<TrendingUp size={20} />}
            title="Patient Growth"
            subtitle="Total registered patients & new sign-ups over 8 months"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bar chart */}
            <div className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={patientGrowth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
                  />
                  <Bar dataKey="patients" name="Total Patients" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="newPatients" name="New Patients" fill="#a5b4fc" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radial summary */}
            <div className="flex flex-col items-center justify-center gap-4">
              <ResponsiveContainer width="100%" height={180}>
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="30%" outerRadius="90%"
                  data={[
                    { name: 'Active', value: Math.round((summary.activePatients / summary.totalPatients) * 100), fill: '#6366f1' },
                    { name: 'Completed', value: Math.round((summary.completedAppointments / summary.totalAppointments) * 100), fill: '#10b981' },
                    { name: 'Growth', value: summary.patientGrowthRate, fill: '#f59e0b' },
                  ]}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#f3f4f6' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2">
                            <p className="font-semibold">{d.name}</p>
                            <p className="text-gray-300">{d.value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>

              <div className="space-y-2 w-full">
                {[
                  { label: 'Active Rate', value: `${Math.round((summary.activePatients / summary.totalPatients) * 100)}%`, color: '#6366f1' },
                  { label: 'Completion Rate', value: `${Math.round((summary.completedAppointments / summary.totalAppointments) * 100)}%`, color: '#10b981' },
                  { label: 'Growth Rate', value: `${summary.patientGrowthRate}%`, color: '#f59e0b' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-slate-600">{item.label}</span>
                    </div>
                    <span className="font-bold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>

        {/* ── Row 4: Quick Stats strip ─────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Doctors', value: specializationBreakdown.reduce((a, b) => a + b.count, 0), icon: <Stethoscope size={18} />, color: 'text-sky-500 bg-sky-50' },
            { label: 'Specializations', value: specializationBreakdown.length, icon: <PieIcon size={18} />, color: 'text-sky-600 bg-violet-50' },
            { label: 'Avg. Daily Visits', value: summary.avgAppointmentsPerDay, icon: <Activity size={18} />, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Patient Growth', value: `+${summary.patientGrowthRate}%`, icon: <TrendingUp size={18} />, color: 'text-amber-600 bg-amber-50' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
              <div className={`p-2.5 rounded-xl ${item.color}`}>{item.icon}</div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">{item.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
};

export default AnalyticsPage;

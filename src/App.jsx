import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Filter,
  HeartPulse,
  Layers,
  MapPinned,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ActiveLink Demo Dashboard
// Single-file React showcase prototype (fake data, no backend)
// TailwindCSS + Framer Motion + Recharts

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const centres = [
  {
    id: "northview",
    name: "Northview Community Centre",
    city: "London, ON",
    audience: "Adults 20–40",
    baselineRetention: 41,
    activeLinkRetention: 63,
    reEnrollBaseline: 22,
    reEnrollActiveLink: 39,
    avgWeeklyAttendance: 118,
    subsidyUptake: 27,
    costPerRetainedParticipant: 46,
    cohorts: [
      {
        id: "NV-MOB-01",
        title: "Mobility + Strength (Beginner)",
        instructor: "Samir K.",
        dayTime: "Tue 6:00 PM",
        weeks: 8,
        capacity: 12,
        enrolled: 12,
        attendanceRate: 78,
        retentionRate: 67,
        waitlist: 5,
        status: "Active",
        subsidySeats: 4,
        subsidyFilled: 3,
        milestone4: 9,
        milestone8: 0,
      },
      {
        id: "NV-WALK-02",
        title: "Walk + Low-Impact Conditioning",
        instructor: "Leila M.",
        dayTime: "Thu 7:00 PM",
        weeks: 8,
        capacity: 15,
        enrolled: 14,
        attendanceRate: 72,
        retentionRate: 61,
        waitlist: 2,
        status: "Active",
        subsidySeats: 6,
        subsidyFilled: 5,
        milestone4: 10,
        milestone8: 0,
      },
      {
        id: "NV-CORE-03",
        title: "Core + Cardio Reset",
        instructor: "Devon P.",
        dayTime: "Sat 10:30 AM",
        weeks: 6,
        capacity: 10,
        enrolled: 8,
        attendanceRate: 69,
        retentionRate: 56,
        waitlist: 0,
        status: "Recruiting",
        subsidySeats: 3,
        subsidyFilled: 1,
        milestone4: 0,
        milestone8: 0,
      },
    ],
    retentionCurve: [
      { week: "W1", baseline: 100, activeLink: 100 },
      { week: "W2", baseline: 68, activeLink: 84 },
      { week: "W3", baseline: 59, activeLink: 79 },
      { week: "W4", baseline: 53, activeLink: 74 },
      { week: "W5", baseline: 49, activeLink: 71 },
      { week: "W6", baseline: 45, activeLink: 68 },
      { week: "W7", baseline: 43, activeLink: 65 },
      { week: "W8", baseline: 41, activeLink: 63 },
    ],
    timeslotUtilization: [
      { slot: "Weekday AM", before: 34, after: 42 },
      { slot: "Weekday PM", before: 62, after: 81 },
      { slot: "Weekend AM", before: 51, after: 74 },
      { slot: "Weekend PM", before: 29, after: 38 },
    ],
    subsidyBreakdown: [
      { name: "Standard", value: 73 },
      { name: "Sliding Scale", value: 17 },
      { name: "Voucher", value: 10 },
    ],
    nudges: [
      { id: 1, type: "Reminder", channel: "SMS", sent: 264, openRate: 96, responseRate: 18, outcome: "Attendance confirmation" },
      { id: 2, type: "Missed-session follow-up", channel: "SMS", sent: 53, openRate: 94, responseRate: 41, outcome: "Return next week" },
      { id: 3, type: "Milestone prompt", channel: "SMS", sent: 89, openRate: 97, responseRate: 24, outcome: "Reward redemption" },
    ],
    weekFlow: [
      { label: "Registered", value: 142 },
      { label: "Placed in cohort", value: 132 },
      { label: "Attended W1", value: 126 },
      { label: "Reached W4", value: 93 },
      { label: "Completed", value: 79 },
      { label: "Re-enrolled", value: 49 },
    ],
    personas: [
      {
        name: "Alex (31)",
        profile: "Shift-based worker, inconsistent schedule",
        barrier: "Misses after one disrupted week",
        intervention: "Missed-session re-entry SMS + Thursday swap option",
        result: "Returned in Week 3 and completed 7/8 sessions",
      },
      {
        name: "Maya (28)",
        profile: "New parent, cost-sensitive",
        barrier: "Fee friction + uncertainty about commitment",
        intervention: "Sliding-scale seat + commitment rebate",
        result: "Completed cohort and used rebate on next enrollment",
      },
      {
        name: "Chris (37)",
        profile: "Desk job, low energy after work",
        barrier: "Decision fatigue",
        intervention: "Fixed cohort slot + reminders + milestone rewards",
        result: "Built weekly routine and re-enrolled",
      },
    ],
  },
  {
    id: "riverside",
    name: "Riverside Recreation Hub",
    city: "Kitchener, ON",
    audience: "Adults 20–40",
    baselineRetention: 38,
    activeLinkRetention: 58,
    reEnrollBaseline: 18,
    reEnrollActiveLink: 34,
    avgWeeklyAttendance: 96,
    subsidyUptake: 22,
    costPerRetainedParticipant: 51,
    cohorts: [
      {
        id: "RV-STR-01",
        title: "Strength Foundations",
        instructor: "Priya S.",
        dayTime: "Mon 7:30 PM",
        weeks: 8,
        capacity: 14,
        enrolled: 13,
        attendanceRate: 74,
        retentionRate: 59,
        waitlist: 3,
        status: "Active",
        subsidySeats: 4,
        subsidyFilled: 3,
        milestone4: 8,
        milestone8: 0,
      },
      {
        id: "RV-FLEX-02",
        title: "Mobility Reset After Work",
        instructor: "Noah L.",
        dayTime: "Wed 6:30 PM",
        weeks: 6,
        capacity: 12,
        enrolled: 10,
        attendanceRate: 70,
        retentionRate: 54,
        waitlist: 0,
        status: "Active",
        subsidySeats: 3,
        subsidyFilled: 2,
        milestone4: 6,
        milestone8: 0,
      },
      {
        id: "RV-WALK-03",
        title: "Weekend Walking Cohort",
        instructor: "Farah A.",
        dayTime: "Sat 9:00 AM",
        weeks: 8,
        capacity: 18,
        enrolled: 17,
        attendanceRate: 77,
        retentionRate: 62,
        waitlist: 4,
        status: "Active",
        subsidySeats: 7,
        subsidyFilled: 5,
        milestone4: 12,
        milestone8: 0,
      },
    ],
    retentionCurve: [
      { week: "W1", baseline: 100, activeLink: 100 },
      { week: "W2", baseline: 65, activeLink: 82 },
      { week: "W3", baseline: 56, activeLink: 74 },
      { week: "W4", baseline: 49, activeLink: 68 },
      { week: "W5", baseline: 45, activeLink: 64 },
      { week: "W6", baseline: 42, activeLink: 61 },
      { week: "W7", baseline: 40, activeLink: 59 },
      { week: "W8", baseline: 38, activeLink: 58 },
    ],
    timeslotUtilization: [
      { slot: "Weekday AM", before: 28, after: 35 },
      { slot: "Weekday PM", before: 58, after: 76 },
      { slot: "Weekend AM", before: 48, after: 71 },
      { slot: "Weekend PM", before: 25, after: 31 },
    ],
    subsidyBreakdown: [
      { name: "Standard", value: 78 },
      { name: "Sliding Scale", value: 14 },
      { name: "Voucher", value: 8 },
    ],
    nudges: [
      { id: 1, type: "Reminder", channel: "SMS", sent: 219, openRate: 95, responseRate: 16, outcome: "Attendance confirmation" },
      { id: 2, type: "Missed-session follow-up", channel: "SMS", sent: 61, openRate: 92, responseRate: 35, outcome: "Return next week" },
      { id: 3, type: "Milestone prompt", channel: "SMS", sent: 73, openRate: 96, responseRate: 21, outcome: "Reward redemption" },
    ],
    weekFlow: [
      { label: "Registered", value: 119 },
      { label: "Placed in cohort", value: 111 },
      { label: "Attended W1", value: 104 },
      { label: "Reached W4", value: 75 },
      { label: "Completed", value: 64 },
      { label: "Re-enrolled", value: 38 },
    ],
    personas: [
      {
        name: "Jordan (26)",
        profile: "Early-career, long commute",
        barrier: "Late workday unpredictability",
        intervention: "2-hour reminder + quick swap to Saturday cohort",
        result: "Stayed engaged after schedule change",
      },
      {
        name: "Nina (34)",
        profile: "Returning to activity after injury",
        barrier: "Low confidence",
        intervention: "Small cohort accountability + milestone rewards",
        result: "Completed program and referred a friend",
      },
      {
        name: "Owen (39)",
        profile: "Busy parent",
        barrier: "Drop-off after missing Week 2",
        intervention: "Missed-you SMS + no-shame re-entry",
        result: "Returned Week 3 and hit Week 8 completion",
      },
    ],
  },
];

const tabs = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "cohorts", label: "Cohorts", icon: Users },
  { id: "equity", label: "Equity & Subsidy", icon: Wallet },
  { id: "automation", label: "Nudges", icon: Bell },
  { id: "impact", label: "Impact", icon: HeartPulse },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ className = "", children }) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {subtitle ? <div className="mt-1 text-xs text-slate-500">{subtitle}</div> : null}
      </div>
      {right}
    </div>
  );
}

function Badge({ children, tone = "default" }) {
  const map = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    purple: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", map[tone])}>
      {children}
    </span>
  );
}

function MetricCard({ title, value, sub, icon: Icon, tone = "blue", trend }) {
  const toneMap = {
    blue: "from-blue-50 to-blue-100/40 text-blue-700 border-blue-200",
    green: "from-emerald-50 to-emerald-100/40 text-emerald-700 border-emerald-200",
    amber: "from-amber-50 to-amber-100/40 text-amber-700 border-amber-200",
    purple: "from-violet-50 to-violet-100/40 text-violet-700 border-violet-200",
  };
  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-slate-500">{title}</div>
              <div className="mt-2 flex items-end gap-2">
                <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
                {trend ? (
                  <span className={cn("mb-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", trend.direction === "up" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700")}>
                    {trend.direction === "up" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />} {trend.label}
                  </span>
                ) : null}
              </div>
              {sub ? <div className="mt-1 text-xs text-slate-500">{sub}</div> : null}
            </div>
            <div className={cn("rounded-xl border bg-gradient-to-br p-2.5", toneMap[tone])}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm transition",
            value === opt.value ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="flex min-w-[220px] flex-col gap-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <select
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProgressBar({ value, className = "" }) {
  return (
    <div className={cn("h-2 rounded-full bg-slate-100", className)}>
      <div className="h-2 rounded-full bg-slate-900 transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function formatPct(n) {
  return `${Math.round(n)}%`;
}

function delta(a, b) {
  return b - a;
}

function useDashboardData(selectedCentreId) {
  return useMemo(() => centres.find((c) => c.id === selectedCentreId) || centres[0], [selectedCentreId]);
}

function TabButton({ active, onClick, label, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
        active ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:bg-white"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function OverviewTab({ data, comparisonMode, selectedCohortId, onSelectCohort }) {
  const retentionLift = delta(data.baselineRetention, data.activeLinkRetention);
  const reEnrollLift = delta(data.reEnrollBaseline, data.reEnrollActiveLink);
  const activeCohort = data.cohorts.find((c) => c.id === selectedCohortId) || data.cohorts[0];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Retention (Week 8)"
          value={formatPct(comparisonMode === "activelink" ? data.activeLinkRetention : data.baselineRetention)}
          sub={comparisonMode === "activelink" ? `Baseline ${data.baselineRetention}%` : "Baseline view"}
          icon={Activity}
          tone="blue"
          trend={comparisonMode === "activelink" ? { direction: "up", label: `+${retentionLift} pts` } : undefined}
        />
        <MetricCard
          title="Re-enrollment"
          value={formatPct(comparisonMode === "activelink" ? data.reEnrollActiveLink : data.reEnrollBaseline)}
          sub={comparisonMode === "activelink" ? `Baseline ${data.reEnrollBaseline}%` : "Baseline view"}
          icon={TrendingUp}
          tone="green"
          trend={comparisonMode === "activelink" ? { direction: "up", label: `+${reEnrollLift} pts` } : undefined}
        />
        <MetricCard
          title="Avg Weekly Attendance"
          value={`${data.avgWeeklyAttendance}`}
          sub="Across active cohorts (fake demo data)"
          icon={Users}
          tone="purple"
        />
        <MetricCard
          title="Cost per Retained Participant"
          value={`$${data.costPerRetainedParticipant}`}
          sub="For municipal funding justification"
          icon={CircleDollarSign}
          tone="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Retention Curve (Baseline vs ActiveLink)"
            subtitle="The core pitch: we improve weekly retention, not just registrations"
            right={<Badge tone="blue">Adults 20–40</Badge>}
          />
          <div className="h-80 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.retentionCurve} margin={{ top: 10, right: 16, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Legend />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#94a3b8" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="activeLink" name="ActiveLink" stroke="#0f172a" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Cohort Spotlight" subtitle="Interactive cohort details for demos" />
          <div className="space-y-3 p-4">
            <div className="space-y-2">
              {data.cohorts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCohort(c.id)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition",
                    activeCohort.id === c.id ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-slate-900">{c.title}</div>
                    <Badge tone={c.status === "Active" ? "green" : "amber"}>{c.status}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{c.dayTime} • {c.instructor}</div>
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-xs font-medium text-slate-500">Selected cohort</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{activeCohort.id}</div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-slate-500">Attendance</div>
                  <div className="font-semibold text-slate-900">{activeCohort.attendanceRate}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Retention</div>
                  <div className="font-semibold text-slate-900">{activeCohort.retentionRate}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Capacity</div>
                  <div className="font-semibold text-slate-900">{activeCohort.enrolled}/{activeCohort.capacity}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Waitlist</div>
                  <div className="font-semibold text-slate-900">{activeCohort.waitlist}</div>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500"><span>Fill rate</span><span>{Math.round((activeCohort.enrolled / activeCohort.capacity) * 100)}%</span></div>
                  <ProgressBar value={(activeCohort.enrolled / activeCohort.capacity) * 100} />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500"><span>Subsidy seats filled</span><span>{activeCohort.subsidyFilled}/{activeCohort.subsidySeats}</span></div>
                  <ProgressBar value={(activeCohort.subsidyFilled / Math.max(activeCohort.subsidySeats, 1)) * 100} className="bg-emerald-100" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Facility Utilization by Time Slot" subtitle="Before vs after cohort-based programming" />
          <div className="h-72 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.timeslotUtilization} margin={{ top: 10, right: 16, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="slot" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Legend />
                <Bar dataKey="before" name="Before" radius={[6, 6, 0, 0]} fill="#94a3b8" />
                <Bar dataKey="after" name="ActiveLink" radius={[6, 6, 0, 0]} fill="#0f172a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Participant Journey Funnel" subtitle="From registration to re-enrollment" />
          <div className="space-y-4 p-4">
            {data.weekFlow.map((step, i) => {
              const max = data.weekFlow[0]?.value || 1;
              const pct = (step.value / max) * 100;
              return (
                <motion.div key={step.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{step.label}</span>
                    <span className="text-slate-900">{step.value}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div className="h-3 rounded-full bg-slate-900" style={{ width: `${pct}%` }} />
                  </div>
                </motion.div>
              );
            })}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              <div className="font-semibold">Pitch angle</div>
              <div className="mt-1">We are not just increasing registrations — we are increasing completions and re-enrollments.</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CohortsTab({ data }) {
  const [sortBy, setSortBy] = useState("retentionRate");
  const sorted = useMemo(() => {
    const arr = [...data.cohorts];
    arr.sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0));
    return arr;
  }, [data.cohorts, sortBy]);

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader
          title="Cohort Operations Dashboard"
          subtitle="Shows how ActiveLink structures attendance, accountability, and operational visibility"
          right={
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Sort</span>
              <select className="rounded-lg border border-slate-200 px-2 py-1 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="retentionRate">Retention</option>
                <option value="attendanceRate">Attendance</option>
                <option value="waitlist">Waitlist</option>
                <option value="enrolled">Enrollment</option>
              </select>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Cohort</th>
                <th className="px-4 py-3">Schedule</th>
                <th className="px-4 py-3">Enrollment</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Retention</th>
                <th className="px-4 py-3">Waitlist</th>
                <th className="px-4 py-3">Subsidy</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{c.title}</div>
                    <div className="text-xs text-slate-500">{c.id} • {c.instructor}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{c.dayTime}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{c.enrolled}/{c.capacity}</div>
                    <div className="mt-1 w-28"><ProgressBar value={(c.enrolled / c.capacity) * 100} /></div>
                  </td>
                  <td className="px-4 py-3 text-slate-900">{c.attendanceRate}%</td>
                  <td className="px-4 py-3 text-slate-900">{c.retentionRate}%</td>
                  <td className="px-4 py-3 text-slate-700">{c.waitlist}</td>
                  <td className="px-4 py-3 text-slate-700">{c.subsidyFilled}/{c.subsidySeats}</td>
                  <td className="px-4 py-3"><Badge tone={c.status === "Active" ? "green" : "amber"}>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Retention Lift by Cohort (Demo)" subtitle="Use this in presentations to compare classes" />
          <div className="h-72 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.cohorts.map((c) => ({
                  cohort: c.id.replace(/^[A-Z]+-/, ""),
                  retention: c.retentionRate,
                  attendance: c.attendanceRate,
                }))}
                margin={{ top: 10, right: 16, left: 4, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="cohort" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Legend />
                <Bar dataKey="attendance" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="retention" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="What this tab proves to judges" subtitle="Operational visibility + retention mechanics, not just pretty charts" />
          <div className="space-y-3 p-4 text-sm">
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="font-semibold text-slate-900">Cohort structure</div>
              <p className="mt-1 text-slate-600">Fixed groups, set schedules, and waitlist management create habit cues and social accountability.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="font-semibold text-slate-900">Drop-off detection</div>
              <p className="mt-1 text-slate-600">Staff can see which cohort needs intervention (schedule, instructor support, re-entry nudges).</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="font-semibold text-slate-900">Equity built in</div>
              <p className="mt-1 text-slate-600">Subsidy seats are tracked at cohort level, not buried in spreadsheets.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function EquityTab({ data }) {
  const subsidyFilled = data.cohorts.reduce((s, c) => s + c.subsidyFilled, 0);
  const subsidySeats = data.cohorts.reduce((s, c) => s + c.subsidySeats, 0);
  const redemptionRate = Math.round((subsidyFilled / Math.max(subsidySeats, 1)) * 100);

  const equityCards = [
    { title: "Subsidy Uptake", value: `${data.subsidyUptake}%`, sub: "Share of participants using access supports", icon: ShieldCheck, tone: "green" },
    { title: "Subsidy Seats Filled", value: `${subsidyFilled}/${subsidySeats}`, sub: `Redemption ${redemptionRate}%`, icon: Users, tone: "blue" },
    { title: "Commitment Rebates Triggered", value: `${Math.round(subsidyFilled * 0.7)}`, sub: "Attendance-linked credits (demo)", icon: CircleDollarSign, tone: "amber" },
    { title: "Sponsor-funded Seats", value: `${Math.max(4, Math.round(subsidySeats * 0.45))}`, sub: "Local businesses / CSR partners (demo)", icon: Building2, tone: "purple" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {equityCards.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Payment & Access Mix" subtitle="Stigma-free access is part of retention, not a separate program" />
          <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.subsidyBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={82} innerRadius={48} paddingAngle={3}>
                    {data.subsidyBreakdown.map((entry, idx) => (
                      <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {data.subsidyBreakdown.map((s, idx) => (
                <div key={s.name} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-sm font-medium text-slate-800">{s.name}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{s.value}% of enrollments</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Subsidy Strategy Demonstrator" subtitle="What judges can click through during the presentation" />
          <div className="space-y-3 p-4 text-sm">
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">Sliding-scale pricing</div>
                <Badge tone="green">Low-friction</Badge>
              </div>
              <p className="mt-1 text-slate-600">Reduced price bands instead of awkward one-off negotiation.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">Digital vouchers</div>
                <Badge tone="blue">Private</Badge>
              </div>
              <p className="mt-1 text-slate-600">Online or QR-based redemption to reduce stigma at the front desk.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">Commitment rebates</div>
                <Badge tone="amber">Behavior-linked</Badge>
              </div>
              <p className="mt-1 text-slate-600">Credits unlocked through consistent attendance to support re-enrollment.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">Sponsor-funded seats</div>
                <Badge tone="purple">Community partner</Badge>
              </div>
              <p className="mt-1 text-slate-600">Businesses fund named seats (high-visibility local impact).</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AutomationTab({ data }) {
  const [selectedTemplate, setSelectedTemplate] = useState("reminder");
  const [simState, setSimState] = useState("idle");

  const templates = {
    reminder: {
      title: "24h Reminder",
      copy: "Hi Alex — your Mobility + Strength cohort is tomorrow at 6:00 PM. Reply 1 to confirm, 2 to switch to Thursday.",
      impact: "Reduces no-shows by prompting commitment and giving a frictionless switch option.",
      tag: "Prompts/Cues",
    },
    missed: {
      title: "Missed Session Re-entry",
      copy: "Missed you this week — no stress. Your group is still on track. Reply YES to save your spot next Tuesday or 2 to switch.",
      impact: "Makes returning after a missed session socially easy (no shame spiral).",
      tag: "Retention Rescue",
    },
    milestone: {
      title: "Milestone Prompt",
      copy: "You’re 2 sessions away from your Week 4 reward 🎉 Keep the streak alive.",
      impact: "Reinforces attendance with small immediate rewards and visible progress.",
      tag: "Reinforcement",
    },
  };

  const selected = templates[selectedTemplate];

  const runSimulation = () => {
    setSimState("running");
    setTimeout(() => setSimState("sent"), 800);
    setTimeout(() => setSimState("responded"), 1800);
    setTimeout(() => setSimState("converted"), 3000);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Nudge Performance (Demo Data)" subtitle="SMS-first because it is simple, familiar, and doesn’t require app installs" />
          <div className="h-80 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.nudges} margin={{ top: 10, right: 16, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="type" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} interval={0} angle={-10} textAnchor="end" height={58} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Legend />
                <Bar dataKey="openRate" fill="#0f172a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="responseRate" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Template Library" subtitle="Click to demo behavior design logic" />
          <div className="space-y-3 p-4">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedTemplate("reminder")} className={cn("rounded-lg px-3 py-1.5 text-sm", selectedTemplate === "reminder" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700")}>Reminder</button>
              <button onClick={() => setSelectedTemplate("missed")} className={cn("rounded-lg px-3 py-1.5 text-sm", selectedTemplate === "missed" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700")}>Missed</button>
              <button onClick={() => setSelectedTemplate("milestone")} className={cn("rounded-lg px-3 py-1.5 text-sm", selectedTemplate === "milestone" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700")}>Milestone</button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">{selected.title}</div>
                <Badge tone="blue">{selected.tag}</Badge>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{selected.copy}</div>
              <p className="mt-3 text-xs text-slate-500">{selected.impact}</p>
            </div>
            <button onClick={runSimulation} className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-slate-800">
              Simulate message flow
            </button>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Interactive Demo: Missed Session Recovery Flow" subtitle="Great judge interaction moment: click simulate and narrate the retention rescue" />
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-4">
          {[
            { key: "sent", label: "Message Sent", icon: MessageSquare, text: "Missed-session SMS triggered automatically after no-show." },
            { key: "responded", label: "Participant Replies", icon: Bell, text: "User replies YES or requests alternate cohort time." },
            { key: "converted", label: "Spot Preserved", icon: CheckCircle2, text: "Participant stays in cohort; dropout prevented." },
            { key: "done", label: "Retention Saved", icon: TrendingUp, text: "Higher completion and re-enrollment probability." },
          ].map((step, idx) => {
            const active = (simState === "sent" && idx < 1) || (simState === "responded" && idx < 2) || (simState === "converted" && idx < 3);
            const Icon = step.icon;
            return (
              <motion.div key={step.key} layout className={cn("rounded-2xl border p-4", active ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white")}>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Icon className={cn("h-4 w-4", active ? "text-emerald-700" : "text-slate-500")} />
                  {step.label}
                </div>
                <p className="mt-2 text-xs text-slate-600">{step.text}</p>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function ImpactTab({ data }) {
  const [scenario, setScenario] = useState("pilot");

  const scenarios = {
    pilot: {
      label: "Pilot (2 centres)",
      centres: 2,
      participants: 96,
      retentionLiftPts: 20,
      annualCost: 12000,
      note: "Manual pilot + lightweight tools + sponsored rewards",
    },
    municipal: {
      label: "Municipal cluster (5 centres)",
      centres: 5,
      participants: 380,
      retentionLiftPts: 19,
      annualCost: 84000,
      note: "One municipal contract + centralized reporting",
    },
    scale: {
      label: "Regional scale (25 centres)",
      centres: 25,
      participants: 2100,
      retentionLiftPts: 18,
      annualCost: 450000,
      note: "ARR demo scenario for scaling story",
    },
  };

  const s = scenarios[scenario];
  const estimatedExtraCompleters = Math.round(s.participants * (s.retentionLiftPts / 100));
  const costPerExtraCompleter = Math.round(s.annualCost / Math.max(estimatedExtraCompleters, 1));

  const trendData = [
    { q: "Q1", retained: 42, reEnroll: 19 },
    { q: "Q2", retained: 51, reEnroll: 24 },
    { q: "Q3", retained: 58, reEnroll: 31 },
    { q: "Q4", retained: 63, reEnroll: 39 },
  ];

  const personaCards = data.personas;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Impact & Funding Justification</h3>
          <p className="text-xs text-slate-500">This tab is designed for municipal decision-makers and judges.</p>
        </div>
        <Segmented
          value={scenario}
          onChange={setScenario}
          options={[
            { label: "Pilot", value: "pilot" },
            { label: "5 Centres", value: "municipal" },
            { label: "25 Centres", value: "scale" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Scenario" value={s.label} sub={s.note} icon={MapPinned} tone="blue" />
        <MetricCard title="Participants / cycle" value={`${s.participants}`} sub={`${s.centres} centre(s)`} icon={Users} tone="purple" />
        <MetricCard title="Estimated extra completers" value={`${estimatedExtraCompleters}`} sub={`Using +${s.retentionLiftPts} retention points`} icon={TrendingUp} tone="green" />
        <MetricCard title="Cost per extra completer" value={`$${costPerExtraCompleter}`} sub="Demo calculation (fake data)" icon={CircleDollarSign} tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Retention & Re-enrollment Trend (Demo)" subtitle="Use to narrate why retention data matters for contracts and funding" />
          <div className="h-80 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 16, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="retainedFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="reenrollFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="q" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Legend />
                <Area type="monotone" dataKey="retained" name="Retention %" stroke="#0f172a" fill="url(#retainedFill)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="reEnroll" name="Re-enrollment %" stroke="#2563eb" fill="url(#reenrollFill)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Funding Story" subtitle="How to explain sustainability" />
          <div className="space-y-3 p-4 text-sm">
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="font-semibold text-slate-900">Stage 1: Grant-funded pilot</div>
              <p className="mt-1 text-slate-600">Use grants to prove retention lift and build evidence.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="font-semibold text-slate-900">Stage 2: Municipal service contract</div>
              <p className="mt-1 text-slate-600">Convert pilots into stable multi-year agreements.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="font-semibold text-slate-900">Stage 3: Scalable licensing</div>
              <p className="mt-1 text-slate-600">Per-centre or multi-centre software + analytics + support.</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
              <div className="font-semibold">Judge-friendly point</div>
              <p className="mt-1 text-sm">We treat grant funding as a launchpad — not the long-term business model.</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Human Stories (Demo Personas)" subtitle="Optional presentation mode — makes the dashboard feel real without using private data" />
        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
          {personaCards.map((p) => (
            <motion.div key={p.name} layout className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">{p.name}</div>
              <div className="mt-1 text-xs text-slate-500">{p.profile}</div>
              <div className="mt-3 space-y-2 text-sm">
                <div><span className="font-medium text-slate-700">Barrier:</span> <span className="text-slate-600">{p.barrier}</span></div>
                <div><span className="font-medium text-slate-700">Intervention:</span> <span className="text-slate-600">{p.intervention}</span></div>
                <div><span className="font-medium text-slate-700">Result:</span> <span className="text-slate-600">{p.result}</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function ActiveLinkDashboardDemo() {
  const [selectedCentreId, setSelectedCentreId] = useState(centres[0].id);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [comparisonMode, setComparisonMode] = useState("activelink");
  const [selectedCohortId, setSelectedCohortId] = useState(centres[0].cohorts[0].id);
  const [showJudgeNotes, setShowJudgeNotes] = useState(true);

  const data = useDashboardData(selectedCentreId);

  React.useEffect(() => {
    setSelectedCohortId(data.cohorts[0]?.id || "");
  }, [selectedCentreId]);

  const selectedTabMeta = tabs.find((t) => t.id === selectedTab) || tabs[0];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        {/* Top Nav / Branding */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-2.5">
                <Sparkles className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight">ActiveLink Demo Dashboard</h1>
                  <Badge tone="blue">Prototype / Fake Data</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Retention & Engagement OS for community recreation — focused on adults 20–40 in publicly funded community centres.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <SelectField
                label="Centre"
                value={selectedCentreId}
                onChange={setSelectedCentreId}
                options={centres.map((c) => ({ value: c.id, label: `${c.name} (${c.city})` }))}
              />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">Compare view</span>
                <Segmented
                  value={comparisonMode}
                  onChange={setComparisonMode}
                  options={[
                    { label: "Baseline", value: "baseline" },
                    { label: "ActiveLink", value: "activelink" },
                  ]}
                />
              </div>
              <button
                onClick={() => setShowJudgeNotes((v) => !v)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                {showJudgeNotes ? "Hide" : "Show"} presentation notes
              </button>
            </div>
          </div>
        </motion.div>

        {/* Optional judge notes banner */}
        <AnimatePresence>
          {showJudgeNotes && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-amber-100 p-2"><Filter className="h-4 w-4 text-amber-700" /></div>
                <div>
                  <div className="text-sm font-semibold text-amber-900">Presentation Mode Tips</div>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-amber-800">
                    <li>Start on <b>Overview</b> to show retention lift (core thesis).</li>
                    <li>Use <b>Cohorts</b> to prove this is operationally useful, not just a concept.</li>
                    <li>Use <b>Equity & Subsidy</b> to show public-centre alignment and access design.</li>
                    <li>Use <b>Nudges</b> and click “Simulate” for an interactive judge moment.</li>
                    <li>Finish on <b>Impact</b> to explain funding stability (grants → contracts → licensing).</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Nav */}
        <div className="mb-5 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              label={tab.label}
              icon={tab.icon}
              active={selectedTab === tab.id}
              onClick={() => setSelectedTab(tab.id)}
            />
          ))}
          <div className="ml-auto hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 md:flex">
            <Clock3 className="h-3.5 w-3.5" />
            Demo time: ~3–5 min walkthrough
          </div>
        </div>

        {/* Active tab title strip */}
        <motion.div layout className="mb-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <selectedTabMeta.icon className="h-4 w-4 text-slate-700" />
            <span className="font-semibold">{selectedTabMeta.label}</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500">{data.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="purple"><Calendar className="mr-1 h-3.5 w-3.5" /> Demo cohort cycle</Badge>
            <Badge tone="green">Fake data</Badge>
          </div>
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab + selectedCentreId + comparisonMode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {selectedTab === "overview" && (
              <OverviewTab
                data={data}
                comparisonMode={comparisonMode}
                selectedCohortId={selectedCohortId}
                onSelectCohort={setSelectedCohortId}
              />
            )}
            {selectedTab === "cohorts" && <CohortsTab data={data} />}
            {selectedTab === "equity" && <EquityTab data={data} />}
            {selectedTab === "automation" && <AutomationTab data={data} />}
            {selectedTab === "impact" && <ImpactTab data={data} />}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">ActiveLink Prototype Notes</div>
              <p className="mt-1 text-xs text-slate-500">
                This is a front-end demonstration only. All numbers are illustrative fake data for presentation use. No backend, no real participant data.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge tone="blue">React + Tailwind</Badge>
              <Badge tone="purple">Framer Motion</Badge>
              <Badge tone="green">Recharts</Badge>
              <Badge tone="amber">Judge-interactive prototype</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

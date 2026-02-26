import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Calendar,
  ChevronRight,
  Clock3,
  Home,
  KanbanSquare,
  MessageSquare,
  Search,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Smartphone,
  Sun,
  Moon,
  Wand2,
  SlidersHorizontal,
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import ClientAppPreview from "./ClientAppPreview";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatPct(n) {
  return `${Math.round(Number(n) || 0)}%`;
}

function formatCurrency(n) {
  return `$${Number(n || 0).toLocaleString()}`;
}

/* ---------------- UI building blocks (theme-aware via Tailwind dark class) ---------------- */

function Card({ className = "", children }) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white shadow-sm",
        "border-slate-200",
        "dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-[0_6px_24px_rgba(0,0,0,0.25)] dark:backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
      <div>
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</div>
        {subtitle ? <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div> : null}
      </div>
      {right}
    </div>
  );
}

function Badge({ children, tone = "default" }) {
  const map = {
    default: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30",
    blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30",
    amber: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
    red: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30",
    purple: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/30",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium", map[tone])}>
      {children}
    </span>
  );
}

function ProgressBar({ value, className = "", fillClassName = "bg-slate-900" }) {
  const clamped = Math.max(0, Math.min(100, Number(value || 0)));
  return (
    <div className={cn("h-2 rounded-full bg-slate-100 dark:bg-slate-800", className)}>
      <div className={cn("h-2 rounded-full transition-all", fillClassName)} style={{ width: `${clamped}%` }} />
    </div>
  );
}

function MetricCard({ title, value, sub, icon: Icon, tone = "blue", trend }) {
  const toneMap = {
    blue: "from-blue-50 to-blue-100/40 text-blue-700 border-blue-200 dark:from-blue-500/10 dark:to-blue-400/5 dark:text-blue-300 dark:border-blue-500/20",
    green: "from-emerald-50 to-emerald-100/40 text-emerald-700 border-emerald-200 dark:from-emerald-500/10 dark:to-emerald-400/5 dark:text-emerald-300 dark:border-emerald-500/20",
    amber: "from-amber-50 to-amber-100/40 text-amber-700 border-amber-200 dark:from-amber-500/10 dark:to-amber-400/5 dark:text-amber-300 dark:border-amber-500/20",
    purple: "from-violet-50 to-violet-100/40 text-violet-700 border-violet-200 dark:from-violet-500/10 dark:to-violet-400/5 dark:text-violet-300 dark:border-violet-500/20",
    red: "from-rose-50 to-rose-100/40 text-rose-700 border-rose-200 dark:from-rose-500/10 dark:to-rose-400/5 dark:text-rose-300 dark:border-rose-500/20",
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</div>
              <div className="mt-2 flex flex-wrap items-end gap-2">
                <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{value}</div>
                {trend ? (
                  <span
                    className={cn(
                      "mb-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                      trend.direction === "up"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                        : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                    )}
                  >
                    {trend.direction === "up" ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    {trend.label}
                  </span>
                ) : null}
              </div>
              {sub ? <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">{sub}</div> : null}
            </div>
            <div className={cn("shrink-0 rounded-xl border bg-gradient-to-br p-2.5", toneMap[tone])}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function SectionIntro({ title, description, icon: Icon, right }) {
  return (
    <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
            <Icon className="h-4 w-4 text-slate-700 dark:text-slate-200" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</div>
          </div>
        </div>
        {right}
      </div>
    </Card>
  );
}

function TabButton({ active, onClick, label, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
        active
          ? "border border-slate-200 bg-slate-100 text-slate-900 shadow dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 dark:text-slate-400 dark:hover:border-slate-800 dark:hover:bg-slate-900 dark:hover:text-slate-200"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

/* ---------------- Demo data: SINGLE centre ---------------- */
/* Replace this with your real centre object if desired. */
const centre = {
  id: "northview",
  name: "Northview Community Centre",
  city: "London, ON",
  audience: "Adults 20–40",
  municipalOwner: "City of London",
  monthlyMRRDemo: 4200,
  participants: [
    {
      id: "P-1001",
      name: "Alex P.",
      phone: "(519) 555-0121",
      stage: "At Risk",
      risk: "High",
      program: "Mobility + Strength",
      cohortId: "NV-MOB-01",
      nextSession: "Tue 6:00 PM",
      attendanceRate: 63,
      retentionProbability: 54,
      subsidyType: "Sliding Scale",
      balance: 0,
      lastTouch: "Missed-session SMS • 1 day ago",
      owner: "Samir K.",
      tags: ["Schedule conflict", "Needs re-entry"],
      timeline: [
        { date: "Feb 12", type: "Enrollment", note: "Registered for Mobility + Strength" },
        { date: "Feb 22", type: "No-show", note: "Missed Week 2" },
        { date: "Feb 23", type: "Reply", note: "Asked about alternate slot" },
      ],
      tasks: [
        { id: "t1", title: "Offer Thursday swap", due: "Today", priority: "High", done: false },
        { id: "t2", title: "Confirm transportation barrier", due: "Tomorrow", priority: "Medium", done: false },
      ],
    },
    {
      id: "P-1002",
      name: "Maya R.",
      phone: "(519) 555-0147",
      stage: "Active",
      risk: "Low",
      program: "Walk + Conditioning",
      cohortId: "NV-WALK-02",
      nextSession: "Thu 7:00 PM",
      attendanceRate: 86,
      retentionProbability: 83,
      subsidyType: "Voucher",
      balance: -20,
      lastTouch: "Milestone reward sent • 2 days ago",
      owner: "Leila M.",
      tags: ["New parent", "Cost-sensitive"],
      timeline: [
        { date: "Feb 06", type: "Enrollment", note: "Placed in cohort NV-WALK-02" },
        { date: "Feb 21", type: "Reward", note: "Commitment rebate credit issued" },
      ],
      tasks: [{ id: "t3", title: "Prompt re-enrollment at Week 6", due: "Next week", priority: "Low", done: false }],
    },
    {
      id: "P-1003",
      name: "Chris T.",
      phone: "(519) 555-0168",
      stage: "Re-enrolled",
      risk: "Low",
      program: "Core + Cardio Reset",
      cohortId: "NV-CORE-03",
      nextSession: "Sat 10:30 AM",
      attendanceRate: 79,
      retentionProbability: 88,
      subsidyType: "Standard",
      balance: 0,
      lastTouch: "Re-enrollment confirmation • 4 days ago",
      owner: "Devon P.",
      tags: ["Desk job", "Routine builder"],
      timeline: [
        { date: "Feb 01", type: "Completion", note: "Completed 8-week cycle" },
        { date: "Feb 03", type: "Re-enroll", note: "Booked next cohort" },
      ],
      tasks: [],
    },
    {
      id: "P-1004",
      name: "Jordan S.",
      phone: "(519) 555-0192",
      stage: "Trial Booked",
      risk: "Medium",
      program: "Strength Foundations",
      cohortId: "NV-TRIAL-01",
      nextSession: "Mon 7:30 PM",
      attendanceRate: 0,
      retentionProbability: 41,
      subsidyType: "Sliding Scale",
      balance: 0,
      lastTouch: "Trial reminder pending • 12h",
      owner: "Front Desk",
      tags: ["Commuter", "Evening only"],
      timeline: [
        { date: "Feb 22", type: "Lead", note: "Came from QR poster / noticeboard" },
        { date: "Feb 23", type: "Call", note: "Booked trial for Monday" },
      ],
      tasks: [{ id: "t4", title: "Send 24h reminder", due: "Today", priority: "High", done: false }],
    },
  ],
  programs: [
    {
      id: "NV-MOB-01",
      title: "Mobility + Strength",
      capacity: 12,
      enrolled: 12,
      waitlist: 5,
      coach: "Samir K.",
      attendance: 78,
      retention: 67,
    },
    {
      id: "NV-WALK-02",
      title: "Walk + Conditioning",
      capacity: 15,
      enrolled: 14,
      waitlist: 2,
      coach: "Leila M.",
      attendance: 72,
      retention: 61,
    },
    {
      id: "NV-CORE-03",
      title: "Core + Cardio Reset",
      capacity: 10,
      enrolled: 8,
      waitlist: 0,
      coach: "Devon P.",
      attendance: 69,
      retention: 56,
    },
  ],
  commsByWeek: [
    { week: "W1", reminders: 78, replies: 22, rescues: 6 },
    { week: "W2", reminders: 84, replies: 25, rescues: 9 },
    { week: "W3", reminders: 91, replies: 31, rescues: 11 },
    { week: "W4", reminders: 97, replies: 34, rescues: 12 },
    { week: "W5", reminders: 102, replies: 36, rescues: 14 },
    { week: "W6", reminders: 108, replies: 39, rescues: 16 },
  ],
  retentionTrend: [
    { month: "Sep", retention: 42, reEnroll: 19 },
    { month: "Oct", retention: 47, reEnroll: 22 },
    { month: "Nov", retention: 52, reEnroll: 27 },
    { month: "Dec", retention: 56, reEnroll: 31 },
    { month: "Jan", retention: 60, reEnroll: 35 },
    { month: "Feb", retention: 63, reEnroll: 39 },
  ],
};

const tabs = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "pipeline", label: "Pipeline", icon: KanbanSquare },
  { id: "participants", label: "Participants", icon: Users },
  { id: "comms", label: "Comms", icon: MessageSquare },
  { id: "cohorts", label: "Cohorts", icon: Calendar }, // renamed from Programs
  { id: "client", label: "Client App", icon: Smartphone }, // phone preview moved here
];

function getStageTone(stage) {
  if (stage === "At Risk") return "red";
  if (stage === "Active") return "green";
  if (stage === "Re-enrolled") return "purple";
  if (stage === "Completed") return "blue";
  if (stage === "Trial Booked") return "amber";
  return "default";
}

function getRiskTone(risk) {
  if (risk === "High") return "red";
  if (risk === "Medium") return "amber";
  return "green";
}

function buildCrmMetrics(data) {
  const people = data.participants || [];
  const active = people.filter((p) => p.stage === "Active").length;
  const atRisk = people.filter((p) => p.stage === "At Risk").length;
  const leads = people.filter((p) => p.stage === "Lead" || p.stage === "Trial Booked").length;
  const tasksDue = people.flatMap((p) => p.tasks || []).filter((t) => !t.done).length;
  const withAttendance = people.filter((p) => Number(p.attendanceRate) > 0);
  const avgAttendance =
    withAttendance.reduce((s, p) => s + Number(p.attendanceRate || 0), 0) / Math.max(1, withAttendance.length);
  return { active, atRisk, leads, tasksDue, avgAttendance };
}

/* ---------------- Tabs ---------------- */

function OverviewTab({ data, onSelectParticipant, isDark }) {
  const metrics = buildCrmMetrics(data);

  const atRiskQueue = data.participants
    .filter((p) => p.stage === "At Risk")
    .sort((a, b) => (a.retentionProbability ?? 0) - (b.retentionProbability ?? 0))
    .slice(0, 4);

  const upcomingTasks = data.participants
    .flatMap((p) => (p.tasks || []).map((t) => ({ ...t, participantName: p.name, participantId: p.id })))
    .filter((t) => !t.done)
    .slice(0, 5);

  const pieData = [
    { name: "Lead/Trial", value: data.participants.filter((p) => ["Lead", "Trial Booked"].includes(p.stage)).length },
    { name: "Active", value: data.participants.filter((p) => p.stage === "Active").length },
    { name: "At Risk", value: data.participants.filter((p) => p.stage === "At Risk").length },
    { name: "Completed/Renewed", value: data.participants.filter((p) => ["Completed", "Re-enrolled"].includes(p.stage)).length },
  ];

  const PIE_COLORS = isDark
    ? ["#e2e8f0", "#60a5fa", "#34d399", "#a78bfa", "#fbbf24", "#f87171"]
    : ["#0f172a", "#2563eb", "#059669", "#7c3aed", "#d97706", "#dc2626"];

  const tooltipStyle = {
    borderRadius: 12,
    border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
    background: isDark ? "#0f172a" : "#ffffff",
    color: isDark ? "#e2e8f0" : "#0f172a",
  };

  return (
    <div className="space-y-5">
      <SectionIntro
        icon={Home}
        title="What this page shows"
        description="A simple operating view: who is active, who needs follow-up, what staff should do next, and whether retention is improving over time."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <MetricCard
          title="Active Participants"
          value={`${metrics.active}`}
          sub="Currently attending cohorts"
          icon={Users}
          tone="blue"
          trend={{ direction: "up", label: "+8% cycle" }}
        />
        <MetricCard
          title="Needs Attention"
          value={`${metrics.atRisk}`}
          sub="At-risk participants this week"
          icon={AlertTriangle}
          tone="red"
        />
        <MetricCard
          title="Open Leads / Trials"
          value={`${metrics.leads}`}
          sub="People to convert into active participants"
          icon={Target}
          tone="purple"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader title="Retention Trend" subtitle="A clear outcome signal over time" right={<Badge tone="blue">{data.municipalOwner}</Badge>} />
          <div className="h-72 px-2 py-3">
            <ResponsiveContainer width="100%" height="200%">
              <AreaChart data={data.retentionTrend} margin={{ top: 10, right: 16, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="retFillA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? "#60a5fa" : "#2563eb"} stopOpacity={0.22} />
                    <stop offset="95%" stopColor={isDark ? "#60a5fa" : "#2563eb"} stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="reFillA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? "#34d399" : "#059669"} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={isDark ? "#34d399" : "#059669"} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1f2937" : "#e2e8f0"} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: isDark ? "#cbd5e1" : "#334155" }} />
                <Area type="monotone" dataKey="retention" name="Retention %" stroke={isDark ? "#60a5fa" : "#2563eb"} strokeWidth={2.5} fill="url(#retFillA)" />
                <Area type="monotone" dataKey="reEnroll" name="Re-enrollment %" stroke={isDark ? "#34d399" : "#059669"} strokeWidth={2.5} fill="url(#reFillA)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Pipeline Snapshot" subtitle="High-level funnel mix" />
          <div className="space-y-3 p-4">
            <div className="h-44 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950/40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={58} innerRadius={35} paddingAngle={3}>
                    {pieData.map((entry, idx) => (
                      <Cell key={entry.name} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {pieData.map((p, i) => (
              <div key={p.name} className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{p.name}</span>
                  <span className="text-slate-900 dark:text-slate-100">{p.value}</span>
                </div>
                <ProgressBar value={(p.value / Math.max(data.participants.length, 1)) * 100} fillClassName={isDark ? "bg-slate-200" : "bg-slate-900"} />
              </div>
            ))}

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-200">
              This behaves like an operating CRM: staff can identify who needs help and take action — not just view a report.
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Who needs attention" subtitle="People most likely to drop without intervention" />
          <div className="space-y-3 p-4">
            {atRiskQueue.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectParticipant(p.id)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-950"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.name}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {p.program} • {p.nextSession}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge tone={getRiskTone(p.risk)}>{p.risk} risk</Badge>
                    <Badge tone={getStageTone(p.stage)}>{p.stage}</Badge>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-slate-500">Attendance</div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{p.attendanceRate}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Retention</div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{p.retentionProbability}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Last touch</div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{p.lastTouch.split(" • ")[0]}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Staff task queue" subtitle="What the system surfaces for follow-up" />
          <div className="space-y-3 p-4">
            {upcomingTasks.map((t) => (
              <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.title}</div>
                  <Badge tone={t.priority === "High" ? "red" : t.priority === "Medium" ? "amber" : "default"}>{t.priority}</Badge>
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t.participantName} • Due {t.due}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function PipelineTab({ data, onSelectParticipant }) {
  const stages = ["Lead", "Trial Booked", "Active", "At Risk", "Completed", "Re-enrolled"];

  const grouped = useMemo(() => {
    const map = Object.fromEntries(stages.map((s) => [s, []]));
    data.participants.forEach((p) => {
      if (!map[p.stage]) map[p.stage] = [];
      map[p.stage].push(p);
    });
    return map;
  }, [data.participants]);

  return (
    <div className="space-y-5">
      <SectionIntro
        icon={KanbanSquare}
        title="What this page shows"
        description="A lifecycle board from lead → trial → active → at-risk → completed → re-enrolled."
      />

      <Card>
        <CardHeader
          title="Participant lifecycle board"
          subtitle="Acquisition → activation → retention → renewal"
          right={<Badge tone="purple">{data.participants.length} records</Badge>}
        />
        <div className="overflow-x-auto p-4">
          <div className="grid min-w-[980px] grid-cols-6 gap-4">
            {stages.map((stage) => (
              <div key={stage} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{stage}</div>
                  <Badge tone={getStageTone(stage)}>{grouped[stage]?.length || 0}</Badge>
                </div>
                <div className="space-y-3">
                  {(grouped[stage] || []).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onSelectParticipant(p.id)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{p.name}</div>
                          <div className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{p.program}</div>
                        </div>
                        <Badge tone={getRiskTone(p.risk)}>{p.risk}</Badge>
                      </div>
                      <div className="mt-3 text-xs text-slate-500 dark:text-slate-500">{p.nextSession}</div>
                      <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                          <span>Retention</span>
                          <span>{p.retentionProbability}%</span>
                        </div>
                        <ProgressBar
                          value={p.retentionProbability}
                          fillClassName={
                            p.retentionProbability >= 75
                              ? "bg-emerald-500"
                              : p.retentionProbability >= 55
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }
                        />
                      </div>
                    </button>
                  ))}
                  {(grouped[stage] || []).length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-3 text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
                      No records
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function ParticipantsTab({ data, selectedParticipantId, onSelectParticipant, search, onSearchChange, filterStage, onFilterStageChange }) {
  const filtered = useMemo(() => {
    return data.participants.filter((p) => {
      const q = search.trim().toLowerCase();
      const tags = p.tags || [];
      const hit =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.program.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        tags.some((t) => t.toLowerCase().includes(q));
      const stageHit = filterStage === "all" || p.stage === filterStage;
      return hit && stageHit;
    });
  }, [data.participants, search, filterStage]);

  const selected = data.participants.find((p) => p.id === selectedParticipantId) || filtered[0] || data.participants[0];

  return (
    <div className="space-y-5">
      <SectionIntro
        icon={Users}
        title="What this page shows"
        description="A searchable participant CRM view. Click a person to see status, tasks, notes, and history."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1fr]">
        <Card>
          <CardHeader title="Participant records" subtitle="Leads, active participants, and renewals" right={<Badge tone="blue">{filtered.length} shown</Badge>} />
          <div className="border-b border-slate-100 p-4 dark:border-slate-800">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search name, program, tags, ID..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
              <select
                value={filterStage}
                onChange={(e) => onFilterStageChange(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="all">All stages</option>
                <option value="Lead">Lead</option>
                <option value="Trial Booked">Trial Booked</option>
                <option value="Active">Active</option>
                <option value="At Risk">At Risk</option>
                <option value="Completed">Completed</option>
                <option value="Re-enrolled">Re-enrolled</option>
              </select>
            </div>
          </div>

          <div className="max-h-[680px] overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Participant</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Program</th>
                  <th className="px-4 py-3">Next Session</th>
                  <th className="px-4 py-3">Instructor</th> {/* renamed */}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => onSelectParticipant(p.id)}
                    className={cn(
                      "cursor-pointer border-t border-slate-100 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-950/50",
                      selected?.id === p.id && "bg-slate-50 dark:bg-slate-900/40"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-500">{p.id} • {p.phone}</div>
                    </td>
                    <td className="px-4 py-3"><Badge tone={getStageTone(p.stage)}>{p.stage}</Badge></td>
                    <td className="px-4 py-3"><Badge tone={getRiskTone(p.risk)}>{p.risk}</Badge></td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.program}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.nextSession}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.owner}</td> {/* display same field */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader
            title={selected ? `${selected.name} • Profile` : "Profile"}
            subtitle={selected ? `${selected.program} • ${selected.cohortId}` : "Select a participant"}
            right={selected ? <Badge tone={getStageTone(selected.stage)}>{selected.stage}</Badge> : null}
          />
          {selected ? (
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="text-xs text-slate-500">Retention probability</div>
                  <div className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{selected.retentionProbability}%</div>
                  <div className="mt-2">
                    <ProgressBar
                      value={selected.retentionProbability}
                      fillClassName={
                        selected.retentionProbability >= 75
                          ? "bg-emerald-600"
                          : selected.retentionProbability >= 55
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="text-xs text-slate-500">Attendance rate</div>
                  <div className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{selected.attendanceRate}%</div>
                  <div className="mt-2 text-xs text-slate-500">Next: {selected.nextSession}</div>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="text-xs text-slate-500">Support / payment</div>
                  <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{selected.subsidyType}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Balance / credit: {selected.balance < 0 ? `Credit ${formatCurrency(Math.abs(selected.balance))}` : formatCurrency(selected.balance)}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="text-xs text-slate-500">Instructor</div> {/* renamed */}
                  <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{selected.owner}</div>
                  <div className="mt-1 text-xs text-slate-500">{selected.lastTouch}</div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tags</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(selected.tags || []).map((t) => (
                    <Badge key={t} tone="default">{t}</Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Open tasks</div>
                <div className="mt-3 space-y-2">
                  {selected.tasks?.length ? (
                    selected.tasks.map((t) => (
                      <div key={t.id} className="rounded-lg border border-slate-200 p-2.5 dark:border-slate-800">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm text-slate-800 dark:text-slate-200">{t.title}</div>
                          <Badge tone={t.priority === "High" ? "red" : t.priority === "Medium" ? "amber" : "default"}>{t.priority}</Badge>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">Due {t.due}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500">No open tasks.</div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Timeline</div>
                <div className="mt-3 space-y-3">
                  {(selected.timeline || []).map((e, idx) => (
                    <div key={`${e.date}-${idx}`} className="flex gap-3">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-900 dark:bg-slate-200" />
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{e.date} • {e.type}</div>
                        <div className="text-sm text-slate-800 dark:text-slate-200">{e.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-sm text-slate-500">No participant selected.</div>
          )}
        </Card>
      </div>
    </div>
  );
}

function CommsTab({ data, isDark }) {
  const tooltipStyle = {
    borderRadius: 12,
    border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
    background: isDark ? "#0f172a" : "#ffffff",
    color: isDark ? "#e2e8f0" : "#0f172a",
  };

  const nudgeMix = [
    { name: "Reminders", value: 62 },
    { name: "Rescue nudges", value: 21 },
    { name: "Milestone prompts", value: 11 },
    { name: "Re-enroll offers", value: 6 },
  ];

  const COLORS = isDark
    ? ["#e2e8f0", "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"]
    : ["#0f172a", "#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed"];

  const topTemplates = [
    {
      name: "24h Reminder",
      purpose: "Reduce no-shows",
      sample: "Your class is tomorrow at 6:00 PM. Reply 1 to confirm, 2 to switch.",
      performance: "High opens • moderate replies",
    },
    {
      name: "Missed-session Re-entry",
      purpose: "Prevent dropout after a miss",
      sample: "Missed you this week — no stress. Reply YES to save your spot.",
      performance: "Strong reply rate",
    },
    {
      name: "Re-enrollment Offer",
      purpose: "Convert completers into next cycle",
      sample: "You completed your cohort 🎉 Want priority booking for next cycle?",
      performance: "Good conversion touchpoint",
    },
  ];

  return (
    <div className="space-y-5">
      <SectionIntro
        icon={MessageSquare}
        title="What this page shows"
        description="Communication workflows tied to retention: reminders, rescue nudges, and re-enrollment messaging."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader title="Comms trend" subtitle="Messages, replies, and rescues over time" />
          <div className="h-72 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.commsByWeek} margin={{ top: 10, right: 16, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1f2937" : "#e2e8f0"} />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: isDark ? "#cbd5e1" : "#334155" }} />
                <Line type="monotone" dataKey="reminders" name="Messages" stroke={COLORS[0]} strokeWidth={2.5} />
                <Line type="monotone" dataKey="replies" name="Replies" stroke={COLORS[1]} strokeWidth={2.5} />
                <Line type="monotone" dataKey="rescues" name="Rescues" stroke={COLORS[2]} strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Nudge mix" subtitle="What messages are used for" />
          <div className="grid grid-cols-1 gap-2 p-4">
            <div className="h-52 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950/40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={nudgeMix} dataKey="value" nameKey="name" outerRadius={70} innerRadius={40} paddingAngle={3}>
                    {nudgeMix.map((entry, idx) => (
                      <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {nudgeMix.map((n, idx) => (
              <div key={n.name} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-700 dark:text-slate-300">{n.name}</span>
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">{n.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Template examples" subtitle="Examples connected to the participant journey" />
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
          {topTemplates.map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.name}</div>
                <Badge tone="blue">{t.purpose}</Badge>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {t.sample}
              </div>
              <div className="mt-3 text-xs text-slate-500">{t.performance}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CohortsTab({ data, aiEnabled, setAiEnabled }) {
  const cohortDescriptions = (cohort) => {
    const t = (cohort.title || "").toLowerCase();
    if (t.includes("mobility")) return "Low-barrier cohort focused on consistency and injury-safe progressions.";
    if (t.includes("walk")) return "Beginner-friendly cardio baseline + routine-building for adherence.";
    if (t.includes("core")) return "Time-efficient reset program for desk-job fatigue + conditioning.";
    if (t.includes("strength")) return "Foundational lifting patterns + confidence-building for new members.";
    return "Structured weekly cohort designed for retention and gradual progression.";
  };

  return (
    <div className="space-y-5">
      <SectionIntro
        icon={Calendar}
        title="What this page shows"
        description="Cohorts (program groups) with capacity, waitlist pressure, and outcome signals."
        right={
          <div className="flex items-center gap-2">
            <Badge tone="purple"><Wand2 className="h-3.5 w-3.5" /> AI-organized</Badge>
            <button
              onClick={() => setAiEnabled((v) => !v)}
              className={cn(
                "rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition",
                "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              )}
            >
              AI suggestions: {aiEnabled ? "On" : "Off"}
            </button>
          </div>
        }
      />

      <Card>
        <CardHeader
          title="AI cohort organization"
          subtitle="How cohorts are created (and how staff can override)"
          right={<Badge tone="blue"><SlidersHorizontal className="h-3.5 w-3.5" /> Manual override allowed</Badge>}
        />
        <div className="p-4 text-sm text-slate-700 dark:text-slate-300">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">AI suggestion inputs</div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Availability, goals, risk level, attendance history, and cohort capacity.
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">AI outputs</div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Suggested cohort assignment + schedule slot + intervention flags.
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Staff controls</div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Drag/move participants, edit times, lock assignments, and add notes.
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-200">
            {aiEnabled
              ? "AI is currently suggesting cohort groupings. Staff can still override any assignment."
              : "AI suggestions are off. Cohorts are being managed manually in this demo view."}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Cohort list" subtitle="Clean operations view (no graph needed)" />
        <div className="space-y-3 p-4">
          {(data.programs || []).map((c) => {
            const fillPct = Math.round((c.enrolled / Math.max(c.capacity, 1)) * 100);
            return (
              <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{c.title}</div>
                      <Badge tone="default">{c.id}</Badge>
                      {aiEnabled ? <Badge tone="purple"><Sparkles className="h-3.5 w-3.5" /> Suggested</Badge> : <Badge>Manual</Badge>}
                    </div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {cohortDescriptions(c)}
                    </div>
                    <div className="mt-3 text-xs text-slate-500">
                      Instructor: <span className="font-semibold text-slate-700 dark:text-slate-200">{c.coach}</span>
                    </div>
                  </div>

                  <div className="w-full md:w-[340px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                        <div className="text-[11px] uppercase tracking-wide text-slate-500">Fill</div>
                        <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{c.enrolled}/{c.capacity}</div>
                        <div className="mt-2"><ProgressBar value={fillPct} fillClassName="bg-blue-600" /></div>
                      </div>
                      <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                        <div className="text-[11px] uppercase tracking-wide text-slate-500">Waitlist</div>
                        <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{c.waitlist}</div>
                        <div className="mt-2 text-xs text-slate-500">Pressure signal for adding slots</div>
                      </div>
                      <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                        <div className="text-[11px] uppercase tracking-wide text-slate-500">Attendance</div>
                        <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{c.attendance}%</div>
                      </div>
                      <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                        <div className="text-[11px] uppercase tracking-wide text-slate-500">Retention</div>
                        <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{c.retention}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function ClientAppTab({ data, participant, onSelectParticipantId, isDark }) {
  return (
    <div className="space-y-5">
      <SectionIntro
        icon={Smartphone}
        title="What this page shows"
        description="The participant-facing mobile experience that the CRM is powering: confirmations, scheduling, messages, and rewards."
      />

      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader title="Choose a participant to mirror" subtitle="Pick someone and the phone preview will update" />
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {(data.participants || []).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectParticipantId(p.id)}
                  className={cn(
                    "rounded-2xl border p-3 text-left transition",
                    "border-slate-200 bg-white hover:bg-slate-50",
                    "dark:border-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-950"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{p.name}</div>
                      <div className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{p.program}</div>
                      <div className="mt-2 text-xs text-slate-500">Next: {p.nextSession}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge tone={getStageTone(p.stage)}>{p.stage}</Badge>
                      <Badge tone={getRiskTone(p.risk)}>{p.risk}</Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
              The point is to make the CRM actions tangible: staff nudges and interventions should map to what the participant actually sees and does.
            </div>
          </div>
        </Card>

        <Card className="sticky top-4">
          <CardHeader title="Client App Preview" subtitle="Matches the selected participant + theme toggle" />
          <div className="p-4">
            <ClientAppPreview participant={participant} centreName={data.name} mode={isDark ? "dark" : "light"} />
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Main ---------------- */

export default function ActiveLinkCrmDashboardDemo() {
  const data = centre;

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("al_theme") || "dark";
    } catch {
      return "dark";
    }
  });

  const isDark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement; // <html>
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  //useEffect(() => {
    //try {
      //localStorage.setItem("al_theme", theme);
    //} catch {}
  //}, [theme]);

  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedParticipantId, setSelectedParticipantId] = useState(data.participants[0]?.id || "");
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [aiCohortsEnabled, setAiCohortsEnabled] = useState(true);

  const selectedParticipant =
    data.participants.find((p) => p.id === selectedParticipantId) || data.participants[0] || null;

  const tabMeta = tabs.find((t) => t.id === selectedTab) || tabs[0];
  const TabIcon = tabMeta.icon;
  const crmMetrics = buildCrmMetrics(data);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-[1800px] p-4 md:p-6">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[240px_minmax(0,1fr)]">
          {/* Left Sidebar Navigation */}
          <aside className="xl:sticky xl:top-4 xl:h-[calc(100vh-2rem)]">
            <Card className="h-full">
              <div className="flex h-full flex-col">
                <div className="border-b border-slate-100 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-2.5 dark:border-blue-500/20 dark:bg-blue-500/10">
                        <Sparkles className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h1 className="text-base font-bold tracking-tight">ActiveLink CRM</h1>
                          <Badge tone="blue">Prototype</Badge>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Single-centre demo
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                      className={cn(
                        "rounded-xl border px-2.5 py-2 text-sm shadow-sm transition",
                        "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                        "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      )}
                      title="Toggle theme"
                    >
                      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500">
                    Navigation
                  </div>
                  <div className="space-y-1">
                    {tabs.map((tab) => (
                      <TabButton
                        key={tab.id}
                        label={tab.label}
                        icon={tab.icon}
                        active={selectedTab === tab.id}
                        onClick={() => setSelectedTab(tab.id)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-auto border-t border-slate-100 p-4 dark:border-slate-800">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                    <div className="text-xs font-semibold">{data.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{data.city} • {data.municipalOwner}</div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-800">
                        <div className="text-[10px] text-slate-500">Active</div>
                        <div className="text-sm font-semibold">{crmMetrics.active}</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-800">
                        <div className="text-[10px] text-slate-500">At-risk</div>
                        <div className="text-sm font-semibold">{crmMetrics.atRisk}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                    <Clock3 className="h-3.5 w-3.5" />
                    Demo walkthrough: 4–6 min
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <TabIcon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                  <span className="font-semibold">{tabMeta.label}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-500 dark:text-slate-400">{data.name}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="green"><Users className="h-3.5 w-3.5" /> {crmMetrics.active} active</Badge>
                  <Badge tone="red"><AlertTriangle className="h-3.5 w-3.5" /> {crmMetrics.atRisk} at risk</Badge>
                  <Badge tone="purple"><Target className="h-3.5 w-3.5" /> {crmMetrics.leads} leads/trials</Badge>
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {selectedTab === "overview" && (
                  <OverviewTab data={data} onSelectParticipant={setSelectedParticipantId} isDark={isDark} />
                )}
                {selectedTab === "pipeline" && (
                  <PipelineTab data={data} onSelectParticipant={setSelectedParticipantId} />
                )}
                {selectedTab === "participants" && (
                  <ParticipantsTab
                    data={data}
                    selectedParticipantId={selectedParticipantId}
                    onSelectParticipant={setSelectedParticipantId}
                    search={search}
                    onSearchChange={setSearch}
                    filterStage={filterStage}
                    onFilterStageChange={setFilterStage}
                  />
                )}
                {selectedTab === "comms" && <CommsTab data={data} isDark={isDark} />}
                {selectedTab === "cohorts" && (
                  <CohortsTab data={data} aiEnabled={aiCohortsEnabled} setAiEnabled={setAiCohortsEnabled} />
                )}
                {selectedTab === "client" && (
                  <ClientAppTab
                    data={data}
                    participant={selectedParticipant}
                    onSelectParticipantId={setSelectedParticipantId}
                    isDark={isDark}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold">Prototype Notes</div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                    Front-end demo only. All people, cohorts, and outcomes are illustrative fake data. No real participant data or backend.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge tone="blue">React + Tailwind</Badge>
                  <Badge tone="purple">Framer Motion</Badge>
                  <Badge tone="green">Recharts</Badge>
                  <Badge tone="amber">Client app preview page</Badge>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
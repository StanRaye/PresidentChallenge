import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Calendar,
  ChevronRight,
  Clock3,
  Filter,
  Home,
  KanbanSquare,
  MessageSquare,
  Search,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import ClientAppPreview from "./ClientAppPreview";

const COLORS = ["#e2e8f0", "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatPct(n) {
  return `${Math.round(n)}%`;
}

function formatCurrency(n) {
  return `$${Number(n).toLocaleString()}`;
}

function Card({ className = "", children }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-900/80 shadow-[0_6px_24px_rgba(0,0,0,0.25)] backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
      <div>
        <div className="text-sm font-semibold text-slate-100">{title}</div>
        {subtitle ? <div className="mt-1 text-xs text-slate-400">{subtitle}</div> : null}
      </div>
      {right}
    </div>
  );
}

function Badge({ children, tone = "default" }) {
  const map = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    blue: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    red: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    purple: "bg-violet-500/10 text-violet-300 border-violet-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        map[tone]
      )}
    >
      {children}
    </span>
  );
}

function ProgressBar({ value, className = "", fillClassName = "bg-slate-200" }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 rounded-full bg-slate-800", className)}>
      <div className={cn("h-2 rounded-full transition-all", fillClassName)} style={{ width: `${clamped}%` }} />
    </div>
  );
}

function MetricCard({ title, value, sub, icon: Icon, tone = "blue", trend }) {
  const toneMap = {
    blue: "from-blue-500/10 to-blue-400/5 text-blue-300 border-blue-500/20",
    green: "from-emerald-500/10 to-emerald-400/5 text-emerald-300 border-emerald-500/20",
    amber: "from-amber-500/10 to-amber-400/5 text-amber-300 border-amber-500/20",
    purple: "from-violet-500/10 to-violet-400/5 text-violet-300 border-violet-500/20",
    red: "from-rose-500/10 to-rose-400/5 text-rose-300 border-rose-500/20",
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-400">{title}</div>
              <div className="mt-2 flex flex-wrap items-end gap-2">
                <div className="text-2xl font-bold tracking-tight text-slate-100">{value}</div>
                {trend ? (
                  <span
                    className={cn(
                      "mb-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                      trend.direction === "up"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-rose-500/30 bg-rose-500/10 text-rose-300"
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
              {sub ? <div className="mt-1 text-xs text-slate-500">{sub}</div> : null}
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

function SectionIntro({ title, description, icon: Icon }) {
  return (
    <Card className="border-slate-700 bg-slate-900">
      <div className="flex items-start gap-3 p-4">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-2">
          <Icon className="h-4 w-4 text-slate-200" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-100">{title}</div>
          <div className="mt-1 text-sm text-slate-400">{description}</div>
        </div>
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
          ? "border border-slate-700 bg-slate-800 text-white shadow"
          : "border border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900 hover:text-slate-200"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

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
        { date: "Feb 15", type: "Attendance", note: "Attended Week 1" },
        { date: "Feb 22", type: "No-show", note: "Missed Week 2" },
        { date: "Feb 22", type: "Automation", note: "Missed-session SMS triggered" },
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
        { date: "Feb 05", type: "Voucher", note: "Voucher redeemed online" },
        { date: "Feb 06", type: "Enrollment", note: "Placed in cohort NV-WALK-02" },
        { date: "Feb 20", type: "Milestone", note: "Reached Week 4" },
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
        { date: "Jan 10", type: "Enrollment", note: "Joined previous cohort" },
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
        { date: "Feb 22", type: "Lead", note: "Came from QR poster / gym noticeboard" },
        { date: "Feb 23", type: "Call", note: "Booked trial for Monday" },
      ],
      tasks: [{ id: "t4", title: "Send 24h reminder", due: "Today", priority: "High", done: false }],
    },
    {
      id: "P-1005",
      name: "Nina K.",
      phone: "(519) 555-0105",
      stage: "Active",
      risk: "Medium",
      program: "Mobility Reset After Work",
      cohortId: "NV-FLEX-02",
      nextSession: "Wed 6:30 PM",
      attendanceRate: 71,
      retentionProbability: 65,
      subsidyType: "Standard",
      balance: 0,
      lastTouch: "Coach check-in • 3 days ago",
      owner: "Noah L.",
      tags: ["Returning after injury"],
      timeline: [
        { date: "Feb 08", type: "Enrollment", note: "Joined mobility cohort" },
        { date: "Feb 12", type: "Coach note", note: "Asked for lower-intensity modification" },
        { date: "Feb 19", type: "Attendance", note: "Hit 3-week streak" },
      ],
      tasks: [{ id: "t5", title: "Offer milestone reward preview", due: "This week", priority: "Medium", done: false }],
    },
    {
      id: "P-1006",
      name: "Owen B.",
      phone: "(519) 555-0174",
      stage: "At Risk",
      risk: "High",
      program: "Weekend Walking Cohort",
      cohortId: "NV-WALK-03",
      nextSession: "Sat 9:00 AM",
      attendanceRate: 58,
      retentionProbability: 49,
      subsidyType: "Voucher",
      balance: 0,
      lastTouch: "No response to reminder • 2 days ago",
      owner: "Farah A.",
      tags: ["Busy parent", "Missed W2"],
      timeline: [
        { date: "Feb 10", type: "Enrollment", note: "Weekend cohort confirmed" },
        { date: "Feb 17", type: "No-show", note: "Missed Week 2" },
        { date: "Feb 17", type: "Automation", note: "Missed-session re-entry SMS" },
        { date: "Feb 20", type: "No reply", note: "Still pending" },
      ],
      tasks: [{ id: "t6", title: "Manual call if no reply by tonight", due: "Today", priority: "High", done: false }],
    },
    {
      id: "P-1007",
      name: "Leah M.",
      phone: "(519) 555-0116",
      stage: "Lead",
      risk: "Low",
      program: "General intake",
      cohortId: "INTAKE",
      nextSession: "Needs scheduling",
      attendanceRate: 0,
      retentionProbability: 32,
      subsidyType: "Unknown",
      balance: 0,
      lastTouch: "Web inquiry • 6h ago",
      owner: "Intake Queue",
      tags: ["Price questions"],
      timeline: [{ date: "Today", type: "Lead", note: "Website form: interested in beginner program" }],
      tasks: [{ id: "t7", title: "Call lead + explain sliding-scale options", due: "Today", priority: "High", done: false }],
    },
    {
      id: "P-1008",
      name: "David H.",
      phone: "(519) 555-0139",
      stage: "Completed",
      risk: "Low",
      program: "Mobility + Strength",
      cohortId: "NV-MOB-01",
      nextSession: "Re-enrollment invite pending",
      attendanceRate: 81,
      retentionProbability: 76,
      subsidyType: "Standard",
      balance: 0,
      lastTouch: "Completion certificate sent • 1 day ago",
      owner: "Samir K.",
      tags: ["Good candidate for re-enroll"],
      timeline: [
        { date: "Jan 05", type: "Enrollment", note: "Joined cohort" },
        { date: "Feb 22", type: "Completion", note: "Completed 8-week cycle" },
      ],
      tasks: [{ id: "t8", title: "Send re-enrollment offer", due: "Tomorrow", priority: "Medium", done: false }],
    },
  ],
  programs: [
    { id: "NV-MOB-01", title: "Mobility + Strength", capacity: 12, enrolled: 12, waitlist: 5, coach: "Samir K.", attendance: 78, retention: 67 },
    { id: "NV-WALK-02", title: "Walk + Conditioning", capacity: 15, enrolled: 14, waitlist: 2, coach: "Leila M.", attendance: 72, retention: 61 },
    { id: "NV-CORE-03", title: "Core + Cardio Reset", capacity: 10, enrolled: 8, waitlist: 0, coach: "Devon P.", attendance: 69, retention: 56 },
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
  { id: "programs", label: "Programs", icon: Calendar },
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
  const people = data.participants;
  const active = people.filter((p) => p.stage === "Active").length;
  const atRisk = people.filter((p) => p.stage === "At Risk").length;
  const leads = people.filter((p) => p.stage === "Lead" || p.stage === "Trial Booked").length;
  const reEnrolled = people.filter((p) => p.stage === "Re-enrolled").length;
  const tasksDue = people.flatMap((p) => p.tasks || []).filter((t) => !t.done).length;
  const avgAttendance =
    people.filter((p) => p.attendanceRate > 0).reduce((s, p) => s + p.attendanceRate, 0) /
    Math.max(1, people.filter((p) => p.attendanceRate > 0).length);

  return { active, atRisk, leads, reEnrolled, tasksDue, avgAttendance };
}

function OverviewTab({ data, onSelectParticipant }) {
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
    {
      name: "Completed/Renewed",
      value: data.participants.filter((p) => ["Completed", "Re-enrolled"].includes(p.stage)).length,
    },
  ];

  return (
    <div className="space-y-5">
      <SectionIntro
        icon={Home}
        title="What this page shows"
        description="A simple operating view: who is active, who may drop off, what staff need to do next, and whether retention is improving over time."
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
          <CardHeader
            title="Retention Trend"
            subtitle="Simple outcome signal judges can understand quickly"
            right={<Badge tone="blue">{data.municipalOwner}</Badge>}
          />
          <div className="h-72 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.retentionTrend} margin={{ top: 10, right: 16, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="retFillA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="reFillA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                <Area type="monotone" dataKey="retention" name="Retention %" stroke="#60a5fa" strokeWidth={2.5} fill="url(#retFillA)" />
                <Area type="monotone" dataKey="reEnroll" name="Re-enrollment %" stroke="#34d399" strokeWidth={2.5} fill="url(#reFillA)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Pipeline Snapshot" subtitle="High-level funnel mix" />
          <div className="space-y-3 p-4">
            <div className="h-44 rounded-xl border border-slate-800 bg-slate-950/50 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={58} innerRadius={35} paddingAngle={3}>
                    {pieData.map((entry, idx) => (
                      <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {pieData.map((p, i) => (
              <div key={p.name} className="rounded-xl border border-slate-800 p-3">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-300">{p.name}</span>
                  <span className="text-slate-100">{p.value}</span>
                </div>
                <ProgressBar
                  value={(p.value / Math.max(data.participants.length, 1)) * 100}
                  fillClassName={i % 2 ? "bg-blue-400" : "bg-slate-200"}
                />
              </div>
            ))}

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-200">
              This dashboard behaves like an operating CRM, not just a report: staff can identify people, take action, and track outcomes.
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
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-left transition hover:border-slate-700 hover:bg-slate-950"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{p.name}</div>
                    <div className="mt-1 text-xs text-slate-400">
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
                    <div className="font-semibold text-slate-100">{p.attendanceRate}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Retention</div>
                    <div className="font-semibold text-slate-100">{p.retentionProbability}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Last touch</div>
                    <div className="font-semibold text-slate-100">{p.lastTouch.split(" • ")[0]}</div>
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
              <div key={t.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-100">{t.title}</div>
                  <Badge tone={t.priority === "High" ? "red" : t.priority === "Medium" ? "amber" : "default"}>
                    {t.priority}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-slate-400">
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
        description="A simple lifecycle board from lead → trial → active → at-risk → completed → re-enrolled, so judges can see the journey clearly."
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
              <div key={stage} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-100">{stage}</div>
                  <Badge tone={getStageTone(stage)}>{grouped[stage]?.length || 0}</Badge>
                </div>
                <div className="space-y-3">
                  {(grouped[stage] || []).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onSelectParticipant(p.id)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-700"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-100">{p.name}</div>
                          <div className="mt-1 truncate text-xs text-slate-400">{p.program}</div>
                        </div>
                        <Badge tone={getRiskTone(p.risk)}>{p.risk}</Badge>
                      </div>
                      <div className="mt-3 text-xs text-slate-500">{p.nextSession}</div>
                      <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                          <span>Retention probability</span>
                          <span>{p.retentionProbability}%</span>
                        </div>
                        <ProgressBar
                          value={p.retentionProbability}
                          fillClassName={
                            p.retentionProbability >= 75
                              ? "bg-emerald-400"
                              : p.retentionProbability >= 55
                              ? "bg-amber-400"
                              : "bg-rose-400"
                          }
                        />
                      </div>
                    </button>
                  ))}
                  {(grouped[stage] || []).length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-700 p-3 text-xs text-slate-500">No records</div>
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

function ParticipantsTab({
  data,
  selectedParticipantId,
  onSelectParticipant,
  search,
  onSearchChange,
  filterStage,
  onFilterStageChange,
}) {
  const filtered = useMemo(() => {
    return data.participants.filter((p) => {
      const q = search.trim().toLowerCase();
      const hit =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.program.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
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
        description="A searchable participant CRM view. Judges can click a person and immediately see status, tasks, notes, and history."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1fr]">
        <Card>
          <CardHeader
            title="Participant records"
            subtitle="Leads, active participants, and renewals in one place"
            right={<Badge tone="blue">{filtered.length} shown</Badge>}
          />
          <div className="border-b border-slate-800 p-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search name, program, tags, ID..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-100 shadow-sm placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
                />
              </div>
              <select
                value={filterStage}
                onChange={(e) => onFilterStageChange(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm"
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
              <thead className="sticky top-0 z-10 bg-slate-950 text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Participant</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Program</th>
                  <th className="px-4 py-3">Next Session</th>
                  <th className="px-4 py-3">Owner</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => onSelectParticipant(p.id)}
                    className={cn(
                      "cursor-pointer border-t border-slate-800 hover:bg-slate-950/70",
                      selected?.id === p.id && "bg-slate-900/60"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-100">{p.name}</div>
                      <div className="text-xs text-slate-500">
                        {p.id} • {p.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={getStageTone(p.stage)}>{p.stage}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={getRiskTone(p.risk)}>{p.risk}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{p.program}</td>
                    <td className="px-4 py-3 text-slate-300">{p.nextSession}</td>
                    <td className="px-4 py-3 text-slate-300">{p.owner}</td>
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
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <div className="text-xs text-slate-500">Retention probability</div>
                  <div className="mt-1 text-xl font-bold text-slate-100">{selected.retentionProbability}%</div>
                  <div className="mt-2">
                    <ProgressBar
                      value={selected.retentionProbability}
                      fillClassName={
                        selected.retentionProbability >= 75
                          ? "bg-emerald-400"
                          : selected.retentionProbability >= 55
                          ? "bg-amber-400"
                          : "bg-rose-400"
                      }
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <div className="text-xs text-slate-500">Attendance rate</div>
                  <div className="mt-1 text-xl font-bold text-slate-100">{selected.attendanceRate}%</div>
                  <div className="mt-2 text-xs text-slate-500">Next: {selected.nextSession}</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <div className="text-xs text-slate-500">Support / payment</div>
                  <div className="mt-1 font-semibold text-slate-100">{selected.subsidyType}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Balance / credit:{" "}
                    {selected.balance < 0
                      ? `Credit ${formatCurrency(Math.abs(selected.balance))}`
                      : formatCurrency(selected.balance)}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <div className="text-xs text-slate-500">Owner</div>
                  <div className="mt-1 font-semibold text-slate-100">{selected.owner}</div>
                  <div className="mt-1 text-xs text-slate-500">{selected.lastTouch}</div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <div className="text-sm font-semibold text-slate-100">Tags</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.tags.map((t) => (
                    <Badge key={t} tone="default">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <div className="text-sm font-semibold text-slate-100">Open tasks</div>
                <div className="mt-3 space-y-2">
                  {selected.tasks.length ? (
                    selected.tasks.map((t) => (
                      <div key={t.id} className="rounded-lg border border-slate-800 p-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm text-slate-200">{t.title}</div>
                          <Badge tone={t.priority === "High" ? "red" : t.priority === "Medium" ? "amber" : "default"}>
                            {t.priority}
                          </Badge>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">Due {t.due}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500">No open tasks.</div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <div className="text-sm font-semibold text-slate-100">Timeline</div>
                <div className="mt-3 space-y-3">
                  {selected.timeline.map((e, idx) => (
                    <div key={`${e.date}-${idx}`} className="flex gap-3">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-200" />
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          {e.date} • {e.type}
                        </div>
                        <div className="text-sm text-slate-200">{e.note}</div>
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

function CommsTab({ data }) {
  const nudgeMix = [
    { name: "Reminders", value: 62 },
    { name: "Rescue nudges", value: 21 },
    { name: "Milestone prompts", value: 11 },
    { name: "Re-enroll offers", value: 6 },
  ];

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
        description="Communication workflows tied to retention: reminders, rescue nudges, and re-enrollment messaging. It shows how outreach supports outcomes."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader title="Comms trend" subtitle="Messages, replies, and retention rescues over time" />
          <div className="h-72 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.commsByWeek} margin={{ top: 10, right: 16, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0" }}
                />
                <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                <Line type="monotone" dataKey="reminders" name="Messages" stroke="#e2e8f0" strokeWidth={2.5} />
                <Line type="monotone" dataKey="replies" name="Replies" stroke="#60a5fa" strokeWidth={2.5} />
                <Line type="monotone" dataKey="rescues" name="Rescues" stroke="#34d399" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Nudge mix" subtitle="What messages are used for" />
          <div className="grid grid-cols-1 gap-2 p-4">
            <div className="h-52 rounded-xl border border-slate-800 bg-slate-950/40 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={nudgeMix} dataKey="value" nameKey="name" outerRadius={70} innerRadius={40} paddingAngle={3}>
                    {nudgeMix.map((entry, idx) => (
                      <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {nudgeMix.map((n, idx) => (
              <div key={n.name} className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-300">{n.name}</span>
                </div>
                <span className="font-medium text-slate-100">{n.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Template examples" subtitle="Simple examples connected to the participant journey" />
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
          {topTemplates.map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-slate-100">{t.name}</div>
                <Badge tone="blue">{t.purpose}</Badge>
              </div>
              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm text-slate-300">
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

function ProgramsTab({ data }) {
  const utilizationData = data.programs.map((p) => ({
    name: p.id.replace(/^[A-Z]+-/, ""),
    fill: Math.round((p.enrolled / Math.max(p.capacity, 1)) * 100),
    retention: p.retention,
    attendance: p.attendance,
  }));

  return (
    <div className="space-y-5">
      <SectionIntro
        icon={Calendar}
        title="What this page shows"
        description="Program operations and outcomes in one view: capacity, waitlists, attendance, and retention. This helps judges see operational practicality."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader title="Cohort list" subtitle="Simple class operations view" />
          <div className="space-y-3 p-4">
            {data.programs.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{p.title}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {p.id} • Coach {p.coach}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="blue">
                      {p.enrolled}/{p.capacity} filled
                    </Badge>
                    <Badge tone="purple">Waitlist {p.waitlist}</Badge>
                    <Badge tone="green">Attendance {p.attendance}%</Badge>
                    <Badge tone="default">Retention {p.retention}%</Badge>
                  </div>
                </div>
                <div className="mt-3">
                  <ProgressBar value={(p.enrolled / Math.max(p.capacity, 1)) * 100} fillClassName="bg-blue-400" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Fill vs outcomes" subtitle="Capacity and outcome relationship (simplified)" />
          <div className="h-80 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData} margin={{ top: 10, right: 16, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0" }} />
                <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                <Bar dataKey="fill" name="Fill %" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="attendance" name="Attendance %" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                <Bar dataKey="retention" name="Retention %" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function PhonePreviewPanel({ centreName, participant, collapsed, onToggle }) {
  return (
    <Card className="sticky top-4">
      <CardHeader
        title="Client App Preview"
        subtitle="Participant-side mobile experience (dark mode demo)"
        right={
          <button
            onClick={onToggle}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800"
          >
            {collapsed ? "Show" : "Hide"}
          </button>
        }
      />
      <AnimatePresence initial={false}>
        {!collapsed ? (
          <motion.div
            key="phone"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4"
          >
            <div className="mb-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-400">
              <div className="font-semibold text-slate-200">Mirroring selected participant</div>
              <div className="mt-1">{participant ? `${participant.name} • ${participant.stage}` : "No participant selected"}</div>
              <div className="mt-1">{centreName}</div>
            </div>
            <ClientAppPreview participant={participant} centreName={centreName} />
            <div className="mt-3 text-xs text-slate-500">
              This links the staff CRM view to the participant experience (messages, schedule, rewards, check-in).
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 text-sm text-slate-500"
          >
            Phone preview hidden.
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function ActiveLinkCrmDashboardDemo() {
  const data = centre;
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedParticipantId, setSelectedParticipantId] = useState(data.participants[0].id);
  const [phoneCollapsed, setPhoneCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");

  useEffect(() => {
    setSelectedParticipantId(data.participants[0]?.id || "");
    setSearch("");
    setFilterStage("all");
  }, [data.id]);

  const selectedParticipant =
    data.participants.find((p) => p.id === selectedParticipantId) || data.participants[0] || null;
  const tabMeta = tabs.find((t) => t.id === selectedTab) || tabs[0];
  const TabIcon = tabMeta.icon;
  const crmMetrics = buildCrmMetrics(data);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-[1800px] p-4 md:p-6">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[230px_minmax(0,1fr)_380px]">
          {/* Left Sidebar Navigation */}
          <aside className="xl:sticky xl:top-4 xl:h-[calc(100vh-2rem)]">
            <Card className="h-full">
              <div className="flex h-full flex-col">
                <div className="border-b border-slate-800 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-2.5">
                      <Sparkles className="h-5 w-5 text-blue-300" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-base font-bold tracking-tight text-white">ActiveLink CRM</h1>
                        <Badge tone="blue">Prototype</Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        Demo for community recreation retention workflows
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
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

                <div className="mt-auto border-t border-slate-800 p-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                    <div className="text-xs font-semibold text-slate-200">{data.name}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {data.city} • {data.municipalOwner}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-slate-800 p-2">
                        <div className="text-[10px] text-slate-500">Active</div>
                        <div className="text-sm font-semibold text-slate-100">{crmMetrics.active}</div>
                      </div>
                      <div className="rounded-lg border border-slate-800 p-2">
                        <div className="text-[10px] text-slate-500">At-risk</div>
                        <div className="text-sm font-semibold text-slate-100">{crmMetrics.atRisk}</div>
                      </div>
                    </div>
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
              className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <TabIcon className="h-4 w-4 text-slate-300" />
                  <span className="font-semibold text-slate-100">{tabMeta.label}</span>
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                  <span className="text-slate-400">{data.name}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="green">
                    <Users className="h-3.5 w-3.5" /> {crmMetrics.active} active
                  </Badge>
                  <Badge tone="red">
                    <AlertTriangle className="h-3.5 w-3.5" /> {crmMetrics.atRisk} at risk
                  </Badge>
                  <Badge tone="purple">
                    <Target className="h-3.5 w-3.5" /> {crmMetrics.leads} leads/trials
                  </Badge>
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
                {selectedTab === "overview" && <OverviewTab data={data} onSelectParticipant={setSelectedParticipantId} />}
                {selectedTab === "pipeline" && <PipelineTab data={data} onSelectParticipant={setSelectedParticipantId} />}
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
                {selectedTab === "comms" && <CommsTab data={data} />}
                {selectedTab === "programs" && <ProgramsTab data={data} />}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-100">Prototype Notes</div>
                  <p className="mt-1 text-xs text-slate-500">
                    Front-end demo only. All people, classes, metrics, and outcomes are illustrative fake data. No real participant data or backend.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge tone="blue">React + Tailwind</Badge>
                  <Badge tone="purple">Framer Motion</Badge>
                  <Badge tone="green">Recharts</Badge>
                  <Badge tone="amber">Mobile preview linked to CRM</Badge>
                </div>
              </div>
            </div>
          </main>

          {/* Right Phone Preview */}
          <div className="min-w-0">
            <PhonePreviewPanel
              centreName={data.name}
              participant={selectedParticipant}
              collapsed={phoneCollapsed}
              onToggle={() => setPhoneCollapsed((v) => !v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Filter,
  HeartPulse,
  Home,
  KanbanSquare,
  MessageSquare,
  Phone,
  Search,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  UserRound,
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import ClientAppPreview from "./ClientAppPreview";

const COLORS = ["#0f172a", "#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

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
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium", map[tone])}>
      {children}
    </span>
  );
}

function ProgressBar({ value, className = "", fillClassName = "bg-slate-900" }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 rounded-full bg-slate-100", className)}>
      <div className={cn("h-2 rounded-full transition-all", fillClassName)} style={{ width: `${clamped}%` }} />
    </div>
  );
}

function MetricCard({ title, value, sub, icon: Icon, tone = "blue", trend }) {
  const toneMap = {
    blue: "from-blue-50 to-blue-100/40 text-blue-700 border-blue-200",
    green: "from-emerald-50 to-emerald-100/40 text-emerald-700 border-emerald-200",
    amber: "from-amber-50 to-amber-100/40 text-amber-700 border-amber-200",
    purple: "from-violet-50 to-violet-100/40 text-violet-700 border-violet-200",
    red: "from-rose-50 to-rose-100/40 text-rose-700 border-rose-200",
  };
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-500">{title}</div>
              <div className="mt-2 flex flex-wrap items-end gap-2">
                <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
                {trend ? (
                  <span
                    className={cn(
                      "mb-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                      trend.direction === "up"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-rose-200 bg-rose-50 text-rose-700"
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

const centres = [
  {
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
  },
  {
    id: "riverside",
    name: "Riverside Recreation Hub",
    city: "Kitchener, ON",
    audience: "Adults 20–40",
    municipalOwner: "City of Kitchener",
    monthlyMRRDemo: 3600,
    participants: [
      {
        id: "P-2001",
        name: "Emma J.",
        phone: "(226) 555-0151",
        stage: "Active",
        risk: "Low",
        program: "Strength Foundations",
        cohortId: "RV-STR-01",
        nextSession: "Mon 7:30 PM",
        attendanceRate: 84,
        retentionProbability: 82,
        subsidyType: "Standard",
        balance: 0,
        lastTouch: "Reminder confirmed • 1 day ago",
        owner: "Priya S.",
        tags: ["Consistent"],
        timeline: [{ date: "Feb 01", type: "Enrollment", note: "Strength Foundations" }],
        tasks: [],
      },
      {
        id: "P-2002",
        name: "Isaac L.",
        phone: "(226) 555-0119",
        stage: "At Risk",
        risk: "High",
        program: "Mobility Reset After Work",
        cohortId: "RV-FLEX-02",
        nextSession: "Wed 6:30 PM",
        attendanceRate: 52,
        retentionProbability: 46,
        subsidyType: "Sliding Scale",
        balance: 0,
        lastTouch: "Missed session • yesterday",
        owner: "Noah L.",
        tags: ["Night shift", "Needs alternative slot"],
        timeline: [{ date: "Yesterday", type: "No-show", note: "Missed session, no reply yet" }],
        tasks: [{ id: "rt1", title: "Offer Saturday option", due: "Today", priority: "High", done: false }],
      },
      {
        id: "P-2003",
        name: "Sara B.",
        phone: "(226) 555-0171",
        stage: "Completed",
        risk: "Low",
        program: "Weekend Walking Cohort",
        cohortId: "RV-WALK-03",
        nextSession: "Re-enrollment invite pending",
        attendanceRate: 77,
        retentionProbability: 72,
        subsidyType: "Voucher",
        balance: 0,
        lastTouch: "Completion SMS • 3 days ago",
        owner: "Farah A.",
        tags: ["Potential referral"],
        timeline: [{ date: "Feb 20", type: "Completion", note: "Completed 8-week cycle" }],
        tasks: [{ id: "rt2", title: "Send referral incentive", due: "Tomorrow", priority: "Low", done: false }],
      },
      {
        id: "P-2004",
        name: "Noel W.",
        phone: "(226) 555-0165",
        stage: "Lead",
        risk: "Low",
        program: "General intake",
        cohortId: "INTAKE",
        nextSession: "Needs call",
        attendanceRate: 0,
        retentionProbability: 29,
        subsidyType: "Unknown",
        balance: 0,
        lastTouch: "Instagram inquiry • 4h ago",
        owner: "Intake Queue",
        tags: ["Asks about cost"],
        timeline: [{ date: "Today", type: "Lead", note: "IG DM interested in beginner classes" }],
        tasks: [{ id: "rt3", title: "Call lead before evening", due: "Today", priority: "High", done: false }],
      },
      {
        id: "P-2005",
        name: "Priya D.",
        phone: "(226) 555-0102",
        stage: "Re-enrolled",
        risk: "Low",
        program: "Strength Foundations",
        cohortId: "RV-STR-01",
        nextSession: "Mon 7:30 PM",
        attendanceRate: 88,
        retentionProbability: 90,
        subsidyType: "Standard",
        balance: -15,
        lastTouch: "Re-enrollment confirmed • 2 days ago",
        owner: "Priya S.",
        tags: ["Advocate"],
        timeline: [{ date: "Feb 22", type: "Re-enroll", note: "Joined next cycle immediately" }],
        tasks: [],
      },
    ],
    programs: [
      { id: "RV-STR-01", title: "Strength Foundations", capacity: 14, enrolled: 13, waitlist: 3, coach: "Priya S.", attendance: 74, retention: 59 },
      { id: "RV-FLEX-02", title: "Mobility Reset After Work", capacity: 12, enrolled: 10, waitlist: 0, coach: "Noah L.", attendance: 70, retention: 54 },
      { id: "RV-WALK-03", title: "Weekend Walking Cohort", capacity: 18, enrolled: 17, waitlist: 4, coach: "Farah A.", attendance: 77, retention: 62 },
    ],
    commsByWeek: [
      { week: "W1", reminders: 65, replies: 19, rescues: 5 },
      { week: "W2", reminders: 72, replies: 21, rescues: 6 },
      { week: "W3", reminders: 78, replies: 23, rescues: 7 },
      { week: "W4", reminders: 80, replies: 25, rescues: 9 },
      { week: "W5", reminders: 86, replies: 28, rescues: 10 },
      { week: "W6", reminders: 92, replies: 30, rescues: 11 },
    ],
    retentionTrend: [
      { month: "Sep", retention: 38, reEnroll: 18 },
      { month: "Oct", retention: 43, reEnroll: 21 },
      { month: "Nov", retention: 48, reEnroll: 24 },
      { month: "Dec", retention: 52, reEnroll: 28 },
      { month: "Jan", retention: 55, reEnroll: 31 },
      { month: "Feb", retention: 58, reEnroll: 34 },
    ],
  },
];

const tabs = [
  { id: "overview", label: "CRM Overview", icon: Home },
  { id: "pipeline", label: "Pipeline", icon: KanbanSquare },
  { id: "participants", label: "Participants", icon: Users },
  { id: "comms", label: "Comms", icon: MessageSquare },
  { id: "programs", label: "Programs", icon: Calendar },
];

function useCentreData(selectedCentreId) {
  return useMemo(() => centres.find((c) => c.id === selectedCentreId) || centres[0], [selectedCentreId]);
}

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
    .slice(0, 6);

  const pieData = [
    { name: "Lead / Trial", value: data.participants.filter((p) => ["Lead", "Trial Booked"].includes(p.stage)).length },
    { name: "Active", value: data.participants.filter((p) => p.stage === "Active").length },
    { name: "At Risk", value: data.participants.filter((p) => p.stage === "At Risk").length },
    { name: "Completed / Re-enrolled", value: data.participants.filter((p) => ["Completed", "Re-enrolled"].includes(p.stage)).length },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Active Participants"
          value={`${metrics.active}`}
          sub={`${data.audience} • current cohorts`}
          icon={Users}
          tone="blue"
          trend={{ direction: "up", label: "+8% vs last cycle" }}
        />
        <MetricCard
          title="At-Risk Queue"
          value={`${metrics.atRisk}`}
          sub="Needs intervention this week"
          icon={AlertTriangle}
          tone="red"
          trend={metrics.atRisk > 2 ? { direction: "down", label: "watchlist" } : undefined}
        />
        <MetricCard
          title="Open Leads / Trials"
          value={`${metrics.leads}`}
          sub="Intake pipeline to convert"
          icon={Target}
          tone="purple"
        />
        <MetricCard
          title="Avg Attendance"
          value={formatPct(metrics.avgAttendance)}
          sub="Across participants with attendance history"
          icon={Activity}
          tone="green"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Retention + Re-enrollment Trend"
            subtitle="CRM-style outcome tracking for grant reports and municipal contracts"
            right={<Badge tone="blue">{data.municipalOwner}</Badge>}
          />
          <div className="h-80 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.retentionTrend} margin={{ top: 10, right: 16, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="retFillA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="reFillA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Legend />
                <Area type="monotone" dataKey="retention" name="Retention %" stroke="#0f172a" strokeWidth={2.5} fill="url(#retFillA)" />
                <Area type="monotone" dataKey="reEnroll" name="Re-enrollment %" stroke="#2563eb" strokeWidth={2.5} fill="url(#reFillA)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Pipeline Snapshot" subtitle="What a CRM should answer at a glance" />
          <div className="space-y-3 p-4">
            {pieData.map((p, i) => (
              <div key={p.name} className="rounded-xl border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800">{p.name}</span>
                  <span className="text-slate-900">{p.value}</span>
                </div>
                <ProgressBar value={(p.value / Math.max(data.participants.length, 1)) * 100} fillClassName={i % 2 ? "bg-blue-600" : "bg-slate-900"} />
              </div>
            ))}

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              <div className="font-semibold">Judge angle</div>
              <div className="mt-1">
                This is no longer just an analytics dashboard — it behaves like an operating CRM for leads, participants, interventions, and renewals.
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="At-Risk Queue" subtitle="Prioritized people who may drop without intervention" />
          <div className="space-y-3 p-4">
            {atRiskQueue.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectParticipant(p.id)}
                className="w-full rounded-xl border border-slate-200 p-3 text-left transition hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                    <div className="mt-1 text-xs text-slate-500">
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
                    <div className="font-semibold text-slate-900">{p.attendanceRate}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Retention prob.</div>
                    <div className="font-semibold text-slate-900">{p.retentionProbability}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Last touch</div>
                    <div className="font-semibold text-slate-900">{p.lastTouch.split(" • ")[0]}</div>
                  </div>
                </div>
              </button>
            ))}
            {atRiskQueue.length === 0 && <div className="text-sm text-slate-500">No at-risk participants right now.</div>}
          </div>
        </Card>

        <Card>
          <CardHeader title="Task Queue" subtitle="Operational work the CRM surfaces for staff" />
          <div className="space-y-3 p-4">
            {upcomingTasks.map((t) => (
              <div key={t.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-900">{t.title}</div>
                  <Badge tone={t.priority === "High" ? "red" : t.priority === "Medium" ? "amber" : "default"}>
                    {t.priority}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {t.participantName} • Due {t.due}
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && <div className="text-sm text-slate-500">No pending tasks.</div>}
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
      <Card>
        <CardHeader
          title="Participant Pipeline (CRM Board)"
          subtitle="This is the heart of the CRM demo: acquisition → activation → retention → renewal"
          right={<Badge tone="purple">{data.participants.length} records</Badge>}
        />
        <div className="overflow-x-auto p-4">
          <div className="grid min-w-[980px] grid-cols-6 gap-4">
            {stages.map((stage) => (
              <div key={stage} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">{stage}</div>
                  <Badge tone={getStageTone(stage)}>{grouped[stage]?.length || 0}</Badge>
                </div>
                <div className="space-y-3">
                  {(grouped[stage] || []).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onSelectParticipant(p.id)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-900">{p.name}</div>
                          <div className="mt-1 truncate text-xs text-slate-500">{p.program}</div>
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
                              ? "bg-emerald-600"
                              : p.retentionProbability >= 55
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }
                        />
                      </div>
                    </button>
                  ))}
                  {(grouped[stage] || []).length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-3 text-xs text-slate-400">No records</div>
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
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader
          title="Participant Records"
          subtitle="Searchable CRM table for leads, active participants, and renewals"
          right={
            <div className="flex items-center gap-2">
              <Badge tone="blue">{filtered.length} shown</Badge>
            </div>
          }
        />
        <div className="border-b border-slate-100 p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search name, program, tags, ID..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
              />
            </div>
            <select
              value={filterStage}
              onChange={(e) => onFilterStageChange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
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
            <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Participant</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Next Session</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Owner</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => onSelectParticipant(p.id)}
                  className={cn(
                    "cursor-pointer border-t border-slate-100 hover:bg-slate-50/70",
                    selected?.id === p.id && "bg-slate-50"
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.id} • {p.phone}</div>
                  </td>
                  <td className="px-4 py-3"><Badge tone={getStageTone(p.stage)}>{p.stage}</Badge></td>
                  <td className="px-4 py-3"><Badge tone={getRiskTone(p.risk)}>{p.risk}</Badge></td>
                  <td className="px-4 py-3 text-slate-700">{p.program}</td>
                  <td className="px-4 py-3 text-slate-700">{p.nextSession}</td>
                  <td className="px-4 py-3 text-slate-900">{p.attendanceRate}%</td>
                  <td className="px-4 py-3 text-slate-700">{p.owner}</td>
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
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs text-slate-500">Retention probability</div>
                <div className="mt-1 text-xl font-bold text-slate-900">{selected.retentionProbability}%</div>
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
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs text-slate-500">Attendance rate</div>
                <div className="mt-1 text-xl font-bold text-slate-900">{selected.attendanceRate}%</div>
                <div className="mt-2 text-xs text-slate-500">Next: {selected.nextSession}</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs text-slate-500">Subsidy / payment</div>
                <div className="mt-1 font-semibold text-slate-900">{selected.subsidyType}</div>
                <div className="mt-1 text-xs text-slate-500">
                  Balance / credit: {selected.balance < 0 ? `Credit ${formatCurrency(Math.abs(selected.balance))}` : formatCurrency(selected.balance)}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs text-slate-500">Owner</div>
                <div className="mt-1 font-semibold text-slate-900">{selected.owner}</div>
                <div className="mt-1 text-xs text-slate-500">{selected.lastTouch}</div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-sm font-semibold text-slate-900">Tags</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.tags.map((t) => (
                  <Badge key={t} tone="default">{t}</Badge>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-sm font-semibold text-slate-900">Open tasks</div>
              <div className="mt-3 space-y-2">
                {selected.tasks.length ? (
                  selected.tasks.map((t) => (
                    <div key={t.id} className="rounded-lg border border-slate-200 p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm text-slate-800">{t.title}</div>
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

            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-sm font-semibold text-slate-900">Timeline</div>
              <div className="mt-3 space-y-3">
                {selected.timeline.map((e, idx) => (
                  <div key={`${e.date}-${idx}`} className="flex gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-900" />
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{e.date} • {e.type}</div>
                      <div className="text-sm text-slate-800">{e.note}</div>
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
  );
}

function CommsTab({ data }) {
  const nudgeMix = [
    { name: "Reminders", value: 62 },
    { name: "Missed-session rescue", value: 21 },
    { name: "Milestone prompts", value: 11 },
    { name: "Re-enrollment offers", value: 6 },
  ];

  const topTemplates = [
    {
      name: "24h Reminder",
      purpose: "Reduce no-shows",
      sample: "Your class is tomorrow at 6:00 PM. Reply 1 to confirm, 2 to switch.",
      performance: "Open 95% • Reply 18%",
    },
    {
      name: "Missed-session Re-entry",
      purpose: "Prevent dropout after a miss",
      sample: "Missed you this week — no stress. Reply YES to save your spot.",
      performance: "Open 93% • Reply 37%",
    },
    {
      name: "Re-enrollment Offer",
      purpose: "Convert completers into next cycle",
      sample: "You completed your cohort 🎉 Want priority booking for next cycle?",
      performance: "Open 92% • Reply 22%",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Comms Performance by Week" subtitle="CRM comms panel: outreach volume, replies, and retention rescues" />
          <div className="h-80 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.commsByWeek} margin={{ top: 10, right: 16, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Legend />
                <Line type="monotone" dataKey="reminders" name="Messages sent" stroke="#0f172a" strokeWidth={2.5} />
                <Line type="monotone" dataKey="replies" name="Replies" stroke="#2563eb" strokeWidth={2.5} />
                <Line type="monotone" dataKey="rescues" name="Retention rescues" stroke="#10b981" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Nudge Mix" subtitle="Communication purpose distribution" />
          <div className="grid grid-cols-1 gap-2 p-4">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={nudgeMix} dataKey="value" nameKey="name" outerRadius={75} innerRadius={42} paddingAngle={3}>
                    {nudgeMix.map((entry, idx) => (
                      <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {nudgeMix.map((n, idx) => (
              <div key={n.name} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-700">{n.name}</span>
                </div>
                <span className="font-medium text-slate-900">{n.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Template Library (CRM)" subtitle="Operational templates tied to funnel stages" />
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
          {topTemplates.map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                <Badge tone="blue">{t.purpose}</Badge>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{t.sample}</div>
              <div className="mt-3 text-xs text-slate-500">{t.performance}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ProgramsTab({ data }) {
  const tableRows = data.programs;

  const utilizationData = data.programs.map((p) => ({
    name: p.id.replace(/^[A-Z]+-/, ""),
    fill: Math.round((p.enrolled / Math.max(p.capacity, 1)) * 100),
    retention: p.retention,
    attendance: p.attendance,
  }));

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title="Program / Cohort Operations" subtitle="CRM + operations view for classes, capacity, waitlists, and outcomes" />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Coach</th>
                <th className="px-4 py-3">Enrollment</th>
                <th className="px-4 py-3">Waitlist</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Retention</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((p) => (
                <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{p.title}</div>
                    <div className="text-xs text-slate-500">{p.id}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{p.coach}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{p.enrolled}/{p.capacity}</div>
                    <div className="mt-1 w-28">
                      <ProgressBar value={(p.enrolled / Math.max(p.capacity, 1)) * 100} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{p.waitlist}</td>
                  <td className="px-4 py-3 text-slate-900">{p.attendance}%</td>
                  <td className="px-4 py-3 text-slate-900">{p.retention}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Cohort Fill vs Outcomes" subtitle="Capacity management + participant outcomes in one view" />
          <div className="h-80 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData} margin={{ top: 10, right: 16, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Legend />
                <Bar dataKey="fill" name="Fill %" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="attendance" name="Attendance %" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="retention" name="Retention %" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="What this CRM demonstrates" subtitle="Judge-facing talking points" />
          <div className="space-y-3 p-4 text-sm">
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="font-semibold text-slate-900">Lead → participant continuity</div>
              <p className="mt-1 text-slate-600">
                One system tracks the whole journey instead of separate spreadsheets for intake, attendance, and subsidies.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="font-semibold text-slate-900">Intervention-ready operations</div>
              <p className="mt-1 text-slate-600">
                Staff can see exactly who needs a reminder, re-entry offer, or schedule swap.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="font-semibold text-slate-900">Public-sector alignment</div>
              <p className="mt-1 text-slate-600">
                Outcomes, access supports, and utilization can be shown in one reporting workflow.
              </p>
            </div>
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
        subtitle="Interactive phone-side simulation embedded in the CRM"
        right={
          <button
            onClick={onToggle}
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
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
            <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <div className="font-semibold text-slate-800">Mirroring selected participant</div>
              <div className="mt-1">{participant ? `${participant.name} • ${participant.stage}` : "No participant selected"}</div>
              <div className="mt-1">{centreName}</div>
            </div>
            <ClientAppPreview participant={participant} centreName={centreName} />
            <div className="mt-3 text-xs text-slate-500">
              Judges can click the phone tabs to see the participant-side experience (schedule, messages, rewards, check-in).
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
  const [selectedCentreId, setSelectedCentreId] = useState(centres[0].id);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedParticipantId, setSelectedParticipantId] = useState(centres[0].participants[0].id);
  const [phoneCollapsed, setPhoneCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [presentationMode, setPresentationMode] = useState("judges");
  const [showNotes, setShowNotes] = useState(true);

  const data = useCentreData(selectedCentreId);

  useEffect(() => {
    setSelectedParticipantId(data.participants[0]?.id || "");
    setSearch("");
    setFilterStage("all");
  }, [data.id]);

  const selectedParticipant = data.participants.find((p) => p.id === selectedParticipantId) || data.participants[0] || null;
  const tabMeta = tabs.find((t) => t.id === selectedTab) || tabs[0];
  const crmMetrics = buildCrmMetrics(data);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-[1600px] p-4 md:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-2.5">
                <Sparkles className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight">ActiveLink CRM Demo</h1>
                  <Badge tone="blue">Prototype / Fake Data</Badge>
                  <Badge tone="purple">Judge-friendly</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Participant retention CRM for community recreation — intake, cohort management, interventions, and re-enrollment.
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
                <span className="text-xs font-medium text-slate-500">Presentation mode</span>
                <Segmented
                  value={presentationMode}
                  onChange={setPresentationMode}
                  options={[
                    { label: "Judges", value: "judges" },
                    { label: "Municipal", value: "municipal" },
                  ]}
                />
              </div>
              <button
                onClick={() => setShowNotes((v) => !v)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                {showNotes ? "Hide" : "Show"} notes
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notes */}
        <AnimatePresence>
          {showNotes && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={cn(
                "mb-5 rounded-2xl border p-4 shadow-sm",
                presentationMode === "judges" ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "rounded-xl p-2",
                    presentationMode === "judges" ? "bg-amber-100" : "bg-blue-100"
                  )}
                >
                  <Filter className={cn("h-4 w-4", presentationMode === "judges" ? "text-amber-700" : "text-blue-700")} />
                </div>
                <div>
                  <div className={cn("text-sm font-semibold", presentationMode === "judges" ? "text-amber-900" : "text-blue-900")}>
                    {presentationMode === "judges" ? "Judge Demo Path" : "Municipal Buyer Demo Path"}
                  </div>
                  {presentationMode === "judges" ? (
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-amber-800">
                      <li>Start on <b>CRM Overview</b> to show this is a real operating tool, not only charts.</li>
                      <li>Click an <b>At-Risk</b> person, then show the <b>phone preview</b> to connect staff actions to participant UX.</li>
                      <li>Use <b>Pipeline</b> to show lead-to-renewal lifecycle.</li>
                      <li>Use <b>Comms</b> to explain why SMS-based workflows matter for retention rescue.</li>
                    </ul>
                  ) : (
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-blue-800">
                      <li>Lead with <b>outcomes + utilization</b>, then drill into participant intervention workflow.</li>
                      <li>Highlight <b>at-risk queue</b>, tasking, and audit-like timeline notes.</li>
                      <li>Show <b>phone-side experience</b> as proof of participant engagement, not just admin reporting.</li>
                    </ul>
                  )}
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
          <div className="ml-auto hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 lg:flex">
            <Clock3 className="h-3.5 w-3.5" />
            CRM demo walkthrough: 4–6 min
          </div>
        </div>

        {/* Title strip */}
        <motion.div layout className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <tabMeta.icon className="h-4 w-4 text-slate-700" />
            <span className="font-semibold">{tabMeta.label}</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500">{data.name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="green"><Users className="h-3.5 w-3.5" /> {crmMetrics.active} active</Badge>
            <Badge tone="red"><AlertTriangle className="h-3.5 w-3.5" /> {crmMetrics.atRisk} at risk</Badge>
            <Badge tone="purple"><Target className="h-3.5 w-3.5" /> {crmMetrics.leads} leads/trials</Badge>
          </div>
        </motion.div>

        {/* Main content + embedded phone preview */}
        <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedTab}-${data.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {selectedTab === "overview" && (
                  <OverviewTab data={data} onSelectParticipant={setSelectedParticipantId} />
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
                {selectedTab === "comms" && <CommsTab data={data} />}
                {selectedTab === "programs" && <ProgramsTab data={data} />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="2xl:block">
            <PhonePreviewPanel
              centreName={data.name}
              participant={selectedParticipant}
              collapsed={phoneCollapsed}
              onToggle={() => setPhoneCollapsed((v) => !v)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Prototype Notes</div>
              <p className="mt-1 text-xs text-slate-500">
                Front-end demo only. All people, classes, metrics, and outcomes are illustrative fake data for presentations. No backend / no real participant data.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge tone="blue">React + Tailwind</Badge>
              <Badge tone="purple">Framer Motion</Badge>
              <Badge tone="green">Recharts</Badge>
              <Badge tone="amber">Embedded phone-side preview</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Gift,
  Home,
  MessageSquare,
  QrCode,
  ShieldCheck,
  Star,
  Trophy,
  UserRound,
} from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function MiniBadge({ children, tone = "default" }) {
  const map = {
    default: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-rose-100 text-rose-700",
    purple: "bg-violet-100 text-violet-700",
  };
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", map[tone])}>{children}</span>;
}

function ProgressBar({ value, fillClassName = "bg-slate-900" }) {
  const v = Math.max(0, Math.min(100, value || 0));
  return (
    <div className="h-2 rounded-full bg-slate-200">
      <div className={cn("h-2 rounded-full transition-all", fillClassName)} style={{ width: `${v}%` }} />
    </div>
  );
}

const defaultParticipant = {
  id: "P-0000",
  name: "Demo User",
  stage: "Active",
  risk: "Low",
  program: "Mobility + Strength",
  nextSession: "Tue 6:00 PM",
  attendanceRate: 76,
  retentionProbability: 71,
  subsidyType: "Sliding Scale",
  balance: -10,
  lastTouch: "Reminder sent • today",
  tags: ["Demo"],
};

export default function ClientAppPreview({ participant, centreName = "ActiveLink Centre" }) {
  const p = participant || defaultParticipant;
  const [tab, setTab] = useState("home");
  const [checkedIn, setCheckedIn] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [msgDraft, setMsgDraft] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "coach",
      text: `Hi ${p.name.split(" ")[0]} — just checking in. Your next session is ${p.nextSession}.`,
      time: "10:12 AM",
    },
    {
      from: "system",
      text: "You’re close to your next milestone reward 🎉",
      time: "Yesterday",
    },
  ]);

  const todayCards = useMemo(
    () => [
      { title: "Next session", value: p.nextSession, icon: CalendarDays, tone: "blue" },
      { title: "Program", value: p.program, icon: Star, tone: "purple" },
      { title: "Attendance", value: `${p.attendanceRate}%`, icon: CheckCircle2, tone: "green" },
      { title: "Rewards status", value: p.attendanceRate >= 70 ? "On track" : "Needs 1 more session", icon: Trophy, tone: "amber" },
    ],
    [p]
  );

  const quickActions = [
    { id: "confirm", label: confirmed ? "Confirmed ✅" : "Confirm attendance", icon: CheckCircle2 },
    { id: "switch", label: "Request schedule switch", icon: Clock3 },
    { id: "checkin", label: checkedIn ? "Checked in ✅" : "Demo QR check-in", icon: QrCode },
  ];

  const rewardsProgress = Math.min(100, Math.round((p.attendanceRate / 80) * 100));
  const riskTone = p.risk === "High" ? "red" : p.risk === "Medium" ? "amber" : "green";

  function handleQuickAction(actionId) {
    if (actionId === "confirm") {
      setConfirmed(true);
      setMessages((prev) => [
        ...prev,
        { from: "me", text: "Confirmed for the next session 👍", time: "Now" },
        { from: "system", text: "Great — your spot is saved.", time: "Now" },
      ]);
    }
    if (actionId === "checkin") {
      setCheckedIn(true);
      setMessages((prev) => [
        ...prev,
        { from: "system", text: "Demo check-in successful. Streak maintained 🔥", time: "Now" },
      ]);
    }
    if (actionId === "switch") {
      setTab("messages");
      setMessages((prev) => [
        ...prev,
        { from: "me", text: "Can I switch to another time this week?", time: "Now" },
        { from: "coach", text: "Yes — we can offer a Thursday slot. Want me to move you?", time: "Now" },
      ]);
    }
  }

  function sendMessage() {
    const text = msgDraft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { from: "me", text, time: "Now" }]);
    setMsgDraft("");
  }

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "schedule", label: "Schedule", icon: CalendarDays },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "rewards", label: "Rewards", icon: Gift },
    { id: "profile", label: "Profile", icon: UserRound },
  ];

  return (
    <div className="mx-auto w-[320px]">
      {/* Phone shell */}
      <div className="rounded-[2rem] border-[8px] border-slate-900 bg-slate-900 p-2 shadow-2xl">
        <div className="relative overflow-hidden rounded-[1.4rem] bg-slate-50">
          {/* notch */}
          <div className="absolute left-1/2 top-1 z-20 h-5 w-28 -translate-x-1/2 rounded-full bg-slate-900" />

          {/* status bar */}
          <div className="flex items-center justify-between px-4 pt-3 text-[10px] font-semibold text-slate-600">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span>5G</span>
              <Bell className="h-3 w-3" />
            </div>
          </div>

          {/* app header */}
          <div className="px-4 pb-3 pt-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-slate-900">ActiveLink</div>
                  <div className="text-[11px] text-slate-500">{centreName}</div>
                </div>
                <MiniBadge tone={riskTone}>{p.risk} risk</MiniBadge>
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">{p.name}</div>
              <div className="mt-1 text-[11px] text-slate-500">
                {p.stage} • {p.program}
              </div>
            </div>
          </div>

          {/* screen content */}
          <div className="h-[500px] px-3 pb-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                className="space-y-3"
              >
                {tab === "home" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {todayCards.map((c) => {
                        const Icon = c.icon;
                        return (
                          <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="mb-1 flex items-center gap-1.5">
                              <Icon className="h-3.5 w-3.5 text-slate-700" />
                              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{c.title}</div>
                            </div>
                            <div className="text-xs font-semibold text-slate-900">{c.value}</div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-900">Quick actions</div>
                        <MiniBadge tone="blue">Demo</MiniBadge>
                      </div>
                      <div className="space-y-2">
                        {quickActions.map((a) => {
                          const Icon = a.icon;
                          return (
                            <button
                              key={a.id}
                              onClick={() => handleQuickAction(a.id)}
                              className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              <span className="flex items-center gap-2">
                                <Icon className="h-3.5 w-3.5" />
                                {a.label}
                              </span>
                              <span className="text-slate-400">›</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-emerald-900">Milestone progress</div>
                        <MiniBadge tone="green">{rewardsProgress}%</MiniBadge>
                      </div>
                      <div className="mt-2">
                        <ProgressBar value={rewardsProgress} fillClassName="bg-emerald-600" />
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-800">
                        {rewardsProgress >= 100 ? "Reward unlocked 🎉" : "Keep your streak going to unlock your next reward."}
                      </div>
                    </div>
                  </>
                )}

                {tab === "schedule" && (
                  <>
                    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="text-xs font-semibold text-slate-900">Upcoming</div>
                      <div className="mt-2 space-y-2">
                        {[
                          { day: "Tue", time: p.nextSession, title: p.program, status: confirmed ? "Confirmed" : "Awaiting confirmation" },
                          { day: "Thu", time: "6:30 PM (optional)", title: "Backup / switch slot", status: "Available if needed" },
                          { day: "Sat", time: "10:00 AM", title: "Open gym (demo)", status: "Drop-in" },
                        ].map((s, idx) => (
                          <div key={`${s.day}-${idx}`} className="rounded-xl border border-slate-200 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <div className="text-xs font-semibold text-slate-900">{s.title}</div>
                                <div className="mt-1 text-[11px] text-slate-500">{s.day} • {s.time}</div>
                              </div>
                              <MiniBadge tone={idx === 0 ? (confirmed ? "green" : "amber") : "default"}>{s.status}</MiniBadge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3">
                      <div className="text-xs font-semibold text-blue-900">Need another time?</div>
                      <div className="mt-1 text-[11px] text-blue-800">
                        Tap “Messages” and request a schedule switch — the demo CRM side will look like it handled your request.
                      </div>
                    </div>
                  </>
                )}

                {tab === "messages" && (
                  <>
                    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                      <div className="max-h-[330px] space-y-2 overflow-auto p-1">
                        {messages.map((m, i) => (
                          <div key={`${m.time}-${i}`} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                            <div
                              className={cn(
                                "max-w-[78%] rounded-2xl px-3 py-2 text-xs shadow-sm",
                                m.from === "me"
                                  ? "bg-slate-900 text-white"
                                  : m.from === "coach"
                                  ? "border border-blue-200 bg-blue-50 text-blue-900"
                                  : "border border-slate-200 bg-white text-slate-700"
                              )}
                            >
                              <div>{m.text}</div>
                              <div className={cn("mt-1 text-[10px]", m.from === "me" ? "text-slate-300" : "text-slate-400")}>{m.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex gap-2 border-t border-slate-100 p-2">
                        <input
                          value={msgDraft}
                          onChange={(e) => setMsgDraft(e.target.value)}
                          placeholder="Message coach / support..."
                          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-slate-400 focus:outline-none"
                        />
                        <button
                          onClick={sendMessage}
                          className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {tab === "rewards" && (
                  <>
                    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-900">Rewards & incentives</div>
                        <Gift className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className="mt-3 rounded-xl border border-slate-200 p-3">
                        <div className="text-xs font-semibold text-slate-900">Attendance streak reward</div>
                        <div className="mt-1 text-[11px] text-slate-500">Unlock after consistent attendance milestone</div>
                        <div className="mt-2">
                          <ProgressBar
                            value={rewardsProgress}
                            fillClassName={rewardsProgress >= 100 ? "bg-emerald-600" : "bg-blue-600"}
                          />
                        </div>
                        <div className="mt-2 text-[11px] text-slate-700">
                          {rewardsProgress >= 100 ? "Unlocked: credit applied 🎉" : `${100 - rewardsProgress}% remaining`}
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl border border-slate-200 p-3">
                        <div className="text-xs font-semibold text-slate-900">Account credits</div>
                        <div className="mt-1 text-[11px] text-slate-500">Commitment rebates / sponsor credits</div>
                        <div className="mt-2 text-sm font-bold text-slate-900">
                          {p.balance < 0 ? `Credit $${Math.abs(p.balance)}` : `$${p.balance} due`}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {tab === "profile" && (
                  <>
                    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-900">Profile</div>
                        <UserRound className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                          <span className="text-slate-500">Participant ID</span>
                          <span className="font-semibold text-slate-900">{p.id}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                          <span className="text-slate-500">Program</span>
                          <span className="font-semibold text-slate-900">{p.program}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                          <span className="text-slate-500">Support type</span>
                          <span className="font-semibold text-slate-900">{p.subsidyType}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                          <span className="text-slate-500">Risk level</span>
                          <MiniBadge tone={riskTone}>{p.risk}</MiniBadge>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-violet-200 bg-violet-50 p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-violet-900">
                        <ShieldCheck className="h-4 w-4" />
                        Demo privacy note
                      </div>
                      <div className="mt-1 text-[11px] text-violet-800">
                        This preview uses fake demo participant data only. In production, privacy controls and consent settings would apply.
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* bottom nav */}
          <div className="border-t border-slate-200 bg-white px-2 py-2">
            <div className="grid grid-cols-5 gap-1">
              {tabs.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition",
                      active ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
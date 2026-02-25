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
    default: "bg-slate-800 text-slate-300 border border-slate-700",
    green: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
    blue: "bg-blue-500/10 text-blue-300 border border-blue-500/30",
    amber: "bg-amber-500/10 text-amber-300 border border-amber-500/30",
    red: "bg-rose-500/10 text-rose-300 border border-rose-500/30",
    purple: "bg-violet-500/10 text-violet-300 border border-violet-500/30",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", map[tone])}>
      {children}
    </span>
  );
}

function ProgressBar({ value, fillClassName = "bg-slate-200" }) {
  const v = Math.max(0, Math.min(100, value || 0));
  return (
    <div className="h-2 rounded-full bg-slate-800">
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
      { title: "Rewards", value: p.attendanceRate >= 70 ? "On track" : "Needs 1 more", icon: Trophy, tone: "amber" },
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
    if (actionId === "confirm" && !confirmed) {
      setConfirmed(true);
      setMessages((prev) => [
        ...prev,
        { from: "me", text: "Confirmed for the next session 👍", time: "Now" },
        { from: "system", text: "Great — your spot is saved.", time: "Now" },
      ]);
    }
    if (actionId === "checkin" && !checkedIn) {
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
      <div className="rounded-[2rem] border-[8px] border-black bg-black p-2 shadow-2xl">
        <div className="relative overflow-hidden rounded-[1.4rem] bg-slate-950">
          {/* notch */}
          <div className="absolute left-1/2 top-1 z-20 h-5 w-28 -translate-x-1/2 rounded-full bg-black" />

          {/* status bar */}
          <div className="flex items-center justify-between px-4 pt-3 text-[10px] font-semibold text-slate-400">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span>5G</span>
              <Bell className="h-3 w-3" />
            </div>
          </div>

          {/* app header */}
          <div className="px-4 pb-3 pt-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-slate-100">ActiveLink</div>
                  <div className="text-[11px] text-slate-500">{centreName}</div>
                </div>
                <MiniBadge tone={riskTone}>{p.risk} risk</MiniBadge>
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-100">{p.name}</div>
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
                          <div key={c.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-sm">
                            <div className="mb-1 flex items-center gap-1.5">
                              <Icon className="h-3.5 w-3.5 text-slate-300" />
                              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                {c.title}
                              </div>
                            </div>
                            <div className="text-xs font-semibold text-slate-100">{c.value}</div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-100">Quick actions</div>
                        <MiniBadge tone="blue">Demo</MiniBadge>
                      </div>
                      <div className="space-y-2">
                        {quickActions.map((a) => {
                          const Icon = a.icon;
                          return (
                            <button
                              key={a.id}
                              onClick={() => handleQuickAction(a.id)}
                              className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-left text-xs font-medium text-slate-300 hover:bg-slate-900"
                            >
                              <span className="flex items-center gap-2">
                                <Icon className="h-3.5 w-3.5" />
                                {a.label}
                              </span>
                              <span className="text-slate-500">›</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-emerald-300">Milestone progress</div>
                        <MiniBadge tone="green">{rewardsProgress}%</MiniBadge>
                      </div>
                      <div className="mt-2">
                        <ProgressBar value={rewardsProgress} fillClassName="bg-emerald-400" />
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-200">
                        {rewardsProgress >= 100
                          ? "Reward unlocked 🎉"
                          : "Keep your streak going to unlock your next reward."}
                      </div>
                    </div>
                  </>
                )}

                {tab === "schedule" && (
                  <>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-sm">
                      <div className="text-xs font-semibold text-slate-100">Upcoming</div>
                      <div className="mt-2 space-y-2">
                        {[
                          {
                            day: "Tue",
                            time: p.nextSession,
                            title: p.program,
                            status: confirmed ? "Confirmed" : "Awaiting confirmation",
                          },
                          { day: "Thu", time: "6:30 PM (optional)", title: "Backup / switch slot", status: "Available if needed" },
                          { day: "Sat", time: "10:00 AM", title: "Open gym (demo)", status: "Drop-in" },
                        ].map((s, idx) => (
                          <div key={`${s.day}-${idx}`} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <div className="text-xs font-semibold text-slate-100">{s.title}</div>
                                <div className="mt-1 text-[11px] text-slate-500">
                                  {s.day} • {s.time}
                                </div>
                              </div>
                              <MiniBadge tone={idx === 0 ? (confirmed ? "green" : "amber") : "default"}>
                                {s.status}
                              </MiniBadge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-3">
                      <div className="text-xs font-semibold text-blue-300">Need another time?</div>
                      <div className="mt-1 text-[11px] text-blue-200">
                        Tap “Messages” and request a schedule switch — the CRM demo shows how staff would handle it.
                      </div>
                    </div>
                  </>
                )}

                {tab === "messages" && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-sm">
                    <div className="max-h-[330px] space-y-2 overflow-auto p-1">
                      {messages.map((m, i) => (
                        <div key={`${m.time}-${i}`} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                          <div
                            className={cn(
                              "max-w-[78%] rounded-2xl px-3 py-2 text-xs shadow-sm",
                              m.from === "me"
                                ? "bg-slate-100 text-slate-900"
                                : m.from === "coach"
                                ? "border border-blue-500/20 bg-blue-500/10 text-blue-100"
                                : "border border-slate-800 bg-slate-950 text-slate-300"
                            )}
                          >
                            <div>{m.text}</div>
                            <div
                              className={cn(
                                "mt-1 text-[10px]",
                                m.from === "me" ? "text-slate-600" : "text-slate-500"
                              )}
                            >
                              {m.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 flex gap-2 border-t border-slate-800 p-2">
                      <input
                        value={msgDraft}
                        onChange={(e) => setMsgDraft(e.target.value)}
                        placeholder="Message coach / support..."
                        className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
                      />
                      <button
                        onClick={sendMessage}
                        className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}

                {tab === "rewards" && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-slate-100">Rewards & incentives</div>
                      <Gift className="h-4 w-4 text-slate-400" />
                    </div>

                    <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <div className="text-xs font-semibold text-slate-100">Attendance streak reward</div>
                      <div className="mt-1 text-[11px] text-slate-500">Unlock after consistent attendance milestone</div>
                      <div className="mt-2">
                        <ProgressBar
                          value={rewardsProgress}
                          fillClassName={rewardsProgress >= 100 ? "bg-emerald-400" : "bg-blue-400"}
                        />
                      </div>
                      <div className="mt-2 text-[11px] text-slate-300">
                        {rewardsProgress >= 100 ? "Unlocked: credit applied 🎉" : `${100 - rewardsProgress}% remaining`}
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <div className="text-xs font-semibold text-slate-100">Account credits</div>
                      <div className="mt-1 text-[11px] text-slate-500">Commitment rebates / sponsor credits</div>
                      <div className="mt-2 text-sm font-bold text-slate-100">
                        {p.balance < 0 ? `Credit $${Math.abs(p.balance)}` : `$${p.balance} due`}
                      </div>
                    </div>
                  </div>
                )}

                {tab === "profile" && (
                  <>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-100">Profile</div>
                        <UserRound className="h-4 w-4 text-slate-400" />
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                          <span className="text-slate-500">Participant ID</span>
                          <span className="font-semibold text-slate-100">{p.id}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                          <span className="text-slate-500">Program</span>
                          <span className="font-semibold text-slate-100">{p.program}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                          <span className="text-slate-500">Support type</span>
                          <span className="font-semibold text-slate-100">{p.subsidyType}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                          <span className="text-slate-500">Risk level</span>
                          <MiniBadge tone={riskTone}>{p.risk}</MiniBadge>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-violet-300">
                        <ShieldCheck className="h-4 w-4" />
                        Demo privacy note
                      </div>
                      <div className="mt-1 text-[11px] text-violet-200">
                        This preview uses fake demo participant data only. In production, privacy controls and consent settings would apply.
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* bottom nav */}
          <div className="border-t border-slate-800 bg-slate-900 px-2 py-2">
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
                      active ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:bg-slate-800"
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
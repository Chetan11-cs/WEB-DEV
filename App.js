import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, CheckCircle2, LogOut, Plus, X, Users,
    Trash2, ShieldCheck, Activity, BarChart3, Settings,
    UserCircle, Clock, AlertCircle, Camera, Tag, Flag,
    Paperclip, MessageSquare, Target, DollarSign, ChevronDown,
    Circle, PlayCircle, PauseCircle, CheckSquare, Send,
    Milestone, User, Calendar, FileText, Download, Edit3, Save,
    Zap, Star, TrendingUp, Lock, Mail, Eye, EyeOff, ArrowRight,
    Layers, Globe, Shield, Phone, MapPin, Link2, Key, Check,
    AlertTriangle, Briefcase, RefreshCw, BadgeCheck, Sun, Moon,
    Bell, Palette, Layout, Monitor, Sliders, ChevronRight,
    ToggleLeft, ToggleRight, Info, Coffee, Cpu, Wifi
} from 'lucide-react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PRIORITIES = ['Low','Medium','High','Urgent'];
const STATUSES   = ['Not Started','In Progress','Completed','On Hold'];
const TAGS_PRESET = ['Web Dev','AI','Mobile','Design','College Project','Research','Marketing','Finance'];

const PRIORITY_COLORS = {
    Low:    { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/30' },
    Medium: { bg: 'bg-amber-500/15',   text: 'text-amber-400',   dot: 'bg-amber-400',   border: 'border-amber-500/30' },
    High:   { bg: 'bg-orange-500/15',  text: 'text-orange-400',  dot: 'bg-orange-400',  border: 'border-orange-500/30' },
    Urgent: { bg: 'bg-rose-500/15',    text: 'text-rose-400',    dot: 'bg-rose-400',    border: 'border-rose-500/30' },
};

const STATUS_ICONS = {
    'Not Started': <Circle size={13} />,
    'In Progress': <PlayCircle size={13} />,
    'Completed':   <CheckCircle2 size={13} />,
    'On Hold':     <PauseCircle size={13} />,
};

const STATUS_COLORS = {
    'Not Started': 'text-slate-400',
    'In Progress': 'text-blue-400',
    'Completed':   'text-emerald-400',
    'On Hold':     'text-amber-400',
};

const DETAIL_TABS = ['Overview','Tasks','Milestones','Team','Files','Activity'];

// ─── THEME CONTEXT ────────────────────────────────────────────────────────────
const ThemeContext = React.createContext();

// ─── GEOMETRIC BG PATTERN SVG ─────────────────────────────────────────────────
const GeoBg = ({ theme }) => (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none"
                    stroke={theme === 'light' ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.07)"}
                    strokeWidth="1"/>
            </pattern>
            <radialGradient id="glow1" cx="20%" cy="30%" r="50%">
                <stop offset="0%" stopColor={theme === 'light' ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.15)"} />
                <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="glow2" cx="80%" cy="70%" r="50%">
                <stop offset="0%" stopColor={theme === 'light' ? "rgba(139,92,246,0.06)" : "rgba(139,92,246,0.12)"} />
                <stop offset="100%" stopColor="transparent" />
            </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#glow1)" />
        <rect width="100%" height="100%" fill="url(#glow2)" />
        <circle cx="10%" cy="15%" r="120" fill={theme === 'light' ? "rgba(99,102,241,0.03)" : "rgba(99,102,241,0.04)"} />
        <circle cx="90%" cy="85%" r="180" fill={theme === 'light' ? "rgba(139,92,246,0.03)" : "rgba(139,92,246,0.05)"} />
        <circle cx="50%" cy="50%" r="300" fill={theme === 'light' ? "rgba(59,130,246,0.02)" : "rgba(59,130,246,0.03)"} />
    </svg>
);

const FloatingOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse" style={{animationDuration:'6s'}}/>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" style={{animationDuration:'8s', animationDelay:'2s'}}/>
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-blue-500/8 blur-[80px] animate-pulse" style={{animationDuration:'10s', animationDelay:'4s'}}/>
    </div>
);

// ─── THEME STYLES HELPER ──────────────────────────────────────────────────────
const getTheme = (theme) => ({
    bg: theme === 'light' ? '#f0f0f8' : '#07070f',
    sidebar: theme === 'light' ? 'linear-gradient(180deg, #f5f5ff 0%, #ededf7 100%)' : 'linear-gradient(180deg, #0d0d20 0%, #0a0a1a 100%)',
    sidebarBorder: theme === 'light' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
    card: theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.02)',
    cardBorder: theme === 'light' ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.06)',
    input: theme === 'light' ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
    inputBorder: theme === 'light' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.08)',
    text: theme === 'light' ? '#1e1b4b' : '#e2e8f0',
    subtext: theme === 'light' ? '#6366f1' : '#64748b',
    header: theme === 'light' ? 'rgba(240,240,248,0.85)' : 'rgba(7,7,15,0.8)',
    headerBorder: theme === 'light' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.05)',
    panelBg: theme === 'light' ? 'linear-gradient(180deg, #f5f5ff 0%, #ededf7 100%)' : 'linear-gradient(180deg, #0d0d20 0%, #0a0a1a 100%)',
    panelBorder: theme === 'light' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.07)',
    modalBg: theme === 'light' ? 'linear-gradient(180deg, #f5f5ff 0%, #ededf7 100%)' : 'linear-gradient(180deg, #0d0d20 0%, #0a0a1a 100%)',
    mutedText: theme === 'light' ? '#64748b' : '#64748b',
    hoverBg: theme === 'light' ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
});

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
const Analytics = ({ projects, calculateProgress, theme }) => {
    const T = getTheme(theme);
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'Completed').length;
    const inProgress = projects.filter(p => p.status === 'In Progress').length;
    const onHold = projects.filter(p => p.status === 'On Hold').length;
    const notStarted = projects.filter(p => p.status === 'Not Started').length;
    const avgProgress = total > 0 ? Math.round(projects.reduce((a, c) => a + calculateProgress(c.tasks), 0) / total) : 0;
    const totalTasks = projects.reduce((a, c) => a + (c.tasks?.length || 0), 0);
    const completedTasks = projects.reduce((a, c) => a + (c.tasks?.filter(t => t.completed).length || 0), 0);
    const totalBudget = projects.reduce((a, c) => a + (c.budget || 0), 0);

    const priorityData = PRIORITIES.map(p => ({
        label: p,
        count: projects.filter(pr => pr.priority === p).length,
        color: PRIORITY_COLORS[p]
    }));

    const statusData = [
        { label: 'Completed', count: completed, color: '#10b981' },
        { label: 'In Progress', count: inProgress, color: '#3b82f6' },
        { label: 'On Hold', count: onHold, color: '#f59e0b' },
        { label: 'Not Started', count: notStarted, color: '#64748b' },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Activity size={18}/>} label="Avg Progress" value={`${avgProgress}%`} accent="#6366f1" sub="across all projects" theme={theme} />
                <StatCard icon={<CheckCircle2 size={18}/>} label="Completed" value={completed} accent="#10b981" sub={`of ${total} projects`} theme={theme} />
                <StatCard icon={<CheckSquare size={18}/>} label="Tasks Done" value={completedTasks} accent="#3b82f6" sub={`of ${totalTasks} total`} theme={theme} />
                <StatCard icon={<DollarSign size={18}/>} label="Total Budget" value={totalBudget > 0 ? `₹${(totalBudget/1000).toFixed(0)}k` : '—'} accent="#a78bfa" sub="allocated" theme={theme} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Status Breakdown */}
                <div className="rounded-2xl p-6" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-5" style={{ color: T.subtext }}>Status Breakdown</p>
                    <div className="space-y-3">
                        {statusData.map(s => (
                            <div key={s.label}>
                                <div className="flex justify-between text-xs font-bold mb-1.5">
                                    <span style={{ color: T.text }}>{s.label}</span>
                                    <span style={{ color: s.color }}>{s.count} project{s.count !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: theme === 'light' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.06)' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: total > 0 ? `${(s.count / total) * 100}%` : '0%' }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                        className="h-full rounded-full" style={{ background: s.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Priority Distribution */}
                <div className="rounded-2xl p-6" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-5" style={{ color: T.subtext }}>Priority Distribution</p>
                    <div className="space-y-3">
                        {priorityData.map(p => (
                            <div key={p.label}>
                                <div className="flex justify-between text-xs font-bold mb-1.5">
                                    <span className={p.color.text}>{p.label}</span>
                                    <span style={{ color: T.mutedText }}>{p.count} project{p.count !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: theme === 'light' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.06)' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: total > 0 ? `${(p.count / total) * 100}%` : '0%' }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className={`h-full rounded-full ${p.color.dot}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Project Health */}
                <div className="rounded-2xl p-6" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-5" style={{ color: T.subtext }}>Project Health Overview</p>
                    {projects.length === 0 ? (
                        <p className="text-sm text-center py-6" style={{ color: T.mutedText }}>No projects to analyze</p>
                    ) : (
                        <div className="space-y-3">
                            {projects.slice(0, 6).map(p => {
                                const prog = calculateProgress(p.tasks);
                                return (
                                    <div key={p._id}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-bold truncate mr-2" style={{ color: T.text, maxWidth: '60%' }}>{p.name}</span>
                                            <span style={{ color: prog >= 70 ? '#10b981' : prog >= 30 ? '#f59e0b' : '#ef4444' }}>{prog}%</span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: theme === 'light' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.06)' }}>
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${prog}%` }}
                                                transition={{ duration: 0.8 }}
                                                className="h-full rounded-full"
                                                style={{ background: prog >= 70 ? 'linear-gradient(90deg,#10b981,#059669)' : prog >= 30 ? 'linear-gradient(90deg,#f59e0b,#d97706)' : 'linear-gradient(90deg,#ef4444,#dc2626)' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Tag Frequency */}
                <div className="rounded-2xl p-6" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-5" style={{ color: T.subtext }}>Tag Frequency</p>
                    <div className="flex flex-wrap gap-2">
                        {TAGS_PRESET.map(tag => {
                            const count = projects.filter(p => p.tags?.includes(tag)).length;
                            if (count === 0) return null;
                            return (
                                <div key={tag} className="px-3 py-1.5 rounded-full flex items-center gap-2"
                                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                                    <span className="text-xs font-bold text-indigo-300">{tag}</span>
                                    <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/20 rounded-full w-4 h-4 flex items-center justify-center">{count}</span>
                                </div>
                            );
                        })}
                        {projects.every(p => !p.tags?.length) && (
                            <p className="text-sm" style={{ color: T.mutedText }}>No tags used yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── TEAM PAGE ────────────────────────────────────────────────────────────────
const Team = ({ projects, theme }) => {
    const T = getTheme(theme);

    // Collect all unique team members across all projects
    const memberMap = {};
    projects.forEach(project => {
        // Add owner
        if (project.owner) {
            if (!memberMap[project.owner]) {
                memberMap[project.owner] = { name: project.owner, projects: [], role: 'Project Owner', isOwner: true };
            }
            if (!memberMap[project.owner].projects.find(p => p._id === project._id)) {
                memberMap[project.owner].projects.push(project);
            }
        }
        // Add team members
        (project.teamMembers || []).forEach(member => {
            if (!member.trim()) return;
            const key = member.trim();
            if (!memberMap[key]) {
                memberMap[key] = { name: key, projects: [], role: 'Team Member', isOwner: false };
            }
            if (!memberMap[key].projects.find(p => p._id === project._id)) {
                memberMap[key].projects.push(project);
            }
        });
    });

    const members = Object.values(memberMap);
    const totalMembers = members.length;

    const avatarColors = [
        'linear-gradient(135deg,#6366f1,#7c3aed)',
        'linear-gradient(135deg,#3b82f6,#1d4ed8)',
        'linear-gradient(135deg,#10b981,#059669)',
        'linear-gradient(135deg,#f59e0b,#d97706)',
        'linear-gradient(135deg,#ef4444,#dc2626)',
        'linear-gradient(135deg,#8b5cf6,#6d28d9)',
        'linear-gradient(135deg,#06b6d4,#0891b2)',
        'linear-gradient(135deg,#f97316,#ea580c)',
    ];

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard icon={<Users size={18}/>} label="Total Members" value={totalMembers} accent="#6366f1" sub="across all projects" theme={theme} />
                <StatCard icon={<Briefcase size={18}/>} label="Active Projects" value={projects.filter(p => p.status === 'In Progress').length} accent="#3b82f6" sub="in progress" theme={theme} />
                <StatCard icon={<Star size={18}/>} label="Project Owners" value={[...new Set(projects.map(p => p.owner).filter(Boolean))].length} accent="#f59e0b" sub="leading teams" theme={theme} />
            </div>

            {members.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <Users size={28} className="text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-black mb-2" style={{ color: T.text }}>No team members yet</h3>
                    <p className="text-sm" style={{ color: T.mutedText }}>Add team members when creating or editing projects</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {members.map((member, idx) => (
                        <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-5 rounded-2xl"
                            style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white flex-shrink-0"
                                    style={{ background: avatarColors[idx % avatarColors.length] }}>
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-sm truncate" style={{ color: T.text }}>{member.name}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        {member.isOwner && (
                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                                                style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
                                                Owner
                                            </span>
                                        )}
                                        <span className="text-[10px]" style={{ color: T.mutedText }}>{member.projects.length} project{member.projects.length !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                {member.projects.slice(0, 3).map(p => {
                                    const pcolor = PRIORITY_COLORS[p.priority] || PRIORITY_COLORS['Medium'];
                                    return (
                                        <div key={p._id} className="flex items-center justify-between px-3 py-2 rounded-xl"
                                            style={{ background: theme === 'light' ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${T.cardBorder}` }}>
                                            <span className="text-xs font-semibold truncate mr-2" style={{ color: T.text, maxWidth: '65%' }}>{p.name}</span>
                                            <span className={`text-[9px] font-black uppercase flex items-center gap-1 ${STATUS_COLORS[p.status]}`}>
                                                {STATUS_ICONS[p.status]} {p.status}
                                            </span>
                                        </div>
                                    );
                                })}
                                {member.projects.length > 3 && (
                                    <p className="text-[10px] text-center pt-1" style={{ color: T.mutedText }}>+{member.projects.length - 3} more</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── SCHEDULE PAGE ────────────────────────────────────────────────────────────
const Schedule = ({ projects, theme }) => {
    const T = getTheme(theme);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const projectsWithDeadlines = projects
        .filter(p => p.deadline)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    const overdue = projectsWithDeadlines.filter(p => new Date(p.deadline) < today && p.status !== 'Completed');
    const upcoming = projectsWithDeadlines.filter(p => {
        const d = new Date(p.deadline);
        const diff = (d - today) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 30 && p.status !== 'Completed';
    });
    const future = projectsWithDeadlines.filter(p => {
        const d = new Date(p.deadline);
        const diff = (d - today) / (1000 * 60 * 60 * 24);
        return diff > 30 && p.status !== 'Completed';
    });

    const getDaysLabel = (deadline) => {
        const d = new Date(deadline);
        const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
        if (diff < 0) return { text: `${Math.abs(diff)}d overdue`, color: '#ef4444' };
        if (diff === 0) return { text: 'Due today', color: '#f59e0b' };
        if (diff === 1) return { text: 'Due tomorrow', color: '#f59e0b' };
        return { text: `${diff}d left`, color: diff <= 7 ? '#f59e0b' : '#10b981' };
    };

    const ScheduleProjectRow = ({ project, idx }) => {
        const days = getDaysLabel(project.deadline);
        const prio = PRIORITY_COLORS[project.priority] || PRIORITY_COLORS['Medium'];
        return (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ background: days.color }} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-sm truncate" style={{ color: T.text }}>{project.name}</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${prio.bg} ${prio.text} border ${prio.border}`}>{project.priority}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                        <span style={{ color: T.mutedText }}><Calendar size={9} className="inline mr-1" />{project.deadline}</span>
                        {project.owner && <span style={{ color: T.mutedText }}>Owner: {project.owner}</span>}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-black" style={{ color: days.color }}>{days.text}</span>
                    <span className={`text-[9px] font-bold uppercase flex items-center gap-1 ${STATUS_COLORS[project.status]}`}>
                        {STATUS_ICONS[project.status]}{project.status}
                    </span>
                </div>
            </motion.div>
        );
    };

    const Section = ({ title, items, accentColor, emptyMsg }) => (
        <div>
            <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
                <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: T.subtext }}>{title}</h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}>{items.length}</span>
            </div>
            {items.length === 0 ? (
                <p className="text-sm py-4 pl-5" style={{ color: T.mutedText }}>{emptyMsg}</p>
            ) : (
                <div className="space-y-2">
                    {items.map((p, i) => <ScheduleProjectRow key={p._id} project={p} idx={i} />)}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<AlertCircle size={18}/>} label="Overdue" value={overdue.length} accent="#ef4444" sub="need attention" theme={theme} />
                <StatCard icon={<Clock size={18}/>} label="Due Soon" value={upcoming.length} accent="#f59e0b" sub="within 30 days" theme={theme} />
                <StatCard icon={<Calendar size={18}/>} label="Scheduled" value={future.length} accent="#3b82f6" sub="upcoming" theme={theme} />
                <StatCard icon={<CheckCircle2 size={18}/>} label="No Deadline" value={projects.filter(p => !p.deadline).length} accent="#64748b" sub="open-ended" theme={theme} />
            </div>

            <div className="space-y-7">
                <Section title="Overdue" items={overdue} accentColor="#ef4444" emptyMsg="No overdue projects 🎉" />
                <Section title="Due within 30 days" items={upcoming} accentColor="#f59e0b" emptyMsg="Nothing due soon" />
                <Section title="Upcoming (30+ days)" items={future} accentColor="#3b82f6" emptyMsg="No future deadlines set" />
            </div>

            {projects.filter(p => !p.deadline).length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full bg-slate-500" />
                        <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: T.subtext }}>No Deadline</h3>
                    </div>
                    <div className="space-y-2">
                        {projects.filter(p => !p.deadline).map((p, i) => {
                            const prio = PRIORITY_COLORS[p.priority] || PRIORITY_COLORS['Medium'];
                            return (
                                <motion.div key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl"
                                    style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                                    <div className="w-1 h-10 rounded-full bg-slate-600 flex-shrink-0" />
                                    <div className="flex-1">
                                        <span className="font-black text-sm" style={{ color: T.text }}>{p.name}</span>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${prio.bg} ${prio.text} border ${prio.border}`}>{p.priority}</span>
                                    <span className={`text-[9px] font-bold uppercase flex items-center gap-1 ${STATUS_COLORS[p.status]}`}>
                                        {STATUS_ICONS[p.status]}{p.status}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── ACTIVE PROJECTS PAGE ─────────────────────────────────────────────────────
const ActiveProjects = ({ projects, calculateProgress, setSelectedProject, theme }) => {
    const T = getTheme(theme);
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard icon={<PlayCircle size={18}/>} label="Active Projects" value={projects.length} accent="#3b82f6" sub="currently in progress" theme={theme} />
                <StatCard icon={<CheckSquare size={18}/>} label="Tasks In Flight" value={projects.reduce((a, c) => a + (c.tasks?.filter(t => !t.completed).length || 0), 0)} accent="#6366f1" sub="pending completion" theme={theme} />
                <StatCard icon={<Activity size={18}/>} label="Avg Completion" value={`${projects.length > 0 ? Math.round(projects.reduce((a, c) => a + calculateProgress(c.tasks), 0) / projects.length) : 0}%`} accent="#10b981" sub="across active" theme={theme} />
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <PlayCircle size={28} className="text-blue-400" />
                    </div>
                    <h3 className="text-lg font-black mb-2" style={{ color: T.text }}>No active projects</h3>
                    <p className="text-sm" style={{ color: T.mutedText }}>Set a project's status to "In Progress" to see it here</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {projects.map((p, idx) => (
                        <ProjectCard key={p._id} project={p} index={idx} calculateProgress={calculateProgress}
                            onClick={() => setSelectedProject(p)} theme={theme} />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── PENDING PROJECTS PAGE ────────────────────────────────────────────────────
const PendingProjects = ({ projects, calculateProgress, setSelectedProject, theme }) => {
    const T = getTheme(theme);
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard icon={<AlertCircle size={18}/>} label="Pending Projects" value={projects.length} accent="#f59e0b" sub="not yet started" theme={theme} />
                <StatCard icon={<Flag size={18}/>} label="High Priority" value={projects.filter(p => p.priority === 'High' || p.priority === 'Urgent').length} accent="#ef4444" sub="urgent + high" theme={theme} />
                <StatCard icon={<DollarSign size={18}/>} label="Budget Allocated" value={projects.filter(p => p.budget).length} accent="#a78bfa" sub="projects with budget" theme={theme} />
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <AlertCircle size={28} className="text-amber-400" />
                    </div>
                    <h3 className="text-lg font-black mb-2" style={{ color: T.text }}>No pending projects</h3>
                    <p className="text-sm" style={{ color: T.mutedText }}>All projects are either active or completed</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {projects.map((p, idx) => (
                        <ProjectCard key={p._id} project={p} index={idx} calculateProgress={calculateProgress}
                            onClick={() => setSelectedProject(p)} theme={theme} />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
const SettingsPage = ({ theme, setTheme, settings, setSettings }) => {
    const T = getTheme(theme);

    const SettingSection = ({ title, icon, children }) => (
        <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
            <div className="px-6 py-4 border-b flex items-center gap-2"
                style={{ borderColor: T.cardBorder, background: theme === 'light' ? 'rgba(99,102,241,0.04)' : 'rgba(99,102,241,0.05)' }}>
                <span className="text-indigo-400">{icon}</span>
                <p className="text-sm font-black" style={{ color: T.text }}>{title}</p>
            </div>
            <div className="p-5 space-y-4">{children}</div>
        </div>
    );

    const ToggleRow = ({ label, desc, value, onChange }) => (
        <div className="flex items-center justify-between py-1">
            <div>
                <p className="text-sm font-bold" style={{ color: T.text }}>{label}</p>
                {desc && <p className="text-xs mt-0.5" style={{ color: T.mutedText }}>{desc}</p>}
            </div>
            <button onClick={() => onChange(!value)}
                className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
                style={{ background: value ? 'linear-gradient(135deg,#6366f1,#7c3aed)' : (theme === 'light' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.1)') }}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
        </div>
    );

    const SelectRow = ({ label, desc, value, options, onChange }) => (
        <div className="flex items-center justify-between py-1">
            <div>
                <p className="text-sm font-bold" style={{ color: T.text }}>{label}</p>
                {desc && <p className="text-xs mt-0.5" style={{ color: T.mutedText }}>{desc}</p>}
            </div>
            <select value={value} onChange={e => onChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold outline-none transition"
                style={{ background: T.input, border: `1px solid ${T.inputBorder}`, color: T.text, colorScheme: theme === 'light' ? 'light' : 'dark' }}>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto space-y-5">
            {/* Appearance */}
            <SettingSection title="Appearance" icon={<Palette size={16}/>}>
                {/* Theme Switcher */}
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: T.subtext }}>Color Theme</p>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'dark', label: 'Dark', icon: <Moon size={16}/>, preview: '#07070f' },
                            { id: 'light', label: 'Light', icon: <Sun size={16}/>, preview: '#f0f0f8' },
                            { id: 'midnight', label: 'Midnight', icon: <Star size={16}/>, preview: '#020209' },
                        ].map(t => (
                            <button key={t.id} onClick={() => setTheme(t.id === 'midnight' ? 'dark' : t.id)}
                                className="p-3 rounded-xl flex flex-col items-center gap-2 transition border"
                                style={{
                                    background: theme === t.id || (t.id === 'midnight' && theme === 'dark') ? 'rgba(99,102,241,0.2)' : T.hoverBg,
                                    borderColor: theme === t.id || (t.id === 'midnight' && theme === 'dark') ? 'rgba(99,102,241,0.5)' : T.cardBorder
                                }}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: t.preview }}>
                                    <span className="text-indigo-400">{t.icon}</span>
                                </div>
                                <span className="text-xs font-bold" style={{ color: T.text }}>{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <SelectRow label="Accent Color" desc="Primary interface color"
                    value={settings.accentColor} onChange={v => setSettings(s => ({...s, accentColor: v}))}
                    options={[
                        {value:'indigo',label:'Indigo (Default)'},
                        {value:'violet',label:'Violet'},
                        {value:'blue',label:'Blue'},
                        {value:'emerald',label:'Emerald'},
                        {value:'rose',label:'Rose'},
                    ]} />

                <SelectRow label="Font Size" desc="Interface text size"
                    value={settings.fontSize} onChange={v => setSettings(s => ({...s, fontSize: v}))}
                    options={[
                        {value:'sm',label:'Small'},
                        {value:'md',label:'Medium (Default)'},
                        {value:'lg',label:'Large'},
                    ]} />

                <ToggleRow label="Compact Mode" desc="Reduce spacing for more content"
                    value={settings.compactMode} onChange={v => setSettings(s => ({...s, compactMode: v}))} />

                <ToggleRow label="Animations" desc="Enable motion and transitions"
                    value={settings.animations} onChange={v => setSettings(s => ({...s, animations: v}))} />
            </SettingSection>

            {/* Notifications */}
            <SettingSection title="Notifications" icon={<Bell size={16}/>}>
                <ToggleRow label="Deadline Reminders" desc="Get notified before project deadlines"
                    value={settings.deadlineReminders} onChange={v => setSettings(s => ({...s, deadlineReminders: v}))} />
                <ToggleRow label="Task Updates" desc="Notifications when tasks are completed"
                    value={settings.taskUpdates} onChange={v => setSettings(s => ({...s, taskUpdates: v}))} />
                <ToggleRow label="Team Activity" desc="Updates from your team members"
                    value={settings.teamActivity} onChange={v => setSettings(s => ({...s, teamActivity: v}))} />
                <SelectRow label="Reminder Lead Time" desc="How early to notify before deadlines"
                    value={settings.reminderLeadTime} onChange={v => setSettings(s => ({...s, reminderLeadTime: v}))}
                    options={[
                        {value:'1d',label:'1 day before'},
                        {value:'3d',label:'3 days before'},
                        {value:'7d',label:'1 week before'},
                        {value:'14d',label:'2 weeks before'},
                    ]} />
            </SettingSection>

            {/* Dashboard */}
            <SettingSection title="Dashboard" icon={<Layout size={16}/>}>
                <SelectRow label="Default View" desc="Landing tab when you sign in"
                    value={settings.defaultView} onChange={v => setSettings(s => ({...s, defaultView: v}))}
                    options={[
                        {value:'Dashboard',label:'Dashboard'},
                        {value:'Active',label:'Active Projects'},
                        {value:'Analytics',label:'Analytics'},
                        {value:'Schedule',label:'Schedule'},
                    ]} />
                <ToggleRow label="Show Progress Bars" desc="Display progress on project cards"
                    value={settings.showProgress} onChange={v => setSettings(s => ({...s, showProgress: v}))} />
                <ToggleRow label="Show Deadlines on Cards" desc="Display deadline info on cards"
                    value={settings.showDeadlines} onChange={v => setSettings(s => ({...s, showDeadlines: v}))} />
                <ToggleRow label="Auto-refresh Data" desc="Periodically sync project data"
                    value={settings.autoRefresh} onChange={v => setSettings(s => ({...s, autoRefresh: v}))} />
            </SettingSection>

            {/* Privacy & Data */}
            <SettingSection title="Privacy & Data" icon={<Shield size={16}/>}>
                <ToggleRow label="Analytics Tracking" desc="Help improve the product with usage data"
                    value={settings.analyticsTracking} onChange={v => setSettings(s => ({...s, analyticsTracking: v}))} />
                <ToggleRow label="Session Persistence" desc="Stay signed in between browser sessions"
                    value={settings.sessionPersist} onChange={v => setSettings(s => ({...s, sessionPersist: v}))} />
                <div className="pt-2">
                    <button className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-2"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                        onClick={() => { if (window.confirm('Clear all local data? This cannot be undone.')) { localStorage.clear(); window.location.reload(); } }}>
                        <Trash2 size={13}/> Clear All Local Data
                    </button>
                </div>
            </SettingSection>

            {/* About */}
            <SettingSection title="About TH.PRO" icon={<Info size={16}/>}>
                <div className="flex items-center justify-between py-1">
                    <span className="text-sm" style={{ color: T.mutedText }}>Version</span>
                    <span className="text-xs font-black" style={{ color: T.text }}>v6.0.0 Final</span>
                </div>
                <div className="flex items-center justify-between py-1">
                    <span className="text-sm" style={{ color: T.mutedText }}>Build</span>
                    <span className="text-xs font-black" style={{ color: T.text }}>2025.stable</span>
                </div>
                <div className="flex items-center justify-between py-1">
                    <span className="text-sm" style={{ color: T.mutedText }}>Stack</span>
                    <span className="text-xs font-black" style={{ color: T.text }}>React · Node · MongoDB</span>
                </div>
            </SettingSection>
        </div>
    );
};

// ─── ACCOUNT PAGE ─────────────────────────────────────────────────────────────
const AccountPage = ({ user, setUser, theme }) => {
    const T = getTheme(theme);
    const [activeSection, setActiveSection] = useState('profile');
    const [profileForm, setProfileForm] = useState({
        fullName: user.fullName || '',
        company: user.company || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        website: user.website || '',
        profileImage: user.profileImage || ''
    });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [pwdMsg, setPwdMsg] = useState('');
    const [showCurrentPwd, setShowCurrentPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setProfileForm(f => ({ ...f, profileImage: reader.result }));
        reader.readAsDataURL(file);
    };

    const saveProfile = async () => {
        setSaving(true); setSaveMsg('');
        try {
            const res = await axios.put(`http://localhost:5000/api/account/${user.userId}`, profileForm);
            const updated = { ...user, ...res.data };
            localStorage.setItem('user_session', JSON.stringify(updated));
            setUser(updated);
            setSaveMsg('success');
        } catch { setSaveMsg('error'); }
        finally { setSaving(false); setTimeout(() => setSaveMsg(''), 3000); }
    };

    const changePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPwdMsg('mismatch'); return; }
        if (passwordForm.newPassword.length < 6) { setPwdMsg('short'); return; }
        setSaving(true); setPwdMsg('');
        try {
            await axios.put(`http://localhost:5000/api/account/${user.userId}/password`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setPwdMsg('success');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch { setPwdMsg('error'); }
        finally { setSaving(false); setTimeout(() => setPwdMsg(''), 3500); }
    };

    const SECTIONS = [
        { id: 'profile', label: 'Profile', icon: <User size={15}/> },
        { id: 'security', label: 'Security', icon: <Key size={15}/> },
    ];

    const inputStyle = { background: T.input, border: `1px solid ${T.inputBorder}` };
    const inputClass = "w-full px-4 py-3 rounded-xl text-sm placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30 transition font-medium";

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center gap-5">
                <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0" style={{ border: '2px solid rgba(99,102,241,0.4)' }}>
                        {profileForm.profileImage
                            ? <img src={profileForm.profileImage} className="w-full h-full object-cover" alt="profile" />
                            : <div className="w-full h-full flex items-center justify-center text-3xl font-black text-indigo-300"
                                style={{ background: 'rgba(99,102,241,0.2)' }}>
                                {user.fullName?.charAt(0)}
                              </div>
                        }
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center rounded-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition"
                        style={{ background: 'rgba(0,0,0,0.6)' }}>
                        <Camera size={18} className="text-white" />
                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </label>
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tight" style={{ color: T.text }}>{user.fullName}</h2>
                    <p className="text-sm mt-0.5" style={{ color: T.mutedText }}>{user.company}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        <span className="text-emerald-400 text-xs font-bold">Active Account</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: T.hoverBg, border: `1px solid ${T.cardBorder}` }}>
                {SECTIONS.map(s => (
                    <button key={s.id} onClick={() => setActiveSection(s.id)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition flex-1 justify-center"
                        style={activeSection === s.id ? {
                            color: '#fff',
                            background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(124,58,237,0.2))',
                            border: '1px solid rgba(99,102,241,0.4)'
                        } : { color: T.mutedText }}>
                        {s.icon} {s.label}
                    </button>
                ))}
            </div>

            {activeSection === 'profile' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                    <div className="px-6 py-4 border-b" style={{ borderColor: T.cardBorder, background: theme === 'light' ? 'rgba(99,102,241,0.04)' : 'rgba(99,102,241,0.05)' }}>
                        <p className="text-sm font-black" style={{ color: T.text }}>Profile Information</p>
                        <p className="text-xs mt-0.5" style={{ color: T.mutedText }}>Update your personal details and public profile</p>
                    </div>
                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <AccountField label="Full Name" icon={<User size={13}/>} theme={theme}>
                                <input value={profileForm.fullName} onChange={e => setProfileForm(f => ({...f, fullName: e.target.value}))}
                                    className={inputClass} style={{...inputStyle, color: T.text}} placeholder="Your full name" />
                            </AccountField>
                            <AccountField label="Company" icon={<Briefcase size={13}/>} theme={theme}>
                                <input value={profileForm.company} onChange={e => setProfileForm(f => ({...f, company: e.target.value}))}
                                    className={inputClass} style={{...inputStyle, color: T.text}} placeholder="Company name" />
                            </AccountField>
                        </div>
                        <AccountField label="Bio" icon={<FileText size={13}/>} theme={theme}>
                            <textarea value={profileForm.bio} onChange={e => setProfileForm(f => ({...f, bio: e.target.value}))}
                                className={`${inputClass} resize-none`} style={{...inputStyle, color: T.text}}
                                placeholder="A short bio about yourself..." rows={3} />
                        </AccountField>
                        <div className="grid grid-cols-2 gap-4">
                            <AccountField label="Phone" icon={<Phone size={13}/>} theme={theme}>
                                <input value={profileForm.phone} onChange={e => setProfileForm(f => ({...f, phone: e.target.value}))}
                                    className={inputClass} style={{...inputStyle, color: T.text}} placeholder="+91 98765 43210" />
                            </AccountField>
                            <AccountField label="Location" icon={<MapPin size={13}/>} theme={theme}>
                                <input value={profileForm.location} onChange={e => setProfileForm(f => ({...f, location: e.target.value}))}
                                    className={inputClass} style={{...inputStyle, color: T.text}} placeholder="City, Country" />
                            </AccountField>
                        </div>
                        <AccountField label="Website" icon={<Link2 size={13}/>} theme={theme}>
                            <input value={profileForm.website} onChange={e => setProfileForm(f => ({...f, website: e.target.value}))}
                                className={inputClass} style={{...inputStyle, color: T.text}} placeholder="https://yourwebsite.com" />
                        </AccountField>
                        <div className="flex items-center justify-between pt-2">
                            <AnimatePresence>
                                {saveMsg === 'success' && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-400 text-sm font-bold"><BadgeCheck size={16}/> Saved</motion.div>}
                                {saveMsg === 'error' && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-rose-400 text-sm font-bold"><AlertTriangle size={16}/> Failed</motion.div>}
                            </AnimatePresence>
                            {!saveMsg && <div />}
                            <button onClick={saveProfile} disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-white transition hover:scale-105 active:scale-95 disabled:opacity-60"
                                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
                                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeSection === 'security' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                    <div className="px-6 py-4 border-b" style={{ borderColor: T.cardBorder, background: theme === 'light' ? 'rgba(99,102,241,0.04)' : 'rgba(99,102,241,0.05)' }}>
                        <p className="text-sm font-black" style={{ color: T.text }}>Change Password</p>
                        <p className="text-xs mt-0.5" style={{ color: T.mutedText }}>Ensure your account is protected with a strong password</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <AccountField label="Current Password" icon={<Lock size={13}/>} theme={theme}>
                            <div className="relative">
                                <input type={showCurrentPwd ? 'text' : 'password'} value={passwordForm.currentPassword}
                                    onChange={e => setPasswordForm(f => ({...f, currentPassword: e.target.value}))}
                                    className={`${inputClass} pr-12`} style={{...inputStyle, color: T.text}} placeholder="Enter current password" />
                                <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 transition" style={{ color: T.mutedText }}>
                                    {showCurrentPwd ? <EyeOff size={14}/> : <Eye size={14}/>}
                                </button>
                            </div>
                        </AccountField>
                        <AccountField label="New Password" icon={<Key size={13}/>} theme={theme}>
                            <div className="relative">
                                <input type={showNewPwd ? 'text' : 'password'} value={passwordForm.newPassword}
                                    onChange={e => setPasswordForm(f => ({...f, newPassword: e.target.value}))}
                                    className={`${inputClass} pr-12`} style={{...inputStyle, color: T.text}} placeholder="Min. 6 characters" />
                                <button type="button" onClick={() => setShowNewPwd(!showNewPwd)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 transition" style={{ color: T.mutedText }}>
                                    {showNewPwd ? <EyeOff size={14}/> : <Eye size={14}/>}
                                </button>
                            </div>
                        </AccountField>
                        <AccountField label="Confirm New Password" icon={<Key size={13}/>} theme={theme}>
                            <input type="password" value={passwordForm.confirmPassword}
                                onChange={e => setPasswordForm(f => ({...f, confirmPassword: e.target.value}))}
                                className={inputClass} style={{...inputStyle, color: T.text}} placeholder="Re-enter new password" />
                        </AccountField>
                        <div className="flex items-center justify-between pt-2">
                            <AnimatePresence>
                                {pwdMsg === 'success' && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-400 text-sm font-bold"><BadgeCheck size={16}/>Updated</motion.div>}
                                {pwdMsg === 'error' && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-rose-400 text-sm font-bold"><AlertTriangle size={16}/>Incorrect</motion.div>}
                                {pwdMsg === 'mismatch' && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-amber-400 text-sm font-bold"><AlertTriangle size={16}/>Don't match</motion.div>}
                                {pwdMsg === 'short' && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-amber-400 text-sm font-bold"><AlertTriangle size={16}/>Too short</motion.div>}
                            </AnimatePresence>
                            {!pwdMsg && <div />}
                            <button onClick={changePassword} disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-white transition hover:scale-105 active:scale-95 disabled:opacity-60"
                                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
                                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />}
                                {saving ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const AccountField = ({ label, icon, children, theme }) => {
    const T = getTheme(theme);
    return (
        <div>
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: T.mutedText }}>
                {icon} {label}
            </label>
            {children}
        </div>
    );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const App = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user_session')));
    const [projects, setProjects] = useState([]);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [selectedProject, setSelectedProject] = useState(null);
    const [detailTab, setDetailTab] = useState('Overview');
    const [showModal, setShowModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [authForm, setAuthForm] = useState({ email:'', password:'', fullName:'', company:'', profileImage:'' });
    const [showPass, setShowPass] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [newTask, setNewTask] = useState('');
    const [newMilestone, setNewMilestone] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    // ─ Theme & Settings ─
    const [theme, setTheme] = useState(() => localStorage.getItem('th_theme') || 'dark');
    const [settings, setSettings] = useState(() => {
        try { return JSON.parse(localStorage.getItem('th_settings')) || {}; } catch { return {}; }
    });
    const defaultSettings = {
        accentColor: 'indigo', fontSize: 'md', compactMode: false, animations: true,
        deadlineReminders: true, taskUpdates: false, teamActivity: true, reminderLeadTime: '3d',
        defaultView: 'Dashboard', showProgress: true, showDeadlines: true, autoRefresh: false,
        analyticsTracking: false, sessionPersist: true,
        ...settings
    };

    useEffect(() => { localStorage.setItem('th_theme', theme); }, [theme]);
    useEffect(() => { localStorage.setItem('th_settings', JSON.stringify(defaultSettings)); }, [settings]);

    const T = getTheme(theme);

    const [form, setForm] = useState({
        name:'', description:'', startDate:'', deadline:'',
        owner:'', priority:'Medium', tags:[], budget:'',
        teamMembers:''
    });

    useEffect(() => { if (user) fetchData(); }, [user]);

    const fetchData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/projects/${user.userId}`);
            setProjects(res.data);
            if (selectedProject) {
                const fresh = res.data.find(p => p._id === selectedProject._id);
                if (fresh) setSelectedProject(fresh);
            }
        } catch (err) { console.error("Data Sync Failure"); }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setAuthForm({ ...authForm, profileImage: reader.result });
        reader.readAsDataURL(file);
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        const url = isLogin ? 'login' : 'register';
        try {
            const res = await axios.post(`http://localhost:5000/api/${url}`, authForm);
            if (isLogin) {
                localStorage.setItem('user_session', JSON.stringify(res.data));
                setUser(res.data);
            } else {
                setIsLogin(true);
                alert("Account provisioned successfully.");
            }
        } catch { alert("Access Denied: Please check credentials."); }
        finally { setAuthLoading(false); }
    };

    const updateProject = async (updated) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/projects/${updated._id}`, updated);
            setSelectedProject(res.data);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const deleteProject = async (id) => {
        if (!window.confirm("Confirm Project Deletion?")) return;
        await axios.delete(`http://localhost:5000/api/projects/${id}`);
        setSelectedProject(null);
        fetchData();
    };

    const calculateProgress = (tasks) => {
        if (!tasks || tasks.length === 0) return 0;
        return Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        const members = form.teamMembers.split(',').map(s => s.trim()).filter(Boolean);
        await axios.post('http://localhost:5000/api/projects', {
            ...form,
            budget: form.budget ? Number(form.budget) : null,
            teamMembers: members,
            userId: user.userId
        });
        setShowModal(false);
        setForm({ name:'', description:'', startDate:'', deadline:'', owner:'', priority:'Medium', tags:[], budget:'', teamMembers:'' });
        fetchData();
    };

    const toggleTag = (tag) => {
        setForm(f => ({
            ...f,
            tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
        }));
    };

    const addTask = () => {
        if (!newTask.trim()) return;
        updateProject({ ...selectedProject, tasks: [...(selectedProject.tasks || []), { title: newTask, completed: false }] });
        setNewTask('');
    };

    const toggleTask = (index) => {
        const tasks = [...selectedProject.tasks];
        tasks[index].completed = !tasks[index].completed;
        updateProject({ ...selectedProject, tasks });
    };

    const deleteTask = (index) => {
        const tasks = selectedProject.tasks.filter((_, i) => i !== index);
        updateProject({ ...selectedProject, tasks });
    };

    const addMilestone = () => {
        if (!newMilestone.trim()) return;
        updateProject({ ...selectedProject, milestones: [...(selectedProject.milestones || []), { title: newMilestone, completed: false }] });
        setNewMilestone('');
    };

    const toggleMilestone = (index) => {
        const milestones = [...selectedProject.milestones];
        milestones[index].completed = !milestones[index].completed;
        updateProject({ ...selectedProject, milestones });
    };

    const postComment = async () => {
        if (!newComment.trim()) return;
        const res = await axios.post(`http://localhost:5000/api/projects/${selectedProject._id}/comments`, { author: user.fullName, text: newComment });
        setSelectedProject(res.data);
        setNewComment('');
        fetchData();
    };

    const handleAttachment = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { alert("File must be < 5MB"); return; }
        const reader = new FileReader();
        reader.onloadend = async () => {
            const res = await axios.post(`http://localhost:5000/api/projects/${selectedProject._id}/attachments`, {
                name: file.name, data: reader.result, type: file.type
            });
            setSelectedProject(res.data);
            fetchData();
        };
        reader.readAsDataURL(file);
    };

    // ── AUTH SCREEN ────────────────────────────────────────────────────────────
    if (!user) return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 40%, #0a0a1a 100%)' }}>
            <GeoBg theme="dark" />
            <FloatingOrbs />

            <div className="hidden lg:flex flex-col justify-between w-[480px] h-screen p-14 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
                        <ShieldCheck size={20} className="text-white" />
                    </div>
                    <span className="text-white font-black text-xl tracking-tighter">TH.PRO</span>
                </div>
                <div>
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-6">
                            <Zap size={12} className="text-indigo-400" />
                            <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Project Intelligence</span>
                        </div>
                        <h1 className="text-5xl font-black text-white leading-tight tracking-tighter mb-4">
                            Manage Work<br/>
                            <span className="text-transparent bg-clip-text" style={{backgroundImage:'linear-gradient(135deg,#6366f1,#a78bfa)'}}>
                                Like a Pro
                            </span>
                        </h1>
                        <p className="text-slate-400 text-base leading-relaxed">A command center for your projects. Track progress, collaborate, and deliver on time.</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            { icon: <Activity size={16}/>, text: "Real-time project analytics" },
                            { icon: <Users size={16}/>, text: "Seamless team collaboration" },
                            { icon: <Shield size={16}/>, text: "Enterprise-grade security" },
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">{f.icon}</div>
                                <span className="text-slate-300 text-sm font-medium">{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-slate-600 text-xs">© 2025 TH.PRO · All rights reserved</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-[440px] mx-6">
                <div className="rounded-3xl overflow-hidden border border-white/10"
                    style={{ background: 'rgba(13,13,30,0.85)', backdropFilter: 'blur(40px)', boxShadow: '0 0 0 1px rgba(99,102,241,0.15),0 40px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                    <div className="h-1 w-full" style={{background:'linear-gradient(90deg,#6366f1,#a78bfa,#6366f1)'}} />
                    <div className="p-10">
                        <div className="lg:hidden flex items-center gap-2 mb-8">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center"><ShieldCheck size={16} className="text-white" /></div>
                            <span className="text-white font-black text-lg tracking-tighter">TH.PRO</span>
                        </div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-white tracking-tight">{isLogin ? 'Welcome back' : 'Create account'}</h2>
                            <p className="text-slate-500 text-sm mt-1">{isLogin ? 'Sign in to your workspace' : 'Set up your new workspace'}</p>
                        </div>
                        <form onSubmit={handleAuth} className="space-y-4">
                            {!isLogin && (
                                <>
                                    <div className="flex justify-center mb-6">
                                        <label className="relative cursor-pointer group">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-500/40 bg-indigo-500/10 flex items-center justify-center transition group-hover:border-indigo-400">
                                                {authForm.profileImage ? <img src={authForm.profileImage} className="w-full h-full object-cover" alt="profile" /> : <Camera className="text-indigo-400" size={24} />}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"><Plus size={12} className="text-white" /></div>
                                            <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                                        </label>
                                    </div>
                                    <AuthInput icon={<User size={15}/>} placeholder="Full Name" onChange={e => setAuthForm({...authForm, fullName: e.target.value})} required />
                                    <AuthInput icon={<Globe size={15}/>} placeholder="Company Name" onChange={e => setAuthForm({...authForm, company: e.target.value})} required />
                                </>
                            )}
                            <AuthInput icon={<Mail size={15}/>} placeholder="Email Address" type="email" onChange={e => setAuthForm({...authForm, email: e.target.value})} required />
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"><Lock size={15} /></div>
                                <input type={showPass ? 'text' : 'password'} placeholder="Password"
                                    onChange={e => setAuthForm({...authForm, password: e.target.value})} required
                                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm font-medium text-white placeholder-slate-500 outline-none transition focus:ring-2 focus:ring-indigo-500/40"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                                    {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                                </button>
                            </div>
                            <button type="submit" disabled={authLoading}
                                className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 8px 30px rgba(99,102,241,0.35)' }}>
                                {authLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={14}/></>}
                            </button>
                        </form>
                        <div className="mt-6 pt-6 border-t border-white/5 text-center">
                            <p className="text-slate-500 text-xs">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                <span onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 font-bold cursor-pointer hover:text-indigo-300 transition">
                                    {isLogin ? 'Sign up' : 'Sign in'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );

    // ── MAIN APP ───────────────────────────────────────────────────────────────
    const inProgressProjects = projects.filter(p => p.status === 'In Progress');
    const pendingProjects = projects.filter(p => p.status === 'Not Started');

    const NAV_ITEMS = [
        { id: 'Dashboard', icon: <LayoutDashboard size={17}/>, count: null },
        { id: 'Schedule',  icon: <Clock size={17}/>, count: null },
        { id: 'Team',      icon: <Users size={17}/>, count: null },
        { id: 'Active',    icon: <PlayCircle size={17}/>, count: inProgressProjects.length || null },
        { id: 'Pending',   icon: <AlertCircle size={17}/>, count: pendingProjects.length || null },
        { id: 'Analytics', icon: <BarChart3 size={17}/>, count: null },
        { id: 'Account',   icon: <UserCircle size={17}/>, count: null },
        { id: 'Settings',  icon: <Settings size={17}/>, count: null },
    ];

    const navActiveStyle = {
        background: theme === 'light'
            ? 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(124,58,237,0.08))'
            : 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(124,58,237,0.1))',
        border: '1px solid rgba(99,102,241,0.25)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
    };

    const inputStyle = { background: T.input, border: `1px solid ${T.inputBorder}` };

    return (
        <div className="flex h-screen overflow-hidden font-sans" style={{ background: T.bg, color: T.text }}>

            {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
            <aside className="w-[240px] flex-shrink-0 flex flex-col relative overflow-hidden"
                style={{ background: T.sidebar, borderRight: `1px solid ${T.sidebarBorder}` }}>
                <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(99,102,241,0.15) 0%,transparent 70%)' }} />

                <div className="relative px-6 pt-7 pb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
                            <ShieldCheck size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="font-black text-base tracking-tighter leading-none" style={{ color: T.text }}>TH.PRO</p>
                            <p className="text-indigo-400/70 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">Project Hub</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                    {NAV_ITEMS.map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left relative group"
                            style={activeTab === item.id
                                ? { ...navActiveStyle, color: theme === 'light' ? '#1e1b4b' : '#fff' }
                                : { color: T.mutedText }}>
                            {activeTab === item.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                                    style={{ background: 'linear-gradient(180deg,#6366f1,#a78bfa)' }} />
                            )}
                            <span className={activeTab === item.id ? 'text-indigo-400' : ''}>{item.icon}</span>
                            <span className="text-sm font-semibold flex-1">{item.id}</span>
                            {item.count > 0 && (
                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                                    style={{ background: 'rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
                                    {item.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Theme toggle at bottom of nav */}
                <div className="px-3 mb-2">
                    <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all"
                        style={{ background: T.hoverBg, border: `1px solid ${T.cardBorder}`, color: T.mutedText }}>
                        {theme === 'dark' ? <Sun size={15} className="text-amber-400"/> : <Moon size={15} className="text-indigo-400"/>}
                        <span className="text-xs font-bold">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                </div>

                <div className="p-4 mx-3 mb-3 rounded-2xl cursor-pointer transition"
                    onClick={() => setActiveTab('Account')}
                    style={{ background: T.hoverBg, border: `1px solid ${activeTab === 'Account' ? 'rgba(99,102,241,0.35)' : T.cardBorder}` }}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 border border-indigo-500/30">
                            {user.profileImage
                                ? <img src={user.profileImage} className="w-full h-full object-cover" alt="avatar" />
                                : <div className="w-full h-full flex items-center justify-center text-indigo-400 font-black text-sm" style={{ background: 'rgba(99,102,241,0.2)' }}>
                                    {user.fullName?.charAt(0)}
                                  </div>
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs truncate leading-none" style={{ color: T.text }}>{user.fullName}</p>
                            <p className="text-[10px] mt-0.5 truncate" style={{ color: T.mutedText }}>{user.company}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); localStorage.clear(); window.location.reload(); }}
                            className="text-slate-600 hover:text-rose-400 transition flex-shrink-0">
                            <LogOut size={15}/>
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
            <main className="flex-1 overflow-y-auto relative" style={{ background: T.bg }}>
                <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ left: '240px' }}>
                    <GeoBg theme={theme} />
                    <div className="absolute top-[-20%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-40"
                        style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)' }} />
                    <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] rounded-full opacity-30"
                        style={{ background: 'radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)' }} />
                </div>

                <div className="relative z-10">
                    <header className="sticky top-0 z-20 px-8 py-5 flex justify-between items-center"
                        style={{ background: T.header, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${T.headerBorder}` }}>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black tracking-tighter" style={{ color: T.text }}>{activeTab}</h1>
                                {activeTab === 'Active' && inProgressProjects.length > 0 && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-black"
                                        style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
                                        {inProgressProjects.length} active
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5" style={{ color: T.mutedText }}>{user.company} Workspace</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {activeTab !== 'Account' && activeTab !== 'Settings' && (
                                <button onClick={() => setShowModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition hover:scale-105 active:scale-95"
                                    style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
                                    <Plus size={16}/> New Project
                                </button>
                            )}
                        </div>
                    </header>

                    <div className="p-8">
                        {activeTab === 'Dashboard' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard icon={<Activity size={18}/>} label="Global Efficiency"
                                        value={`${projects.length > 0 ? Math.round(projects.reduce((a,c) => a + calculateProgress(c.tasks), 0) / projects.length) : 0}%`}
                                        accent="#6366f1" sub="average completion" theme={theme} />
                                    <StatCard icon={<Layers size={18}/>} label="Total Projects" value={projects.length} accent="#8b5cf6" sub="all time" theme={theme} />
                                    <StatCard icon={<PlayCircle size={18}/>} label="In Progress" value={inProgressProjects.length} accent="#3b82f6" sub="active now" theme={theme} />
                                    <StatCard icon={<CheckCircle2 size={18}/>} label="Completed" value={projects.filter(p => p.status === 'Completed').length} accent="#10b981" sub="delivered" theme={theme} />
                                </div>

                                {inProgressProjects.length > 0 && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-between px-5 py-3.5 rounded-2xl cursor-pointer group"
                                        onClick={() => setActiveTab('Active')}
                                        style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.08),rgba(99,102,241,0.06))', border: '1px solid rgba(59,130,246,0.2)' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                                            <span className="text-blue-300 text-sm font-bold">
                                                {inProgressProjects.length} project{inProgressProjects.length > 1 ? 's' : ''} currently in progress
                                            </span>
                                        </div>
                                        <span className="text-blue-400 text-xs font-black uppercase tracking-widest group-hover:text-blue-300 transition flex items-center gap-1">
                                            View Active <ArrowRight size={11}/>
                                        </span>
                                    </motion.div>
                                )}

                                {projects.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-center">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                                            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                                            <Layers size={28} className="text-indigo-400" />
                                        </div>
                                        <h3 className="text-lg font-black mb-2" style={{ color: T.text }}>No projects yet</h3>
                                        <p className="text-sm mb-6" style={{ color: T.mutedText }}>Create your first project to get started</p>
                                        <button onClick={() => setShowModal(true)}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
                                            style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
                                            <Plus size={16}/> Create Project
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {projects.map((p, idx) => (
                                            <ProjectCard key={p._id} project={p} index={idx} calculateProgress={calculateProgress}
                                                onClick={() => { setSelectedProject(p); setDetailTab('Overview'); }} theme={theme} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'Analytics' && <Analytics projects={projects} calculateProgress={calculateProgress} theme={theme} />}
                        {activeTab === 'Team'      && <Team projects={projects} theme={theme} />}
                        {activeTab === 'Schedule'  && <Schedule projects={projects} theme={theme} />}
                        {activeTab === 'Active'    && (
                            <ActiveProjects projects={inProgressProjects} calculateProgress={calculateProgress}
                                setSelectedProject={(p) => { setSelectedProject(p); setDetailTab('Overview'); }} theme={theme} />
                        )}
                        {activeTab === 'Pending'   && (
                            <PendingProjects projects={pendingProjects} calculateProgress={calculateProgress}
                                setSelectedProject={(p) => { setSelectedProject(p); setDetailTab('Overview'); }} theme={theme} />
                        )}
                        {activeTab === 'Account' && <AccountPage user={user} setUser={setUser} theme={theme} />}
                        {activeTab === 'Settings' && (
                            <SettingsPage theme={theme} setTheme={setTheme} settings={defaultSettings} setSettings={setSettings} />
                        )}
                    </div>
                </div>
            </main>

            {/* ── PROJECT DETAIL PANEL ────────────────────────────────────────── */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex justify-end"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                        onClick={(e) => { if (e.target === e.currentTarget) setSelectedProject(null); }}>

                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                            className="w-[580px] h-full flex flex-col overflow-hidden"
                            style={{ background: T.panelBg, borderLeft: `1px solid ${T.panelBorder}`, boxShadow: '-20px 0 80px rgba(0,0,0,0.6)' }}>

                            <div className="h-0.5 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg,#6366f1,#a78bfa,#6366f1)' }} />

                            <div className="px-7 pt-6 pb-4 border-b flex-shrink-0" style={{ borderColor: T.panelBorder }}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 mr-4">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            {(() => {
                                                const p = PRIORITY_COLORS[selectedProject.priority] || PRIORITY_COLORS['Medium'];
                                                return (
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${p.bg} ${p.text} border ${p.border}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`}></span>
                                                        {selectedProject.priority}
                                                    </span>
                                                );
                                            })()}
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase ${STATUS_COLORS[selectedProject.status]}`}>
                                                {STATUS_ICONS[selectedProject.status]} {selectedProject.status}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-black tracking-tight" style={{ color: T.text }}>{selectedProject.name}</h2>
                                        {selectedProject.owner && (
                                            <p className="text-xs mt-1" style={{ color: T.mutedText }}>Owner: <span className="font-semibold" style={{ color: T.text }}>{selectedProject.owner}</span></p>
                                        )}
                                    </div>
                                    <button onClick={() => setSelectedProject(null)}
                                        className="p-2 rounded-xl transition flex-shrink-0"
                                        style={{ color: T.mutedText }}>
                                        <X size={18}/>
                                    </button>
                                </div>
                            </div>

                            <div className="flex border-b flex-shrink-0 overflow-x-auto px-4" style={{ borderColor: T.panelBorder }}>
                                {DETAIL_TABS.map(t => (
                                    <button key={t} onClick={() => setDetailTab(t)}
                                        className={`px-4 py-3 text-xs font-black uppercase tracking-widest whitespace-nowrap border-b-2 transition ${
                                            detailTab === t ? 'border-indigo-500 text-indigo-400' : 'border-transparent hover:text-slate-400'
                                        }`}
                                        style={detailTab !== t ? { color: T.mutedText } : {}}>
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto p-7">
                                {/* ── OVERVIEW ── */}
                                {detailTab === 'Overview' && (
                                    <div className="space-y-5">
                                        {selectedProject.description && (
                                            <div className="p-4 rounded-xl" style={{ background: theme === 'light' ? 'rgba(99,102,241,0.04)' : 'rgba(255,255,255,0.03)', border: `1px solid ${T.cardBorder}` }}>
                                                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: T.mutedText }}>Description</p>
                                                <p className="text-sm leading-relaxed" style={{ color: T.text }}>{selectedProject.description}</p>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedProject.startDate && <DarkInfoCard icon={<Calendar size={13}/>} label="Start Date" value={selectedProject.startDate} theme={theme} />}
                                            {selectedProject.deadline  && <DarkInfoCard icon={<Clock size={13}/>}    label="Deadline"   value={selectedProject.deadline} theme={theme} />}
                                            {selectedProject.budget != null && <DarkInfoCard icon={<DollarSign size={13}/>} label="Budget" value={`₹${selectedProject.budget.toLocaleString()}`} theme={theme} />}
                                            <DarkInfoCard icon={<Activity size={13}/>} label="Progress" value={`${calculateProgress(selectedProject.tasks)}% complete`} accent theme={theme} />
                                        </div>
                                        <div className="p-4 rounded-xl" style={{ background: theme === 'light' ? 'rgba(99,102,241,0.04)' : 'rgba(255,255,255,0.03)', border: `1px solid ${T.cardBorder}` }}>
                                            <div className="flex justify-between text-xs font-bold mb-3">
                                                <span style={{ color: T.mutedText }}>Task Completion</span>
                                                <span className="text-indigo-400">{calculateProgress(selectedProject.tasks)}%</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: theme === 'light' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.06)' }}>
                                                <div className="h-full rounded-full transition-all"
                                                    style={{ width:`${calculateProgress(selectedProject.tasks)}%`, background:'linear-gradient(90deg,#6366f1,#a78bfa)' }} />
                                            </div>
                                            <p className="text-xs mt-2" style={{ color: T.mutedText }}>
                                                {(selectedProject.tasks||[]).filter(t=>t.completed).length} of {(selectedProject.tasks||[]).length} tasks done
                                            </p>
                                        </div>
                                        {selectedProject.tags?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: T.mutedText }}>Tags</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProject.tags.map(t => (
                                                        <span key={t} className="px-3 py-1 rounded-full text-xs font-bold"
                                                            style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }}>
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: T.mutedText }}>Change Status</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {STATUSES.map(s => (
                                                    <button key={s} onClick={() => updateProject({...selectedProject, status: s})}
                                                        className="py-2.5 px-4 text-xs font-bold rounded-xl flex items-center gap-2 transition border"
                                                        style={selectedProject.status === s ? {
                                                            color: '#fff',
                                                            borderColor: 'rgba(99,102,241,0.5)',
                                                            background: 'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(124,58,237,0.15))'
                                                        } : { color: T.mutedText, borderColor: T.cardBorder, background: T.hoverBg }}>
                                                        <span className={STATUS_COLORS[s]}>{STATUS_ICONS[s]}</span> {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: T.mutedText }}>Priority</p>
                                            <div className="flex gap-2">
                                                {PRIORITIES.map(p => {
                                                    const col = PRIORITY_COLORS[p];
                                                    return (
                                                        <button key={p} onClick={() => updateProject({...selectedProject, priority: p})}
                                                            className={`flex-1 py-2 text-xs font-black rounded-xl transition border ${
                                                                selectedProject.priority === p ? `${col.bg} ${col.text} ${col.border}` : ''
                                                            }`}
                                                            style={selectedProject.priority !== p ? { color: T.mutedText, borderColor: T.cardBorder, background: T.hoverBg } : {}}>
                                                            {p}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <button onClick={() => deleteProject(selectedProject._id)}
                                            className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 hover:text-rose-300 text-rose-400"
                                            style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                            <Trash2 size={14}/> Delete Project
                                        </button>
                                    </div>
                                )}

                                {/* ── TASKS ── */}
                                {detailTab === 'Tasks' && (
                                    <div className="space-y-3">
                                        <div className="p-4 rounded-xl mb-4" style={{ background: T.hoverBg, border: `1px solid ${T.cardBorder}` }}>
                                            <div className="flex justify-between text-xs font-bold mb-2">
                                                <span style={{ color: T.mutedText }}>Completion</span>
                                                <span className="text-indigo-400">{calculateProgress(selectedProject.tasks)}%</span>
                                            </div>
                                            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: theme === 'light' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.06)' }}>
                                                <div className="h-full rounded-full" style={{ width:`${calculateProgress(selectedProject.tasks)}%`, background:'linear-gradient(90deg,#6366f1,#a78bfa)' }} />
                                            </div>
                                        </div>
                                        {(selectedProject.tasks || []).map((t, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl group transition"
                                                style={{ background: T.hoverBg, border: `1px solid ${T.cardBorder}` }}>
                                                <button onClick={() => toggleTask(i)}
                                                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition border-2"
                                                    style={t.completed ? { background: 'linear-gradient(135deg,#6366f1,#7c3aed)', borderColor: '#6366f1' } : { borderColor: T.mutedText }}>
                                                    {t.completed && <CheckCircle2 size={11} className="text-white" />}
                                                </button>
                                                <span className={`flex-1 text-sm font-medium ${t.completed ? 'line-through text-slate-500' : ''}`}
                                                    style={!t.completed ? { color: T.text } : {}}>
                                                    {t.title}
                                                </span>
                                                <button onClick={() => deleteTask(i)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition">
                                                    <X size={13}/>
                                                </button>
                                            </div>
                                        ))}
                                        <div className="flex gap-2 mt-4">
                                            <input value={newTask} onChange={e => setNewTask(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && addTask()}
                                                className="flex-1 p-3 rounded-xl text-sm placeholder-slate-500 outline-none transition focus:ring-2 focus:ring-indigo-500/30"
                                                style={{...inputStyle, color: T.text}}
                                                placeholder="Add new task..." />
                                            <button onClick={addTask} className="px-4 rounded-xl text-white transition hover:scale-105"
                                                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
                                                <Plus size={16}/>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ── MILESTONES ── */}
                                {detailTab === 'Milestones' && (
                                    <div className="space-y-3">
                                        {(selectedProject.milestones || []).map((m, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl transition"
                                                style={{ background: T.hoverBg, border: `1px solid ${T.cardBorder}` }}>
                                                <button onClick={() => toggleMilestone(i)}
                                                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition border-2"
                                                    style={m.completed ? { background: 'linear-gradient(135deg,#10b981,#059669)', borderColor: '#10b981' } : { borderColor: T.mutedText }}>
                                                    {m.completed && <CheckCircle2 size={11} className="text-white" />}
                                                </button>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-bold ${m.completed ? 'line-through text-slate-500' : ''}`}
                                                        style={!m.completed ? { color: T.text } : {}}>
                                                        {m.title}
                                                    </p>
                                                    {m.dueDate && <p className="text-[10px] mt-0.5" style={{ color: T.mutedText }}>{m.dueDate}</p>}
                                                </div>
                                                <Target size={14} className={m.completed ? 'text-emerald-400' : 'text-slate-600'} />
                                            </div>
                                        ))}
                                        <div className="flex gap-2">
                                            <input value={newMilestone} onChange={e => setNewMilestone(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && addMilestone()}
                                                className="flex-1 p-3 rounded-xl text-sm placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                                                style={{...inputStyle, color: T.text}} placeholder="Add milestone..." />
                                            <button onClick={addMilestone} className="px-4 rounded-xl text-white transition hover:scale-105"
                                                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
                                                <Plus size={16}/>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ── TEAM ── */}
                                {detailTab === 'Team' && (
                                    <div className="space-y-3">
                                        {selectedProject.owner && (
                                            <div className="flex items-center gap-3 p-4 rounded-xl"
                                                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                                                    style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
                                                    {selectedProject.owner.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold" style={{ color: T.text }}>{selectedProject.owner}</p>
                                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Project Owner</p>
                                                </div>
                                            </div>
                                        )}
                                        {(selectedProject.teamMembers || []).length === 0
                                            ? <p className="text-sm text-center py-8" style={{ color: T.mutedText }}>No team members assigned.</p>
                                            : (selectedProject.teamMembers || []).map((m, i) => (
                                                <div key={i} className="flex items-center gap-3 p-4 rounded-xl"
                                                    style={{ background: T.hoverBg, border: `1px solid ${T.cardBorder}` }}>
                                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-indigo-300 flex-shrink-0"
                                                        style={{ background: 'rgba(99,102,241,0.15)' }}>
                                                        {m.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-medium" style={{ color: T.text }}>{m}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}

                                {/* ── FILES ── */}
                                {detailTab === 'Files' && (
                                    <div className="space-y-3">
                                        <label className="flex flex-col items-center justify-center gap-2 w-full py-10 rounded-xl cursor-pointer transition"
                                            style={{ border: '2px dashed rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.04)' }}>
                                            <Paperclip size={20} className="text-indigo-400" />
                                            <span className="text-sm font-bold" style={{ color: T.mutedText }}>Click to attach file</span>
                                            <span className="text-xs" style={{ color: T.mutedText }}>Max 5MB per file</span>
                                            <input type="file" hidden onChange={handleAttachment} />
                                        </label>
                                        {(selectedProject.attachments || []).map((a, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl"
                                                style={{ background: T.hoverBg, border: `1px solid ${T.cardBorder}` }}>
                                                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    style={{ background: 'rgba(99,102,241,0.15)' }}>
                                                    <FileText size={16} className="text-indigo-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate" style={{ color: T.text }}>{a.name}</p>
                                                    <p className="text-[10px]" style={{ color: T.mutedText }}>{new Date(a.uploadedAt).toLocaleDateString()}</p>
                                                </div>
                                                <a href={a.data} download={a.name} className="p-2 rounded-lg text-indigo-400 hover:text-indigo-300 transition"
                                                    style={{ background: 'rgba(99,102,241,0.1)' }}>
                                                    <Download size={14}/>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ── ACTIVITY ── */}
                                {detailTab === 'Activity' && (
                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <input value={newComment} onChange={e => setNewComment(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && postComment()}
                                                className="flex-1 p-3 rounded-xl text-sm placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                                                style={{...inputStyle, color: T.text}} placeholder="Add comment or update..." />
                                            <button onClick={postComment} className="px-4 rounded-xl text-white transition hover:scale-105"
                                                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
                                                <Send size={16}/>
                                            </button>
                                        </div>
                                        {(selectedProject.comments || []).length === 0
                                            ? <p className="text-sm text-center py-8" style={{ color: T.mutedText }}>No activity yet.</p>
                                            : [...(selectedProject.comments || [])].reverse().map((c, i) => (
                                                <div key={i} className="flex gap-3 p-4 rounded-xl"
                                                    style={{ background: T.hoverBg, border: `1px solid ${T.cardBorder}` }}>
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-indigo-300 flex-shrink-0"
                                                        style={{ background: 'rgba(99,102,241,0.2)' }}>
                                                        {(c.author||'?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-xs font-black" style={{ color: T.text }}>{c.author}</span>
                                                            <span className="text-[10px]" style={{ color: T.mutedText }}>{new Date(c.timestamp).toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-sm leading-relaxed" style={{ color: T.mutedText }}>{c.text}</p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── CREATE PROJECT MODAL ─────────────────────────────────────────── */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-y-auto"
                        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                            className="w-full max-w-2xl rounded-3xl overflow-hidden my-4"
                            style={{ background: T.modalBg, border: `1px solid ${T.panelBorder}`, boxShadow: '0 0 0 1px rgba(99,102,241,0.15),0 40px 80px rgba(0,0,0,0.7)' }}>

                            <div className="h-0.5" style={{ background: 'linear-gradient(90deg,#6366f1,#a78bfa,#6366f1)' }} />

                            <div className="flex justify-between items-center px-8 pt-7 pb-5 border-b" style={{ borderColor: T.panelBorder }}>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter" style={{ color: T.text }}>New Project</h2>
                                    <p className="text-xs mt-1" style={{ color: T.mutedText }}>Initialize your project workspace</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl transition" style={{ color: T.mutedText }}>
                                    <X size={18}/>
                                </button>
                            </div>

                            <form onSubmit={handleCreateProject} className="p-8 space-y-5">
                                <DarkFormField label="Project Name *" theme={theme}>
                                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                                        className="w-full px-4 py-3.5 rounded-xl text-sm font-bold placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                                        style={{...inputStyle, color: T.text}} placeholder="e.g. Portfolio Website" required />
                                </DarkFormField>
                                <DarkFormField label="Description" theme={theme}>
                                    <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                                        className="w-full px-4 py-3.5 rounded-xl text-sm placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30 transition resize-none"
                                        style={{...inputStyle, color: T.text}} placeholder="Short summary..." rows={3} />
                                </DarkFormField>

                                <div className="grid grid-cols-3 gap-4">
                                    <DarkFormField label="Start Date" theme={theme}>
                                        <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})}
                                            className="w-full px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                                            style={{...inputStyle, color: T.text, colorScheme: theme === 'light' ? 'light' : 'dark'}} />
                                    </DarkFormField>
                                    <DarkFormField label="Deadline" theme={theme}>
                                        <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})}
                                            className="w-full px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                                            style={{...inputStyle, color: T.text, colorScheme: theme === 'light' ? 'light' : 'dark'}} />
                                    </DarkFormField>
                                    <DarkFormField label="Project Owner" theme={theme}>
                                        <input value={form.owner} onChange={e => setForm({...form, owner: e.target.value})}
                                            className="w-full px-4 py-3.5 rounded-xl text-sm placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                                            style={{...inputStyle, color: T.text}} placeholder="John Doe" />
                                    </DarkFormField>
                                </div>

                                <DarkFormField label="Priority" theme={theme}>
                                    <div className="grid grid-cols-4 gap-2">
                                        {PRIORITIES.map(p => {
                                            const col = PRIORITY_COLORS[p];
                                            return (
                                                <button type="button" key={p} onClick={() => setForm({...form, priority: p})}
                                                    className={`py-2.5 text-xs font-black uppercase rounded-xl transition border ${form.priority === p ? `${col.bg} ${col.text} ${col.border}` : ''}`}
                                                    style={form.priority !== p ? { color: T.mutedText, borderColor: T.cardBorder, background: T.hoverBg } : {}}>
                                                    {p}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </DarkFormField>

                                <DarkFormField label="Tags" theme={theme}>
                                    <div className="flex flex-wrap gap-2">
                                        {TAGS_PRESET.map(t => (
                                            <button type="button" key={t} onClick={() => toggleTag(t)}
                                                className="px-3 py-1.5 text-xs font-bold rounded-full transition border"
                                                style={form.tags.includes(t)
                                                    ? { background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', borderColor: 'rgba(99,102,241,0.5)' }
                                                    : { color: T.mutedText, borderColor: T.cardBorder, background: T.hoverBg }}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </DarkFormField>

                                <div className="grid grid-cols-2 gap-4">
                                    <DarkFormField label="Team Members" hint="Comma-separated names" theme={theme}>
                                        <input value={form.teamMembers} onChange={e => setForm({...form, teamMembers: e.target.value})}
                                            className="w-full px-4 py-3.5 rounded-xl text-sm placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                                            style={{...inputStyle, color: T.text}} placeholder="Alice, Bob, Charlie" />
                                    </DarkFormField>
                                    <DarkFormField label="Budget (optional)" theme={theme}>
                                        <input type="number" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})}
                                            className="w-full px-4 py-3.5 rounded-xl text-sm placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                                            style={{...inputStyle, color: T.text}} placeholder="e.g. 50000" min="0" />
                                    </DarkFormField>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)}
                                        className="flex-1 py-3.5 rounded-xl font-bold text-sm transition border"
                                        style={{ color: T.mutedText, borderColor: T.cardBorder, background: T.hoverBg }}>
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        className="flex-1 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest text-white flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99]"
                                        style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 8px 30px rgba(99,102,241,0.3)' }}>
                                        <Zap size={14}/> Launch Project
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────
const AuthInput = ({ icon, placeholder, type = 'text', onChange, required }) => (
    <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">{icon}</div>
        <input type={type} placeholder={placeholder} onChange={onChange} required={required}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium text-white placeholder-slate-500 outline-none transition focus:ring-2 focus:ring-indigo-500/40"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
    </div>
);

const StatCard = ({ icon, label, value, accent, sub, theme }) => {
    const T = getTheme(theme);
    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{ background: T.card, border: `1px solid ${T.cardBorder}`, boxShadow: `0 0 30px ${accent}10` }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20"
                style={{ background: `radial-gradient(circle,${accent} 0%,transparent 70%)`, transform: 'translate(30%,-30%)' }} />
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 relative"
                style={{ background: `${accent}20`, color: accent }}>
                {icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: T.mutedText }}>{label}</p>
            <p className="text-3xl font-black" style={{ color: T.text }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: T.mutedText }}>{sub}</p>
        </motion.div>
    );
};

const ProjectCard = ({ project, index, calculateProgress, onClick, theme }) => {
    const T = getTheme(theme || 'dark');
    const pc = PRIORITY_COLORS;
    const prio = pc[project.priority] || pc['Medium'];
    const prog = calculateProgress(project.tasks);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={onClick}
            className="p-5 rounded-2xl cursor-pointer group relative overflow-hidden transition-all"
            style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}
            whileHover={{ scale: 1.01, boxShadow: '0 0 40px rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.3)' }}>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
                style={{ background: 'radial-gradient(ellipse at top left,rgba(99,102,241,0.06) 0%,transparent 60%)' }} />

            {project.status === 'In Progress' && (
                <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Live</span>
                    </span>
                </div>
            )}

            <div className="relative">
                <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${prio.bg} ${prio.text} border ${prio.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${prio.dot}`}></span>
                        {project.priority}
                    </span>
                    <span className={`text-[10px] font-bold uppercase flex items-center gap-1 ${STATUS_COLORS[project.status]}`}>
                        {STATUS_ICONS[project.status]} {project.status}
                    </span>
                </div>

                <h3 className="text-base font-black tracking-tight mb-1 group-hover:text-indigo-400 transition-colors leading-tight"
                    style={{ color: T.text }}>
                    {project.name}
                </h3>
                {project.description && (
                    <p className="text-xs mb-4 line-clamp-2 leading-relaxed" style={{ color: T.mutedText }}>{project.description}</p>
                )}

                <div className="mb-4">
                    <div className="flex justify-between text-[10px] font-bold mb-1.5">
                        <span style={{ color: T.mutedText }}>Progress</span>
                        <span style={{ color: T.text }}>{prog}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: theme === 'light' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all"
                            style={{ width:`${prog}%`, background: prog === 100 ? 'linear-gradient(90deg,#10b981,#059669)' : 'linear-gradient(90deg,#6366f1,#a78bfa)' }} />
                    </div>
                </div>

                <div className="flex justify-between items-center pt-3" style={{ borderTop: `1px solid ${T.cardBorder}` }}>
                    <div className="flex gap-1 flex-wrap">
                        {(project.tags || []).slice(0, 2).map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase"
                                style={{ background: T.hoverBg, color: T.mutedText }}>{t}</span>
                        ))}
                    </div>
                    {project.deadline && (
                        <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: T.mutedText }}>
                            <Calendar size={9} />{project.deadline}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const DarkInfoCard = ({ icon, label, value, accent, theme }) => {
    const T = getTheme(theme);
    return (
        <div className="p-4 rounded-xl" style={{
            background: accent ? 'rgba(99,102,241,0.08)' : T.hoverBg,
            border: `1px solid ${accent ? 'rgba(99,102,241,0.2)' : T.cardBorder}`
        }}>
            <div className="flex items-center gap-1.5 mb-1.5" style={{ color: accent ? '#a5b4fc' : T.mutedText }}>
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className={`text-sm font-bold ${accent ? 'text-indigo-300' : ''}`} style={!accent ? { color: T.text } : {}}>{value}</p>
        </div>
    );
};

const DarkFormField = ({ label, hint, children, theme }) => {
    const T = getTheme(theme);
    return (
        <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: T.mutedText }}>{label}</label>
            {children}
            {hint && <p className="text-[10px] mt-1" style={{ color: T.mutedText }}>{hint}</p>}
        </div>
    );
};

export default App;
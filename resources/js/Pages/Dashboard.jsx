import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import {
    Activity,
    ArrowUpRight,
    CalendarDays,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    FileHeart,
    Pause,
    Pill,
    Play,
    RotateCcw,
    ShieldCheck,
    TimerReset,
    Users,
} from 'lucide-react';

const fallbackSummary = {
    metrics: [],
    weeklyActivity: [],
    calendar: [],
    checklist: [],
};

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function AccordionRow({ id, title, open, onToggle, children }) {
    return (
        <div className="accordion-item">
            <button
                type="button"
                className="accordion-trigger"
                onClick={() => onToggle(id)}
                aria-expanded={open}
                aria-controls={`accordion-${id}`}
            >
                <span>{title}</span>
                <ChevronDown className="h-4 w-4" />
            </button>
            {open && <div id={`accordion-${id}`} className="accordion-content">{children}</div>}
        </div>
    );
}

export default function Dashboard({ user, upcomingMeds = [], upcomingAppointments = [], caregiverSync = {}, emergencySummary = {}, dashboardSummary = fallbackSummary }) {
    const summary = { ...fallbackSummary, ...dashboardSummary };
    const [medsState, setMedsState] = useState(upcomingMeds);
    const [openAccordion, setOpenAccordion] = useState('medications');
    const [activeChartPoint, setActiveChartPoint] = useState(4);
    const [timerSeconds, setTimerSeconds] = useState(155 * 60);
    const [timerRunning, setTimerRunning] = useState(false);
    const [checklist, setChecklist] = useState(summary.checklist || []);
    const [calendarDate, setCalendarDate] = useState(() => new Date(summary.calendar?.[0]?.date || new Date()));
    const [selectedEvent, setSelectedEvent] = useState(summary.calendar?.[0] || null);

    useEffect(() => {
        if (!timerRunning) return undefined;
        const interval = window.setInterval(() => setTimerSeconds((seconds) => seconds + 1), 1000);
        return () => window.clearInterval(interval);
    }, [timerRunning]);

    const initials = (user?.name || 'MediSync')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    const toggleMedication = (id) => {
        setMedsState((meds) => meds.map((med) => med.id === id ? { ...med, taken: !med.taken } : med));
    };

    const toggleAccordion = (id) => setOpenAccordion((current) => current === id ? null : id);

    const completedChecklist = checklist.filter((item) => item.completed).length;
    const checklistProgress = checklist.length ? Math.round((completedChecklist / checklist.length) * 100) : 0;

    const monthLabel = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const calendarDays = useMemo(() => {
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startOffset = (firstDay.getDay() + 6) % 7;
        return Array.from({ length: 35 }, (_, index) => new Date(year, month, index - startOffset + 1));
    }, [calendarDate]);

    const eventsForDate = (date) => summary.calendar.filter((event) => {
        const eventDate = new Date(`${event.date}T00:00:00`);
        return eventDate.getFullYear() === date.getFullYear() && eventDate.getMonth() === date.getMonth() && eventDate.getDate() === date.getDate();
    });

    const changeMonth = (offset) => setCalendarDate((date) => new Date(date.getFullYear(), date.getMonth() + offset, 1));

    const resetTimer = () => {
        setTimerRunning(false);
        setTimerSeconds(155 * 60);
    };

    const toggleChecklistItem = (id) => {
        setChecklist((items) => items.map((item) => item.id === id ? { ...item, completed: !item.completed } : item));
    };

    const timerProgress = `${Math.min(99, Math.max(8, ((timerSeconds % 3600) / 3600) * 100))}%`;
    const activePoint = summary.weeklyActivity?.[activeChartPoint] || { label: 'No activity', value: 0, day: '—' };
    const connectedCaregivers = caregiverSync.familyCount ?? caregiverSync.members?.length ?? 0;
    const firstMedication = medsState[0];

    return (
        <AppLayout user={user} surface="dashboard">
            <Head title="MediSync Dashboard" />

            <section className="dashboard-hero">
                <div>
                    <p className="eyebrow">Your health command centre · Pusat kesihatan anda</p>
                    <h1 className="dashboard-title">Welcome in, <span>{(user?.name || 'MediSync').split(' ')[0]}.</span></h1>
                    <p className="dashboard-subtitle">
                        Stay on top of medication, appointments, and family support in one calm overview.
                        <br className="hidden sm:block" /> Ringkasan penjagaan yang mudah untuk anda dan keluarga.
                    </p>
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-ink/8 bg-surface/65 px-3 py-2 text-xs font-semibold text-ink/60 shadow-sm md:flex">
                    <span className="status-dot" />
                    Caregiver sync active
                </div>
            </section>

            <section className="metric-grid" aria-label="Health overview metrics">
                {summary.metrics.map((metric) => {
                    const isCount = metric.key === 'appointments';
                    return (
                        <article key={metric.key} className="premium-card metric-card premium-card-hover">
                            <div className="metric-card-top">
                                <div>
                                    <p className="section-label">{metric.label}</p>
                                    <p className="bilingual-note mt-1">{metric.malayLabel}</p>
                                </div>
                                <span className="rounded-full bg-ink/5 px-2 py-1 text-[10px] font-bold text-ink/50">{isCount ? 'NEXT' : 'LIVE'}</span>
                            </div>
                            <div className="metric-value">{metric.value}{metric.suffix}</div>
                            <div className="metric-track"><div className={`metric-fill ${metric.tone === 'saffron' ? 'saffron' : metric.tone === 'striped' ? 'striped' : metric.tone === 'outline' ? 'outline' : ''}`} style={{ width: `${isCount ? Math.min(metric.value * 30, 100) : metric.value}%` }} /></div>
                        </article>
                    );
                })}
            </section>

            <section className="dashboard-grid">
                <div className="profile-area">
                    <article className="premium-card profile-card">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                            <span>Patient profile</span>
                            <ShieldCheck className="h-4 w-4 text-saffron" />
                        </div>
                        <div className="profile-avatar" aria-label="Local safe avatar placeholder">{initials}</div>
                        <h2 className="profile-name">{user?.name || 'MediSync patient'}</h2>
                        <p className="profile-role">{user?.role || 'Patient'} · Blood type {user?.blood_type || 'O+'}</p>
                        <span className="profile-chip">ICE ready</span>
                    </article>

                    <article className="premium-card accordion-card">
                        <AccordionRow id="medical" title="Medical profile · Profil perubatan" open={openAccordion === 'medical'} onToggle={toggleAccordion}>
                            <div className="flex flex-wrap gap-2">
                                {emergencySummary.conditions?.map((condition) => <span key={condition} className="rounded-full bg-ink/6 px-2.5 py-1 text-[10px] font-semibold text-ink/65">{condition}</span>)}
                            </div>
                        </AccordionRow>
                        <AccordionRow id="medications" title="Medications · Ubat harian" open={openAccordion === 'medications'} onToggle={toggleAccordion}>
                            {firstMedication && (
                                <div className="medication-mini-row">
                                    <span className="mini-icon"><Pill className="h-3.5 w-3.5" /></span>
                                    <span><strong className="font-semibold text-ink">{firstMedication.name}</strong><br />{firstMedication.dosage} · {firstMedication.timing}</span>
                                </div>
                            )}
                            <Link href="/medications" className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-ink underline decoration-saffron decoration-2 underline-offset-4">Manage all medication <ArrowUpRight className="h-3 w-3" /></Link>
                        </AccordionRow>
                        <AccordionRow id="care" title="Care summary · Ringkasan penjagaan" open={openAccordion === 'care'} onToggle={toggleAccordion}>
                            {upcomingAppointments[0] ? `${upcomingAppointments[0].title || upcomingAppointments[0].doctor} is next on ${upcomingAppointments[0].date} at ${upcomingAppointments[0].time}.` : 'No upcoming appointments recorded.'}
                        </AccordionRow>
                        <AccordionRow id="emergency" title="Emergency readiness · Kesediaan kecemasan" open={openAccordion === 'emergency'} onToggle={toggleAccordion}>
                            <span className="font-semibold text-ink">{emergencySummary.allergies?.length || 0} recorded allergies</span> · Primary ICE contact: {emergencySummary.primaryICE || 'Not set'}
                        </AccordionRow>
                    </article>
                </div>

                <div className="space-y-3">
                    <article className="premium-card chart-card">
                        <div className="card-header-row">
                            <div>
                                <p className="section-label">Progress · Kemajuan</p>
                                <h2 className="section-title mt-1">Weekly medication activity</h2>
                            </div>
                            <button type="button" className="round-arrow" aria-label="Open care activity details"><ArrowUpRight className="h-4 w-4" /></button>
                        </div>
                        <div className="chart-summary"><strong>{activePoint.label}</strong><span>Medication logs on {activePoint.day}</span></div>
                        <div className="bar-chart" role="img" aria-label="Interactive weekly care activity chart">
                            {summary.weeklyActivity.map((point, index) => (
                                <div key={point.day} className={`bar-column ${activeChartPoint === index ? 'active' : ''}`}>
                                    <div className="bar-shell">
                                        <span className="bar-tooltip">{point.label}</span>
                                        <button type="button" aria-label={`${point.day}: ${point.label}`} onMouseEnter={() => setActiveChartPoint(index)} onFocus={() => setActiveChartPoint(index)} onClick={() => setActiveChartPoint(index)} style={{ height: `${Math.max(point.value, 8)}%` }} />
                                    </div>
                                    <span className="bar-label">{point.day}</span>
                                </div>
                            ))}
                        </div>
                    </article>

                    <article className="premium-card timer-card">
                        <div className="card-header-row">
                            <div><p className="section-label">Care focus · Fokus penjagaan</p><h2 className="section-title mt-1">Daily focus timer</h2></div>
                            <TimerReset className="h-5 w-5 text-ink/35" />
                        </div>
                        <div className="timer-wrap">
                            <div className="timer-ring" style={{ '--timer-progress': timerProgress }}>
                                <div className="timer-content"><strong>{formatDuration(timerSeconds)}</strong><span>{timerRunning ? 'Running now' : 'Work time'}</span></div>
                            </div>
                        </div>
                        <div className="timer-controls">
                            <button type="button" className="control-button primary" onClick={() => setTimerRunning((running) => !running)} aria-label={timerRunning ? 'Pause timer' : 'Start timer'}>{timerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}</button>
                            <button type="button" className="control-button" onClick={resetTimer} aria-label="Reset timer"><RotateCcw className="h-4 w-4" /></button>
                        </div>
                    </article>
                </div>

                <div className="side-stack">
                    <article className="premium-card health-counter-card">
                        <div className="mb-2 flex items-center justify-between"><p className="section-label">Live totals · Jumlah semasa</p><Activity className="h-4 w-4 text-ink/35" /></div>
                        <div className="health-counter"><span className="counter-icon"><Pill className="h-4 w-4" /></span><div><div className="counter-value">{medsState.length}</div><div className="counter-label">Active medications · Ubat aktif</div></div></div>
                        <div className="health-counter"><span className="counter-icon"><CalendarDays className="h-4 w-4" /></span><div><div className="counter-value">{upcomingAppointments.length}</div><div className="counter-label">Appointments · Temujanji</div></div></div>
                        <div className="health-counter"><span className="counter-icon"><Users className="h-4 w-4" /></span><div><div className="counter-value">{connectedCaregivers}</div><div className="counter-label">Caregivers connected · Penjaga</div></div></div>
                    </article>

                    <article className="premium-card checklist-card">
                        <div className="flex items-start justify-between gap-4"><div><p className="section-label">Care checklist · Senarai penjagaan</p><h2 className="section-title mt-1">Ready together</h2></div><div className="checklist-count">{completedChecklist}/{checklist.length}</div></div>
                        <div className="checklist-progress"><span style={{ width: `${checklistProgress}%` }} /></div>
                        <div>{checklist.map((item) => <button type="button" key={item.id} className={`checklist-item ${item.completed ? 'completed' : ''}`} onClick={() => toggleChecklistItem(item.id)} aria-pressed={item.completed}><span className={`check-circle ${item.completed ? 'completed' : ''}`}>{item.completed ? <Check className="h-3.5 w-3.5" /> : null}</span><span className="checklist-copy"><span>{item.title}</span><small>{item.malayTitle}</small></span></button>)}</div>
                    </article>
                </div>
            </section>

            <section className="premium-card calendar-card" aria-label="Care calendar">
                <div className="calendar-toolbar">
                    <div><p className="section-label">Care calendar · Kalendar penjagaan</p><h2 className="section-title mt-1">{monthLabel}</h2></div>
                    <div className="calendar-nav"><button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></button><button type="button" onClick={() => changeMonth(1)} aria-label="Next month"><ChevronRight className="h-4 w-4" /></button></div>
                </div>
                <div className="calendar-grid">
                    {calendarDays.map((date) => {
                        const events = eventsForDate(date);
                        const inMonth = date.getMonth() === calendarDate.getMonth();
                        const isToday = date.toDateString() === new Date().toDateString();
                        return <div key={date.toISOString()} className={`calendar-day ${isToday ? 'is-today' : ''} ${!inMonth ? 'opacity-35' : ''}`}><div className="calendar-day-head"><span>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span><span className="calendar-day-number">{date.getDate()}</span></div>{events.map((event) => <button type="button" key={event.id} className={`calendar-event ${event.tone === 'charcoal' ? 'charcoal' : ''}`} onClick={() => setSelectedEvent(event)}>{event.time} · {event.title}</button>)}</div>;
                    })}
                </div>
                <div className="calendar-selection" aria-live="polite">{selectedEvent ? <><strong className="text-ink">{selectedEvent.title}</strong> · {selectedEvent.time} · {selectedEvent.detail}<br /><span>{selectedEvent.malayTitle}</span></> : 'Select an event to see care details.'}</div>
            </section>

            <section className="mt-3 grid gap-3 sm:grid-cols-3">
                <Link href="/medications" className="premium-card premium-card-hover flex items-center justify-between p-4"><span><span className="section-label">Medication hub</span><strong className="mt-1 block text-sm font-semibold">Manage reminders</strong></span><Pill className="h-5 w-5 text-ink/35" /></Link>
                <Link href="/symptom-summariser" className="premium-card premium-card-hover flex items-center justify-between p-4"><span><span className="section-label">Doctor prep</span><strong className="mt-1 block text-sm font-semibold">Summarise symptoms</strong></span><FileHeart className="h-5 w-5 text-ink/35" /></Link>
                <Link href="/ice" className="premium-card premium-card-hover flex items-center justify-between p-4"><span><span className="section-label">Safety profile</span><strong className="mt-1 block text-sm font-semibold">Open ICE profile</strong></span><ShieldCheck className="h-5 w-5 text-ink/35" /></Link>
            </section>
        </AppLayout>
    );
}

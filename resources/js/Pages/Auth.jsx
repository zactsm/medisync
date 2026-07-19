import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { 
    User, 
    Users, 
    ArrowRight, 
    Heart, 
    AlertCircle, 
    Mail, 
    KeyRound, 
    RefreshCw, 
    CheckCircle2, 
    Info 
} from 'lucide-react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { useLanguage } from '../lib/language';

const localTranslations = {
    en: {
        loginTab: "Log In",
        registerTab: "Register",
        bypassTab: "Quick Access",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        nameLabel: "Full Name",
        roleLabel: "Account Type",
        patientRole: "Patient",
        caregiverRole: "Caregiver",
        loginButton: "Log In",
        registerButton: "Create Account",
        loggingIn: "Logging in...",
        signingUp: "Creating account...",
        errorBypass: "Failed to log in. Please try again.",
        noUsers: "No users found",
        noUsersDesc: "Database is empty. Please run database migrations and seeders.",
        brandSub: "Smart Family Health Management System",
        successRegister: "Account created! A verification link has been sent to your email. Please check your inbox and verify your email to log in.",
        unverifiedAlert: "Your email is not verified yet. Please check your inbox or click below to resend the verification link.",
        resendLink: "Resend verification email",
        resending: "Resending...",
        resendSuccess: "Verification email resent successfully! Please check your inbox.",
        supabaseNotConfigured: "Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable credentials login/registration.",
        bypassHint: "Select a profile from the list below to instantly log in for testing.",
        quickAccessTitle: "Quick Access Login",
        patientsLabel: "Patients",
        caregiversLabel: "Caregivers"
    },
    ms: {
        loginTab: "Log Masuk",
        registerTab: "Daftar",
        bypassTab: "Akses Pantas",
        emailLabel: "Alamat E-mel",
        passwordLabel: "Kata Laluan",
        nameLabel: "Nama Penuh",
        roleLabel: "Jenis Akaun",
        patientRole: "Pesakit",
        caregiverRole: "Penjaga",
        loginButton: "Log Masuk",
        registerButton: "Daftar Akaun",
        loggingIn: "Sedang log masuk...",
        signingUp: "Sedang mendaftar...",
        errorBypass: "Gagal log masuk. Sila cuba lagi.",
        noUsers: "Tiada Pengguna Ditemui",
        noUsersDesc: "Database anda kosong. Sila jalankan migration dan seeder database anda.",
        brandSub: "Sistem Pengurusan Kesihatan Pintar Keluarga",
        successRegister: "Akaun berjaya didaftarkan! Pautan pengesahan telah dihantar ke e-mel anda. Sila sahkan e-mel anda untuk log masuk.",
        unverifiedAlert: "E-mel anda belum disahkan lagi. Sila semak peti masuk e-mel anda atau klik di bawah untuk menghantar semula pautan pengesahan.",
        resendLink: "Hantar semula e-mel pengesahan",
        resending: "Menghantar semula...",
        resendSuccess: "E-mel pengesahan telah dihantar semula! Sila semak peti masuk anda.",
        supabaseNotConfigured: "Supabase tidak dikonfigurasikan. Sila tetapkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY dalam fail .env anda untuk mendayakan log masuk/daftar kelayakan.",
        bypassHint: "Pilih profil dari senarai di bawah untuk log masuk ke sistem MediSync anda.",
        quickAccessTitle: "Log Masuk Pantas",
        patientsLabel: "Pesakit",
        caregiversLabel: "Penjaga"
    }
};

export default function Auth({ patients = [], caregivers = [] }) {
    const { language } = useLanguage();
    const localT = localTranslations[language] || localTranslations.en;

    const [activeTab, setActiveTab] = useState('login'); // 'login', 'register', 'bypass'
    const [bypassTab, setBypassTab] = useState('patient'); // 'patient' or 'caregiver' for Quick Access
    
    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('patient'); // 'patient' or 'caregiver'

    // Status states
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [unverified, setUnverified] = useState(false);
    const [resendStatus, setResendStatus] = useState('');

    const syncSessionWithLaravel = async (session) => {
        const response = await fetch('/auth/sync', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
            },
            body: JSON.stringify({ access_token: session.access_token })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Gagal menyelaraskan sesi dengan pelayan.');
        }
        return data;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password || busy) return;
        setBusy(true);
        setError('');
        setSuccessMessage('');
        setUnverified(false);
        setResendStatus('');
        try {
            if (!supabase) {
                setError(localT.supabaseNotConfigured);
                return;
            }
            const { data, error: sbError } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password
            });
            if (sbError) {
                if (
                    sbError.message?.toLowerCase().includes('confirm') || 
                    sbError.message?.toLowerCase().includes('verified') || 
                    (sbError.status === 400 && sbError.message?.toLowerCase().includes('confirm'))
                ) {
                    setUnverified(true);
                    setError(localT.unverifiedAlert);
                } else {
                    setError(sbError.message);
                }
                return;
            }
            // Sync with Laravel session
            await syncSessionWithLaravel(data.session);
            window.location.replace('/');
        } catch (err) {
            setError(err.message || 'Ralat rangkaian. Sila cuba lagi.');
        } finally {
            setBusy(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name || !email || !password || busy) return;
        setBusy(true);
        setError('');
        setSuccessMessage('');
        setUnverified(false);
        try {
            if (!supabase) {
                setError(localT.supabaseNotConfigured);
                return;
            }
            const { data, error: sbError } = await supabase.auth.signUp({
                email: email.trim().toLowerCase(),
                password,
                options: {
                    data: {
                        full_name: name.trim(),
                        role: role
                    }
                }
            });
            if (sbError) {
                setError(sbError.message);
                return;
            }
            if (!data.session) {
                setSuccessMessage(localT.successRegister);
                setName('');
                setEmail('');
                setPassword('');
            } else {
                await syncSessionWithLaravel(data.session);
                window.location.replace('/');
            }
        } catch (err) {
            setError(err.message || 'Ralat rangkaian. Sila cuba lagi.');
        } finally {
            setBusy(false);
        }
    };

    const handleResendVerification = async () => {
        if (!email || busy) return;
        setBusy(true);
        setResendStatus(localT.resending);
        try {
            const { error: sbError } = await supabase.auth.resend({
                type: 'signup',
                email: email.trim().toLowerCase()
            });
            if (sbError) {
                setError(sbError.message);
                setResendStatus('');
            } else {
                setResendStatus(localT.resendSuccess);
            }
        } catch (err) {
            setError(err.message || 'Gagal menghantar semula e-mel pengesahan.');
            setResendStatus('');
        } finally {
            setBusy(false);
        }
    };

    const handleBypass = async (bypassEmail) => {
        setBusy(true);
        setError('');
        setSuccessMessage('');
        setUnverified(false);
        try {
            const response = await fetch('/auth/bypass', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                },
                body: JSON.stringify({ email: bypassEmail })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.message || localT.errorBypass);
            } else {
                window.location.replace(data.redirect || '/');
            }
        } catch (err) {
            setError('Ralat rangkaian. Sila pastikan sambungan internet dan database anda aktif.');
        } finally {
            setBusy(false);
        }
    };

    const selectedBypassUsers = bypassTab === 'patient' ? patients : caregivers;

    return (
        <>
            <Head title={`Log Masuk / Daftar - MediSync`} />
            <main className="min-h-screen bg-canvas flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
                {/* Visual Background Elements - Saffron Glowing Accents */}
                <div className="absolute top-[-10%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-saffron/12 blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-15%] left-[-15%] w-[40rem] h-[40rem] rounded-full bg-saffron/8 blur-3xl pointer-events-none" />

                <div className="w-full max-w-xl glass-card rounded-3xl p-6 md:p-10 shadow-2xl border border-ink/8 bg-surface/85 backdrop-blur-xl relative z-10 my-8">
                    {/* Header Brand */}
                    <div className="text-center mb-6 md:mb-8 flex flex-col items-center">
                        <div className="flex items-center gap-2.5 mb-2">
                            <span className="inline-flex items-center justify-center w-10 h-10 text-slate-950 bg-saffron rounded-xl shadow-lg shadow-yellow-500/30">
                                <Heart className="w-5 h-5 fill-slate-950" />
                            </span>
                            <span className="text-2xl font-black text-ink tracking-tight font-heading">
                                Medi<span className="text-yellow-600">Sync</span>
                            </span>
                        </div>
                        <p className="text-[10px] md:text-xs text-ink/50 font-bold tracking-wide mt-1 uppercase">
                            {localT.brandSub}
                        </p>
                        <div className="w-12 h-1 bg-saffron mx-auto mt-4 rounded-full shadow-sm" />
                    </div>

                    {/* Tab Selector */}
                    <div className="flex border-b border-ink/8 mb-6 gap-1 md:gap-2">
                        <button
                            type="button"
                            onClick={() => { setActiveTab('login'); setError(''); setSuccessMessage(''); }}
                            className={`flex-1 pb-3 text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                activeTab === 'login' 
                                    ? 'text-yellow-600 font-extrabold border-b-2 border-yellow-500' 
                                    : 'text-ink/50 hover:text-ink/80'
                            }`}
                        >
                            <KeyRound className="w-4 h-4" />
                            <span>{localT.loginTab}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('register'); setError(''); setSuccessMessage(''); }}
                            className={`flex-1 pb-3 text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                activeTab === 'register' 
                                    ? 'text-yellow-600 font-extrabold border-b-2 border-yellow-500' 
                                    : 'text-ink/50 hover:text-ink/80'
                            }`}
                        >
                            <User className="w-4 h-4" />
                            <span>{localT.registerTab}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('bypass'); setError(''); setSuccessMessage(''); }}
                            className={`flex-1 pb-3 text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                activeTab === 'bypass' 
                                    ? 'text-yellow-600 font-extrabold border-b-2 border-yellow-500' 
                                    : 'text-ink/50 hover:text-ink/80'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            <span>{localT.bypassTab}</span>
                        </button>
                    </div>

                    {/* Supabase Not Configured Warning */}
                    {!supabaseConfigured && activeTab !== 'bypass' && (
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 font-medium mb-6 flex items-start gap-2.5">
                            <Info className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{localT.supabaseNotConfigured}</span>
                        </div>
                    )}

                    {/* Error Alerts */}
                    {error && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-bold mb-6 flex items-start gap-2.5">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <div>{error}</div>
                                {unverified && (
                                    <div className="mt-2.5">
                                        <button
                                            type="button"
                                            disabled={busy}
                                            onClick={handleResendVerification}
                                            className="text-yellow-600 hover:text-yellow-700 underline font-extrabold flex items-center gap-1.5 cursor-pointer"
                                        >
                                            {busy && resendStatus === localT.resending ? (
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                            ) : null}
                                            {localT.resendLink}
                                        </button>
                                        {resendStatus && resendStatus !== localT.resending && (
                                            <p className="text-emerald-600 font-medium mt-1">{resendStatus}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Success Alerts */}
                    {successMessage && (
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 font-bold mb-6 flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                            <div className="flex-1">{successMessage}</div>
                        </div>
                    )}

                    {/* Log In Form */}
                    {activeTab === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                                    {localT.emailLabel}
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                                        <Mail className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="email"
                                        required
                                        disabled={!supabaseConfigured || busy}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-ink/10 bg-canvas/30 text-ink focus:border-yellow-500 outline-none text-sm transition-all focus:bg-canvas/50 disabled:opacity-50"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                                    {localT.passwordLabel}
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                                        <KeyRound className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="password"
                                        required
                                        disabled={!supabaseConfigured || busy}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-ink/10 bg-canvas/30 text-ink focus:border-yellow-500 outline-none text-sm transition-all focus:bg-canvas/50 disabled:opacity-50"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!supabaseConfigured || busy}
                                className="w-full py-3.5 rounded-xl bg-saffron text-slate-950 font-bold hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
                            >
                                {busy ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>{localT.loggingIn}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{localT.loginButton}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Register Form */}
                    {activeTab === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                                    {localT.nameLabel}
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                                        <User className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        disabled={!supabaseConfigured || busy}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-ink/10 bg-canvas/30 text-ink focus:border-yellow-500 outline-none text-sm transition-all focus:bg-canvas/50 disabled:opacity-50"
                                        placeholder="Ali Bin Ahmad"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                                    {localT.emailLabel}
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                                        <Mail className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="email"
                                        required
                                        disabled={!supabaseConfigured || busy}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-ink/10 bg-canvas/30 text-ink focus:border-yellow-500 outline-none text-sm transition-all focus:bg-canvas/50 disabled:opacity-50"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                                    {localT.passwordLabel}
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                                        <KeyRound className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="password"
                                        required
                                        disabled={!supabaseConfigured || busy}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-ink/10 bg-canvas/30 text-ink focus:border-yellow-500 outline-none text-sm transition-all focus:bg-canvas/50 disabled:opacity-50"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                                    {localT.roleLabel}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        disabled={!supabaseConfigured || busy}
                                        onClick={() => setRole('patient')}
                                        className={`py-2.5 rounded-xl border font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-all ${
                                            role === 'patient'
                                                ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/40 shadow-sm'
                                                : 'border-ink/10 text-ink/60 hover:text-ink/80 hover:bg-canvas/10'
                                        }`}
                                    >
                                        <Heart className={`w-3.5 h-3.5 ${role === 'patient' ? 'fill-yellow-600' : ''}`} />
                                        <span>{localT.patientRole}</span>
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!supabaseConfigured || busy}
                                        onClick={() => setRole('caregiver')}
                                        className={`py-2.5 rounded-xl border font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-all ${
                                            role === 'caregiver'
                                                ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/40 shadow-sm'
                                                : 'border-ink/10 text-ink/60 hover:text-ink/80 hover:bg-canvas/10'
                                        }`}
                                    >
                                        <Users className="w-3.5 h-3.5" />
                                        <span>{localT.caregiverRole}</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!supabaseConfigured || busy}
                                className="w-full py-3.5 rounded-xl bg-saffron text-slate-950 font-bold hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
                            >
                                {busy ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>{localT.signingUp}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{localT.registerButton}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Quick Access (Bypass List) */}
                    {activeTab === 'bypass' && (
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <h3 className="text-sm font-bold text-ink">{localT.quickAccessTitle}</h3>
                                <p className="text-xs text-ink/50 mt-1">{localT.bypassHint}</p>
                            </div>

                            <div className="flex border-b border-ink/8 mb-4 gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setBypassTab('patient'); setError(''); }}
                                    className={`flex-1 pb-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                        bypassTab === 'patient' 
                                            ? 'text-yellow-600 font-extrabold border-b-2 border-yellow-500' 
                                            : 'text-ink/50 hover:text-ink/80'
                                    }`}
                                >
                                    <Heart className={`w-3.5 h-3.5 ${bypassTab === 'patient' ? 'fill-yellow-600' : ''}`} />
                                    <span>{localT.patientsLabel} ({patients.length})</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setBypassTab('caregiver'); setError(''); }}
                                    className={`flex-1 pb-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                        bypassTab === 'caregiver' 
                                            ? 'text-yellow-600 font-extrabold border-b-2 border-yellow-500' 
                                            : 'text-ink/50 hover:text-ink/80'
                                    }`}
                                >
                                    <Users className="w-3.5 h-3.5" />
                                    <span>{localT.caregiversLabel} ({caregivers.length})</span>
                                </button>
                            </div>

                            {selectedBypassUsers.length > 0 ? (
                                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                                    {selectedBypassUsers.map((u) => (
                                        <button
                                            key={u.id}
                                            disabled={busy}
                                            onClick={() => handleBypass(u.email)}
                                            className="w-full text-left p-3.5 rounded-xl bg-surface/50 dark:bg-canvas/50 border border-ink/8 hover:border-yellow-500 hover:shadow-md hover:shadow-yellow-500/5 transition-all duration-200 group flex items-center justify-between cursor-pointer disabled:opacity-50"
                                        >
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-yellow-500/10 text-yellow-600 group-hover:bg-saffron group-hover:text-slate-950 transition-colors shadow-sm">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-extrabold text-ink truncate group-hover:text-yellow-600 transition-colors">
                                                        {u.name}
                                                    </h4>
                                                    <p className="text-[10px] text-ink/50 truncate font-mono mt-0.5">
                                                        {u.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center shrink-0 text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 px-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/15">
                                    <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                    <h3 className="text-xs font-bold text-ink mb-1">{localT.noUsers}</h3>
                                    <p className="text-[11px] text-ink/75 max-w-md mx-auto leading-relaxed">
                                        {localT.noUsersDesc}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center text-[10px] text-ink/40 font-bold tracking-widest mt-8 border-t border-ink/8 pt-4">
                        MediSync • Pilihan Pintar Penjagaan Kesihatan
                    </div>
                </div>
            </main>
        </>
    );
}

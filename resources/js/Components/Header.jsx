import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { supabase } from '../lib/supabase';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '../lib/language';
import {
    Bell,
    ChevronDown,
    PanelLeftClose,
    PanelLeftOpen,
    Copy,
    Check,
    Plus,
    Trash2,
    AlertCircle,
    RefreshCw,
} from 'lucide-react';
import Modal from './Modal';

export default function Header({ user, sidebarCollapsed, onToggleSidebar, onOpenSidebar }) {
    const { props } = usePage();
    const notifications = props.notifications || [];
    const { language, t } = useLanguage();
    const [activePanel, setActivePanel] = useState(null);
    const [isSigningOut, setIsSigningOut] = useState(false);

    // Edit Profile States
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profileError, setProfileError] = useState('');

    const [profileName, setProfileName] = useState('');
    const [bloodType, setBloodType] = useState('O+');
    const [organDonor, setOrganDonor] = useState(false);
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [allergies, setAllergies] = useState([]);
    const [copiedField, setCopiedField] = useState(null);

    const openEditProfile = async () => {
        setIsEditProfileOpen(true);
        setLoadingProfile(true);
        setProfileError('');
        try {
            const response = await fetch('/api/medical-profile', {
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) throw new Error('Gagal memuatkan profil perubatan.');
            const data = await response.json();
            
            setProfileName(user?.name || '');
            setBloodType(user?.blood_type || 'O+');
            setOrganDonor(user?.organ_donor || false);
            setWeight(data.weight_kg || '');
            setHeight(data.height_cm || '');
            setAllergies(data.allergies || []);
        } catch (err) {
            setProfileError(err.message || 'Ralat memuatkan profil.');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setProfileError('');
        try {
            const response = await fetch('/api/medical-profile', {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                },
                body: JSON.stringify({
                    name: profileName,
                    blood_type: bloodType,
                    organ_donor: organDonor,
                    weight_kg: weight ? parseInt(weight) : null,
                    height_cm: height ? parseInt(height) : null,
                    allergies: allergies
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Gagal menyimpan profil.');
            }

            router.reload({
                onSuccess: () => {
                    setIsEditProfileOpen(false);
                }
            });
        } catch (err) {
            setProfileError(err.message || 'Ralat semasa menyimpan profil.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddAllergy = () => {
        setAllergies([...allergies, { allergen: '', severity: 'Moderate', reaction: '' }]);
    };

    const handleUpdateAllergy = (index, field, value) => {
        const updated = [...allergies];
        updated[index] = { ...updated[index], [field]: value };
        setAllergies(updated);
    };

    const handleRemoveAllergy = (index) => {
        setAllergies(allergies.filter((_, i) => i !== index));
    };

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };
    const initials = (user?.name || 'MediSync')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    const togglePanel = (panel) => setActivePanel((current) => current === panel ? null : panel);

    const handleSidebarControl = () => {
        if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
            onOpenSidebar?.();
            return;
        }

        onToggleSidebar?.();
    };

    const handleSignOut = async () => {
        if (isSigningOut) return;

        setIsSigningOut(true);
        try {
            await supabase?.auth.signOut();
            const response = await fetch('/logout', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
            });

            if (!response.ok) throw new Error(`Logout failed with status ${response.status}`);
            window.location.href = '/login';
        } catch (error) {
            console.error('Sign out failed:', error);
            setIsSigningOut(false);
        }
    };

    return (
        <header className="premium-header sticky top-0 z-30 border-b border-ink/8 bg-canvas/85 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
            <div className="header-inner mx-auto flex min-h-[72px] w-full max-w-[1540px] items-center gap-3">
                <button
                    type="button"
                    className="sidebar-toggle-button"
                    onClick={handleSidebarControl}
                    aria-label={sidebarCollapsed ? t('header.expandSidebar') : t('header.collapseSidebar')}
                    aria-expanded={!sidebarCollapsed}
                    title={sidebarCollapsed ? t('header.expandSidebar') : t('header.collapseSidebar')}
                >
                    {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </button>

                <div className="ml-auto flex items-center gap-2">
                    <LanguageSelector />
                    <ThemeToggle />

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => togglePanel('notifications')}
                            className="icon-button"
                            aria-label={t('header.notifications')}
                            aria-expanded={activePanel === 'notifications'}
                        >
                            <Bell className="h-4 w-4" />
                            {notifications.some((item) => !item.read) && <span className="notification-dot" />}
                        </button>
                        {activePanel === 'notifications' && (
                            <div className="utility-popover right-0 w-72">
                                <p className="popover-kicker">{t('header.notifications')}</p>
                                {notifications.length ? notifications.map((item) => <div key={item.id} className="border-b border-ink/10 py-2 last:border-0"><p className="text-sm font-semibold text-ink">{item.title}</p><p className="mt-1 text-xs leading-5 text-ink/55">{item.body}</p><p className="mt-1 text-[10px] text-ink/40">{item.createdAt}</p></div>) : <p className="text-sm text-ink/55">{t('header.noNotifications')}</p>}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => togglePanel('profile')}
                            className="profile-button"
                            aria-label={t('header.profile')}
                            aria-expanded={activePanel === 'profile'}
                        >
                            <span className="avatar avatar-small">{initials}</span>
                            <ChevronDown className="hidden h-3.5 w-3.5 text-ink/50 sm:block" />
                        </button>
                        {activePanel === 'profile' && (
                            <div className="utility-popover right-0 w-60">
                                <p className="popover-kicker">{t('header.profile')}</p>
                                <p className="text-sm font-semibold text-ink">{user?.name || 'MediSync patient'}</p>
                                <p className="mt-1 text-xs text-ink/55">{user?.role || 'Patient'} · {user?.blood_type || 'O+'}</p>
                                <Link href="/ice" className="popover-action mt-4">{t('header.viewEmergency')} <span>→</span></Link>
                                <button
                                    type="button"
                                    onClick={() => { setActivePanel(null); openEditProfile(); }}
                                    className="popover-action text-left mt-2 w-full cursor-pointer flex items-center justify-between"
                                >
                                    <span>{language === 'ms' ? 'Kemaskini Profil' : 'Edit Profile'}</span>
                                    <span>→</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="profile-menu-action profile-signout"
                                    disabled={isSigningOut}
                                    aria-busy={isSigningOut}
                                >
                                    {isSigningOut ? t('header.signingOut') : t('header.signOut')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} title={language === 'ms' ? 'Kemaskini Profil' : 'Edit Profile'}>
                {loadingProfile ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mb-3" />
                        <p className="text-xs text-slate-400">{language === 'ms' ? 'Memuatkan maklumat profil...' : 'Loading profile details...'}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSaveProfile} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                        {profileError && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{profileError}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ms' ? 'Nama Penuh' : 'Full Name'}</label>
                                <input
                                    type="text"
                                    required
                                    value={profileName}
                                    onChange={e => setProfileName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ms' ? 'Alamat E-mel (Hanya Baca)' : 'Email Address (Read Only)'}</label>
                                <input
                                    type="email"
                                    readOnly
                                    value={user?.email || ''}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-xs focus:outline-none cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ms' ? 'Kumpulan Darah' : 'Blood Group'}</label>
                                <select
                                    value={bloodType}
                                    onChange={e => setBloodType(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                                >
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                        <option key={group} value={group}>{group}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ms' ? 'Penderma Organ' : 'Organ Donor Status'}</label>
                                <select
                                    value={organDonor ? 'true' : 'false'}
                                    onChange={e => setOrganDonor(e.target.value === 'true')}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                                >
                                    <option value="true">{language === 'ms' ? 'Ya (Berikrar)' : 'Yes (Pledged)'}</option>
                                    <option value="false">{language === 'ms' ? 'Tidak' : 'No'}</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ms' ? 'Berat (kg)' : 'Weight (kg)'}</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="500"
                                    value={weight}
                                    onChange={e => setWeight(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ms' ? 'Tinggi (cm)' : 'Height (cm)'}</label>
                                <input
                                    type="number"
                                    min="30"
                                    max="250"
                                    value={height}
                                    onChange={e => setHeight(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                                />
                            </div>
                        </div>

                        {/* Strict Allergies Section */}
                        <div className="border-t border-slate-800 pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-semibold text-rose-400">{language === 'ms' ? 'Senarai Alahan Ketat' : 'Strict Allergies List'}</label>
                                <button
                                    type="button"
                                    onClick={handleAddAllergy}
                                    className="px-2.5 py-1 rounded bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                    <Plus className="w-3 h-3" /> {language === 'ms' ? 'Tambah Alahan' : 'Add Allergy'}
                                </button>
                            </div>
                            <div className="space-y-2">
                                {allergies.map((all, i) => (
                                    <div key={i} className="flex gap-2 items-center bg-slate-900/50 p-2 rounded-xl border border-slate-800">
                                        <input
                                            type="text"
                                            required
                                            placeholder={language === 'ms' ? 'Nama Alahan (cth: Penisilin)' : 'Allergen Name (e.g. Penicillin)'}
                                            value={all.allergen || ''}
                                            onChange={e => handleUpdateAllergy(i, 'allergen', e.target.value)}
                                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                                        />
                                        <select
                                            value={all.severity || 'Moderate'}
                                            onChange={e => handleUpdateAllergy(i, 'severity', e.target.value)}
                                            className="w-24 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                                        >
                                            <option value="Low">{language === 'ms' ? 'Rendah' : 'Low'}</option>
                                            <option value="Moderate">{language === 'ms' ? 'Sederhana' : 'Moderate'}</option>
                                            <option value="Severe">{language === 'ms' ? 'Teruk' : 'Severe'}</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAllergy(i)}
                                            className="p-1.5 rounded text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                            title="Padam"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Connection Code and Emergency Link Section */}
                        <div className="border-t border-slate-800 pt-4 space-y-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ms' ? 'Kod Sambungan Keluarga' : 'Family Connection Code'}</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={user?.caregiver_sync_code || ''}
                                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-teal-400 font-mono text-xs focus:outline-none select-all font-bold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(user?.caregiver_sync_code || '', 'connectionCode')}
                                        className="px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                                    >
                                        {copiedField === 'connectionCode' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                        <span>{copiedField === 'connectionCode' ? (language === 'ms' ? 'Disalin' : 'Copied') : (language === 'ms' ? 'Salin' : 'Copy')}</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ms' ? 'Pautan Pantas Kecemasan (Lockscreen Awam)' : 'Emergency Quick Link (Public Lockscreen)'}</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={window.location.origin + '/ice/public/' + (user?.ice_code || '')}
                                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-rose-400 font-mono text-[10px] md:text-xs focus:outline-none select-all font-bold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(window.location.origin + '/ice/public/' + (user?.ice_code || ''), 'quickLink')}
                                        className="px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                                    >
                                        {copiedField === 'quickLink' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                        <span>{copiedField === 'quickLink' ? (language === 'ms' ? 'Disalin' : 'Copied') : (language === 'ms' ? 'Salin' : 'Copy')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Form Action Buttons */}
                        <div className="modal-actions pt-3 border-t border-slate-700 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsEditProfileOpen(false)}
                                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                            >
                                {language === 'ms' ? 'Batal' : 'Cancel'}
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-teal-500/50 disabled:text-slate-700 text-slate-950 font-extrabold text-xs shadow-md flex items-center gap-1.5"
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        <span>{language === 'ms' ? 'Menyimpan...' : 'Saving...'}</span>
                                    </>
                                ) : (
                                    <span>{language === 'ms' ? 'Simpan Profil' : 'Save Profile'}</span>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </header>
    );
}

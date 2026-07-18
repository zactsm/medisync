import React, { useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Badge from '../Components/Badge';
import Modal from '../Components/Modal';
import {
    FileText,
    Upload,
    Search,
    Shield,
    Download,
    Eye,
    Tag,
    Lock,
    FileCheck,
    Plus
} from 'lucide-react';

export default function DocumentVault({ user, documents: initialDocuments }) {
    const [docs, setDocs] = useState(initialDocuments);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [previewDoc, setPreviewDoc] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [newDoc, setNewDoc] = useState({
        title: '',
        category: 'Insurance',
        notes: ''
    });
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const categories = ['All', 'Insurance', 'Lab Results', 'Discharge Summary', 'Prescription'];

    const filteredDocs = docs.filter(doc => {
        const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.notes?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newDoc.title || !file) {
            alert('Sila isi tajuk dan pilih fail / Please fill in title and select a file.');
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('title', newDoc.title);
            formData.append('category', newDoc.category);
            formData.append('file', file);
            formData.append('notes', newDoc.notes);

            const response = await fetch('/api/documents', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                alert('Gagal muat naik: ' + (errData.message || response.statusText));
                return;
            }

            const created = await response.json();
            const docPayload = {
                id: created.id,
                title: created.title,
                category: created.category,
                type: created.mime_type || 'PDF Document',
                uploadedDate: 'Hari Ini',
                size: (created.size ? (created.size / (1024 * 1024)).toFixed(1) + ' MB' : '1.2 MB'),
                tags: [created.category, 'MediSync Vault'],
                notes: created.notes || 'Dokumen dimuat naik ke storan terjamin.',
                path: created.path,
            };

            setDocs([docPayload, ...docs]);
            setIsUploadModalOpen(false);
            setNewDoc({ title: '', category: 'Insurance', notes: '' });
            setFile(null);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Ralat semasa memuat naik fail.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <AppLayout user={user}>
            <Head title="Vault Dokumen & Insurans" />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-2">
                        <FileText className="w-7 h-7 text-teal-400" />
                        Vault Dokumen Perubatan & Insurans
                    </h1>
                    <p className="text-xs text-slate-400">Storan selamat bagi kad perubatan, laporan makmal, dan rekod hospital.</p>
                </div>

                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all self-start sm:self-auto"
                >
                    <Upload className="w-4 h-4" />
                    Muat Naik Dokumen
                </button>
            </div>

            {/* Security Encrypted Indicator Banner */}
            <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                        <Lock className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-white">Storan Dilindungi Masa Nyata</span>
                        <p className="text-[11px] text-slate-400">Dokumen boleh diakses oleh pesakit dan caregiver tersenarai sahaja.</p>
                    </div>
                </div>
                <Badge variant="teal">Encrypted Vault</Badge>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                                activeCategory === cat
                                    ? 'bg-teal-500 text-slate-950 shadow-md'
                                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                            }`}
                        >
                            {cat === 'All' ? 'Semua Dokumen' : cat}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                        type="text"
                        placeholder="Cari dokumen..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                </div>
            </div>

            {/* Document Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocs.map((doc) => (
                    <div key={doc.id} className="glass-card p-6 rounded-2xl border border-slate-700/60 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <Badge variant={doc.category === 'Insurance' ? 'amber' : 'teal'}>{doc.category}</Badge>
                                <span className="text-[11px] font-mono text-slate-400">{doc.size}</span>
                            </div>

                            <h3 className="text-base font-bold text-white mb-1">{doc.title}</h3>
                            {doc.policyNo && (
                                <p className="text-xs font-mono text-amber-300 mb-1">No Polisi: {doc.policyNo} ({doc.coverageAmount})</p>
                            )}
                            <p className="text-xs text-slate-300 mb-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/40">
                                {doc.notes}
                            </p>

                            <div className="flex flex-wrap gap-1 mb-4">
                                {doc.tags?.map((tag, idx) => (
                                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">Dimuat naik: {doc.uploadedDate}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPreviewDoc(doc)}
                                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
                                >
                                    <Eye className="w-3.5 h-3.5" /> Lihat
                                </button>
                                <button
                                    onClick={() => alert(`Memuat turun ${doc.title}`)}
                                    className="p-2 rounded-lg bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/30 text-xs font-semibold flex items-center gap-1"
                                >
                                    <Download className="w-3.5 h-3.5" /> Muat Turun
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Document Preview Modal */}
            <Modal isOpen={!!previewDoc} onClose={() => setPreviewDoc(null)} title={previewDoc?.title || 'Pratonton Dokumen'}>
                {previewDoc && (
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="teal">{previewDoc.category}</Badge>
                                <span className="text-xs font-mono text-slate-400">{previewDoc.size}</span>
                            </div>
                            <p className="text-sm font-bold text-white mb-2">{previewDoc.title}</p>
                            <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                                {previewDoc.notes}
                            </p>
                        </div>

                        {/* Simulated Document Viewer Canvas */}
                        <div className="h-64 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-6 text-center">
                            <FileCheck className="w-12 h-12 text-teal-400 mb-2" />
                            <p className="text-sm font-bold text-slate-200">Pratonton PDF Terjamin MediSync</p>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                Dokumen ini disulitkan dengan kunci perubatan peribadi. Tiada maklumat luaran dibocorkan.
                            </p>
                        </div>

                        <div className="modal-actions flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setPreviewDoc(null)}
                                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                            >
                                Tutup Pratonton
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Upload Modal Mockup */}
            <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Muat Naik Dokumen Perubatan / Insurans">
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Nama / Tajuk Dokumen</label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Polisi Insurans Hayat 2026"
                            value={newDoc.title}
                            onChange={e => setNewDoc({...newDoc, title: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori Dokumen</label>
                        <select
                            value={newDoc.category}
                            onChange={e => setNewDoc({...newDoc, category: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                        >
                            <option value="Insurance">Insurans & Kad Perubatan</option>
                            <option value="Lab Results">Ujian Darah & Makmal</option>
                            <option value="Discharge Summary">Surat Discas Hospital</option>
                            <option value="Prescription">Preskripsi Ubat</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Fail (PDF / Imej)</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-700 hover:border-teal-400 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-800/40"
                        >
                            <Upload className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                            {file ? (
                                <p className="text-xs font-bold text-teal-400">{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</p>
                            ) : (
                                <>
                                    <p className="text-xs font-bold text-slate-200">Klik untuk pilih fail atau seret ke sini</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Sokongan PDF, PNG, JPG, WEBP sehingga 10MB</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Nota Catatan</label>
                        <textarea
                            rows={2}
                            placeholder="Catatan tambahan mengenai dokumen"
                            value={newDoc.notes}
                            onChange={e => setNewDoc({...newDoc, notes: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                        />
                    </div>

                    <div className="modal-actions pt-3 border-t border-slate-700 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsUploadModalOpen(false)}
                            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-teal-500/50 disabled:text-slate-700 text-slate-950 font-extrabold text-xs shadow-md"
                        >
                            {uploading ? 'Memuat naik...' : 'Muat Naik Ke Vault'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}

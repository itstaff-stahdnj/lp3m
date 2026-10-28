import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertOctagon,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    FileText,
    ExternalLink,
    GraduationCap,
    Building2,
    Calendar,
    Eye,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { TemuanAudit } from '@/types';

type Stats = {
    total: number;
    kts_mayor: number;
    kts_minor: number;
    observasi: number;
    open: number;
    proses_ptk: number;
    closed: number;
};

type Props = {
    temuans: TemuanAudit[];
    stats: Stats;
    currentKlasifikasi: string;
    currentStatus: string;
};

export default function TemuanAuditIndex({ temuans, stats, currentKlasifikasi, currentStatus }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemuanForDetail, setSelectedTemuanForDetail] = useState<TemuanAudit | null>(null);
    const [selectedTemuanForPtk, setSelectedTemuanForPtk] = useState<TemuanAudit | null>(null);
    const [selectedTemuanForVerify, setSelectedTemuanForVerify] = useState<TemuanAudit | null>(null);

    // Form PTK
    const [ptkForm, setPtkForm] = useState({
        tindakan_koreksi: '',
        pencegahan: '',
        tanggal_tindakan_koreksi: new Date().toISOString().substring(0, 10),
        bukti_ptk_url: '',
    });

    // Form Verifikasi
    const [verifyForm, setVerifyForm] = useState({
        status_temuan: 'Closed',
        catatan_verifikasi_auditor: '',
    });

    const handleFilterChange = (klasifikasi: string, status: string) => {
        router.get(
            '/ami/temuan',
            {
                klasifikasi: klasifikasi !== 'all' ? klasifikasi : undefined,
                status: status !== 'all' ? status : undefined,
            },
            { preserveState: true }
        );
    };

    const handlePtkSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTemuanForPtk) return;
        router.put(`/ami/temuan/${selectedTemuanForPtk.id}/ptk`, ptkForm, {
            onSuccess: () => {
                setSelectedTemuanForPtk(null);
            },
        });
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTemuanForVerify) return;
        router.put(`/ami/temuan/${selectedTemuanForVerify.id}/verify`, verifyForm, {
            onSuccess: () => {
                setSelectedTemuanForVerify(null);
            },
        });
    };

    const getKlasifikasiBadge = (klasifikasi: string) => {
        switch (klasifikasi) {
            case 'KTS Mayor':
                return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 font-bold';
            case 'KTS Minor':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold';
            case 'Observasi':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 font-bold';
            default:
                return 'bg-slate-500/10 text-slate-600 border-slate-500/30';
        }
    };

    const getStatusTemuanBadge = (status: string) => {
        switch (status) {
            case 'Open':
                return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30';
            case 'Proses PTK':
                return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
            case 'Menunggu Verifikasi':
                return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30';
            case 'Closed':
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
            default:
                return 'bg-slate-500/10 text-slate-600 border-slate-500/30';
        }
    };

    const filteredTemuans = temuans.filter((t) => {
        const auditee =
            t.jadwal_audit?.auditee_tipe === 'ProgramStudi'
                ? t.jadwal_audit?.program_studi?.nama
                : t.jadwal_audit?.unit_kerja?.nama;
        const kode = t.kode_temuan;
        const deskripsi = t.deskripsi_temuan;
        const standar = t.standar_mutu?.nama;

        return (
            (auditee && auditee.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (kode && kode.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (deskripsi && deskripsi.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (standar && standar.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    return (
        <>
            <Head title="Rekap Temuan KTS & Tindakan Koreksi (PTK) - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <AlertOctagon className="size-6 text-amber-500" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Rekap Temuan Audit & PTK
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Monitoring ketidaksesuaian SPMI, respon tindakan koreksi auditee, dan status verifikasi closing auditor.
                        </p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    <div className="bg-card border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
                        <div className="text-xs text-muted-foreground font-semibold">Total Temuan</div>
                        <div className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">{stats.total}</div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <div className="text-xs text-red-700 dark:text-red-400 font-semibold">KTS Mayor</div>
                        <div className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">{stats.kts_mayor}</div>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                        <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold">KTS Minor</div>
                        <div className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{stats.kts_minor}</div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <div className="text-xs text-blue-700 dark:text-blue-400 font-semibold">Observasi</div>
                        <div className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">{stats.observasi}</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                        <div className="text-xs text-purple-700 dark:text-purple-400 font-semibold">Menunggu / Open</div>
                        <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                            {stats.open + stats.proses_ptk}
                        </div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                        <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Closed Selesai</div>
                        <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{stats.closed}</div>
                    </div>
                </div>

                {/* Filter and Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    Daftar Temuan Audit ({filteredTemuans.length})
                                </CardTitle>
                                <CardDescription>
                                    Kelola perbaikan dan verifikasi temuan hasil audit mutu internal kampus.
                                </CardDescription>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative w-full sm:w-60">
                                    <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari kode, deskripsi, prodi..."
                                        className="pl-9 h-9 text-xs"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-2.5 py-1 text-xs">
                                    <span className="text-muted-foreground">Klasifikasi:</span>
                                    <select
                                        className="bg-transparent font-medium focus:outline-none"
                                        value={currentKlasifikasi}
                                        onChange={(e) => handleFilterChange(e.target.value, currentStatus)}
                                    >
                                        <option value="all">Semua</option>
                                        <option value="KTS Mayor">KTS Mayor</option>
                                        <option value="KTS Minor">KTS Minor</option>
                                        <option value="Observasi">Observasi</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-2.5 py-1 text-xs">
                                    <span className="text-muted-foreground">Status:</span>
                                    <select
                                        className="bg-transparent font-medium focus:outline-none"
                                        value={currentStatus}
                                        onChange={(e) => handleFilterChange(currentKlasifikasi, e.target.value)}
                                    >
                                        <option value="all">Semua Status</option>
                                        <option value="Open">Open</option>
                                        <option value="Proses PTK">Proses PTK</option>
                                        <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-muted-foreground uppercase">
                                        <th className="pb-3 font-semibold">Kode & Klasifikasi</th>
                                        <th className="pb-3 font-semibold">Auditee & Periode</th>
                                        <th className="pb-3 font-semibold">Standar Mutu</th>
                                        <th className="pb-3 font-semibold max-w-md">Deskripsi Temuan</th>
                                        <th className="pb-3 font-semibold">Status PTK</th>
                                        <th className="pb-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredTemuans.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                            <td className="py-3">
                                                <div className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                                                    {t.kode_temuan}
                                                </div>
                                                <Badge className={`text-[10px] mt-1 ${getKlasifikasiBadge(t.klasifikasi)}`}>
                                                    {t.klasifikasi}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-xs">
                                                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                    {t.jadwal_audit?.auditee_tipe === 'ProgramStudi' ? (
                                                        <GraduationCap className="size-3.5 text-blue-500 shrink-0" />
                                                    ) : (
                                                        <Building2 className="size-3.5 text-indigo-500 shrink-0" />
                                                    )}
                                                    <span>
                                                        {t.jadwal_audit?.auditee_tipe === 'ProgramStudi'
                                                            ? `${t.jadwal_audit?.program_studi?.jenjang} ${t.jadwal_audit?.program_studi?.nama}`
                                                            : t.jadwal_audit?.unit_kerja?.nama}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground block mt-0.5">
                                                    {t.jadwal_audit?.periode_audit?.kode}
                                                </span>
                                            </td>
                                            <td className="py-3 text-xs max-w-xs">
                                                <div className="font-medium text-slate-800 dark:text-slate-200">
                                                    {t.standar_mutu?.kode}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground line-clamp-1">
                                                    {t.standar_mutu?.nama}
                                                </div>
                                            </td>
                                            <td className="py-3 text-xs max-w-md">
                                                <p className="line-clamp-2 text-slate-700 dark:text-slate-300">
                                                    {t.deskripsi_temuan}
                                                </p>
                                                {t.target_selesai_ptk && (
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                                                        <Clock className="size-3 text-amber-500" />
                                                        Target: {String(t.target_selesai_ptk).substring(0, 10)}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusTemuanBadge(
                                                        t.status_temuan
                                                    )}`}
                                                >
                                                    {t.status_temuan}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        title="Lihat Detail"
                                                        onClick={() => setSelectedTemuanForDetail(t)}
                                                    >
                                                        <Eye className="size-3.5" />
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs border-purple-500/30 text-purple-700 dark:text-purple-400 hover:bg-purple-500/10"
                                                        onClick={() => {
                                                            setSelectedTemuanForPtk(t);
                                                            setPtkForm({
                                                                tindakan_koreksi: t.tindakan_koreksi || '',
                                                                pencegahan: t.pencegahan || '',
                                                                tanggal_tindakan_koreksi:
                                                                    t.tanggal_tindakan_koreksi ||
                                                                    new Date().toISOString().substring(0, 10),
                                                                bukti_ptk_url: t.bukti_ptk_url || '',
                                                            });
                                                        }}
                                                    >
                                                        PTK
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                                                        onClick={() => {
                                                            setSelectedTemuanForVerify(t);
                                                            setVerifyForm({
                                                                status_temuan: t.status_temuan === 'Closed' ? 'Closed' : 'Closed',
                                                                catatan_verifikasi_auditor: t.catatan_verifikasi_auditor || '',
                                                            });
                                                        }}
                                                    >
                                                        Verifikasi
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredTemuans.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">
                                                Tidak ada temuan audit yang sesuai dengan filter yang dipilih.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Detail Temuan */}
            <Dialog open={Boolean(selectedTemuanForDetail)} onOpenChange={(open) => !open && setSelectedTemuanForDetail(null)}>
                <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span>Detail Temuan: {selectedTemuanForDetail?.kode_temuan}</span>
                            <Badge className={`text-xs ${getKlasifikasiBadge(selectedTemuanForDetail?.klasifikasi || '')}`}>
                                {selectedTemuanForDetail?.klasifikasi}
                            </Badge>
                        </DialogTitle>
                        <DialogDescription>
                            Hasil visitasi audit kepatuhan standar SPMI di{' '}
                            {selectedTemuanForDetail?.jadwal_audit?.auditee_tipe === 'ProgramStudi'
                                ? `${selectedTemuanForDetail?.jadwal_audit?.program_studi?.jenjang} ${selectedTemuanForDetail?.jadwal_audit?.program_studi?.nama}`
                                : selectedTemuanForDetail?.jadwal_audit?.unit_kerja?.nama}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTemuanForDetail && (
                        <div className="space-y-4 py-2 text-xs">
                            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800 space-y-1.5">
                                <div>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">Standar Mutu:</span>{' '}
                                    {selectedTemuanForDetail.standar_mutu?.kode} - {selectedTemuanForDetail.standar_mutu?.nama}
                                </div>
                                {selectedTemuanForDetail.kriteria_standar && (
                                    <div>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">Kriteria Standar:</span>{' '}
                                        {selectedTemuanForDetail.kriteria_standar}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    Deskripsi Ketidaksesuaian (Temuan):
                                </Label>
                                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2.5 rounded leading-relaxed">
                                    {selectedTemuanForDetail.deskripsi_temuan}
                                </p>
                            </div>

                            {selectedTemuanForDetail.akar_penyebab && (
                                <div className="space-y-1">
                                    <Label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                        Akar Penyebab:
                                    </Label>
                                    <p className="text-slate-700 dark:text-slate-300">{selectedTemuanForDetail.akar_penyebab}</p>
                                </div>
                            )}

                            <div className="space-y-1">
                                <Label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    Rekomendasi Auditor:
                                </Label>
                                <p className="text-slate-700 dark:text-slate-300 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded border border-amber-500/20">
                                    {selectedTemuanForDetail.rekomendasi_auditor}
                                </p>
                            </div>

                            {/* Info Tindakan Koreksi */}
                            {selectedTemuanForDetail.tindakan_koreksi ? (
                                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2">
                                    <h4 className="font-bold text-purple-700 dark:text-purple-400">Respon PTK Auditee:</h4>
                                    <div className="bg-purple-50/40 dark:bg-purple-950/20 p-3 rounded space-y-1.5 border border-purple-500/20">
                                        <p>
                                            <strong>Tindakan Koreksi:</strong> {selectedTemuanForDetail.tindakan_koreksi}
                                        </p>
                                        {selectedTemuanForDetail.pencegahan && (
                                            <p>
                                                <strong>Tindakan Pencegahan:</strong> {selectedTemuanForDetail.pencegahan}
                                            </p>
                                        )}
                                        {selectedTemuanForDetail.bukti_ptk_url && (
                                            <p>
                                                <strong>Bukti PTK:</strong>{' '}
                                                <a
                                                    href={selectedTemuanForDetail.bukti_ptk_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                                                >
                                                    <ExternalLink className="size-3" />
                                                    Buka Tautan Bukti
                                                </a>
                                            </p>
                                        )}
                                        {selectedTemuanForDetail.catatan_verifikasi_auditor && (
                                            <div className="mt-2 pt-2 border-t border-purple-200 dark:border-purple-800 text-emerald-700 dark:text-emerald-400">
                                                <strong>Verifikasi Closing:</strong>{' '}
                                                {selectedTemuanForDetail.catatan_verifikasi_auditor} (Tgl:{' '}
                                                {String(selectedTemuanForDetail.tanggal_closing).substring(0, 10)})
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted-foreground italic bg-slate-50 dark:bg-slate-900 p-2 rounded">
                                    Auditee belum menyampaikan respon tindakan koreksi (PTK).
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setSelectedTemuanForDetail(null)}>
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Respon PTK (Auditee) */}
            <Dialog open={Boolean(selectedTemuanForPtk)} onOpenChange={(open) => !open && setSelectedTemuanForPtk(null)}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handlePtkSubmit}>
                        <DialogHeader>
                            <DialogTitle>Form Tindakan Koreksi (PTK)</DialogTitle>
                            <DialogDescription>
                                Masukkan langkah perbaikan nyata untuk temuan <strong>{selectedTemuanForPtk?.kode_temuan}</strong>.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4 text-xs">
                            <div className="space-y-1">
                                <Label className="text-xs">Tindakan Koreksi / Perbaikan *</Label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Jelaskan tindakan koreksi yang telah diselesaikan..."
                                    value={ptkForm.tindakan_koreksi}
                                    onChange={(e) => setPtkForm({ ...ptkForm, tindakan_koreksi: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Tindakan Pencegahan Masa Depan</Label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="SOP baru, checklist rutin, atau mitigasi pencegahan..."
                                    value={ptkForm.pencegahan}
                                    onChange={(e) => setPtkForm({ ...ptkForm, pencegahan: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Tanggal Pelaksanaan *</Label>
                                    <Input
                                        type="date"
                                        value={ptkForm.tanggal_tindakan_koreksi}
                                        onChange={(e) => setPtkForm({ ...ptkForm, tanggal_tindakan_koreksi: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Link Bukti Dokumen Pendukung</Label>
                                    <Input
                                        placeholder="https://..."
                                        value={ptkForm.bukti_ptk_url}
                                        onChange={(e) => setPtkForm({ ...ptkForm, bukti_ptk_url: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setSelectedTemuanForPtk(null)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                                Simpan & Ajukan PTK
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Verifikasi Closing (Auditor) */}
            <Dialog open={Boolean(selectedTemuanForVerify)} onOpenChange={(open) => !open && setSelectedTemuanForVerify(null)}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleVerifySubmit}>
                        <DialogHeader>
                            <DialogTitle>Verifikasi Closing Temuan - Auditor</DialogTitle>
                            <DialogDescription>
                                Konfirmasi hasil perbaikan temuan <strong>{selectedTemuanForVerify?.kode_temuan}</strong>.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4 text-xs">
                            <div className="space-y-1">
                                <Label className="text-xs">Hasil Verifikasi *</Label>
                                <select
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                    value={verifyForm.status_temuan}
                                    onChange={(e) => setVerifyForm({ ...verifyForm, status_temuan: e.target.value as any })}
                                >
                                    <option value="Closed">Closed (Perbaikan Diterima & Sah)</option>
                                    <option value="Proses PTK">Tolak (Perlu Perbaikan Tambahan)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Catatan Verifikasi Auditor *</Label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Catatan hasil pengujian bukti tindakan koreksi..."
                                    value={verifyForm.catatan_verifikasi_auditor}
                                    onChange={(e) => setVerifyForm({ ...verifyForm, catatan_verifikasi_auditor: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setSelectedTemuanForVerify(null)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                                Simpan Verifikasi
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

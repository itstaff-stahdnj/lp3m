import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ClipboardCheck,
    Plus,
    Calendar,
    MapPin,
    UserCheck,
    GraduationCap,
    Building2,
    AlertTriangle,
    CheckCircle2,
    Clock,
    FileText,
    Check,
    ExternalLink,
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
import type { JadwalAudit, StandarMutu, TemuanAudit } from '@/types';

type Props = {
    jadwal: JadwalAudit;
    standars: StandarMutu[];
};

export default function JadwalAuditShow({ jadwal, standars }: Props) {
    const [isAddTemuanOpen, setIsAddTemuanOpen] = useState(false);
    const [selectedTemuanForPtk, setSelectedTemuanForPtk] = useState<TemuanAudit | null>(null);
    const [selectedTemuanForVerify, setSelectedTemuanForVerify] = useState<TemuanAudit | null>(null);

    // Form Tambah Temuan
    const [selectedStandarId, setSelectedStandarId] = useState<string>(standars[0]?.id ? String(standars[0].id) : '');
    const activeStandar = standars.find((s) => String(s.id) === selectedStandarId);

    const defaultKode = `KTS-${jadwal.auditee_tipe === 'ProgramStudi' ? jadwal.program_studi?.kode || 'PRODI' : jadwal.unit_kerja?.kode || 'UNIT'}-${new Date().getFullYear()}-${String((jadwal.temuans?.length || 0) + 1).padStart(3, '0')}`;

    const [temuanForm, setTemuanForm] = useState({
        standar_mutu_id: standars[0]?.id ? String(standars[0].id) : '',
        indikator_mutu_id: '',
        kode_temuan: defaultKode,
        klasifikasi: 'KTS Minor',
        deskripsi_temuan: '',
        kriteria_standar: '',
        akar_penyebab: '',
        akibat_dampak: '',
        rekomendasi_auditor: '',
        target_selesai_ptk: '',
    });

    // Form Respon PTK oleh Auditee
    const [ptkForm, setPtkForm] = useState({
        tindakan_koreksi: '',
        pencegahan: '',
        tanggal_tindakan_koreksi: new Date().toISOString().substring(0, 10),
        bukti_ptk_url: '',
    });

    // Form Verifikasi Closing oleh Auditor
    const [verifyForm, setVerifyForm] = useState({
        status_temuan: 'Closed',
        catatan_verifikasi_auditor: '',
    });

    const handleCreateTemuan = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/ami/jadwal/${jadwal.id}/temuan`, temuanForm, {
            onSuccess: () => {
                setIsAddTemuanOpen(false);
                setTemuanForm({
                    standar_mutu_id: standars[0]?.id ? String(standars[0].id) : '',
                    indikator_mutu_id: '',
                    kode_temuan: `KTS-${jadwal.auditee_tipe === 'ProgramStudi' ? jadwal.program_studi?.kode || 'PRODI' : jadwal.unit_kerja?.kode || 'UNIT'}-${new Date().getFullYear()}-${String((jadwal.temuans?.length || 0) + 2).padStart(3, '0')}`,
                    klasifikasi: 'KTS Minor',
                    deskripsi_temuan: '',
                    kriteria_standar: '',
                    akar_penyebab: '',
                    akibat_dampak: '',
                    rekomendasi_auditor: '',
                    target_selesai_ptk: '',
                });
            },
        });
    };

    const handlePtkSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTemuanForPtk) return;
        router.put(`/ami/temuan/${selectedTemuanForPtk.id}/ptk`, ptkForm, {
            onSuccess: () => {
                setSelectedTemuanForPtk(null);
                setPtkForm({
                    tindakan_koreksi: '',
                    pencegahan: '',
                    tanggal_tindakan_koreksi: new Date().toISOString().substring(0, 10),
                    bukti_ptk_url: '',
                });
            },
        });
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTemuanForVerify) return;
        router.put(`/ami/temuan/${selectedTemuanForVerify.id}/verify`, verifyForm, {
            onSuccess: () => {
                setSelectedTemuanForVerify(null);
                setVerifyForm({
                    status_temuan: 'Closed',
                    catatan_verifikasi_auditor: '',
                });
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

    const auditeeTitle =
        jadwal.auditee_tipe === 'ProgramStudi'
            ? `${jadwal.program_studi?.jenjang} ${jadwal.program_studi?.nama}`
            : jadwal.unit_kerja?.nama;

    const countMayor = jadwal.temuans?.filter((t) => t.klasifikasi === 'KTS Mayor').length || 0;
    const countMinor = jadwal.temuans?.filter((t) => t.klasifikasi === 'KTS Minor').length || 0;
    const countObs = jadwal.temuans?.filter((t) => t.klasifikasi === 'Observasi').length || 0;
    const countClosed = jadwal.temuans?.filter((t) => t.status_temuan === 'Closed').length || 0;

    return (
        <>
            <Head title={`Lembar Audit Visitasi - ${auditeeTitle}`} />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Back button & Title */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/ami/jadwal">
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                <ArrowLeft className="size-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <ClipboardCheck className="size-6 text-amber-500" />
                                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                    Lembar Audit Visitasi Lapangan
                                </h1>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Periode: {jadwal.periode_audit?.kode} - {jadwal.periode_audit?.nama}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setIsAddTemuanOpen(true)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                        >
                            <Plus className="size-4 mr-1.5" />
                            Catat Temuan KTS
                        </Button>
                    </div>
                </div>

                {/* Audit Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Auditee Card */}
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                                {jadwal.auditee_tipe === 'ProgramStudi' ? (
                                    <GraduationCap className="size-4 text-blue-500" />
                                ) : (
                                    <Building2 className="size-4 text-indigo-500" />
                                )}
                                Auditee Terperiksa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {auditeeTitle}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                <span>Tipe: {jadwal.auditee_tipe === 'ProgramStudi' ? 'Program Studi' : 'Unit Kerja'}</span>
                                {jadwal.program_studi?.akreditasi && (
                                    <Badge variant="outline" className="text-[10px]">
                                        Akreditasi: {jadwal.program_studi.akreditasi}
                                    </Badge>
                                )}
                            </div>
                            {jadwal.catatan_auditor && (
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 italic">
                                    "{jadwal.catatan_auditor}"
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tim Auditor */}
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                                <UserCheck className="size-4 text-amber-500" />
                                Tim Auditor Mutu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <span className="text-[11px] text-muted-foreground block">Lead Auditor (Ketua):</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {jadwal.lead_auditor?.name}
                                </span>
                            </div>
                            <div>
                                <span className="text-[11px] text-muted-foreground block">Anggota Auditor:</span>
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {jadwal.auditor_anggota?.name || '- (Auditor Tunggal)'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pelaksanaan & Status */}
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                                <Calendar className="size-4 text-emerald-500" />
                                Pelaksanaan & Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                                <Calendar className="size-3.5 text-muted-foreground" />
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                    {String(jadwal.tanggal_audit).substring(0, 10)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <MapPin className="size-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground">{jadwal.lokasi || 'Lokasi belum ditentukan'}</span>
                            </div>
                            <div className="pt-1 flex items-center gap-2">
                                <span className="text-xs font-semibold">Status:</span>
                                <Badge className="text-xs">{jadwal.status}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ringkasan Temuan Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{countMayor}</div>
                        <div className="text-[11px] font-semibold text-red-700 dark:text-red-300 uppercase tracking-wider">
                            KTS Mayor
                        </div>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{countMinor}</div>
                        <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                            KTS Minor
                        </div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{countObs}</div>
                        <div className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                            Observasi
                        </div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{countClosed}</div>
                        <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                            Temuan Closed
                        </div>
                    </div>
                </div>

                {/* Daftar Temuan Table */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center justify-between">
                            <span>Daftar Temuan Ketidaksesuaian (KTS) & Observasi</span>
                            <Badge variant="outline">{jadwal.temuans?.length || 0} Total Temuan</Badge>
                        </CardTitle>
                        <CardDescription>
                            Hasil observasi lapangan, kriteria standar yang dilanggar, rekomendasi perbaikan, serta tindakan koreksi (PTK).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {jadwal.temuans && jadwal.temuans.length > 0 ? (
                                jadwal.temuans.map((t, idx) => (
                                    <div
                                        key={t.id}
                                        className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-card hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-3"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                    #{idx + 1} {t.kode_temuan}
                                                </span>
                                                <Badge className={`text-xs ${getKlasifikasiBadge(t.klasifikasi)}`}>
                                                    {t.klasifikasi}
                                                </Badge>
                                                <Badge className={`text-xs ${getStatusTemuanBadge(t.status_temuan)}`}>
                                                    {t.status_temuan}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                {/* Button Respon PTK (untuk auditee) */}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 text-xs gap-1 border-purple-500/30 text-purple-700 dark:text-purple-400 hover:bg-purple-500/10"
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
                                                    <FileText className="size-3" />
                                                    Respon PTK
                                                </Button>

                                                {/* Button Verifikasi Closing (untuk auditor) */}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 text-xs gap-1 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                                                    onClick={() => {
                                                        setSelectedTemuanForVerify(t);
                                                        setVerifyForm({
                                                            status_temuan: t.status_temuan === 'Closed' ? 'Closed' : 'Closed',
                                                            catatan_verifikasi_auditor: t.catatan_verifikasi_auditor || '',
                                                        });
                                                    }}
                                                >
                                                    <CheckCircle2 className="size-3" />
                                                    Verifikasi Auditor
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Content Temuan */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                                                        Standar Mutu SPMI:
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {t.standar_mutu?.kode} - {t.standar_mutu?.nama}
                                                        {t.indikator_mutu && ` (${t.indikator_mutu.kode} - ${t.indikator_mutu.pernyataan})`}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                                                        Deskripsi Ketidaksesuaian (Temuan):
                                                    </span>
                                                    <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-2 rounded">
                                                        {t.deskripsi_temuan}
                                                    </p>
                                                </div>
                                                {t.kriteria_standar && (
                                                    <div>
                                                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                                                            Kriteria Acuan:
                                                        </span>
                                                        <span className="text-muted-foreground">{t.kriteria_standar}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <div>
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                                                        Rekomendasi Auditor:
                                                    </span>
                                                    <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded border border-amber-500/20">
                                                        {t.rekomendasi_auditor}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                                                    {t.target_selesai_ptk && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="size-3 text-red-500" />
                                                            Target PTK: {String(t.target_selesai_ptk).substring(0, 10)}
                                                        </span>
                                                    )}
                                                    {t.tanggal_closing && (
                                                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                                                            <CheckCircle2 className="size-3" />
                                                            Closing: {String(t.tanggal_closing).substring(0, 10)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Respon PTK (jika sudah ada) */}
                                        {t.tindakan_koreksi && (
                                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 bg-purple-50/30 dark:bg-purple-950/10 p-2.5 rounded text-xs">
                                                <div className="font-semibold text-purple-900 dark:text-purple-300 flex items-center justify-between mb-1">
                                                    <span>Tindakan Perbaikan (PTK) oleh Auditee:</span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        Tanggal: {String(t.tanggal_tindakan_koreksi).substring(0, 10)}
                                                    </span>
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-300">{t.tindakan_koreksi}</p>
                                                {t.pencegahan && (
                                                    <p className="text-muted-foreground mt-1 text-[11px]">
                                                        <strong>Pencegahan Berulang:</strong> {t.pencegahan}
                                                    </p>
                                                )}
                                                {t.bukti_ptk_url && (
                                                    <div className="mt-1.5">
                                                        <a
                                                            href={t.bukti_ptk_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 text-[11px]"
                                                        >
                                                            <ExternalLink className="size-3" />
                                                            Lihat Bukti Dukung PTK
                                                        </a>
                                                    </div>
                                                )}
                                                {t.catatan_verifikasi_auditor && (
                                                    <div className="mt-2 pt-1 border-t border-purple-200/50 dark:border-purple-800/50 text-[11px] text-emerald-700 dark:text-emerald-400">
                                                        <strong>Verifikasi Auditor:</strong> {t.catatan_verifikasi_auditor}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    Belum ada temuan KTS atau Observasi yang dicatat untuk visitasi ini.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Temuan KTS */}
            <Dialog open={isAddTemuanOpen} onOpenChange={setIsAddTemuanOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleCreateTemuan}>
                        <DialogHeader>
                            <DialogTitle>Catat Temuan Audit Lapangan</DialogTitle>
                            <DialogDescription>
                                Masukkan rincian ketidaksesuaian (KTS Mayor, KTS Minor, atau Observasi) terhadap Standar SPMI.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Kode Temuan *</Label>
                                    <Input
                                        value={temuanForm.kode_temuan}
                                        onChange={(e) => setTemuanForm({ ...temuanForm, kode_temuan: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Klasifikasi Temuan *</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={temuanForm.klasifikasi}
                                        onChange={(e) => setTemuanForm({ ...temuanForm, klasifikasi: e.target.value as any })}
                                    >
                                        <option value="KTS Minor">KTS Minor (Ketidaksesuaian Parsial)</option>
                                        <option value="KTS Mayor">KTS Mayor (Pelanggaran Kritis/Sistemik)</option>
                                        <option value="Observasi">Observasi (Saran Peluang Peningkatan)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Standar Mutu SPMI *</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={temuanForm.standar_mutu_id}
                                        onChange={(e) => {
                                            setTemuanForm({ ...temuanForm, standar_mutu_id: e.target.value, indikator_mutu_id: '' });
                                            setSelectedStandarId(e.target.value);
                                        }}
                                        required
                                    >
                                        {standars.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.kode} - {s.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Indikator Mutu Spesifik</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={temuanForm.indikator_mutu_id}
                                        onChange={(e) => setTemuanForm({ ...temuanForm, indikator_mutu_id: e.target.value })}
                                    >
                                        <option value="">-- Seluruh Standar / Umum --</option>
                                        {activeStandar?.indikators?.map((i) => (
                                            <option key={i.id} value={i.id}>
                                                {i.kode} - {i.pernyataan.substring(0, 60)}...
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Deskripsi Temuan / Bukti Lapangan *</Label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Jelaskan fakta objektif ketidaksesuaian yang ditemukan saat audit..."
                                    value={temuanForm.deskripsi_temuan}
                                    onChange={(e) => setTemuanForm({ ...temuanForm, deskripsi_temuan: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Kriteria Acuan Standar yang Dilanggar</Label>
                                <Input
                                    placeholder="Contoh: Butir 3.2 Buku Standar Mutu Pendidikan..."
                                    value={temuanForm.kriteria_standar}
                                    onChange={(e) => setTemuanForm({ ...temuanForm, kriteria_standar: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Akar Penyebab (Dugaan)</Label>
                                    <textarea
                                        rows={2}
                                        className="w-full rounded-md border border-input bg-background p-2 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                        placeholder="Penyebab utama..."
                                        value={temuanForm.akar_penyebab}
                                        onChange={(e) => setTemuanForm({ ...temuanForm, akar_penyebab: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Akibat / Dampak</Label>
                                    <textarea
                                        rows={2}
                                        className="w-full rounded-md border border-input bg-background p-2 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                        placeholder="Dampak terhadap mutu/akreditasi..."
                                        value={temuanForm.akibat_dampak}
                                        onChange={(e) => setTemuanForm({ ...temuanForm, akibat_dampak: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Rekomendasi Auditor *</Label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Langkah perbaikan yang disarankan auditor..."
                                    value={temuanForm.rekomendasi_auditor}
                                    onChange={(e) => setTemuanForm({ ...temuanForm, rekomendasi_auditor: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Target Penyelesaian PTK</Label>
                                <Input
                                    type="date"
                                    value={temuanForm.target_selesai_ptk}
                                    onChange={(e) => setTemuanForm({ ...temuanForm, target_selesai_ptk: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddTemuanOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Simpan Temuan Audit
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Respon PTK (Auditee) */}
            <Dialog open={Boolean(selectedTemuanForPtk)} onOpenChange={(open) => !open && setSelectedTemuanForPtk(null)}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handlePtkSubmit}>
                        <DialogHeader>
                            <DialogTitle>Form Tindakan Koreksi (PTK) - Auditee</DialogTitle>
                            <DialogDescription>
                                Tanggapan perbaikan untuk temuan <strong>{selectedTemuanForPtk?.kode_temuan}</strong> ({selectedTemuanForPtk?.klasifikasi}).
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4 text-xs">
                            <div className="space-y-1">
                                <Label className="text-xs">Tindakan Perbaikan / Koreksi yang Dilakukan *</Label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Jelaskan tindakan konkret yang telah dilakukan untuk menyelesaikan temuan..."
                                    value={ptkForm.tindakan_koreksi}
                                    onChange={(e) => setPtkForm({ ...ptkForm, tindakan_koreksi: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Tindakan Pencegahan Agar Tidak Terulang</Label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="SOP baru, reminder berkala, atau mekanisme mitigasi ke depan..."
                                    value={ptkForm.pencegahan}
                                    onChange={(e) => setPtkForm({ ...ptkForm, pencegahan: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Tanggal Pelaksanaan PTK *</Label>
                                    <Input
                                        type="date"
                                        value={ptkForm.tanggal_tindakan_koreksi}
                                        onChange={(e) => setPtkForm({ ...ptkForm, tanggal_tindakan_koreksi: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Link / URL Bukti Dukung PTK</Label>
                                    <Input
                                        placeholder="https://drive.google.com/..."
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
                                Kirim Respon PTK
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
                            <DialogTitle>Verifikasi Closing Temuan - Tim Auditor</DialogTitle>
                            <DialogDescription>
                                Periksa efektivitas perbaikan PTK untuk temuan <strong>{selectedTemuanForVerify?.kode_temuan}</strong>.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4 text-xs">
                            <div className="space-y-1">
                                <Label className="text-xs">Keputusan Verifikasi *</Label>
                                <select
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                    value={verifyForm.status_temuan}
                                    onChange={(e) => setVerifyForm({ ...verifyForm, status_temuan: e.target.value as any })}
                                >
                                    <option value="Closed">Closed (Diterima & Selesai Diperbaiki)</option>
                                    <option value="Proses PTK">Tolak / Perlu Perbaikan Lanjutan</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Catatan Verifikasi Auditor *</Label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Jelaskan hasil review bukti dan kesesuaian tindakan koreksi..."
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
                                Simpan Hasil Verifikasi
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

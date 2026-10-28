import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ClipboardCheck,
    Plus,
    Search,
    Edit2,
    Trash2,
    Calendar,
    UserCheck,
    MapPin,
    ArrowRight,
    GraduationCap,
    Building2,
    AlertCircle,
    CheckCircle2,
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
import type { JadwalAudit, PeriodeAudit, ProgramStudi, UnitKerja, User } from '@/types';

type Props = {
    jadwals: JadwalAudit[];
    periodes: PeriodeAudit[];
    activePeriode: PeriodeAudit | null;
    auditors: User[];
    prodis: ProgramStudi[];
    units: UnitKerja[];
};

export default function JadwalAuditIndex({
    jadwals,
    periodes,
    activePeriode,
    auditors,
    prodis,
    units,
}: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingJadwal, setEditingJadwal] = useState<JadwalAudit | null>(null);
    const [deletingJadwal, setDeletingJadwal] = useState<JadwalAudit | null>(null);

    const [formData, setFormData] = useState({
        periode_audit_id: activePeriode?.id ? String(activePeriode.id) : '',
        auditee_tipe: 'ProgramStudi',
        program_studi_id: prodis[0]?.id ? String(prodis[0].id) : '',
        unit_kerja_id: '',
        lead_auditor_id: auditors[0]?.id ? String(auditors[0].id) : '',
        auditor_anggota_id: '',
        tanggal_audit: '',
        lokasi: '',
        status: 'Terjadwal',
        catatan_auditor: '',
    });

    const resetForm = () => {
        setFormData({
            periode_audit_id: activePeriode?.id ? String(activePeriode.id) : '',
            auditee_tipe: 'ProgramStudi',
            program_studi_id: prodis[0]?.id ? String(prodis[0].id) : '',
            unit_kerja_id: '',
            lead_auditor_id: auditors[0]?.id ? String(auditors[0].id) : '',
            auditor_anggota_id: '',
            tanggal_audit: '',
            lokasi: '',
            status: 'Terjadwal',
            catatan_auditor: '',
        });
    };

    const openAddModal = () => {
        resetForm();
        setIsAddOpen(true);
    };

    const openEditModal = (j: JadwalAudit) => {
        setEditingJadwal(j);
        setFormData({
            periode_audit_id: String(j.periode_audit_id),
            auditee_tipe: j.auditee_tipe,
            program_studi_id: j.program_studi_id ? String(j.program_studi_id) : '',
            unit_kerja_id: j.unit_kerja_id ? String(j.unit_kerja_id) : '',
            lead_auditor_id: String(j.lead_auditor_id),
            auditor_anggota_id: j.auditor_anggota_id ? String(j.auditor_anggota_id) : '',
            tanggal_audit: j.tanggal_audit ? String(j.tanggal_audit).substring(0, 10) : '',
            lokasi: j.lokasi || '',
            status: j.status,
            catatan_auditor: j.catatan_auditor || '',
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/ami/jadwal', formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                resetForm();
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingJadwal) return;
        router.put(`/ami/jadwal/${editingJadwal.id}`, formData, {
            onSuccess: () => {
                setEditingJadwal(null);
                resetForm();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingJadwal) return;
        router.delete(`/ami/jadwal/${deletingJadwal.id}`, {
            onSuccess: () => {
                setDeletingJadwal(null);
            },
        });
    };

    const handleFilterPeriode = (periodeId: string) => {
        router.get('/ami/jadwal', { periode_id: periodeId }, { preserveState: true });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Terjadwal':
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30';
            case 'Sedang Berjalan':
                return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
            case 'Tindakan Koreksi':
                return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30';
            case 'Closed':
            case 'Selesai Audit':
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
            default:
                return 'bg-slate-500/10 text-muted-foreground border-slate-500/20';
        }
    };

    const filteredJadwals = jadwals.filter((j) => {
        const auditee = j.auditee_tipe === 'ProgramStudi' ? j.program_studi?.nama : j.unit_kerja?.nama;
        const auditor = j.lead_auditor?.name;
        return (
            (auditee && auditee.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (auditor && auditor.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (j.lokasi && j.lokasi.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    return (
        <>
            <Head title="Jadwal Visitasi & Penugasan Auditor - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <ClipboardCheck className="size-6 text-amber-500" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Jadwal Visitasi & Penugasan Auditor
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Penetapan jadwal visitasi audit kepatuhan standar SPMI ke Program Studi dan Unit Kerja.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Filter Periode */}
                        <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-3 py-1 shadow-xs">
                            <Calendar className="size-3.5 text-muted-foreground" />
                            <select
                                className="bg-transparent text-xs font-semibold focus:outline-none"
                                value={activePeriode?.id || ''}
                                onChange={(e) => handleFilterPeriode(e.target.value)}
                            >
                                {periodes.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.kode} - {p.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button onClick={openAddModal} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                            <Plus className="size-4 mr-1.5" />
                            Buat Jadwal Audit
                        </Button>
                    </div>
                </div>

                {/* Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    Daftar Jadwal Audit Visitasi ({filteredJadwals.length})
                                </CardTitle>
                                <CardDescription>
                                    Klik "Lembar Audit" untuk mengisi lembar tilik dan mencatat temuan KTS lapangan
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari auditee, auditor, lokasi..."
                                    className="pl-9 h-9 text-xs"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-muted-foreground uppercase">
                                        <th className="pb-3 font-semibold">Auditee (Prodi/Unit)</th>
                                        <th className="pb-3 font-semibold">Tim Auditor</th>
                                        <th className="pb-3 font-semibold">Waktu & Lokasi</th>
                                        <th className="pb-3 font-semibold text-center">Temuan KTS</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                        <th className="pb-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredJadwals.map((j) => (
                                        <tr key={j.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                            <td className="py-3 max-w-xs">
                                                <div className="flex items-center gap-2">
                                                    {j.auditee_tipe === 'ProgramStudi' ? (
                                                        <GraduationCap className="size-4 text-blue-500 shrink-0" />
                                                    ) : (
                                                        <Building2 className="size-4 text-indigo-500 shrink-0" />
                                                    )}
                                                    <div>
                                                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                            {j.auditee_tipe === 'ProgramStudi'
                                                                ? `${j.program_studi?.jenjang} ${j.program_studi?.nama}`
                                                                : j.unit_kerja?.nama}
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            Tipe: {j.auditee_tipe === 'ProgramStudi' ? 'Program Studi' : 'Unit Kerja'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 text-xs">
                                                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                    <UserCheck className="size-3.5 text-amber-500" />
                                                    <span>Ketua: {j.lead_auditor?.name}</span>
                                                </div>
                                                {j.auditor_anggota && (
                                                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                                                        Anggota: {j.auditor_anggota.name}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 text-xs">
                                                <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                                    <Calendar className="size-3 text-muted-foreground" />
                                                    <span>{String(j.tanggal_audit).substring(0, 10)}</span>
                                                </div>
                                                {j.lokasi && (
                                                    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                        <MapPin className="size-3" />
                                                        <span>{j.lokasi}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 text-center">
                                                <Badge variant="outline" className="text-xs font-semibold">
                                                    {j.temuans?.length || 0} Temuan
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(j.status)}`}>
                                                    {j.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link href={`/ami/jadwal/${j.id}`}>
                                                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10">
                                                            Lembar Audit
                                                            <ArrowRight className="size-3" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => openEditModal(j)}
                                                    >
                                                        <Edit2 className="size-3.5 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        onClick={() => setDeletingJadwal(j)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredJadwals.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">
                                                Belum ada jadwal visitasi audit yang dibuat untuk periode ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Buat Jadwal Audit */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Buat Jadwal Audit & Tunjuk Auditor</DialogTitle>
                            <DialogDescription>
                                Jadwalkan audit visitasi SPMI untuk program studi atau unit kerja.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="space-y-1">
                                <Label htmlFor="periode_audit_id" className="text-xs">Siklus Periode AMI *</Label>
                                <select
                                    id="periode_audit_id"
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                    value={formData.periode_audit_id}
                                    onChange={(e) => setFormData({ ...formData, periode_audit_id: e.target.value })}
                                    required
                                >
                                    {periodes.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.kode} - {p.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="auditee_tipe" className="text-xs">Tipe Auditee *</Label>
                                    <select
                                        id="auditee_tipe"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.auditee_tipe}
                                        onChange={(e) => setFormData({ ...formData, auditee_tipe: e.target.value as any })}
                                    >
                                        <option value="ProgramStudi">Program Studi</option>
                                        <option value="UnitKerja">Unit Kerja / Lembaga</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="auditee_target" className="text-xs">Pilih Auditee *</Label>
                                    {formData.auditee_tipe === 'ProgramStudi' ? (
                                        <select
                                            id="auditee_target"
                                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                            value={formData.program_studi_id}
                                            onChange={(e) => setFormData({ ...formData, program_studi_id: e.target.value, unit_kerja_id: '' })}
                                            required
                                        >
                                            <option value="">-- Pilih Program Studi --</option>
                                            {prodis.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.jenjang} - {p.nama}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <select
                                            id="auditee_target"
                                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                            value={formData.unit_kerja_id}
                                            onChange={(e) => setFormData({ ...formData, unit_kerja_id: e.target.value, program_studi_id: '' })}
                                            required
                                        >
                                            <option value="">-- Pilih Unit Kerja --</option>
                                            {units.map((u) => (
                                                <option key={u.id} value={u.id}>
                                                    {u.kode} - {u.nama}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="lead_auditor_id" className="text-xs">Ketua Tim Auditor (Lead) *</Label>
                                    <select
                                        id="lead_auditor_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.lead_auditor_id}
                                        onChange={(e) => setFormData({ ...formData, lead_auditor_id: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Pilih Lead Auditor --</option>
                                        {auditors.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="auditor_anggota_id" className="text-xs">Anggota Auditor</Label>
                                    <select
                                        id="auditor_anggota_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.auditor_anggota_id}
                                        onChange={(e) => setFormData({ ...formData, auditor_anggota_id: e.target.value })}
                                    >
                                        <option value="">-- Tanpa Anggota / Tunggal --</option>
                                        {auditors.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="tanggal_audit" className="text-xs">Tanggal Visitasi *</Label>
                                    <Input
                                        id="tanggal_audit"
                                        type="date"
                                        value={formData.tanggal_audit}
                                        onChange={(e) => setFormData({ ...formData, tanggal_audit: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="lokasi" className="text-xs">Lokasi Ruang Audit</Label>
                                    <Input
                                        id="lokasi"
                                        placeholder="Ruang Rapat Jurusan..."
                                        value={formData.lokasi}
                                        onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="catatan_auditor" className="text-xs">Catatan / Sasaran Khusus Audit</Label>
                                <textarea
                                    id="catatan_auditor"
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    value={formData.catatan_auditor}
                                    onChange={(e) => setFormData({ ...formData, catatan_auditor: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Simpan Jadwal Audit
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Jadwal */}
            <Dialog open={Boolean(editingJadwal)} onOpenChange={(open) => !open && setEditingJadwal(null)}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Jadwal Audit</DialogTitle>
                            <DialogDescription>
                                Perbarui penugasan auditor dan jadwal visitasi {editingJadwal?.auditee_name}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_lead_auditor_id" className="text-xs">Ketua Tim Auditor *</Label>
                                    <select
                                        id="edit_lead_auditor_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.lead_auditor_id}
                                        onChange={(e) => setFormData({ ...formData, lead_auditor_id: e.target.value })}
                                        required
                                    >
                                        {auditors.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_auditor_anggota_id" className="text-xs">Anggota Auditor</Label>
                                    <select
                                        id="edit_auditor_anggota_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.auditor_anggota_id}
                                        onChange={(e) => setFormData({ ...formData, auditor_anggota_id: e.target.value })}
                                    >
                                        <option value="">-- Tanpa Anggota / Tunggal --</option>
                                        {auditors.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_tanggal_audit" className="text-xs">Tanggal Visitasi *</Label>
                                    <Input
                                        id="edit_tanggal_audit"
                                        type="date"
                                        value={formData.tanggal_audit}
                                        onChange={(e) => setFormData({ ...formData, tanggal_audit: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_status" className="text-xs">Status Visitasi *</Label>
                                    <select
                                        id="edit_status"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    >
                                        <option value="Terjadwal">Terjadwal</option>
                                        <option value="Sedang Berjalan">Sedang Berjalan</option>
                                        <option value="Selesai Audit">Selesai Audit</option>
                                        <option value="Tindakan Koreksi">Tindakan Koreksi (PTK)</option>
                                        <option value="Closed">Closed (Verifikasi Selesai)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_lokasi" className="text-xs">Lokasi Ruang Audit</Label>
                                <Input
                                    id="edit_lokasi"
                                    value={formData.lokasi}
                                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_catatan_auditor" className="text-xs">Catatan Auditor</Label>
                                <textarea
                                    id="edit_catatan_auditor"
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    value={formData.catatan_auditor}
                                    onChange={(e) => setFormData({ ...formData, catatan_auditor: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingJadwal(null)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Perbarui Jadwal
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={Boolean(deletingJadwal)} onOpenChange={(open) => !open && setDeletingJadwal(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Jadwal Audit</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus jadwal audit ini? Seluruh temuan di dalamnya akan ikut terhapus.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingJadwal(null)}>
                            Batal
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDelete}>
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

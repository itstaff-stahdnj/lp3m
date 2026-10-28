import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    CalendarDays,
    Users,
    ClipboardCheck,
    Plus,
    CheckCircle2,
    Clock,
    AlertCircle,
    Building2,
    GraduationCap,
    FileText,
    Printer,
    Edit2,
    Trash2,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Rtm, TindakLanjutRtm } from '@/types/laporan';
import type { ProgramStudi, TahunAkademik, UnitKerja } from '@/types';

type Props = {
    rtms: Rtm[];
    activeYear: TahunAkademik;
    tahunAkademiks: TahunAkademik[];
    prodis: ProgramStudi[];
    unitKerjas: UnitKerja[];
};

export default function RtmIndex({ rtms, activeYear, tahunAkademiks, prodis, unitKerjas }: Props) {
    const [selectedRtm, setSelectedRtm] = useState<Rtm | null>(rtms[0] || null);
    const [isCreateRtmModalOpen, setIsCreateRtmModalOpen] = useState(false);
    const [isAddActionModalOpen, setIsAddActionModalOpen] = useState(false);
    const [editingAction, setEditingAction] = useState<TindakLanjutRtm | null>(null);

    // Form RTM Baru
    const [rtmForm, setRtmForm] = useState({
        tahun_akademik_id: activeYear.id,
        nomor_dokumen: `RTM/STAH-DNJ/${activeYear.tahun.replace('/', '-')}/01`,
        judul: `Rapat Tinjauan Manajemen (RTM) Siklus SPMI Tahun ${activeYear.tahun}`,
        tanggal_rapat: new Date().toISOString().split('T')[0],
        tempat: 'Ruang Sidang Utama Gedung Rektorat Lt. 2 / Zoom',
        pimpinan_rapat: 'Prof. Dr. I Made Kartika, S.Ag., M.Fil.H.',
        peserta_hadir: 'Ketua STAH DNJ, Ketua LP3M, Para Kaprodi, dan Para Kepala Unit Kerja',
        agenda: '1. Pembahasan Hasil Audit Mutu Internal\n2. Evaluasi 24 Standar SPMI\n3. Penetapan Rencana Peningkatan Mutu',
        ringkasan_pembahasan: '',
        kesimpulan: '',
        status: 'Terlaksana',
    });

    // Form Tindak Lanjut
    const [actionForm, setActionForm] = useState({
        program_studi_id: '',
        unit_kerja_id: '',
        butir_rekomendasi: '',
        rencana_tindakan: '',
        target_waktu: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        penanggung_jawab: '',
        status: 'Dalam Proses',
        bukti_tindak_lanjut: '',
        catatan_verifikasi: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateRtm = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post('/laporan/rtm', rtmForm, {
            onFinish: () => {
                setIsSubmitting(false);
                setIsCreateRtmModalOpen(false);
            },
        });
    };

    const handleAddAction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRtm) return;
        setIsSubmitting(true);

        const payload = {
            ...actionForm,
            program_studi_id: actionForm.program_studi_id ? Number(actionForm.program_studi_id) : null,
            unit_kerja_id: actionForm.unit_kerja_id ? Number(actionForm.unit_kerja_id) : null,
        };

        if (editingAction) {
            router.put(`/laporan/rtm/tindak-lanjut/${editingAction.id}`, payload, {
                onFinish: () => {
                    setIsSubmitting(false);
                    setIsAddActionModalOpen(false);
                    setEditingAction(null);
                },
            });
        } else {
            router.post(`/laporan/rtm/${selectedRtm.id}/tindak-lanjut`, payload, {
                onFinish: () => {
                    setIsSubmitting(false);
                    setIsAddActionModalOpen(false);
                },
            });
        }
    };

    const openEditAction = (tl: TindakLanjutRtm) => {
        setEditingAction(tl);
        setActionForm({
            program_studi_id: tl.program_studi_id ? String(tl.program_studi_id) : '',
            unit_kerja_id: tl.unit_kerja_id ? String(tl.unit_kerja_id) : '',
            butir_rekomendasi: tl.butir_rekomendasi,
            rencana_tindakan: tl.rencana_tindakan,
            target_waktu: tl.target_waktu,
            penanggung_jawab: tl.penanggung_jawab,
            status: tl.status,
            bukti_tindak_lanjut: tl.bukti_tindak_lanjut || '',
            catatan_verifikasi: tl.catatan_verifikasi || '',
        });
        setIsAddActionModalOpen(true);
    };

    return (
        <>
            <Head title="Rapat Tinjauan Manajemen (RTM) - LP3M" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Rapat Tinjauan Manajemen (RTM)</h1>
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
                                PPEPP - Pengendalian
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Sidang pimpinan tahunan penjaminan mutu, berita acara notulensi, dan matriks tindak lanjut peningkatan mutu.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button onClick={() => setIsCreateRtmModalOpen(true)} size="sm" className="gap-1.5 shadow-xs">
                            <Plus className="h-4 w-4" />
                            <span>Jadwalkan RTM Baru</span>
                        </Button>
                    </div>
                </div>

                {/* Grid RTM Session & Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Daftar Sidang RTM */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-foreground">Daftar Sidang RTM</h3>
                        {rtms.length === 0 ? (
                            <div className="p-4 rounded-lg border bg-muted/20 text-xs text-muted-foreground text-center">
                                Belum ada catatan sidang RTM.
                            </div>
                        ) : (
                            rtms.map((r) => (
                                <div
                                    key={r.id}
                                    onClick={() => setSelectedRtm(r)}
                                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                        selectedRtm?.id === r.id
                                            ? 'border-primary bg-primary/5 shadow-xs'
                                            : 'hover:border-primary/40 bg-card'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            {r.nomor_dokumen}
                                        </Badge>
                                        <Badge
                                            className={
                                                r.status === 'Selesai'
                                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]'
                                                    : 'bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]'
                                            }
                                        >
                                            {r.status}
                                        </Badge>
                                    </div>
                                    <div className="font-semibold text-xs mt-2 line-clamp-1">{r.judul}</div>
                                    <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-2">
                                        <span>📅 {r.tanggal_rapat}</span>
                                        <span>•</span>
                                        <span>📋 {r.tindak_lanjuts?.length || 0} Tindak Lanjut</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Kolom Kanan: Detail RTM & Matriks Tindak Lanjut */}
                    <div className="lg:col-span-2 space-y-5">
                        {selectedRtm ? (
                            <>
                                <Card className="shadow-xs">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-base">{selectedRtm.judul}</CardTitle>
                                                <CardDescription className="font-mono text-xs mt-1">
                                                    No. Dokumen: {selectedRtm.nomor_dokumen} • Tanggal Sidang: {selectedRtm.tanggal_rapat}
                                                </CardDescription>
                                            </div>
                                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                                                {selectedRtm.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3.5 text-xs">
                                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/30 border">
                                            <div>
                                                <span className="text-muted-foreground">Pimpinan Sidang:</span>
                                                <div className="font-semibold">{selectedRtm.pimpinan_rapat}</div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Tempat / Media:</span>
                                                <div className="font-semibold">{selectedRtm.tempat}</div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">Agenda Utama:</h4>
                                            <p className="whitespace-pre-line text-muted-foreground bg-background p-2.5 rounded-lg border">
                                                {selectedRtm.agenda || 'Belum diisi'}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">Ringkasan Pembahasan & Kesimpulan:</h4>
                                            <p className="whitespace-pre-line text-muted-foreground bg-background p-2.5 rounded-lg border">
                                                {selectedRtm.ringkasan_pembahasan || selectedRtm.kesimpulan || 'Belum diisi'}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Matriks Tindak Lanjut Peningkatan Mutu */}
                                <Card className="shadow-xs">
                                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle className="text-sm">Matriks Rencana Tindak Lanjut (Peningkatan Mutu)</CardTitle>
                                            <CardDescription>Penugasan rekomendasi audit dan peningkatan institusi</CardDescription>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setEditingAction(null);
                                                setActionForm({
                                                    program_studi_id: '',
                                                    unit_kerja_id: '',
                                                    butir_rekomendasi: '',
                                                    rencana_tindakan: '',
                                                    target_waktu: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                                    penanggung_jawab: '',
                                                    status: 'Dalam Proses',
                                                    bukti_tindak_lanjut: '',
                                                    catatan_verifikasi: '',
                                                });
                                                setIsAddActionModalOpen(true);
                                            }}
                                            className="gap-1 text-xs"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            <span>Tambah Tindak Lanjut</span>
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {selectedRtm.tindak_lanjuts?.length === 0 ? (
                                                <div className="text-center p-6 text-xs text-muted-foreground border rounded-lg">
                                                    Belum ada butir tindak lanjut untuk sidang RTM ini.
                                                </div>
                                            ) : (
                                                selectedRtm.tindak_lanjuts?.map((tl) => (
                                                    <div
                                                        key={tl.id}
                                                        className="p-3.5 rounded-xl border bg-card hover:border-primary/30 transition-colors text-xs space-y-2"
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <span className="font-semibold text-foreground">
                                                                    {tl.butir_rekomendasi}
                                                                </span>
                                                                <div className="text-[11px] text-muted-foreground mt-0.5">
                                                                    Unit/Prodi:{' '}
                                                                    <strong>
                                                                        {tl.program_studi?.nama || tl.unit_kerja?.nama || 'Institusi'}
                                                                    </strong>{' '}
                                                                    • PIC: <strong>{tl.penanggung_jawab}</strong>
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                className={
                                                                    tl.status === 'Selesai' || tl.status === 'Diverifikasi'
                                                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]'
                                                                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]'
                                                                }
                                                            >
                                                                {tl.status}
                                                            </Badge>
                                                        </div>

                                                        <div className="p-2.5 rounded-lg bg-muted/30 border space-y-1">
                                                            <div>
                                                                <span className="font-semibold text-muted-foreground">Rencana Tindakan:</span>{' '}
                                                                <span>{tl.rencana_tindakan}</span>
                                                            </div>
                                                            {tl.bukti_tindak_lanjut && (
                                                                <div>
                                                                    <span className="font-semibold text-emerald-600">Bukti Perbaikan:</span>{' '}
                                                                    <span>{tl.bukti_tindak_lanjut}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                                                            <span>Target Penyelesaian: <strong>{tl.target_waktu}</strong></span>
                                                            <div className="flex items-center gap-1.5">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openEditAction(tl)}
                                                                    className="h-6 px-2 text-xs"
                                                                >
                                                                    <Edit2 className="h-3 w-3 mr-1" /> Edit / Verifikasi
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        if (confirm('Yakin ingin menghapus tindak lanjut ini?')) {
                                                                            router.delete(`/laporan/rtm/tindak-lanjut/${tl.id}`);
                                                                        }
                                                                    }}
                                                                    className="h-6 px-2 text-xs text-rose-500 hover:text-rose-600"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <div className="p-12 text-center text-sm text-muted-foreground border rounded-xl bg-muted/10">
                                Pilih salah satu sidang RTM di sebelah kiri untuk melihat rincian notulensi dan tindak lanjut.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Tambah RTM */}
            {isCreateRtmModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg bg-background rounded-xl border p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="font-bold text-base">Jadwalkan Sidang RTM Baru</h3>
                            <button
                                type="button"
                                onClick={() => setIsCreateRtmModalOpen(false)}
                                className="text-muted-foreground hover:text-foreground text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateRtm} className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="noDok">Nomor Dokumen RTM</Label>
                                    <Input
                                        id="noDok"
                                        value={rtmForm.nomor_dokumen}
                                        onChange={(e) => setRtmForm({ ...rtmForm, nomor_dokumen: e.target.value })}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="tgl">Tanggal Sidang</Label>
                                    <Input
                                        id="tgl"
                                        type="date"
                                        value={rtmForm.tanggal_rapat}
                                        onChange={(e) => setRtmForm({ ...rtmForm, tanggal_rapat: e.target.value })}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="judul">Judul Sidang RTM</Label>
                                <Input
                                    id="judul"
                                    value={rtmForm.judul}
                                    onChange={(e) => setRtmForm({ ...rtmForm, judul: e.target.value })}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="pimpinan">Pimpinan Rapat</Label>
                                    <Input
                                        id="pimpinan"
                                        value={rtmForm.pimpinan_rapat}
                                        onChange={(e) => setRtmForm({ ...rtmForm, pimpinan_rapat: e.target.value })}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="tempat">Tempat / Ruang</Label>
                                    <Input
                                        id="tempat"
                                        value={rtmForm.tempat}
                                        onChange={(e) => setRtmForm({ ...rtmForm, tempat: e.target.value })}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="agenda">Agenda Sidang</Label>
                                <textarea
                                    id="agenda"
                                    rows={3}
                                    value={rtmForm.agenda}
                                    onChange={(e) => setRtmForm({ ...rtmForm, agenda: e.target.value })}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="kesimpulan">Ringkasan Keputusan & Kesimpulan</Label>
                                <textarea
                                    id="kesimpulan"
                                    rows={3}
                                    value={rtmForm.kesimpulan}
                                    onChange={(e) => setRtmForm({ ...rtmForm, kesimpulan: e.target.value })}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateRtmModalOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" size="sm" disabled={isSubmitting}>
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan Sidang RTM'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Tambah/Edit Tindak Lanjut */}
            {isAddActionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg bg-background rounded-xl border p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="font-bold text-base">
                                {editingAction ? 'Update Tindak Lanjut RTM' : 'Tambah Tindak Lanjut RTM'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsAddActionModalOpen(false)}
                                className="text-muted-foreground hover:text-foreground text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddAction} className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="prodiId">Program Studi (Terkait)</Label>
                                    <select
                                        id="prodiId"
                                        value={actionForm.program_studi_id}
                                        onChange={(e) => setActionForm({ ...actionForm, program_studi_id: e.target.value })}
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs mt-1"
                                    >
                                        <option value="">-- Bukan Prodi --</option>
                                        {prodis.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="unitId">Unit Kerja (Terkait)</Label>
                                    <select
                                        id="unitId"
                                        value={actionForm.unit_kerja_id}
                                        onChange={(e) => setActionForm({ ...actionForm, unit_kerja_id: e.target.value })}
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs mt-1"
                                    >
                                        <option value="">-- Bukan Unit Kerja --</option>
                                        {unitKerjas.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="butirRekomendasi">Butir Rekomendasi Pimpinan</Label>
                                <textarea
                                    id="butirRekomendasi"
                                    rows={2}
                                    value={actionForm.butir_rekomendasi}
                                    onChange={(e) => setActionForm({ ...actionForm, butir_rekomendasi: e.target.value })}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs mt-1"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="rencanaTindakan">Rencana Tindakan Koreksi & Peningkatan</Label>
                                <textarea
                                    id="rencanaTindakan"
                                    rows={2}
                                    value={actionForm.rencana_tindakan}
                                    onChange={(e) => setActionForm({ ...actionForm, rencana_tindakan: e.target.value })}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs mt-1"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="pic">Penanggung Jawab (PIC)</Label>
                                    <Input
                                        id="pic"
                                        value={actionForm.penanggung_jawab}
                                        onChange={(e) => setActionForm({ ...actionForm, penanggung_jawab: e.target.value })}
                                        required
                                        className="mt-1"
                                        placeholder="cth: Kaprodi S1 PAH"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="target">Target Tanggal Selesai</Label>
                                    <Input
                                        id="target"
                                        type="date"
                                        value={actionForm.target_waktu}
                                        onChange={(e) => setActionForm({ ...actionForm, target_waktu: e.target.value })}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="statusAction">Status Progres</Label>
                                    <select
                                        id="statusAction"
                                        value={actionForm.status}
                                        onChange={(e) => setActionForm({ ...actionForm, status: e.target.value as any })}
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs mt-1"
                                    >
                                        <option value="Belum Dimulai">Belum Dimulai</option>
                                        <option value="Dalam Proses">Dalam Proses</option>
                                        <option value="Selesai">Selesai</option>
                                        <option value="Diverifikasi">Diverifikasi</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="bukti">Bukti Tindak Lanjut / Dokumen</Label>
                                    <Input
                                        id="bukti"
                                        value={actionForm.bukti_tindak_lanjut}
                                        onChange={(e) => setActionForm({ ...actionForm, bukti_tindak_lanjut: e.target.value })}
                                        className="mt-1"
                                        placeholder="cth: Dokumen RPS No..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddActionModalOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" size="sm" disabled={isSubmitting}>
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan Tindak Lanjut'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

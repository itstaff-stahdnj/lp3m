import { useState, Fragment } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Activity,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Calendar,
    GraduationCap,
    Edit3,
    Search,
    ChevronDown,
    FileText,
    TrendingUp,
    Clock,
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
import type { StandarMutu, IndikatorMutu, CapaianIndikator, TahunAkademik, ProgramStudi } from '@/types';

type Props = {
    standars: StandarMutu[];
    tahunAkademiks: TahunAkademik[];
    prodis: ProgramStudi[];
    selectedTahunId: number | null;
    selectedProdiId: number | null;
    summary: {
        total_indikator: number;
        terisi: number;
        terlampaui: number;
        tercapai: number;
        belum_tercapai: number;
    };
};

export default function EvaluasiSpmiIndex({
    standars,
    tahunAkademiks,
    prodis,
    selectedTahunId,
    selectedProdiId,
    summary,
}: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingItem, setEditingItem] = useState<{
        indikator: IndikatorMutu;
        capaian?: CapaianIndikator | null;
    } | null>(null);

    const [formData, setFormData] = useState({
        indikator_mutu_id: 0,
        tahun_akademik_id: selectedTahunId || 0,
        program_studi_id: selectedProdiId ? String(selectedProdiId) : '',
        realisasi: '',
        status_capaian: 'Tercapai',
        analisis_capaian: '',
        akar_masalah: '',
        rencana_tindak_lanjut: '',
        bukti_dokumen_url: '',
    });

    const handleFilterChange = (tahunId: string, prodiId: string) => {
        router.get('/spmi/evaluasi', {
            tahun_id: tahunId || undefined,
            prodi_id: prodiId || undefined,
        }, {
            preserveState: true,
        });
    };

    const openEditModal = (indikator: IndikatorMutu, capaian?: CapaianIndikator | null) => {
        setEditingItem({ indikator, capaian });
        setFormData({
            indikator_mutu_id: indikator.id,
            tahun_akademik_id: selectedTahunId || tahunAkademiks[0]?.id || 0,
            program_studi_id: selectedProdiId ? String(selectedProdiId) : '',
            realisasi: capaian?.realisasi || '',
            status_capaian: capaian?.status_capaian || 'Tercapai',
            analisis_capaian: capaian?.analisis_capaian || '',
            akar_masalah: capaian?.akar_masalah || '',
            rencana_tindak_lanjut: capaian?.rencana_tindak_lanjut || '',
            bukti_dokumen_url: capaian?.bukti_dokumen_url || '',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/spmi/evaluasi', formData, {
            onSuccess: () => {
                setEditingItem(null);
            },
        });
    };

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'Terlampaui':
                return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';
            case 'Tercapai':
                return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
            case 'Belum Tercapai':
                return 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30';
            default:
                return 'bg-slate-500/10 text-muted-foreground border-slate-500/20';
        }
    };

    return (
        <>
            <Head title="Evaluasi Diri & Analisis Gap SPMI - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Activity className="size-6 text-emerald-500" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Evaluasi Diri & Analisis Gap SPMI
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Tahap Evaluasi & Pengendalian siklus PPEPP: Mengukur realisasi capaian indikator terhadap target standar mutu.
                        </p>
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-3 py-1 shadow-xs">
                            <Calendar className="size-3.5 text-muted-foreground" />
                            <select
                                className="bg-transparent text-xs font-semibold focus:outline-none"
                                value={selectedTahunId || ''}
                                onChange={(e) => handleFilterChange(e.target.value, String(selectedProdiId || ''))}
                            >
                                {tahunAkademiks.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.tahun} {t.semester} {t.is_active ? '(Aktif)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-3 py-1 shadow-xs">
                            <GraduationCap className="size-3.5 text-muted-foreground" />
                            <select
                                className="bg-transparent text-xs font-semibold focus:outline-none"
                                value={selectedProdiId || ''}
                                onChange={(e) => handleFilterChange(String(selectedTahunId || ''), e.target.value)}
                            >
                                <option value="">-- Semua Program Studi / Institusi --</option>
                                {prodis.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.jenjang} - {p.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Summary Metrics */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground">
                                Total Indikator Mutu
                            </CardTitle>
                            <FileText className="size-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black">{summary.total_indikator}</div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Keterisian evaluasi: <span className="font-bold text-slate-900 dark:text-white">{summary.terisi}</span> terisi
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground">
                                Terlampaui
                            </CardTitle>
                            <TrendingUp className="size-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                                {summary.terlampaui}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Melebihi target standar
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground">
                                Tercapai
                            </CardTitle>
                            <CheckCircle2 className="size-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                {summary.tercapai}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Memenuhi target minimal
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground">
                                Belum Tercapai (Gap)
                            </CardTitle>
                            <AlertTriangle className="size-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-red-600 dark:text-red-400">
                                {summary.belum_tercapai}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Perlu Rencana Tindak Lanjut (RTL)
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Matrix Table */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    Matriks Analisis Gap Capaian Standar
                                </CardTitle>
                                <CardDescription>
                                    Bandingkan target dengan realisasi per indikator untuk perumusan tindak lanjut korektif
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari indikator..."
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
                                        <th className="pb-3 font-semibold">Standar & Indikator</th>
                                        <th className="pb-3 font-semibold">Target Standar</th>
                                        <th className="pb-3 font-semibold">Realisasi</th>
                                        <th className="pb-3 font-semibold">Status Capaian</th>
                                        <th className="pb-3 font-semibold">Akar Masalah & Rencana Tindak Lanjut</th>
                                        <th className="pb-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {standars.map((std) => {
                                        const visibleIndikators = (std.indikators || []).filter(
                                            (ind) =>
                                                ind.pernyataan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                ind.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                std.nama.toLowerCase().includes(searchTerm.toLowerCase())
                                        );

                                        if (visibleIndikators.length === 0) return null;

                                        return (
                                            <Fragment key={std.id}>
                                                {/* Header Baris Standar */}
                                                <tr className="bg-slate-50/80 dark:bg-slate-900/80 font-bold text-xs text-slate-800 dark:text-slate-200">
                                                    <td colSpan={6} className="py-2.5 px-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-amber-600 dark:text-amber-400">
                                                                {std.kode}
                                                            </span>
                                                            <span>{std.nama}</span>
                                                            <span className="text-[10px] text-muted-foreground font-normal">
                                                                ({std.kategori})
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Baris-baris Indikator di bawah Standar ini */}
                                                {visibleIndikators.map((ind) => {
                                                    const capaian = ind.capaians && ind.capaians.length > 0 ? ind.capaians[0] : null;

                                                    return (
                                                        <tr key={ind.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 text-xs">
                                                            <td className="py-3 px-3 max-w-sm">
                                                                <div className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                                                    {ind.kode}
                                                                </div>
                                                                <div className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">
                                                                    {ind.pernyataan}
                                                                </div>
                                                            </td>
                                                            <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                                                                {ind.target} {ind.satuan}
                                                            </td>
                                                            <td className="py-3 font-bold text-slate-900 dark:text-white">
                                                                {capaian ? `${capaian.realisasi} ${ind.satuan}` : <span className="text-muted-foreground font-normal">Belum diinput</span>}
                                                            </td>
                                                            <td className="py-3">
                                                                {capaian ? (
                                                                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(capaian.status_capaian)}`}>
                                                                        {capaian.status_capaian}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[11px] text-muted-foreground font-medium">
                                                                        Belum Dievaluasi
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-3 max-w-xs text-muted-foreground">
                                                                {capaian?.rencana_tindak_lanjut ? (
                                                                    <div className="space-y-1">
                                                                        {capaian.akar_masalah && (
                                                                            <p className="line-clamp-1 text-[11px] text-red-600 dark:text-red-400">
                                                                                Masalah: {capaian.akar_masalah}
                                                                            </p>
                                                                        )}
                                                                        <p className="line-clamp-2 text-[11px] text-slate-700 dark:text-slate-300">
                                                                            RTL: {capaian.rencana_tindak_lanjut}
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    '-'
                                                                )}
                                                            </td>
                                                            <td className="py-3 text-right">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-7 text-xs border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
                                                                    onClick={() => openEditModal(ind, capaian)}
                                                                >
                                                                    <Edit3 className="size-3 mr-1" />
                                                                    {capaian ? 'Ubah' : 'Input'}
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Input Capaian & RTL */}
            <Dialog open={Boolean(editingItem)} onOpenChange={(open) => !open && setEditingItem(null)}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Input Realisasi & Analisis Gap</DialogTitle>
                            <DialogDescription>
                                Indikator: {editingItem?.indikator.kode} - Target {editingItem?.indikator.target} {editingItem?.indikator.satuan}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                                <span className="font-semibold text-slate-900 dark:text-white block mb-1">
                                    Pernyataan Standar:
                                </span>
                                <p className="text-muted-foreground leading-relaxed">
                                    {editingItem?.indikator.pernyataan}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="realisasi" className="text-xs">Realisasi Capaian *</Label>
                                    <Input
                                        id="realisasi"
                                        placeholder={`Angka dalam ${editingItem?.indikator.satuan}`}
                                        value={formData.realisasi}
                                        onChange={(e) => setFormData({ ...formData, realisasi: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="status_capaian" className="text-xs">Kesimpulan Status Capaian *</Label>
                                    <select
                                        id="status_capaian"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.status_capaian}
                                        onChange={(e) => setFormData({ ...formData, status_capaian: e.target.value as any })}
                                    >
                                        <option value="Terlampaui">Terlampaui (Melebihi Target)</option>
                                        <option value="Tercapai">Tercapai (Memenuhi Target)</option>
                                        <option value="Belum Tercapai">Belum Tercapai (Gap / Deviasi)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="analisis_capaian" className="text-xs">Analisis Hasil Pengukuran</Label>
                                <textarea
                                    id="analisis_capaian"
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Jelaskan faktor pendukung tercapainya target..."
                                    value={formData.analisis_capaian}
                                    onChange={(e) => setFormData({ ...formData, analisis_capaian: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="akar_masalah" className="text-xs">Akar Masalah (Jika Belum Tercapai)</Label>
                                <textarea
                                    id="akar_masalah"
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Identifikasi kendala atau hambatan pelaksanaan standar..."
                                    value={formData.akar_masalah}
                                    onChange={(e) => setFormData({ ...formData, akar_masalah: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="rencana_tindak_lanjut" className="text-xs">Rencana Tindak Lanjut (RTL)</Label>
                                <textarea
                                    id="rencana_tindak_lanjut"
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Langkah perbaikan atau peningkatan mutu berikutnya..."
                                    value={formData.rencana_tindak_lanjut}
                                    onChange={(e) => setFormData({ ...formData, rencana_tindak_lanjut: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                Simpan Evaluasi Capaian
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

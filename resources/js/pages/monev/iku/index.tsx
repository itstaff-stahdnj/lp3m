import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    TrendingUp,
    GraduationCap,
    Calendar,
    Target,
    CheckCircle2,
    AlertCircle,
    Clock,
    FileSpreadsheet,
    Edit2,
    Save,
    Sparkles,
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
import type { Iku, MonevIku, ProgramStudi, TahunAkademik } from '@/types';

type Stats = {
    total_iku: number;
    tercapai_count: number;
    sebagian_count: number;
    belum_count: number;
    avg_persentase: number;
};

type Props = {
    ikus: Iku[];
    monevs: Record<string, MonevIku>;
    prodis: ProgramStudi[];
    activeProdi: ProgramStudi | null;
    tahunAkademiks: TahunAkademik[];
    activeTa: TahunAkademik | null;
    stats: Stats;
};

export default function MonevIkuIndex({
    ikus,
    monevs,
    prodis,
    activeProdi,
    tahunAkademiks,
    activeTa,
    stats,
}: Props) {
    const [editingIku, setEditingIku] = useState<Iku | null>(null);

    const [formData, setFormData] = useState({
        target: '0',
        realisasi: '0',
        kendala: '',
        strategi_tindak_lanjut: '',
        bukti_dokumen_url: '',
    });

    const openEditModal = (iku: Iku) => {
        setEditingIku(iku);
        const currentMonev = monevs[String(iku.id)];
        setFormData({
            target: currentMonev ? String(currentMonev.target) : String(iku.target_default),
            realisasi: currentMonev ? String(currentMonev.realisasi) : '0',
            kendala: currentMonev?.kendala || '',
            strategi_tindak_lanjut: currentMonev?.strategi_tindak_lanjut || '',
            bukti_dokumen_url: currentMonev?.bukti_dokumen_url || '',
        });
    };

    const handleSaveCapaian = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingIku || !activeProdi || !activeTa) return;

        router.post(
            '/monev/iku/capaian',
            {
                iku_id: editingIku.id,
                program_studi_id: activeProdi.id,
                tahun_akademik_id: activeTa.id,
                ...formData,
            },
            {
                onSuccess: () => {
                    setEditingIku(null);
                },
            }
        );
    };

    const handleFilterChange = (prodiId: string, taId: string) => {
        router.get(
            '/monev/iku',
            {
                prodi_id: prodiId,
                ta_id: taId,
            },
            { preserveState: true }
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Tercapai':
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-bold';
            case 'Sebagian Tercapai':
                return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 font-bold';
            default:
                return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30 font-bold';
        }
    };

    return (
        <>
            <Head title="Monitoring & Evaluasi 8 IKU Dikti - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="size-6 text-amber-500" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Monev 8 Indikator Kinerja Utama (IKU) Dikti
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Pelaporan target capaian berkala tridharma perguruan tinggi sesuai Kepmendikbudristek No. 210/M/2023.
                        </p>
                    </div>

                    {/* Switcher Prodi & Tahun */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-2.5 py-1 text-xs">
                            <GraduationCap className="size-3.5 text-blue-500" />
                            <select
                                className="bg-transparent font-semibold focus:outline-none"
                                value={activeProdi?.id || ''}
                                onChange={(e) => handleFilterChange(e.target.value, String(activeTa?.id || ''))}
                            >
                                {prodis.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.jenjang} {p.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-2.5 py-1 text-xs">
                            <Calendar className="size-3.5 text-muted-foreground" />
                            <select
                                className="bg-transparent font-semibold focus:outline-none"
                                value={activeTa?.id || ''}
                                onChange={(e) => handleFilterChange(String(activeProdi?.id || ''), e.target.value)}
                            >
                                {tahunAkademiks.map((ta) => (
                                    <option key={ta.id} value={ta.id}>
                                        {ta.kode} ({ta.tahun} {ta.semester})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Score & Target Summary Banner */}
                <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-card to-amber-500/5 shadow-xs">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                            <div className="space-y-1 md:border-r border-slate-200 dark:border-slate-800 md:pr-6">
                                <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider block">
                                    Rata-Rata Capaian IKU
                                </span>
                                <div className="text-4xl font-black text-slate-900 dark:text-slate-100 flex items-baseline gap-1.5">
                                    <span>{stats.avg_persentase}%</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    Target vs Realisasi Keseluruhan
                                </span>
                            </div>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {stats.tercapai_count}
                                </div>
                                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                                    IKU Tercapai (&ge; 100%)
                                </div>
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                    {stats.sebagian_count}
                                </div>
                                <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                                    Sebagian (75 - 99%)
                                </div>
                            </div>

                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {stats.belum_count}
                                </div>
                                <div className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wider">
                                    Belum Tercapai (&lt; 75%)
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 8 IKU Cards Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Target className="size-5 text-amber-500" />
                            Matriks Capaian 8 Indikator Kinerja Utama Dikti
                        </h2>
                        <span className="text-xs text-muted-foreground">
                            Prodi: <strong>{activeProdi?.jenjang} {activeProdi?.nama}</strong> &bull; Tahun: <strong>{activeTa?.kode}</strong>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ikus.map((iku) => {
                            const monev = monevs[String(iku.id)];
                            const target = monev ? monev.target : iku.target_default;
                            const realisasi = monev ? monev.realisasi : 0;
                            const pct = monev ? monev.persentase_capaian : 0;
                            const status = monev ? monev.status : 'Belum Tercapai';

                            return (
                                <Card
                                    key={iku.id}
                                    className="border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
                                >
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-2.5">
                                                <span className="font-mono text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                                                    {iku.kode}
                                                </span>
                                                <div>
                                                    <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                                                        {iku.nama}
                                                    </h3>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                                                        {iku.deskripsi}
                                                    </p>
                                                </div>
                                            </div>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 text-xs gap-1 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 shrink-0"
                                                onClick={() => openEditModal(iku)}
                                            >
                                                <Edit2 className="size-3" />
                                                Input
                                            </Button>
                                        </div>

                                        {/* Target & Realisasi Bar */}
                                        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-muted-foreground">
                                                    Target: <strong>{target} {iku.satuan}</strong>
                                                </span>
                                                <span className="text-slate-900 dark:text-slate-100">
                                                    Realisasi: <strong>{realisasi} {iku.satuan}</strong>
                                                </span>
                                                <Badge className={`text-[10px] ${getStatusBadge(status)}`}>
                                                    {pct}% ({status})
                                                </Badge>
                                            </div>

                                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${
                                                        pct >= 100
                                                            ? 'bg-emerald-500'
                                                            : pct >= 75
                                                            ? 'bg-amber-500'
                                                            : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${Math.min(100, pct)}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Kendala & Tindak Lanjut jika ada */}
                                        {monev && (monev.kendala || monev.strategi_tindak_lanjut) && (
                                            <div className="text-[11px] text-muted-foreground space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                                                {monev.kendala && (
                                                    <p>
                                                        <strong className="text-red-600 dark:text-red-400">Kendala:</strong>{' '}
                                                        {monev.kendala}
                                                    </p>
                                                )}
                                                {monev.strategi_tindak_lanjut && (
                                                    <p>
                                                        <strong className="text-blue-600 dark:text-blue-400">Tindak Lanjut:</strong>{' '}
                                                        {monev.strategi_tindak_lanjut}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal Input Realisasi IKU */}
            <Dialog open={Boolean(editingIku)} onOpenChange={(open) => !open && setEditingIku(null)}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleSaveCapaian}>
                        <DialogHeader>
                            <DialogTitle>Input Realisasi {editingIku?.kode}</DialogTitle>
                            <DialogDescription>
                                {editingIku?.nama} ({activeProdi?.jenjang} {activeProdi?.nama} - {activeTa?.kode})
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Target Kinerja ({editingIku?.satuan}) *</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={formData.target}
                                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Realisasi Capaian ({editingIku?.satuan}) *</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={formData.realisasi}
                                        onChange={(e) => setFormData({ ...formData, realisasi: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Kendala / Hambatan Lapangan</Label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Jelaskan hambatan dalam mencapai target IKU..."
                                    value={formData.kendala}
                                    onChange={(e) => setFormData({ ...formData, kendala: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Strategi Tindak Lanjut / Solusi</Label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Langkah perbaikan yang akan diambil program studi..."
                                    value={formData.strategi_tindak_lanjut}
                                    onChange={(e) => setFormData({ ...formData, strategi_tindak_lanjut: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Link Bukti Dokumen Pendukung</Label>
                                <Input
                                    placeholder="https://drive.google.com/..."
                                    value={formData.bukti_dokumen_url}
                                    onChange={(e) => setFormData({ ...formData, bukti_dokumen_url: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingIku(null)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Simpan Capaian IKU
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

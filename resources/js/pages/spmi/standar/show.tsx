import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ShieldCheck,
    Plus,
    Edit2,
    Trash2,
    ArrowLeft,
    Building2,
    Award,
    CheckCircle2,
    Target,
    FileText,
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
import type { StandarMutu, IndikatorMutu } from '@/types';

type Props = {
    standar: StandarMutu;
};

export default function StandarShow({ standar }: Props) {
    const [isAddIndikatorOpen, setIsAddIndikatorOpen] = useState(false);
    const [editingIndikator, setEditingIndikator] = useState<IndikatorMutu | null>(null);
    const [deletingIndikator, setDeletingIndikator] = useState<IndikatorMutu | null>(null);

    const [formData, setFormData] = useState({
        kode: '',
        pernyataan: '',
        target: '',
        satuan: '%',
        baseline: '',
        tipe_indikator: 'Standar',
        metode_pengukuran: '',
        bobot: 1,
        is_active: true,
    });

    const resetForm = () => {
        setFormData({
            kode: '',
            pernyataan: '',
            target: '',
            satuan: '%',
            baseline: '',
            tipe_indikator: 'Standar',
            metode_pengukuran: '',
            bobot: 1,
            is_active: true,
        });
    };

    const openAddModal = () => {
        resetForm();
        setIsAddIndikatorOpen(true);
    };

    const openEditModal = (ind: IndikatorMutu) => {
        setEditingIndikator(ind);
        setFormData({
            kode: ind.kode,
            pernyataan: ind.pernyataan,
            target: ind.target,
            satuan: ind.satuan,
            baseline: ind.baseline || '',
            tipe_indikator: ind.tipe_indikator,
            metode_pengukuran: ind.metode_pengukuran || '',
            bobot: ind.bobot || 1,
            is_active: Boolean(ind.is_active),
        });
    };

    const handleCreateIndikator = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/spmi/standar/${standar.id}/indikator`, formData, {
            onSuccess: () => {
                setIsAddIndikatorOpen(false);
                resetForm();
            },
        });
    };

    const handleUpdateIndikator = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingIndikator) return;
        router.put(`/spmi/indikator/${editingIndikator.id}`, formData, {
            onSuccess: () => {
                setEditingIndikator(null);
                resetForm();
            },
        });
    };

    const handleDeleteIndikator = () => {
        if (!deletingIndikator) return;
        router.delete(`/spmi/indikator/${deletingIndikator.id}`, {
            onSuccess: () => {
                setDeletingIndikator(null);
            },
        });
    };

    return (
        <>
            <Head title={`${standar.kode} - ${standar.nama}`} />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Back button & Title */}
                <div className="space-y-2">
                    <Link href="/spmi/standar" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-slate-900 dark:hover:text-slate-100 font-medium">
                        <ArrowLeft className="size-3.5" />
                        Kembali ke Daftar Standar Mutu
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
                        <div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono text-xs">
                                    {standar.kode}
                                </Badge>
                                <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs">
                                    {standar.kategori}
                                </Badge>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
                                {standar.nama}
                            </h1>
                        </div>

                        <Button onClick={openAddModal} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                            <Plus className="size-4 mr-1.5" />
                            Tambah Indikator Capaian
                        </Button>
                    </div>
                </div>

                {/* Standar Overview Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50/50 dark:bg-slate-900/50">
                    <CardContent className="pt-6 grid gap-4 sm:grid-cols-3 text-xs">
                        <div className="space-y-1">
                            <span className="text-muted-foreground font-medium">Deskripsi Ruang Lingkup:</span>
                            <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                                {standar.deskripsi || 'Tidak ada deskripsi khusus.'}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-muted-foreground font-medium">Pemetaan Kriteria BAN-PT/LAM:</span>
                            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <Award className="size-4 text-blue-500" />
                                {standar.kriteria_akreditasi || 'Belum dipetakan'}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-muted-foreground font-medium">Unit Kerja Penanggung Jawab (PIC):</span>
                            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <Building2 className="size-4 text-indigo-500" />
                                {standar.penanggung_jawab_unit ? `${standar.penanggung_jawab_unit.kode} - ${standar.penanggung_jawab_unit.nama}` : 'LP3M'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Indikator Mutu Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Target className="size-4 text-emerald-500" />
                                    Daftar Indikator Kinerja Standar ({standar.indikators?.length || 0})
                                </CardTitle>
                                <CardDescription>
                                    Tolok ukur kuantitatif dan kualitatif ketercapaian standar mutu
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-muted-foreground uppercase">
                                        <th className="pb-3 font-semibold">Kode</th>
                                        <th className="pb-3 font-semibold">Pernyataan Indikator Mutu</th>
                                        <th className="pb-3 font-semibold">Target Standar</th>
                                        <th className="pb-3 font-semibold">Baseline</th>
                                        <th className="pb-3 font-semibold">Tipe</th>
                                        <th className="pb-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {standar.indikators && standar.indikators.map((ind) => (
                                        <tr key={ind.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                            <td className="py-3 font-mono font-medium text-xs text-slate-700 dark:text-slate-300">
                                                {ind.kode}
                                            </td>
                                            <td className="py-3 max-w-md">
                                                <div className="text-slate-900 dark:text-slate-100 font-medium">
                                                    {ind.pernyataan}
                                                </div>
                                                {ind.metode_pengukuran && (
                                                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                                                        Metode: {ind.metode_pengukuran}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3">
                                                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs">
                                                    {ind.target} {ind.satuan}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-xs text-muted-foreground font-mono">
                                                {ind.baseline ? `${ind.baseline} ${ind.satuan}` : '-'}
                                            </td>
                                            <td className="py-3">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs font-semibold ${
                                                        ind.tipe_indikator === 'IKU'
                                                            ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                                                            : 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/10'
                                                    }`}
                                                >
                                                    {ind.tipe_indikator}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => openEditModal(ind)}
                                                    >
                                                        <Edit2 className="size-3.5 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        onClick={() => setDeletingIndikator(ind)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!standar.indikators || standar.indikators.length === 0) && (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">
                                                Belum ada indikator mutu untuk standar ini. Klik tombol di atas untuk menambahkan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Dokumen Terkait Card */}
                {standar.dokumens && standar.dokumens.length > 0 && (
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <FileText className="size-4 text-amber-500" />
                                Dokumen & SOP Terkait ({standar.dokumens.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {standar.dokumens.map((dok) => (
                                    <div key={dok.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                                        <div>
                                            <Badge variant="outline" className="text-[10px] mb-1">
                                                {dok.kategori} • v{dok.versi}
                                            </Badge>
                                            <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                                                {dok.nama}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground font-mono">
                                                {dok.kode_dokumen}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Modal Tambah Indikator */}
            <Dialog open={isAddIndikatorOpen} onOpenChange={setIsAddIndikatorOpen}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleCreateIndikator}>
                        <DialogHeader>
                            <DialogTitle>Tambah Indikator Mutu</DialogTitle>
                            <DialogDescription>
                                Indikator capaian untuk standar {standar.kode}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="kode" className="text-xs">Kode Indikator *</Label>
                                    <Input
                                        id="kode"
                                        placeholder="Misal: IND-01.1"
                                        value={formData.kode}
                                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="tipe_indikator" className="text-xs">Tipe Indikator *</Label>
                                    <select
                                        id="tipe_indikator"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.tipe_indikator}
                                        onChange={(e) => setFormData({ ...formData, tipe_indikator: e.target.value })}
                                    >
                                        <option value="Standar">Standar Pokok</option>
                                        <option value="IKU">Indikator Kinerja Utama (IKU)</option>
                                        <option value="IKT">Indikator Kinerja Tambahan (IKT)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="pernyataan" className="text-xs">Pernyataan Indikator Mutu *</Label>
                                <textarea
                                    id="pernyataan"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Contoh: Rata-rata IPK lulusan minimal 3.25 pada skala 4.00"
                                    value={formData.pernyataan}
                                    onChange={(e) => setFormData({ ...formData, pernyataan: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="target" className="text-xs">Target Angka *</Label>
                                    <Input
                                        id="target"
                                        placeholder="Misal: 80"
                                        value={formData.target}
                                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="satuan" className="text-xs">Satuan *</Label>
                                    <Input
                                        id="satuan"
                                        placeholder="Misal: %, Skala 4.0, Dok"
                                        value={formData.satuan}
                                        onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="baseline" className="text-xs">Baseline</Label>
                                    <Input
                                        id="baseline"
                                        placeholder="Capaian awal"
                                        value={formData.baseline}
                                        onChange={(e) => setFormData({ ...formData, baseline: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="metode_pengukuran" className="text-xs">Metode Pengukuran / Sumber Data</Label>
                                <Input
                                    id="metode_pengukuran"
                                    placeholder="Misal: SIAKAD / Tracer Study / SK Yudisium"
                                    value={formData.metode_pengukuran}
                                    onChange={(e) => setFormData({ ...formData, metode_pengukuran: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddIndikatorOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Simpan Indikator
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Indikator */}
            <Dialog open={Boolean(editingIndikator)} onOpenChange={(open) => !open && setEditingIndikator(null)}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleUpdateIndikator}>
                        <DialogHeader>
                            <DialogTitle>Edit Indikator Mutu</DialogTitle>
                            <DialogDescription>
                                Perbarui indikator {editingIndikator?.kode}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_kode" className="text-xs">Kode Indikator *</Label>
                                    <Input
                                        id="edit_kode"
                                        value={formData.kode}
                                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_tipe_indikator" className="text-xs">Tipe Indikator *</Label>
                                    <select
                                        id="edit_tipe_indikator"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.tipe_indikator}
                                        onChange={(e) => setFormData({ ...formData, tipe_indikator: e.target.value })}
                                    >
                                        <option value="Standar">Standar Pokok</option>
                                        <option value="IKU">Indikator Kinerja Utama (IKU)</option>
                                        <option value="IKT">Indikator Kinerja Tambahan (IKT)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_pernyataan" className="text-xs">Pernyataan Indikator Mutu *</Label>
                                <textarea
                                    id="edit_pernyataan"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    value={formData.pernyataan}
                                    onChange={(e) => setFormData({ ...formData, pernyataan: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_target" className="text-xs">Target Angka *</Label>
                                    <Input
                                        id="edit_target"
                                        value={formData.target}
                                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_satuan" className="text-xs">Satuan *</Label>
                                    <Input
                                        id="edit_satuan"
                                        value={formData.satuan}
                                        onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_baseline" className="text-xs">Baseline</Label>
                                    <Input
                                        id="edit_baseline"
                                        value={formData.baseline}
                                        onChange={(e) => setFormData({ ...formData, baseline: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_metode_pengukuran" className="text-xs">Metode Pengukuran / Sumber Data</Label>
                                <Input
                                    id="edit_metode_pengukuran"
                                    value={formData.metode_pengukuran}
                                    onChange={(e) => setFormData({ ...formData, metode_pengukuran: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingIndikator(null)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Perbarui
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus Indikator */}
            <Dialog open={Boolean(deletingIndikator)} onOpenChange={(open) => !open && setDeletingIndikator(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Indikator</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus indikator{' '}
                            <strong>{deletingIndikator?.kode}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingIndikator(null)}>
                            Batal
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDeleteIndikator}>
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

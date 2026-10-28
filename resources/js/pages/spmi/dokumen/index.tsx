import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    FileText,
    Plus,
    Search,
    Edit2,
    Trash2,
    Download,
    Eye,
    Globe,
    Lock,
    ExternalLink,
    Calendar,
    Building2,
    Layers,
    FileCheck,
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
import type { DokumenMutu, StandarMutu, UnitKerja } from '@/types';

type Props = {
    dokumens: DokumenMutu[];
    standars: StandarMutu[];
    unitKerjas: UnitKerja[];
    stats: {
        total: number;
        kebijakan: number;
        manual: number;
        standar: number;
        sop: number;
        formulir: number;
    };
    currentKategori: string;
};

export default function DokumenIndex({
    dokumens,
    standars,
    unitKerjas,
    stats,
    currentKategori,
}: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingDokumen, setEditingDokumen] = useState<DokumenMutu | null>(null);
    const [deletingDokumen, setDeletingDokumen] = useState<DokumenMutu | null>(null);

    const [formData, setFormData] = useState({
        kode_dokumen: '',
        nama: '',
        kategori: 'Standar',
        standar_mutu_id: '',
        unit_kerja_id: '',
        nomor_sk: '',
        tanggal_berlaku: '',
        versi: '1.0',
        file_path: '',
        keterangan: '',
        is_public: false,
        is_active: true,
    });

    const resetForm = () => {
        setFormData({
            kode_dokumen: '',
            nama: '',
            kategori: 'Standar',
            standar_mutu_id: '',
            unit_kerja_id: '',
            nomor_sk: '',
            tanggal_berlaku: '',
            versi: '1.0',
            file_path: '',
            keterangan: '',
            is_public: false,
            is_active: true,
        });
    };

    const openAddModal = () => {
        resetForm();
        setIsAddOpen(true);
    };

    const openEditModal = (dok: DokumenMutu) => {
        setEditingDokumen(dok);
        setFormData({
            kode_dokumen: dok.kode_dokumen,
            nama: dok.nama,
            kategori: dok.kategori,
            standar_mutu_id: dok.standar_mutu_id ? String(dok.standar_mutu_id) : '',
            unit_kerja_id: dok.unit_kerja_id ? String(dok.unit_kerja_id) : '',
            nomor_sk: dok.nomor_sk || '',
            tanggal_berlaku: dok.tanggal_berlaku ? dok.tanggal_berlaku.substring(0, 10) : '',
            versi: dok.versi || '1.0',
            file_path: dok.file_path || '',
            keterangan: dok.keterangan || '',
            is_public: Boolean(dok.is_public),
            is_active: Boolean(dok.is_active),
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/spmi/dokumen', formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                resetForm();
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDokumen) return;
        router.put(`/spmi/dokumen/${editingDokumen.id}`, formData, {
            onSuccess: () => {
                setEditingDokumen(null);
                resetForm();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingDokumen) return;
        router.delete(`/spmi/dokumen/${deletingDokumen.id}`, {
            onSuccess: () => {
                setDeletingDokumen(null);
            },
        });
    };

    const handleFilterKategori = (kategori: string) => {
        router.get('/spmi/dokumen', kategori === 'all' ? {} : { kategori }, {
            preserveState: true,
        });
    };

    const filteredDokumens = dokumens.filter(
        (d) =>
            d.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.kode_dokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (d.nomor_sk && d.nomor_sk.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    const getKategoriBadge = (kategori: string) => {
        switch (kategori) {
            case 'Kebijakan':
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30';
            case 'Manual':
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
            case 'Standar':
                return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
            case 'SOP':
                return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
            case 'Formulir':
                return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30';
            default:
                return 'bg-slate-500/10 text-muted-foreground border-slate-500/20';
        }
    };

    return (
        <>
            <Head title="Repositori Dokumen SPMI - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <FileText className="size-6 text-indigo-500" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Repositori Dokumen & Manual SPMI
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Arsip resmi Kebijakan, Manual Mutu, Standar SPMI, Standar Operasional Prosedur (SOP), dan Formulir mutu STAH DNJ.
                        </p>
                    </div>

                    <Button onClick={openAddModal} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="size-4 mr-1.5" />
                        Tambah Dokumen Mutu
                    </Button>
                </div>

                {/* Filter and Category Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            size="sm"
                            variant={currentKategori === 'all' ? 'default' : 'outline'}
                            className={`h-8 text-xs ${currentKategori === 'all' ? 'bg-slate-900 text-white' : ''}`}
                            onClick={() => handleFilterKategori('all')}
                        >
                            Semua ({stats.total})
                        </Button>
                        <Button
                            size="sm"
                            variant={currentKategori === 'Kebijakan' ? 'default' : 'outline'}
                            className={`h-8 text-xs ${currentKategori === 'Kebijakan' ? 'bg-blue-600 text-white' : ''}`}
                            onClick={() => handleFilterKategori('Kebijakan')}
                        >
                            Kebijakan ({stats.kebijakan})
                        </Button>
                        <Button
                            size="sm"
                            variant={currentKategori === 'Manual' ? 'default' : 'outline'}
                            className={`h-8 text-xs ${currentKategori === 'Manual' ? 'bg-emerald-600 text-white' : ''}`}
                            onClick={() => handleFilterKategori('Manual')}
                        >
                            Manual ({stats.manual})
                        </Button>
                        <Button
                            size="sm"
                            variant={currentKategori === 'Standar' ? 'default' : 'outline'}
                            className={`h-8 text-xs ${currentKategori === 'Standar' ? 'bg-amber-500 text-slate-950 font-bold' : ''}`}
                            onClick={() => handleFilterKategori('Standar')}
                        >
                            Standar ({stats.standar})
                        </Button>
                        <Button
                            size="sm"
                            variant={currentKategori === 'SOP' ? 'default' : 'outline'}
                            className={`h-8 text-xs ${currentKategori === 'SOP' ? 'bg-indigo-600 text-white' : ''}`}
                            onClick={() => handleFilterKategori('SOP')}
                        >
                            SOP ({stats.sop})
                        </Button>
                        <Button
                            size="sm"
                            variant={currentKategori === 'Formulir' ? 'default' : 'outline'}
                            className={`h-8 text-xs ${currentKategori === 'Formulir' ? 'bg-purple-600 text-white' : ''}`}
                            onClick={() => handleFilterKategori('Formulir')}
                        >
                            Formulir ({stats.formulir})
                        </Button>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari kode dokumen, nama, SK..."
                            className="pl-9 h-9 text-xs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">
                            Daftar Dokumen Mutu ({filteredDokumens.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-muted-foreground uppercase">
                                        <th className="pb-3 font-semibold">Kode Dokumen</th>
                                        <th className="pb-3 font-semibold">Nama Dokumen</th>
                                        <th className="pb-3 font-semibold">Kategori</th>
                                        <th className="pb-3 font-semibold">Nomor SK / Berlaku</th>
                                        <th className="pb-3 font-semibold">Standar Terkait</th>
                                        <th className="pb-3 font-semibold">Akses</th>
                                        <th className="pb-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredDokumens.map((dok) => (
                                        <tr key={dok.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                            <td className="py-3 font-mono font-medium text-xs text-slate-700 dark:text-slate-300">
                                                {dok.kode_dokumen}
                                                <span className="block text-[10px] text-muted-foreground font-normal">
                                                    Versi {dok.versi}
                                                </span>
                                            </td>
                                            <td className="py-3 max-w-sm">
                                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {dok.nama}
                                                </div>
                                                {dok.keterangan && (
                                                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                        {dok.keterangan}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3">
                                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getKategoriBadge(dok.kategori)}`}>
                                                    {dok.kategori}
                                                </span>
                                            </td>
                                            <td className="py-3 text-xs">
                                                <div className="text-slate-800 dark:text-slate-200 font-medium">
                                                    {dok.nomor_sk || '-'}
                                                </div>
                                                {dok.tanggal_berlaku && (
                                                    <span className="text-[10px] text-muted-foreground">
                                                        Tgl: {dok.tanggal_berlaku.substring(0, 10)}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 text-xs text-muted-foreground">
                                                {dok.standar_mutu ? (
                                                    <span className="font-mono text-slate-700 dark:text-slate-300">
                                                        {dok.standar_mutu.kode}
                                                    </span>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="py-3">
                                                {dok.is_public ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                        <Globe className="size-3" />
                                                        Publik
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                                                        <Lock className="size-3" />
                                                        Internal
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {dok.file_path && (
                                                        <a href={dok.file_path} target="_blank" rel="noreferrer">
                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600">
                                                                <Download className="size-3.5" />
                                                            </Button>
                                                        </a>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => openEditModal(dok)}
                                                    >
                                                        <Edit2 className="size-3.5 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        onClick={() => setDeletingDokumen(dok)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredDokumens.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">
                                                Tidak ada dokumen mutu yang cocok.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Dokumen */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Tambah Dokumen Mutu</DialogTitle>
                            <DialogDescription>
                                Daftarkan dokumen kebijakan, manual, SOP, atau formulir ke repositori SPMI.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="kode_dokumen" className="text-xs">Kode Dokumen *</Label>
                                    <Input
                                        id="kode_dokumen"
                                        placeholder="Misal: DOC-SOP-2025-002"
                                        value={formData.kode_dokumen}
                                        onChange={(e) => setFormData({ ...formData, kode_dokumen: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="kategori" className="text-xs">Kategori Dokumen *</Label>
                                    <select
                                        id="kategori"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.kategori}
                                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                    >
                                        <option value="Kebijakan">Kebijakan SPMI</option>
                                        <option value="Manual">Manual Mutu</option>
                                        <option value="Standar">Standar SPMI</option>
                                        <option value="SOP">SOP (Standar Operasional)</option>
                                        <option value="Formulir">Formulir Mutu</option>
                                        <option value="Laporan">Laporan Kinerja / Audit</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="nama" className="text-xs">Judul / Nama Dokumen *</Label>
                                <Input
                                    id="nama"
                                    placeholder="Misal: SOP Ujian Proposal Skripsi Mahasiswa"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="nomor_sk" className="text-xs">Nomor SK Pengesahan</Label>
                                    <Input
                                        id="nomor_sk"
                                        placeholder="SK Ketua No. ..."
                                        value={formData.nomor_sk}
                                        onChange={(e) => setFormData({ ...formData, nomor_sk: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="versi" className="text-xs">Versi Dokumen</Label>
                                    <Input
                                        id="versi"
                                        placeholder="1.0"
                                        value={formData.versi}
                                        onChange={(e) => setFormData({ ...formData, versi: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="standar_mutu_id" className="text-xs">Kaitkan ke Standar Mutu</Label>
                                    <select
                                        id="standar_mutu_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.standar_mutu_id}
                                        onChange={(e) => setFormData({ ...formData, standar_mutu_id: e.target.value })}
                                    >
                                        <option value="">-- Tidak Terikat Standar Spesifik --</option>
                                        {standars.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.kode} - {s.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="unit_kerja_id" className="text-xs">Unit Pemilik Dokumen</Label>
                                    <select
                                        id="unit_kerja_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.unit_kerja_id}
                                        onChange={(e) => setFormData({ ...formData, unit_kerja_id: e.target.value })}
                                    >
                                        <option value="">-- Pilih Unit Kerja --</option>
                                        {unitKerjas.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.kode} - {u.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="tanggal_berlaku" className="text-xs">Tanggal Berlaku</Label>
                                    <Input
                                        id="tanggal_berlaku"
                                        type="date"
                                        value={formData.tanggal_berlaku}
                                        onChange={(e) => setFormData({ ...formData, tanggal_berlaku: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="file_path" className="text-xs">URL / Link File PDF</Label>
                                    <Input
                                        id="file_path"
                                        placeholder="https://... atau /storage/..."
                                        value={formData.file_path}
                                        onChange={(e) => setFormData({ ...formData, file_path: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    id="is_public"
                                    type="checkbox"
                                    className="size-4 rounded-sm border-input text-indigo-600 focus:ring-2 focus:ring-ring"
                                    checked={formData.is_public}
                                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                                />
                                <Label htmlFor="is_public" className="text-xs font-medium cursor-pointer">
                                    Publikasikan dokumen ini di portal homepage publik LP3M
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                Simpan Dokumen
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Dokumen */}
            <Dialog open={Boolean(editingDokumen)} onOpenChange={(open) => !open && setEditingDokumen(null)}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Dokumen Mutu</DialogTitle>
                            <DialogDescription>
                                Perbarui metadata dokumen {editingDokumen?.kode_dokumen}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_kode_dokumen" className="text-xs">Kode Dokumen *</Label>
                                    <Input
                                        id="edit_kode_dokumen"
                                        value={formData.kode_dokumen}
                                        onChange={(e) => setFormData({ ...formData, kode_dokumen: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_kategori" className="text-xs">Kategori Dokumen *</Label>
                                    <select
                                        id="edit_kategori"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.kategori}
                                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                    >
                                        <option value="Kebijakan">Kebijakan SPMI</option>
                                        <option value="Manual">Manual Mutu</option>
                                        <option value="Standar">Standar SPMI</option>
                                        <option value="SOP">SOP (Standar Operasional)</option>
                                        <option value="Formulir">Formulir Mutu</option>
                                        <option value="Laporan">Laporan Kinerja / Audit</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_nama" className="text-xs">Judul / Nama Dokumen *</Label>
                                <Input
                                    id="edit_nama"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_nomor_sk" className="text-xs">Nomor SK Pengesahan</Label>
                                    <Input
                                        id="edit_nomor_sk"
                                        value={formData.nomor_sk}
                                        onChange={(e) => setFormData({ ...formData, nomor_sk: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_versi" className="text-xs">Versi Dokumen</Label>
                                    <Input
                                        id="edit_versi"
                                        value={formData.versi}
                                        onChange={(e) => setFormData({ ...formData, versi: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_standar_mutu_id" className="text-xs">Kaitkan ke Standar Mutu</Label>
                                    <select
                                        id="edit_standar_mutu_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.standar_mutu_id}
                                        onChange={(e) => setFormData({ ...formData, standar_mutu_id: e.target.value })}
                                    >
                                        <option value="">-- Tidak Terikat Standar Spesifik --</option>
                                        {standars.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.kode} - {s.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_unit_kerja_id" className="text-xs">Unit Pemilik Dokumen</Label>
                                    <select
                                        id="edit_unit_kerja_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.unit_kerja_id}
                                        onChange={(e) => setFormData({ ...formData, unit_kerja_id: e.target.value })}
                                    >
                                        <option value="">-- Pilih Unit Kerja --</option>
                                        {unitKerjas.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.kode} - {u.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_tanggal_berlaku" className="text-xs">Tanggal Berlaku</Label>
                                    <Input
                                        id="edit_tanggal_berlaku"
                                        type="date"
                                        value={formData.tanggal_berlaku}
                                        onChange={(e) => setFormData({ ...formData, tanggal_berlaku: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_file_path" className="text-xs">URL / Link File PDF</Label>
                                    <Input
                                        id="edit_file_path"
                                        value={formData.file_path}
                                        onChange={(e) => setFormData({ ...formData, file_path: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    id="edit_is_public"
                                    type="checkbox"
                                    className="size-4 rounded-sm border-input text-indigo-600 focus:ring-2 focus:ring-ring"
                                    checked={formData.is_public}
                                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                                />
                                <Label htmlFor="edit_is_public" className="text-xs font-medium cursor-pointer">
                                    Publikasikan dokumen ini di portal homepage publik LP3M
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingDokumen(null)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                Perbarui Dokumen
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus Dokumen */}
            <Dialog open={Boolean(deletingDokumen)} onOpenChange={(open) => !open && setDeletingDokumen(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Dokumen Mutu</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus dokumen{' '}
                            <strong>{deletingDokumen?.nama}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingDokumen(null)}>
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

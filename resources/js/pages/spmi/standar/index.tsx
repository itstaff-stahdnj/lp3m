import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ShieldCheck,
    Plus,
    Search,
    Edit2,
    Trash2,
    Layers,
    BookOpen,
    Building2,
    Eye,
    CheckCircle2,
    ChevronRight,
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
import type { StandarMutu, UnitKerja } from '@/types';

type Props = {
    standars: StandarMutu[];
    unitKerjas: UnitKerja[];
    stats: {
        total: number;
        pendidikan: number;
        penelitian: number;
        pengabdian: number;
        tambahan: number;
    };
    currentKategori: string;
};

export default function StandarIndex({ standars, unitKerjas, stats, currentKategori }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingStandar, setEditingStandar] = useState<StandarMutu | null>(null);
    const [deletingStandar, setDeletingStandar] = useState<StandarMutu | null>(null);

    const [formData, setFormData] = useState({
        kode: '',
        nama: '',
        kategori: 'Pendidikan',
        deskripsi: '',
        kriteria_akreditasi: '',
        penanggung_jawab_unit_id: '',
        urutan: 0,
        is_active: true,
    });

    const resetForm = () => {
        setFormData({
            kode: '',
            nama: '',
            kategori: 'Pendidikan',
            deskripsi: '',
            kriteria_akreditasi: '',
            penanggung_jawab_unit_id: '',
            urutan: 0,
            is_active: true,
        });
    };

    const openAddModal = () => {
        resetForm();
        setIsAddOpen(true);
    };

    const openEditModal = (std: StandarMutu) => {
        setEditingStandar(std);
        setFormData({
            kode: std.kode,
            nama: std.nama,
            kategori: std.kategori,
            deskripsi: std.deskripsi || '',
            kriteria_akreditasi: std.kriteria_akreditasi || '',
            penanggung_jawab_unit_id: std.penanggung_jawab_unit_id ? String(std.penanggung_jawab_unit_id) : '',
            urutan: std.urutan || 0,
            is_active: Boolean(std.is_active),
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/spmi/standar', formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                resetForm();
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStandar) return;
        router.put(`/spmi/standar/${editingStandar.id}`, formData, {
            onSuccess: () => {
                setEditingStandar(null);
                resetForm();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingStandar) return;
        router.delete(`/spmi/standar/${deletingStandar.id}`, {
            onSuccess: () => {
                setDeletingStandar(null);
            },
        });
    };

    const handleFilterKategori = (kategori: string) => {
        router.get('/spmi/standar', kategori === 'all' ? {} : { kategori }, {
            preserveState: true,
        });
    };

    const filteredStandars = standars.filter(
        (s) =>
            s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.kriteria_akreditasi && s.kriteria_akreditasi.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    const getKategoriBadge = (kategori: string) => {
        switch (kategori) {
            case 'Pendidikan':
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30';
            case 'Penelitian':
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
            case 'Pengabdian':
                return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
            default:
                return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30';
        }
    };

    return (
        <>
            <Head title="Standar Mutu SN-Dikti & SPMI - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-6 text-amber-500" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Standar Mutu SPMI (SN-Dikti)
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Pondasi penetapan 24 Standar Nasional Pendidikan Tinggi (Pendidikan, Penelitian, PkM) & Standar Tambahan Kampus.
                        </p>
                    </div>

                    <Button onClick={openAddModal} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                        <Plus className="size-4 mr-1.5" />
                        Tambah Standar Mutu
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
                            variant={currentKategori === 'Pendidikan' ? 'default' : 'outline'}
                            className={`h-8 text-xs ${currentKategori === 'Pendidikan' ? 'bg-blue-600 text-white' : ''}`}
                            onClick={() => handleFilterKategori('Pendidikan')}
                        >
                            Pendidikan ({stats.pendidikan})
                        </Button>
                        <Button
                            size="sm"
                            variant={currentKategori === 'Penelitian' ? 'default' : 'outline'}
                            className={`h-8 text-xs ${currentKategori === 'Penelitian' ? 'bg-emerald-600 text-white' : ''}`}
                            onClick={() => handleFilterKategori('Penelitian')}
                        >
                            Penelitian ({stats.penelitian})
                        </Button>
                        <Button
                            size="sm"
                            variant={currentKategori === 'Pengabdian' ? 'default' : 'outline'}
                            className={`h-8 text-xs ${currentKategori === 'Pengabdian' ? 'bg-amber-500 text-slate-950 font-bold' : ''}`}
                            onClick={() => handleFilterKategori('Pengabdian')}
                        >
                            Pengabdian (PkM) ({stats.pengabdian})
                        </Button>
                        {stats.tambahan > 0 && (
                            <Button
                                size="sm"
                                variant={currentKategori === 'Tambahan' ? 'default' : 'outline'}
                                className={`h-8 text-xs ${currentKategori === 'Tambahan' ? 'bg-purple-600 text-white' : ''}`}
                                onClick={() => handleFilterKategori('Tambahan')}
                            >
                                Standar Tambahan ({stats.tambahan})
                            </Button>
                        )}
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari kode, nama standar, kriteria..."
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
                            Daftar Standar Mutu ({filteredStandars.length})
                        </CardTitle>
                        <CardDescription>
                            Klik "Detail & Indikator" untuk mengelola target KPI, indikator capaian, dan dokumen terkait
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-muted-foreground uppercase">
                                        <th className="pb-3 font-semibold">Kode</th>
                                        <th className="pb-3 font-semibold">Nama Standar Mutu</th>
                                        <th className="pb-3 font-semibold">Kategori</th>
                                        <th className="pb-3 font-semibold">Pemetaan Kriteria Akreditasi</th>
                                        <th className="pb-3 font-semibold">Unit PIC</th>
                                        <th className="pb-3 font-semibold text-center">Indikator</th>
                                        <th className="pb-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredStandars.map((std) => (
                                        <tr key={std.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                            <td className="py-3 font-mono font-medium text-xs text-slate-700 dark:text-slate-300">
                                                {std.kode}
                                            </td>
                                            <td className="py-3 max-w-sm">
                                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {std.nama}
                                                </div>
                                                {std.deskripsi && (
                                                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                        {std.deskripsi}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3">
                                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getKategoriBadge(std.kategori)}`}>
                                                    {std.kategori}
                                                </span>
                                            </td>
                                            <td className="py-3 text-xs text-slate-700 dark:text-slate-300">
                                                {std.kriteria_akreditasi || '-'}
                                            </td>
                                            <td className="py-3 text-xs text-muted-foreground">
                                                {std.penanggung_jawab_unit?.kode || '-'}
                                            </td>
                                            <td className="py-3 text-center">
                                                <Badge variant="outline" className="font-semibold text-xs">
                                                    {std.indikators_count ?? std.indikators?.length ?? 0} Indikator
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link href={`/spmi/standar/${std.id}`}>
                                                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10">
                                                            <Eye className="size-3.5" />
                                                            Detail
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => openEditModal(std)}
                                                    >
                                                        <Edit2 className="size-3.5 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        onClick={() => setDeletingStandar(std)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredStandars.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">
                                                Tidak ada data standar mutu yang cocok.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Standar */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Tambah Standar Mutu</DialogTitle>
                            <DialogDescription>
                                Masukkan rincian standar mutu baru ke dalam sistem SPMI.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="kode" className="text-xs">Kode Standar *</Label>
                                    <Input
                                        id="kode"
                                        placeholder="Misal: STD-DIK-09"
                                        value={formData.kode}
                                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="kategori" className="text-xs">Kategori Standar *</Label>
                                    <select
                                        id="kategori"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.kategori}
                                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                    >
                                        <option value="Pendidikan">Pendidikan</option>
                                        <option value="Penelitian">Penelitian</option>
                                        <option value="Pengabdian">Pengabdian kepada Masyarakat</option>
                                        <option value="Tambahan">Standar Tambahan Institusi</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="nama" className="text-xs">Nama Standar Mutu *</Label>
                                <Input
                                    id="nama"
                                    placeholder="Misal: Standar Suasana Akademik & Moderasi Beragama"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="deskripsi" className="text-xs">Deskripsi / Ruang Lingkup Standar</Label>
                                <textarea
                                    id="deskripsi"
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Penjelasan kriteria minimal pemenuhan standar..."
                                    value={formData.deskripsi}
                                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="kriteria_akreditasi" className="text-xs">Pemetaan Kriteria BAN-PT/LAM</Label>
                                    <Input
                                        id="kriteria_akreditasi"
                                        placeholder="Misal: Kriteria 6: Pendidikan"
                                        value={formData.kriteria_akreditasi}
                                        onChange={(e) => setFormData({ ...formData, kriteria_akreditasi: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="penanggung_jawab_unit_id" className="text-xs">Unit Penanggung Jawab (PIC)</Label>
                                    <select
                                        id="penanggung_jawab_unit_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.penanggung_jawab_unit_id}
                                        onChange={(e) => setFormData({ ...formData, penanggung_jawab_unit_id: e.target.value })}
                                    >
                                        <option value="">-- Pilih Unit PIC --</option>
                                        {unitKerjas.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.kode} - {u.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Simpan Standar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Standar */}
            <Dialog open={Boolean(editingStandar)} onOpenChange={(open) => !open && setEditingStandar(null)}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Standar Mutu</DialogTitle>
                            <DialogDescription>
                                Perbarui informasi standar mutu {editingStandar?.kode}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_kode" className="text-xs">Kode Standar *</Label>
                                    <Input
                                        id="edit_kode"
                                        value={formData.kode}
                                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_kategori" className="text-xs">Kategori Standar *</Label>
                                    <select
                                        id="edit_kategori"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.kategori}
                                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                    >
                                        <option value="Pendidikan">Pendidikan</option>
                                        <option value="Penelitian">Penelitian</option>
                                        <option value="Pengabdian">Pengabdian kepada Masyarakat</option>
                                        <option value="Tambahan">Standar Tambahan Institusi</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_nama" className="text-xs">Nama Standar Mutu *</Label>
                                <Input
                                    id="edit_nama"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_deskripsi" className="text-xs">Deskripsi / Ruang Lingkup Standar</Label>
                                <textarea
                                    id="edit_deskripsi"
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    value={formData.deskripsi}
                                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_kriteria_akreditasi" className="text-xs">Pemetaan Kriteria BAN-PT/LAM</Label>
                                    <Input
                                        id="edit_kriteria_akreditasi"
                                        value={formData.kriteria_akreditasi}
                                        onChange={(e) => setFormData({ ...formData, kriteria_akreditasi: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_penanggung_jawab_unit_id" className="text-xs">Unit Penanggung Jawab (PIC)</Label>
                                    <select
                                        id="edit_penanggung_jawab_unit_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.penanggung_jawab_unit_id}
                                        onChange={(e) => setFormData({ ...formData, penanggung_jawab_unit_id: e.target.value })}
                                    >
                                        <option value="">-- Pilih Unit PIC --</option>
                                        {unitKerjas.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.kode} - {u.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingStandar(null)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Perbarui
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={Boolean(deletingStandar)} onOpenChange={(open) => !open && setDeletingStandar(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Standar Mutu</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus standar mutu{' '}
                            <strong>{deletingStandar?.nama}</strong>? Seluruh indikator yang melekat akan ikut terhapus.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingStandar(null)}>
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

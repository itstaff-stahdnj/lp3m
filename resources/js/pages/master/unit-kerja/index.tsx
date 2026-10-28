import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Building2,
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle,
    Mail,
    User,
    Tag,
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
import type { UnitKerja } from '@/types';

type Props = {
    units: UnitKerja[];
};

export default function UnitKerjaIndex({ units }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<UnitKerja | null>(null);
    const [deletingUnit, setDeletingUnit] = useState<UnitKerja | null>(null);

    const [formData, setFormData] = useState({
        kode: '',
        nama: '',
        tipe: 'Lembaga',
        kepala_nama: '',
        email: '',
        is_active: true,
    });

    const resetForm = () => {
        setFormData({
            kode: '',
            nama: '',
            tipe: 'Lembaga',
            kepala_nama: '',
            email: '',
            is_active: true,
        });
    };

    const openAddModal = () => {
        resetForm();
        setIsAddOpen(true);
    };

    const openEditModal = (unit: UnitKerja) => {
        setEditingUnit(unit);
        setFormData({
            kode: unit.kode,
            nama: unit.nama,
            tipe: unit.tipe,
            kepala_nama: unit.kepala_nama || '',
            email: unit.email || '',
            is_active: Boolean(unit.is_active),
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/master/unit-kerja', formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                resetForm();
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUnit) return;
        router.put(`/master/unit-kerja/${editingUnit.id}`, formData, {
            onSuccess: () => {
                setEditingUnit(null);
                resetForm();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingUnit) return;
        router.delete(`/master/unit-kerja/${deletingUnit.id}`, {
            onSuccess: () => {
                setDeletingUnit(null);
            },
        });
    };

    const filteredUnits = units.filter(
        (u) =>
            u.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.tipe.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.kepala_nama && u.kepala_nama.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    return (
        <>
            <Head title="Data Master Unit Kerja - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Building2 className="size-6 text-indigo-600 dark:text-indigo-400" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Unit Kerja & Lembaga STAH DNJ
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola unit kerja, lembaga, biro, dan UPT yang terafiliasi dengan SPMI dan AMI.
                        </p>
                    </div>

                    <Button onClick={openAddModal} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="size-4 mr-1.5" />
                        Tambah Unit Kerja
                    </Button>
                </div>

                {/* Filter and Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    Daftar Unit Kerja ({filteredUnits.length})
                                </CardTitle>
                                <CardDescription>
                                    Struktur unit kerja penanggung jawab standar mutu institusi
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kode, nama, tipe, kepala unit..."
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
                                        <th className="pb-3 font-semibold">Kode</th>
                                        <th className="pb-3 font-semibold">Nama Unit Kerja</th>
                                        <th className="pb-3 font-semibold">Tipe Unit</th>
                                        <th className="pb-3 font-semibold">Pimpinan / Kepala</th>
                                        <th className="pb-3 font-semibold">Kontak / Email</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                        <th className="pb-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredUnits.map((unit) => (
                                        <tr key={unit.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                            <td className="py-3 font-mono font-medium text-xs text-slate-700 dark:text-slate-300">
                                                {unit.kode}
                                            </td>
                                            <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                {unit.nama}
                                            </td>
                                            <td className="py-3">
                                                <Badge variant="outline" className="text-xs font-medium">
                                                    {unit.tipe}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-xs text-slate-700 dark:text-slate-300">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="size-3.5 text-muted-foreground" />
                                                    {unit.kepala_nama || '-'}
                                                </div>
                                            </td>
                                            <td className="py-3 text-xs text-muted-foreground">
                                                {unit.email ? (
                                                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                                                        <Mail className="size-3.5" />
                                                        {unit.email}
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="py-3">
                                                {unit.is_active ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                                        <CheckCircle2 className="size-3.5" />
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                        <XCircle className="size-3.5" />
                                                        Non-Aktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => openEditModal(unit)}
                                                    >
                                                        <Edit2 className="size-3.5 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        onClick={() => setDeletingUnit(unit)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUnits.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">
                                                Tidak ada data unit kerja yang cocok.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Unit Kerja */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Tambah Unit Kerja</DialogTitle>
                            <DialogDescription>
                                Daftarkan unit kerja atau lembaga baru dalam ekosistem penjaminan mutu.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="kode" className="text-xs">Kode Unit *</Label>
                                    <Input
                                        id="kode"
                                        placeholder="Misal: LP3M, LPPM, BAAK"
                                        value={formData.kode}
                                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="tipe" className="text-xs">Tipe Unit *</Label>
                                    <select
                                        id="tipe"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.tipe}
                                        onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                                    >
                                        <option value="Lembaga">Lembaga</option>
                                        <option value="Biro / Bagian">Biro / Bagian</option>
                                        <option value="UPT">UPT</option>
                                        <option value="Pusat Studi">Pusat Studi</option>
                                        <option value="Pimpinan">Pimpinan Institusi</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="nama" className="text-xs">Nama Unit Kerja *</Label>
                                <Input
                                    id="nama"
                                    placeholder="Misal: Lembaga Penelitian dan Pengabdian kepada Masyarakat"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="kepala_nama" className="text-xs">Nama Kepala / Koordinator Unit</Label>
                                <Input
                                    id="kepala_nama"
                                    placeholder="Nama pimpinan unit beserta gelar"
                                    value={formData.kepala_nama}
                                    onChange={(e) => setFormData({ ...formData, kepala_nama: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="email" className="text-xs">Email Resmi Unit</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="unit@stahdnj.ac.id"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Unit Kerja */}
            <Dialog open={Boolean(editingUnit)} onOpenChange={(open) => !open && setEditingUnit(null)}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Unit Kerja</DialogTitle>
                            <DialogDescription>
                                Perbarui data unit kerja {editingUnit?.nama}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_kode" className="text-xs">Kode Unit *</Label>
                                    <Input
                                        id="edit_kode"
                                        value={formData.kode}
                                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_tipe" className="text-xs">Tipe Unit *</Label>
                                    <select
                                        id="edit_tipe"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.tipe}
                                        onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                                    >
                                        <option value="Lembaga">Lembaga</option>
                                        <option value="Biro / Bagian">Biro / Bagian</option>
                                        <option value="UPT">UPT</option>
                                        <option value="Pusat Studi">Pusat Studi</option>
                                        <option value="Pimpinan">Pimpinan Institusi</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_nama" className="text-xs">Nama Unit Kerja *</Label>
                                <Input
                                    id="edit_nama"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_kepala_nama" className="text-xs">Nama Kepala / Koordinator Unit</Label>
                                <Input
                                    id="edit_kepala_nama"
                                    value={formData.kepala_nama}
                                    onChange={(e) => setFormData({ ...formData, kepala_nama: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_email" className="text-xs">Email Resmi Unit</Label>
                                <Input
                                    id="edit_email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingUnit(null)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                Perbarui
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={Boolean(deletingUnit)} onOpenChange={(open) => !open && setDeletingUnit(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Unit Kerja</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus unit kerja{' '}
                            <strong>{deletingUnit?.nama}</strong>? Data yang dihapus tidak dapat dikembalikan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingUnit(null)}>
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

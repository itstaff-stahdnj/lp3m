import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    GraduationCap,
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle,
    Award,
    Building,
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
import type { ProgramStudi } from '@/types';

type Props = {
    prodis: ProgramStudi[];
};

export default function ProdiIndex({ prodis }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingProdi, setEditingProdi] = useState<ProgramStudi | null>(null);
    const [deletingProdi, setDeletingProdi] = useState<ProgramStudi | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        kode: '',
        nama: '',
        jenjang: 'S1',
        fakultas: '',
        kaprodi_nama: '',
        akreditasi: 'Baik Sekali',
        sk_akreditasi: '',
        is_active: true,
    });

    const resetForm = () => {
        setFormData({
            kode: '',
            nama: '',
            jenjang: 'S1',
            fakultas: '',
            kaprodi_nama: '',
            akreditasi: 'Baik Sekali',
            sk_akreditasi: '',
            is_active: true,
        });
    };

    const openAddModal = () => {
        resetForm();
        setIsAddOpen(true);
    };

    const openEditModal = (prodi: ProgramStudi) => {
        setEditingProdi(prodi);
        setFormData({
            kode: prodi.kode,
            nama: prodi.nama,
            jenjang: prodi.jenjang,
            fakultas: prodi.fakultas || '',
            kaprodi_nama: prodi.kaprodi_nama || '',
            akreditasi: prodi.akreditasi || 'Baik',
            sk_akreditasi: prodi.sk_akreditasi || '',
            is_active: Boolean(prodi.is_active),
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/master/prodi', formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                resetForm();
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProdi) return;
        router.put(`/master/prodi/${editingProdi.id}`, formData, {
            onSuccess: () => {
                setEditingProdi(null);
                resetForm();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingProdi) return;
        router.delete(`/master/prodi/${deletingProdi.id}`, {
            onSuccess: () => {
                setDeletingProdi(null);
            },
        });
    };

    const filteredProdis = prodis.filter(
        (p) =>
            p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.kaprodi_nama && p.kaprodi_nama.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    return (
        <>
            <Head title="Data Master Program Studi - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="size-6 text-blue-600 dark:text-blue-400" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Program Studi STAH DNJ
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola data program studi, kaprodi, dan status akreditasi BAN-PT/LAM.
                        </p>
                    </div>

                    <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="size-4 mr-1.5" />
                        Tambah Program Studi
                    </Button>
                </div>

                {/* Filter and Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    Daftar Program Studi ({filteredProdis.length})
                                </CardTitle>
                                <CardDescription>
                                    Seluruh program studi aktif di lingkungan STAH Dharma Nusantara Jakarta
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kode, nama, kaprodi..."
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
                                        <th className="pb-3 font-semibold">Program Studi</th>
                                        <th className="pb-3 font-semibold">Jenjang</th>
                                        <th className="pb-3 font-semibold">Ketua Prodi</th>
                                        <th className="pb-3 font-semibold">Akreditasi & SK</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                        <th className="pb-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredProdis.map((prodi) => (
                                        <tr key={prodi.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                            <td className="py-3 font-mono font-medium text-xs text-slate-700 dark:text-slate-300">
                                                {prodi.kode}
                                            </td>
                                            <td className="py-3">
                                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {prodi.nama}
                                                </div>
                                                {prodi.fakultas && (
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <Building className="size-3" />
                                                        {prodi.fakultas}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3">
                                                <Badge variant="outline" className="text-xs font-semibold">
                                                    {prodi.jenjang}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-xs text-slate-700 dark:text-slate-300">
                                                {prodi.kaprodi_nama || '-'}
                                            </td>
                                            <td className="py-3">
                                                <div className="flex flex-col gap-0.5">
                                                    <Badge className="w-fit text-[11px] font-bold bg-emerald-500 hover:bg-emerald-600 text-white">
                                                        {prodi.akreditasi || 'Baik'}
                                                    </Badge>
                                                    {prodi.sk_akreditasi && (
                                                        <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                                                            SK: {prodi.sk_akreditasi}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                {prodi.is_active ? (
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
                                                        onClick={() => openEditModal(prodi)}
                                                    >
                                                        <Edit2 className="size-3.5 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        onClick={() => setDeletingProdi(prodi)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProdis.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">
                                                Tidak ada data program studi yang cocok.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Program Studi */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Tambah Program Studi</DialogTitle>
                            <DialogDescription>
                                Masukkan data program studi baru untuk LP3M STAH DNJ.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="kode" className="text-xs">Kode Prodi *</Label>
                                    <Input
                                        id="kode"
                                        placeholder="Misal: 86208"
                                        value={formData.kode}
                                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="jenjang" className="text-xs">Jenjang *</Label>
                                    <select
                                        id="jenjang"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.jenjang}
                                        onChange={(e) => setFormData({ ...formData, jenjang: e.target.value })}
                                    >
                                        <option value="D3">D3</option>
                                        <option value="D4">D4</option>
                                        <option value="S1">S1</option>
                                        <option value="S2">S2</option>
                                        <option value="S3">S3</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="akreditasi" className="text-xs">Akreditasi</Label>
                                    <select
                                        id="akreditasi"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.akreditasi}
                                        onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value })}
                                    >
                                        <option value="Unggul">Unggul</option>
                                        <option value="Baik Sekali">Baik Sekali</option>
                                        <option value="Baik">Baik</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="nama" className="text-xs">Nama Program Studi *</Label>
                                <Input
                                    id="nama"
                                    placeholder="Misal: Pendidikan Agama Hindu"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="fakultas" className="text-xs">Fakultas / Jurusan</Label>
                                <Input
                                    id="fakultas"
                                    placeholder="Misal: Dharma Acarya"
                                    value={formData.fakultas}
                                    onChange={(e) => setFormData({ ...formData, fakultas: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="kaprodi_nama" className="text-xs">Nama Ketua Program Studi</Label>
                                <Input
                                    id="kaprodi_nama"
                                    placeholder="Nama Kaprodi beserta gelar"
                                    value={formData.kaprodi_nama}
                                    onChange={(e) => setFormData({ ...formData, kaprodi_nama: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="sk_akreditasi" className="text-xs">Nomor SK Akreditasi</Label>
                                <Input
                                    id="sk_akreditasi"
                                    placeholder="Nomor SK BAN-PT / LAMDIK"
                                    value={formData.sk_akreditasi}
                                    onChange={(e) => setFormData({ ...formData, sk_akreditasi: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Program Studi */}
            <Dialog open={Boolean(editingProdi)} onOpenChange={(open) => !open && setEditingProdi(null)}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Program Studi</DialogTitle>
                            <DialogDescription>
                                Perbarui data program studi {editingProdi?.nama}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_kode" className="text-xs">Kode Prodi *</Label>
                                    <Input
                                        id="edit_kode"
                                        value={formData.kode}
                                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_jenjang" className="text-xs">Jenjang *</Label>
                                    <select
                                        id="edit_jenjang"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.jenjang}
                                        onChange={(e) => setFormData({ ...formData, jenjang: e.target.value })}
                                    >
                                        <option value="D3">D3</option>
                                        <option value="D4">D4</option>
                                        <option value="S1">S1</option>
                                        <option value="S2">S2</option>
                                        <option value="S3">S3</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_akreditasi" className="text-xs">Akreditasi</Label>
                                    <select
                                        id="edit_akreditasi"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.akreditasi}
                                        onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value })}
                                    >
                                        <option value="Unggul">Unggul</option>
                                        <option value="Baik Sekali">Baik Sekali</option>
                                        <option value="Baik">Baik</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_nama" className="text-xs">Nama Program Studi *</Label>
                                <Input
                                    id="edit_nama"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_fakultas" className="text-xs">Fakultas / Jurusan</Label>
                                <Input
                                    id="edit_fakultas"
                                    value={formData.fakultas}
                                    onChange={(e) => setFormData({ ...formData, fakultas: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_kaprodi_nama" className="text-xs">Nama Ketua Program Studi</Label>
                                <Input
                                    id="edit_kaprodi_nama"
                                    value={formData.kaprodi_nama}
                                    onChange={(e) => setFormData({ ...formData, kaprodi_nama: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_sk_akreditasi" className="text-xs">Nomor SK Akreditasi</Label>
                                <Input
                                    id="edit_sk_akreditasi"
                                    value={formData.sk_akreditasi}
                                    onChange={(e) => setFormData({ ...formData, sk_akreditasi: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingProdi(null)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                Perbarui
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={Boolean(deletingProdi)} onOpenChange={(open) => !open && setDeletingProdi(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Program Studi</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus program studi{' '}
                            <strong>{deletingProdi?.nama}</strong>? Data yang dihapus tidak dapat dikembalikan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingProdi(null)}>
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

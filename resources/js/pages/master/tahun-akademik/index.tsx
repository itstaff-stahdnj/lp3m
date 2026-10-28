import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    CalendarDays,
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    Calendar,
    Radio,
    Clock,
    Sparkles,
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
import type { TahunAkademik } from '@/types';

type Props = {
    tahunAkademiks: TahunAkademik[];
};

export default function TahunAkademikIndex({ tahunAkademiks }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingYear, setEditingYear] = useState<TahunAkademik | null>(null);
    const [deletingYear, setDeletingYear] = useState<TahunAkademik | null>(null);

    const [formData, setFormData] = useState({
        kode: '',
        tahun: '2025/2026',
        semester: 'Ganjil',
        tanggal_mulai: '',
        tanggal_selesai: '',
        is_active: false,
    });

    const resetForm = () => {
        setFormData({
            kode: '',
            tahun: '2025/2026',
            semester: 'Ganjil',
            tanggal_mulai: '',
            tanggal_selesai: '',
            is_active: false,
        });
    };

    const openAddModal = () => {
        resetForm();
        setIsAddOpen(true);
    };

    const openEditModal = (year: TahunAkademik) => {
        setEditingYear(year);
        setFormData({
            kode: year.kode,
            tahun: year.tahun,
            semester: year.semester,
            tanggal_mulai: year.tanggal_mulai || '',
            tanggal_selesai: year.tanggal_selesai || '',
            is_active: Boolean(year.is_active),
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/master/tahun-akademik', formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                resetForm();
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingYear) return;
        router.put(`/master/tahun-akademik/${editingYear.id}`, formData, {
            onSuccess: () => {
                setEditingYear(null);
                resetForm();
            },
        });
    };

    const handleActivate = (year: TahunAkademik) => {
        router.post(`/master/tahun-akademik/${year.id}/activate`);
    };

    const handleDelete = () => {
        if (!deletingYear) return;
        router.delete(`/master/tahun-akademik/${deletingYear.id}`, {
            onSuccess: () => {
                setDeletingYear(null);
            },
        });
    };

    const filteredYears = tahunAkademiks.filter(
        (y) =>
            y.tahun.toLowerCase().includes(searchTerm.toLowerCase()) ||
            y.semester.toLowerCase().includes(searchTerm.toLowerCase()) ||
            y.kode.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title="Data Master Tahun Akademik - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="size-6 text-amber-500" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Tahun Akademik & Periode Mutu
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola periode tahun akademik aktif sebagai acuan audit, monev pembelajaran, dan pelaporan SPMI.
                        </p>
                    </div>

                    <Button onClick={openAddModal} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                        <Plus className="size-4 mr-1.5" />
                        Tambah Tahun Akademik
                    </Button>
                </div>

                {/* Filter and Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    Daftar Periode Akademik ({filteredYears.length})
                                </CardTitle>
                                <CardDescription>
                                    Hanya 1 periode tahun akademik yang dapat berstatus aktif pada satu waktu
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kode, tahun, semester..."
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
                                        <th className="pb-3 font-semibold">Tahun Akademik</th>
                                        <th className="pb-3 font-semibold">Semester</th>
                                        <th className="pb-3 font-semibold">Periode Tanggal</th>
                                        <th className="pb-3 font-semibold">Status Aktif</th>
                                        <th className="pb-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredYears.map((year) => (
                                        <tr
                                            key={year.id}
                                            className={`${
                                                year.is_active
                                                    ? 'bg-amber-500/5 dark:bg-amber-500/10'
                                                    : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
                                            }`}
                                        >
                                            <td className="py-3 font-mono font-medium text-xs text-slate-700 dark:text-slate-300">
                                                {year.kode}
                                            </td>
                                            <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                {year.tahun}
                                            </td>
                                            <td className="py-3">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs font-semibold ${
                                                        year.semester === 'Ganjil'
                                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                            : 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                                    }`}
                                                >
                                                    {year.semester}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-xs text-muted-foreground">
                                                {year.tanggal_mulai && year.tanggal_selesai ? (
                                                    <span>
                                                        {year.tanggal_mulai} s/d {year.tanggal_selesai}
                                                    </span>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="py-3">
                                                {year.is_active ? (
                                                    <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs gap-1">
                                                        <Sparkles className="size-3" />
                                                        Aktif Berjalan
                                                    </Badge>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs border-dashed text-slate-600 dark:text-slate-400 hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/50"
                                                        onClick={() => handleActivate(year)}
                                                    >
                                                        Set Jadi Aktif
                                                    </Button>
                                                )}
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => openEditModal(year)}
                                                    >
                                                        <Edit2 className="size-3.5 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        disabled={year.is_active}
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-30"
                                                        onClick={() => setDeletingYear(year)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredYears.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">
                                                Tidak ada data tahun akademik yang cocok.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Tahun Akademik */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Tambah Tahun Akademik</DialogTitle>
                            <DialogDescription>
                                Buat periode semester akademik baru untuk SPMI & AMI.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="kode" className="text-xs">Kode Semester *</Label>
                                    <Input
                                        id="kode"
                                        placeholder="Misal: 20251, 20252"
                                        value={formData.kode}
                                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="semester" className="text-xs">Semester *</Label>
                                    <select
                                        id="semester"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                    >
                                        <option value="Ganjil">Ganjil</option>
                                        <option value="Genap">Genap</option>
                                        <option value="Pendek">Pendek</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="tahun" className="text-xs">Tahun Kalender Akademik *</Label>
                                <Input
                                    id="tahun"
                                    placeholder="Misal: 2025/2026"
                                    value={formData.tahun}
                                    onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="tanggal_mulai" className="text-xs">Tanggal Mulai</Label>
                                    <Input
                                        id="tanggal_mulai"
                                        type="date"
                                        value={formData.tanggal_mulai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="tanggal_selesai" className="text-xs">Tanggal Selesai</Label>
                                    <Input
                                        id="tanggal_selesai"
                                        type="date"
                                        value={formData.tanggal_selesai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Tahun Akademik */}
            <Dialog open={Boolean(editingYear)} onOpenChange={(open) => !open && setEditingYear(null)}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Tahun Akademik</DialogTitle>
                            <DialogDescription>
                                Perbarui periode {editingYear?.tahun} {editingYear?.semester}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_kode" className="text-xs">Kode Semester *</Label>
                                    <Input
                                        id="edit_kode"
                                        value={formData.kode}
                                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_semester" className="text-xs">Semester *</Label>
                                    <select
                                        id="edit_semester"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                    >
                                        <option value="Ganjil">Ganjil</option>
                                        <option value="Genap">Genap</option>
                                        <option value="Pendek">Pendek</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_tahun" className="text-xs">Tahun Kalender Akademik *</Label>
                                <Input
                                    id="edit_tahun"
                                    value={formData.tahun}
                                    onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_tanggal_mulai" className="text-xs">Tanggal Mulai</Label>
                                    <Input
                                        id="edit_tanggal_mulai"
                                        type="date"
                                        value={formData.tanggal_mulai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_tanggal_selesai" className="text-xs">Tanggal Selesai</Label>
                                    <Input
                                        id="edit_tanggal_selesai"
                                        type="date"
                                        value={formData.tanggal_selesai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingYear(null)}>
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
            <Dialog open={Boolean(deletingYear)} onOpenChange={(open) => !open && setDeletingYear(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Tahun Akademik</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus tahun akademik{' '}
                            <strong>{deletingYear?.tahun} {deletingYear?.semester}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingYear(null)}>
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

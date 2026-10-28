import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    ArrowRight,
    Users,
    AlertTriangle,
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
import type { PeriodeAudit, TahunAkademik } from '@/types';

type Props = {
    periodes: PeriodeAudit[];
    tahunAkademiks: TahunAkademik[];
};

export default function PeriodeAuditIndex({ periodes, tahunAkademiks }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingPeriode, setEditingPeriode] = useState<PeriodeAudit | null>(null);
    const [deletingPeriode, setDeletingPeriode] = useState<PeriodeAudit | null>(null);

    const [formData, setFormData] = useState({
        kode: '',
        nama: '',
        tahun_akademik_id: tahunAkademiks[0]?.id ? String(tahunAkademiks[0].id) : '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        status: 'Draft',
        keterangan: '',
    });

    const resetForm = () => {
        setFormData({
            kode: '',
            nama: '',
            tahun_akademik_id: tahunAkademiks[0]?.id ? String(tahunAkademiks[0].id) : '',
            tanggal_mulai: '',
            tanggal_selesai: '',
            status: 'Draft',
            keterangan: '',
        });
    };

    const openAddModal = () => {
        resetForm();
        setIsAddOpen(true);
    };

    const openEditModal = (periode: PeriodeAudit) => {
        setEditingPeriode(periode);
        setFormData({
            kode: periode.kode,
            nama: periode.nama,
            tahun_akademik_id: String(periode.tahun_akademik_id),
            tanggal_mulai: periode.tanggal_mulai ? String(periode.tanggal_mulai).substring(0, 10) : '',
            tanggal_selesai: periode.tanggal_selesai ? String(periode.tanggal_selesai).substring(0, 10) : '',
            status: periode.status,
            keterangan: periode.keterangan || '',
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/ami/periode', formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                resetForm();
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPeriode) return;
        router.put(`/ami/periode/${editingPeriode.id}`, formData, {
            onSuccess: () => {
                setEditingPeriode(null);
                resetForm();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingPeriode) return;
        router.delete(`/ami/periode/${deletingPeriode.id}`, {
            onSuccess: () => {
                setDeletingPeriode(null);
            },
        });
    };

    const filteredPeriodes = periodes.filter(
        (p) =>
            p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.kode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Berjalan':
                return 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold';
            case 'Selesai':
                return 'bg-emerald-500 hover:bg-emerald-600 text-white font-bold';
            case 'RTM':
                return 'bg-purple-500 hover:bg-purple-600 text-white font-bold';
            default:
                return 'bg-slate-500 hover:bg-slate-600 text-white font-semibold';
        }
    };

    return (
        <>
            <Head title="Periode Audit Mutu Internal - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Calendar className="size-6 text-amber-500" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Siklus Periode Audit Mutu Internal (AMI)
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola siklus audit mutu internal rutin perguruan tinggi untuk mengukur kepatuhan standar SPMI.
                        </p>
                    </div>

                    <Button onClick={openAddModal} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                        <Plus className="size-4 mr-1.5" />
                        Tambah Periode AMI
                    </Button>
                </div>

                {/* Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <CardTitle className="text-base font-semibold">
                                Daftar Siklus AMI ({filteredPeriodes.length})
                            </CardTitle>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kode atau nama periode..."
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
                                        <th className="pb-3 font-semibold">Kode Siklus</th>
                                        <th className="pb-3 font-semibold">Nama Periode Audit</th>
                                        <th className="pb-3 font-semibold">Tahun Akademik</th>
                                        <th className="pb-3 font-semibold">Rentang Pelaksanaan</th>
                                        <th className="pb-3 font-semibold text-center">Unit/Prodi Diaudit</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                        <th className="pb-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredPeriodes.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                            <td className="py-3 font-mono font-medium text-xs text-slate-700 dark:text-slate-300">
                                                {p.kode}
                                            </td>
                                            <td className="py-3 max-w-sm">
                                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {p.nama}
                                                </div>
                                                {p.keterangan && (
                                                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                        {p.keterangan}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
                                                {p.tahun_akademik?.tahun} ({p.tahun_akademik?.semester})
                                            </td>
                                            <td className="py-3 text-xs text-muted-foreground">
                                                <span>
                                                    {String(p.tanggal_mulai).substring(0, 10)} s/d {String(p.tanggal_selesai).substring(0, 10)}
                                                </span>
                                            </td>
                                            <td className="py-3 text-center">
                                                <Link href={`/ami/jadwal?periode_id=${p.id}`}>
                                                    <Badge variant="outline" className="font-semibold text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                                                        {p.jadwals_count ?? p.jadwals?.length ?? 0} Auditee
                                                    </Badge>
                                                </Link>
                                            </td>
                                            <td className="py-3">
                                                <Badge className={`text-xs ${getStatusBadge(p.status)}`}>
                                                    {p.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link href={`/ami/jadwal?periode_id=${p.id}`}>
                                                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10">
                                                            Jadwal
                                                            <ArrowRight className="size-3" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => openEditModal(p)}
                                                    >
                                                        <Edit2 className="size-3.5 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        onClick={() => setDeletingPeriode(p)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPeriodes.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">
                                                Belum ada periode audit yang dibuat.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Periode */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Tambah Periode AMI</DialogTitle>
                            <DialogDescription>
                                Buka siklus audit mutu internal baru.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="kode" className="text-xs">Kode Periode *</Label>
                                    <Input
                                        id="kode"
                                        placeholder="Misal: AMI-2025/2026"
                                        value={formData.kode}
                                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="tahun_akademik_id" className="text-xs">Tahun Akademik *</Label>
                                    <select
                                        id="tahun_akademik_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.tahun_akademik_id}
                                        onChange={(e) => setFormData({ ...formData, tahun_akademik_id: e.target.value })}
                                        required
                                    >
                                        {tahunAkademiks.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.tahun} {t.semester}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="nama" className="text-xs">Nama Siklus Audit *</Label>
                                <Input
                                    id="nama"
                                    placeholder="Misal: Audit Mutu Internal Siklus 2025/2026"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="tanggal_mulai" className="text-xs">Tanggal Mulai *</Label>
                                    <Input
                                        id="tanggal_mulai"
                                        type="date"
                                        value={formData.tanggal_mulai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="tanggal_selesai" className="text-xs">Tanggal Selesai *</Label>
                                    <Input
                                        id="tanggal_selesai"
                                        type="date"
                                        value={formData.tanggal_selesai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="status" className="text-xs">Status Siklus *</Label>
                                <select
                                    id="status"
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Draft">Draft (Perencanaan)</option>
                                    <option value="Berjalan">Berjalan (Visitasi & Audit)</option>
                                    <option value="RTM">RTM (Rapat Tinjauan Manajemen)</option>
                                    <option value="Selesai">Selesai (Closed)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="keterangan" className="text-xs">Keterangan / Sasaran Audit</Label>
                                <textarea
                                    id="keterangan"
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    value={formData.keterangan}
                                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Simpan Periode
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Periode */}
            <Dialog open={Boolean(editingPeriode)} onOpenChange={(open) => !open && setEditingPeriode(null)}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Periode AMI</DialogTitle>
                            <DialogDescription>
                                Perbarui informasi periode {editingPeriode?.kode}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_kode" className="text-xs">Kode Periode *</Label>
                                    <Input
                                        id="edit_kode"
                                        value={formData.kode}
                                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_tahun_akademik_id" className="text-xs">Tahun Akademik *</Label>
                                    <select
                                        id="edit_tahun_akademik_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.tahun_akademik_id}
                                        onChange={(e) => setFormData({ ...formData, tahun_akademik_id: e.target.value })}
                                        required
                                    >
                                        {tahunAkademiks.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.tahun} {t.semester}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_nama" className="text-xs">Nama Siklus Audit *</Label>
                                <Input
                                    id="edit_nama"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_tanggal_mulai" className="text-xs">Tanggal Mulai *</Label>
                                    <Input
                                        id="edit_tanggal_mulai"
                                        type="date"
                                        value={formData.tanggal_mulai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_tanggal_selesai" className="text-xs">Tanggal Selesai *</Label>
                                    <Input
                                        id="edit_tanggal_selesai"
                                        type="date"
                                        value={formData.tanggal_selesai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_status" className="text-xs">Status Siklus *</Label>
                                <select
                                    id="edit_status"
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Draft">Draft (Perencanaan)</option>
                                    <option value="Berjalan">Berjalan (Visitasi & Audit)</option>
                                    <option value="RTM">RTM (Rapat Tinjauan Manajemen)</option>
                                    <option value="Selesai">Selesai (Closed)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_keterangan" className="text-xs">Keterangan / Sasaran Audit</Label>
                                <textarea
                                    id="edit_keterangan"
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    value={formData.keterangan}
                                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingPeriode(null)}>
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
            <Dialog open={Boolean(deletingPeriode)} onOpenChange={(open) => !open && setDeletingPeriode(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Periode AMI</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus periode{' '}
                            <strong>{deletingPeriode?.nama}</strong>? Seluruh jadwal audit dan temuan di dalamnya akan ikut terhapus.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingPeriode(null)}>
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

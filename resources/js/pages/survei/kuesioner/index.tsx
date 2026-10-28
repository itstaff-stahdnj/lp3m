import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    FilePieChart,
    Plus,
    Search,
    Edit2,
    Trash2,
    Calendar,
    Users,
    CheckCircle2,
    Clock,
    ArrowRight,
    HelpCircle,
    UserCheck,
    GraduationCap,
    Send,
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
import type { Kuesioner, TahunAkademik } from '@/types';

type Stats = {
    total_kuesioner: number;
    active_kuesioner: number;
    total_respons: number;
    edom_count: number;
    kepuasan_count: number;
};

type Props = {
    kuesioners: Kuesioner[];
    tahunAkademiks: TahunAkademik[];
    stats: Stats;
};

export default function KuesionerIndex({ kuesioners, tahunAkademiks, stats }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [deletingKuesioner, setDeletingKuesioner] = useState<Kuesioner | null>(null);

    const activeTa = tahunAkademiks.find((t) => t.is_active) ?? tahunAkademiks[0];

    const [formData, setFormData] = useState({
        kode: `SURVEI-${new Date().getFullYear()}-${String(kuesioners.length + 1).padStart(3, '0')}`,
        judul: '',
        tipe: 'EDOM',
        deskripsi: '',
        tahun_akademik_id: activeTa?.id ? String(activeTa.id) : '',
        tanggal_mulai: new Date().toISOString().substring(0, 10),
        tanggal_selesai: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        target_role: 'mahasiswa',
        is_active: true,
    });

    const resetForm = () => {
        setFormData({
            kode: `SURVEI-${new Date().getFullYear()}-${String(kuesioners.length + 1).padStart(3, '0')}`,
            judul: '',
            tipe: 'EDOM',
            deskripsi: '',
            tahun_akademik_id: activeTa?.id ? String(activeTa.id) : '',
            tanggal_mulai: new Date().toISOString().substring(0, 10),
            tanggal_selesai: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
            target_role: 'mahasiswa',
            is_active: true,
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/survei/kuesioner', formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                resetForm();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingKuesioner) return;
        router.delete(`/survei/kuesioner/${deletingKuesioner.id}`, {
            onSuccess: () => {
                setDeletingKuesioner(null);
            },
        });
    };

    const getTipeBadge = (tipe: string) => {
        switch (tipe) {
            case 'EDOM':
                return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30';
            case 'KepuasanMahasiswa':
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
            case 'KepuasanDosen':
            case 'KepuasanTendik':
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
            case 'KepuasanMitra':
                return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
            default:
                return 'bg-slate-500/10 text-muted-foreground border-slate-500/20';
        }
    };

    const filteredKuesioners = kuesioners.filter((k) => {
        return (
            k.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
            k.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            k.tipe.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <>
            <Head title="Kuesioner & Survei Kepuasan - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <FilePieChart className="size-6 text-amber-500" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Kuesioner Survei & EDOM
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manajemen kuesioner evaluasi dosen oleh mahasiswa (EDOM) dan survei kepuasan pemangku kepentingan.
                        </p>
                    </div>

                    <Button onClick={() => setIsAddOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                        <Plus className="size-4 mr-1.5" />
                        Buat Kuesioner Baru
                    </Button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-card border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
                        <div className="text-xs text-muted-foreground font-semibold">Total Kuesioner</div>
                        <div className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">
                            {stats.total_kuesioner}
                        </div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                        <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Sedang Dibuka</div>
                        <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                            {stats.active_kuesioner}
                        </div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                        <div className="text-xs text-purple-700 dark:text-purple-400 font-semibold">Total Responden Masuk</div>
                        <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                            {stats.total_respons}
                        </div>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                        <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Instrumen EDOM</div>
                        <div className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
                            {stats.edom_count}
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    Daftar Instrumen Kuesioner ({filteredKuesioners.length})
                                </CardTitle>
                                <CardDescription>
                                    Kelola butir pertanyaan, pantau pengisian, atau bagikan tautan survei.
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari judul kuesioner, kode..."
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
                                        <th className="pb-3 font-semibold">Kuesioner & Kode</th>
                                        <th className="pb-3 font-semibold">Kategori / Tipe</th>
                                        <th className="pb-3 font-semibold">Tahun Akademik</th>
                                        <th className="pb-3 font-semibold">Periode Pengisian</th>
                                        <th className="pb-3 font-semibold text-center">Butir / Responden</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                        <th className="pb-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredKuesioners.map((k) => (
                                        <tr key={k.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                            <td className="py-3 max-w-sm">
                                                <div className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                                                    {k.judul}
                                                </div>
                                                <span className="font-mono text-[10px] text-muted-foreground bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                                    {k.kode}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <Badge className={`text-xs ${getTipeBadge(k.tipe)}`}>
                                                    {k.tipe === 'EDOM' ? 'EDOM (Evaluasi Dosen)' : k.tipe.replace(/([A-Z])/g, ' $1').trim()}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-xs text-muted-foreground">
                                                {k.tahun_akademik?.kode || '-'}
                                            </td>
                                            <td className="py-3 text-xs">
                                                <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                                                    <Calendar className="size-3 text-muted-foreground" />
                                                    <span>
                                                        {String(k.tanggal_mulai).substring(0, 10)} s.d.{' '}
                                                        {String(k.tanggal_selesai).substring(0, 10)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-center text-xs">
                                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {k.pertanyaans_count ?? 0} Pertanyaan
                                                </div>
                                                <div className="text-[11px] text-muted-foreground">
                                                    {k.respons_count ?? 0} Responden
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                {k.is_active ? (
                                                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                                                        Buka
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                                        Tutup
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link href={`/survei/kuesioner/${k.id}/isi`}>
                                                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1 border-purple-500/30 text-purple-700 dark:text-purple-400 hover:bg-purple-500/10" title="Isi Survei">
                                                            <Send className="size-3" />
                                                            Isi
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/survei/kuesioner/${k.id}`}>
                                                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10">
                                                            Kelola
                                                            <ArrowRight className="size-3" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        onClick={() => setDeletingKuesioner(k)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredKuesioners.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">
                                                Belum ada kuesioner survei yang dibuat.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Kuesioner Baru */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Buat Instrumen Kuesioner Baru</DialogTitle>
                            <DialogDescription>
                                Tentukan judul instrumen, jenis kuesioner, dan periode waktu pengisian responden.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Kode Kuesioner *</Label>
                                    <Input
                                        value={formData.kode}
                                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Tipe Kuesioner *</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={formData.tipe}
                                        onChange={(e) => setFormData({ ...formData, tipe: e.target.value as any })}
                                    >
                                        <option value="EDOM">EDOM (Evaluasi Dosen Oleh Mahasiswa)</option>
                                        <option value="KepuasanMahasiswa">Kepuasan Layanan Mahasiswa</option>
                                        <option value="KepuasanDosen">Kepuasan Dosen</option>
                                        <option value="KepuasanTendik">Kepuasan Tenaga Kependidikan</option>
                                        <option value="KepuasanMitra">Kepuasan Mitra Kerjasama / Pengguna</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Judul Instrumen Kuesioner *</Label>
                                <Input
                                    placeholder="Contoh: EDOM Semester Genap 2025/2026..."
                                    value={formData.judul}
                                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Deskripsi & Petunjuk Pengisian</Label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Petunjuk teknis pengisian kuesioner..."
                                    value={formData.deskripsi}
                                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Tahun Akademik *</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={formData.tahun_akademik_id}
                                        onChange={(e) => setFormData({ ...formData, tahun_akademik_id: e.target.value })}
                                        required
                                    >
                                        {tahunAkademiks.map((ta) => (
                                            <option key={ta.id} value={ta.id}>
                                                {ta.kode} - {ta.tahun} ({ta.semester})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Target Responden</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={formData.target_role}
                                        onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                                    >
                                        <option value="mahasiswa">Mahasiswa</option>
                                        <option value="dosen">Dosen</option>
                                        <option value="tendik">Tenaga Kependidikan</option>
                                        <option value="mitra">Mitra / Pengguna Lulusan</option>
                                        <option value="umum">Umum</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Tanggal Mulai Buka *</Label>
                                    <Input
                                        type="date"
                                        value={formData.tanggal_mulai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Tanggal Selesai Tutup *</Label>
                                    <Input
                                        type="date"
                                        value={formData.tanggal_selesai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Simpan Kuesioner
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={Boolean(deletingKuesioner)} onOpenChange={(open) => !open && setDeletingKuesioner(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Kuesioner</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus kuesioner ini? Seluruh butir pertanyaan dan respon yang telah masuk akan ikut terhapus.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingKuesioner(null)}>
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

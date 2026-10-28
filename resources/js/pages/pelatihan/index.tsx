import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    Plus,
    Search,
    Calendar,
    Users,
    Clock,
    BookOpen,
    MapPin,
    ArrowRight,
    Edit2,
    Trash2,
    CheckCircle2,
    Briefcase,
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
import type { Pelatihan } from '@/types';

type Stats = {
    total_pelatihan: number;
    selesai_count: number;
    berjalan_count: number;
    akan_datang_count: number;
    total_peserta: number;
    total_sertifikat: number;
};

type Props = {
    pelatihans: Pelatihan[];
    stats: Stats;
    currentKategori: string;
    currentStatus: string;
};

export default function PelatihanIndex({
    pelatihans,
    stats,
    currentKategori,
    currentStatus,
}: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [deletingPelatihan, setDeletingPelatihan] = useState<Pelatihan | null>(null);

    const [formData, setFormData] = useState({
        kode: `PEL-${new Date().getFullYear()}-${String(pelatihans.length + 1).padStart(3, '0')}`,
        judul: '',
        kategori: 'Pedagogik & Kurikulum',
        narasumber: '',
        penyelenggara: 'LP3M STAH Dharma Nusantara Jakarta',
        tanggal_mulai: new Date().toISOString().substring(0, 10),
        tanggal_selesai: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        lokasi: 'Auditorium Utama STAH DNJ',
        kuota: '30',
        jam_pelajaran: '32',
        status: 'Akan Datang',
        deskripsi: '',
        silabus_materi: '',
    });

    const resetForm = () => {
        setFormData({
            kode: `PEL-${new Date().getFullYear()}-${String(pelatihans.length + 1).padStart(3, '0')}`,
            judul: '',
            kategori: 'Pedagogik & Kurikulum',
            narasumber: '',
            penyelenggara: 'LP3M STAH Dharma Nusantara Jakarta',
            tanggal_mulai: new Date().toISOString().substring(0, 10),
            tanggal_selesai: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
            lokasi: 'Auditorium Utama STAH DNJ',
            kuota: '30',
            jam_pelajaran: '32',
            status: 'Akan Datang',
            deskripsi: '',
            silabus_materi: '',
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/pelatihan', formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                resetForm();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingPelatihan) return;
        router.delete(`/pelatihan/${deletingPelatihan.id}`, {
            onSuccess: () => {
                setDeletingPelatihan(null);
            },
        });
    };

    const handleFilterChange = (kategori: string, status: string) => {
        router.get(
            '/pelatihan',
            {
                kategori: kategori !== 'all' ? kategori : undefined,
                status: status !== 'all' ? status : undefined,
            },
            { preserveState: true }
        );
    };

    const getKategoriBadge = (kategori: string) => {
        switch (kategori) {
            case 'Pedagogik & Kurikulum':
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
            case 'Penelitian & Publikasi':
                return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30';
            case 'Pengabdian Masyarakat':
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
            case 'Penjaminan Mutu SPMI':
                return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
            default:
                return 'bg-slate-500/10 text-muted-foreground border-slate-500/20';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Selesai':
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-bold';
            case 'Sedang Berjalan':
                return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 font-bold';
            default:
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30 font-bold';
        }
    };

    const filteredPelatihans = pelatihans.filter((p) => {
        return (
            p.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.narasumber && p.narasumber.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    return (
        <>
            <Head title="Pelatihan & Workshop SDM - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Award className="size-6 text-amber-500" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Pelatihan & Pengembangan SDM
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Peningkatan kompetensi pedagogik, penelitian, kurikulum OBE, dan sertifikasi auditor mutu dosen serta tendik.
                        </p>
                    </div>

                    <Button onClick={() => setIsAddOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                        <Plus className="size-4 mr-1.5" />
                        Buat Agenda Pelatihan
                    </Button>
                </div>

                {/* Hero Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="bg-card border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
                        <div className="text-xs text-muted-foreground font-semibold">Total Pelatihan</div>
                        <div className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">{stats.total_pelatihan}</div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                        <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Telah Selesai</div>
                        <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{stats.selesai_count}</div>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                        <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Sedang Berjalan</div>
                        <div className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{stats.berjalan_count}</div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <div className="text-xs text-blue-700 dark:text-blue-400 font-semibold">Akan Datang</div>
                        <div className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">{stats.akan_datang_count}</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                        <div className="text-xs text-purple-700 dark:text-purple-400 font-semibold">Total Peserta</div>
                        <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">{stats.total_peserta}</div>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                        <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Sertifikat Terbit</div>
                        <div className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{stats.total_sertifikat}</div>
                    </div>
                </div>

                {/* Filter & List Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    Agenda & Workshop Mutu SDM ({filteredPelatihans.length})
                                </CardTitle>
                                <CardDescription>
                                    Kelola daftar peserta, rekapitulasi kehadiran, serta penerbitan e-sertifikat resmi LP3M.
                                </CardDescription>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative w-full sm:w-60">
                                    <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari judul, narasumber..."
                                        className="pl-9 h-9 text-xs"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-2.5 py-1 text-xs">
                                    <span className="text-muted-foreground">Kategori:</span>
                                    <select
                                        className="bg-transparent font-medium focus:outline-none"
                                        value={currentKategori}
                                        onChange={(e) => handleFilterChange(e.target.value, currentStatus)}
                                    >
                                        <option value="all">Semua Kategori</option>
                                        <option value="Pedagogik & Kurikulum">Pedagogik & Kurikulum</option>
                                        <option value="Penelitian & Publikasi">Penelitian & Publikasi</option>
                                        <option value="Pengabdian Masyarakat">Pengabdian Masyarakat</option>
                                        <option value="Penjaminan Mutu SPMI">Penjaminan Mutu SPMI</option>
                                        <option value="Pengembangan Tendik">Pengembangan Tendik</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-2.5 py-1 text-xs">
                                    <span className="text-muted-foreground">Status:</span>
                                    <select
                                        className="bg-transparent font-medium focus:outline-none"
                                        value={currentStatus}
                                        onChange={(e) => handleFilterChange(currentKategori, e.target.value)}
                                    >
                                        <option value="all">Semua Status</option>
                                        <option value="Akan Datang">Akan Datang</option>
                                        <option value="Sedang Berjalan">Sedang Berjalan</option>
                                        <option value="Selesai">Selesai</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredPelatihans.map((p) => (
                                <Card
                                    key={p.id}
                                    className="border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-xs"
                                >
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                {p.kode}
                                            </span>
                                            <Badge className={`text-[10px] ${getStatusBadge(p.status)}`}>
                                                {p.status}
                                            </Badge>
                                        </div>

                                        <div>
                                            <Badge variant="outline" className={`text-[10px] mb-1.5 ${getKategoriBadge(p.kategori)}`}>
                                                {p.kategori}
                                            </Badge>
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                                                {p.judul}
                                            </h3>
                                            {p.narasumber && (
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                    Narasumber: <strong>{p.narasumber}</strong>
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="size-3.5 text-amber-500 shrink-0" />
                                                <span>
                                                    {String(p.tanggal_mulai).substring(0, 10)} s.d. {String(p.tanggal_selesai).substring(0, 10)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="size-3.5 text-blue-500 shrink-0" />
                                                <span>Beban Belajar: {p.jam_pelajaran} JP</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users className="size-3.5 text-emerald-500 shrink-0" />
                                                <span>
                                                    Peserta: <strong>{p.pesertas_count ?? 0}</strong> / Kuota: {p.kuota}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                            onClick={() => setDeletingPelatihan(p)}
                                        >
                                            <Trash2 className="size-3.5" />
                                        </Button>

                                        <Link href={`/pelatihan/${p.id}`}>
                                            <Button size="sm" variant="outline" className="h-8 text-xs gap-1 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10">
                                                Kelola Peserta & Sertifikat
                                                <ArrowRight className="size-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {filteredPelatihans.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground text-sm">
                                Belum ada agenda pelatihan atau workshop SDM yang sesuai dengan filter.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modal Buat Pelatihan Baru */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Buat Agenda Pelatihan / Workshop</DialogTitle>
                            <DialogDescription>
                                Daftarkan kegiatan peningkatan kompetensi SDM dosen dan tenaga kependidikan.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Kode Agenda *</Label>
                                    <Input
                                        value={formData.kode}
                                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Kategori Pelatihan *</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={formData.kategori}
                                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                                    >
                                        <option value="Pedagogik & Kurikulum">Pedagogik & Kurikulum</option>
                                        <option value="Penelitian & Publikasi">Penelitian & Publikasi</option>
                                        <option value="Pengabdian Masyarakat">Pengabdian Masyarakat</option>
                                        <option value="Penjaminan Mutu SPMI">Penjaminan Mutu SPMI</option>
                                        <option value="Pengembangan Tendik">Pengembangan Tendik</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Judul Pelatihan / Workshop *</Label>
                                <Input
                                    placeholder="Contoh: Workshop Kurikulum Berbasis OBE..."
                                    value={formData.judul}
                                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Narasumber / Instruktur</Label>
                                    <Input
                                        placeholder="Nama narasumber & instansi..."
                                        value={formData.narasumber}
                                        onChange={(e) => setFormData({ ...formData, narasumber: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Lembaga Penyelenggara *</Label>
                                    <Input
                                        value={formData.penyelenggara}
                                        onChange={(e) => setFormData({ ...formData, penyelenggara: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Tanggal Mulai *</Label>
                                    <Input
                                        type="date"
                                        value={formData.tanggal_mulai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Tanggal Selesai *</Label>
                                    <Input
                                        type="date"
                                        value={formData.tanggal_selesai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Lokasi Ruang</Label>
                                    <Input
                                        value={formData.lokasi}
                                        onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Kuota Peserta *</Label>
                                    <Input
                                        type="number"
                                        value={formData.kuota}
                                        onChange={(e) => setFormData({ ...formData, kuota: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Jam Belajar (JP) *</Label>
                                    <Input
                                        type="number"
                                        value={formData.jam_pelajaran}
                                        onChange={(e) => setFormData({ ...formData, jam_pelajaran: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Status Pelaksanaan *</Label>
                                <select
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                >
                                    <option value="Akan Datang">Akan Datang</option>
                                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Deskripsi Kegiatan</Label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Tujuan dan gambaran umum pelatihan..."
                                    value={formData.deskripsi}
                                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Silabus / Materi Pokok Bahasan</Label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Daftar modul materi yang diajarkan..."
                                    value={formData.silabus_materi}
                                    onChange={(e) => setFormData({ ...formData, silabus_materi: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Simpan Agenda
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={Boolean(deletingPelatihan)} onOpenChange={(open) => !open && setDeletingPelatihan(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Agenda Pelatihan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus agenda pelatihan ini? Seluruh data peserta dan sertifikat terdaftar akan ikut terhapus.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingPelatihan(null)}>
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

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    UserCheck,
    Plus,
    Search,
    Edit2,
    Trash2,
    Briefcase,
    GraduationCap,
    Clock,
    TrendingUp,
    Building2,
    DollarSign,
    CheckCircle2,
    Filter,
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
import type { ProgramStudi, TracerStudy } from '@/types';

type Stats = {
    total_alumni: number;
    serapan_persen: number;
    relevansi_persen: number;
    avg_masa_tunggu: number;
    wiraswasta_count: number;
    lanjut_studi_count: number;
};

type Props = {
    alumnis: TracerStudy[];
    prodis: ProgramStudi[];
    stats: Stats;
    currentProdi: string;
    currentTahun: string;
};

export default function TracerStudyIndex({
    alumnis,
    prodis,
    stats,
    currentProdi,
    currentTahun,
}: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingAlumni, setEditingAlumni] = useState<TracerStudy | null>(null);
    const [deletingAlumni, setDeletingAlumni] = useState<TracerStudy | null>(null);

    const [formData, setFormData] = useState({
        program_studi_id: prodis[0]?.id ? String(prodis[0].id) : '',
        tahun_lulus: String(new Date().getFullYear()),
        nama_alumni: '',
        nim: '',
        email: '',
        nomor_hp: '',
        status_alumni: 'Bekerja Penuh',
        nama_instansi: '',
        posisi_jabatan: '',
        masa_tunggu_bulan: '3',
        pendapatan_bulanan: '3 - 5 Juta',
        kesesuaian_bidang: 'Sesuai',
        rekomendasi_alumni: '',
    });

    const resetForm = () => {
        setFormData({
            program_studi_id: prodis[0]?.id ? String(prodis[0].id) : '',
            tahun_lulus: String(new Date().getFullYear()),
            nama_alumni: '',
            nim: '',
            email: '',
            nomor_hp: '',
            status_alumni: 'Bekerja Penuh',
            nama_instansi: '',
            posisi_jabatan: '',
            masa_tunggu_bulan: '3',
            pendapatan_bulanan: '3 - 5 Juta',
            kesesuaian_bidang: 'Sesuai',
            rekomendasi_alumni: '',
        });
    };

    const openAddModal = () => {
        resetForm();
        setIsAddOpen(true);
    };

    const openEditModal = (a: TracerStudy) => {
        setEditingAlumni(a);
        setFormData({
            program_studi_id: String(a.program_studi_id),
            tahun_lulus: String(a.tahun_lulus),
            nama_alumni: a.nama_alumni,
            nim: a.nim,
            email: a.email || '',
            nomor_hp: a.nomor_hp || '',
            status_alumni: a.status_alumni,
            nama_instansi: a.nama_instansi || '',
            posisi_jabatan: a.posisi_jabatan || '',
            masa_tunggu_bulan: String(a.masa_tunggu_bulan),
            pendapatan_bulanan: a.pendapatan_bulanan,
            kesesuaian_bidang: a.kesesuaian_bidang,
            rekomendasi_alumni: a.rekomendasi_alumni || '',
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/tracer', formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                resetForm();
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAlumni) return;
        router.put(`/tracer/${editingAlumni.id}`, formData, {
            onSuccess: () => {
                setEditingAlumni(null);
                resetForm();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingAlumni) return;
        router.delete(`/tracer/${deletingAlumni.id}`, {
            onSuccess: () => {
                setDeletingAlumni(null);
            },
        });
    };

    const handleFilterChange = (prodiId: string, tahun: string) => {
        router.get(
            '/tracer',
            {
                prodi_id: prodiId !== 'all' ? prodiId : undefined,
                tahun_lulus: tahun !== 'all' ? tahun : undefined,
            },
            { preserveState: true }
        );
    };

    const getStatusAlumniBadge = (status: string) => {
        switch (status) {
            case 'Bekerja Penuh':
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-semibold';
            case 'Wiraswasta':
                return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30 font-semibold';
            case 'Melanjutkan Studi':
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30 font-semibold';
            case 'Bekerja Paruh Waktu':
                return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
            default:
                return 'bg-slate-500/10 text-muted-foreground border-slate-500/20';
        }
    };

    const getKesesuaianBadge = (k: string) => {
        switch (k) {
            case 'Sangat Sesuai':
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
            case 'Sesuai':
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
            case 'Kurang Sesuai':
                return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
            default:
                return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30';
        }
    };

    const filteredAlumnis = alumnis.filter((a) => {
        return (
            a.nama_alumni.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.nama_instansi && a.nama_instansi.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (a.posisi_jabatan && a.posisi_jabatan.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    // Unique graduation years
    const years = Array.from(new Set(alumnis.map((a) => a.tahun_lulus))).sort((a, b) => b - a);

    return (
        <>
            <Head title="Tracer Study Alumni - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <UserCheck className="size-6 text-amber-500" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Tracer Study Alumni
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Pelacakan jejak alumni, waktu tunggu kerja, daya serap industri, dan relevansi kurikulum STAH Dharma Nusantara Jakarta.
                        </p>
                    </div>

                    <Button onClick={openAddModal} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                        <Plus className="size-4 mr-1.5" />
                        Tambah Data Alumni
                    </Button>
                </div>

                {/* Hero Stat Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="bg-card border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
                        <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                            <GraduationCap className="size-3.5 text-blue-500" />
                            Total Alumni Terdata
                        </div>
                        <div className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">
                            {stats.total_alumni}
                        </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                        <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                            <Briefcase className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            Tingkat Serapan Kerja
                        </div>
                        <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                            {stats.serapan_persen}%
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <div className="text-xs text-blue-700 dark:text-blue-400 font-semibold flex items-center gap-1.5">
                            <TrendingUp className="size-3.5 text-blue-600 dark:text-blue-400" />
                            Kesesuaian Bidang
                        </div>
                        <div className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                            {stats.relevansi_persen}%
                        </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                        <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                            <Clock className="size-3.5 text-amber-600 dark:text-amber-400" />
                            Rata Masa Tunggu
                        </div>
                        <div className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
                            {stats.avg_masa_tunggu} <span className="text-sm font-normal">Bulan</span>
                        </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 col-span-2 sm:col-span-1">
                        <div className="text-xs text-purple-700 dark:text-purple-400 font-semibold flex items-center gap-1.5">
                            <Building2 className="size-3.5 text-purple-600 dark:text-purple-400" />
                            Wirausaha / Studi Lanjut
                        </div>
                        <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                            {stats.wiraswasta_count + stats.lanjut_studi_count}
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    Daftar Alumni & Riwayat Karir ({filteredAlumnis.length})
                                </CardTitle>
                                <CardDescription>
                                    Data status pekerjaan, instansi tempat kerja, masa tunggu, dan tingkat kepuasan kurikulum.
                                </CardDescription>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative w-full sm:w-60">
                                    <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama, NIM, instansi..."
                                        className="pl-9 h-9 text-xs"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-2.5 py-1 text-xs">
                                    <span className="text-muted-foreground">Prodi:</span>
                                    <select
                                        className="bg-transparent font-medium focus:outline-none"
                                        value={currentProdi}
                                        onChange={(e) => handleFilterChange(e.target.value, currentTahun)}
                                    >
                                        <option value="all">Semua Prodi</option>
                                        {prodis.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.jenjang} {p.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-2.5 py-1 text-xs">
                                    <span className="text-muted-foreground">Lulus:</span>
                                    <select
                                        className="bg-transparent font-medium focus:outline-none"
                                        value={currentTahun}
                                        onChange={(e) => handleFilterChange(currentProdi, e.target.value)}
                                    >
                                        <option value="all">Semua Tahun</option>
                                        {years.map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-muted-foreground uppercase">
                                        <th className="pb-3 font-semibold">Nama Alumni & NIM</th>
                                        <th className="pb-3 font-semibold">Prodi & Lulus</th>
                                        <th className="pb-3 font-semibold">Status Pekerjaan</th>
                                        <th className="pb-3 font-semibold">Tempat Kerja & Posisi</th>
                                        <th className="pb-3 font-semibold text-center">Masa Tunggu</th>
                                        <th className="pb-3 font-semibold">Kesesuaian Bidang</th>
                                        <th className="pb-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredAlumnis.map((a) => (
                                        <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 text-xs">
                                            <td className="py-3">
                                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {a.nama_alumni}
                                                </div>
                                                <span className="font-mono text-[10px] text-muted-foreground">
                                                    {a.nim}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="font-medium text-slate-800 dark:text-slate-200">
                                                    {a.program_studi?.kode}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground block">
                                                    Lulus: {a.tahun_lulus}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <Badge className={`text-[10px] ${getStatusAlumniBadge(a.status_alumni)}`}>
                                                    {a.status_alumni}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <div className="font-medium text-slate-900 dark:text-slate-100">
                                                    {a.nama_instansi || '-'}
                                                </div>
                                                <span className="text-[11px] text-muted-foreground block">
                                                    {a.posisi_jabatan || '-'}
                                                </span>
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className="font-bold text-slate-900 dark:text-slate-100">
                                                    {a.masa_tunggu_bulan}
                                                </span>{' '}
                                                <span className="text-[10px] text-muted-foreground">Bulan</span>
                                            </td>
                                            <td className="py-3">
                                                <Badge className={`text-[10px] ${getKesesuaianBadge(a.kesesuaian_bidang)}`}>
                                                    {a.kesesuaian_bidang}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground block mt-0.5">
                                                    Gaji: {a.pendapatan_bulanan}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => openEditModal(a)}
                                                    >
                                                        <Edit2 className="size-3.5 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        onClick={() => setDeletingAlumni(a)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredAlumnis.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">
                                                Belum ada data tracer study alumni yang sesuai dengan filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Alumni */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Tambah Data Tracer Alumni</DialogTitle>
                            <DialogDescription>
                                Input data profil kelulusan dan jejak karir alumni.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Program Studi *</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={formData.program_studi_id}
                                        onChange={(e) => setFormData({ ...formData, program_studi_id: e.target.value })}
                                        required
                                    >
                                        {prodis.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.jenjang} {p.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Tahun Lulus *</Label>
                                    <Input
                                        type="number"
                                        value={formData.tahun_lulus}
                                        onChange={(e) => setFormData({ ...formData, tahun_lulus: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Nama Lengkap Alumni *</Label>
                                    <Input
                                        placeholder="Nama & gelar..."
                                        value={formData.nama_alumni}
                                        onChange={(e) => setFormData({ ...formData, nama_alumni: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">NIM *</Label>
                                    <Input
                                        placeholder="Nomor Induk Mahasiswa..."
                                        value={formData.nim}
                                        onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Email</Label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Nomor WhatsApp / HP</Label>
                                    <Input
                                        placeholder="0812..."
                                        value={formData.nomor_hp}
                                        onChange={(e) => setFormData({ ...formData, nomor_hp: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Status Karir Saat Ini *</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={formData.status_alumni}
                                        onChange={(e) => setFormData({ ...formData, status_alumni: e.target.value as any })}
                                    >
                                        <option value="Bekerja Penuh">Bekerja Penuh</option>
                                        <option value="Bekerja Paruh Waktu">Bekerja Paruh Waktu</option>
                                        <option value="Wiraswasta">Wiraswasta / Mandiri</option>
                                        <option value="Melanjutkan Studi">Melanjutkan Studi (S2/S3)</option>
                                        <option value="Mencari Kerja">Mencari Kerja</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Masa Tunggu (Bulan) *</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={formData.masa_tunggu_bulan}
                                        onChange={(e) => setFormData({ ...formData, masa_tunggu_bulan: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Nama Instansi / Perusahaan</Label>
                                    <Input
                                        placeholder="Nama tempat kerja / usaha..."
                                        value={formData.nama_instansi}
                                        onChange={(e) => setFormData({ ...formData, nama_instansi: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Posisi / Jabatan</Label>
                                    <Input
                                        placeholder="Guru, Penyuluh, Direktur..."
                                        value={formData.posisi_jabatan}
                                        onChange={(e) => setFormData({ ...formData, posisi_jabatan: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Kesesuaian Bidang Studi *</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={formData.kesesuaian_bidang}
                                        onChange={(e) => setFormData({ ...formData, kesesuaian_bidang: e.target.value as any })}
                                    >
                                        <option value="Sangat Sesuai">Sangat Sesuai</option>
                                        <option value="Sesuai">Sesuai</option>
                                        <option value="Kurang Sesuai">Kurang Sesuai</option>
                                        <option value="Tidak Sesuai">Tidak Sesuai</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Kisaran Pendapatan *</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={formData.pendapatan_bulanan}
                                        onChange={(e) => setFormData({ ...formData, pendapatan_bulanan: e.target.value as any })}
                                    >
                                        <option value="< 3 Juta">&lt; 3 Juta</option>
                                        <option value="3 - 5 Juta">3 - 5 Juta</option>
                                        <option value="5 - 10 Juta">5 - 10 Juta</option>
                                        <option value="> 10 Juta">&gt; 10 Juta</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Rekomendasi Alumni untuk Kurikulum STAH DNJ</Label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Masukan mata kuliah baru, sertifikasi, atau keterampilan praktis..."
                                    value={formData.rekomendasi_alumni}
                                    onChange={(e) => setFormData({ ...formData, rekomendasi_alumni: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Simpan Data Alumni
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Alumni */}
            <Dialog open={Boolean(editingAlumni)} onOpenChange={(open) => !open && setEditingAlumni(null)}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Data Tracer Alumni</DialogTitle>
                            <DialogDescription>
                                Perbarui riwayat karir {editingAlumni?.nama_alumni}.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Nama Lengkap Alumni *</Label>
                                    <Input
                                        value={formData.nama_alumni}
                                        onChange={(e) => setFormData({ ...formData, nama_alumni: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">NIM *</Label>
                                    <Input
                                        value={formData.nim}
                                        onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Status Karir *</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={formData.status_alumni}
                                        onChange={(e) => setFormData({ ...formData, status_alumni: e.target.value as any })}
                                    >
                                        <option value="Bekerja Penuh">Bekerja Penuh</option>
                                        <option value="Bekerja Paruh Waktu">Bekerja Paruh Waktu</option>
                                        <option value="Wiraswasta">Wiraswasta / Mandiri</option>
                                        <option value="Melanjutkan Studi">Melanjutkan Studi (S2/S3)</option>
                                        <option value="Mencari Kerja">Mencari Kerja</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Masa Tunggu (Bulan)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={formData.masa_tunggu_bulan}
                                        onChange={(e) => setFormData({ ...formData, masa_tunggu_bulan: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Nama Instansi / Usaha</Label>
                                    <Input
                                        value={formData.nama_instansi}
                                        onChange={(e) => setFormData({ ...formData, nama_instansi: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Posisi / Jabatan</Label>
                                    <Input
                                        value={formData.posisi_jabatan}
                                        onChange={(e) => setFormData({ ...formData, posisi_jabatan: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Kesesuaian Bidang Studi</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={formData.kesesuaian_bidang}
                                        onChange={(e) => setFormData({ ...formData, kesesuaian_bidang: e.target.value as any })}
                                    >
                                        <option value="Sangat Sesuai">Sangat Sesuai</option>
                                        <option value="Sesuai">Sesuai</option>
                                        <option value="Kurang Sesuai">Kurang Sesuai</option>
                                        <option value="Tidak Sesuai">Tidak Sesuai</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Pendapatan Bulanan</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={formData.pendapatan_bulanan}
                                        onChange={(e) => setFormData({ ...formData, pendapatan_bulanan: e.target.value as any })}
                                    >
                                        <option value="< 3 Juta">&lt; 3 Juta</option>
                                        <option value="3 - 5 Juta">3 - 5 Juta</option>
                                        <option value="5 - 10 Juta">5 - 10 Juta</option>
                                        <option value="> 10 Juta">&gt; 10 Juta</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Rekomendasi Alumni</Label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    value={formData.rekomendasi_alumni}
                                    onChange={(e) => setFormData({ ...formData, rekomendasi_alumni: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingAlumni(null)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Perbarui Data
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={Boolean(deletingAlumni)} onOpenChange={(open) => !open && setDeletingAlumni(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Data Alumni</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus data tracer study alumni ini?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingAlumni(null)}>
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

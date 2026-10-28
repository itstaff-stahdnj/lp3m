import { Head, Link } from '@inertiajs/react';
import {
    GraduationCap,
    Building2,
    Calendar,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    TrendingUp,
    FileSpreadsheet,
    Users,
    ChevronRight,
    Award,
    Activity,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ProgramStudi, UnitKerja, ProfilInstitusi, TahunAkademik } from '@/types';

type DashboardStats = {
    total_prodi: number;
    total_unit: number;
    total_users: number;
    active_semester: string;
    standar_spmi_count: number;
    ami_status: {
        periode: string;
        audited_prodi: number;
        total_temuan: number;
        kts_mayor: number;
        kts_minor: number;
        observasi: number;
        status_closing: string;
    };
    iku_summary: Array<{
        name: string;
        target: number;
        achieved: number;
        unit: string;
    }>;
};

type DashboardProps = {
    stats: DashboardStats;
    prodis: ProgramStudi[];
    unitKerjas: UnitKerja[];
    institution: ProfilInstitusi;
    activeYear: TahunAkademik | null;
};

export default function Dashboard({
    stats,
    prodis,
    unitKerjas,
    institution,
    activeYear,
}: DashboardProps) {
    const ppeppSteps = [
        {
            code: 'P',
            title: 'Penetapan',
            desc: '24 Standar SN-Dikti & SPMI STAH DNJ telah disahkan oleh Senat & Ketua.',
            status: 'Selesai',
            color: 'bg-emerald-500 text-white',
            badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
        },
        {
            code: 'P',
            title: 'Pelaksanaan',
            desc: 'Implementasi standar pembelajaran, penelitian, dan PkM pada semester aktif.',
            status: 'Berjalan',
            color: 'bg-blue-500 text-white',
            badgeClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
        },
        {
            code: 'E',
            title: 'Evaluasi',
            desc: 'Audit Mutu Internal (AMI) & Monev kepuasan mahasiswa/dosen.',
            status: 'Sedang Dilakukan',
            color: 'bg-amber-500 text-white',
            badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
        },
        {
            code: 'P',
            title: 'Pengendalian',
            desc: 'Rapat Tinjauan Manajemen (RTM) dan perumusan Tindakan Koreksi (PTK).',
            status: 'Terjadwal',
            color: 'bg-indigo-500 text-white',
            badgeClass: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
        },
        {
            code: 'P',
            title: 'Peningkatan',
            desc: 'Benchmarking dan peningkatan target mutu berkelanjutan (Kaizen).',
            status: 'Perencanaan',
            color: 'bg-purple-500 text-white',
            badgeClass: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30',
        },
    ];

    return (
        <>
            <Head title="Executive Dashboard - LP3M STAH DNJ" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Hero / Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-slate-800">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
                                <ShieldCheck className="size-3.5" />
                                <span>Lembaga Pengembangan Pembelajaran & Penjaminan Mutu</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                {institution?.nama_kampus || 'STAH Dharma Nusantara Jakarta'}
                            </h1>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Sistem Informasi Penjaminan Mutu Internal (SPMI), Audit Mutu Internal (AMI), 
                                dan Pengawalan Akreditasi Institusi & Program Studi menuju predikat Unggul.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
                            <div className="text-left md:text-right">
                                <span className="text-xs text-slate-400 block font-medium">Tahun Akademik Aktif</span>
                                <span className="text-lg font-bold text-amber-400 flex items-center gap-1.5 md:justify-end">
                                    <Calendar className="size-4" />
                                    {stats.active_semester}
                                </span>
                            </div>
                            <Link href="/master/tahun-akademik">
                                <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs">
                                    Kelola Semester
                                    <ArrowUpRight className="size-3.5 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Program Studi
                            </CardTitle>
                            <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                                <GraduationCap className="size-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{stats.total_prodi}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <span className="text-emerald-600 font-semibold">100%</span> Aktif Terakreditasi BAN-PT
                            </p>
                            <div className="mt-3 flex gap-1">
                                {prodis.map((p) => (
                                    <Badge key={p.id} variant="outline" className="text-[10px] px-1.5 py-0">
                                        {p.jenjang}-{p.kode} ({p.akreditasi || 'Baik'})
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Unit Kerja / Lembaga
                            </CardTitle>
                            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                <Building2 className="size-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{stats.total_unit}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Lembaga & unit pendukung Tri Dharma
                            </p>
                            <div className="mt-3">
                                <Link href="/master/unit-kerja" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center">
                                    Lihat rincian unit
                                    <ChevronRight className="size-3" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Standar SPMI (SN-Dikti)
                            </CardTitle>
                            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                <ShieldCheck className="size-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{stats.standar_spmi_count}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                8 Pendidikan, 8 Penelitian, 8 PkM
                            </p>
                            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                <CheckCircle2 className="size-3.5" />
                                Dokumen SPMI Tersinkronisasi
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Pengguna Sistem
                            </CardTitle>
                            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                                <Users className="size-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Super Admin, Auditor, Kaprodi, Dosen
                            </p>
                            <div className="mt-3">
                                <Link href="/master/users" className="text-xs text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center">
                                    Kelola Pengguna & Akses
                                    <ChevronRight className="size-3" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Siklus PPEPP Tracker */}
                <Card className="border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Activity className="size-5 text-indigo-500" />
                                    Siklus Penjaminan Mutu PPEPP (Kaizen Loop)
                                </CardTitle>
                                <CardDescription>
                                    Tahapan implementasi siklus mutu berkesinambungan di lingkungan STAH Dharma Nusantara Jakarta
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="w-fit text-xs px-2.5 py-1 font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                                Siklus 2025/2026
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-5">
                            {ppeppSteps.map((step, idx) => (
                                <div
                                    key={step.title}
                                    className="relative flex flex-col justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`size-8 rounded-lg ${step.color} flex items-center justify-center font-bold text-sm shadow-sm`}>
                                                {step.code}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-semibold">
                                                Tahap {idx + 1}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                                            {step.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${step.badgeClass}`}>
                                            {step.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 2-Columns: Status Audit Mutu (AMI) & IKU Summary */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Status AMI */}
                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <Award className="size-5 text-amber-500" />
                                        Status Audit Mutu Internal (AMI)
                                    </CardTitle>
                                    <CardDescription>
                                        Hasil audit kepatuhan standar mutu pada siklus berjalan
                                    </CardDescription>
                                </div>
                                <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                    {stats.ami_status.periode}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <span className="text-2xl font-black text-red-600 dark:text-red-400 block">
                                        {stats.ami_status.kts_mayor}
                                    </span>
                                    <span className="text-xs font-semibold text-red-700 dark:text-red-300">
                                        KTS Mayor
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block">
                                        {stats.ami_status.kts_minor}
                                    </span>
                                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                                        KTS Minor
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400 block">
                                        {stats.ami_status.observasi}
                                    </span>
                                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                                        Observasi (OB)
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground font-medium">Status Tindak Lanjut PTK:</span>
                                    <span className="font-bold text-amber-600 dark:text-amber-400">
                                        {stats.ami_status.status_closing}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full rounded-full w-[65%]" />
                                </div>
                                <p className="text-[11px] text-muted-foreground pt-1">
                                    3 dari 5 temuan telah diverifikasi oleh Auditor untuk perbaikan kurikulum & RPS.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Capaian IKU */}
                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <TrendingUp className="size-5 text-emerald-500" />
                                        Capaian Indikator Kinerja Utama (IKU)
                                    </CardTitle>
                                    <CardDescription>
                                        Monitoring target sasaran strategis institusi
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {stats.iku_summary.slice(0, 4).map((iku) => {
                                const isMet = iku.achieved >= iku.target;
                                return (
                                    <div key={iku.name} className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[70%]">
                                                {iku.name}
                                            </span>
                                            <span className="font-bold">
                                                {iku.achieved}{iku.unit} / target {iku.target}{iku.unit}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${
                                                    isMet ? 'bg-emerald-500' : 'bg-amber-500'
                                                }`}
                                                style={{ width: `${Math.min(100, (iku.achieved / iku.target) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Program Studi STAH DNJ & Akreditasi */}
                <Card className="border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <GraduationCap className="size-5 text-blue-500" />
                                    Program Studi & Status Akreditasi STAH DNJ
                                </CardTitle>
                                <CardDescription>
                                    Monitoring masa berlaku SK akreditasi BAN-PT/LAM untuk tiap jenjang
                                </CardDescription>
                            </div>
                            <Link href="/master/prodi">
                                <Button size="sm" variant="outline" className="text-xs">
                                    Kelola Data Prodi
                                    <ChevronRight className="size-3.5 ml-1" />
                                </Button>
                            </Link>
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
                                        <th className="pb-3 font-semibold">Ketua Program Studi</th>
                                        <th className="pb-3 font-semibold">Akreditasi</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {prodis.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                            <td className="py-3 font-mono font-medium text-xs">{p.kode}</td>
                                            <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                {p.nama}
                                            </td>
                                            <td className="py-3">
                                                <Badge variant="outline" className="text-xs font-semibold">
                                                    {p.jenjang}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-muted-foreground text-xs">
                                                {p.kaprodi_nama || 'Belum ditentukan'}
                                            </td>
                                            <td className="py-3">
                                                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs">
                                                    {p.akreditasi || 'Baik'}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                                    <span className="size-2 rounded-full bg-emerald-500" />
                                                    Aktif
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

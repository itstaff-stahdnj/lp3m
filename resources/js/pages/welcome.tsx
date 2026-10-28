import { Head, Link, usePage } from '@inertiajs/react';
import {
    ShieldCheck,
    GraduationCap,
    Building2,
    Calendar,
    Award,
    CheckCircle2,
    ArrowRight,
    FileText,
    Activity,
    Download,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    Sparkles,
    BookOpen,
    Users,
    Layers,
    ChevronRight,
    TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProfilInstitusi, TahunAkademik, ProgramStudi, Auth } from '@/types';

type WelcomeProps = {
    institution: ProfilInstitusi;
    activeYear: TahunAkademik | null;
    prodis: ProgramStudi[];
    totalUnits: number;
};

export default function Welcome({
    institution,
    activeYear,
    prodis,
    totalUnits,
}: WelcomeProps) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const ppeppSteps = [
        {
            code: 'P',
            title: 'Penetapan',
            subtitle: 'Standar Mutu SPMI',
            desc: 'Perumusan, peninjauan, dan pengesahan 24 Standar Nasional Dikti serta standar spesifik STAH DNJ.',
            color: 'from-blue-600 to-indigo-600',
        },
        {
            code: 'P',
            title: 'Pelaksanaan',
            subtitle: 'Tridharma & Tata Kelola',
            desc: 'Implementasi rencana pembelajaran, penelitian, pengabdian masyarakat, dan tata kelola unit kerja.',
            color: 'from-emerald-600 to-teal-600',
        },
        {
            code: 'E',
            title: 'Evaluasi',
            subtitle: 'AMI & Monev Berkala',
            desc: 'Pengukuran ketercapaian standar melalui Audit Mutu Internal (AMI), survei kepuasan, dan monev.',
            color: 'from-amber-500 to-orange-600',
        },
        {
            code: 'P',
            title: 'Pengendalian',
            subtitle: 'RTM & Tindakan Koreksi',
            desc: 'Rapat Tinjauan Manajemen (RTM) dan Permintaan Tindakan Koreksi (PTK) atas temuan ketidaksesuaian.',
            color: 'from-rose-600 to-pink-600',
        },
        {
            code: 'P',
            title: 'Peningkatan',
            subtitle: 'Kaizen & Standar Baru',
            desc: 'Peningkatan target standar mutu secara berkelanjutan menuju akreditasi institusi dan prodi Unggul.',
            color: 'from-purple-600 to-violet-600',
        },
    ];

    const publicDocuments = [
        {
            title: 'Kebijakan SPMI STAH DNJ',
            type: 'Dokumen Utama',
            desc: 'Pedoman makro penyelenggaraan sistem penjaminan mutu internal institusi.',
            size: 'PDF • 1.2 MB',
        },
        {
            title: 'Manual Standar Pendidikan & Pengajaran',
            type: 'Manual Mutu',
            desc: 'Prosedur operasional baku pelaksanaan kurikulum berbasis KKNI & OBE.',
            size: 'PDF • 2.4 MB',
        },
        {
            title: 'Pedoman Audit Mutu Internal (AMI)',
            type: 'Instrumen Audit',
            desc: 'Tata cara, kode etik auditor, dan form rekapitulasi temuan KTS/OB.',
            size: 'PDF • 1.8 MB',
        },
        {
            title: 'Instrumen Monev Pembelajaran & Kepuasan',
            type: 'Instrumen Survei',
            desc: 'Kuesioner evaluasi dosen oleh mahasiswa (EDOM) dan kepuasan sarpras.',
            size: 'PDF • 950 KB',
        },
    ];

    return (
        <>
            <Head title="LP3M STAH Dharma Nusantara Jakarta - Portal Penjaminan Mutu" />

            <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-slate-950 dark:bg-slate-950 dark:text-slate-100">
                {/* Top Notification Bar */}
                <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 px-4 py-2 text-center text-xs font-bold text-slate-950 shadow-xs">
                    <div className="container mx-auto flex items-center justify-center gap-2">
                        <Sparkles className="size-3.5" />
                        <span>
                            Siklus Penjaminan Mutu Internal (SPMI) STAH Dharma Nusantara Jakarta — Tahun Akademik{' '}
                            {activeYear ? `${activeYear.tahun} (${activeYear.semester})` : '2025/2026'}
                        </span>
                    </div>
                </div>

                {/* Navbar */}
                <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 font-black text-slate-950 shadow-md">
                                <span className="text-sm font-black tracking-wider">LP3M</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    LP3M STAH DNJ
                                </span>
                                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                    {institution?.singkatan || 'STAH Dharma Nusantara Jakarta'}
                                </span>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            <a href="#profil" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                Profil Mutu
                            </a>
                            <a href="#prodi" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                Akreditasi Prodi
                            </a>
                            <a href="#ppepp" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                Siklus PPEPP
                            </a>
                            <a href="#dokumen" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                Dokumen SPMI
                            </a>
                            <a href="#kontak" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                Kontak
                            </a>
                        </nav>

                        {/* Auth Button */}
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link href="/dashboard">
                                    <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 font-bold text-xs">
                                        Buka Dashboard
                                        <ArrowRight className="size-3.5 ml-1.5" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/login">
                                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm">
                                        Masuk ke SIM LP3M
                                        <ArrowRight className="size-3.5 ml-1.5" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.1),rgba(0,0,0,0))]" />

                    <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center max-w-4xl space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                            <ShieldCheck className="size-4" />
                            <span>Lembaga Pengembangan Pembelajaran & Penjaminan Mutu</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                            Mengawal Mutu Menuju Kampus{' '}
                            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                                Berakreditasi Unggul
                            </span>
                        </h1>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Portal Resmi Penjaminan Mutu Internal (SPMI), Audit Mutu Internal (AMI), dan Monitoring
                            Kinerja Program Studi di lingkungan{' '}
                            <strong className="text-slate-900 dark:text-white">{institution?.nama_kampus || 'STAH Dharma Nusantara Jakarta'}</strong>.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <a href="#prodi">
                                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md">
                                    <GraduationCap className="size-4 mr-2" />
                                    Status Akreditasi Prodi
                                </Button>
                            </a>
                            <a href="#dokumen">
                                <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-700 text-sm font-semibold">
                                    <BookOpen className="size-4 mr-2" />
                                    Unduh Dokumen SPMI
                                </Button>
                            </a>
                        </div>

                        {/* Active academic badge */}
                        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="size-4 text-amber-500" />
                            <span>Tahun Akademik Berjalan:</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                {activeYear ? `${activeYear.tahun} Semester ${activeYear.semester}` : '2025/2026 Ganjil'}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50">
                                <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl mb-3">
                                    <GraduationCap className="size-6" />
                                </div>
                                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                                    {prodis.length}
                                </span>
                                <span className="text-xs font-semibold text-muted-foreground mt-1">
                                    Program Studi Terakreditasi
                                </span>
                            </div>

                            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50">
                                <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl mb-3">
                                    <Building2 className="size-6" />
                                </div>
                                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                                    {totalUnits}
                                </span>
                                <span className="text-xs font-semibold text-muted-foreground mt-1">
                                    Unit Kerja & Lembaga
                                </span>
                            </div>

                            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50">
                                <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl mb-3">
                                    <ShieldCheck className="size-6" />
                                </div>
                                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                                    24
                                </span>
                                <span className="text-xs font-semibold text-muted-foreground mt-1">
                                    Standar SPMI (SN-Dikti)
                                </span>
                            </div>

                            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50">
                                <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl mb-3">
                                    <Activity className="size-6" />
                                </div>
                                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                                    5
                                </span>
                                <span className="text-xs font-semibold text-muted-foreground mt-1">
                                    Tahapan Siklus Mutu PPEPP
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Status Akreditasi Program Studi Section */}
                <section id="prodi" className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                            <Badge variant="outline" className="text-xs px-3 py-1 font-semibold border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10">
                                Transparansi Akreditasi
                            </Badge>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                                Status Akreditasi Program Studi
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                Data legalitas dan peringkat akreditasi resmi dari Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT) / Lembaga Akreditasi Mandiri (LAM).
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {prodis.map((prodi) => (
                                <Card
                                    key={prodi.id}
                                    className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 relative overflow-hidden group bg-white dark:bg-slate-900"
                                >
                                    <div className="h-2 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="outline" className="font-bold text-xs">
                                                Jenjang {prodi.jenjang}
                                            </Badge>
                                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs">
                                                {prodi.akreditasi || 'Baik'}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                            {prodi.nama}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Kode Prodi: <span className="font-mono font-medium">{prodi.kode}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-0 text-xs">
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                                            <div className="text-muted-foreground font-medium">Nomor SK Akreditasi:</div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-200 break-words">
                                                {prodi.sk_akreditasi || 'Dalam Pembaruan'}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs pt-1">
                                            <span className="text-muted-foreground">Ketua Program Studi:</span>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                {prodi.kaprodi_nama || 'Belum diisi'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                                            <CheckCircle2 className="size-3.5" />
                                            Status Aktif di PD-DIKTI
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Siklus PPEPP Section */}
                <section id="ppepp" className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                            <Badge variant="outline" className="text-xs px-3 py-1 font-semibold border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10">
                                Kerangka Kaizen SPMI
                            </Badge>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                                Siklus Mutu PPEPP Berkesinambungan
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                LP3M mengoperasikan penjaminan mutu sesuai Permendikbudristek No. 53 Tahun 2023 dengan 5 pilar utama siklus mutu.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-5">
                            {ppeppSteps.map((step, idx) => (
                                <div
                                    key={step.title}
                                    className="relative flex flex-col p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`size-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-extrabold text-base shadow-sm`}>
                                            {step.code}
                                        </div>
                                        <span className="text-[11px] font-bold text-muted-foreground">
                                            0{idx + 1}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-base text-slate-900 dark:text-white mb-0.5">
                                        {step.title}
                                    </h3>
                                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">
                                        {step.subtitle}
                                    </span>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Profil & Visi Misi Section */}
                <section id="profil" className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="grid md:grid-cols-2 gap-10 items-center">
                            <div className="space-y-4">
                                <Badge variant="outline" className="text-xs px-3 py-1 font-semibold border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10">
                                    Landasan Mutu Institusi
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                    {institution?.motto || 'Satyam Eva Jayate - Widya Sewanam'}
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Penjaminan mutu di STAH Dharma Nusantara Jakarta didasarkan pada integritas kebenaran
                                    (<em>Satyam</em>) dan pengabdian ilmu pengetahuan (<em>Widya Sewanam</em>),
                                    mewujudkan lulusan yang berkarakter, berdaya saing global, dan berakar pada nilai-nilai kearifan Hindu.
                                </p>

                                <div className="space-y-3 pt-2">
                                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                                            Visi Mutu Institusi
                                        </h4>
                                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {institution?.visi || 'Menjadi pusat keunggulan pendidikan tinggi agama Hindu yang unggul, berkarakter, dan berdaya saing nasional pada tahun 2030.'}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                                            Pimpinan Institusi & Lembaga Mutu
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                                            <div>
                                                <span className="text-muted-foreground block text-[11px]">Ketua STAH DNJ:</span>
                                                <span className="font-semibold">{institution?.nama_ketua_stah || 'Pimpinan STAH DNJ'}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-[11px]">Ketua LP3M:</span>
                                                <span className="font-semibold">{institution?.nama_ketua_lp3m || 'Pimpinan LP3M'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Standar SN-Dikti Box */}
                            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-amber-400">
                                        Cakupan 24 Standar Mutu SN-Dikti
                                    </h3>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        Standar Nasional Pendidikan Tinggi yang diterapkan secara terukur di seluruh program studi STAH DNJ:
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="size-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                                                01
                                            </span>
                                            <div>
                                                <div className="text-xs font-bold">8 Standar Pendidikan</div>
                                                <div className="text-[10px] text-slate-400">Kompetensi Lulusan, Isi, Proses, Penilaian, Dosen, Sarpras, Pengelolaan, Pembiayaan</div>
                                            </div>
                                        </div>
                                        <CheckCircle2 className="size-4 text-emerald-400" />
                                    </div>

                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="size-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                                                02
                                            </span>
                                            <div>
                                                <div className="text-xs font-bold">8 Standar Penelitian</div>
                                                <div className="text-[10px] text-slate-400">Hasil, Isi, Proses, Penilaian, Peneliti, Sarpras, Pengelolaan, Pendanaan</div>
                                            </div>
                                        </div>
                                        <CheckCircle2 className="size-4 text-emerald-400" />
                                    </div>

                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="size-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                                                03
                                            </span>
                                            <div>
                                                <div className="text-xs font-bold">8 Standar Pengabdian (PkM)</div>
                                                <div className="text-[10px] text-slate-400">Hasil, Isi, Proses, Penilaian, Pelaksana, Sarpras, Pengelolaan, Pendanaan</div>
                                            </div>
                                        </div>
                                        <CheckCircle2 className="size-4 text-emerald-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dokumen SPMI Publik Section */}
                <section id="dokumen" className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                            <Badge variant="outline" className="text-xs px-3 py-1 font-semibold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                                Repositori Publik
                            </Badge>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                                Dokumen & Kebijakan Mutu Publik
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                Dokumen panduan penjaminan mutu yang dapat diunduh oleh dosen, mahasiswa, dan publik.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {publicDocuments.map((doc) => (
                                <Card key={doc.title} className="border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col justify-between">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="outline" className="text-[10px]">
                                                {doc.type}
                                            </Badge>
                                            <FileText className="size-4 text-amber-500" />
                                        </div>
                                        <CardTitle className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                            {doc.title}
                                        </CardTitle>
                                        <CardDescription className="text-xs pt-1">
                                            {doc.desc}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                                            <span className="text-muted-foreground text-[11px] font-mono">{doc.size}</span>
                                            <Button size="sm" variant="ghost" className="h-7 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 p-0">
                                                <Download className="size-3.5 mr-1" />
                                                Unduh
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer Section */}
                <footer id="kontak" className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 text-xs">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div className="space-y-3 md:col-span-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-amber-500 font-black text-slate-950">
                                        <span className="text-xs">LP3M</span>
                                    </div>
                                    <span className="text-base font-bold text-white">
                                        LP3M STAH Dharma Nusantara Jakarta
                                    </span>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                                    Lembaga Pengembangan Pembelajaran dan Penjaminan Mutu (LP3M) bertanggung jawab
                                    mengawal ketercapaian dan pelampauan Standar Nasional Pendidikan Tinggi (SN-Dikti)
                                    di lingkungan Sekolah Tinggi Agama Hindu Dharma Nusantara Jakarta.
                                </p>
                                <div className="text-[11px] text-amber-400 font-semibold italic">
                                    "{institution?.motto || 'Satyam Eva Jayate - Widya Sewanam'}"
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-bold text-white text-xs uppercase tracking-wider">Kontak LP3M</h4>
                                <ul className="space-y-2 text-slate-400">
                                    <li className="flex items-start gap-2">
                                        <MapPin className="size-4 shrink-0 text-amber-500 mt-0.5" />
                                        <span>{institution?.alamat || 'DKI Jakarta, Indonesia'}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Phone className="size-4 shrink-0 text-amber-500" />
                                        <span>{institution?.telepon || '(021) xxxxxxxx'}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Mail className="size-4 shrink-0 text-amber-500" />
                                        <span>{institution?.email || 'lp3m@stahdnj.ac.id'}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-bold text-white text-xs uppercase tracking-wider">Tautan Cepat</h4>
                                <ul className="space-y-2 text-slate-400">
                                    <li>
                                        <a href={institution?.website || 'https://stahdnj.ac.id'} target="_blank" rel="noreferrer" className="hover:text-amber-400 flex items-center gap-1.5">
                                            <ExternalLink className="size-3.5" />
                                            Portal Utama STAH DNJ
                                        </a>
                                    </li>
                                    <li>
                                        <Link href="/login" className="hover:text-amber-400 flex items-center gap-1.5">
                                            <ChevronRight className="size-3.5" />
                                            Login Sistem Penjaminan Mutu
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="#prodi" className="hover:text-amber-400 flex items-center gap-1.5">
                                            <ChevronRight className="size-3.5" />
                                            Akreditasi Program Studi
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#dokumen" className="hover:text-amber-400 flex items-center gap-1.5">
                                            <ChevronRight className="size-3.5" />
                                            Unduh Pedoman SPMI
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500">
                            &copy; {new Date().getFullYear()} LP3M {institution?.nama_kampus || 'STAH Dharma Nusantara Jakarta'}. Seluruh Hak Cipta Dilindungi.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

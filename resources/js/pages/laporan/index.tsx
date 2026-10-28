import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    FileText,
    TrendingUp,
    ShieldCheck,
    ClipboardCheck,
    Award,
    Printer,
    Download,
    Calendar,
    Save,
    CheckCircle2,
    Building2,
    Users,
    Activity,
    AlertCircle,
    ChevronRight,
    Star,
    Layers,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LaporanTahunan } from '@/types/laporan';
import type { ProfilInstitusi, ProgramStudi, TahunAkademik } from '@/types';

type Metrics = {
    spmi: {
        skor: number;
        total_standar: number;
        standar_tercapai: number;
        pendidikan: number;
        penelitian: number;
        pkm: number;
        total_indikator: number;
    };
    ami: {
        total_temuan: number;
        kts_mayor: number;
        kts_minor: number;
        observasi: number;
        closing_rate: number;
    };
    akreditasi: Array<{
        id: number;
        program_studi?: ProgramStudi;
        total_skor: number;
        predikat: string;
        instrumen: string;
    }>;
    survei: {
        total_respon: number;
        indeks_kepuasan: number;
        kategori: string;
    };
    iku: {
        capaian_rata_rata: number;
        items: Array<{
            kode: string;
            nama: string;
            target: number;
            capaian: number;
        }>;
    };
};

type Props = {
    activeYear: TahunAkademik;
    allYears: TahunAkademik[];
    institution: ProfilInstitusi;
    prodis: ProgramStudi[];
    savedLaporan: LaporanTahunan | null;
    allSavedLaporan: LaporanTahunan[];
    metrics: Metrics;
};

export default function LaporanIndex({
    activeYear,
    allYears,
    institution,
    prodis,
    savedLaporan,
    allSavedLaporan,
    metrics,
}: Props) {
    const [selectedTab, setSelectedTab] = useState<'ringkasan' | 'spmi' | 'ami' | 'iku'>('ringkasan');
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [nomorLaporan, setNomorLaporan] = useState(
        savedLaporan?.nomor_laporan || `LAP-MUTU/LP3M/${activeYear.tahun.replace('/', '-')}/01`
    );
    const [judulLaporan, setJudulLaporan] = useState(
        savedLaporan?.judul || `Laporan Kinerja Mutu Tahunan LP3M STAH DNJ Tahun ${activeYear.tahun}`
    );
    const [ringkasanEksekutif, setRingkasanEksekutif] = useState(
        savedLaporan?.ringkasan_eksekutif ||
            `Laporan Kinerja Mutu Tahunan ini menyajikan rekapitulasi menyeluruh siklus PPEPP penjaminan mutu di lingkungan STAH Dharma Nusantara Jakarta untuk Tahun Akademik ${activeYear.tahun}. Capaian standar SPMI berada pada tingkat ${metrics.spmi.skor}%, dengan tingkat closing rate temuan AMI mencapai ${metrics.ami.closing_rate}%. Indeks kepuasan civitas akademika tercatat sebesar ${metrics.survei.indeks_kepuasan}% (Predikat ${metrics.survei.kategori}).`
    );
    const [rekomendasi, setRekomendasi] = useState(
        savedLaporan?.rekomendasi_utama ||
            "1. Mempercepat pemenuhan akreditasi Unggul pada seluruh Program Studi.\n2. Optimalisasi serapan alumni melalui kemitraan lembaga keagamaan dan sekolah binaan.\n3. Peningkatan hilirisasi riset dosen ke dalam bentuk buku ajar dan pengabdian masyarakat bernilai HKI."
    );
    const [disetujuiOleh, setDisetujuiOleh] = useState(
        savedLaporan?.disetujui_oleh || 'Prof. Dr. I Made Kartika, S.Ag., M.Fil.H.'
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveLaporan = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(
            '/laporan',
            {
                tahun_akademik_id: activeYear.id,
                nomor_laporan: nomorLaporan,
                judul: judulLaporan,
                periode_tahun: activeYear.tahun,
                ringkasan_eksekutif: ringkasanEksekutif,
                skor_spmi: metrics.spmi.skor,
                total_standar_tercapai: metrics.spmi.standar_tercapai,
                total_standar: metrics.spmi.total_standar,
                skor_ami_closing_rate: metrics.ami.closing_rate,
                skor_kepuasan_pengguna: metrics.survei.indeks_kepuasan,
                skor_capaian_iku: metrics.iku.capaian_rata_rata,
                rekomendasi_utama: rekomendasi,
                status: 'Disetujui Pimpinan',
                disetujui_oleh: disetujuiOleh,
                tanggal_pengesahan: new Date().toISOString().split('T')[0],
                data_snapshot: metrics,
            },
            {
                onFinish: () => {
                    setIsSaving(false);
                    setIsSaveModalOpen(false);
                },
            }
        );
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title="Laporan Kinerja Mutu Tahunan - LP3M" />

            <div className="space-y-6 print:space-y-4 print:text-black">
                {/* Header Section (Hidden in pure print or styled with Kop Surat) */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between print:hidden">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Laporan Kinerja Mutu Tahunan</h1>
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
                                Fase 6 - Eksekutif
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Kompilasi menyeluruh capaian siklus PPEPP, Standar SPMI, Audit AMI, Survei Kepuasan, dan IKU STAH DNJ.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Selector Tahun */}
                        <div className="flex items-center gap-1.5 bg-background border rounded-lg px-2.5 py-1 text-sm shadow-xs">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <select
                                value={activeYear.id}
                                onChange={(e) => router.get('/laporan', { tahun_akademik_id: e.target.value })}
                                className="bg-transparent font-medium text-xs md:text-sm focus:outline-none cursor-pointer"
                            >
                                {allYears.map((y) => (
                                    <option key={y.id} value={y.id}>
                                        Tahun {y.tahun} ({y.semester})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 shadow-xs">
                            <Printer className="h-4 w-4" />
                            <span>Cetak Laporan</span>
                        </Button>

                        <Button size="sm" onClick={() => setIsSaveModalOpen(true)} className="gap-1.5 shadow-xs">
                            <Save className="h-4 w-4" />
                            <span>Sahkan Laporan</span>
                        </Button>
                    </div>
                </div>

                {/* Kop Surat STAH DNJ (Hanya tampil saat print) */}
                <div className="hidden print:block border-b-2 border-black pb-3 text-center">
                    <h2 className="text-lg font-bold uppercase tracking-wider">
                        {institution.nama_institusi || 'SEKOLAH TINGGI AGAMA HINDU DHARMA NUSANTARA JAKARTA'}
                    </h2>
                    <h3 className="text-md font-semibold text-gray-700">
                        LEMBAGA PENJAMINAN MUTU DAN PENGEMBANGAN PEMBELAJARAN (LP3M)
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                        {institution.alamat || 'Jl. Daksinapati Raya No. 10 Rawamangun, Jakarta Timur'} | Telp:{' '}
                        {institution.telepon || '(021) 47867389'} | Website: lp3m.stahdnj.ac.id
                    </p>
                </div>

                {/* Banner Status Laporan */}
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">
                                    {savedLaporan ? savedLaporan.judul : `Laporan Mutu Siklus ${activeYear.tahun}`}
                                </span>
                                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px]">
                                    {savedLaporan?.status || 'Siap Disahkan'}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                No. Dokumen: <span className="font-mono">{savedLaporan?.nomor_laporan || nomorLaporan}</span> • Disahkan oleh:{' '}
                                <strong>{savedLaporan?.disetujui_oleh || disetujuiOleh}</strong>
                            </p>
                        </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground print:hidden">
                        Status Data: <span className="text-emerald-600 font-semibold">Tersinkronisasi Real-time</span>
                    </div>
                </div>

                {/* 4 Pilar Metrik Kinerja Utama */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* SPMI */}
                    <Card className="shadow-xs hover:border-primary/40 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Ketercapaian Standar SPMI</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {metrics.spmi.skor}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <strong>{metrics.spmi.standar_tercapai}</strong> dari {metrics.spmi.total_standar} Standar SN-Dikti
                            </p>
                            <div className="w-full bg-muted h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${metrics.spmi.skor}%` }} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* AMI PTK */}
                    <Card className="shadow-xs hover:border-primary/40 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground">AMI PTK Closing Rate</CardTitle>
                            <ClipboardCheck className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {metrics.ami.closing_rate}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <strong>0</strong> Mayor, <strong>{metrics.ami.kts_minor}</strong> Minor,{' '}
                                <strong>{metrics.ami.observasi}</strong> OB
                            </p>
                            <div className="w-full bg-muted h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${metrics.ami.closing_rate}%` }} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Survei Kepuasan */}
                    <Card className="shadow-xs hover:border-primary/40 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Indeks Kepuasan Pengguna</CardTitle>
                            <Star className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {metrics.survei.indeks_kepuasan}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Predikat: <span className="font-semibold text-foreground">{metrics.survei.kategori}</span> ({metrics.survei.total_respon} Responden)
                            </p>
                            <div className="w-full bg-muted h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${metrics.survei.indeks_kepuasan}%` }} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* IKU Tridharma */}
                    <Card className="shadow-xs hover:border-primary/40 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Rata-rata Capaian IKU</CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {metrics.iku.capaian_rata_rata}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Pemenuhan 8 Indikator Kinerja Utama
                            </p>
                            <div className="w-full bg-muted h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${metrics.iku.capaian_rata_rata}%` }} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tab Navigasi Detail Laporan (Hidden saat cetak) */}
                <div className="flex border-b space-x-2 print:hidden">
                    {[
                        { id: 'ringkasan', label: 'Ringkasan Eksekutif & Rekomendasi' },
                        { id: 'spmi', label: 'Capaian 24 Standar SPMI' },
                        { id: 'ami', label: 'Audit Mutu & Akreditasi 9 Kriteria' },
                        { id: 'iku', label: 'Capaian IKU & SDM' },
                    ].map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTab(t.id as any)}
                            className={`pb-2.5 px-3 text-xs md:text-sm font-medium border-b-2 transition-colors ${
                                selectedTab === t.id
                                    ? 'border-primary text-primary font-semibold'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Konten Tab 1: Ringkasan Eksekutif & Rekomendasi */}
                {(selectedTab === 'ringkasan' || typeof window !== 'undefined') && (
                    <div className="space-y-4">
                        <Card className="shadow-xs">
                            <CardHeader>
                                <CardTitle className="text-base">1. Ringkasan Eksekutif Kinerja Mutu</CardTitle>
                                <CardDescription>Gambaran umum pencapaian tata kelola mutu institusi sepanjang tahun akademik berjalan</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm leading-relaxed text-foreground whitespace-pre-line bg-muted/30 p-4 rounded-lg border">
                                    {savedLaporan?.ringkasan_eksekutif || ringkasanEksekutif}
                                </p>

                                <div className="pt-2">
                                    <h4 className="font-semibold text-sm mb-2 text-foreground flex items-center gap-1.5">
                                        <AlertCircle className="h-4 w-4 text-amber-500" />
                                        Rekomendasi Utama Peningkatan Mutu (Siklus Berikutnya)
                                    </h4>
                                    <div className="text-sm leading-relaxed whitespace-pre-line bg-amber-500/5 border border-amber-500/20 p-4 rounded-lg text-foreground">
                                        {savedLaporan?.rekomendasi_utama || rekomendasi}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Konten Tab 2: Kompilasi SPMI */}
                {selectedTab === 'spmi' && (
                    <Card className="shadow-xs">
                        <CardHeader>
                            <CardTitle className="text-base">2. Kompilasi Ketercapaian Standar SPMI (SN-Dikti)</CardTitle>
                            <CardDescription>Rincian pemenuhan standar tridharma perguruan tinggi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                <div className="p-3 rounded-lg border bg-background text-center">
                                    <div className="text-xs text-muted-foreground">Standar Pendidikan</div>
                                    <div className="text-xl font-bold mt-1 text-primary">8 Standar</div>
                                    <div className="text-[11px] text-emerald-600 mt-0.5">100% Terpenuhi</div>
                                </div>
                                <div className="p-3 rounded-lg border bg-background text-center">
                                    <div className="text-xs text-muted-foreground">Standar Penelitian</div>
                                    <div className="text-xl font-bold mt-1 text-primary">8 Standar</div>
                                    <div className="text-[11px] text-emerald-600 mt-0.5">87.5% Terpenuhi</div>
                                </div>
                                <div className="p-3 rounded-lg border bg-background text-center">
                                    <div className="text-xs text-muted-foreground">Standar Pengabdian (PkM)</div>
                                    <div className="text-xl font-bold mt-1 text-primary">8 Standar</div>
                                    <div className="text-[11px] text-emerald-600 mt-0.5">87.5% Terpenuhi</div>
                                </div>
                            </div>

                            <div className="rounded-lg border overflow-hidden">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-muted text-muted-foreground border-b uppercase font-semibold">
                                        <tr>
                                            <th className="p-2.5">Bidang Standar</th>
                                            <th className="p-2.5">Jumlah Standar</th>
                                            <th className="p-2.5">Tercapai / Melampaui</th>
                                            <th className="p-2.5">Persentase</th>
                                            <th className="p-2.5">Status Evaluasi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="p-2.5 font-medium">Standar Nasional Pendidikan (8 Standar)</td>
                                            <td className="p-2.5">8</td>
                                            <td className="p-2.5 font-semibold text-emerald-600">8 Standar</td>
                                            <td className="p-2.5 font-semibold">100%</td>
                                            <td className="p-2.5"><Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Tercapai Penuh</Badge></td>
                                        </tr>
                                        <tr>
                                            <td className="p-2.5 font-medium">Standar Nasional Penelitian (8 Standar)</td>
                                            <td className="p-2.5">8</td>
                                            <td className="p-2.5 font-semibold text-emerald-600">7 Standar</td>
                                            <td className="p-2.5 font-semibold">87.5%</td>
                                            <td className="p-2.5"><Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">Tercapai Sebagian</Badge></td>
                                        </tr>
                                        <tr>
                                            <td className="p-2.5 font-medium">Standar Nasional Pengabdian Masyarakat (8 Standar)</td>
                                            <td className="p-2.5">8</td>
                                            <td className="p-2.5 font-semibold text-emerald-600">7 Standar</td>
                                            <td className="p-2.5 font-semibold">87.5%</td>
                                            <td className="p-2.5"><Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">Tercapai Sebagian</Badge></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Konten Tab 3: AMI & Akreditasi */}
                {selectedTab === 'ami' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="shadow-xs">
                            <CardHeader>
                                <CardTitle className="text-base">Hasil Audit Mutu Internal (AMI)</CardTitle>
                                <CardDescription>Rekapitulasi pelaksanaan audit dan status verifikasi PTK</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="p-2.5 rounded-lg border bg-rose-500/5 border-rose-500/20">
                                        <div className="text-[10px] text-muted-foreground uppercase font-bold">KTS Mayor</div>
                                        <div className="text-xl font-bold text-rose-600 mt-1">{metrics.ami.kts_mayor}</div>
                                    </div>
                                    <div className="p-2.5 rounded-lg border bg-amber-500/5 border-amber-500/20">
                                        <div className="text-[10px] text-muted-foreground uppercase font-bold">KTS Minor</div>
                                        <div className="text-xl font-bold text-amber-600 mt-1">{metrics.ami.kts_minor}</div>
                                    </div>
                                    <div className="p-2.5 rounded-lg border bg-blue-500/5 border-blue-500/20">
                                        <div className="text-[10px] text-muted-foreground uppercase font-bold">Observasi</div>
                                        <div className="text-xl font-bold text-blue-600 mt-1">{metrics.ami.observasi}</div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg border bg-muted/30 text-xs space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tingkat Penutupan Tindakan Koreksi (Closing Rate):</span>
                                        <strong className="text-emerald-600 font-bold">{metrics.ami.closing_rate}%</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status Siklus Audit:</span>
                                        <strong className="text-foreground">Siklus 2025/2026 - Tuntas</strong>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-xs">
                            <CardHeader>
                                <CardTitle className="text-base">Kesiapan Akreditasi Program Studi</CardTitle>
                                <CardDescription>Simulasi skor 9 kriteria akreditasi LAM/BAN-PT</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2.5">
                                    {prodis.map((p) => (
                                        <div key={p.id} className="p-2.5 rounded-lg border flex items-center justify-between text-xs">
                                            <div>
                                                <div className="font-semibold text-foreground">{p.nama} ({p.jenjang})</div>
                                                <div className="text-[11px] text-muted-foreground mt-0.5">
                                                    Status Akreditasi Saat Ini: <strong>{p.akreditasi || 'Baik Sekali'}</strong>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                                                Skor 335 (Baik Sekali)
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Konten Tab 4: IKU & SDM */}
                {selectedTab === 'iku' && (
                    <Card className="shadow-xs">
                        <CardHeader>
                            <CardTitle className="text-base">Capaian Indikator Kinerja Utama (IKU 1 s/d 8)</CardTitle>
                            <CardDescription>Target dan realisasi IKU Kemendikbudristek di lingkungan STAH DNJ</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {metrics.iku.items.map((item) => (
                                    <div key={item.kode} className="p-3 rounded-lg border bg-background space-y-1.5 text-xs">
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-foreground">{item.kode}: {item.nama}</span>
                                            <span className={item.capaian >= item.target ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                                                {item.capaian}% (Target {item.target}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${
                                                    item.capaian >= item.target ? 'bg-emerald-500' : 'bg-amber-500'
                                                }`}
                                                style={{ width: `${Math.min(100, (item.capaian / item.target) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Lembar Tanda Tangan Pengesahan (Tampil saat Cetak) */}
                <div className="hidden print:grid grid-cols-2 gap-8 pt-8 mt-6 border-t text-xs text-center">
                    <div>
                        <p className="text-gray-600 mb-16">Mengetahui,<br /><strong>Ketua LP3M STAH DNJ</strong></p>
                        <p className="font-bold underline">Dr. I Nyoman Yoga, M.Pd.H.</p>
                        <p className="text-[11px] text-gray-500">NIP. 197805122005011002</p>
                    </div>
                    <div>
                        <p className="text-gray-600 mb-16">Mengesahkan,<br /><strong>Ketua STAH Dharma Nusantara Jakarta</strong></p>
                        <p className="font-bold underline">{savedLaporan?.disetujui_oleh || disetujuiOleh}</p>
                        <p className="text-[11px] text-gray-500">NIP. 197003151996031001</p>
                    </div>
                </div>
            </div>

            {/* Modal Sahkan / Simpan Laporan */}
            {isSaveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-xl bg-background rounded-xl border p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="font-bold text-base">Pengesahan Laporan Kinerja Mutu Tahunan</h3>
                            <button
                                type="button"
                                onClick={() => setIsSaveModalOpen(false)}
                                className="text-muted-foreground hover:text-foreground text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveLaporan} className="space-y-3.5 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="nomorLaporan">Nomor Dokumen Laporan</Label>
                                    <Input
                                        id="nomorLaporan"
                                        value={nomorLaporan}
                                        onChange={(e) => setNomorLaporan(e.target.value)}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="periodeTahun">Tahun Akademik</Label>
                                    <Input
                                        id="periodeTahun"
                                        value={activeYear.tahun}
                                        readOnly
                                        disabled
                                        className="mt-1 bg-muted"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="judulLaporan">Judul Laporan</Label>
                                <Input
                                    id="judulLaporan"
                                    value={judulLaporan}
                                    onChange={(e) => setJudulLaporan(e.target.value)}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="ringkasan">Ringkasan Eksekutif</Label>
                                <textarea
                                    id="ringkasan"
                                    rows={4}
                                    value={ringkasanEksekutif}
                                    onChange={(e) => setRingkasanEksekutif(e.target.value)}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="rekomendasi">Rekomendasi Utama Peningkatan Mutu</Label>
                                <textarea
                                    id="rekomendasi"
                                    rows={3}
                                    value={rekomendasi}
                                    onChange={(e) => setRekomendasi(e.target.value)}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="disetujui">Pejabat Pengesah (Ketua STAH DNJ)</Label>
                                <Input
                                    id="disetujui"
                                    value={disetujuiOleh}
                                    onChange={(e) => setDisetujuiOleh(e.target.value)}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsSaveModalOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" size="sm" disabled={isSaving}>
                                    {isSaving ? 'Menyimpan...' : 'Sahkan & Simpan Laporan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Award,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Info,
    Save,
    RotateCcw,
    GraduationCap,
    TrendingUp,
    FileSpreadsheet,
    Sliders,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { KriteriaAkreditasi, ProgramStudi, SimulasiAkreditasi, TahunAkademik } from '@/types';

type Props = {
    kriterias: KriteriaAkreditasi[];
    prodis: ProgramStudi[];
    activeProdi: ProgramStudi | null;
    activeYear: TahunAkademik | null;
    simulasi: SimulasiAkreditasi | null;
};

export default function AkreditasiIndex({
    kriterias,
    prodis,
    activeProdi,
    activeYear,
    simulasi,
}: Props) {
    // Inisialisasi rincian skor awal (dari saved simulasi atau default 3.00 untuk tiap kriteria)
    const initialSkor = useMemo(() => {
        const scores: Record<string, number> = {};
        kriterias.forEach((k) => {
            if (simulasi?.rincian_skor_json && simulasi.rincian_skor_json[k.kode] !== undefined) {
                scores[k.kode] = Number(simulasi.rincian_skor_json[k.kode]);
            } else {
                scores[k.kode] = 3.25; // default wajar
            }
        });
        return scores;
    }, [kriterias, simulasi]);

    const [scores, setScores] = useState<Record<string, number>>(initialSkor);
    const [instrumen, setInstrumen] = useState(simulasi?.instrumen || 'APS 4.0 BAN-PT / LAM');
    const [catatan, setCatatan] = useState(simulasi?.catatan_evaluator || '');
    const [isSaving, setIsSaving] = useState(false);

    // Hitung total skor secara real-time
    const { totalScore, predikat, percentage } = useMemo(() => {
        let total = 0;
        kriterias.forEach((k) => {
            const val = scores[k.kode] || 0;
            const bobot = Number(k.bobot_default) || 10;
            total += val * bobot;
        });

        const rounded = Math.round(total * 100) / 100;

        let pred = 'Tidak Terakreditasi';
        if (rounded >= 361) {
            pred = 'Unggul';
        } else if (rounded >= 301) {
            pred = 'Baik Sekali';
        } else if (rounded >= 200) {
            pred = 'Baik';
        }

        const pct = Math.min(100, Math.round((rounded / 400) * 100));

        return {
            totalScore: rounded,
            predikat: pred,
            percentage: pct,
        };
    }, [scores, kriterias]);

    const handleScoreChange = (kode: string, value: number) => {
        setScores((prev) => ({
            ...prev,
            [kode]: value,
        }));
    };

    const handleReset = () => {
        const defaultReset: Record<string, number> = {};
        kriterias.forEach((k) => {
            defaultReset[k.kode] = 3.0;
        });
        setScores(defaultReset);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeProdi || !activeYear) return;

        setIsSaving(true);
        router.post(
            '/akreditasi/simulasi',
            {
                program_studi_id: activeProdi.id,
                tahun_akademik_id: activeYear.id,
                instrumen,
                rincian_skor: scores,
                catatan_evaluator: catatan,
            },
            {
                onFinish: () => setIsSaving(false),
            }
        );
    };

    const handleProdiChange = (prodiId: string) => {
        router.get('/akreditasi', { prodi_id: prodiId }, { preserveState: false });
    };

    const getPredikatBadgeStyle = (p: string) => {
        switch (p) {
            case 'Unggul':
                return 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black shadow-md';
            case 'Baik Sekali':
                return 'bg-blue-600 text-white font-bold shadow-xs';
            case 'Baik':
                return 'bg-amber-500 text-slate-950 font-bold';
            default:
                return 'bg-red-500 text-white font-bold';
        }
    };

    return (
        <>
            <Head title="9 Kriteria & Simulasi Skor Akreditasi - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Award className="size-6 text-amber-500" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                9 Kriteria & Simulasi Skor Akreditasi
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kalkulator instrumen akreditasi 9 Kriteria BAN-PT/LAM dengan proyeksi predikat capaian mutakhir.
                        </p>
                    </div>

                    {/* Prodi Switcher */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-3 py-1.5 shadow-xs">
                            <GraduationCap className="size-4 text-blue-500" />
                            <select
                                className="bg-transparent text-xs font-semibold focus:outline-none"
                                value={activeProdi?.id || ''}
                                onChange={(e) => handleProdiChange(e.target.value)}
                            >
                                {prodis.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.jenjang} {p.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Score Projection Hero Banner */}
                <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-card to-amber-500/5 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <Award className="size-48 text-amber-500" />
                    </div>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            {/* Score Display */}
                            <div className="lg:col-span-4 text-center lg:text-left space-y-2 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 pb-4 lg:pb-0 lg:pr-6">
                                <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider block">
                                    Proyeksi Skor Total (Skala 0 - 400)
                                </span>
                                <div className="text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-baseline justify-center lg:justify-start gap-2">
                                    <span>{totalScore.toFixed(2)}</span>
                                    <span className="text-sm font-normal text-muted-foreground">/ 400</span>
                                </div>
                                <div className="pt-2 flex items-center justify-center lg:justify-start gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">Predikat:</span>
                                    <Badge className={`text-sm px-3 py-1 rounded-full ${getPredikatBadgeStyle(predikat)}`}>
                                        <Sparkles className="size-3.5 mr-1" />
                                        {predikat}
                                    </Badge>
                                </div>
                            </div>

                            {/* Progress & Target Breakdown */}
                            <div className="lg:col-span-5 space-y-3">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-muted-foreground">Capaian Mutu Terhadap Standar Maksimal</span>
                                    <span className="text-amber-600 dark:text-amber-400 font-bold">{percentage}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-[11px] text-center pt-1 text-muted-foreground">
                                    <div className={`p-1.5 rounded border ${totalScore >= 200 && totalScore < 301 ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold' : 'border-slate-200 dark:border-slate-800'}`}>
                                        Baik (200 - 300)
                                    </div>
                                    <div className={`p-1.5 rounded border ${totalScore >= 301 && totalScore < 361 ? 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400 font-bold' : 'border-slate-200 dark:border-slate-800'}`}>
                                        Baik Sekali (301 - 360)
                                    </div>
                                    <div className={`p-1.5 rounded border ${totalScore >= 361 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold' : 'border-slate-200 dark:border-slate-800'}`}>
                                        Unggul (361 - 400)
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="lg:col-span-3 flex flex-col gap-2 justify-center">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-xs"
                                >
                                    <Save className="size-4 mr-1.5" />
                                    {isSaving ? 'Menyimpan...' : 'Simpan Simulasi Ini'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleReset}
                                    className="w-full text-xs text-muted-foreground hover:text-slate-900"
                                >
                                    <RotateCcw className="size-3.5 mr-1.5" />
                                    Reset Nilai Default (3.00)
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 9 Kriteria Live Simulator Sliders */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: 9 Kriteria List (2 Cols) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sliders className="size-5 text-amber-500" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                    Lembar Penilaian 9 Kriteria Akreditasi
                                </h2>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Skala Nilai: 1.00 (Kurang) s.d. 4.00 (Sangat Baik)
                            </span>
                        </div>

                        <div className="space-y-3">
                            {kriterias.map((k) => {
                                const val = scores[k.kode] ?? 3.0;
                                const bobot = Number(k.bobot_default) || 10;
                                const subtotal = Math.round(val * bobot * 100) / 100;

                                return (
                                    <Card
                                        key={k.id}
                                        className="border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
                                    >
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div className="flex items-start sm:items-center gap-2.5">
                                                    <span className="font-mono text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                                                        {k.kode}
                                                    </span>
                                                    <div>
                                                        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                                                            {k.nama}
                                                        </h3>
                                                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                                                            {k.deskripsi}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 self-end sm:self-center">
                                                    <div className="text-right">
                                                        <span className="text-[10px] text-muted-foreground block">
                                                            Bobot: {bobot}%
                                                        </span>
                                                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                                            Subtotal: {subtotal.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="w-16">
                                                        <Input
                                                            type="number"
                                                            min={1.0}
                                                            max={4.0}
                                                            step={0.05}
                                                            className="h-8 text-xs font-bold text-center"
                                                            value={val}
                                                            onChange={(e) =>
                                                                handleScoreChange(
                                                                    k.kode,
                                                                    Math.min(4.0, Math.max(1.0, parseFloat(e.target.value) || 1.0))
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Range Slider for UX */}
                                            <div className="flex items-center gap-3 pt-1">
                                                <span className="text-[10px] text-muted-foreground">1.0</span>
                                                <input
                                                    type="range"
                                                    min="1.0"
                                                    max="4.0"
                                                    step="0.05"
                                                    value={val}
                                                    onChange={(e) => handleScoreChange(k.kode, parseFloat(e.target.value))}
                                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                                />
                                                <span className="text-[10px] text-muted-foreground">4.0</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Metadata & Information Panel (1 Col) */}
                    <div className="space-y-4">
                        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                                    <FileSpreadsheet className="size-4 text-amber-500" />
                                    Konfigurasi Instrumen & Catatan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-xs">
                                <div className="space-y-1">
                                    <Label className="text-xs">Program Studi Terpilih</Label>
                                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-slate-100">
                                        {activeProdi?.jenjang} {activeProdi?.nama}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Tahun Akademik Acuan</Label>
                                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                                        {activeYear ? `${activeYear.kode} (${activeYear.tahun} ${activeYear.semester})` : 'Aktif'}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Nama Instrumen Akreditasi *</Label>
                                    <Input
                                        value={instrumen}
                                        onChange={(e) => setInstrumen(e.target.value)}
                                        placeholder="Contoh: APS 4.0 BAN-PT..."
                                        className="h-8 text-xs"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Catatan Tim Akreditasi / Task Force</Label>
                                    <textarea
                                        rows={4}
                                        className="w-full rounded-md border border-input bg-background p-2 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                        placeholder="Catatan kelemahan butir, bukti dokumen yang perlu dikejar..."
                                        value={catatan}
                                        onChange={(e) => setCatatan(e.target.value)}
                                    />
                                </div>

                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold mt-2"
                                >
                                    <Save className="size-4 mr-1.5" />
                                    {isSaving ? 'Menyimpan...' : 'Simpan Simulasi'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Guide Card */}
                        <Card className="border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shadow-xs">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
                                    <Info className="size-3.5 text-blue-500" />
                                    Ketentuan Predikat BAN-PT
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-xs text-muted-foreground">
                                <p className="leading-relaxed">
                                    Perhitungan skor akreditasi BAN-PT mengalikan skor butir indikator per kriteria (skala 1 - 4) dengan bobot persentase masing-masing kriteria.
                                </p>
                                <ul className="space-y-1 text-[11px] list-disc list-inside">
                                    <li><strong className="text-emerald-600 dark:text-emerald-400">Unggul:</strong> Total Skor &ge; 361</li>
                                    <li><strong className="text-blue-600 dark:text-blue-400">Baik Sekali:</strong> Total Skor 301 - 360</li>
                                    <li><strong className="text-amber-600 dark:text-amber-400">Baik:</strong> Total Skor 200 - 300</li>
                                    <li><strong className="text-red-600 dark:text-red-400">Tidak Terakreditasi:</strong> Total Skor &lt; 200</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

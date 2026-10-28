import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    FilePieChart,
    Send,
    HelpCircle,
    CheckCircle2,
    GraduationCap,
    BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { Kuesioner, ProgramStudi, User } from '@/types';

type Props = {
    kuesioner: Kuesioner;
    dosens: User[];
    prodis: ProgramStudi[];
};

export default function KuesionerFill({ kuesioner, dosens, prodis }: Props) {
    const [dosenId, setDosenId] = useState(dosens[0]?.id ? String(dosens[0].id) : '');
    const [mataKuliah, setMataKuliah] = useState('');
    const [prodiId, setProdiId] = useState(prodis[0]?.id ? String(prodis[0].id) : '');
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [saran, setSaran] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSelectScore = (pertanyaanId: number, score: number) => {
        setAnswers((prev) => ({
            ...prev,
            [String(pertanyaanId)]: score,
        }));
    };

    const isAllAnswered = kuesioner.pertanyaans?.every((p) => answers[String(p.id)] !== undefined);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (kuesioner.tipe === 'EDOM' && !mataKuliah.trim()) {
            alert('Mohon isi nama mata kuliah yang dinilai.');
            return;
        }

        if (!isAllAnswered) {
            alert('Mohon lengkapi seluruh butir pertanyaan kuesioner sebelum mengirimkan.');
            return;
        }

        setIsSubmitting(true);
        router.post(
            `/survei/kuesioner/${kuesioner.id}/submit`,
            {
                jawaban: answers,
                dosen_id: kuesioner.tipe === 'EDOM' ? dosenId : null,
                mata_kuliah: kuesioner.tipe === 'EDOM' ? mataKuliah : null,
                program_studi_id: prodiId || null,
                saran_masukan: saran,
            },
            {
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    const getScaleLabels = (tipe: string) => {
        if (tipe === 'EDOM') {
            return [
                { value: 1, label: '1 - Kurang Baik' },
                { value: 2, label: '2 - Cukup Baik' },
                { value: 3, label: '3 - Baik' },
                { value: 4, label: '4 - Sangat Baik' },
            ];
        }
        return [
            { value: 1, label: '1 - Sangat Tidak Puas' },
            { value: 2, label: '2 - Tidak Puas' },
            { value: 3, label: '3 - Puas' },
            { value: 4, label: '4 - Sangat Puas' },
        ];
    };

    const scaleOptions = getScaleLabels(kuesioner.tipe);

    return (
        <>
            <Head title={`Pengisian Kuesioner: ${kuesioner.judul}`} />

            <div className="flex-1 max-w-4xl mx-auto space-y-6 p-4 md:p-8 pt-4">
                {/* Header Back & Info */}
                <div className="flex items-center gap-3">
                    <Link href={`/survei/kuesioner/${kuesioner.id}`}>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                            <ArrowLeft className="size-4" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {kuesioner.judul}
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Tahun Akademik: {kuesioner.tahun_akademik?.kode} &bull; Responden: {kuesioner.target_role}
                        </p>
                    </div>
                </div>

                {/* Form Wrapper */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Header Context Box for EDOM */}
                    {kuesioner.tipe === 'EDOM' && (
                        <Card className="border-slate-200 dark:border-slate-800 bg-purple-50/20 dark:bg-purple-950/10 shadow-xs">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-purple-900 dark:text-purple-300">
                                    <GraduationCap className="size-4" />
                                    Data Dosen & Mata Kuliah yang Dievaluasi
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Pilih dosen dan mata kuliah yang Anda tempuh pada semester ini.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="space-y-1">
                                    <Label className="text-xs">Nama Dosen Pengampu *</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={dosenId}
                                        onChange={(e) => setDosenId(e.target.value)}
                                        required
                                    >
                                        {dosens.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Nama Mata Kuliah *</Label>
                                    <Input
                                        placeholder="Contoh: Filsafat Veda..."
                                        value={mataKuliah}
                                        onChange={(e) => setMataKuliah(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Program Studi</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                        value={prodiId}
                                        onChange={(e) => setProdiId(e.target.value)}
                                    >
                                        {prodis.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.jenjang} {p.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Instruction Box */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
                        <HelpCircle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                        <div>
                            <span className="font-semibold block">Petunjuk Pengisian:</span>
                            Berikan penilaian secara objektif dan jujur. Pilihlah salah satu opsi skala penilaian untuk setiap butir pernyataan di bawah ini.
                        </div>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-4">
                        {kuesioner.pertanyaans?.map((p, idx) => {
                            const currentScore = answers[String(p.id)];

                            return (
                                <Card
                                    key={p.id}
                                    className={`border transition-colors ${
                                        currentScore !== undefined
                                            ? 'border-emerald-500/40 dark:border-emerald-500/30 bg-card'
                                            : 'border-slate-200 dark:border-slate-800'
                                    }`}
                                >
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-start gap-2.5">
                                            <span className="font-mono text-xs font-bold text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded shrink-0">
                                                #{idx + 1}
                                            </span>
                                            <div>
                                                <Badge variant="outline" className="text-[10px] mb-1 font-semibold">
                                                    Aspek: {p.aspek}
                                                </Badge>
                                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                                                    {p.teks_pertanyaan}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Scale Options */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                                            {scaleOptions.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => handleSelectScore(p.id, opt.value)}
                                                    className={`p-2.5 text-xs font-semibold rounded-md border text-center transition-all ${
                                                        currentScore === opt.value
                                                            ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-xs'
                                                            : 'bg-background hover:bg-slate-100 dark:hover:bg-slate-800 border-input text-slate-700 dark:text-slate-300'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Qualitative Feedback */}
                    <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold">
                                Saran & Masukan Kualitatif (Opsional)
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Sampaikan kritik konstruktif, apresiasi, atau rekomendasi peningkatan mutu.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                rows={3}
                                className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                placeholder="Tuliskan masukan atau saran Anda di sini..."
                                value={saran}
                                onChange={(e) => setSaran(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href={`/survei/kuesioner/${kuesioner.id}`}>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isAllAnswered}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-xs gap-1.5"
                        >
                            <Send className="size-4" />
                            {isSubmitting ? 'Mengirimkan...' : 'Kirim Jawaban Survei'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

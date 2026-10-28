import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    FilePieChart,
    Plus,
    Trash2,
    Calendar,
    Users,
    Star,
    Sparkles,
    Send,
    HelpCircle,
    UserCheck,
    MessageSquare,
    CheckCircle2,
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
import type { Kuesioner, PertanyaanKuesioner, ProgramStudi, User } from '@/types';

type Props = {
    kuesioner: Kuesioner;
    dosens: User[];
    prodis: ProgramStudi[];
    avgScore: number;
};

export default function KuesionerShow({ kuesioner, dosens, prodis, avgScore }: Props) {
    const [isAddPertanyaanOpen, setIsAddPertanyaanOpen] = useState(false);
    const [deletingPertanyaan, setDeletingPertanyaan] = useState<PertanyaanKuesioner | null>(null);

    const [pertanyaanForm, setPertanyaanForm] = useState({
        nomor_urut: String((kuesioner.pertanyaans?.length || 0) + 1),
        aspek: kuesioner.tipe === 'EDOM' ? 'Pedagogik' : 'Tangibles',
        teks_pertanyaan: '',
        tipe_jawaban: 'skala_4',
    });

    const handleCreatePertanyaan = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/survei/kuesioner/${kuesioner.id}/pertanyaan`, pertanyaanForm, {
            onSuccess: () => {
                setIsAddPertanyaanOpen(false);
                setPertanyaanForm({
                    nomor_urut: String((kuesioner.pertanyaans?.length || 0) + 2),
                    aspek: kuesioner.tipe === 'EDOM' ? 'Pedagogik' : 'Tangibles',
                    teks_pertanyaan: '',
                    tipe_jawaban: 'skala_4',
                });
            },
        });
    };

    const handleDeletePertanyaan = () => {
        if (!deletingPertanyaan) return;
        router.delete(`/survei/pertanyaan/${deletingPertanyaan.id}`, {
            onSuccess: () => {
                setDeletingPertanyaan(null);
            },
        });
    };

    const getScoreCategory = (score: number) => {
        if (score >= 3.5) return { label: 'Sangat Baik / Sangat Puas', color: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' };
        if (score >= 2.75) return { label: 'Baik / Puas', color: 'text-blue-600 dark:text-blue-400', badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30' };
        if (score >= 2.0) return { label: 'Cukup', color: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' };
        return { label: 'Kurang', color: 'text-red-600 dark:text-red-400', badge: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30' };
    };

    const category = getScoreCategory(avgScore);

    // Grouping pertanyaan berdasarkan aspek
    const groupedPertanyaan: Record<string, PertanyaanKuesioner[]> = {};
    kuesioner.pertanyaans?.forEach((p) => {
        if (!groupedPertanyaan[p.aspek]) {
            groupedPertanyaan[p.aspek] = [];
        }
        groupedPertanyaan[p.aspek].push(p);
    });

    return (
        <>
            <Head title={`Kelola Kuesioner: ${kuesioner.judul}`} />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/survei/kuesioner">
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                <ArrowLeft className="size-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <FilePieChart className="size-6 text-amber-500" />
                                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                    {kuesioner.judul}
                                </h1>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Kode: <span className="font-mono">{kuesioner.kode}</span> &bull; Tahun Akademik: {kuesioner.tahun_akademik?.kode} &bull; Target: {kuesioner.target_role}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/survei/kuesioner/${kuesioner.id}/isi`}>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold gap-1.5">
                                <Send className="size-4" />
                                Buka Form Pengisian
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Score Summary & Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Score Card */}
                    <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-card to-amber-500/5 shadow-xs">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
                                <Star className="size-4 text-amber-500" />
                                Indeks Kepuasan Rata-Rata
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-900 dark:text-slate-100">
                                    {avgScore > 0 ? avgScore.toFixed(2) : '0.00'}
                                </span>
                                <span className="text-sm text-muted-foreground">/ 4.00</span>
                            </div>
                            <div>
                                <Badge className={`text-xs ${category.badge}`}>
                                    <Sparkles className="size-3 mr-1" />
                                    {category.label}
                                </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground pt-1">
                                Dihitung dari {kuesioner.respons?.length || 0} respon survei yang telah masuk.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Metadata Card */}
                    <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
                                <Calendar className="size-4 text-blue-500" />
                                Waktu & Status Pengisian
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Periode Buka:</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                    {String(kuesioner.tanggal_mulai).substring(0, 10)} s.d. {String(kuesioner.tanggal_selesai).substring(0, 10)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status Kuesioner:</span>
                                <span>{kuesioner.is_active ? <Badge className="text-[10px] bg-emerald-500/10 text-emerald-700">Dibuka</Badge> : <Badge variant="outline" className="text-[10px]">Ditutup</Badge>}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Pertanyaan:</span>
                                <span className="font-semibold">{kuesioner.pertanyaans?.length || 0} Butir</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description Card */}
                    <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
                                <HelpCircle className="size-4 text-amber-500" />
                                Deskripsi Instrumen
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                {kuesioner.deskripsi || 'Tidak ada deskripsi tambahan.'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Butir Pertanyaan Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <span>Butir Pertanyaan Kuesioner</span>
                                    <Badge variant="outline">{kuesioner.pertanyaans?.length || 0} Butir</Badge>
                                </CardTitle>
                                <CardDescription>
                                    Pertanyaan dikelompokkan berdasarkan aspek evaluasi mutu pendidikan & layanan.
                                </CardDescription>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => setIsAddPertanyaanOpen(true)}
                                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                            >
                                <Plus className="size-4 mr-1.5" />
                                Tambah Butir Pertanyaan
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {Object.keys(groupedPertanyaan).map((aspek) => (
                                <div key={aspek} className="space-y-2">
                                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
                                        <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs font-semibold">
                                            Aspek: {aspek}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            ({groupedPertanyaan[aspek].length} Pertanyaan)
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {groupedPertanyaan[aspek].map((p) => (
                                            <div
                                                key={p.id}
                                                className="flex items-start justify-between gap-4 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="font-mono text-xs font-bold text-muted-foreground pt-0.5">
                                                        #{p.nomor_urut}
                                                    </span>
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                                                            {p.teks_pertanyaan}
                                                        </p>
                                                        <span className="text-[10px] text-muted-foreground block mt-1">
                                                            Tipe Jawaban: Skala Likert 4 Nilai (1 - 4)
                                                        </span>
                                                    </div>
                                                </div>

                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                                                    onClick={() => setDeletingPertanyaan(p)}
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {(!kuesioner.pertanyaans || kuesioner.pertanyaans.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    Belum ada butir pertanyaan yang ditambahkan ke kuesioner ini.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Respon Masuk Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center justify-between">
                            <span>Respon Masuk Responden ({kuesioner.respons?.length || 0})</span>
                        </CardTitle>
                        <CardDescription>
                            Daftar hasil penilaian responden beserta masukan kualitatif.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-muted-foreground uppercase">
                                        <th className="pb-3 font-semibold">Responden / Tanggal</th>
                                        {kuesioner.tipe === 'EDOM' && <th className="pb-3 font-semibold">Dosen & Mata Kuliah</th>}
                                        <th className="pb-3 font-semibold text-center">Skor Rata-Rata</th>
                                        <th className="pb-3 font-semibold max-w-md">Saran / Masukan Kualitatif</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {kuesioner.respons?.map((r) => (
                                        <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 text-xs">
                                            <td className="py-3">
                                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {r.user?.name || 'Anonim (Mahasiswa)'}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {r.created_at ? String(r.created_at).substring(0, 10) : '-'}
                                                </span>
                                            </td>
                                            {kuesioner.tipe === 'EDOM' && (
                                                <td className="py-3">
                                                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                        {r.dosen?.name || '-'}
                                                    </div>
                                                    <span className="text-[11px] text-muted-foreground block">
                                                        {r.mata_kuliah || '-'}
                                                    </span>
                                                </td>
                                            )}
                                            <td className="py-3 text-center">
                                                <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold">
                                                    {Number(r.skor_rata_rata).toFixed(2)}
                                                </Badge>
                                            </td>
                                            <td className="py-3 max-w-md text-slate-700 dark:text-slate-300 italic">
                                                {r.saran_masukan ? `"${r.saran_masukan}"` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!kuesioner.respons || kuesioner.respons.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">
                                                Belum ada respon masuk untuk kuesioner ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Pertanyaan */}
            <Dialog open={isAddPertanyaanOpen} onOpenChange={setIsAddPertanyaanOpen}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleCreatePertanyaan}>
                        <DialogHeader>
                            <DialogTitle>Tambah Butir Pertanyaan</DialogTitle>
                            <DialogDescription>
                                Masukkan teks pertanyaan dan kelompokkan berdasarkan aspek evaluasi.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Nomor Urut *</Label>
                                    <Input
                                        type="number"
                                        value={pertanyaanForm.nomor_urut}
                                        onChange={(e) => setPertanyaanForm({ ...pertanyaanForm, nomor_urut: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Aspek Evaluasi *</Label>
                                    <Input
                                        placeholder="Pedagogik, Profesional, Tangibles, dll..."
                                        value={pertanyaanForm.aspek}
                                        onChange={(e) => setPertanyaanForm({ ...pertanyaanForm, aspek: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Teks Pertanyaan Kuesioner *</Label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Tuliskan butir pernyataan atau pertanyaan..."
                                    value={pertanyaanForm.teks_pertanyaan}
                                    onChange={(e) => setPertanyaanForm({ ...pertanyaanForm, teks_pertanyaan: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Tipe Skala Jawaban *</Label>
                                <select
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                    value={pertanyaanForm.tipe_jawaban}
                                    onChange={(e) => setPertanyaanForm({ ...pertanyaanForm, tipe_jawaban: e.target.value })}
                                >
                                    <option value="skala_4">Skala Likert 4 Nilai (1: Kurang, 2: Cukup, 3: Baik, 4: Sangat Baik)</option>
                                    <option value="skala_5">Skala Likert 5 Nilai (1 - 5)</option>
                                    <option value="teks">Teks Bebas / Esai</option>
                                </select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddPertanyaanOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Simpan Pertanyaan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus Pertanyaan */}
            <Dialog open={Boolean(deletingPertanyaan)} onOpenChange={(open) => !open && setDeletingPertanyaan(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Butir Pertanyaan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus butir pertanyaan ini?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingPertanyaan(null)}>
                            Batal
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDeletePertanyaan}>
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

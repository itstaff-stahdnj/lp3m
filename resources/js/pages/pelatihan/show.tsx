import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    Plus,
    Calendar,
    Users,
    Clock,
    BookOpen,
    MapPin,
    CheckCircle2,
    FileText,
    Sparkles,
    UserCheck,
    GraduationCap,
    Edit2,
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
import type { Pelatihan, PesertaPelatihan, User } from '@/types';

type Props = {
    pelatihan: Pelatihan;
    users: User[];
};

export default function PelatihanShow({ pelatihan, users }: Props) {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ? String(users[0].id) : '');
    const [editingPeserta, setEditingPeserta] = useState<PesertaPelatihan | null>(null);

    const [pesertaForm, setPesertaForm] = useState({
        status_kehadiran: 'Lulus',
        nomor_sertifikat: '',
        catatan_evaluasi: '',
    });

    const openEditPesertaModal = (p: PesertaPelatihan) => {
        setEditingPeserta(p);
        setPesertaForm({
            status_kehadiran: p.status_kehadiran,
            nomor_sertifikat: p.nomor_sertifikat || '',
            catatan_evaluasi: p.catatan_evaluasi || '',
        });
    };

    const handleRegisterPeserta = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            `/pelatihan/${pelatihan.id}/register`,
            { user_id: selectedUserId },
            {
                onSuccess: () => {
                    setIsRegisterOpen(false);
                },
            }
        );
    };

    const handleUpdatePeserta = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPeserta) return;

        router.put(`/pelatihan/peserta/${editingPeserta.id}`, pesertaForm, {
            onSuccess: () => {
                setEditingPeserta(null);
            },
        });
    };

    const getStatusKehadiranBadge = (status: string) => {
        switch (status) {
            case 'Lulus':
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-bold';
            case 'Hadir':
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
            case 'Tidak Lulus':
                return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30';
            default:
                return 'bg-slate-500/10 text-muted-foreground border-slate-500/20';
        }
    };

    const countLulus = pelatihan.pesertas?.filter((p) => p.status_kehadiran === 'Lulus').length || 0;

    return (
        <>
            <Head title={`Kelola Pelatihan: ${pelatihan.judul}`} />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header Back & Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/pelatihan">
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                <ArrowLeft className="size-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <Award className="size-6 text-amber-500" />
                                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                    {pelatihan.judul}
                                </h1>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Kode: <span className="font-mono">{pelatihan.kode}</span> &bull; Kategori: {pelatihan.kategori} &bull; Status: <Badge className="text-[10px] ml-1">{pelatihan.status}</Badge>
                            </p>
                        </div>
                    </div>

                    <Button onClick={() => setIsRegisterOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                        <Plus className="size-4 mr-1.5" />
                        Daftarkan Peserta
                    </Button>
                </div>

                {/* Metadata & Silabus Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Information Card */}
                    <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
                                <Calendar className="size-4 text-amber-500" />
                                Pelaksanaan & Tempat
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Waktu:</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                    {String(pelatihan.tanggal_mulai).substring(0, 10)} s.d. {String(pelatihan.tanggal_selesai).substring(0, 10)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Beban Belajar:</span>
                                <span className="font-semibold">{pelatihan.jam_pelajaran} JP (Jam Pelajaran)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Lokasi:</span>
                                <span>{pelatihan.lokasi || 'Kampus STAH DNJ'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Narasumber:</span>
                                <span className="font-semibold">{pelatihan.narasumber || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Penyelenggara:</span>
                                <span>{pelatihan.penyelenggara}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Participant Summary Card */}
                    <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-card to-amber-500/5 shadow-xs">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
                                <Users className="size-4 text-emerald-500" />
                                Kuota & Sertifikat Terbit
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-baseline justify-between">
                                <div>
                                    <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                                        {pelatihan.pesertas?.length || 0}
                                    </span>
                                    <span className="text-xs text-muted-foreground"> / {pelatihan.kuota} Kuota</span>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
                                    {countLulus} Lulus Bersertifikat
                                </Badge>
                            </div>

                            <p className="text-[11px] text-muted-foreground">
                                Dosen dan tenaga kependidikan yang berstatus "Lulus" secara otomatis diterbitkan nomor sertifikat resmi institusi.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Silabus Card */}
                    <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
                                <BookOpen className="size-4 text-blue-500" />
                                Silabus Materi Pelatihan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line line-clamp-5">
                                {pelatihan.silabus_materi || 'Silabus belum dicantumkan.'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Peserta Pelatihan Table */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    Daftar Peserta & Sertifikat Digital ({pelatihan.pesertas?.length || 0})
                                </CardTitle>
                                <CardDescription>
                                    Verifikasi presensi kehadiran dan penerbitan sertifikat resmi kelulusan workshop.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-muted-foreground uppercase">
                                        <th className="pb-3 font-semibold">Nama Peserta (Dosen/Tendik)</th>
                                        <th className="pb-3 font-semibold">Unit / Program Studi</th>
                                        <th className="pb-3 font-semibold">Status Kehadiran</th>
                                        <th className="pb-3 font-semibold">Nomor & Tanggal Sertifikat</th>
                                        <th className="pb-3 font-semibold max-w-xs">Catatan Evaluasi</th>
                                        <th className="pb-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {pelatihan.pesertas?.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 text-xs">
                                            <td className="py-3">
                                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {p.user?.name}
                                                </div>
                                                <span className="font-mono text-[10px] text-muted-foreground">
                                                    NIP/NIDN: {p.user?.nip_nim || '-'}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="font-medium text-slate-800 dark:text-slate-200">
                                                    {p.user?.program_studi?.nama || p.user?.unit_kerja?.nama || 'STAH DNJ'}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground block">
                                                    Role: {p.user?.role?.display_name || 'Dosen'}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <Badge className={`text-[10px] ${getStatusKehadiranBadge(p.status_kehadiran)}`}>
                                                    {p.status_kehadiran}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                {p.nomor_sertifikat ? (
                                                    <div>
                                                        <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                                            <Sparkles className="size-3" />
                                                            {p.nomor_sertifikat}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground block">
                                                            Tgl Terbit: {String(p.tanggal_terbit_sertifikat).substring(0, 10)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground italic text-[11px]">Belum Diterbitkan</span>
                                                )}
                                            </td>
                                            <td className="py-3 max-w-xs text-slate-700 dark:text-slate-300 italic">
                                                {p.catatan_evaluasi || '-'}
                                            </td>
                                            <td className="py-3 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 text-xs border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
                                                    onClick={() => openEditPesertaModal(p)}
                                                >
                                                    <Edit2 className="size-3 mr-1" />
                                                    Sertifikat
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!pelatihan.pesertas || pelatihan.pesertas.length === 0) && (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">
                                                Belum ada peserta yang didaftarkan ke pelatihan ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Daftarkan Peserta */}
            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleRegisterPeserta}>
                        <DialogHeader>
                            <DialogTitle>Daftarkan Peserta Pelatihan</DialogTitle>
                            <DialogDescription>
                                Pilih dosen atau staf tenaga kependidikan STAH Dharma Nusantara Jakarta.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4 text-xs">
                            <div className="space-y-1">
                                <Label className="text-xs">Pilih Peserta *</Label>
                                <select
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    required
                                >
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.role?.display_name})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Daftarkan Sekarang
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Update Status & Sertifikat */}
            <Dialog open={Boolean(editingPeserta)} onOpenChange={(open) => !open && setEditingPeserta(null)}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleUpdatePeserta}>
                        <DialogHeader>
                            <DialogTitle>Update Status & Sertifikat Peserta</DialogTitle>
                            <DialogDescription>
                                {editingPeserta?.user?.name} &bull; {pelatihan.judul}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4 text-xs">
                            <div className="space-y-1">
                                <Label className="text-xs">Status Kelulusan / Kehadiran *</Label>
                                <select
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-ring"
                                    value={pesertaForm.status_kehadiran}
                                    onChange={(e) => setPesertaForm({ ...pesertaForm, status_kehadiran: e.target.value as any })}
                                >
                                    <option value="Lulus">Lulus (Terbitkan Sertifikat)</option>
                                    <option value="Hadir">Hadir (Selesai Mengikuti)</option>
                                    <option value="Terdaftar">Terdaftar</option>
                                    <option value="Tidak Lulus">Tidak Lulus</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Nomor Sertifikat (Opsional, kosongkan untuk auto-generate)</Label>
                                <Input
                                    placeholder="Contoh: SERT-DNJ/2026/0001"
                                    value={pesertaForm.nomor_sertifikat}
                                    onChange={(e) => setPesertaForm({ ...pesertaForm, nomor_sertifikat: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Catatan Evaluasi / Predikat</Label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Lulus dengan predikat Sangat Baik..."
                                    value={pesertaForm.catatan_evaluasi}
                                    onChange={(e) => setPesertaForm({ ...pesertaForm, catatan_evaluasi: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingPeserta(null)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                Simpan Sertifikat
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

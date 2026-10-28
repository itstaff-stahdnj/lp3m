import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    FileCheck2,
    Award,
    Plus,
    Printer,
    QrCode,
    Search,
    ExternalLink,
    CheckCircle2,
    Trash2,
    Edit2,
    Building2,
    Calendar,
    GraduationCap,
    ShieldCheck,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SuratMutu } from '@/types/laporan';
import type { ProfilInstitusi, ProgramStudi, TahunAkademik, UnitKerja, User } from '@/types';

type Props = {
    suratList: SuratMutu[];
    activeYear: TahunAkademik;
    tahunAkademiks: TahunAkademik[];
    prodis: ProgramStudi[];
    unitKerjas: UnitKerja[];
    users: Array<Pick<User, 'id' | 'name' | 'email' | 'nip_nim'>>;
    institution: ProfilInstitusi;
    filters: { jenis_surat?: string };
};

export default function SuratIndex({
    suratList,
    activeYear,
    tahunAkademiks,
    prodis,
    unitKerjas,
    users,
    institution,
    filters,
}: Props) {
    const [selectedSurat, setSelectedSurat] = useState<SuratMutu | null>(suratList[0] || null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [form, setForm] = useState({
        tahun_akademik_id: activeYear.id,
        nomor_surat: `0${suratList.length + 1}/LP3M/STAH-DNJ/${new Date().getFullYear()}`,
        jenis_surat: 'Surat Keterangan Akreditasi',
        perihal: '',
        tujuan_penerima: '',
        program_studi_id: '',
        unit_kerja_id: '',
        user_id: '',
        tanggal_surat: new Date().toISOString().split('T')[0],
        penandatangan_nama: 'Dr. I Nyoman Yoga, M.Pd.H.',
        penandatangan_jabatan: 'Ketua LP3M STAH Dharma Nusantara Jakarta',
        isi_ringkas: '',
        status: 'Diterbitkan',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredSurat = suratList.filter((s) => {
        const matchesSearch =
            s.nomor_surat.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.tujuan_penerima.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const handleCreateSurat = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            ...form,
            program_studi_id: form.program_studi_id ? Number(form.program_studi_id) : null,
            unit_kerja_id: form.unit_kerja_id ? Number(form.unit_kerja_id) : null,
            user_id: form.user_id ? Number(form.user_id) : null,
        };

        router.post('/surat', payload, {
            onFinish: () => {
                setIsSubmitting(false);
                setIsCreateModalOpen(false);
            },
        });
    };

    const handlePrintDocument = () => {
        window.print();
    };

    return (
        <>
            <Head title="Buku Nomor Surat Mutu & Sertifikasi - LP3M" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between print:hidden">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Surat Mutu & E-Sertifikat</h1>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                                Verifikasi QR Code
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Penerbitan surat keterangan akreditasi, bebas temuan audit AMI, rekomendasi mutu, dan sertifikat pelatihan.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="gap-1.5 shadow-xs">
                            <Plus className="h-4 w-4" />
                            <span>Terbitkan Surat / Sertifikat</span>
                        </Button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nomor surat, perihal, atau penerima..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 text-xs"
                        />
                    </div>

                    {/* Filter Kategori */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                        {[
                            { label: 'Semua Dokumen', value: '' },
                            { label: 'Akreditasi', value: 'Surat Keterangan Akreditasi' },
                            { label: 'Bebas Temuan AMI', value: 'Surat Bebas Temuan AMI' },
                            { label: 'Rekomendasi Mutu', value: 'Surat Rekomendasi Mutu' },
                            { label: 'E-Sertifikat', value: 'E-Sertifikat Pelatihan' },
                        ].map((btn) => (
                            <Button
                                key={btn.value}
                                variant={filters.jenis_surat === btn.value || (!filters.jenis_surat && btn.value === '') ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => router.get('/surat', btn.value ? { jenis_surat: btn.value } : {})}
                                className="text-xs h-8 px-2.5 whitespace-nowrap shadow-xs"
                            >
                                {btn.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Table / Grid Dokumen Surat Mutu */}
                <Card className="shadow-xs print:hidden">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Buku Register Surat & Dokumen Penjaminan Mutu</CardTitle>
                        <CardDescription>Daftar seluruh surat resmi dan sertifikat yang telah diterbitkan LP3M</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border overflow-hidden">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-muted text-muted-foreground border-b uppercase font-semibold">
                                    <tr>
                                        <th className="p-3">Nomor Surat / Token</th>
                                        <th className="p-3">Jenis Dokumen</th>
                                        <th className="p-3">Perihal & Tujuan</th>
                                        <th className="p-3">Tanggal Terbit</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredSurat.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-6 text-center text-muted-foreground">
                                                Tidak ada surat mutu yang cocok dengan pencarian atau filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSurat.map((s) => (
                                            <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-3 font-mono font-medium">
                                                    <div>{s.nomor_surat}</div>
                                                    <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                                                        {s.qr_token}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <Badge variant="outline" className="text-[10px]">
                                                        {s.jenis_surat}
                                                    </Badge>
                                                </td>
                                                <td className="p-3 max-w-xs">
                                                    <div className="font-semibold text-foreground line-clamp-1">{s.perihal}</div>
                                                    <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                                        Untuk: {s.tujuan_penerima}
                                                    </div>
                                                </td>
                                                <td className="p-3 whitespace-nowrap">{s.tanggal_surat}</td>
                                                <td className="p-3">
                                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                                                        {s.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setSelectedSurat(s);
                                                                setIsPreviewModalOpen(true);
                                                            }}
                                                            className="h-7 px-2 text-xs"
                                                            title="Pratinjau & Cetak Surat"
                                                        >
                                                            <Printer className="h-3.5 w-3.5 mr-1" /> Cetak
                                                        </Button>
                                                        <a
                                                            href={`/verifikasi-surat/${s.qr_token}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center justify-center h-7 px-2 text-xs rounded-md border hover:bg-muted transition-colors text-muted-foreground"
                                                            title="Buka Halaman Verifikasi Publik"
                                                        >
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </a>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                if (confirm('Yakin ingin menghapus surat ini?')) {
                                                                    router.delete(`/surat/${s.id}`);
                                                                }
                                                            }}
                                                            className="h-7 px-1.5 text-rose-500 hover:text-rose-600"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Surat / Sertifikat */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg bg-background rounded-xl border p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="font-bold text-base">Terbitkan Dokumen / Surat Mutu Baru</h3>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-muted-foreground hover:text-foreground text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateSurat} className="space-y-3.5 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="noSurat">Nomor Surat Resmi</Label>
                                    <Input
                                        id="noSurat"
                                        value={form.nomor_surat}
                                        onChange={(e) => setForm({ ...form, nomor_surat: e.target.value })}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="jenis">Jenis Dokumen</Label>
                                    <select
                                        id="jenis"
                                        value={form.jenis_surat}
                                        onChange={(e) => setForm({ ...form, jenis_surat: e.target.value })}
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs mt-1"
                                    >
                                        <option value="Surat Keterangan Akreditasi">Surat Keterangan Akreditasi</option>
                                        <option value="Surat Bebas Temuan AMI">Surat Bebas Temuan AMI</option>
                                        <option value="Surat Rekomendasi Mutu">Surat Rekomendasi Mutu</option>
                                        <option value="E-Sertifikat Pelatihan">E-Sertifikat Pelatihan</option>
                                        <option value="Surat Pengantar Audit">Surat Pengantar Audit</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="perihal">Perihal Dokumen</Label>
                                <Input
                                    id="perihal"
                                    value={form.perihal}
                                    onChange={(e) => setForm({ ...form, perihal: e.target.value })}
                                    required
                                    className="mt-1"
                                    placeholder="cth: Surat Keterangan Akreditasi Program Studi S-1 PAH"
                                />
                            </div>

                            <div>
                                <Label htmlFor="tujuan">Tujuan / Nama Penerima</Label>
                                <Input
                                    id="tujuan"
                                    value={form.tujuan_penerima}
                                    onChange={(e) => setForm({ ...form, tujuan_penerima: e.target.value })}
                                    required
                                    className="mt-1"
                                    placeholder="cth: Ni Wayan Sudarmini, M.Pd.H. / Kaprodi S1 PAH"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="prodiSurat">Program Studi (Jika Ada)</Label>
                                    <select
                                        id="prodiSurat"
                                        value={form.program_studi_id}
                                        onChange={(e) => setForm({ ...form, program_studi_id: e.target.value })}
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs mt-1"
                                    >
                                        <option value="">-- Tidak Terkait Prodi --</option>
                                        {prodis.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="tglSurat">Tanggal Surat</Label>
                                    <Input
                                        id="tglSurat"
                                        type="date"
                                        value={form.tanggal_surat}
                                        onChange={(e) => setForm({ ...form, tanggal_surat: e.target.value })}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="isiRingkas">Isi Ringkas / Keterangan Surat</Label>
                                <textarea
                                    id="isiRingkas"
                                    rows={4}
                                    value={form.isi_ringkas}
                                    onChange={(e) => setForm({ ...form, isi_ringkas: e.target.value })}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1"
                                    placeholder="Tuliskan isi keterangan resmi..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="pejabat">Penandatangan</Label>
                                    <Input
                                        id="pejabat"
                                        value={form.penandatangan_nama}
                                        onChange={(e) => setForm({ ...form, penandatangan_nama: e.target.value })}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="jabatan">Jabatan</Label>
                                    <Input
                                        id="jabatan"
                                        value={form.penandatangan_jabatan}
                                        onChange={(e) => setForm({ ...form, penandatangan_jabatan: e.target.value })}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" size="sm" disabled={isSubmitting}>
                                    {isSubmitting ? 'Menerbitkan...' : 'Terbitkan Dokumen & QR Token'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Pratinjau Surat Resmi Siap Cetak */}
            {isPreviewModalOpen && selectedSurat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-2xl bg-white text-black rounded-xl p-8 shadow-2xl space-y-6 max-h-[95vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b pb-3 print:hidden">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Pratinjau Dokumen Mutu Resmi (Siap Cetak)
                            </span>
                            <div className="flex items-center gap-2">
                                <Button size="sm" onClick={handlePrintDocument} className="gap-1.5">
                                    <Printer className="h-4 w-4" /> Cetak Sekarang
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setIsPreviewModalOpen(false)}
                                    className="p-1 text-gray-500 hover:text-black"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Kop Surat STAH DNJ */}
                        <div className="border-b-2 border-black pb-3 text-center">
                            <h2 className="text-base font-bold uppercase tracking-wider">
                                {institution.nama_institusi || 'SEKOLAH TINGGI AGAMA HINDU DHARMA NUSANTARA JAKARTA'}
                            </h2>
                            <h3 className="text-sm font-semibold text-gray-700">
                                LEMBAGA PENJAMINAN MUTU DAN PENGEMBANGAN PEMBELAJARAN (LP3M)
                            </h3>
                            <p className="text-[11px] text-gray-600 mt-1">
                                {institution.alamat || 'Jl. Daksinapati Raya No. 10 Rawamangun, Jakarta Timur'} | Telp:{' '}
                                {institution.telepon || '(021) 47867389'} | Website: lp3m.stahdnj.ac.id
                            </p>
                        </div>

                        {/* Judul & Nomor Surat */}
                        <div className="text-center space-y-1">
                            <h4 className="text-sm font-bold uppercase underline tracking-wide">
                                {selectedSurat.jenis_surat}
                            </h4>
                            <p className="text-xs font-mono text-gray-700">Nomor: {selectedSurat.nomor_surat}</p>
                        </div>

                        {/* Isi Dokumen */}
                        <div className="text-xs leading-relaxed space-y-3 text-justify">
                            <p>Yang bertanda tangan di bawah ini:</p>
                            <div className="pl-4 space-y-1">
                                <div className="grid grid-cols-4">
                                    <span className="text-gray-600">Nama:</span>
                                    <span className="col-span-3 font-semibold">{selectedSurat.penandatangan_nama}</span>
                                </div>
                                <div className="grid grid-cols-4">
                                    <span className="text-gray-600">Jabatan:</span>
                                    <span className="col-span-3">{selectedSurat.penandatangan_jabatan}</span>
                                </div>
                            </div>

                            <p>Dengan ini menerangkan dengan sebenarnya bahwa:</p>
                            <div className="pl-4 space-y-1">
                                <div className="grid grid-cols-4">
                                    <span className="text-gray-600">Penerima / Unit:</span>
                                    <span className="col-span-3 font-semibold">{selectedSurat.tujuan_penerima}</span>
                                </div>
                                <div className="grid grid-cols-4">
                                    <span className="text-gray-600">Perihal:</span>
                                    <span className="col-span-3">{selectedSurat.perihal}</span>
                                </div>
                            </div>

                            <p className="pt-2 whitespace-pre-line leading-relaxed border-t border-gray-200">
                                {selectedSurat.isi_ringkas}
                            </p>

                            <p className="pt-2">
                                Demikian surat keterangan/rekomendasi ini diterbitkan untuk dipergunakan sebagaimana mestinya.
                            </p>
                        </div>

                        {/* Lembar Tanda Tangan & QR Code Token */}
                        <div className="grid grid-cols-2 gap-4 pt-6 mt-4 border-t border-gray-300 text-xs items-center">
                            {/* Kotak QR Code Verifikasi */}
                            <div className="border border-dashed border-gray-400 p-3 rounded-lg text-center space-y-1 max-w-[200px]">
                                <div className="flex justify-center text-gray-800">
                                    <QrCode className="h-14 w-14" />
                                </div>
                                <div className="text-[9px] font-mono text-gray-500">Scan QR Verifikasi</div>
                                <div className="text-[8px] font-mono font-bold text-gray-700 truncate">
                                    {selectedSurat.qr_token}
                                </div>
                            </div>

                            {/* Tanda Tangan Pejabat */}
                            <div className="text-center">
                                <p className="text-gray-600 mb-14">
                                    Jakarta, {selectedSurat.tanggal_surat}
                                    <br />
                                    <strong>{selectedSurat.penandatangan_jabatan}</strong>
                                </p>
                                <p className="font-bold underline">{selectedSurat.penandatangan_nama}</p>
                                <p className="text-[10px] text-gray-500">NIP. 197805122005011002</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

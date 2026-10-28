import { Head } from '@inertiajs/react';
import { CheckCircle2, ShieldCheck, QrCode, FileText, Landmark, Calendar, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SuratMutu } from '@/types/laporan';
import type { ProfilInstitusi } from '@/types';

type Props = {
    surat: SuratMutu;
    institution: ProfilInstitusi;
};

export default function SuratVerify({ surat, institution }: Props) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
            <Head title={`Verifikasi Dokumen: ${surat.nomor_surat}`} />

            <div className="w-full max-w-xl space-y-4">
                {/* Header Institusi */}
                <div className="text-center space-y-1">
                    <div className="inline-flex p-2.5 rounded-full bg-emerald-500/10 text-emerald-600 mb-2">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <h1 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                        {institution.nama_institusi || 'STAH DHARMA NUSANTARA JAKARTA'}
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium">
                        Sistem Informasi Penjaminan Mutu Internal (LP3M) • Portal Verifikasi Publik
                    </p>
                </div>

                {/* Kartu Status Verifikasi */}
                <Card className="border-emerald-500/30 shadow-lg overflow-hidden">
                    <div className="bg-emerald-600 px-4 py-3 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-bold text-sm tracking-wide">DOKUMEN RESMI TERVERIFIKASI</span>
                        </div>
                        <Badge className="bg-white/20 text-white border-transparent text-[11px] font-mono">
                            STATUS: ASLI
                        </Badge>
                    </div>

                    <CardContent className="p-5 space-y-4 text-xs">
                        {/* Detail Nomor Surat */}
                        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                            <span className="text-muted-foreground text-[11px]">Nomor Dokumen Resmi:</span>
                            <div className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-400">
                                {surat.nomor_surat}
                            </div>
                        </div>

                        {/* Rincian Dokumen */}
                        <div className="divide-y border rounded-lg bg-card overflow-hidden">
                            <div className="p-3 grid grid-cols-3">
                                <span className="text-muted-foreground">Jenis Dokumen:</span>
                                <span className="col-span-2 font-semibold text-foreground">{surat.jenis_surat}</span>
                            </div>
                            <div className="p-3 grid grid-cols-3">
                                <span className="text-muted-foreground">Perihal:</span>
                                <span className="col-span-2 font-semibold text-foreground">{surat.perihal}</span>
                            </div>
                            <div className="p-3 grid grid-cols-3">
                                <span className="text-muted-foreground">Tujuan / Penerima:</span>
                                <span className="col-span-2 font-semibold text-foreground">{surat.tujuan_penerima}</span>
                            </div>
                            <div className="p-3 grid grid-cols-3">
                                <span className="text-muted-foreground">Tanggal Terbit:</span>
                                <span className="col-span-2 text-foreground">{surat.tanggal_surat}</span>
                            </div>
                            <div className="p-3 grid grid-cols-3">
                                <span className="text-muted-foreground">Penandatangan:</span>
                                <span className="col-span-2 text-foreground font-semibold">
                                    {surat.penandatangan_nama}
                                    <div className="text-[11px] text-muted-foreground font-normal">
                                        {surat.penandatangan_jabatan}
                                    </div>
                                </span>
                            </div>
                        </div>

                        {/* Ringkasan Isi */}
                        <div>
                            <span className="font-semibold text-foreground block mb-1">Ringkasan Keterangan Resmi:</span>
                            <p className="p-3 rounded-lg bg-muted/40 border text-muted-foreground leading-relaxed whitespace-pre-line text-justify">
                                {surat.isi_ringkas}
                            </p>
                        </div>

                        {/* Token Hash */}
                        <div className="pt-2 border-t text-[10px] text-muted-foreground flex items-center justify-between font-mono">
                            <span>Hash Token: {surat.qr_token}</span>
                            <span className="text-emerald-600 font-bold">Terdaftar di Basis Data STAH DNJ</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center text-[11px] text-muted-foreground">
                    Dokumen ini sah dan diterbitkan secara elektronik oleh Lembaga Penjaminan Mutu & Pengembangan Pembelajaran (LP3M) STAH Dharma Nusantara Jakarta.
                </div>
            </div>
        </div>
    );
}

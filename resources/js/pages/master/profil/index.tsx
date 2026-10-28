import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Landmark,
    Save,
    Building,
    Compass,
    Phone,
    Globe,
    Mail,
    MapPin,
    UserCheck,
    CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ProfilInstitusi } from '@/types';

type Props = {
    profile: ProfilInstitusi;
};

export default function ProfilInstitusiIndex({ profile }: Props) {
    const [formData, setFormData] = useState({
        nama_kampus: profile.nama_kampus || 'Sekolah Tinggi Agama Hindu Dharma Nusantara Jakarta',
        singkatan: profile.singkatan || 'STAH DNJ',
        motto: profile.motto || 'Satyam Eva Jayate - Widya Sewanam',
        visi: profile.visi || '',
        misi: profile.misi || '',
        tujuan: profile.tujuan || '',
        alamat: profile.alamat || '',
        telepon: profile.telepon || '',
        email: profile.email || '',
        website: profile.website || '',
        nama_ketua_stah: profile.nama_ketua_stah || '',
        nama_ketua_lp3m: profile.nama_ketua_lp3m || '',
        logo_url: profile.logo_url || '',
    });

    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put('/master/profil', formData, {
            onSuccess: () => {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 3000);
            },
        });
    };

    return (
        <>
            <Head title="Profil Institusi - LP3M STAH DNJ" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Landmark className="size-6 text-amber-500" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Profil Institusi STAH DNJ
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Informasi identitas kampus, pimpinan, visi-misi, dan basis data instansi untuk laporan SPMI.
                        </p>
                    </div>

                    {isSaved && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                            <CheckCircle2 className="size-4" />
                            Perubahan berhasil disimpan!
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Card 1: Identitas & Pimpinan */}
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Building className="size-4 text-blue-500" />
                                Identitas Perguruan Tinggi & Pimpinan
                            </CardTitle>
                            <CardDescription>
                                Nama resmi kampus, singkatan institusi, dan penanggung jawab mutu
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="nama_kampus" className="text-xs font-semibold">
                                    Nama Perguruan Tinggi *
                                </Label>
                                <Input
                                    id="nama_kampus"
                                    value={formData.nama_kampus}
                                    onChange={(e) => setFormData({ ...formData, nama_kampus: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="singkatan" className="text-xs font-semibold">
                                    Singkatan Kampus *
                                </Label>
                                <Input
                                    id="singkatan"
                                    value={formData.singkatan}
                                    onChange={(e) => setFormData({ ...formData, singkatan: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="motto" className="text-xs font-semibold">
                                    Motto / Semboyan Institusi *
                                </Label>
                                <Input
                                    id="motto"
                                    value={formData.motto}
                                    onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="nama_ketua_stah" className="text-xs font-semibold">
                                    Nama Ketua STAH Dharma Nusantara Jakarta
                                </Label>
                                <Input
                                    id="nama_ketua_stah"
                                    placeholder="Beserta gelar lengkap"
                                    value={formData.nama_ketua_stah}
                                    onChange={(e) => setFormData({ ...formData, nama_ketua_stah: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="nama_ketua_lp3m" className="text-xs font-semibold">
                                    Nama Ketua LP3M
                                </Label>
                                <Input
                                    id="nama_ketua_lp3m"
                                    placeholder="Beserta gelar lengkap"
                                    value={formData.nama_ketua_lp3m}
                                    onChange={(e) => setFormData({ ...formData, nama_ketua_lp3m: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Visi, Misi & Tujuan */}
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Compass className="size-4 text-emerald-500" />
                                Visi, Misi, & Tujuan Mutu
                            </CardTitle>
                            <CardDescription>
                                Landasan filosofis penetapan Standar SPMI dan arah pengembangan tridharma
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="visi" className="text-xs font-semibold">
                                    Visi Institusi
                                </Label>
                                <textarea
                                    id="visi"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background p-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    value={formData.visi}
                                    onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="misi" className="text-xs font-semibold">
                                    Misi Institusi
                                </Label>
                                <textarea
                                    id="misi"
                                    rows={4}
                                    className="w-full rounded-md border border-input bg-background p-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    value={formData.misi}
                                    onChange={(e) => setFormData({ ...formData, misi: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="tujuan" className="text-xs font-semibold">
                                    Tujuan Mutu & Sasaran Strategis
                                </Label>
                                <textarea
                                    id="tujuan"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background p-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    value={formData.tujuan}
                                    onChange={(e) => setFormData({ ...formData, tujuan: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 3: Kontak & Alamat */}
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <MapPin className="size-4 text-rose-500" />
                                Alamat & Kontak Resmi Kampus
                            </CardTitle>
                            <CardDescription>
                                Informasi kontak untuk header dokumen audit dan instrumen survei
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="alamat" className="text-xs font-semibold">
                                    Alamat Lengkap Kampus
                                </Label>
                                <textarea
                                    id="alamat"
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background p-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    value={formData.alamat}
                                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="telepon" className="text-xs font-semibold">
                                    Telepon / WhatsApp
                                </Label>
                                <Input
                                    id="telepon"
                                    value={formData.telepon}
                                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-semibold">
                                    Email Resmi
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="website" className="text-xs font-semibold">
                                    Website Institusi
                                </Label>
                                <Input
                                    id="website"
                                    placeholder="https://stahdnj.ac.id"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6">
                            <Save className="size-4 mr-1.5" />
                            Simpan Perubahan Profil
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

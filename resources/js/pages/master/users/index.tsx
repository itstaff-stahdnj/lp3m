import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Users,
    UserPlus,
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle,
    Shield,
    GraduationCap,
    Building2,
    Phone,
    Mail,
    IdCard,
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
import type { User, Role, ProgramStudi, UnitKerja } from '@/types';

type Props = {
    users: User[];
    roles: Role[];
    prodis: ProgramStudi[];
    units: UnitKerja[];
};

export default function UserIndex({ users, roles, prodis, units }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role_id: roles[0]?.id ? String(roles[0].id) : '',
        program_studi_id: '',
        unit_kerja_id: '',
        nip_nim: '',
        phone: '',
        is_active: true,
    });

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role_id: roles[0]?.id ? String(roles[0].id) : '',
            program_studi_id: '',
            unit_kerja_id: '',
            nip_nim: '',
            phone: '',
            is_active: true,
        });
    };

    const openAddModal = () => {
        resetForm();
        setIsAddOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role_id: user.role_id ? String(user.role_id) : '',
            program_studi_id: user.program_studi_id ? String(user.program_studi_id) : '',
            unit_kerja_id: user.unit_kerja_id ? String(user.unit_kerja_id) : '',
            nip_nim: user.nip_nim || '',
            phone: user.phone || '',
            is_active: Boolean(user.is_active ?? true),
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/master/users', formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                resetForm();
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        router.put(`/master/users/${editingUser.id}`, formData, {
            onSuccess: () => {
                setEditingUser(null);
                resetForm();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingUser) return;
        router.delete(`/master/users/${deletingUser.id}`, {
            onSuccess: () => {
                setDeletingUser(null);
            },
        });
    };

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.nip_nim && u.nip_nim.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.role?.display_name && u.role.display_name.toLowerCase().includes(searchTerm.toLowerCase()));

        if (selectedRoleFilter === 'all') return matchesSearch;
        return matchesSearch && u.role?.name === selectedRoleFilter;
    });

    const getRoleBadgeVariant = (roleName?: string) => {
        switch (roleName) {
            case 'super_admin':
                return 'bg-purple-500 hover:bg-purple-600 text-white';
            case 'ketua_lp3m':
                return 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold';
            case 'auditor':
                return 'bg-blue-500 hover:bg-blue-600 text-white';
            case 'kaprodi':
                return 'bg-emerald-500 hover:bg-emerald-600 text-white';
            case 'dosen':
                return 'bg-indigo-500 hover:bg-indigo-600 text-white';
            case 'mahasiswa':
                return 'bg-teal-500 hover:bg-teal-600 text-white';
            default:
                return 'bg-slate-500 hover:bg-slate-600 text-white';
        }
    };

    return (
        <>
            <Head title="Manajemen Pengguna & Hak Akses - LP3M" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Users className="size-6 text-purple-600 dark:text-purple-400" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Manajemen Pengguna & Hak Akses
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola akun pengguna, peran sistem (Super Admin, Ketua LP3M, Auditor, Kaprodi, Dosen, Mahasiswa), dan afiliasi unit kerja.
                        </p>
                    </div>

                    <Button onClick={openAddModal} className="bg-purple-600 hover:bg-purple-700 text-white">
                        <UserPlus className="size-4 mr-1.5" />
                        Tambah Pengguna
                    </Button>
                </div>

                {/* Filter and Table Card */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    size="sm"
                                    variant={selectedRoleFilter === 'all' ? 'default' : 'outline'}
                                    className={`h-8 text-xs ${
                                        selectedRoleFilter === 'all' ? 'bg-slate-900 text-white' : ''
                                    }`}
                                    onClick={() => setSelectedRoleFilter('all')}
                                >
                                    Semua ({users.length})
                                </Button>
                                {roles.map((r) => {
                                    const count = users.filter((u) => u.role_id === r.id).length;
                                    return (
                                        <Button
                                            key={r.id}
                                            size="sm"
                                            variant={selectedRoleFilter === r.name ? 'default' : 'outline'}
                                            className="h-8 text-xs"
                                            onClick={() => setSelectedRoleFilter(r.name)}
                                        >
                                            {r.display_name} ({count})
                                        </Button>
                                    );
                                })}
                            </div>

                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama, email, NIP, role..."
                                    className="pl-9 h-9 text-xs"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-muted-foreground uppercase">
                                        <th className="pb-3 font-semibold">Pengguna</th>
                                        <th className="pb-3 font-semibold">Peran (Role)</th>
                                        <th className="pb-3 font-semibold">Afiliasi Prodi / Unit</th>
                                        <th className="pb-3 font-semibold">NIP / NIM</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                        <th className="pb-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                            <td className="py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                                                        {user.name.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Mail className="size-3" />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <Badge className={`text-xs font-semibold ${getRoleBadgeVariant(user.role?.name)}`}>
                                                    {user.role?.display_name || 'Tanpa Peran'}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-xs">
                                                {user.program_studi ? (
                                                    <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                                                        <GraduationCap className="size-3.5 text-blue-500" />
                                                        <span>Prodi: {user.program_studi.nama}</span>
                                                    </div>
                                                ) : user.unit_kerja ? (
                                                    <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                                                        <Building2 className="size-3.5 text-indigo-500" />
                                                        <span>Unit: {user.unit_kerja.nama}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </td>
                                            <td className="py-3 font-mono text-xs text-slate-700 dark:text-slate-300">
                                                {user.nip_nim || '-'}
                                            </td>
                                            <td className="py-3">
                                                {user.is_active ?? true ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                                        <CheckCircle2 className="size-3.5" />
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                        <XCircle className="size-3.5" />
                                                        Ditangguhkan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => openEditModal(user)}
                                                    >
                                                        <Edit2 className="size-3.5 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        onClick={() => setDeletingUser(user)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">
                                                Tidak ada data pengguna yang cocok.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Pengguna */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                            <DialogDescription>
                                Buat akun pengguna dan tentukan hak akses peran serta afiliasi unit kerjanya.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="space-y-1">
                                <Label htmlFor="name" className="text-xs">Nama Lengkap *</Label>
                                <Input
                                    id="name"
                                    placeholder="Nama pengguna beserta gelar"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="email" className="text-xs">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nama@stahdnj.ac.id"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="password" className="text-xs">Password *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Minimal 8 karakter"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="role_id" className="text-xs">Peran / Role Pengguna *</Label>
                                <select
                                    id="role_id"
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                    value={formData.role_id}
                                    onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                                    required
                                >
                                    <option value="">-- Pilih Peran --</option>
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.display_name} ({r.name})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="program_studi_id" className="text-xs">Afiliasi Program Studi</Label>
                                    <select
                                        id="program_studi_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.program_studi_id}
                                        onChange={(e) => setFormData({ ...formData, program_studi_id: e.target.value })}
                                    >
                                        <option value="">-- Bukan Prodi Tertentu --</option>
                                        {prodis.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.jenjang} - {p.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="unit_kerja_id" className="text-xs">Afiliasi Unit Kerja</Label>
                                    <select
                                        id="unit_kerja_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.unit_kerja_id}
                                        onChange={(e) => setFormData({ ...formData, unit_kerja_id: e.target.value })}
                                    >
                                        <option value="">-- Bukan Unit Tertentu --</option>
                                        {units.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.kode} - {u.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="nip_nim" className="text-xs">NIP / NIM / NIDN</Label>
                                    <Input
                                        id="nip_nim"
                                        placeholder="Nomor identitas pegawai/mhs"
                                        value={formData.nip_nim}
                                        onChange={(e) => setFormData({ ...formData, nip_nim: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="phone" className="text-xs">Nomor WhatsApp / HP</Label>
                                    <Input
                                        id="phone"
                                        placeholder="08xxxxxxxxxx"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                                Simpan Pengguna
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Pengguna */}
            <Dialog open={Boolean(editingUser)} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Pengguna</DialogTitle>
                            <DialogDescription>
                                Perbarui data profil, peran, dan afiliasi unit {editingUser?.name}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <div className="space-y-1">
                                <Label htmlFor="edit_name" className="text-xs">Nama Lengkap *</Label>
                                <Input
                                    id="edit_name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_email" className="text-xs">Email *</Label>
                                    <Input
                                        id="edit_email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_password" className="text-xs">
                                        Password Baru (Opsional)
                                    </Label>
                                    <Input
                                        id="edit_password"
                                        type="password"
                                        placeholder="Kosongkan jika tak diubah"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit_role_id" className="text-xs">Peran / Role Pengguna *</Label>
                                <select
                                    id="edit_role_id"
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                    value={formData.role_id}
                                    onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                                    required
                                >
                                    <option value="">-- Pilih Peran --</option>
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.display_name} ({r.name})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_program_studi_id" className="text-xs">Afiliasi Program Studi</Label>
                                    <select
                                        id="edit_program_studi_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.program_studi_id}
                                        onChange={(e) => setFormData({ ...formData, program_studi_id: e.target.value })}
                                    >
                                        <option value="">-- Bukan Prodi Tertentu --</option>
                                        {prodis.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.jenjang} - {p.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_unit_kerja_id" className="text-xs">Afiliasi Unit Kerja</Label>
                                    <select
                                        id="edit_unit_kerja_id"
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        value={formData.unit_kerja_id}
                                        onChange={(e) => setFormData({ ...formData, unit_kerja_id: e.target.value })}
                                    >
                                        <option value="">-- Bukan Unit Tertentu --</option>
                                        {units.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.kode} - {u.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="edit_nip_nim" className="text-xs">NIP / NIM / NIDN</Label>
                                    <Input
                                        id="edit_nip_nim"
                                        value={formData.nip_nim}
                                        onChange={(e) => setFormData({ ...formData, nip_nim: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="edit_phone" className="text-xs">Nomor WhatsApp / HP</Label>
                                    <Input
                                        id="edit_phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                                Perbarui Pengguna
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={Boolean(deletingUser)} onOpenChange={(open) => !open && setDeletingUser(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Pengguna</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus akun pengguna{' '}
                            <strong>{deletingUser?.name}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingUser(null)}>
                            Batal
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDelete}>
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

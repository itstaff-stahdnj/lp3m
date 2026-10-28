export type Role = {
    id: number;
    name: string;
    display_name: string;
    description?: string | null;
};

export type ProgramStudi = {
    id: number;
    kode: string;
    nama: string;
    jenjang: string;
    fakultas?: string | null;
    kaprodi_nama?: string | null;
    akreditasi?: string | null;
    sk_akreditasi?: string | null;
    is_active: boolean;
};

export type UnitKerja = {
    id: number;
    kode: string;
    nama: string;
    tipe: string;
    kepala_nama?: string | null;
    email?: string | null;
    is_active: boolean;
};

export type TahunAkademik = {
    id: number;
    kode: string;
    tahun: string;
    semester: string;
    tanggal_mulai?: string | null;
    tanggal_selesai?: string | null;
    is_active: boolean;
};

export type ProfilInstitusi = {
    id: number;
    nama_kampus: string;
    singkatan: string;
    motto: string;
    visi?: string | null;
    misi?: string | null;
    tujuan?: string | null;
    alamat?: string | null;
    telepon?: string | null;
    email?: string | null;
    website?: string | null;
    nama_ketua_stah?: string | null;
    nama_ketua_lp3m?: string | null;
    logo_url?: string | null;
};

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    nip_nim?: string | null;
    phone?: string | null;
    role_id?: number | null;
    program_studi_id?: number | null;
    unit_kerja_id?: number | null;
    role?: Role | null;
    program_studi?: ProgramStudi | null;
    unit_kerja?: UnitKerja | null;
    is_active?: boolean;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User | null;
};

export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};

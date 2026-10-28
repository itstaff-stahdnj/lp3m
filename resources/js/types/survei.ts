import type { ProgramStudi, TahunAkademik, User } from './auth';

export type Kuesioner = {
    id: number;
    kode: string;
    judul: string;
    tipe: 'EDOM' | 'KepuasanMahasiswa' | 'KepuasanDosen' | 'KepuasanTendik' | 'KepuasanMitra';
    deskripsi?: string | null;
    tahun_akademik_id: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
    target_role: string;
    is_active: boolean;
    created_by?: number | null;
    tahun_akademik?: TahunAkademik | null;
    creator?: User | null;
    pertanyaans?: PertanyaanKuesioner[];
    pertanyaans_count?: number;
    respons?: ResponSurvei[];
    respons_count?: number;
    created_at?: string;
    updated_at?: string;
};

export type PertanyaanKuesioner = {
    id: number;
    kuesioner_id: number;
    nomor_urut: number;
    aspek: string;
    teks_pertanyaan: string;
    tipe_jawaban: 'skala_4' | 'skala_5' | 'teks' | 'pilihan';
    pilihan_jawaban_json?: Record<string, string> | null;
    is_required: boolean;
    created_at?: string;
    updated_at?: string;
};

export type ResponSurvei = {
    id: number;
    kuesioner_id: number;
    user_id?: number | null;
    dosen_id?: number | null;
    mata_kuliah?: string | null;
    program_studi_id?: number | null;
    skor_rata_rata: number;
    jawaban_json: Record<string, any>;
    saran_masukan?: string | null;
    user?: User | null;
    dosen?: User | null;
    program_studi?: ProgramStudi | null;
    created_at?: string;
};

export type TracerStudy = {
    id: number;
    program_studi_id: number;
    tahun_lulus: number;
    nama_alumni: string;
    nim: string;
    email?: string | null;
    nomor_hp?: string | null;
    status_alumni: 'Bekerja Penuh' | 'Bekerja Paruh Waktu' | 'Wiraswasta' | 'Melanjutkan Studi' | 'Mencari Kerja';
    nama_instansi?: string | null;
    posisi_jabatan?: string | null;
    masa_tunggu_bulan: number;
    pendapatan_bulanan: '< 3 Juta' | '3 - 5 Juta' | '5 - 10 Juta' | '> 10 Juta';
    kesesuaian_bidang: 'Sangat Sesuai' | 'Sesuai' | 'Kurang Sesuai' | 'Tidak Sesuai';
    rekomendasi_alumni?: string | null;
    program_studi?: ProgramStudi | null;
    created_at?: string;
    updated_at?: string;
};

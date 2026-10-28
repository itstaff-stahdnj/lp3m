import type { ProgramStudi, TahunAkademik, User } from './auth';

export type Iku = {
    id: number;
    nomor: number;
    kode: string;
    nama: string;
    deskripsi?: string | null;
    definisi_operasional?: string | null;
    satuan: string;
    target_default: number;
    created_at?: string;
    updated_at?: string;
};

export type MonevIku = {
    id: number;
    iku_id: number;
    tahun_akademik_id: number;
    program_studi_id?: number | null;
    target: number;
    realisasi: number;
    persentase_capaian: number;
    status: 'Tercapai' | 'Sebagian Tercapai' | 'Belum Tercapai';
    kendala?: string | null;
    strategi_tindak_lanjut?: string | null;
    bukti_dokumen_url?: string | null;
    iku?: Iku | null;
    tahun_akademik?: TahunAkademik | null;
    program_studi?: ProgramStudi | null;
    created_at?: string;
    updated_at?: string;
};

export type Pelatihan = {
    id: number;
    kode: string;
    judul: string;
    kategori: 'Pedagogik & Kurikulum' | 'Penelitian & Publikasi' | 'Pengabdian Masyarakat' | 'Penjaminan Mutu SPMI' | 'Pengembangan Tendik';
    narasumber?: string | null;
    penyelenggara: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    lokasi?: string | null;
    kuota: number;
    jam_pelajaran: number;
    status: 'Akan Datang' | 'Sedang Berjalan' | 'Selesai';
    deskripsi?: string | null;
    silabus_materi?: string | null;
    pesertas?: PesertaPelatihan[];
    pesertas_count?: number;
    created_at?: string;
    updated_at?: string;
};

export type PesertaPelatihan = {
    id: number;
    pelatihan_id: number;
    user_id: number;
    status_kehadiran: 'Terdaftar' | 'Hadir' | 'Lulus' | 'Tidak Lulus';
    nomor_sertifikat?: string | null;
    tanggal_terbit_sertifikat?: string | null;
    catatan_evaluasi?: string | null;
    pelatihan?: Pelatihan | null;
    user?: User | null;
    created_at?: string;
    updated_at?: string;
};

import type { ProgramStudi, TahunAkademik, UnitKerja } from './auth';

export type StandarMutu = {
    id: number;
    kode: string;
    nama: string;
    kategori: 'Pendidikan' | 'Penelitian' | 'Pengabdian' | 'Tambahan';
    deskripsi?: string | null;
    kriteria_akreditasi?: string | null;
    penanggung_jawab_unit_id?: number | null;
    dokumen_kebijakan_url?: string | null;
    urutan: number;
    is_active: boolean;
    penanggung_jawab_unit?: UnitKerja | null;
    indikators?: IndikatorMutu[];
    dokumens?: DokumenMutu[];
    indikators_count?: number;
    dokumens_count?: number;
    created_at?: string;
    updated_at?: string;
};

export type IndikatorMutu = {
    id: number;
    standar_mutu_id: number;
    kode: string;
    pernyataan: string;
    target: string;
    satuan: string;
    baseline?: string | null;
    tipe_indikator: 'Standar' | 'IKU' | 'IKT';
    metode_pengukuran?: string | null;
    bobot: number;
    is_active: boolean;
    standar_mutu?: StandarMutu | null;
    capaians?: CapaianIndikator[];
    created_at?: string;
    updated_at?: string;
};

export type CapaianIndikator = {
    id: number;
    indikator_mutu_id: number;
    tahun_akademik_id: number;
    program_studi_id?: number | null;
    unit_kerja_id?: number | null;
    realisasi: string;
    status_capaian: 'Terlampaui' | 'Tercapai' | 'Belum Tercapai';
    analisis_capaian?: string | null;
    akar_masalah?: string | null;
    rencana_tindak_lanjut?: string | null;
    bukti_dokumen_url?: string | null;
    indikator_mutu?: IndikatorMutu | null;
    tahun_akademik?: TahunAkademik | null;
    program_studi?: ProgramStudi | null;
    unit_kerja?: UnitKerja | null;
    created_at?: string;
    updated_at?: string;
};

export type DokumenMutu = {
    id: number;
    kode_dokumen: string;
    nama: string;
    kategori: 'Kebijakan' | 'Manual' | 'Standar' | 'SOP' | 'Formulir' | 'Laporan' | 'Lainnya';
    standar_mutu_id?: number | null;
    unit_kerja_id?: number | null;
    nomor_sk?: string | null;
    tanggal_berlaku?: string | null;
    versi: string;
    file_path?: string | null;
    keterangan?: string | null;
    is_public: boolean;
    is_active: boolean;
    standar_mutu?: StandarMutu | null;
    unit_kerja?: UnitKerja | null;
    created_at?: string;
    updated_at?: string;
};

import type { ProgramStudi, TahunAkademik, UnitKerja, User } from './auth';
import type { IndikatorMutu, StandarMutu } from './spmi';

export type PeriodeAudit = {
    id: number;
    kode: string;
    nama: string;
    tahun_akademik_id: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status: 'Draft' | 'Berjalan' | 'Selesai' | 'RTM';
    keterangan?: string | null;
    tahun_akademik?: TahunAkademik | null;
    jadwals?: JadwalAudit[];
    jadwals_count?: number;
    temuans_count?: number;
    created_at?: string;
    updated_at?: string;
};

export type JadwalAudit = {
    id: number;
    periode_audit_id: number;
    auditee_tipe: 'ProgramStudi' | 'UnitKerja';
    program_studi_id?: number | null;
    unit_kerja_id?: number | null;
    lead_auditor_id: number;
    auditor_anggota_id?: number | null;
    tanggal_audit: string;
    lokasi?: string | null;
    status: 'Terjadwal' | 'Sedang Berjalan' | 'Selesai Audit' | 'Tindakan Koreksi' | 'Closed';
    catatan_auditor?: string | null;
    periode_audit?: PeriodeAudit | null;
    program_studi?: ProgramStudi | null;
    unit_kerja?: UnitKerja | null;
    lead_auditor?: User | null;
    auditor_anggota?: User | null;
    temuans?: TemuanAudit[];
    auditee_name?: string;
    created_at?: string;
    updated_at?: string;
};

export type TemuanAudit = {
    id: number;
    jadwal_audit_id: number;
    standar_mutu_id: number;
    indikator_mutu_id?: number | null;
    kode_temuan: string;
    klasifikasi: 'KTS Mayor' | 'KTS Minor' | 'Observasi';
    deskripsi_temuan: string;
    kriteria_standar?: string | null;
    akar_penyebab?: string | null;
    akibat_dampak?: string | null;
    rekomendasi_auditor: string;
    target_selesai_ptk?: string | null;
    status_temuan: 'Open' | 'Proses PTK' | 'Menunggu Verifikasi' | 'Closed';
    tindakan_koreksi?: string | null;
    pencegahan?: string | null;
    tanggal_tindakan_koreksi?: string | null;
    bukti_ptk_url?: string | null;
    catatan_verifikasi_auditor?: string | null;
    tanggal_closing?: string | null;
    jadwal_audit?: JadwalAudit | null;
    standar_mutu?: StandarMutu | null;
    indikator_mutu?: IndikatorMutu | null;
    created_at?: string;
    updated_at?: string;
};

export type KriteriaAkreditasi = {
    id: number;
    nomor: number;
    kode: string;
    nama: string;
    deskripsi?: string | null;
    bobot_default: number;
    created_at?: string;
    updated_at?: string;
};

export type SimulasiAkreditasi = {
    id: number;
    program_studi_id: number;
    tahun_akademik_id: number;
    instrumen: string;
    total_skor: number;
    predikat_proyeksi: 'Unggul' | 'Baik Sekali' | 'Baik' | 'Tidak Terakreditasi';
    rincian_skor_json?: Record<string, number> | null;
    catatan_evaluator?: string | null;
    program_studi?: ProgramStudi | null;
    tahun_akademik?: TahunAkademik | null;
    created_at?: string;
    updated_at?: string;
};

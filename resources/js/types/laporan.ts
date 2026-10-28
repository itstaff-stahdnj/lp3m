import { ProgramStudi, TahunAkademik, UnitKerja, User } from '@/types';

export interface LaporanTahunan {
    id: number;
    tahun_akademik_id: number;
    nomor_laporan: string;
    judul: string;
    periode_tahun: string;
    ringkasan_eksekutif: string;
    skor_spmi: number;
    total_standar_tercapai: number;
    total_standar: number;
    skor_ami_closing_rate: number;
    skor_kepuasan_pengguna: number;
    skor_capaian_iku: number;
    rekomendasi_utama?: string;
    data_snapshot?: Record<string, any>;
    status: 'Draft' | 'Review LP3M' | 'Disetujui Pimpinan' | 'Dipublikasikan';
    disetujui_oleh: string;
    tanggal_pengesahan?: string;
    created_at?: string;
    updated_at?: string;
    tahun_akademik?: TahunAkademik;
}

export interface TindakLanjutRtm {
    id: number;
    rtm_id: number;
    program_studi_id?: number | null;
    unit_kerja_id?: number | null;
    butir_rekomendasi: string;
    rencana_tindakan: string;
    target_waktu: string;
    penanggung_jawab: string;
    status: 'Belum Dimulai' | 'Dalam Proses' | 'Selesai' | 'Diverifikasi';
    bukti_tindak_lanjut?: string | null;
    catatan_verifikasi?: string | null;
    program_studi?: ProgramStudi;
    unit_kerja?: UnitKerja;
}

export interface Rtm {
    id: number;
    tahun_akademik_id: number;
    nomor_dokumen: string;
    judul: string;
    tanggal_rapat: string;
    tempat: string;
    pimpinan_rapat: string;
    peserta_hadir?: string | null;
    agenda?: string | null;
    ringkasan_pembahasan?: string | null;
    kesimpulan?: string | null;
    status: 'Draft' | 'Terlaksana' | 'Dalam Tindak Lanjut' | 'Selesai';
    created_at?: string;
    updated_at?: string;
    tahun_akademik?: TahunAkademik;
    tindak_lanjuts?: TindakLanjutRtm[];
}

export interface SuratMutu {
    id: number;
    tahun_akademik_id: number;
    nomor_surat: string;
    jenis_surat:
        | 'Surat Keterangan Akreditasi'
        | 'Surat Bebas Temuan AMI'
        | 'Surat Rekomendasi Mutu'
        | 'E-Sertifikat Pelatihan'
        | 'Surat Pengantar Audit';
    perihal: string;
    tujuan_penerima: string;
    program_studi_id?: number | null;
    unit_kerja_id?: number | null;
    user_id?: number | null;
    tanggal_surat: string;
    penandatangan_nama: string;
    penandatangan_jabatan: string;
    isi_ringkas: string;
    qr_token: string;
    status: 'Draft' | 'Diterbitkan' | 'Diarsipkan' | 'Dibatalkan';
    created_at?: string;
    updated_at?: string;
    tahun_akademik?: TahunAkademik;
    program_studi?: ProgramStudi;
    unit_kerja?: UnitKerja;
    user?: User;
}

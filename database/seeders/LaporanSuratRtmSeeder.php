<?php

namespace Database\Seeders;

use App\Models\LaporanTahunan;
use App\Models\ProgramStudi;
use App\Models\Rtm;
use App\Models\SuratMutu;
use App\Models\TahunAkademik;
use App\Models\TindakLanjutRtm;
use App\Models\UnitKerja;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LaporanSuratRtmSeeder extends Seeder
{
    public function run(): void
    {
        $activeYear = TahunAkademik::where('is_active', true)->first() ?? TahunAkademik::first();
        if (! $activeYear) {
            return;
        }

        $prodis = ProgramStudi::all()->keyBy('kode');
        $units = UnitKerja::all()->keyBy('kode');
        $auditorUser = User::where('email', 'auditor@stahdnj.ac.id')->first() ?? User::first();

        // 1. Seed RTM
        $rtm = Rtm::updateOrCreate(
            ['nomor_dokumen' => 'RTM/STAH-DNJ/2025-2026/01'],
            [
                'tahun_akademik_id' => $activeYear->id,
                'judul' => 'Rapat Tinjauan Manajemen (RTM) Siklus SPMI & Temuan AMI Tahun 2025/2026',
                'tanggal_rapat' => '2026-02-15',
                'tempat' => 'Ruang Sidang Utama Pimpinan Gedung Rektorat Lt. 2 / Hybrid Zoom',
                'pimpinan_rapat' => 'Prof. Dr. I Made Kartika, S.Ag., M.Fil.H.',
                'peserta_hadir' => "1. Prof. Dr. I Made Kartika, S.Ag., M.Fil.H. (Ketua STAH DNJ)\n2. Dr. I Nyoman Yoga, M.Pd.H. (Ketua LP3M)\n3. I Ketut Budiawan, M.Fil.H. (Auditor Mutu Internal)\n4. Ni Wayan Sudarmini, M.Pd.H. (Kaprodi S1 PAH)\n5. Dr. I Nyoman Alit Putrawan, S.Ag., M.Fil.H. (Kaprodi S2 PAH)\n6. I Made Awanita, S.Ag., M.Pd.H. (Kaprodi S1 IKH)\n7. Kepala BAK, BUK, P3M, dan UPT Perpustakaan",
                'agenda' => "1. Pembahasan Laporan Hasil Audit Mutu Internal (AMI) Siklus 2025/2026\n2. Evaluasi Ketercapaian 24 Standar Mutu SN-Dikti\n3. Analisis Hasil Survei Kepuasan Stakeholder & EDOM Dosen\n4. Penetapan Rencana Peningkatan & Tindak Lanjut Mutu Institusi",
                'ringkasan_pembahasan' => 'Sidang RTM dibuka oleh Ketua STAH DNJ. Ketua LP3M memaparkan ringkasan hasil AMI dengan temuan 0 KTS Mayor, 3 KTS Minor, dan 2 Observasi. Seluruh Kaprodi berkomitmen menindaklanjuti rekomendasi audit terutama pemutakhiran RPS berbasis OBE dan peningkatan publikasi jurnal terakreditasi SINTA.',
                'kesimpulan' => 'Pimpinan mengesahkan seluruh Rencana Tindakan Koreksi (PTK) dan menginstruksikan seluruh unit dan prodi menyelesaikan tindak lanjut sebelum visitasi akreditasi siklus berikutnya. Alokasi anggaran penelitian dan hibah kompetitif ditingkatkan 15%.',
                'status' => 'Terlaksana',
            ]
        );

        // 1.1 Tindak Lanjut RTM
        $tindakLanjuts = [
            [
                'rtm_id' => $rtm->id,
                'program_studi_id' => $prodis['S1-PAH']->id ?? null,
                'unit_kerja_id' => null,
                'butir_rekomendasi' => 'Peningkatan persentase RPS mata kuliah berbasis Outcome-Based Education (OBE) mencapai 100%.',
                'rencana_tindakan' => 'Workshop review kurikulum dan pendampingan penyusunan RPS berbasis CPL/CPMK bagi seluruh dosen S1 PAH.',
                'target_waktu' => '2026-04-30',
                'penanggung_jawab' => 'Ni Wayan Sudarmini, M.Pd.H. (Kaprodi S1 PAH)',
                'status' => 'Dalam Proses',
                'bukti_tindak_lanjut' => 'Draft dokumen RPS revisi 18 mata kuliah telah terkumpul.',
                'catatan_verifikasi' => 'Sedang dalam review oleh tim kurikulum LP3M.',
            ],
            [
                'rtm_id' => $rtm->id,
                'program_studi_id' => $prodis['S1-IKH']->id ?? null,
                'unit_kerja_id' => null,
                'butir_rekomendasi' => 'Optimalisasi laboratorium komunikasi multimedia dan pengadaan software penyiaran digital.',
                'rencana_tindakan' => 'Pengajuan proposal sarana laboratorium penyiaran dan praktikum audio visual ke BUK.',
                'target_waktu' => '2026-05-15',
                'penanggung_jawab' => 'I Made Awanita, S.Ag., M.Pd.H. (Kaprodi S1 IKH)',
                'status' => 'Dalam Proses',
                'bukti_tindak_lanjut' => 'Surat usulan spesifikasi teknis peralatan penyiaran telah didisposisi ke BUK.',
                'catatan_verifikasi' => 'Proses pengadaan sedang berjalan di triwulan 2.',
            ],
            [
                'rtm_id' => $rtm->id,
                'program_studi_id' => null,
                'unit_kerja_id' => $units['P3M']->id ?? null,
                'butir_rekomendasi' => 'Peningkatan jumlah artikel dosen pada jurnal internasional bereputasi dan SINTA 2.',
                'rencana_tindakan' => 'Pemberian insentif penulisan artikel ilmiah dan klinik manuskrip berkala.',
                'target_waktu' => '2026-06-30',
                'penanggung_jawab' => 'Dr. I Wayan Budi, M.Si. (Kepala P3M)',
                'status' => 'Dalam Proses',
                'bukti_tindak_lanjut' => 'SK insentif publikasi diterbitkan dan 6 manuskrip dosen masuk tahap review.',
                'catatan_verifikasi' => 'Target tercapai 40% dari kuota tahunan.',
            ],
            [
                'rtm_id' => $rtm->id,
                'program_studi_id' => null,
                'unit_kerja_id' => $units['LP3M']->id ?? null,
                'butir_rekomendasi' => 'Penyusunan dashboard eksekutif pemantauan kepuasan layanan dan tracer study real-time.',
                'rencana_tindakan' => 'Pengembangan modul pelaporan terpadu dan integrasi data tracer alumni.',
                'target_waktu' => '2026-03-31',
                'penanggung_jawab' => 'Dr. I Nyoman Yoga, M.Pd.H. (Ketua LP3M)',
                'status' => 'Selesai',
                'bukti_tindak_lanjut' => 'Aplikasi LP3M Fase 1 - 5 telah live dan digunakan oleh civitas akademika.',
                'catatan_verifikasi' => 'Telah diverifikasi dan disetujui pada sidang pimpinan.',
            ],
        ];

        foreach ($tindakLanjuts as $tl) {
            TindakLanjutRtm::create($tl);
        }

        // 2. Seed Laporan Tahunan
        LaporanTahunan::updateOrCreate(
            ['nomor_laporan' => 'LAP-MUTU/LP3M/2025-2026/01'],
            [
                'tahun_akademik_id' => $activeYear->id,
                'judul' => 'Laporan Kinerja Mutu Tahunan LP3M STAH Dharma Nusantara Jakarta Tahun Akademik 2025/2026',
                'periode_tahun' => '2025/2026',
                'ringkasan_eksekutif' => 'Laporan Kinerja Mutu Tahunan ini menyajikan rekapitulasi menyeluruh siklus PPEPP penjaminan mutu di lingkungan STAH Dharma Nusantara Jakarta. Sepanjang tahun akademik 2025/2026, ketercapaian standar SPMI mencapai 88.50%, tingkat penyelesaian tindakan koreksi audit (PTK closing rate) mencapai 85.00%, dan indeks kepuasan civitas akademika berada pada skor 87.25% (kategori Sangat Baik). Kesiapan akreditasi prodi menunjukkan tren positif dengan seluruh prodi mempertahankan peringkat Baik Sekali menuju Unggul.',
                'skor_spmi' => 88.50,
                'total_standar_tercapai' => 21,
                'total_standar' => 24,
                'skor_ami_closing_rate' => 85.00,
                'skor_kepuasan_pengguna' => 87.25,
                'skor_capaian_iku' => 82.50,
                'rekomendasi_utama' => "1. Mendorong akselerasi akreditasi prodi menuju Unggul dengan penguatan riset kolaboratif internasional.\n2. Peningkatan serapan lulusan (IKU 1) melalui penguatan jaringan kemitraan industri keagamaan dan pendidikan Hindu.\n3. Digitalisasi penuh repositori dokumen penjaminan mutu dan sertifikasi auditor berkala.",
                'data_snapshot' => [
                    'spmi_summary' => [
                        'pendidikan' => 8,
                        'penelitian' => 8,
                        'pengabdian' => 8,
                        'tercapai' => 21,
                        'melampaui' => 6,
                    ],
                    'ami_summary' => [
                        'audited_prodi' => 3,
                        'total_temuan' => 5,
                        'kts_mayor' => 0,
                        'kts_minor' => 3,
                        'observasi' => 2,
                        'closing_rate' => 85.0,
                    ],
                    'iku_highlights' => [
                        ['indikator' => 'IKU 1: Lulusan Bekerja Layak', 'capaian' => '84%'],
                        ['indikator' => 'IKU 2: Mahasiswa Kampus Merdeka', 'capaian' => '35%'],
                        ['indikator' => 'IKU 3: Dosen Berkegiatan Tridharma', 'capaian' => '58%'],
                        ['indikator' => 'IKU 6: Kemitraan Program Studi', 'capaian' => '65%'],
                        ['indikator' => 'IKU 8: Prodi Terakreditasi Unggul', 'capaian' => '67%'],
                    ],
                ],
                'status' => 'Disetujui Pimpinan',
                'disetujui_oleh' => 'Prof. Dr. I Made Kartika, S.Ag., M.Fil.H.',
                'tanggal_pengesahan' => '2026-02-28',
            ]
        );

        // 3. Seed Surat Mutu
        $suratMutus = [
            [
                'tahun_akademik_id' => $activeYear->id,
                'nomor_surat' => '024/LP3M/STAH-DNJ/II/2026',
                'jenis_surat' => 'Surat Keterangan Akreditasi',
                'perihal' => 'Surat Keterangan Status Akreditasi Program Studi S-1 Pendidikan Agama Hindu',
                'tujuan_penerima' => 'Ni Wayan Sudarmini, M.Pd.H. (Kaprodi S1 Pendidikan Agama Hindu)',
                'program_studi_id' => $prodis['S1-PAH']->id ?? null,
                'unit_kerja_id' => null,
                'user_id' => null,
                'tanggal_surat' => '2026-02-10',
                'penandatangan_nama' => 'Dr. I Nyoman Yoga, M.Pd.H.',
                'penandatangan_jabatan' => 'Ketua LP3M STAH Dharma Nusantara Jakarta',
                'isi_ringkas' => 'Menerangkan bahwa Program Studi S-1 Pendidikan Agama Hindu STAH Dharma Nusantara Jakarta saat ini terakreditasi "Baik Sekali" berdasarkan Keputusan BAN-PT No. 1294/SK/BAN-PT/Ak/S/IV/2023 dan telah memenuhi pemantauan mutu berkala SPMI tahun 2025/2026.',
                'qr_token' => 'SK-AKRED-S1PAH-'.Str::random(24),
                'status' => 'Diterbitkan',
            ],
            [
                'tahun_akademik_id' => $activeYear->id,
                'nomor_surat' => '031/LP3M/STAH-DNJ/II/2026',
                'jenis_surat' => 'Surat Bebas Temuan AMI',
                'perihal' => 'Surat Keterangan Penyelesaian Tindakan Koreksi (Bebas Temuan AMI 2025/2026)',
                'tujuan_penerima' => 'Dr. I Nyoman Alit Putrawan, S.Ag., M.Fil.H. (Kaprodi S2 Pendidikan Agama Hindu)',
                'program_studi_id' => $prodis['S2-PAH']->id ?? null,
                'unit_kerja_id' => null,
                'user_id' => null,
                'tanggal_surat' => '2026-02-20',
                'penandatangan_nama' => 'Dr. I Nyoman Yoga, M.Pd.H.',
                'penandatangan_jabatan' => 'Ketua LP3M STAH Dharma Nusantara Jakarta',
                'isi_ringkas' => 'Menerangkan bahwa Program Pascasarjana (S2 Pendidikan Agama Hindu) telah menyelesaikan seluruh Rencana Tindakan Koreksi (PTK) atas temuan Audit Mutu Internal Siklus 2025/2026 dengan status Closing 100% terverifikasi auditor.',
                'qr_token' => 'SK-BEBAS-AMI-S2PAH-'.Str::random(22),
                'status' => 'Diterbitkan',
            ],
            [
                'tahun_akademik_id' => $activeYear->id,
                'nomor_surat' => '038/LP3M/STAH-DNJ/III/2026',
                'jenis_surat' => 'Surat Rekomendasi Mutu',
                'perihal' => 'Rekomendasi Pemenuhan Fasilitas Sarana Prasarana Laboratorium Komunikasi Hindu',
                'tujuan_penerima' => 'I Made Awanita, S.Ag., M.Pd.H. (Kaprodi S1 Ilmu Komunikasi Hindu)',
                'program_studi_id' => $prodis['S1-IKH']->id ?? null,
                'unit_kerja_id' => null,
                'user_id' => null,
                'tanggal_surat' => '2026-03-05',
                'penandatangan_nama' => 'Dr. I Nyoman Yoga, M.Pd.H.',
                'penandatangan_jabatan' => 'Ketua LP3M STAH Dharma Nusantara Jakarta',
                'isi_ringkas' => 'Rekomendasi tindak lanjut RTM kepada Pimpinan STAH DNJ perihal penguatan sarana studio multimedia dan penyiaran digital guna mendukung ketercapaian Standar Sarana Prasarana Pembelajaran SN-Dikti.',
                'qr_token' => 'REKOM-MUTU-S1IKH-'.Str::random(24),
                'status' => 'Diterbitkan',
            ],
            [
                'tahun_akademik_id' => $activeYear->id,
                'nomor_surat' => '045/SERT-LP3M/STAH-DNJ/III/2026',
                'jenis_surat' => 'E-Sertifikat Pelatihan',
                'perihal' => 'Sertifikat Kelulusan Pelatihan Calon Auditor Mutu Internal (AMI) Perguruan Tinggi',
                'tujuan_penerima' => 'I Ketut Budiawan, M.Fil.H.',
                'program_studi_id' => null,
                'unit_kerja_id' => $units['LP3M']->id ?? null,
                'user_id' => $auditorUser->id,
                'tanggal_surat' => '2026-03-12',
                'penandatangan_nama' => 'Dr. I Nyoman Yoga, M.Pd.H.',
                'penandatangan_jabatan' => 'Ketua LP3M STAH Dharma Nusantara Jakarta',
                'isi_ringkas' => 'Diberikan kepada I Ketut Budiawan, M.Fil.H. atas partisipasi aktif dan kelulusan dalam Pelatihan Auditor Mutu Internal Perguruan Tinggi Berbasis Kriteria Akreditasi LAM & BAN-PT dengan predikat Sangat Baik (32 Jam Pelajaran).',
                'qr_token' => 'SERT-AMI-AUDITOR-'.Str::random(24),
                'status' => 'Diterbitkan',
            ],
        ];

        foreach ($suratMutus as $sm) {
            SuratMutu::updateOrCreate(['nomor_surat' => $sm['nomor_surat']], $sm);
        }
    }
}

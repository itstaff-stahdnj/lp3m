<?php

namespace Database\Seeders;

use App\Models\JadwalAudit;
use App\Models\KriteriaAkreditasi;
use App\Models\PeriodeAudit;
use App\Models\ProgramStudi;
use App\Models\SimulasiAkreditasi;
use App\Models\StandarMutu;
use App\Models\TahunAkademik;
use App\Models\TemuanAudit;
use App\Models\User;
use Illuminate\Database\Seeder;

class AmiAkreditasiSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed 9 Kriteria Akreditasi BAN-PT
        $kriterias = [
            ['nomor' => 1, 'kode' => 'K1', 'nama' => 'Visi, Misi, Tujuan dan Strategi', 'bobot_default' => 5.0, 'deskripsi' => 'Kejelasan, kerealistikan, dan keterkaitan antara visi keilmuan prodi dengan visi perguruan tinggi.'],
            ['nomor' => 2, 'kode' => 'K2', 'nama' => 'Tata Pamong, Tata Kelola dan Kerjasama', 'bobot_default' => 10.0, 'deskripsi' => 'Efektivitas kepemimpinan, sistem penjaminan mutu internal, dan kemitraan strategis.'],
            ['nomor' => 3, 'kode' => 'K3', 'nama' => 'Mahasiswa', 'bobot_default' => 10.0, 'deskripsi' => 'Kualitas input mahasiswa, sistem seleksi, rasio pendaftar, dan layanan kemahasiswaan.'],
            ['nomor' => 4, 'kode' => 'K4', 'nama' => 'Sumber Daya Manusia', 'bobot_default' => 15.0, 'deskripsi' => 'Kualifikasi akademik dosen tetap, jabatan fungsional, rasio dosen-mahasiswa, dan tenaga kependidikan.'],
            ['nomor' => 5, 'kode' => 'K5', 'nama' => 'Keuangan, Sarana dan Prasarana', 'bobot_default' => 10.0, 'deskripsi' => 'Kecukupan dana operasional dan investasi tridharma serta fasilitas laboratorium dan perpustakaan.'],
            ['nomor' => 6, 'kode' => 'K6', 'nama' => 'Pendidikan', 'bobot_default' => 25.0, 'deskripsi' => 'Kurikulum berbasis OBE, RPS, integrasi hasil penelitian dalam pembelajaran, dan kepuasan mahasiswa.'],
            ['nomor' => 7, 'kode' => 'K7', 'nama' => 'Penelitian', 'bobot_default' => 10.0, 'deskripsi' => 'Produktivitas riset dosen dan mahasiswa sesuai peta jalan riset keagamaan Hindu.'],
            ['nomor' => 8, 'kode' => 'K8', 'nama' => 'Pengabdian kepada Masyarakat', 'bobot_default' => 5.0, 'deskripsi' => 'Kegiatan pengabdian yang berdampak langsung pada pasraman, pura, dan masyarakat Hindu.'],
            ['nomor' => 9, 'kode' => 'K9', 'nama' => 'Luaran dan Capaian Tridharma', 'bobot_default' => 20.0, 'deskripsi' => 'IPK lulusan, kelulusan tepat waktu, masa tunggu kerja tracer study, dan publikasi bereputasi.'],
        ];

        foreach ($kriterias as $k) {
            KriteriaAkreditasi::updateOrCreate(['nomor' => $k['nomor']], $k);
        }

        // 2. Seed Periode Audit
        $activeYear = TahunAkademik::active() ?? TahunAkademik::first();
        if (! $activeYear) {
            return;
        }

        $periode = PeriodeAudit::updateOrCreate(
            ['kode' => 'AMI-2025/2026'],
            [
                'nama' => 'Audit Mutu Internal (AMI) Siklus 2025/2026',
                'tahun_akademik_id' => $activeYear->id,
                'tanggal_mulai' => '2025-10-01',
                'tanggal_selesai' => '2025-11-30',
                'status' => 'Berjalan',
                'keterangan' => 'Siklus audit mutu internal rutin untuk mengukur kepatuhan 24 Standar SN-Dikti.',
            ]
        );

        // 3. User Auditor
        $auditorUser = User::whereHas('role', fn ($q) => $q->where('name', 'auditor'))->first()
            ?? User::where('email', 'auditor@stahdnj.ac.id')->first()
            ?? User::first();

        $kaprodiUser = User::whereHas('role', fn ($q) => $q->where('name', 'kaprodi'))->first()
            ?? User::first();

        // 4. Seed Jadwal Audit untuk 3 Prodi
        $prodis = ProgramStudi::all();
        $standarSKL = StandarMutu::where('kode', 'STD-DIK-01')->first() ?? StandarMutu::first();
        $standarDosen = StandarMutu::where('kode', 'STD-DIK-05')->first() ?? StandarMutu::first();
        $standarProses = StandarMutu::where('kode', 'STD-DIK-03')->first() ?? StandarMutu::first();

        foreach ($prodis as $idx => $prodi) {
            $jadwal = JadwalAudit::updateOrCreate(
                [
                    'periode_audit_id' => $periode->id,
                    'auditee_tipe' => 'ProgramStudi',
                    'program_studi_id' => $prodi->id,
                ],
                [
                    'lead_auditor_id' => $auditorUser->id,
                    'auditor_anggota_id' => $auditorUser->id,
                    'tanggal_audit' => now()->subDays(10 - ($idx * 3))->format('Y-m-d'),
                    'lokasi' => "Ruang Rapat Jurusan {$prodi->nama}",
                    'status' => $idx === 0 ? 'Tindakan Koreksi' : 'Selesai Audit',
                    'catatan_auditor' => "Audit kepatuhan standar pendidikan dan kurikulum OBE prodi {$prodi->nama}.",
                ]
            );

            // Tambahkan sampel temuan untuk Prodi pertama (S1-PAH)
            if ($idx === 0 && $standarSKL && $standarProses) {
                TemuanAudit::updateOrCreate(
                    ['kode_temuan' => 'TM-AMI-2025-001'],
                    [
                        'jadwal_audit_id' => $jadwal->id,
                        'standar_mutu_id' => $standarSKL->id,
                        'indikator_mutu_id' => null,
                        'klasifikasi' => 'KTS Minor',
                        'deskripsi_temuan' => 'Hasil tracer study masa tunggu kerja lulusan angkatan 2024 belum dipublikasikan pada website prodi.',
                        'kriteria_standar' => 'Standar Kompetensi Lulusan butir 4: Publikasi dan akuntabilitas tracer study.',
                        'akar_penyebab' => 'Staf admin prodi belum menerima olahan data final dari tim tracer study institusi.',
                        'akibat_dampak' => 'Transparansi data luaran lulusan belum dapat diakses oleh publik dan pengguna lulusan.',
                        'rekomendasi_auditor' => 'Segera koordinasi dengan LP3M dan unggah infografis tracer study pada laman prodi.',
                        'target_selesai_ptk' => now()->addDays(14)->format('Y-m-d'),
                        'status_temuan' => 'Proses PTK',
                        'tindakan_koreksi' => 'Mengunggah rekapitulasi waktu tunggu kerja dan serapan alumni ke web prodi.',
                        'pencegahan' => 'Menjadwalkan update berkala tracer study tiap semester ganjil.',
                        'tanggal_tindakan_koreksi' => now()->subDays(2)->format('Y-m-d'),
                    ]
                );

                TemuanAudit::updateOrCreate(
                    ['kode_temuan' => 'TM-AMI-2025-002'],
                    [
                        'jadwal_audit_id' => $jadwal->id,
                        'standar_mutu_id' => $standarProses->id,
                        'indikator_mutu_id' => null,
                        'klasifikasi' => 'Observasi',
                        'deskripsi_temuan' => 'Sebagian RPS mata kuliah belum mencantumkan rujukan studi kasus moderasi beragama terkini.',
                        'kriteria_standar' => 'Standar Proses Pembelajaran: Pembaruan referensi RPS minimal 5 tahun terakhir.',
                        'akar_penyebab' => 'Dosen pengampu belum melakukan revisi RPS berbasis riset terbaru.',
                        'rekomendasi_auditor' => 'Lakukan workshop penyelarasan RPS berbasis riset dosen sebelum semester baru.',
                        'target_selesai_ptk' => now()->addDays(30)->format('Y-m-d'),
                        'status_temuan' => 'Closed',
                        'tindakan_koreksi' => 'Telah dilakukan review RPS oleh Tim Kurikulum Jurusan Dharma Acarya.',
                        'tanggal_closing' => now()->format('Y-m-d'),
                        'catatan_verifikasi_auditor' => 'RPS revisi telah diverifikasi dan memenuhi standar SPMI.',
                    ]
                );
            }
        }

        // 5. Seed Sampel Simulasi Skor Akreditasi untuk S1-PAH
        $prodiS1 = ProgramStudi::where('kode', 'S1-PAH')->first();
        if ($prodiS1) {
            $rincianSkor = [
                'K1' => 3.65,
                'K2' => 3.50,
                'K3' => 3.40,
                'K4' => 3.55,
                'K5' => 3.35,
                'K6' => 3.70,
                'K7' => 3.45,
                'K8' => 3.50,
                'K9' => 3.60,
            ];

            SimulasiAkreditasi::updateOrCreate(
                [
                    'program_studi_id' => $prodiS1->id,
                    'tahun_akademik_id' => $activeYear->id,
                ],
                [
                    'instrumen' => '9 Kriteria BAN-PT',
                    'total_skor' => 356.50,
                    'predikat_proyeksi' => 'Baik Sekali',
                    'rincian_skor_json' => $rincianSkor,
                    'catatan_evaluator' => 'Skor mencapai 356.50 (proyeksi Baik Sekali menuju Unggul). Perlu peningkatan persentase dosen bergelar Doktor (S3) dan publikasi internasional bereputasi.',
                ]
            );
        }
    }
}

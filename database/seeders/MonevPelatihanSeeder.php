<?php

namespace Database\Seeders;

use App\Models\Iku;
use App\Models\MonevIku;
use App\Models\Pelatihan;
use App\Models\PesertaPelatihan;
use App\Models\ProgramStudi;
use App\Models\TahunAkademik;
use App\Models\User;
use Illuminate\Database\Seeder;

class MonevPelatihanSeeder extends Seeder
{
    public function run(): void
    {
        $ta = TahunAkademik::active() ?? TahunAkademik::first();
        $prodis = ProgramStudi::all()->keyBy('kode');
        $dosens = User::whereHas('role', fn ($q) => $q->where('name', 'dosen'))->get();

        // 1. Master 8 IKU Dikti
        $ikus = [
            [
                'nomor' => 1,
                'kode' => 'IKU 1',
                'nama' => 'Lulusan Mendapat Pekerjaan yang Layak',
                'deskripsi' => 'Persentase lulusan S1 yang berhasil mendapat pekerjaan dengan upah di atas UMR, melanjutkan studi, atau berwirausaha.',
                'definisi_operasional' => 'Jumlah lulusan bekerja/studi lanjut/wirausaha dibagi total lulusan yang dilacak melalui Tracer Study.',
                'satuan' => '%',
                'target_default' => 80.0,
            ],
            [
                'nomor' => 2,
                'kode' => 'IKU 2',
                'nama' => 'Mahasiswa Mendapat Pengalaman di Luar Kampus',
                'deskripsi' => 'Persentase mahasiswa S1 yang menghabiskan paling tidak 20 SKS di luar kampus atau meraih prestasi nasional/internasional.',
                'definisi_operasional' => 'Magang kerja, pertukaran pelajar, proyek desa keagamaan Hindu, riset independen, dan kompetisi.',
                'satuan' => '%',
                'target_default' => 25.0,
            ],
            [
                'nomor' => 3,
                'kode' => 'IKU 3',
                'nama' => 'Dosen Berkegiatan di Luar Kampus',
                'deskripsi' => 'Persentase dosen yang berkegiatan tridharma di kampus lain, industri, lembaga keagamaan, atau membina mahasiswa berprestasi.',
                'definisi_operasional' => 'Dosen tamu, konsultan ahli, pengurus lembaga PHDI, atau peneliti tamu di lembaga mitra.',
                'satuan' => '%',
                'target_default' => 25.0,
            ],
            [
                'nomor' => 4,
                'kode' => 'IKU 4',
                'nama' => 'Praktisi Mengajar di Dalam Kampus',
                'deskripsi' => 'Persentase mata kuliah yang diajar oleh dosen yang berasal dari kalangan praktisi ahli industri/profesi.',
                'definisi_operasional' => 'Praktisi minimal berpengalaman 5 tahun mengajar minimal 4 pertemuan dalam 1 semester.',
                'satuan' => '%',
                'target_default' => 10.0,
            ],
            [
                'nomor' => 5,
                'kode' => 'IKU 5',
                'nama' => 'Keluaran Kerja Dosen Digunakan oleh Masyarakat / Rekognisi',
                'deskripsi' => 'Jumlah keluaran penelitian dan pengabdian dosen yang berhasil mendapat rekognisi internasional atau diterapkan masyarakat.',
                'definisi_operasional' => 'Artikel jurnal Sinta/Scopus, buku ber-ISBN, HKI/Paten, atau model penyuluhan keagamaan.',
                'satuan' => 'Karya/Dosen',
                'target_default' => 40.0,
            ],
            [
                'nomor' => 6,
                'kode' => 'IKU 6',
                'nama' => 'Program Studi Bekerjasama dengan Mitra Kelas Dunia / Nasional',
                'deskripsi' => 'Jumlah kemitraan aktif per program studi dengan instansi pemerintah, yayasan keagamaan, dan perguruan tinggi bereputasi.',
                'definisi_operasional' => 'MoU dan MoA yang diimplementasikan dalam kegiatan nyata magang, penelitian, atau kuliah umum.',
                'satuan' => 'Kemitraan Aktif',
                'target_default' => 5.0,
            ],
            [
                'nomor' => 7,
                'kode' => 'IKU 7',
                'nama' => 'Kelas yang Kolaboratif dan Partisipatif',
                'deskripsi' => 'Persentase mata kuliah yang menggunakan metode pemecahan kasus (Case Method) atau pembelajaran berbasis proyek (Team-based Project).',
                'definisi_operasional' => 'Evaluasi bobot tugas proyek dan analisis studi kasus minimal 50% dari nilai akhir mata kuliah.',
                'satuan' => '%',
                'target_default' => 50.0,
            ],
            [
                'nomor' => 8,
                'kode' => 'IKU 8',
                'nama' => 'Program Studi Berstandar Internasional / Akreditasi Unggul',
                'deskripsi' => 'Persentase program studi yang memiliki sertifikasi internasional atau akreditasi BAN-PT/LAM dengan predikat Unggul/A.',
                'definisi_operasional' => 'Prodi terakreditasi Unggul atau meraih pengakuan standar internasional ISO / AUN-QA.',
                'satuan' => '%',
                'target_default' => 60.0,
            ],
        ];

        foreach ($ikus as $ikuData) {
            $createdIku = Iku::firstOrCreate(
                ['kode' => $ikuData['kode']],
                $ikuData
            );

            // Sampel capaian Monev untuk tahun aktif
            if ($prodis->has('PAH-S1')) {
                $target = $ikuData['target_default'];
                $realisasi = match ($ikuData['kode']) {
                    'IKU 1' => 82.5,
                    'IKU 2' => 28.0,
                    'IKU 3' => 22.0,
                    'IKU 4' => 12.5,
                    'IKU 5' => 45.0,
                    'IKU 6' => 6.0,
                    'IKU 7' => 55.0,
                    'IKU 8' => 66.7,
                    default => $target,
                };

                $pct = $target > 0 ? round(($realisasi / $target) * 100, 1) : 100;
                $status = $pct >= 100 ? 'Tercapai' : ($pct >= 75 ? 'Sebagian Tercapai' : 'Belum Tercapai');

                MonevIku::firstOrCreate(
                    [
                        'iku_id' => $createdIku->id,
                        'tahun_akademik_id' => $ta->id,
                        'program_studi_id' => $prodis['PAH-S1']->id,
                    ],
                    [
                        'target' => $target,
                        'realisasi' => $realisasi,
                        'persentase_capaian' => $pct,
                        'status' => $status,
                        'kendala' => $status !== 'Tercapai' ? 'Keterbatasan mitra industri di luar wilayah Jabodetabek.' : null,
                        'strategi_tindak_lanjut' => 'Memperluas jejaring kerjasama dengan Pasraman dan Sekolah Hindu se-Indonesia.',
                    ]
                );
            }
        }

        // 2. Master Pelatihan & Workshop SDM
        $pelatihans = [
            [
                'kode' => 'PEL-2025-001',
                'judul' => 'Workshop Penyusunan Kurikulum Berbasis Outcome-Based Education (OBE) & Nilai Kehinduan',
                'kategori' => 'Pedagogik & Kurikulum',
                'narasumber' => 'Prof. Dr. I Wayan Suweta, M.Si. (Pakar Kurikulum Nasional)',
                'penyelenggara' => 'LP3M STAH Dharma Nusantara Jakarta',
                'tanggal_mulai' => '2025-08-10',
                'tanggal_selesai' => '2025-08-12',
                'lokasi' => 'Auditorium Utama STAH DNJ',
                'kuota' => 35,
                'jam_pelajaran' => 32,
                'status' => 'Selesai',
                'deskripsi' => 'Peningkatan kapasitas dosen dalam merancang Capaian Pembelajaran Lulusan (CPL), CPMK, serta rubrik asesmen berbasis OBE terintegrasi nilai Veda.',
                'silabus_materi' => "1. Paradigma Kurikulum OBE\n2. Rekonstruksi CPL & Pemetaan Mata Kuliah\n3. Perancangan RPS Berbasis Studi Kasus\n4. Praktik Asesmen & Portofolio Mahasiswa",
            ],
            [
                'kode' => 'PEL-2025-002',
                'judul' => 'Pelatihan Metodologi Penelitian Kualitatif Keagamaan & Penulisan Artikel Jurnal Bereputasi Scopus/Sinta',
                'kategori' => 'Penelitian & Publikasi',
                'narasumber' => 'Dr. Ni Made Ratna Sari, M.Pd. (Chief Editor Jurnal Dharmasmrti)',
                'penyelenggara' => 'LP3M & LP2M STAH DNJ',
                'tanggal_mulai' => '2025-11-05',
                'tanggal_selesai' => '2025-11-08',
                'lokasi' => 'Laboratorium Komputer & Media Pembelajaran',
                'kuota' => 25,
                'jam_pelajaran' => 40,
                'status' => 'Sedang Berjalan',
                'deskripsi' => 'Coaching clinic penulisan manuskrip ilmiah, manajemen referensi Mendeley/Zotero, serta strategi submit ke jurnal internasional terindeks Scopus.',
                'silabus_materi' => "1. State of the Art Riset Studi Hindu\n2. Analisis Data Tematik Menggunakan NVivo\n3. Struktur Artikel Standar IMRAD\n4. Peer Review & Respon Reviewer",
            ],
            [
                'kode' => 'PEL-2026-001',
                'judul' => 'Pelatihan Calon Auditor Mutu Internal (AMI) Berstandar SPMI SN-Dikti',
                'kategori' => 'Penjaminan Mutu SPMI',
                'narasumber' => 'Tim Fasilitator SPMI Nasional Ditjen Diktiristek',
                'penyelenggara' => 'LP3M STAH Dharma Nusantara Jakarta',
                'tanggal_mulai' => '2026-03-15',
                'tanggal_selesai' => '2026-03-17',
                'lokasi' => 'Ruang Rapat Senat Lt. 2',
                'kuota' => 20,
                'jam_pelajaran' => 24,
                'status' => 'Akan Datang',
                'deskripsi' => 'Sertifikasi kompetensi auditor mutu internal untuk mendukung audit visitasi kepatuhan SPMI di program studi dan unit kerja.',
                'silabus_materi' => "1. Kebijakan Nasional SPMI & Siklus PPEPP\n2. Teknik Wawancara Audit & Pengumpulan Bukti Lapangan\n3. Perumusan Ketidaksesuaian KTS Mayor/Minor/Observasi\n4. Simulasi Audit Lapangan & Pembuatan Laporan Audit",
            ],
        ];

        foreach ($pelatihans as $pData) {
            $pelatihan = Pelatihan::firstOrCreate(
                ['kode' => $pData['kode']],
                $pData
            );

            // Daftarkan dosen sebagai peserta sampel
            if ($dosens->isNotEmpty() && $pData['status'] === 'Selesai') {
                foreach ($dosens as $idx => $d) {
                    PesertaPelatihan::firstOrCreate(
                        [
                            'pelatihan_id' => $pelatihan->id,
                            'user_id' => $d->id,
                        ],
                        [
                            'status_kehadiran' => 'Lulus',
                            'nomor_sertifikat' => 'SERT-LP3M/OBE/2025/'.str_pad($idx + 1, 3, '0', STR_PAD_LEFT),
                            'tanggal_terbit_sertifikat' => '2025-08-15',
                            'catatan_evaluasi' => 'Lulus dengan predikat Sangat Baik. Menuntaskan portofolio RPS OBE mata kuliah.',
                        ]
                    );
                }
            }
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Kuesioner;
use App\Models\PertanyaanKuesioner;
use App\Models\ProgramStudi;
use App\Models\ResponSurvei;
use App\Models\TahunAkademik;
use App\Models\TracerStudy;
use App\Models\User;
use Illuminate\Database\Seeder;

class SurveiTracerSeeder extends Seeder
{
    public function run(): void
    {
        $ta = TahunAkademik::active() ?? TahunAkademik::first();
        $admin = User::first();
        $prodis = ProgramStudi::all()->keyBy('kode');
        $dosen = User::whereHas('role', fn ($q) => $q->where('name', 'dosen'))->first() ?? $admin;
        $mahasiswa = User::whereHas('role', fn ($q) => $q->where('name', 'mahasiswa'))->first() ?? $admin;

        // 1. Kuesioner EDOM
        $edom = Kuesioner::firstOrCreate(
            ['kode' => 'EDOM-2025-GANJIL'],
            [
                'judul' => 'Evaluasi Dosen Oleh Mahasiswa (EDOM) Semester Ganjil 2025/2026',
                'tipe' => 'EDOM',
                'deskripsi' => 'Instrumen evaluasi kinerja proses pembelajaran dan pengajaran dosen STAH Dharma Nusantara Jakarta.',
                'tahun_akademik_id' => $ta->id,
                'tanggal_mulai' => '2025-12-01',
                'tanggal_selesai' => '2026-01-31',
                'target_role' => 'mahasiswa',
                'is_active' => true,
                'created_by' => $admin->id,
            ]
        );

        $pertanyaanEdom = [
            // Aspek Pedagogik
            ['nomor' => 1, 'aspek' => 'Pedagogik', 't' => 'Dosen menyampaikan Rencana Pembelajaran Semester (RPS) dan kontrak kuliah di awal pertemuan.'],
            ['nomor' => 2, 'aspek' => 'Pedagogik', 't' => 'Dosen mengajar sesuai dengan materi pokok bahasan yang direncanakan.'],
            ['nomor' => 3, 'aspek' => 'Pedagogik', 't' => 'Dosen memanfaatkan media pembelajaran dan teknologi informasi secara efektif.'],
            ['nomor' => 4, 'aspek' => 'Pedagogik', 't' => 'Dosen memberikan umpan balik dan evaluasi tugas secara transparan dan tepat waktu.'],

            // Aspek Profesional
            ['nomor' => 5, 'aspek' => 'Profesional', 't' => 'Dosen menguasai materi perkuliahan secara mendalam dan kontekstual.'],
            ['nomor' => 6, 'aspek' => 'Profesional', 't' => 'Dosen mengaitkan materi kuliah dengan nilai kearifan Veda, filsafat Hindu, dan riset mutakhir.'],

            // Aspek Kepribadian
            ['nomor' => 7, 'aspek' => 'Kepribadian', 't' => 'Dosen berpenampilan rapi, santun, dan menjadi teladan bagi mahasiswa.'],
            ['nomor' => 8, 'aspek' => 'Kepribadian', 't' => 'Dosen hadir dan mengakhiri perkuliahan tepat waktu sesuai jadwal.'],

            // Aspek Sosial
            ['nomor' => 9, 'aspek' => 'Sosial', 't' => 'Dosen bersikap adil, tidak diskriminatif, dan menghargai pendapat mahasiswa.'],
            ['nomor' => 10, 'aspek' => 'Sosial', 't' => 'Dosen mudah dihubungi untuk konsultasi dan bimbingan akademik di luar jam kuliah.'],
        ];

        foreach ($pertanyaanEdom as $p) {
            PertanyaanKuesioner::firstOrCreate(
                [
                    'kuesioner_id' => $edom->id,
                    'nomor_urut' => $p['nomor'],
                ],
                [
                    'aspek' => $p['aspek'],
                    'teks_pertanyaan' => $p['t'],
                    'tipe_jawaban' => 'skala_4',
                    'pilihan_jawaban_json' => ['1' => 'Kurang Baik', '2' => 'Cukup', '3' => 'Baik', '4' => 'Sangat Baik'],
                    'is_required' => true,
                ]
            );
        }

        // 2. Kuesioner Kepuasan Layanan Mahasiswa
        $kepuasanMhs = Kuesioner::firstOrCreate(
            ['kode' => 'SURVEI-MHS-2025'],
            [
                'judul' => 'Survei Kepuasan Layanan Akademik & Sarana Prasarana Mahasiswa',
                'tipe' => 'KepuasanMahasiswa',
                'deskripsi' => 'Pengukuran indeks kepuasan mahasiswa terhadap fasilitas, layanan administrasi, dan sistem informasi kampus.',
                'tahun_akademik_id' => $ta->id,
                'tanggal_mulai' => '2025-11-01',
                'tanggal_selesai' => '2026-02-28',
                'target_role' => 'mahasiswa',
                'is_active' => true,
                'created_by' => $admin->id,
            ]
        );

        $pertanyaanKepuasan = [
            ['nomor' => 1, 'aspek' => 'Tangibles (Fasilitas Fisik)', 't' => 'Kebersihan, kenyamanan, dan kelengkapan fasilitas ruang kuliah dan perpustakaan.'],
            ['nomor' => 2, 'aspek' => 'Tangibles (Fasilitas Fisik)', 't' => 'Kecepatan dan kestabilan jaringan internet/WiFi kampus.'],
            ['nomor' => 3, 'aspek' => 'Reliability (Keandalan)', 't' => 'Keandalan sistem informasi akademik kampus dalam melayani KRS dan pengumuman nilai.'],
            ['nomor' => 4, 'aspek' => 'Responsiveness (Ketanggapan)', 't' => 'Kecepatan dan ketepatan petugas BAAK/Bagian Akademik dalam merespons kendala mahasiswa.'],
            ['nomor' => 5, 'aspek' => 'Assurance (Jaminan)', 't' => 'Kejelasan prosedur administrasi persuratan dan keabsahan dokumen akademik.'],
            ['nomor' => 6, 'aspek' => 'Empathy (Kepedulian)', 't' => 'Keramahan dan kesediaan pimpinan serta dosen PA dalam mendengarkan aspirasi mahasiswa.'],
        ];

        foreach ($pertanyaanKepuasan as $pk) {
            PertanyaanKuesioner::firstOrCreate(
                [
                    'kuesioner_id' => $kepuasanMhs->id,
                    'nomor_urut' => $pk['nomor'],
                ],
                [
                    'aspek' => $pk['aspek'],
                    'teks_pertanyaan' => $pk['t'],
                    'tipe_jawaban' => 'skala_4',
                    'pilihan_jawaban_json' => ['1' => 'Sangat Tidak Puas', '2' => 'Tidak Puas', '3' => 'Puas', '4' => 'Sangat Puas'],
                    'is_required' => true,
                ]
            );
        }

        // 3. Sampel Respon EDOM
        if ($prodis->has('PAH-S1')) {
            ResponSurvei::firstOrCreate(
                [
                    'kuesioner_id' => $edom->id,
                    'user_id' => $mahasiswa->id,
                    'dosen_id' => $dosen->id,
                    'mata_kuliah' => 'Teologi Hindu & Filsafat Veda',
                ],
                [
                    'program_studi_id' => $prodis['PAH-S1']->id,
                    'skor_rata_rata' => 3.70,
                    'jawaban_json' => [
                        '1' => 4, '2' => 4, '3' => 3, '4' => 4, '5' => 4,
                        '6' => 4, '7' => 4, '8' => 3, '9' => 4, '10' => 3,
                    ],
                    'saran_masukan' => 'Penyampaian materi sangat menginspirasi dan mudah dipahami. Mohon bahan slide materi dapat dibagikan lebih awal di portal.',
                ]
            );
        }

        // 4. Data Sampel Tracer Study Alumni
        $sampleAlumni = [
            [
                'prodi_kode' => 'PAH-S1',
                'tahun_lulus' => 2024,
                'nama' => 'I Wayan Astawa, S.Pd.',
                'nim' => '2020010101',
                'email' => 'wayan.astawa@gmail.com',
                'hp' => '081234567890',
                'status' => 'Bekerja Penuh',
                'instansi' => 'SMA Negeri Unggulan Jakarta',
                'jabatan' => 'Guru Pendidikan Agama Hindu',
                'masa_tunggu' => 2,
                'pendapatan' => '5 - 10 Juta',
                'kesesuaian' => 'Sangat Sesuai',
                'rekomendasi' => 'Kurikulum STAH DNJ sangat aplikatif terutama dalam metodologi pengajaran dan praktik keagamaan.',
            ],
            [
                'prodi_kode' => 'PAH-S1',
                'tahun_lulus' => 2024,
                'nama' => 'Ni Kadek Sintya Dewi, S.Pd.',
                'nim' => '2020010102',
                'email' => 'kadek.sintya@gmail.com',
                'hp' => '081398765432',
                'status' => 'Bekerja Penuh',
                'instansi' => 'Kantor Wilayah Kementerian Agama DKI Jakarta',
                'jabatan' => 'Penyuluh Agama Hindu',
                'masa_tunggu' => 3,
                'pendapatan' => '5 - 10 Juta',
                'kesesuaian' => 'Sangat Sesuai',
                'rekomendasi' => 'Tingkatkan pelatihan public speaking dan moderasi beragama.',
            ],
            [
                'prodi_kode' => 'IKH-S1',
                'tahun_lulus' => 2023,
                'nama' => 'I Putu Gede Suartama, S.Sos.',
                'nim' => '2019020105',
                'email' => 'putu.suartama@outlook.com',
                'hp' => '082155566778',
                'status' => 'Wiraswasta',
                'instansi' => 'Dharma Media Kreasi Production',
                'jabatan' => 'Founder & Creative Director',
                'masa_tunggu' => 1,
                'pendapatan' => '> 10 Juta',
                'kesesuaian' => 'Sesuai',
                'rekomendasi' => 'Keterampilan produksi konten digital dan jurnalistik keagamaan di STAH DNJ menjadi modal utama saya berwirausaha.',
            ],
            [
                'prodi_kode' => 'PAH-S2',
                'tahun_lulus' => 2024,
                'nama' => 'Dr. Drs. I Made Sudarma, M.Pd.',
                'nim' => '2022030101',
                'email' => 'made.sudarma@yahoo.co.id',
                'hp' => '081188990011',
                'status' => 'Bekerja Penuh',
                'instansi' => 'Sekolah Tinggi Keagamaan Hindu',
                'jabatan' => 'Dosen Tetap & Peneliti',
                'masa_tunggu' => 0,
                'pendapatan' => '> 10 Juta',
                'kesesuaian' => 'Sangat Sesuai',
                'rekomendasi' => 'Program Magister STAH DNJ memperkuat kapasitas riset dan publikasi ilmiah bereputasi.',
            ],
            [
                'prodi_kode' => 'PAH-S1',
                'tahun_lulus' => 2024,
                'nama' => 'Ni Luh Putu Anggreni, S.Pd.',
                'nim' => '2020010115',
                'email' => 'luh.anggreni@gmail.com',
                'hp' => '081277665544',
                'status' => 'Melanjutkan Studi',
                'instansi' => 'Pascasarjana Magister Ilmu Komunikasi Hindu',
                'jabatan' => 'Mahasiswa Pascasarjana',
                'masa_tunggu' => 0,
                'pendapatan' => '< 3 Juta',
                'kesesuaian' => 'Sesuai',
                'rekomendasi' => 'Peluang beasiswa lanjut studi perlu terus diperbanyak.',
            ],
        ];

        foreach ($sampleAlumni as $alm) {
            $prodi = $prodis[$alm['prodi_kode']] ?? $prodis->first();
            if ($prodi) {
                TracerStudy::firstOrCreate(
                    ['nim' => $alm['nim']],
                    [
                        'program_studi_id' => $prodi->id,
                        'tahun_lulus' => $alm['tahun_lulus'],
                        'nama_alumni' => $alm['nama'],
                        'email' => $alm['email'],
                        'nomor_hp' => $alm['hp'],
                        'status_alumni' => $alm['status'],
                        'nama_instansi' => $alm['instansi'],
                        'posisi_jabatan' => $alm['jabatan'],
                        'masa_tunggu_bulan' => $alm['masa_tunggu'],
                        'pendapatan_bulanan' => $alm['pendapatan'],
                        'kesesuaian_bidang' => $alm['kesesuaian'],
                        'rekomendasi_alumni' => $alm['rekomendasi'],
                    ]
                );
            }
        }
    }
}

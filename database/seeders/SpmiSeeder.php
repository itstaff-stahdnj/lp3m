<?php

namespace Database\Seeders;

use App\Models\CapaianIndikator;
use App\Models\DokumenMutu;
use App\Models\IndikatorMutu;
use App\Models\ProgramStudi;
use App\Models\StandarMutu;
use App\Models\TahunAkademik;
use App\Models\UnitKerja;
use Illuminate\Database\Seeder;

class SpmiSeeder extends Seeder
{
    public function run(): void
    {
        $lp3m = UnitKerja::where('kode', 'LP3M')->first();
        $lppm = UnitKerja::where('kode', 'LPPM')->first();
        $baak = UnitKerja::where('kode', 'BAAK')->first();
        $bauk = UnitKerja::where('kode', 'BAUK')->first();

        // 24 Standar SN-Dikti
        $standars = [
            // 8 Standar Pendidikan
            [
                'kode' => 'STD-DIK-01',
                'nama' => 'Standar Kompetensi Lulusan (SKL)',
                'kategori' => 'Pendidikan',
                'deskripsi' => 'Kriteria minimal tentang kualifikasi kemampuan lulusan yang mencakup sikap, pengetahuan, dan keterampilan sesuai KKNI jenjang 6 & 8.',
                'kriteria_akreditasi' => 'Kriteria 9: Luaran dan Capaian Tridharma',
                'penanggung_jawab_unit_id' => $lp3m?->id,
                'urutan' => 1,
            ],
            [
                'kode' => 'STD-DIK-02',
                'nama' => 'Standar Isi Pembelajaran',
                'kategori' => 'Pendidikan',
                'deskripsi' => 'Kriteria minimal tingkat kedalaman dan keluasan materi pembelajaran yang berorientasi pada capaian pembelajaran lulusan (CPL).',
                'kriteria_akreditasi' => 'Kriteria 6: Pendidikan',
                'penanggung_jawab_unit_id' => $lp3m?->id,
                'urutan' => 2,
            ],
            [
                'kode' => 'STD-DIK-03',
                'nama' => 'Standar Proses Pembelajaran',
                'kategori' => 'Pendidikan',
                'deskripsi' => 'Kriteria minimal tentang pelaksanaan pembelajaran pada program studi untuk memperoleh capaian pembelajaran lulusan (OBE & SCL).',
                'kriteria_akreditasi' => 'Kriteria 6: Pendidikan',
                'penanggung_jawab_unit_id' => $lp3m?->id,
                'urutan' => 3,
            ],
            [
                'kode' => 'STD-DIK-04',
                'nama' => 'Standar Penilaian Pembelajaran',
                'kategori' => 'Pendidikan',
                'deskripsi' => 'Kriteria minimal tentang penilaian proses dan hasil belajar mahasiswa dalam rangka pemenuhan capaian pembelajaran lulusan.',
                'kriteria_akreditasi' => 'Kriteria 6: Pendidikan',
                'penanggung_jawab_unit_id' => $lp3m?->id,
                'urutan' => 4,
            ],
            [
                'kode' => 'STD-DIK-05',
                'nama' => 'Standar Dosen dan Tenaga Kependidikan',
                'kategori' => 'Pendidikan',
                'deskripsi' => 'Kriteria minimal kualifikasi akademik, kompetensi pendidik, dan kecukupan rasio dosen terhadap mahasiswa.',
                'kriteria_akreditasi' => 'Kriteria 4: Sumber Daya Manusia',
                'penanggung_jawab_unit_id' => $bauk?->id,
                'urutan' => 5,
            ],
            [
                'kode' => 'STD-DIK-06',
                'nama' => 'Standar Sarana dan Prasarana Pembelajaran',
                'kategori' => 'Pendidikan',
                'deskripsi' => 'Kriteria minimal tentang sarana dan prasarana ruang kelas, laboratorium, perpustakaan, dan teknologi informasi.',
                'kriteria_akreditasi' => 'Kriteria 5: Keuangan, Sarana dan Prasarana',
                'penanggung_jawab_unit_id' => $bauk?->id,
                'urutan' => 6,
            ],
            [
                'kode' => 'STD-DIK-07',
                'nama' => 'Standar Pengelolaan Pembelajaran',
                'kategori' => 'Pendidikan',
                'deskripsi' => 'Kriteria minimal tentang perencanaan, pelaksanaan, pengendalian, pemantauan, dan evaluasi kegiatan pembelajaran.',
                'kriteria_akreditasi' => 'Kriteria 2: Tata Pamong, Tata Kelola dan Kerjasama',
                'penanggung_jawab_unit_id' => $baak?->id,
                'urutan' => 7,
            ],
            [
                'kode' => 'STD-DIK-08',
                'nama' => 'Standar Pembiayaan Pembelajaran',
                'kategori' => 'Pendidikan',
                'deskripsi' => 'Kriteria minimal komponen dan besaran biaya operasional, investasi, dan personal dalam penyelenggaraan pendidikan.',
                'kriteria_akreditasi' => 'Kriteria 5: Keuangan, Sarana dan Prasarana',
                'penanggung_jawab_unit_id' => $bauk?->id,
                'urutan' => 8,
            ],

            // 8 Standar Penelitian
            [
                'kode' => 'STD-LIT-01',
                'nama' => 'Standar Hasil Penelitian',
                'kategori' => 'Penelitian',
                'deskripsi' => 'Kriteria minimal tentang mutu hasil penelitian yang diarahkan untuk mengembangkan IPTEKS keagamaan Hindu.',
                'kriteria_akreditasi' => 'Kriteria 7: Penelitian',
                'penanggung_jawab_unit_id' => $lppm?->id,
                'urutan' => 9,
            ],
            [
                'kode' => 'STD-LIT-02',
                'nama' => 'Standar Isi Penelitian',
                'kategori' => 'Penelitian',
                'deskripsi' => 'Kriteria minimal tentang kedalaman dan keluasan materi penelitian dasar dan terapan sesuai renstra LPPM.',
                'kriteria_akreditasi' => 'Kriteria 7: Penelitian',
                'penanggung_jawab_unit_id' => $lppm?->id,
                'urutan' => 10,
            ],
            [
                'kode' => 'STD-LIT-03',
                'nama' => 'Standar Proses Penelitian',
                'kategori' => 'Penelitian',
                'deskripsi' => 'Kriteria minimal kegiatan penelitian yang terdiri atas perencanaan, pelaksanaan, dan pelaporan hasil riset.',
                'kriteria_akreditasi' => 'Kriteria 7: Penelitian',
                'penanggung_jawab_unit_id' => $lppm?->id,
                'urutan' => 11,
            ],
            [
                'kode' => 'STD-LIT-04',
                'nama' => 'Standar Penilaian Penelitian',
                'kategori' => 'Penelitian',
                'deskripsi' => 'Kriteria minimal penilaian proses dan hasil penelitian melalui peer review dan seminar hasil.',
                'kriteria_akreditasi' => 'Kriteria 7: Penelitian',
                'penanggung_jawab_unit_id' => $lppm?->id,
                'urutan' => 12,
            ],
            [
                'kode' => 'STD-LIT-05',
                'nama' => 'Standar Peneliti',
                'kategori' => 'Penelitian',
                'deskripsi' => 'Kriteria minimal kemampuan peneliti untuk melaksanakan penelitian dan mengikutsertakan mahasiswa.',
                'kriteria_akreditasi' => 'Kriteria 7: Penelitian',
                'penanggung_jawab_unit_id' => $lppm?->id,
                'urutan' => 13,
            ],
            [
                'kode' => 'STD-LIT-06',
                'nama' => 'Standar Sarana dan Prasarana Penelitian',
                'kategori' => 'Penelitian',
                'deskripsi' => 'Kriteria minimal sarana dan prasarana yang diperlukan untuk menunjang kebutuhan isi dan proses penelitian.',
                'kriteria_akreditasi' => 'Kriteria 7: Penelitian',
                'penanggung_jawab_unit_id' => $lppm?->id,
                'urutan' => 14,
            ],
            [
                'kode' => 'STD-LIT-07',
                'nama' => 'Standar Pengelolaan Penelitian',
                'kategori' => 'Penelitian',
                'deskripsi' => 'Kriteria minimal tentang perencanaan, pelaksanaan, pengendalian, dan pelaporan kegiatan penelitian oleh LPPM.',
                'kriteria_akreditasi' => 'Kriteria 7: Penelitian',
                'penanggung_jawab_unit_id' => $lppm?->id,
                'urutan' => 15,
            ],
            [
                'kode' => 'STD-LIT-08',
                'nama' => 'Standar Pendanaan dan Pembiayaan Penelitian',
                'kategori' => 'Penelitian',
                'deskripsi' => 'Kriteria minimal alokasi dana penelitian internal STAH DNJ dan sumber hibah eksternal.',
                'kriteria_akreditasi' => 'Kriteria 7: Penelitian',
                'penanggung_jawab_unit_id' => $bauk?->id,
                'urutan' => 16,
            ],

            // 8 Standar Pengabdian kepada Masyarakat (PkM)
            [
                'kode' => 'STD-PKM-01',
                'nama' => 'Standar Hasil Pengabdian kepada Masyarakat',
                'kategori' => 'Pengabdian',
                'deskripsi' => 'Kriteria minimal hasil pengabdian dalam penerapan dan pemberdayaan masyarakat keagamaan Hindu.',
                'kriteria_akreditasi' => 'Kriteria 8: Pengabdian kepada Masyarakat',
                'penanggung_jawab_unit_id' => $lppm?->id,
                'urutan' => 17,
            ],
            [
                'kode' => 'STD-PKM-02',
                'nama' => 'Standar Isi Pengabdian kepada Masyarakat',
                'kategori' => 'Pengabdian',
                'deskripsi' => 'Kriteria minimal kedalaman dan keluasan materi PkM yang bersumber dari hasil penelitian dosen dan kearifan lokal.',
                'kriteria_akreditasi' => 'Kriteria 8: Pengabdian kepada Masyarakat',
                'penanggung_jawab_unit_id' => $lppm?->id,
                'urutan' => 18,
            ],
            [
                'kode' => 'STD-PKM-03',
                'nama' => 'Standar Proses Pengabdian kepada Masyarakat',
                'kategori' => 'Pengabdian',
                'deskripsi' => 'Kriteria minimal kegiatan PkM yang terencana, partisipatif, dan memiliki dampak nyata bagi umat.',
                'kriteria_akreditasi' => 'Kriteria 8: Pengabdian kepada Masyarakat',
                'penanggung_jawab_unit_id' => $lppm?->id,
                'urutan' => 19,
            ],
            [
                'kode' => 'STD-PKM-04',
                'nama' => 'Standar Penilaian Pengabdian kepada Masyarakat',
                'kategori' => 'Pengabdian',
                'deskripsi' => 'Kriteria minimal penilaian proses dan dampak PkM terhadap peningkatan kesejahteraan dan religiusitas umat.',
                'kriteria_akreditasi' => 'Kriteria 8: Pengabdian kepada Masyarakat',
                'penanggung_jawab_unit_id' => $lppm?->id,
                'urutan' => 20,
            ],
            [
                'kode' => 'STD-PKM-05',
                'nama' => 'Standar Pelaksana Pengabdian kepada Masyarakat',
                'kategori' => 'Pengabdian',
                'deskripsi' => 'Kriteria minimal kemampuan pelaksana PkM dengan melibatkan mahasiswa secara kolaboratif.',
                'kriteria_akreditasi' => 'Kriteria 8: Pengabdian kepada Masyarakat',
                'penanggung_jawab_unit_id' => $lppm?->id,
                'urutan' => 21,
            ],
            [
                'kode' => 'STD-PKM-06',
                'nama' => 'Standar Sarana dan Prasarana Pengabdian',
                'kategori' => 'Pengabdian',
                'deskripsi' => 'Kriteria minimal sarana dan prasarana penunjang kegiatan pengabdian di kantong umat dan pasraman.',
                'kriteria_akreditasi' => 'Kriteria 8: Pengabdian kepada Masyarakat',
                'penanggung_jawab_unit_id' => $lppm?->id,
                'urutan' => 22,
            ],
            [
                'kode' => 'STD-PKM-07',
                'nama' => 'Standar Pengelolaan Pengabdian kepada Masyarakat',
                'kategori' => 'Pengabdian',
                'deskripsi' => 'Kriteria minimal kelembagaan pengelolaan PkM oleh LPPM STAH DNJ.',
                'kriteria_akreditasi' => 'Kriteria 8: Pengabdian kepada Masyarakat',
                'penanggung_jawab_unit_id' => $lppm?->id,
                'urutan' => 23,
            ],
            [
                'kode' => 'STD-PKM-08',
                'nama' => 'Standar Pendanaan dan Pembiayaan Pengabdian',
                'kategori' => 'Pengabdian',
                'deskripsi' => 'Kriteria minimal ketersediaan dana PkM dari anggaran institusi, pemerintah, dan kemitraan umat.',
                'kriteria_akreditasi' => 'Kriteria 8: Pengabdian kepada Masyarakat',
                'penanggung_jawab_unit_id' => $bauk?->id,
                'urutan' => 24,
            ],
        ];

        foreach ($standars as $std) {
            $created = StandarMutu::updateOrCreate(['kode' => $std['kode']], $std);

            // Buat indikator untuk beberapa standar utama
            if ($std['kode'] === 'STD-DIK-01') {
                IndikatorMutu::updateOrCreate(
                    ['kode' => 'IND-SKL-01'],
                    [
                        'standar_mutu_id' => $created->id,
                        'pernyataan' => 'Rata-rata Indeks Prestasi Kumulatif (IPK) lulusan program sarjana minimal 3.25.',
                        'target' => '3.25',
                        'satuan' => 'Skala 4.0',
                        'baseline' => '3.15',
                        'tipe_indikator' => 'Standar',
                        'bobot' => 2,
                    ]
                );
                IndikatorMutu::updateOrCreate(
                    ['kode' => 'IND-SKL-02'],
                    [
                        'standar_mutu_id' => $created->id,
                        'pernyataan' => 'Persentase kelulusan tepat waktu (maksimal 8 semester untuk S1) minimal 75%.',
                        'target' => '75',
                        'satuan' => '%',
                        'baseline' => '68',
                        'tipe_indikator' => 'IKU',
                        'bobot' => 3,
                    ]
                );
            } elseif ($std['kode'] === 'STD-DIK-05') {
                IndikatorMutu::updateOrCreate(
                    ['kode' => 'IND-DSN-01'],
                    [
                        'standar_mutu_id' => $created->id,
                        'pernyataan' => 'Persentase dosen tetap berpendidikan Doktor (S3) minimal 40%.',
                        'target' => '40',
                        'satuan' => '%',
                        'baseline' => '32',
                        'tipe_indikator' => 'Standar',
                        'bobot' => 2,
                    ]
                );
                IndikatorMutu::updateOrCreate(
                    ['kode' => 'IND-DSN-02'],
                    [
                        'standar_mutu_id' => $created->id,
                        'pernyataan' => 'Persentase dosen tetap memiliki Sertifikat Pendidik (Serdos) minimal 80%.',
                        'target' => '80',
                        'satuan' => '%',
                        'baseline' => '72',
                        'tipe_indikator' => 'Standar',
                        'bobot' => 2,
                    ]
                );
            } elseif ($std['kode'] === 'STD-LIT-01') {
                IndikatorMutu::updateOrCreate(
                    ['kode' => 'IND-LIT-01'],
                    [
                        'standar_mutu_id' => $created->id,
                        'pernyataan' => 'Rata-rata publikasi artikel ilmiah dosen pada jurnal nasional terakreditasi SINTA per tahun minimal 1 judul per dosen.',
                        'target' => '1.0',
                        'satuan' => 'Judul/Dosen/Tahun',
                        'baseline' => '0.8',
                        'tipe_indikator' => 'IKU',
                        'bobot' => 3,
                    ]
                );
            } elseif ($std['kode'] === 'STD-PKM-01') {
                IndikatorMutu::updateOrCreate(
                    ['kode' => 'IND-PKM-01'],
                    [
                        'standar_mutu_id' => $created->id,
                        'pernyataan' => 'Jumlah kegiatan pengabdian dosen yang melibatkan mahasiswa minimal 60% dari total kegiatan PkM.',
                        'target' => '60',
                        'satuan' => '%',
                        'baseline' => '50',
                        'tipe_indikator' => 'Standar',
                        'bobot' => 2,
                    ]
                );
            }
        }

        // Dokumen Mutu SPMI Awal
        $dokumens = [
            [
                'kode_dokumen' => 'DOC-KBJ-2024-001',
                'nama' => 'Kebijakan Sistem Penjaminan Mutu Internal (SPMI) STAH DNJ',
                'kategori' => 'Kebijakan',
                'standar_mutu_id' => null,
                'unit_kerja_id' => $lp3m?->id,
                'nomor_sk' => 'SK Ketua STAH DNJ No. 042/STAH-DNJ/IX/2024',
                'tanggal_berlaku' => '2024-09-01',
                'versi' => '2.0',
                'is_public' => true,
                'keterangan' => 'Dokumen arah dan landasan umum SPMI berbasis SN-Dikti.',
            ],
            [
                'kode_dokumen' => 'DOC-MNL-2024-002',
                'nama' => 'Manual Mutu Standar Pendidikan STAH DNJ',
                'kategori' => 'Manual',
                'standar_mutu_id' => 1,
                'unit_kerja_id' => $lp3m?->id,
                'nomor_sk' => 'SK Ketua STAH DNJ No. 045/STAH-DNJ/IX/2024',
                'tanggal_berlaku' => '2024-09-01',
                'versi' => '2.0',
                'is_public' => true,
                'keterangan' => 'Manual siklus PPEPP untuk 8 Standar Pendidikan.',
            ],
            [
                'kode_dokumen' => 'DOC-SOP-2025-001',
                'nama' => 'SOP Pelaksanaan Audit Mutu Internal (AMI)',
                'kategori' => 'SOP',
                'standar_mutu_id' => null,
                'unit_kerja_id' => $lp3m?->id,
                'nomor_sk' => 'SK Ketua LP3M No. 012/LP3M/I/2025',
                'tanggal_berlaku' => '2025-01-15',
                'versi' => '1.2',
                'is_public' => false,
                'keterangan' => 'Prosedur operasional baku penugasan auditor dan input temuan KTS.',
            ],
            [
                'kode_dokumen' => 'DOC-FRM-2025-003',
                'nama' => 'Formulir Permintaan Tindakan Koreksi (PTK)',
                'kategori' => 'Formulir',
                'standar_mutu_id' => null,
                'unit_kerja_id' => $lp3m?->id,
                'nomor_sk' => 'SK Ketua LP3M No. 015/LP3M/I/2025',
                'tanggal_berlaku' => '2025-01-15',
                'versi' => '1.0',
                'is_public' => false,
                'keterangan' => 'Formulir resmi tindak lanjut temuan audit oleh Auditee.',
            ],
        ];

        foreach ($dokumens as $dok) {
            DokumenMutu::updateOrCreate(['kode_dokumen' => $dok['kode_dokumen']], $dok);
        }

        // Sample Capaian Indikator untuk Tahun Akademik Aktif
        $activeYear = TahunAkademik::active() ?? TahunAkademik::first();
        $prodiS1 = ProgramStudi::where('kode', 'S1-PAH')->first();
        $ind1 = IndikatorMutu::where('kode', 'IND-SKL-01')->first();
        $ind2 = IndikatorMutu::where('kode', 'IND-SKL-02')->first();

        if ($activeYear && $prodiS1 && $ind1) {
            CapaianIndikator::updateOrCreate(
                [
                    'indikator_mutu_id' => $ind1->id,
                    'tahun_akademik_id' => $activeYear->id,
                    'program_studi_id' => $prodiS1->id,
                ],
                [
                    'unit_kerja_id' => null,
                    'realisasi' => '3.38',
                    'status_capaian' => 'Terlampaui',
                    'analisis_capaian' => 'IPK lulusan melampaui target standar (3.38 dari target 3.25) berkat perbaikan bimbingan akademik dan penguatan kurikulum OBE.',
                    'akar_masalah' => null,
                    'rencana_tindak_lanjut' => 'Pertahankan dan tingkatkan target standar menjadi 3.30 pada siklus revisi berikutnya.',
                ]
            );
        }

        if ($activeYear && $prodiS1 && $ind2) {
            CapaianIndikator::updateOrCreate(
                [
                    'indikator_mutu_id' => $ind2->id,
                    'tahun_akademik_id' => $activeYear->id,
                    'program_studi_id' => $prodiS1->id,
                ],
                [
                    'unit_kerja_id' => null,
                    'realisasi' => '72',
                    'status_capaian' => 'Belum Tercapai',
                    'analisis_capaian' => 'Kelulusan tepat waktu baru mencapai 72% dari target 75%.',
                    'akar_masalah' => 'Sebagian mahasiswa terhambat penyusunan skripsi pada tahap pengumpulan data lapangan.',
                    'rencana_tindak_lanjut' => 'Program klinik skripsi intensif dan monitoring bulanan progress tugas akhir oleh Kaprodi.',
                ]
            );
        }
    }
}

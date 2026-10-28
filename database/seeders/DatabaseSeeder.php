<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\ProfilInstitusi;
use App\Models\ProgramStudi;
use App\Models\Role;
use App\Models\TahunAkademik;
use App\Models\UnitKerja;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Roles
        $rolesData = [
            [
                'name' => 'super_admin',
                'display_name' => 'Super Administrator',
                'description' => 'Akses penuh ke seluruh konfigurasi, master data, dan modul sistem LP3M.',
            ],
            [
                'name' => 'ketua_lp3m',
                'display_name' => 'Ketua LP3M',
                'description' => 'Eksekutif mutu, approval audit, review kebijakan SPMI, dan laporan pimpinan.',
            ],
            [
                'name' => 'sekretaris_lp3m',
                'display_name' => 'Sekretaris LP3M',
                'description' => 'Operasional mutu, jadwal audit, penatausahaan dokumen SPMI dan disposisi.',
            ],
            [
                'name' => 'auditor',
                'display_name' => 'Auditor Internal',
                'description' => 'Pelaksana Audit Mutu Internal (AMI), input temuan KTS/OB, dan verifikasi PTK.',
            ],
            [
                'name' => 'kaprodi',
                'display_name' => 'Ketua Program Studi',
                'description' => 'Auditee mutu, pengisi LED prodi, penindaklanjut temuan audit, monev prodi.',
            ],
            [
                'name' => 'dosen',
                'display_name' => 'Dosen',
                'description' => 'Pelaksana standar tridharma, evaluasi perkuliahan, peserta pelatihan mutu.',
            ],
            [
                'name' => 'mahasiswa',
                'display_name' => 'Mahasiswa / Alumni',
                'description' => 'Responden survei kepuasan, evaluasi dosen (EDOM), dan tracer study.',
            ],
        ];

        $roles = [];
        foreach ($rolesData as $r) {
            $roles[$r['name']] = Role::updateOrCreate(['name' => $r['name']], $r);
        }

        // 2. Permissions
        $permissionsData = [
            // Dashboard
            ['name' => 'dashboard.view', 'display_name' => 'Lihat Dashboard', 'group' => 'Dashboard'],
            ['name' => 'dashboard.executive', 'display_name' => 'Lihat Dashboard Eksekutif', 'group' => 'Dashboard'],

            // SPMI
            ['name' => 'spmi.view', 'display_name' => 'Lihat Standar Mutu SPMI', 'group' => 'SPMI'],
            ['name' => 'spmi.manage', 'display_name' => 'Kelola Standar Mutu SPMI', 'group' => 'SPMI'],

            // AMI
            ['name' => 'ami.view', 'display_name' => 'Lihat Pelaksanaan AMI', 'group' => 'AMI'],
            ['name' => 'ami.audit', 'display_name' => 'Melakukan Audit Mutu', 'group' => 'AMI'],
            ['name' => 'ami.respond', 'display_name' => 'Mengisi Respon Temuan Audit (Auditee)', 'group' => 'AMI'],
            ['name' => 'ami.manage', 'display_name' => 'Kelola Periode & Plotting AMI', 'group' => 'AMI'],

            // Akreditasi
            ['name' => 'akreditasi.view', 'display_name' => 'Lihat Dokumen Akreditasi', 'group' => 'Akreditasi'],
            ['name' => 'akreditasi.manage', 'display_name' => 'Kelola Data & LED Akreditasi', 'group' => 'Akreditasi'],

            // Survei & Tracer
            ['name' => 'survei.view', 'display_name' => 'Lihat Hasil Survei', 'group' => 'Survei'],
            ['name' => 'survei.fill', 'display_name' => 'Mengisi Kuesioner Survei', 'group' => 'Survei'],
            ['name' => 'survei.manage', 'display_name' => 'Kelola Instrumen Kuesioner', 'group' => 'Survei'],

            // Dokumen
            ['name' => 'dokumen.view', 'display_name' => 'Unduh Dokumen Mutu', 'group' => 'Dokumen'],
            ['name' => 'dokumen.manage', 'display_name' => 'Upload & Kelola Repositori Dokumen', 'group' => 'Dokumen'],

            // Master Data
            ['name' => 'master.manage', 'display_name' => 'Kelola Data Master & Konfigurasi', 'group' => 'Master Data'],
            ['name' => 'users.manage', 'display_name' => 'Kelola Pengguna & Hak Akses', 'group' => 'Master Data'],
        ];

        foreach ($permissionsData as $p) {
            $perm = Permission::updateOrCreate(['name' => $p['name']], $p);
            $roles['super_admin']->permissions()->syncWithoutDetaching([$perm->id]);
            $roles['ketua_lp3m']->permissions()->syncWithoutDetaching([$perm->id]);
        }

        // 3. Program Studi STAH DNJ
        $prodis = [
            [
                'kode' => 'S1-PAH',
                'nama' => 'S-1 Pendidikan Agama Hindu',
                'jenjang' => 'S1',
                'fakultas' => 'Jurusan Dharma Acarya',
                'kaprodi_nama' => 'Ni Wayan Sudarmini, M.Pd.H.',
                'akreditasi' => 'Baik Sekali',
                'sk_akreditasi' => 'SK BAN-PT No. 1294/SK/BAN-PT/Ak/S/IV/2023',
                'is_active' => true,
            ],
            [
                'kode' => 'S2-PAH',
                'nama' => 'S-2 Pendidikan Agama Hindu',
                'jenjang' => 'S2',
                'fakultas' => 'Program Pascasarjana',
                'kaprodi_nama' => 'Dr. I Nyoman Alit Putrawan, S.Ag., M.Fil.H.',
                'akreditasi' => 'Baik Sekali',
                'sk_akreditasi' => 'SK BAN-PT No. 3482/SK/BAN-PT/Ak/M/IX/2023',
                'is_active' => true,
            ],
            [
                'kode' => 'S1-IKH',
                'nama' => 'S-1 Ilmu Komunikasi Hindu',
                'jenjang' => 'S1',
                'fakultas' => 'Jurusan Brahma Widya',
                'kaprodi_nama' => 'I Made Awanita, S.Ag., M.Pd.H.',
                'akreditasi' => 'Baik',
                'sk_akreditasi' => 'SK BAN-PT No. 892/SK/BAN-PT/Ak/S/III/2024',
                'is_active' => true,
            ],
        ];

        $prodiModels = [];
        foreach ($prodis as $item) {
            $prodiModels[$item['kode']] = ProgramStudi::updateOrCreate(['kode' => $item['kode']], $item);
        }

        // 4. Unit Kerja STAH DNJ
        $units = [
            [
                'kode' => 'LP3M',
                'nama' => 'Lembaga Penjaminan Mutu & Pengembangan Pembelajaran',
                'tipe' => 'Lembaga',
                'kepala_nama' => 'Dr. I Nyoman Yoga, M.Pd.H.',
                'email' => 'lp3m@stahdnj.ac.id',
                'is_active' => true,
            ],
            [
                'kode' => 'REKTORAT',
                'nama' => 'Pimpinan & Sekretariat Ketua Kampus',
                'tipe' => 'Pimpinan',
                'kepala_nama' => 'Prof. Dr. I Made Kartika, S.Ag., M.Fil.H.',
                'email' => 'ketua@stahdnj.ac.id',
                'is_active' => true,
            ],
            [
                'kode' => 'BAK',
                'nama' => 'Biro Administrasi Akademik & Kemahasiswaan',
                'tipe' => 'Biro',
                'kepala_nama' => 'I Ketut Suastika, S.Ag., M.Si.',
                'email' => 'akademik@stahdnj.ac.id',
                'is_active' => true,
            ],
            [
                'kode' => 'BUK',
                'nama' => 'Biro Administrasi Umum & Keuangan',
                'tipe' => 'Biro',
                'kepala_nama' => 'Ni Kadek Ayu, S.E., M.M.',
                'email' => 'keuangan@stahdnj.ac.id',
                'is_active' => true,
            ],
            [
                'kode' => 'P3M',
                'nama' => 'Pusat Penelitian & Pengabdian kepada Masyarakat',
                'tipe' => 'Pusat',
                'kepala_nama' => 'Dr. I Wayan Budi, M.Si.',
                'email' => 'p3m@stahdnj.ac.id',
                'is_active' => true,
            ],
            [
                'kode' => 'PERPUS',
                'nama' => 'Unit Pelaksana Teknis Perpustakaan',
                'tipe' => 'Unit Penunjang',
                'kepala_nama' => 'I Gusti Ngurah Oka, S.Sos.',
                'email' => 'perpustakaan@stahdnj.ac.id',
                'is_active' => true,
            ],
        ];

        $unitModels = [];
        foreach ($units as $item) {
            $unitModels[$item['kode']] = UnitKerja::updateOrCreate(['kode' => $item['kode']], $item);
        }

        // 5. Tahun Akademik
        $tahunAkademiks = [
            [
                'kode' => '2024/2025-GENAP',
                'tahun' => '2024/2025',
                'semester' => 'Genap',
                'tanggal_mulai' => '2025-02-01',
                'tanggal_selesai' => '2025-07-31',
                'is_active' => false,
            ],
            [
                'kode' => '2025/2026-GANJIL',
                'tahun' => '2025/2026',
                'semester' => 'Ganjil',
                'tanggal_mulai' => '2025-08-01',
                'tanggal_selesai' => '2026-01-31',
                'is_active' => false,
            ],
            [
                'kode' => '2025/2026-GENAP',
                'tahun' => '2025/2026',
                'semester' => 'Genap',
                'tanggal_mulai' => '2026-02-01',
                'tanggal_selesai' => '2026-07-31',
                'is_active' => true,
            ],
        ];

        foreach ($tahunAkademiks as $ta) {
            TahunAkademik::updateOrCreate(['kode' => $ta['kode']], $ta);
        }

        // 6. Profil Institusi
        ProfilInstitusi::current();

        // 7. Seed Default Users
        $users = [
            [
                'name' => 'Administrator LP3M',
                'email' => 'admin@stahdnj.ac.id',
                'password' => Hash::make('password'),
                'role_id' => $roles['super_admin']->id,
                'unit_kerja_id' => $unitModels['LP3M']->id,
                'nip_nim' => '198501012010011001',
                'phone' => '081234567890',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dr. I Nyoman Yoga, M.Pd.H.',
                'email' => 'ketua.lp3m@stahdnj.ac.id',
                'password' => Hash::make('password'),
                'role_id' => $roles['ketua_lp3m']->id,
                'unit_kerja_id' => $unitModels['LP3M']->id,
                'nip_nim' => '197805122005011002',
                'phone' => '081234567891',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'I Ketut Budiawan, M.Fil.H.',
                'email' => 'auditor@stahdnj.ac.id',
                'password' => Hash::make('password'),
                'role_id' => $roles['auditor']->id,
                'unit_kerja_id' => $unitModels['LP3M']->id,
                'nip_nim' => '198203152008121003',
                'phone' => '081234567892',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Ni Wayan Sudarmini, M.Pd.H.',
                'email' => 'kaprodi.pah@stahdnj.ac.id',
                'password' => Hash::make('password'),
                'role_id' => $roles['kaprodi']->id,
                'program_studi_id' => $prodiModels['S1-PAH']->id,
                'nip_nim' => '198608242014032001',
                'phone' => '081234567893',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'I Gede Suardana, S.Ag., M.Pd.H.',
                'email' => 'dosen@stahdnj.ac.id',
                'password' => Hash::make('password'),
                'role_id' => $roles['dosen']->id,
                'program_studi_id' => $prodiModels['S1-PAH']->id,
                'nip_nim' => '199011052019031005',
                'phone' => '081234567894',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $u) {
            User::updateOrCreate(['email' => $u['email']], $u);
        }

        // Call Module Seeders (Fase 2 - 6)
        $this->call([
            SpmiSeeder::class,
            AmiAkreditasiSeeder::class,
            SurveiTracerSeeder::class,
            MonevPelatihanSeeder::class,
            LaporanSuratRtmSeeder::class,
        ]);
    }
}

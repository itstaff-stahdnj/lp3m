<?php

use App\Http\Controllers\Akreditasi\KriteriaAkreditasiController;
use App\Http\Controllers\Ami\JadwalAuditController;
use App\Http\Controllers\Ami\PeriodeAuditController;
use App\Http\Controllers\Ami\TemuanAuditController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Laporan\LaporanTahunanController;
use App\Http\Controllers\Laporan\RtmController;
use App\Http\Controllers\Laporan\SuratMutuController;
use App\Http\Controllers\Master\ProfilInstitusiController;
use App\Http\Controllers\Master\ProgramStudiController;
use App\Http\Controllers\Master\TahunAkademikController;
use App\Http\Controllers\Master\UnitKerjaController;
use App\Http\Controllers\Master\UserController;
use App\Http\Controllers\Monev\MonevIkuController;
use App\Http\Controllers\Pelatihan\PelatihanController;
use App\Http\Controllers\Spmi\DokumenMutuController;
use App\Http\Controllers\Spmi\EvaluasiSpmiController;
use App\Http\Controllers\Spmi\IndikatorMutuController;
use App\Http\Controllers\Spmi\StandarMutuController;
use App\Http\Controllers\Survei\KuesionerController;
use App\Http\Controllers\Tracer\TracerStudyController;
use App\Models\ProfilInstitusi;
use App\Models\ProgramStudi;
use App\Models\TahunAkademik;
use App\Models\UnitKerja;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $institution = ProfilInstitusi::current();
    $activeYear = TahunAkademik::active();
    $prodis = ProgramStudi::where('is_active', true)->orderBy('jenjang')->orderBy('nama')->get();
    $totalUnits = UnitKerja::where('is_active', true)->count();

    return Inertia::render('welcome', [
        'institution' => $institution,
        'activeYear' => $activeYear,
        'prodis' => $prodis,
        'totalUnits' => $totalUnits,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Data Master
    Route::prefix('master')->name('master.')->group(function () {
        // Program Studi
        Route::get('prodi', [ProgramStudiController::class, 'index'])->name('prodi.index');
        Route::post('prodi', [ProgramStudiController::class, 'store'])->name('prodi.store');
        Route::put('prodi/{prodi}', [ProgramStudiController::class, 'update'])->name('prodi.update');
        Route::delete('prodi/{prodi}', [ProgramStudiController::class, 'destroy'])->name('prodi.destroy');

        // Unit Kerja
        Route::get('unit-kerja', [UnitKerjaController::class, 'index'])->name('unit-kerja.index');
        Route::post('unit-kerja', [UnitKerjaController::class, 'store'])->name('unit-kerja.store');
        Route::put('unit-kerja/{unitKerja}', [UnitKerjaController::class, 'update'])->name('unit-kerja.update');
        Route::delete('unit-kerja/{unitKerja}', [UnitKerjaController::class, 'destroy'])->name('unit-kerja.destroy');

        // Tahun Akademik
        Route::get('tahun-akademik', [TahunAkademikController::class, 'index'])->name('tahun-akademik.index');
        Route::post('tahun-akademik', [TahunAkademikController::class, 'store'])->name('tahun-akademik.store');
        Route::put('tahun-akademik/{tahunAkademik}', [TahunAkademikController::class, 'update'])->name('tahun-akademik.update');
        Route::post('tahun-akademik/{tahunAkademik}/activate', [TahunAkademikController::class, 'activate'])->name('tahun-akademik.activate');
        Route::delete('tahun-akademik/{tahunAkademik}', [TahunAkademikController::class, 'destroy'])->name('tahun-akademik.destroy');

        // Profil Institusi
        Route::get('profil', [ProfilInstitusiController::class, 'index'])->name('profil.index');
        Route::put('profil', [ProfilInstitusiController::class, 'update'])->name('profil.update');

        // Manajemen Pengguna
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });

    // Modul SPMI (Fase 2)
    Route::prefix('spmi')->name('spmi.')->group(function () {
        // Standar Mutu
        Route::get('standar', [StandarMutuController::class, 'index'])->name('standar.index');
        Route::post('standar', [StandarMutuController::class, 'store'])->name('standar.store');
        Route::get('standar/{standar}', [StandarMutuController::class, 'show'])->name('standar.show');
        Route::put('standar/{standar}', [StandarMutuController::class, 'update'])->name('standar.update');
        Route::delete('standar/{standar}', [StandarMutuController::class, 'destroy'])->name('standar.destroy');

        // Indikator Mutu
        Route::post('standar/{standar}/indikator', [IndikatorMutuController::class, 'store'])->name('indikator.store');
        Route::put('indikator/{indikator}', [IndikatorMutuController::class, 'update'])->name('indikator.update');
        Route::delete('indikator/{indikator}', [IndikatorMutuController::class, 'destroy'])->name('indikator.destroy');

        // Evaluasi Diri & Analisis Gap Capaian
        Route::get('evaluasi', [EvaluasiSpmiController::class, 'index'])->name('evaluasi.index');
        Route::post('evaluasi', [EvaluasiSpmiController::class, 'storeOrUpdate'])->name('evaluasi.store');

        // Repositori Dokumen Mutu
        Route::get('dokumen', [DokumenMutuController::class, 'index'])->name('dokumen.index');
        Route::post('dokumen', [DokumenMutuController::class, 'store'])->name('dokumen.store');
        Route::put('dokumen/{dokumen}', [DokumenMutuController::class, 'update'])->name('dokumen.update');
        Route::delete('dokumen/{dokumen}', [DokumenMutuController::class, 'destroy'])->name('dokumen.destroy');
    });

    // Modul Audit Mutu Internal (AMI - Fase 3)
    Route::prefix('ami')->name('ami.')->group(function () {
        // Periode Audit
        Route::get('periode', [PeriodeAuditController::class, 'index'])->name('periode.index');
        Route::post('periode', [PeriodeAuditController::class, 'store'])->name('periode.store');
        Route::put('periode/{periode}', [PeriodeAuditController::class, 'update'])->name('periode.update');
        Route::delete('periode/{periode}', [PeriodeAuditController::class, 'destroy'])->name('periode.destroy');

        // Jadwal & Visitasi Audit
        Route::get('jadwal', [JadwalAuditController::class, 'index'])->name('jadwal.index');
        Route::post('jadwal', [JadwalAuditController::class, 'store'])->name('jadwal.store');
        Route::get('jadwal/{jadwal}', [JadwalAuditController::class, 'show'])->name('jadwal.show');
        Route::put('jadwal/{jadwal}', [JadwalAuditController::class, 'update'])->name('jadwal.update');
        Route::delete('jadwal/{jadwal}', [JadwalAuditController::class, 'destroy'])->name('jadwal.destroy');

        // Temuan Audit & PTK
        Route::get('temuan', [TemuanAuditController::class, 'index'])->name('temuan.index');
        Route::post('jadwal/{jadwal}/temuan', [TemuanAuditController::class, 'store'])->name('temuan.store');
        Route::put('temuan/{temuan}/ptk', [TemuanAuditController::class, 'updatePtk'])->name('temuan.ptk');
        Route::put('temuan/{temuan}/verify', [TemuanAuditController::class, 'verifyClosing'])->name('temuan.verify');
    });

    // Modul Akreditasi & 9 Kriteria (Fase 3)
    Route::prefix('akreditasi')->name('akreditasi.')->group(function () {
        Route::get('/', [KriteriaAkreditasiController::class, 'index'])->name('index');
        Route::post('simulasi', [KriteriaAkreditasiController::class, 'saveSimulasi'])->name('simulasi.store');
    });

    // Modul Survei Kepuasan & EDOM (Fase 4)
    Route::prefix('survei')->name('survei.')->group(function () {
        Route::get('kuesioner', [KuesionerController::class, 'index'])->name('kuesioner.index');
        Route::post('kuesioner', [KuesionerController::class, 'store'])->name('kuesioner.store');
        Route::get('kuesioner/{kuesioner}', [KuesionerController::class, 'show'])->name('kuesioner.show');
        Route::put('kuesioner/{kuesioner}', [KuesionerController::class, 'update'])->name('kuesioner.update');
        Route::delete('kuesioner/{kuesioner}', [KuesionerController::class, 'destroy'])->name('kuesioner.destroy');

        // Butir Pertanyaan
        Route::post('kuesioner/{kuesioner}/pertanyaan', [KuesionerController::class, 'storePertanyaan'])->name('pertanyaan.store');
        Route::delete('pertanyaan/{pertanyaan}', [KuesionerController::class, 'destroyPertanyaan'])->name('pertanyaan.destroy');

        // Pengisian Kuesioner
        Route::get('kuesioner/{kuesioner}/isi', [KuesionerController::class, 'fill'])->name('kuesioner.fill');
        Route::post('kuesioner/{kuesioner}/submit', [KuesionerController::class, 'submit'])->name('kuesioner.submit');
    });

    // Modul Tracer Study Alumni (Fase 4)
    Route::prefix('tracer')->name('tracer.')->group(function () {
        Route::get('/', [TracerStudyController::class, 'index'])->name('index');
        Route::post('/', [TracerStudyController::class, 'store'])->name('store');
        Route::put('{tracer}', [TracerStudyController::class, 'update'])->name('update');
        Route::delete('{tracer}', [TracerStudyController::class, 'destroy'])->name('destroy');
    });

    // Modul Monev Tridharma & IKU (Fase 5)
    Route::prefix('monev')->name('monev.')->group(function () {
        Route::get('iku', [MonevIkuController::class, 'index'])->name('iku.index');
        Route::post('iku/capaian', [MonevIkuController::class, 'saveCapaian'])->name('iku.save');
    });

    // Modul Pelatihan & Sertifikat SDM (Fase 5)
    Route::prefix('pelatihan')->name('pelatihan.')->group(function () {
        Route::get('/', [PelatihanController::class, 'index'])->name('index');
        Route::post('/', [PelatihanController::class, 'store'])->name('store');
        Route::get('{pelatihan}', [PelatihanController::class, 'show'])->name('show');
        Route::put('{pelatihan}', [PelatihanController::class, 'update'])->name('update');
        Route::delete('{pelatihan}', [PelatihanController::class, 'destroy'])->name('destroy');

        // Peserta & Sertifikat
        Route::post('{pelatihan}/register', [PelatihanController::class, 'registerPeserta'])->name('peserta.register');
        Route::put('peserta/{peserta}', [PelatihanController::class, 'updatePeserta'])->name('peserta.update');
    });

    // Modul Laporan Kinerja Mutu Tahunan & RTM (Fase 6)
    Route::prefix('laporan')->name('laporan.')->group(function () {
        Route::get('/', [LaporanTahunanController::class, 'index'])->name('index');
        Route::post('/', [LaporanTahunanController::class, 'store'])->name('store');

        // Rapat Tinjauan Manajemen (RTM)
        Route::get('rtm', [RtmController::class, 'index'])->name('rtm.index');
        Route::post('rtm', [RtmController::class, 'store'])->name('rtm.store');
        Route::put('rtm/{rtm}', [RtmController::class, 'update'])->name('rtm.update');
        Route::delete('rtm/{rtm}', [RtmController::class, 'destroy'])->name('rtm.destroy');

        // Tindak Lanjut RTM
        Route::post('rtm/{rtm}/tindak-lanjut', [RtmController::class, 'storeTindakLanjut'])->name('rtm.tindak-lanjut.store');
        Route::put('rtm/tindak-lanjut/{tindakLanjut}', [RtmController::class, 'updateTindakLanjut'])->name('rtm.tindak-lanjut.update');
        Route::delete('rtm/tindak-lanjut/{tindakLanjut}', [RtmController::class, 'destroyTindakLanjut'])->name('rtm.tindak-lanjut.destroy');
    });

    // Modul Surat Mutu & E-Sertifikat (Fase 6)
    Route::prefix('surat')->name('surat.')->group(function () {
        Route::get('/', [SuratMutuController::class, 'index'])->name('index');
        Route::post('/', [SuratMutuController::class, 'store'])->name('store');
        Route::put('{surat}', [SuratMutuController::class, 'update'])->name('update');
        Route::delete('{surat}', [SuratMutuController::class, 'destroy'])->name('destroy');
    });
});

// Verifikasi Publik Keaslian Surat Mutu & Sertifikat via QR Code (Fase 6)
Route::get('verifikasi-surat/{token}', [SuratMutuController::class, 'verifyPublic'])->name('surat.verify');

require __DIR__.'/settings.php';

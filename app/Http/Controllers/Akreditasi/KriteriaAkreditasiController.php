<?php

namespace App\Http\Controllers\Akreditasi;

use App\Http\Controllers\Controller;
use App\Models\KriteriaAkreditasi;
use App\Models\ProgramStudi;
use App\Models\SimulasiAkreditasi;
use App\Models\TahunAkademik;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KriteriaAkreditasiController extends Controller
{
    public function index(Request $request): Response
    {
        $prodiId = $request->query('prodi_id');
        $prodis = ProgramStudi::where('is_active', true)->orderBy('nama')->get();
        $activeProdi = $prodiId ? ProgramStudi::find($prodiId) : $prodis->first();

        $activeYear = TahunAkademik::active() ?? TahunAkademik::first();

        $kriterias = KriteriaAkreditasi::orderBy('nomor')->get();

        $simulasi = null;
        if ($activeProdi && $activeYear) {
            $simulasi = SimulasiAkreditasi::where('program_studi_id', $activeProdi->id)
                ->where('tahun_akademik_id', $activeYear->id)
                ->first();
        }

        return Inertia::render('akreditasi/index', [
            'kriterias' => $kriterias,
            'prodis' => $prodis,
            'activeProdi' => $activeProdi,
            'activeYear' => $activeYear,
            'simulasi' => $simulasi,
        ]);
    }

    public function saveSimulasi(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'program_studi_id' => ['required', 'exists:program_studis,id'],
            'tahun_akademik_id' => ['required', 'exists:tahun_akademiks,id'],
            'instrumen' => ['required', 'string'],
            'rincian_skor' => ['required', 'array'],
            'catatan_evaluator' => ['nullable', 'string'],
        ]);

        // Hitung total skor berbobot (skala 0 - 400)
        // Tiap kriteria skor 1.00 - 4.00 dikalikan bobot persentase
        $rincian = $validated['rincian_skor'];
        $kriterias = KriteriaAkreditasi::all()->keyBy('kode');

        $totalSkor = 0;
        foreach ($rincian as $kode => $nilai) {
            $bobot = $kriterias[$kode]->bobot_default ?? 10.0;
            $totalSkor += (floatval($nilai) * floatval($bobot));
        }

        // Tentukan predikat akreditasi
        if ($totalSkor >= 361) {
            $predikat = 'Unggul';
        } elseif ($totalSkor >= 301) {
            $predikat = 'Baik Sekali';
        } elseif ($totalSkor >= 200) {
            $predikat = 'Baik';
        } else {
            $predikat = 'Tidak Terakreditasi';
        }

        SimulasiAkreditasi::updateOrCreate(
            [
                'program_studi_id' => $validated['program_studi_id'],
                'tahun_akademik_id' => $validated['tahun_akademik_id'],
            ],
            [
                'instrumen' => $validated['instrumen'],
                'total_skor' => round($totalSkor, 2),
                'predikat_proyeksi' => $predikat,
                'rincian_skor_json' => $rincian,
                'catatan_evaluator' => $validated['catatan_evaluator'] ?? null,
            ]
        );

        return back()->with('success', "Simulasi skor akreditasi berhasil disimpan dengan proyeksi: {$predikat} (Skor: ".round($totalSkor, 2).')');
    }
}

<?php

namespace App\Http\Controllers\Survei;

use App\Http\Controllers\Controller;
use App\Models\Kuesioner;
use App\Models\PertanyaanKuesioner;
use App\Models\ProgramStudi;
use App\Models\ResponSurvei;
use App\Models\TahunAkademik;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KuesionerController extends Controller
{
    public function index(): Response
    {
        $kuesioners = Kuesioner::with(['tahunAkademik', 'creator'])
            ->withCount(['pertanyaans', 'respons'])
            ->orderByDesc('created_at')
            ->get();

        $tahunAkademiks = TahunAkademik::orderByDesc('kode')->get();

        $stats = [
            'total_kuesioner' => $kuesioners->count(),
            'active_kuesioner' => $kuesioners->where('is_active', true)->count(),
            'total_respons' => ResponSurvei::count(),
            'edom_count' => $kuesioners->where('tipe', 'EDOM')->count(),
            'kepuasan_count' => $kuesioners->where('tipe', '!=', 'EDOM')->count(),
        ];

        return Inertia::render('survei/kuesioner/index', [
            'kuesioners' => $kuesioners,
            'tahunAkademiks' => $tahunAkademiks,
            'stats' => $stats,
        ]);
    }

    public function show(Kuesioner $kuesioner): Response
    {
        $kuesioner->load([
            'tahunAkademik',
            'creator',
            'pertanyaans',
            'respons.dosen',
            'respons.programStudi',
            'respons.user',
        ]);

        $dosens = User::whereHas('role', fn ($q) => $q->where('name', 'dosen'))->orderBy('name')->get();
        $prodis = ProgramStudi::where('is_active', true)->orderBy('nama')->get();

        // Hitung rata-rata skor keseluruhan dan per aspek
        $respons = $kuesioner->respons;
        $avgScore = $respons->count() > 0 ? round($respons->avg('skor_rata_rata'), 2) : 0;

        return Inertia::render('survei/kuesioner/show', [
            'kuesioner' => $kuesioner,
            'dosens' => $dosens,
            'prodis' => $prodis,
            'avgScore' => $avgScore,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:50', 'unique:kuesioners,kode'],
            'judul' => ['required', 'string', 'max:255'],
            'tipe' => ['required', 'in:EDOM,KepuasanMahasiswa,KepuasanDosen,KepuasanTendik,KepuasanMitra'],
            'deskripsi' => ['nullable', 'string'],
            'tahun_akademik_id' => ['required', 'exists:tahun_akademiks,id'],
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'target_role' => ['required', 'string', 'max:50'],
            'is_active' => ['boolean'],
        ]);

        $validated['created_by'] = auth()->id();

        Kuesioner::create($validated);

        return back()->with('success', 'Instrumen kuesioner berhasil dibuat.');
    }

    public function update(Request $request, Kuesioner $kuesioner): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'is_active' => ['boolean'],
        ]);

        $kuesioner->update($validated);

        return back()->with('success', 'Instrumen kuesioner berhasil diperbarui.');
    }

    public function destroy(Kuesioner $kuesioner): RedirectResponse
    {
        $kuesioner->delete();

        return redirect()->route('survei.kuesioner.index')->with('success', 'Instrumen kuesioner berhasil dihapus.');
    }

    public function storePertanyaan(Request $request, Kuesioner $kuesioner): RedirectResponse
    {
        $validated = $request->validate([
            'nomor_urut' => ['required', 'integer'],
            'aspek' => ['required', 'string', 'max:100'],
            'teks_pertanyaan' => ['required', 'string'],
            'tipe_jawaban' => ['required', 'in:skala_4,skala_5,teks,pilihan'],
        ]);

        $validated['kuesioner_id'] = $kuesioner->id;

        PertanyaanKuesioner::create($validated);

        return back()->with('success', 'Butir pertanyaan berhasil ditambahkan.');
    }

    public function destroyPertanyaan(PertanyaanKuesioner $pertanyaan): RedirectResponse
    {
        $pertanyaan->delete();

        return back()->with('success', 'Butir pertanyaan berhasil dihapus.');
    }

    public function fill(Kuesioner $kuesioner): Response
    {
        $kuesioner->load(['pertanyaans', 'tahunAkademik']);
        $dosens = User::whereHas('role', fn ($q) => $q->where('name', 'dosen'))->orderBy('name')->get();
        $prodis = ProgramStudi::where('is_active', true)->orderBy('nama')->get();

        return Inertia::render('survei/kuesioner/fill', [
            'kuesioner' => $kuesioner,
            'dosens' => $dosens,
            'prodis' => $prodis,
        ]);
    }

    public function submit(Request $request, Kuesioner $kuesioner): RedirectResponse
    {
        $validated = $request->validate([
            'jawaban' => ['required', 'array'],
            'dosen_id' => ['nullable', 'exists:users,id'],
            'mata_kuliah' => ['nullable', 'string', 'max:255'],
            'program_studi_id' => ['nullable', 'exists:program_studis,id'],
            'saran_masukan' => ['nullable', 'string'],
        ]);

        // Hitung rata-rata nilai skala
        $jawaban = $validated['jawaban'];
        $numericValues = array_filter($jawaban, fn ($val) => is_numeric($val));
        $avg = count($numericValues) > 0 ? array_sum($numericValues) / count($numericValues) : 0;

        ResponSurvei::create([
            'kuesioner_id' => $kuesioner->id,
            'user_id' => auth()->id(),
            'dosen_id' => $validated['dosen_id'] ?? null,
            'mata_kuliah' => $validated['mata_kuliah'] ?? null,
            'program_studi_id' => $validated['program_studi_id'] ?? null,
            'skor_rata_rata' => round($avg, 2),
            'jawaban_json' => $jawaban,
            'saran_masukan' => $validated['saran_masukan'] ?? null,
        ]);

        return redirect()->route('survei.kuesioner.show', $kuesioner->id)->with('success', 'Terima kasih, kuesioner evaluasi berhasil dikirim!');
    }
}

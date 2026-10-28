<?php

namespace App\Http\Controllers\Spmi;

use App\Http\Controllers\Controller;
use App\Models\StandarMutu;
use App\Models\UnitKerja;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StandarMutuController extends Controller
{
    public function index(Request $request): Response
    {
        $kategori = $request->query('kategori');

        $query = StandarMutu::with(['penanggungJawabUnit', 'indikators'])
            ->withCount(['indikators', 'dokumens'])
            ->orderBy('urutan')
            ->orderBy('kode');

        if ($kategori && in_array($kategori, ['Pendidikan', 'Penelitian', 'Pengabdian', 'Tambahan'])) {
            $query->where('kategori', $kategori);
        }

        $standars = $query->get();
        $unitKerjas = UnitKerja::where('is_active', true)->orderBy('nama')->get();

        $stats = [
            'total' => StandarMutu::count(),
            'pendidikan' => StandarMutu::where('kategori', 'Pendidikan')->count(),
            'penelitian' => StandarMutu::where('kategori', 'Penelitian')->count(),
            'pengabdian' => StandarMutu::where('kategori', 'Pengabdian')->count(),
            'tambahan' => StandarMutu::where('kategori', 'Tambahan')->count(),
        ];

        return Inertia::render('spmi/standar/index', [
            'standars' => $standars,
            'unitKerjas' => $unitKerjas,
            'stats' => $stats,
            'currentKategori' => $kategori ?? 'all',
        ]);
    }

    public function show(StandarMutu $standar): Response
    {
        $standar->load([
            'penanggungJawabUnit',
            'indikators.capaians.tahunAkademik',
            'indikators.capaians.programStudi',
            'dokumens',
        ]);

        return Inertia::render('spmi/standar/show', [
            'standar' => $standar,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:50', 'unique:standar_mutus,kode'],
            'nama' => ['required', 'string', 'max:255'],
            'kategori' => ['required', 'in:Pendidikan,Penelitian,Pengabdian,Tambahan'],
            'deskripsi' => ['nullable', 'string'],
            'kriteria_akreditasi' => ['nullable', 'string', 'max:100'],
            'penanggung_jawab_unit_id' => ['nullable', 'exists:unit_kerjas,id'],
            'urutan' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        StandarMutu::create($validated);

        return back()->with('success', 'Standar Mutu berhasil ditambahkan.');
    }

    public function update(Request $request, StandarMutu $standar): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:50', 'unique:standar_mutus,kode,'.$standar->id],
            'nama' => ['required', 'string', 'max:255'],
            'kategori' => ['required', 'in:Pendidikan,Penelitian,Pengabdian,Tambahan'],
            'deskripsi' => ['nullable', 'string'],
            'kriteria_akreditasi' => ['nullable', 'string', 'max:100'],
            'penanggung_jawab_unit_id' => ['nullable', 'exists:unit_kerjas,id'],
            'urutan' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $standar->update($validated);

        return back()->with('success', 'Standar Mutu berhasil diperbarui.');
    }

    public function destroy(StandarMutu $standar): RedirectResponse
    {
        $standar->delete();

        return back()->with('success', 'Standar Mutu berhasil dihapus.');
    }
}

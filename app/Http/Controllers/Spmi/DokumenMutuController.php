<?php

namespace App\Http\Controllers\Spmi;

use App\Http\Controllers\Controller;
use App\Models\DokumenMutu;
use App\Models\StandarMutu;
use App\Models\UnitKerja;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DokumenMutuController extends Controller
{
    public function index(Request $request): Response
    {
        $kategori = $request->query('kategori');

        $query = DokumenMutu::with(['standarMutu', 'unitKerja'])
            ->orderBy('kategori')
            ->orderByDesc('tanggal_berlaku');

        if ($kategori && $kategori !== 'all') {
            $query->where('kategori', $kategori);
        }

        $dokumens = $query->get();
        $standars = StandarMutu::where('is_active', true)->orderBy('kode')->get();
        $unitKerjas = UnitKerja::where('is_active', true)->orderBy('nama')->get();

        $stats = [
            'total' => DokumenMutu::count(),
            'kebijakan' => DokumenMutu::where('kategori', 'Kebijakan')->count(),
            'manual' => DokumenMutu::where('kategori', 'Manual')->count(),
            'standar' => DokumenMutu::where('kategori', 'Standar')->count(),
            'sop' => DokumenMutu::where('kategori', 'SOP')->count(),
            'formulir' => DokumenMutu::where('kategori', 'Formulir')->count(),
        ];

        return Inertia::render('spmi/dokumen/index', [
            'dokumens' => $dokumens,
            'standars' => $standars,
            'unitKerjas' => $unitKerjas,
            'stats' => $stats,
            'currentKategori' => $kategori ?? 'all',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode_dokumen' => ['required', 'string', 'max:100', 'unique:dokumen_mutus,kode_dokumen'],
            'nama' => ['required', 'string', 'max:255'],
            'kategori' => ['required', 'in:Kebijakan,Manual,Standar,SOP,Formulir,Laporan,Lainnya'],
            'standar_mutu_id' => ['nullable', 'exists:standar_mutus,id'],
            'unit_kerja_id' => ['nullable', 'exists:unit_kerjas,id'],
            'nomor_sk' => ['nullable', 'string', 'max:255'],
            'tanggal_berlaku' => ['nullable', 'date'],
            'versi' => ['string', 'max:20'],
            'file_path' => ['nullable', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string'],
            'is_public' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        DokumenMutu::create($validated);

        return back()->with('success', 'Dokumen Mutu berhasil ditambahkan ke repositori.');
    }

    public function update(Request $request, DokumenMutu $dokumen): RedirectResponse
    {
        $validated = $request->validate([
            'kode_dokumen' => ['required', 'string', 'max:100', 'unique:dokumen_mutus,kode_dokumen,'.$dokumen->id],
            'nama' => ['required', 'string', 'max:255'],
            'kategori' => ['required', 'in:Kebijakan,Manual,Standar,SOP,Formulir,Laporan,Lainnya'],
            'standar_mutu_id' => ['nullable', 'exists:standar_mutus,id'],
            'unit_kerja_id' => ['nullable', 'exists:unit_kerjas,id'],
            'nomor_sk' => ['nullable', 'string', 'max:255'],
            'tanggal_berlaku' => ['nullable', 'date'],
            'versi' => ['string', 'max:20'],
            'file_path' => ['nullable', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string'],
            'is_public' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        $dokumen->update($validated);

        return back()->with('success', 'Dokumen Mutu berhasil diperbarui.');
    }

    public function destroy(DokumenMutu $dokumen): RedirectResponse
    {
        $dokumen->delete();

        return back()->with('success', 'Dokumen Mutu berhasil dihapus.');
    }
}

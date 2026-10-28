<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\TahunAkademik;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TahunAkademikController extends Controller
{
    public function index(): Response
    {
        $tahunAkademiks = TahunAkademik::orderByDesc('tahun')->orderBy('semester')->get();

        return Inertia::render('master/tahun-akademik/index', [
            'tahunAkademiks' => $tahunAkademiks,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:50', 'unique:tahun_akademiks,kode'],
            'tahun' => ['required', 'string', 'max:20'],
            'semester' => ['required', 'string', 'in:Ganjil,Genap,Pendek'],
            'tanggal_mulai' => ['nullable', 'date'],
            'tanggal_selesai' => ['nullable', 'date'],
            'is_active' => ['boolean'],
        ]);

        if (! empty($validated['is_active'])) {
            TahunAkademik::query()->update(['is_active' => false]);
        }

        TahunAkademik::create($validated);

        return back()->with('success', 'Tahun Akademik berhasil ditambahkan.');
    }

    public function update(Request $request, TahunAkademik $tahunAkademik): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:50', 'unique:tahun_akademiks,kode,'.$tahunAkademik->id],
            'tahun' => ['required', 'string', 'max:20'],
            'semester' => ['required', 'string', 'in:Ganjil,Genap,Pendek'],
            'tanggal_mulai' => ['nullable', 'date'],
            'tanggal_selesai' => ['nullable', 'date'],
            'is_active' => ['boolean'],
        ]);

        if (! empty($validated['is_active'])) {
            TahunAkademik::where('id', '!=', $tahunAkademik->id)->update(['is_active' => false]);
        }

        $tahunAkademik->update($validated);

        return back()->with('success', 'Tahun Akademik berhasil diperbarui.');
    }

    public function activate(TahunAkademik $tahunAkademik): RedirectResponse
    {
        TahunAkademik::query()->update(['is_active' => false]);
        $tahunAkademik->update(['is_active' => true]);

        return back()->with('success', "Tahun Akademik {$tahunAkademik->tahun} {$tahunAkademik->semester} telah diaktifkan.");
    }

    public function destroy(TahunAkademik $tahunAkademik): RedirectResponse
    {
        $tahunAkademik->delete();

        return back()->with('success', 'Tahun Akademik berhasil dihapus.');
    }
}

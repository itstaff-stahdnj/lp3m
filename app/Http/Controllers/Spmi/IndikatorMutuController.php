<?php

namespace App\Http\Controllers\Spmi;

use App\Http\Controllers\Controller;
use App\Models\IndikatorMutu;
use App\Models\StandarMutu;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class IndikatorMutuController extends Controller
{
    public function store(Request $request, StandarMutu $standar): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:50', 'unique:indikator_mutus,kode'],
            'pernyataan' => ['required', 'string'],
            'target' => ['required', 'string', 'max:100'],
            'satuan' => ['required', 'string', 'max:50'],
            'baseline' => ['nullable', 'string', 'max:100'],
            'tipe_indikator' => ['required', 'in:Standar,IKU,IKT'],
            'metode_pengukuran' => ['nullable', 'string'],
            'bobot' => ['integer', 'min:1'],
            'is_active' => ['boolean'],
        ]);

        $standar->indikators()->create($validated);

        return back()->with('success', 'Indikator Mutu berhasil ditambahkan.');
    }

    public function update(Request $request, IndikatorMutu $indikator): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:50', 'unique:indikator_mutus,kode,'.$indikator->id],
            'pernyataan' => ['required', 'string'],
            'target' => ['required', 'string', 'max:100'],
            'satuan' => ['required', 'string', 'max:50'],
            'baseline' => ['nullable', 'string', 'max:100'],
            'tipe_indikator' => ['required', 'in:Standar,IKU,IKT'],
            'metode_pengukuran' => ['nullable', 'string'],
            'bobot' => ['integer', 'min:1'],
            'is_active' => ['boolean'],
        ]);

        $indikator->update($validated);

        return back()->with('success', 'Indikator Mutu berhasil diperbarui.');
    }

    public function destroy(IndikatorMutu $indikator): RedirectResponse
    {
        $indikator->delete();

        return back()->with('success', 'Indikator Mutu berhasil dihapus.');
    }
}

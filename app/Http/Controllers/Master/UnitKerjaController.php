<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\UnitKerja;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UnitKerjaController extends Controller
{
    public function index(): Response
    {
        $units = UnitKerja::orderBy('tipe')->orderBy('nama')->get();

        return Inertia::render('master/unit-kerja/index', [
            'units' => $units,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:20', 'unique:unit_kerjas,kode'],
            'nama' => ['required', 'string', 'max:255'],
            'tipe' => ['required', 'string', 'max:100'],
            'kepala_nama' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        UnitKerja::create($validated);

        return back()->with('success', 'Unit Kerja berhasil ditambahkan.');
    }

    public function update(Request $request, UnitKerja $unitKerja): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:20', 'unique:unit_kerjas,kode,'.$unitKerja->id],
            'nama' => ['required', 'string', 'max:255'],
            'tipe' => ['required', 'string', 'max:100'],
            'kepala_nama' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $unitKerja->update($validated);

        return back()->with('success', 'Unit Kerja berhasil diperbarui.');
    }

    public function destroy(UnitKerja $unitKerja): RedirectResponse
    {
        $unitKerja->delete();

        return back()->with('success', 'Unit Kerja berhasil dihapus.');
    }
}

<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\ProgramStudi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgramStudiController extends Controller
{
    public function index(): Response
    {
        $prodis = ProgramStudi::orderBy('jenjang')->orderBy('nama')->get();

        return Inertia::render('master/prodi/index', [
            'prodis' => $prodis,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:20', 'unique:program_studis,kode'],
            'nama' => ['required', 'string', 'max:255'],
            'jenjang' => ['required', 'string', 'in:D3,D4,S1,S2,S3'],
            'fakultas' => ['nullable', 'string', 'max:255'],
            'kaprodi_nama' => ['nullable', 'string', 'max:255'],
            'akreditasi' => ['nullable', 'string', 'max:50'],
            'sk_akreditasi' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        ProgramStudi::create($validated);

        return back()->with('success', 'Program Studi berhasil ditambahkan.');
    }

    public function update(Request $request, ProgramStudi $prodi): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:20', 'unique:program_studis,kode,'.$prodi->id],
            'nama' => ['required', 'string', 'max:255'],
            'jenjang' => ['required', 'string', 'in:D3,D4,S1,S2,S3'],
            'fakultas' => ['nullable', 'string', 'max:255'],
            'kaprodi_nama' => ['nullable', 'string', 'max:255'],
            'akreditasi' => ['nullable', 'string', 'max:50'],
            'sk_akreditasi' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $prodi->update($validated);

        return back()->with('success', 'Program Studi berhasil diperbarui.');
    }

    public function destroy(ProgramStudi $prodi): RedirectResponse
    {
        $prodi->delete();

        return back()->with('success', 'Program Studi berhasil dihapus.');
    }
}

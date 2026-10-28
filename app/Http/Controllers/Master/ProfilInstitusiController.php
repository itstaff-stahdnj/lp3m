<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\ProfilInstitusi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfilInstitusiController extends Controller
{
    public function index(): Response
    {
        $profile = ProfilInstitusi::current();

        return Inertia::render('master/profil/index', [
            'profile' => $profile,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $profile = ProfilInstitusi::current();

        $validated = $request->validate([
            'nama_kampus' => ['required', 'string', 'max:255'],
            'singkatan' => ['required', 'string', 'max:50'],
            'motto' => ['required', 'string', 'max:255'],
            'visi' => ['nullable', 'string'],
            'misi' => ['nullable', 'string'],
            'tujuan' => ['nullable', 'string'],
            'alamat' => ['nullable', 'string'],
            'telepon' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'nama_ketua_stah' => ['nullable', 'string', 'max:255'],
            'nama_ketua_lp3m' => ['nullable', 'string', 'max:255'],
            'logo_url' => ['nullable', 'string', 'max:255'],
        ]);

        $profile->update($validated);

        return back()->with('success', 'Profil Institusi berhasil diperbarui.');
    }
}

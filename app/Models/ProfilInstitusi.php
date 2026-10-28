<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilInstitusi extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_kampus',
        'singkatan',
        'motto',
        'visi',
        'misi',
        'tujuan',
        'alamat',
        'telepon',
        'email',
        'website',
        'nama_ketua_stah',
        'nama_ketua_lp3m',
        'logo_url',
    ];

    public static function current(): self
    {
        return static::firstOrCreate([], [
            'nama_kampus' => 'STAH Dharma Nusantara Jakarta',
            'singkatan' => 'STAH DNJ',
            'motto' => 'Vidya - Vijñānām - Vidvān',
            'visi' => 'Menjadi perguruan tinggi keagamaan Hindu yang unggul, berkarakter, dan berdaya saing global.',
            'misi' => "1. Menyelenggarakan pendidikan tinggi keagamaan Hindu yang bermutu.\n2. Melaksanakan penelitian yang inovatif dan relevan dengan kebutuhan masyarakat.\n3. Melaksanakan pengabdian kepada masyarakat secara berkelanjutan.",
            'tujuan' => 'Menghasilkan lulusan yang cerdas, berintegritas, berwawasan luas, dan mampu mengamalkan ajaran Dharma.',
            'alamat' => 'Jl. Jatiwaringin Raya No. 24, Jatiwaringin Junction, Kel. Cipinang Melayu, Kec. Makasar, Jakarta Timur 13620',
            'telepon' => '(021) 8629081',
            'email' => 'lp3m@stahdnj.ac.id',
            'website' => 'https://stahdnj.ac.id',
            'nama_ketua_stah' => 'Prof. Dr. I Made Kartika, S.Ag., M.Fil.H.',
            'nama_ketua_lp3m' => 'Dr. I Nyoman Yoga, M.Pd.H.',
            'logo_url' => '/images/logo-stah.png',
        ]);
    }
}

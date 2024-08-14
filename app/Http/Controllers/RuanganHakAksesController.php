<?php

namespace App\Http\Controllers;

use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\RuanganAkses;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RuanganHakAksesController extends Controller
{
    public function index(Request $request)
    {
        $ruanganId = $request->id;

        // Dapatkan semua mahasiswa dengan eager loading ruangan dan ruanganAkses
        $mahasiswa = Mahasiswa::with(['ruanganAkses', 'ruangan'])
            ->where('ket', 'mhs')
            ->get();

        // Filter mahasiswa yang memiliki ruanganAkses sesuai dengan ruangan yang dipilih

        $today = Carbon::now('Asia/Makassar')->format('D');
        if ($request->has('today')) {
            $today = $request->today;
        }

        $mahasiswaSelected = Mahasiswa::with(['ruanganAkses', 'ruangan'])
            ->whereHas('ruanganAkses', function ($query) use ($ruanganId, $today) {
                $query->where('ruangan_id', $ruanganId)->where('day', $today);
            })
            ->where('ket', 'mhs')
            ->get();
        // Temukan ruangan yang dipilih
        $ruangan = $mahasiswa->first()->ruangan->firstWhere('id', $ruanganId) ?? Ruangan::find($ruanganId);

        return inertia("Admin/RuanganHakAkses/Index", [
            "mahasiswa" => $mahasiswa,
            "mahasiswaSelected" => $mahasiswaSelected,
            "ruangan" => $ruangan,
            "today" => $today
        ]);
    }

    public function store(Request $request)
    {
        return  DB::transaction(function () use ($request) {
            RuanganAkses::where('ruangan_id', $request->ruangan_id)->delete();
            $data = [];
            foreach ($request->selectedRows as $row) {
                $data[] = [
                    'ruangan_id' => $request->ruangan_id,
                    'mahasiswa_id' => $row['id'],
                    'day' => $request->day,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            RuanganAkses::insert($data);
            return RuanganAkses::where('ruangan_id', $request->ruangan_id)->get();
        });
    }
}

<?php

use App\Http\Controllers\DoorLockController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RiwayatByRuanganController;
use App\Http\Controllers\RiwayatController;
use App\Http\Controllers\RuanganController;
use App\Http\Controllers\RuanganKelasController;
use App\Http\Controllers\ScanerController;
use App\Http\Controllers\SettingController;
use App\Models\Histori;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\ScanerStatus;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('/login');
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $mahasiswaCount = Mahasiswa::where('ket', 'mhs')->count();
    $dosenCount = Mahasiswa::where('ket', 'dsn')->count();
    $ruanganCount = Ruangan::count();
    $scannerCount = ScanerStatus::count();

    $dataRuangan = Ruangan::with('scanner.histories')->whereHas('scanner.histories', function ($query) {
        $query->whereDate('waktu', Carbon::now());
    })->get()->map(function ($data) {
        return [
            "nama_ruangan" => $data->nama_ruangan,
            "jumlahKeluar" =>  Histori::where('kode', $data->scanner->where('type', 'dalam')->first()->kode)->whereDate('waktu', Carbon::now())->count(),
            "jumlahMasuk" =>  Histori::where('kode', $data->scanner->where('type', 'luar')->first()->kode ?? 0)->whereDate('waktu', Carbon::now())->count(),
        ];
    });
    return Inertia::render('Dashboard', [
        "mahasiswaCount" => $mahasiswaCount,
        "dosenCount" => $dosenCount,
        "ruanganCount" => $ruanganCount,
        "scannerCount" => $scannerCount,
    ]);
})
    ->name('dashboard');
//    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/admin/ruangan-kelas', [RuanganKelasController::class, 'index'])->name('admin.ruangan-kelas.index');
    Route::post('/admin/ruangan-kelas', [RuanganKelasController::class, 'store'])->name('admin.ruangan-kelas.store');
    Route::patch('/admin/ruangan-kelas/{ruangan}', [RuanganKelasController::class, 'update'])->name('admin.ruangan-kelas.update');
    Route::delete('/admin/ruangan-kelas/{ruangan}', [RuanganKelasController::class, 'destroy'])->name('admin.ruangan-kelas.destroy');

    Route::get('/admin/ruangan', [RuanganController::class, 'index'])->name('admin.ruangan.index');
    Route::post('/admin/ruangan', [RuanganController::class, 'store'])->name('admin.ruangan.store');
    Route::patch('/admin/ruangan/{ruangan}', [RuanganController::class, 'update'])->name('admin.ruangan.update');
    Route::delete('/admin/ruangan/{ruangan}', [RuanganController::class, 'destroy'])->name('admin.ruangan.destroy');

    Route::get('/admin/mahasiswa', [MahasiswaController::class, 'index'])->name('admin.mahasiswa.index');
    Route::post('/admin/mahasiswa', [MahasiswaController::class, 'store'])->name('admin.mahasiswa.store');
    Route::post('/admin/mahasiswa/active', [MahasiswaController::class, 'active'])->name('admin.mahasiswa.active');
    Route::post('/admin/mahasiswa/block', [MahasiswaController::class, 'block'])->name('admin.mahasiswa.block');
    Route::patch('/admin/mahasiswa/{mahasiswa}', [MahasiswaController::class, 'update'])->name('admin.mahasiswa.update');
    Route::delete('/admin/mahasiswa/{mahasiswa}', [MahasiswaController::class, 'destroy'])->name('admin.mahasiswa.destroy');

    Route::get('/admin/dosen', [DosenController::class, 'index'])->name('admin.dosen.index');
    Route::post('/admin/dosen', [DosenController::class, 'store'])->name('admin.dosen.store');
    Route::post('/admin/dosen/active', [DosenController::class, 'active'])->name('admin.dosen.active');
    Route::post('/admin/dosen/block', [DosenController::class, 'block'])->name('admin.dosen.block');
    Route::patch('/admin/dosen/{mahasiswa}', [DosenController::class, 'update'])->name('admin.dosen.update');
    Route::delete('/admin/dosen/{mahasiswa}', [DosenController::class, 'destroy'])->name('admin.dosen.destroy');

    Route::get('/admin/riwayat', [RiwayatController::class, 'index'])->name('admin.riwayat.index');
    Route::get('/admin/riwayat/ruangan', [RiwayatController::class, 'ruangan'])->name('admin.riwayat.ruangan');
    Route::get('/admin/riwayat/mahasiswa', [RiwayatController::class, 'mahasiswa'])->name('admin.riwayat.mahasiswa');
    Route::get('/admin/riwayat/export', [RiwayatController::class, 'export'])->name('admin.riwayat.export');

    Route::get('/admin/riwayat-by-ruangan', [RiwayatByRuanganController::class, 'index'])->name('admin.riwayat-by-ruangan.index');
    Route::get('/admin/riwayat-by-ruangan/export', [RiwayatByRuanganController::class, 'export'])->name('admin.riwayat-by-ruangan.export');

    Route::get('/admin/scaner', [ScanerController::class, 'index'])->name('admin.scaner.index');
    Route::patch('/admin/scaner/{scanerStatus}', [ScanerController::class, 'update'])->name('admin.scanner.update');
    Route::delete('/admin/scaner/{scanerStatus}', [ScanerController::class, 'destroy'])->name('admin.scanner.destroy');
    Route::post('/admin/scaner', [ScanerController::class, 'store'])->name('admin.scanner.store');

    Route::get('/admin/settings', [SettingController::class, 'index'])->name('admin.settings.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/ambilpost', [DoorLockController::class, 'index']);
Route::get('/ref/riwayat', [DoorLockController::class, 'getRiwayat']);

Route::get('/uikit/button', function () {
    return Inertia::render('main/uikit/button/page');
})->name('button');





require __DIR__ . '/auth.php';

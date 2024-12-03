<?php

use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DoorLockController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\MahasiswaRegisterRuanganController;
use App\Http\Controllers\PendaftaranJadwalController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RiwayatByRuanganController;
use App\Http\Controllers\RiwayatController;
use App\Http\Controllers\RuanganController;
use App\Http\Controllers\RuanganHakAksesController;
use App\Http\Controllers\RuanganKelasController;
use App\Http\Controllers\ScanerController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Foundation\Application;
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


Route::get('/show-ip', function () {
    return request()->ip();
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', DashboardController::class)
    ->middleware('auth')
    ->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::middleware(['role:mahasiswa'])->group(function () {
        Route::get('/mahasiswa/register', [MahasiswaRegisterRuanganController::class, 'index'])->name('mahasiswa.register.index');
        Route::post('/mahasiswa/register', [MahasiswaRegisterRuanganController::class, 'store'])->name('mahasiswa.register.store');
        Route::delete('/mahasiswa/register/{mahasiswaRegisterRuangan}', [MahasiswaRegisterRuanganController::class, 'destroy'])->name('mahasiswa.register.destroy');

        Route::get('/mahasiswa/register-approve', [MahasiswaRegisterRuanganController::class, 'index2'])->name('mahasiswa.register-approve.index');
    });


    Route::get('/admin/ruangan-hak-akses/get-mahasiswa', [RuanganHakAksesController::class, 'getMahasiswa'])->name('admin.ruangan-hak-akses.getMahasiswa');
    Route::post('/admin/ruangan-hak-akses', [RuanganHakAksesController::class, 'store'])->name('admin.ruangan-hak-akses.store');
    Route::delete('/admin/ruangan-hak-akses/{hakAkses}', [RuanganHakAksesController::class, 'destroy'])->name('admin.ruangan-hak-akses.destroy');


    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users.index');
        Route::post('/admin/users', [UserController::class, 'store'])->name('admin.users.store');
        Route::patch('/admin/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
        Route::delete('/admin/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
        Route::get('/admin/users/get-ruangan', [UserController::class, 'getRuangan'])->name('admin.users.get-ruangan');

        Route::get('/admin/ruangan-hak-akses', [RuanganHakAksesController::class, 'index'])->name('admin.ruangan-hak-akses.index');

        Route::get('/admin/ruangan-kelas', [RuanganKelasController::class, 'index'])->name('admin.ruangan-kelas.index');
        Route::post('/admin/ruangan-kelas', [RuanganKelasController::class, 'store'])->name('admin.ruangan-kelas.store');
        Route::patch('/admin/ruangan-kelas/{ruangan}', [RuanganKelasController::class, 'update'])->name('admin.ruangan-kelas.update');
        Route::delete('/admin/ruangan-kelas/{ruangan}', [RuanganKelasController::class, 'destroy'])->name('admin.ruangan-kelas.destroy');

        Route::get('/admin/ruangan', [RuanganController::class, 'index'])->name('admin.ruangan.index');
        Route::post('/admin/ruangan', [RuanganController::class, 'store'])->name('admin.ruangan.store');
        Route::patch('/admin/ruangan/{ruangan}', [RuanganController::class, 'update'])->name('admin.ruangan.update');
        Route::delete('/admin/ruangan/{ruangan}', [RuanganController::class, 'destroy'])->name('admin.ruangan.destroy');

        Route::get('/admin/mahasiswa', [MahasiswaController::class, 'index'])->name('admin.mahasiswa.index');
        Route::post('/admin/mahasiswa.import', [MahasiswaController::class, 'import'])->name('admin.mahasiswa.import');
        Route::post('/admin/mahasiswa', [MahasiswaController::class, 'store'])->name('admin.mahasiswa.store');
        Route::post('/admin/mahasiswa/active', [MahasiswaController::class, 'active'])->name('admin.mahasiswa.active');
        Route::post('/admin/mahasiswa/block', [MahasiswaController::class, 'block'])->name('admin.mahasiswa.block');
        Route::patch('/admin/mahasiswa/{mahasiswa}', [MahasiswaController::class, 'update'])->name('admin.mahasiswa.update');
        Route::delete('/admin/mahasiswa/{mahasiswa}', [MahasiswaController::class, 'destroy'])->name('admin.mahasiswa.destroy');

        Route::get('/admin/dosen', [DosenController::class, 'index'])->name('admin.dosen.index');
        Route::get('/admin/dosen/get-ruangan/{id}', [DosenController::class, 'getDosenRuangan'])->name('admin.dosen.get-dosen-ruangan');
        Route::post('/admin/dosen', [DosenController::class, 'store'])->name('admin.dosen.store');
        Route::post('/admin/dosen/save-ruangan', [DosenController::class, 'saveRuangan'])->name('admin.dosen.save-ruangan');
        Route::post('/admin/dosen/active', [DosenController::class, 'active'])->name('admin.dosen.active');
        Route::post('/admin/dosen/block', [DosenController::class, 'block'])->name('admin.dosen.block');
        Route::patch('/admin/dosen/{mahasiswa}', [DosenController::class, 'update'])->name('admin.dosen.update');
        Route::delete('/admin/dosen/{mahasiswa}', [DosenController::class, 'destroy'])->name('admin.dosen.destroy');


        Route::get('/admin/scaner', [ScanerController::class, 'index'])->name('admin.scaner.index');
        Route::patch('/admin/scaner/{scanerStatus}', [ScanerController::class, 'update'])->name('admin.scanner.update');
        Route::delete('/admin/scaner/{scanerStatus}', [ScanerController::class, 'destroy'])->name('admin.scanner.destroy');
        Route::post('/admin/scaner', [ScanerController::class, 'store'])->name('admin.scanner.store');

        Route::get('/admin/settings', [SettingController::class, 'index'])->name('admin.settings.index');

        Route::get('/admin/riwayat', [RiwayatController::class, 'index'])->name('admin.riwayat.index');
        Route::get('/admin/riwayat/mahasiswa', [RiwayatController::class, 'mahasiswa'])->name('admin.riwayat.mahasiswa');
        Route::get('/admin/riwayat/ruangan', [RiwayatController::class, 'ruangan'])->name('admin.riwayat.ruangan');

        Route::get('/admin/riwayat-by-ruangan', [RiwayatByRuanganController::class, 'index'])->name('admin.riwayat-by-ruangan.index');

        Route::get('/admin/absensi', [AbsensiController::class, 'index'])->name('admin.absensi.index');
    });


    Route::get('/admin/riwayat/export', [RiwayatController::class, 'export'])->name('admin.riwayat.export');


    Route::get('/admin/riwayat-by-ruangan/export', [RiwayatByRuanganController::class, 'export'])->name('admin.riwayat-by-ruangan.export');



    // PENJAGA
    Route::middleware(['role:penjaga'])->group(function () {
        Route::get('/penjaga/pendaftaran', [PendaftaranJadwalController::class, 'index'])->name('penjaga.pendaftaran.index');
        Route::patch('/penjaga/pendaftaran/{hakAksesMahasiswa}', [PendaftaranJadwalController::class, 'approve'])->name('penjaga.pendaftaran.approve');
        Route::patch('/penjaga/pendaftaran/{hakAksesMahasiswa}/unapprove', [PendaftaranJadwalController::class, 'unapprove'])->name('penjaga.pendaftaran.unapprove');

        Route::get('/penjaga/pendaftaran-approve', [PendaftaranJadwalController::class, 'index2'])->name('penjaga.pendaftaran-approve.index');

        Route::get('/penjaga/ruangan-hak-akses', [RuanganHakAksesController::class, 'index'])->name('penjaga.ruangan-hak-akses.index');
        Route::get('/penjaga/riwayat', [RiwayatController::class, 'indexPenjaga'])->name('penjaga.riwayat.index');
        Route::get('/penjaga/riwayat/mahasiswa', [RiwayatController::class, 'mahasiswaPenjaga'])->name('penjaga.riwayat.mahasiswa');
        Route::get('/penjaga/riwayat/ruangan', [RiwayatController::class, 'ruanganPenjaga'])->name('penjaga.riwayat.ruangan');

        Route::get('/penjaga/absensi', [AbsensiController::class, 'indexPenjaga'])->name('penjaga.absensi.index');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/ambilpost', [DoorLockController::class, 'index']);
Route::get('/ambilpostpin', [DoorLockController::class, 'index2']);
Route::get('/ambilpin', [DoorLockController::class, 'index2']);


Route::get('/uikit/button', function () {
    return Inertia::render('main/uikit/button/page');
})->name('button');





require __DIR__ . '/auth.php';

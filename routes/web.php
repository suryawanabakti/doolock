<?php

use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DoorLockController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\KehilanganKartuController;
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
use App\Jobs\ProcessLongTask;
use App\Models\Mahasiswa;
use App\Models\PenjagaRuangan;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
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

Route::get('/test', function () {
    return 'TESTER';
});

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/reset-api', function () {
    return Ruangan::query()->update(['open_api' => 1]);
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

Route::get('/penjaga/dashboard', DashboardController::class)
    ->middleware('auth')
    ->name('dashboard');

Route::get('/admin/update-mahasiswa', function () {
    ProcessLongTask::dispatch();

    return 'ok';
});

Route::get('/admin/get-mahasiswa-all', function () {
    return User::with('mahasiswa')->get();
});

Route::middleware(['auth'])->group(function () {
    Route::get('/penjaga/ruangan', function (Request $request) {
        $ruangan = Ruangan::find($request->id);
        if (PenjagaRuangan::where('user_id', auth()->id())
            ->where('ruangan_id', $ruangan->id)
            ->exists()
        ) {
            $mahasiswas = Mahasiswa::where('ket', 'dsn')->get();

            return Inertia::render('Penjaga/Ruangan/Index', ['ruangan' => $ruangan, 'mahasiswas' => $mahasiswas]);
        }

        return abort(403);
    })->name('penjaga.ruangan.show');

    Route::put('/penjaga/ruangan/{ruangan}', function (Ruangan $ruangan, Request $request) {

        if (PenjagaRuangan::where('user_id', auth()->id())
            ->where('ruangan_id', $ruangan->id)
            ->exists()
        ) {

            $ruangan->update($request->all());

            return back();
        }

        return abort(403);
    })->name('penjaga.ruangan.update');

    Route::middleware(['role:mahasiswa'])->group(function () {
        Route::get('/mahasiswa/register', [MahasiswaRegisterRuanganController::class, 'index'])->name('mahasiswa.register.index');
        Route::post('/mahasiswa/register', [MahasiswaRegisterRuanganController::class, 'store'])->name('mahasiswa.register.store');
        Route::delete('/mahasiswa/register/{hakAkses}', [MahasiswaRegisterRuanganController::class, 'destroy'])->name('mahasiswa.register.destroy');

        Route::get('/mahasiswa/register-approve', [MahasiswaRegisterRuanganController::class, 'index2'])->name('mahasiswa.register-approve.index');

        Route::get('/mahasiswa-kehilangan-kartu', [KehilanganKartuController::class, 'index'])->name('mahasiswa.kehilangan-kartu.index');
        Route::patch('/mahasiswa-kehilangan-kartu', [KehilanganKartuController::class, 'update'])->name('mahasiswa.kehilangan-kartu.update');
    });

    Route::middleware(['role:admin,super'])->group(function () {

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
        Route::post('/admin/mahasiswa/import', [MahasiswaController::class, 'import'])->name('admin.mahasiswa.import');
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

    Route::post('/admin/ruangan-hak-akses', [RuanganHakAksesController::class, 'store'])->name('admin.ruangan-hak-akses.store');
    Route::get('/admin/riwayat-by-ruangan/export', [RiwayatByRuanganController::class, 'export'])->name('admin.riwayat-by-ruangan.export');
    Route::get('/admin/ruangan-hak-akses/get-mahasiswa', [RuanganHakAksesController::class, 'getMahasiswa'])->name('admin.ruangan-hak-akses.getMahasiswa');
    Route::delete('/admin/ruangan-hak-akses/{hakAkses}', [RuanganHakAksesController::class, 'destroy'])->name('admin.ruangan-hak-akses.destroy');

    // PENJAGA
    Route::patch('/penjaga/pendaftaran/{hakAkses}/unapprove', [PendaftaranJadwalController::class, 'unapprove'])->name('penjaga.pendaftaran.unapprove');

    Route::middleware(['role:penjaga', 'penjagaruangan'])->group(function () {

        Route::get('/penjaga/pendaftaran', [PendaftaranJadwalController::class, 'index'])->name('penjaga.pendaftaran.index');
        Route::patch('/penjaga/pendaftaran/{hakAksesMahasiswa}', [PendaftaranJadwalController::class, 'approve'])->name('penjaga.pendaftaran.approve');

        Route::post('/penjaga/pendaftaran/multi-approve', [PendaftaranJadwalController::class, 'multiApprove'])->name('penjaga.pendaftaran.multi-approve');
        Route::post('/penjaga/pendaftaran/multi-disapprove', [PendaftaranJadwalController::class, 'multiDisapprove'])->name('penjaga.pendaftaran.multi-disapprove');

        Route::get('/penjaga/pendaftaran-approve', [PendaftaranJadwalController::class, 'index2'])->name('penjaga.pendaftaran-approve.index');
        Route::get('/penjaga/pendaftaran-disapprove', [PendaftaranJadwalController::class, 'index3'])->name('penjaga.pendaftaran-disapprove.index');

        Route::get('/penjaga/ruangan-hak-akses', [RuanganHakAksesController::class, 'index'])->name('penjaga.ruangan-hak-akses.index');
        Route::post('/penjaga/ruangan-hak-akses', [RuanganHakAksesController::class, 'store'])->name('penjaga.ruangan-hak-akses.store');
        Route::get('/penjaga/riwayat', [RiwayatController::class, 'indexPenjaga'])->name('penjaga.riwayat.index');

        Route::get('/penjaga/riwayat/ruangan', [RiwayatController::class, 'ruanganPenjaga'])->name('penjaga.riwayat.ruangan');
        Route::get('/penjaga/absensi', [AbsensiController::class, 'indexPenjaga'])->name('penjaga.absensi.index');
    });

    Route::get('/penjaga/riwayat/mahasiswa/detail', [RiwayatController::class, 'mahasiswaPenjaga'])->name('penjaga.riwayat.mahasiswa');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/ambilpost', [DoorLockController::class, 'index']);
Route::get('/ambilpostpin', [DoorLockController::class, 'index2']);
Route::get('/ambilpin', [DoorLockController::class, 'index2']);

Route::get('/uikit/button', function () {
    return Inertia::render('main/uikit/button/page');
})->name('button');

require __DIR__.'/auth.php';

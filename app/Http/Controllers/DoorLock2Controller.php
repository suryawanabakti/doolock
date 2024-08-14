<?php
$status = 0;
$mahasiswa = Mahasiswa::where('id_tag', $request->id)->first();

if ($mahasiswa) {
    $status = $mahasiswa->status;
} else {
    $status = 2;
}

$ruangan = Ruangan::with('scanner')
    ->whereHas('scanner', fn($query) => $query->where('kode', $request->kode))
    ->first();

$now = Carbon::now('GMT+8')->format('H:i:s');

if (!$ruangan || $now < $ruangan->jam_buka || $now > $ruangan->jam_tutup) {
    return response()->json(["noid"], 400);
}

if ($mahasiswa && $mahasiswa->ket == 'mhs') {
    $ruanganAkses = RuanganAkses::where('mahasiswa_id', $mahasiswa->id)
        ->where('ruangan_id', $ruangan->id)
        ->where('day', Carbon::now('Asia/Makassar')->format('D'))
        ->first();

    if (!$ruanganAkses) {
        return response()->json(["noid"], 400);
    }
}

$histori = Histori::create([
    'id_tag' => $request->id,
    'kode' => $request->kode,
    'waktu' => Carbon::now('GMT+8'),
    'status' => $status,
]);

if ($mahasiswa) {
    ScanerStatus::where('kode', $request->kode)->update(['last' => Carbon::now()->format('Y-m-d H:i:s')]);

    if ($mahasiswa->status == 0) {
        $data = Histori::with('user', 'scanner.ruangan')->find($histori->id);
        return response()->json(["noid"], 400);
    }

    if ($mahasiswa->status == 1) {
        $absenToday = Absensi::where('id_tag', $request->id)
            ->where('ruangan_id', $ruangan->id)
            ->whereDate('waktu_masuk', Carbon::now('GMT+8'))
            ->first();

        if (!$absenToday) {
            Absensi::create([
                'id_tag' => $request->id,
                'ruangan_id' => $ruangan->id,
                'waktu_masuk' => Carbon::now('GMT+8'),
            ]);
        } else {
            $scannerStatus = ScanerStatus::where('kode', $request->kode)->first();
            if ($scannerStatus && $scannerStatus->type == 'dalam') {
                $absenToday->update(['waktu_keluar' => Carbon::now('GMT+8')]);
            }
        }

        $data = Histori::with('user', 'scanner.ruangan')->find($histori->id);
        return response()->json([$mahasiswa->id_tag], 200);
    }
} else {
    ScanerStatus::where('kode', $request->kode)->update(['last' => Carbon::now()->format('Y-m-d H:i:s')]);
    $data = Histori::with('user', 'scanner.ruangan')->find($histori->id);
    return response()->json(["noid"], 400);
}

if (env("APP_REALTIME") === "true") {
    broadcast(new StoreHistoryEvent($data ?? null, $ruangan));
}

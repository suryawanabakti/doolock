@php
    $nama = $data['nama'] ?? null;
    $namaRuangan = $data['hak_akses']['ruangan']['nama_ruangan'] ?? null;
@endphp

<h1>Hi {{ $nama ?? null }} , Akses Ke Ruangan
    {{ $namaRuangan ?? null }} Mau Habis . Mohon maaf harap segera keluar dari ruangan</h1>
<p>Terima Kasih.</p>

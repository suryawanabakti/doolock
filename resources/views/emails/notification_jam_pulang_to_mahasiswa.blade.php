@php
    $nama = $data['customer']['nama'];
    $namaRuangan = $data['customer']['hak_akses']['ruangan']['nama_ruangan'];
@endphp

<h1>Hi {{ $nama }} , Akses Ke Ruangan
    {{ $namaRuangan }} Mau Habis . Mohon maaf harap segera keluar dari ruangan</h1>
<p>Terima Kasih.</p>

<H1>Halo Admin Ruangan {{ $data->hakAkses->ruangan->nama_ruangan }}</H1>
<p>Ada mahasiswa yang mendaftar di ruangan anda</p>

<p>Nama : {{ $data->mahasiswa->nama }}</p>
<p>NIM : {{ $data->mahasiswa->nim }}</p>
<p>Ruangan : {{ $data->hakAkses->ruangan->nama_ruangan ?? null }} </p>
<p>Jam Masuk : {{ $data->hakAkses->jam_masuk }}</p>
<p>Jam Keluar : {{ $data->hakAkses->jam_keluar }} </p>

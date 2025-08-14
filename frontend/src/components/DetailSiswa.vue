<template>
  <div>
    <h2>Data Siswa</h2>
    <table border="1" v-if="siswa">
      <tr><th>Nomor Induk</th><td>{{ siswa.nomor_induk }}</td></tr>
      <tr><th>Nama</th><td>{{ siswa.nama_siswa }}</td></tr>
      <tr><th>Kelas</th><td>{{ siswa.kelas }}</td></tr>
      <tr><th>Anual Fee</th><td>{{ formatRupiah(siswa.anual_fee) }}</td></tr>
      <tr><th>Biaya Eskul</th><td>{{ formatRupiah(siswa.biaya_eskul) }}</td></tr>
      <tr><th>Biaya SPP</th><td>{{ formatRupiah(siswa.biaya_spp) }}</td></tr>
      <tr><th>Total Biaya</th><td>{{ formatRupiah(totalBiaya) }}</td></tr>
    </table>

    <h2>Daftar Pembayaran</h2>
    <table border="1" v-if="hasValidPembayaran">
      <thead>
        <tr>
          <th>ID</th>
          <th>Jenis Pembayaran</th>
          <th>Jumlah</th>
          <th>Tanggal Bayar</th>
          <th>Status</th>
          <th>Keterangan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in pembayaran" :key="p.id_pembayaran">
          <td>{{ p.id_pembayaran }}</td>
          <td>{{ p.nama_pembayaran }}</td>
          <td>{{ formatRupiah(p.jumlah_bayar) }}</td>
          <td>{{ p.tanggal_bayar }}</td>
          <td>{{ p.status }}</td>
          <td>{{ p.keterangan }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Belum ada data pembayaran</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    idSiswa: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      siswa: null,
      pembayaran: []
    };
  },
  computed: {
    totalBiaya() {
      if (!this.siswa) return 0;
      return (
        Number(this.siswa.anual_fee) +
        Number(this.siswa.biaya_eskul) +
        Number(this.siswa.biaya_spp)
      );
    },
    hasValidPembayaran() {
      return (
        this.pembayaran.length > 0 &&
        this.pembayaran.some(p => p.id_pembayaran)
      );
    }
  },
  methods: {
    async getSiswa() {
      try {
        const res = await axios.get(`http://localhost:3000/api/siswa/${this.idSiswa}`);
        this.siswa = res.data;
      } catch (err) {
        console.error("Gagal ambil data siswa:", err);
      }
    },
    async getPembayaran() {
      try {
        const res = await axios.get(`http://localhost:3000/api/pembayaran/${this.idSiswa}`);
        this.pembayaran = res.data;
      } catch (err) {
        console.error("Gagal ambil data pembayaran:", err);
      }
    },
    formatRupiah(angka) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
      }).format(angka);
    }
  },
  mounted() {
    this.getSiswa();
    this.getPembayaran();
  },
  watch: {
    idSiswa(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getSiswa();
        this.getPembayaran();
      }
    }
  }
};
</script>

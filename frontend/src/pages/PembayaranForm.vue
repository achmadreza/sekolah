<template>
  <div class="container mt-4">
    <h2>Form Pembayaran</h2>
    <form @submit.prevent="submitForm">
      <!-- Nama Siswa -->

        <div class="mb-3">
        <label>Nomor Induk</label>
        <input v-model="form.noInduk" type="text" class="form-control"/>
      </div>
      <div class="mb-3">
        <label>Nama Siswa</label>
        <input v-model="form.nama" type="text" class="form-control" required />
      </div>

      <!-- Tanggal Lahir -->
      <div class="mb-3">
        <label>Tanggal Lahir</label>
        <input v-model="form.tanggalLahir" type="date" class="form-control" required />
      </div>

      <!-- Orang Tua -->
      <div class="mb-3">
        <label>Nama Orang Tua</label>
        <input v-model="form.orangTua" type="text" class="form-control" />
      </div>

      <!-- No Handphone -->
      <div class="mb-3">
        <label>No Handphone</label>
        <input v-model="form.noHandphone" type="number" class="form-control" @blur="formattedNoHP" />
      </div>

      <!-- Tahun Ajaran -->
      <div class="mb-3">
        <label>Tahun Ajaran</label>
        <select v-model="form.tahun" class="form-control">
          <option value="" disabled>Pilih Tahun</option>
          <option v-for="t in tahunList" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <!-- Level -->
      <div class="mb-3">
        <label>Level</label>
        <select v-model="form.level" class="form-control">
          <option value="" disabled>Pilih Level</option>
          <option value="Preschool">Preschool</option>
          <option value="TK A">TK A</option>
          <option value="TK B">TK B</option>
        </select>
      </div>

      <!-- Jenis Pembayaran -->
      <div class="mb-3">
        <label>Jenis Pembayaran</label>
        <select v-model="form.jenisPembayaran" class="form-control">
          <option value="" disabled>Pilih Jenis Pembayaran</option>
          <option value="registration fee">Registration Fee</option>
          <option value="tuition fee">Tuition Fee</option>
          <option value="uniform fee">Uniform Fee</option>
        </select>
      </div>

      <!-- Bulan -->
      <div class="mb-3">
        <label>Bulan</label>
        <select v-model="form.bulan" class="form-control">
          <option value="" disabled>Pilih Bulan</option>
          <option v-for="b in bulanList" :key="b" :value="b">{{ b }}</option>
        </select>
      </div>

      <!-- Jumlah -->
      <div class="mb-3">
        <label>Jumlah</label>
        <input v-model.number="form.jumlah" type="number" class="form-control" required min="1" />
      </div>

      <!-- Tanggal Bayar -->
      <div class="mb-3">
        <label>Tanggal Bayar</label>
        <input v-model="form.tanggalBayar" type="date" class="form-control" required />
      </div>

      <!-- Status Bayar -->
      <div class="mb-3">
        <label>Status</label>
        <select v-model="form.status" class="form-control">
          <option value="Belum Lunas">Belum Lunas</option>
          <option value="Lunas">Lunas</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary">Simpan</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        noInduk: "",
        nama: "",
        tanggalLahir: "",
        orangTua: "",
        noHandphone: "",
        tahun: "",
        level: "",
        jenisPembayaran: "",
        bulan: "",
        jumlah: null,
        tanggalBayar: "",
        status: "Belum Lunas"
      },
      bulanList: [
        "Januari","Februari","Maret","April","Mei","Juni",
        "Juli","Agustus","September","Oktober","November","Desember"
      ],
      tahunList: ["2023/2024","2024/2025","2025/2026"]
    };
  },
  methods: {
     formattedNoHP: {
    get() {
      return this.form.noHandphone;
    },
    set(value) {
      if (value.startsWith("0")) {
        this.form.noHandphone = "+62" + value.slice(1);
      } else {
        this.form.noHandphone = value;
      }
    }
  },
    async submitForm() {
      try {
        // 1️⃣ Insert siswa
        const siswaRes = await axios.post("http://localhost:3000/siswa", {
          nomor_induk: this.form.noInduk,
          nama_siswa: this.form.nama,
          tanggal_lahir: this.form.tanggalLahir,
          orang_tua: this.form.orangTua,
          no_handphone: this.form.noHandphone,
          tahun_ajaran: this.form.tahun,
          level: this.form.level
        });

        const id_siswa = siswaRes.data.id_siswa;

        // 2️⃣ Insert pembayaran
   await axios.post("http://localhost:3000/pembayaran", {
  id_siswa,
  jenis_pembayaran: this.form.jenisPembayaran,
  bulan: this.form.bulan,
  jumlah: this.form.jumlah,       // ubah dari jumlah_bayar → jumlah
  tanggal_bayar: this.form.tanggalBayar,
  status: this.form.status
});

        alert("Data berhasil disimpan!");
        this.resetForm();
        this.$router.push("/resultpembayaran"); // redirect ke dashboard pembayaran
      } catch (err) {
        console.error(err.response?.data || err.message);
        alert(err.response?.data?.error || "Terjadi kesalahan saat menyimpan!");
      }
    },
    resetForm() {
      this.form = {
        nama: "",
        tanggalLahir: "",
        orangTua: "",
        noHandphone: "",
        tahun: "",
        level: "",
        jenisPembayaran: "",
        bulan: "",
        jumlah: null,
        tanggalBayar: "",
        status: "Belum Lunas"
      };
    }
  }
};
</script>

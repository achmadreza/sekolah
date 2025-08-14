<template>
  <div>
    <!-- Tombol untuk buka modal -->
    <div class="d-flex justify-content-start mb-3">
    <button
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#addRegistModal"
    >
      ➕ Add New Registration
    </button>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="addRegistModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tambah Siswa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addSiswa">
              <div class="mb-3">
                <label class="form-label">Nomor Induk</label>
                <input v-model="nomor_induk" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Nama Siswa</label>
                <input v-model="nama_siswa" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Tanggal Lahir</label>
                <input type="date" v-model="tanggal_lahir" class="form-control" />
              </div>

              <!-- <div class="mb-3">
                <label class="form-label">Kelas</label>
                <input v-model="kelas" class="form-control" />
              </div> -->

              <!-- Tambahan Baru -->
              <div class="mb-3">
                <label class="form-label">Biaya Registration</label>
                <input type="number" v-model.number="biaya_registration" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Biaya Seragam</label>
                <input type="number" v-model.number="biaya_seragam" class="form-control" />
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-success">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      nomor_induk: "",
      nama_siswa: "",
      tanggal_lahir: "",
      // kelas: "",
      anual_fee: 0,
      biaya_registration: 0,
      biaya_seragam: 0
    };
  },
  methods: {
    async addSiswa() {
      try {
        await axios.post("http://localhost:3000/api/siswa", {
          nomor_induk: this.nomor_induk,
          nama_siswa: this.nama_siswa,
          tanggal_lahir: this.tanggal_lahir,
          // kelas: this.kelas,
          anual_fee: this.anual_fee,
          biaya_registration: this.biaya_registration,
          biaya_seragam: this.biaya_seragam
        });
        alert("Siswa berhasil ditambahkan!");

        // Reset semua field
        this.nomor_induk = "";
        this.nama_siswa = "";
        this.tanggal_lahir = "";
        // this.kelas = "";
        this.anual_fee = 0;
        this.biaya_registration = 0;
        this.biaya_seragam = 0;
      } catch (error) {
        console.error(error);
        alert("Gagal menambahkan siswa");
      }
    }
  }
};
</script>

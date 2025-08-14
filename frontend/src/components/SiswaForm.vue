<template>
  <div>
    <!-- Tombol untuk buka modal -->
    <div class="d-flex justify-content-start mb-3">
    <button
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#addSiswaModal"
    >
      ➕ Add Siswa
    </button>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="addSiswaModal" tabindex="-1" aria-hidden="true">
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
              <div class="mb-3">
                <label class="form-label">Kelas</label>
                <input v-model="kelas" class="form-control" />
              </div>

              <!-- Tambahan Baru -->
              <div class="mb-3">
                <label class="form-label">Anual Fee</label>
                <input type="number" v-model.number="anual_fee" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Biaya Eskul</label>
                <input type="number" v-model.number="biaya_eskul" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Biaya SPP</label>
                <input type="number" v-model.number="biaya_spp" class="form-control" />
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
      kelas: "",
      anual_fee: 0,
      biaya_eskul: 0,
      biaya_spp: 0
    };
  },
  methods: {
    async addSiswa() {
      try {
        await axios.post("http://localhost:3000/api/siswa", {
          nomor_induk: this.nomor_induk,
          nama_siswa: this.nama_siswa,
          tanggal_lahir: this.tanggal_lahir,
          kelas: this.kelas,
          anual_fee: this.anual_fee,
          biaya_eskul: this.biaya_eskul,
          biaya_spp: this.biaya_spp
        });
        alert("Siswa berhasil ditambahkan!");

        // Reset semua field
        this.nomor_induk = "";
        this.nama_siswa = "";
        this.tanggal_lahir = "";
        this.kelas = "";
        this.anual_fee = 0;
        this.biaya_eskul = 0;
        this.biaya_spp = 0;
      } catch (error) {
        console.error(error);
        alert("Gagal menambahkan siswa");
      }
    }
  }
};
</script>

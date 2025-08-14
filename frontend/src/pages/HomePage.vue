<template>
  <div class="container mt-4">
    <h2 class="mb-3">Daftar Siswa</h2>

   <SiswaForm />

    <div class="table-responsive">
      <table class="table table-bordered table-striped table-hover align-middle">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nomor Induk</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Anual Fee</th>
            <th>Biaya Eskul</th>
            <th>Biaya SPP</th>
            <th>Total Biaya</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="siswa in siswaList" :key="siswa.id_siswa">
            <td>{{ siswa.id_siswa }}</td>
            <td>{{ siswa.nomor_induk }}</td>
            <td>{{ siswa.nama_siswa }}</td>
            <td>{{ siswa.kelas }}</td>
            <td>{{ formatRupiah(siswa.anual_fee) }}</td>
            <td>{{ formatRupiah(siswa.biaya_eskul) }}</td>
            <td>{{ formatRupiah(siswa.biaya_spp) }}</td>
            <td>{{ formatRupiah(siswa.total_biaya) }}</td>
            <td>
              <button @click="$emit('select-siswa', siswa)" class="btn btn-sm btn-primary me-1">Detail</button>
              <button @click="openEditModal(siswa)" class="btn btn-sm btn-warning me-1">Edit</button>
              <button @click="deleteSiswa(siswa.id_siswa)" class="btn btn-sm btn-danger">Hapus</button>
            </td>
          </tr>
          <tr v-if="siswaList.length === 0">
            <td colspan="9" class="text-center text-muted">
              Tidak ada data siswa
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Edit -->
    <div class="modal fade" id="editSiswaModal" tabindex="-1" aria-labelledby="editSiswaLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editSiswaLabel">Edit Siswa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitEdit">
              <div class="mb-3">
                <label class="form-label">Nomor Induk</label>
                <input v-model="editData.nomor_induk" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Nama Siswa</label>
                <input v-model="editData.nama_siswa" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Kelas</label>
                <input v-model="editData.kelas" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Anual Fee</label>
                <input v-model.number="editData.anual_fee" type="number" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Biaya Eskul</label>
                <input v-model.number="editData.biaya_eskul" type="number" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Biaya SPP</label>
                <input v-model.number="editData.biaya_spp" type="number" class="form-control" />
              </div>
              <div class="text-end">
                <button type="submit" class="btn btn-success">Simpan Perubahan</button>
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
import SiswaForm from "../components/SiswaForm.vue";

export default {
  components: {
    SiswaForm
  },
  data() {
    return {
      siswaList: [],
      editData: {
        id_siswa: null,
        nomor_induk: "",
        nama_siswa: "",
        kelas: "",
        anual_fee: 0,
        biaya_eskul: 0,
        biaya_spp: 0
      },
      modalInstance: null
    };
  },
  methods: {
    async fetchSiswa() {
      try {
        const res = await axios.get("http://localhost:3000/api/siswa");
        this.siswaList = res.data.map(siswa => ({
          ...siswa,
          total_biaya:
            (siswa.anual_fee || 0) +
            (siswa.biaya_eskul || 0) +
            (siswa.biaya_spp || 0)
        }));
      } catch (error) {
        console.error("Gagal memuat data siswa:", error);
      }
    },
    async deleteSiswa(id) {
      if (confirm("Yakin ingin menghapus siswa ini?")) {
        try {
          await axios.delete(`http://localhost:3000/api/siswa/${id}`);
          this.fetchSiswa();
        } catch (error) {
          console.error("Gagal menghapus data:", error);
        }
      }
    },
    openEditModal(siswa) {
      this.editData = { ...siswa };
      this.modalInstance = new bootstrap.Modal(
        document.getElementById("editSiswaModal")
      );
      this.modalInstance.show();
    },
    async submitEdit() {
      try {
        const updatePayload = {
          nomor_induk: this.editData.nomor_induk,
          nama_siswa: this.editData.nama_siswa,
          kelas: this.editData.kelas,
          anual_fee: this.editData.anual_fee || 0,
          biaya_eskul: this.editData.biaya_eskul || 0,
          biaya_spp: this.editData.biaya_spp || 0
        };

        await axios.put(
          `http://localhost:3000/api/siswa/${this.editData.id_siswa}`,
          updatePayload
        );

        this.modalInstance.hide();
        this.fetchSiswa();
      } catch (error) {
        console.error("Gagal update siswa:", error);
      }
    },
    formatRupiah(value) {
      if (!value) return "-";
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(value);
    }
  },
  mounted() {
    this.fetchSiswa();
  }
};
</script>

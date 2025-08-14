<template>
  <div class="container mt-4">
    <h2>Dashboard Pembayaran</h2>

    <!-- Filter -->
    <div class="row mb-3">
      <div class="col-md-3">
        <input v-model="filterNama" type="text" class="form-control" placeholder="Cari Nama Siswa" />
      </div>
      <div class="col-md-3">
        <select v-model="filterTahun" class="form-control">
          <option value="">Semua Tahun</option>
          <option v-for="t in tahunList" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="filterStatus" class="form-control">
          <option value="">Semua Status</option>
          <option value="Lunas">Lunas</option>
          <option value="Belum Lunas">Belum Lunas</option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="filterLevel" class="form-control">
          <option value="">Semua Level</option>
          <option value="Preschool">Preschool</option>
          <option value="TK A">TK A</option>
          <option value="TK B">TK B</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>No Induk</th>
          <th>Nama Siswa</th>
          <th>Tanggal Lahir</th>
          <th>Nama Orangtua</th>
          <th>No Handphone</th>
          <th>Level</th>
          <th>Tahun Ajaran</th>
          <th>Jenis Pembayaran</th>
          <th>Bulan</th>
          <th>Tanggal Bayar</th>
          <th>Jumlah</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredData" :key="item.id_pembayaran">
          <td>{{ index + 1 }}</td> <!-- Nomor urut rapi -->
          <td>{{ item.nomor_induk }}</td>
          <td>{{ item.nama_siswa }}</td>
          <td>{{ new Date(item.tanggal_lahir).toLocaleDateString() }}</td>
          <td>{{ item.orang_tua }}</td>
          <td>{{ item.no_handphone }}</td>
          <td>{{ item.level }}</td>
          <td>{{ item.tahun_ajaran }}</td>
          <td>{{ item.jenis_pembayaran }}</td>
          <td>{{ item.bulan }}</td>
          <td>{{ new Date(item.tanggal_bayar).toLocaleDateString() }}</td>
          <td>Rp {{ Number(item.jumlah).toLocaleString() }}</td>
          <td :class="statusClass(item.status)">{{ item.status }}</td>
          <td class= "col-md-4">
            <button class="btn btn-primary btn-sm" @click="openAddModal(item)">Add</button>
            <button class="btn btn-warning btn-sm " @click="openEditModal(item)">Edit</button>
           <button class="btn btn-danger btn-sm" @click="deletePayment(item.id_siswa)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Add / Edit (gunakan 2 modal) -->
    <div class="modal fade" ref="addModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tambah Pembayaran</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form>
              <!-- Isi form sama seperti di AddPaymentForm -->
              <div class="mb-3">
                <label>Nama Siswa</label>
                <input type="text" class="form-control" v-model="form.nama" readonly />
              </div>
<div class="mb-3">
        <label>Tanggal Lahir</label>
        <input v-model="form.tanggalLahir" type="date" class="form-control" readonly  />
      </div>

          <div class="mb-3">
        <label>No Handphone</label>
        <input v-model="form.noHandphone" type="number" class="form-control" @blur="formattedNoHP" />
          </div>

            <div class="mb-3">
                <label>Nama Orangtua</label>
                <input type="text" class="form-control" v-model="form.orangTua" readonly />
              </div>

              <div class="mb-3">
                <label>Level</label>
                <select class="form-control" v-model="form.level">
                  <option value="Preschool">Preschool</option>
                  <option value="TK A">TK A</option>
                  <option value="TK B">TK B</option>
                </select>
              </div>
              <div class="mb-3">
                <label>Tahun Ajaran</label>
                <select class="form-control" v-model="form.tahun">
                  <option v-for="t in tahunList" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label>Jenis Pembayaran</label>
                <select class="form-control" v-model="form.jenisPembayaran">
                  <option value="registration fee">Registration Fee</option>
                  <option value="tuition fee">Tuition Fee</option>
                  <option value="uniform fee">Uniform Fee</option>
                </select>
              </div>
              <div class="mb-3">
                <label>Bulan</label>
                <select class="form-control" v-model="form.bulan">
                  <option v-for="b in bulanList" :key="b">{{ b }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label>Tanggal Bayar</label>
                <input type="date" class="form-control" v-model="form.tanggalBayar" />
              </div>
              <div class="mb-3">
                <label>Jumlah</label>
                <input type="number" class="form-control" v-model="form.jumlah" />
              </div>
              <div class="mb-3">
                <label>Status</label>
                <select class="form-control" v-model="form.status">
                  <option value="Belum Lunas">Belum Lunas</option>
                  <option value="Lunas">Lunas</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
            <button class="btn btn-primary" @click="submitAdd">Submit</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" ref="editModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Pembayaran</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Form Edit sama seperti Add tapi bisa diubah semua field -->
            <form>
              <div class="mb-3">
                <label>Nama Siswa</label>
                <input type="text" class="form-control" v-model="form.nama" readonly />
              </div>
<div class="mb-3">
        <label>Tanggal Lahir</label>
        <input v-model="form.tanggalLahir" type="date" class="form-control" readonly  />
      </div>

          <div class="mb-3">
        <label>No Handphone</label>
        <input v-model="form.noHandphone" type="number" class="form-control" @blur="formattedNoHP" />
          </div>

            <div class="mb-3">
                <label>Nama Orangtua</label>
                <input type="text" class="form-control" v-model="form.orangTua" readonly />
              </div>

              <div class="mb-3">
                <label>Level</label>
                <select class="form-control" v-model="form.level">
                  <option value="Preschool">Preschool</option>
                  <option value="TK A">TK A</option>
                  <option value="TK B">TK B</option>
                </select>
              </div>
              <div class="mb-3">
                <label>Tahun Ajaran</label>
                <select class="form-control" v-model="form.tahun">
                  <option v-for="t in tahunList" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label>Jenis Pembayaran</label>
                <select class="form-control" v-model="form.jenisPembayaran">
                  <option value="registration fee">Registration Fee</option>
                  <option value="tuition fee">Tuition Fee</option>
                  <option value="uniform fee">Uniform Fee</option>
                </select>
              </div>
              <div class="mb-3">
                <label>Bulan</label>
                <select class="form-control" v-model="form.bulan">
                  <option v-for="b in bulanList" :key="b">{{ b }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label>Tanggal Bayar</label>
                <input type="date" class="form-control" v-model="form.tanggalBayar" />
              </div>
              <div class="mb-3">
                <label>Jumlah</label>
                <input type="number" class="form-control" v-model="form.jumlah" />
              </div>
              <div class="mb-3">
                <label>Status</label>
                <select class="form-control" v-model="form.status">
                  <option value="Belum Lunas">Belum Lunas</option>
                  <option value="Lunas">Lunas</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
            <button class="btn btn-success" @click="submitEdit">Simpan</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as bootstrap from "bootstrap";

export default {
  data() {
    return {
      pembayaranList: [],
      filterNama: "",
      filterTahun: "",
      filterStatus: "",
      filterLevel: "",
      addModalInstance: null,
      editModalInstance: null,
      form: {
        nama: "",
        tanggalLahir: "",
        orangTua: "",
        noHandphone: "",
        level: "",
        tahun: "",
        jenisPembayaran: "",
        bulan: "",
        tanggalBayar: "",
        jumlah: "",
        status: "Belum Lunas"
      },
      tahunList: ["2023/2024","2024/2025","2025/2026"],
      bulanList: ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]
    };
  },
  computed: {
    filteredData() {
      return this.pembayaranList.filter(item => {
        return (!this.filterNama || item.nama_siswa.toLowerCase().includes(this.filterNama.toLowerCase()))
          && (!this.filterTahun || item.tahun_ajaran === this.filterTahun)
          && (!this.filterStatus || item.status === this.filterStatus)
          && (!this.filterLevel || item.level === this.filterLevel);
      });
    }
  },
  methods: {
    statusClass(status) {
      if (status === "Lunas") return "text-success";
      if (status === "Belum Lunas") return "text-danger";
      return "";
    },
    getData() {
      axios.get("http://localhost:3000/pembayaran")
        .then(res => this.pembayaranList = res.data)
        .catch(err => console.error(err));
    },
 // Function ini di sini
    formatDateToInput(dateStr) {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    },
    
    
    openAddModal(item) {
    console.log(item);
        this.form = {
        id_siswa: item.id_siswa, 
        nama: item.nama_siswa,
        tanggalLahir: this.formatDateToInput(item.tanggal_lahir),
        orangTua: item.orang_tua,
        noHandphone: item.no_handphone,
        level: item.level,
        tahun: item.tahun_ajaran,
        jenisPembayaran: "",
        bulan: "",
        tanggalBayar: item.tanggal_bayar,
        jumlah: "",
        status: "Belum Lunas"
      };
      if (!this.addModalInstance) this.addModalInstance = new bootstrap.Modal(this.$refs.addModal);
      this.addModalInstance.show();
    },
    openEditModal(item) {
      this.form = {
        id_pembayaran: item.id_pembayaran,
        nama: item.nama_siswa,
        tanggalLahir: this.formatDateToInput(item.tanggal_lahir),
        orangTua: item.orang_tua,
        noHandphone: item.no_handphone,
        level: item.level,
        tahun: item.tahun_ajaran,
        jenisPembayaran: item.jenis_pembayaran,
        bulan: item.bulan,
        tanggalBayar: this.formatDateToInput(item.tanggal_bayar),
        jumlah: item.jumlah,
        status: item.status
      };
     if (!this.editModalInstance) 
      this.editModalInstance = new bootstrap.Modal(this.$refs.editModal);
    this.editModalInstance.show();
    },


   submitAdd() {
const payload = {
  nama: this.form.nama,               // wajib
  tanggalLahir: this.form.tanggalLahir, // opsional tapi disarankan
  orangTua: this.form.orangTua,       // opsional
  noHandphone: this.form.noHandphone, // opsional
  level: this.form.level,             // opsional
  tahun: this.form.tahun,             // opsional
  jenisPembayaran: this.form.jenisPembayaran, // opsional
  bulan: this.form.bulan,             // opsional
  tanggalBayar: this.form.tanggalBayar, // wajib
  jumlah: Number(this.form.jumlah),   // wajib
  status: this.form.status || "Belum Lunas" // default
};
  axios.post("http://localhost:3000/pembayaran", payload)
    .then(() => {
      alert("Pembayaran berhasil ditambahkan");
      this.addModalInstance.hide();
      this.getData();
    })
    .catch(err => {
      console.error(err.response?.data || err);
      alert("Gagal menambahkan pembayaran");
    });
},

submitEdit() {
  const payload = {
    id_siswa: this.form.id_siswa,
    nama: this.form.nama,
    tanggalLahir: this.form.tanggalLahir,
    orangTua: this.form.orangTua,
    noHandphone: this.form.noHandphone,
    level: this.form.level,
    tahun: this.form.tahun,
    jenisPembayaran: this.form.jenisPembayaran,
    bulan: this.form.bulan,
    tanggalBayar: this.form.tanggalBayar,
    jumlah: Number(this.form.jumlah) || 0,
    status: this.form.status
  };

  axios.put(`http://localhost:3000/pembayaran/${this.form.id_pembayaran}`, payload)
    .then(() => {
      alert("Pembayaran berhasil diupdate");
      this.editModalInstance.hide();
      this.getData();
    })
    .catch(err => {
      console.error(err.response?.data || err);
      alert("Gagal mengupdate pembayaran");
    });
},

deletePayment(id_siswa) {
     if (confirm("Yakin ingin menghapus siswa ini beserta semua pembayarannya?")) {
    axios.delete(`http://localhost:3000/siswa/${id_siswa}`)
      .then(() => {
        alert("Siswa dan pembayaran terkait berhasil dihapus");
        this.getData();
      })
      .catch(err => {
        console.error(err.response?.data || err);
        alert("Gagal menghapus siswa");
      });
  }
}
  },

//   submitEdit() {
//   const payload = { 
//     id_siswa: this.form.id_siswa,
//     nama: this.form.nama,
//     tanggalLahir: this.form.tanggalLahir,
//     orangTua: this.form.orangTua,
//     noHandphone: this.form.noHandphone,
//     level: this.form.level,
//     tahun: this.form.tahun,
//     jenisPembayaran: this.form.jenisPembayaran,
//     bulan: this.form.bulan,
//     tanggalBayar: this.form.tanggalBayar,
//     jumlah: Number(this.form.jumlah) || 0,
//     status: this.form.status
//   };

//   axios.put(`http://localhost:3000/pembayaran/${this.form.id_pembayaran}`, payload)
//     .then(() => {
//       alert("Pembayaran berhasil diupdate");
//       this.editModalInstance.hide();
//       this.getData();
//     })
//     .catch(err => {
//       console.error(err.response?.data || err);
//       alert("Gagal mengupdate pembayaran");
//     });
// }
 
  deletePayment(id) {
      if (confirm("Yakin ingin menghapus pembayaran ini?")) {
        axios.delete(`http://localhost:3000/pembayaran/${id}`)
          .then(() => {
            alert("Pembayaran berhasil dihapus");
            this.getData();
          })
          .catch(err => {
            console.error(err.response?.data || err);
            alert("Gagal menghapus pembayaran");
          });
      }
    },
  mounted() {
    this.getData();
  }
};
</script>

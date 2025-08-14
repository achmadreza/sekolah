// src/store/index.js
import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    siswaList: [],
    pembayaranList: [],
    loading: false,
    error: null
  },

  mutations: {
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, message) {
      state.error = message;
    },
    SET_SISWA(state, siswa) {
      state.siswaList = siswa;
    },
    SET_PEMBAYARAN(state, pembayaran) {
      state.pembayaranList = pembayaran;
    },
    ADD_PEMBAYARAN(state, payload) {
      state.pembayaranList.push(payload);
    }
  },

  actions: {
    async fetchSiswa({ commit }) {
      commit("SET_LOADING", true);
      try {
        const res = await axios.get("http://localhost:3000/api/siswa");
        commit("SET_SISWA", res.data);
      } catch (err) {
        commit("SET_ERROR", "Gagal mengambil data siswa");
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchPembayaran({ commit }) {
      commit("SET_LOADING", true);
      try {
        const res = await axios.get("http://localhost:3000/api/pembayaran");
        commit("SET_PEMBAYARAN", res.data);
      } catch (err) {
        commit("SET_ERROR", "Gagal mengambil data pembayaran");
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async addPembayaran({ commit }, pembayaran) {
      try {
        const res = await axios.post("http://localhost:3000/api/pembayaran", pembayaran);
        commit("ADD_PEMBAYARAN", {
          id_pembayaran: res.data.id_pembayaran,
          ...pembayaran
        });
      } catch (err) {
        commit("SET_ERROR", "Gagal menambahkan pembayaran");
      }
    }
  },

  getters: {
    getAllSiswa: (state) => state.siswaList,
    getAllPembayaran: (state) => state.pembayaranList,
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  }
});

<template>
  <div class="row">
    <div class="col-3">
      <div class="d-flex">
        <input
          class="form-control me-2"
          type="search"
          placeholder="Tulis nama alat"
          aria-label="Search"
          v-model.trim="SearchQuery"
        />
      </div>
    </div>
    <div class="col-9">
      <Button
        btn_class="btn btn-outline-warning float-md-end"
        btn_name="Lapor Alat Rusak"
        @click="showOffCanvas('offcanvas-lapor-alat-rusak')"
      />
      <Button
        btn_class="btn btn-outline-success float-md-end mx-4"
        btn_name="Pengadaan Alat"
        @click="showOffCanvas('offcanvas-pengadaan-alat')"
      />
      <Button
        btn_class="btn btn-success float-md-end"
        btn_name="Tambah Alat Baru"
        @click="showOffCanvas('offcanvas-tambah-alat')"
      />
    </div>
  </div>
  <br />
  <div v-if="DaftarAlat.data.length > 0">
    <div class="row g-3 align-items-center">
      <div class="col-auto">
        <label class="bold">Show :</label>
      </div>
      <div class="col-auto">
        <Select
          :options="DaftarAlat.showEntries"
          v-model:selected.number="DaftarAlat.currentEntries"
          @change="showDataByEntries"
        />
      </div>
    </div>
    <Table
      :cols="TableTitle"
      :rows="SearchedAlat"
      :button_delete_func="deleteDataAlat"
    />
    <div class="d-flex justify-content-center">
      <VPagination
      v-model="DaftarAlat.currentPage"
      :pages="DaftarAlat.page"
      :range-size="DaftarAlat.currentPage"/>
    </div>
    
  </div>
  <div v-else>
    <div class="alert alert-secondary text-center">Tidak ada data...</div>
  </div>
  <!--- Tambah alat baru --->
  <OffCanvas
    offcanvas_title="Tambah Alat Baru"
    offcanvas_id="offcanvas-tambah-alat"
  >
    <form @submit.prevent="addDataAlat">
      <InputText
        label_name="Nama Alat"
        placeholder_text="Nama Alat"
        v-model="DataTambahAlat.nama"
        required="required"
      />
      <InputNumber
        label_name="Jumlah Alat"
        placeholder_text="Jumlah Alat"
        v-model.number="DataTambahAlat.jumlah"
        required="required"
      />

      <TextArea
        label_name="Keterangan"
        placeholder_text="Keterangan"
        v-model="DataTambahAlat.keterangan"
      />

      <br />
      <div class="button-group-wrapper">
        <Button type="submit" btn_name="Tambah" btn_class="btn btn-success" />

        <Button
          type="button"
          btn_name="Batal"
          btn_class="btn btn-outline-secondary"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
    </form>
  </OffCanvas>

  <!--- Pengadaan alat --->
  <OffCanvas
    offcanvas_title="Pengadaan Alat"
    offcanvas_id="offcanvas-pengadaan-alat"
  >
    <form @submit.prevent="addPengadaanAlat">
      <label>Nama alat :</label>
      <Multiselect
      v-model="PengadaanAlat.id"
      :searchable="true"
      :options="getListAlat"
      placeholder="Masukkan nama alat..."
      :required="true"
    />
      <br />
      <InputNumber
        label_name="Jumlah Pengadaan Alat"
        placeholder_text="Jumlah Pengadaan Alat"
        v-model.number="PengadaanAlat.jumlah"
        required="required"
      />
      <TextArea
        label_name="Keterangan"
        placeholder_text="Keterangan"
        v-model="PengadaanAlat.keterangan"
      />
      <br />
      <div class="button-group-wrapper">
        <Button type="submit" btn_name="Tambah" btn_class="btn btn-success" />

        <Button
          type="button"
          btn_name="Batal"
          btn_class="btn btn-outline-secondary"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
    </form>
  </OffCanvas>

  <!--- lapor alat rusak --->
  <OffCanvas
    offcanvas_title="Lapor Alat Rusak"
    offcanvas_id="offcanvas-lapor-alat-rusak"
  >
    <form @submit.prevent="addAlatRusak">
      <label>Nama alat :</label>
      <Multiselect
      v-model="LaporAlat.id"
      :searchable="true"
      :options="getListAlat"
      placeholder="Masukkan nama alat..."
      :required="true"
    />
      <br />
      <InputNumber
        label_name="Jumlah Pengadaan Alat"
        placeholder_text="Jumlah Pengadaan Alat"
        v-model.number="LaporAlat.jumlah"
        required="required"
      />

      <TextArea
        label_name="Keterangan"
        placeholder_text="Keterangan"
        v-model="LaporAlat.keterangan"
      />

      <br />
      <div class="button-group-wrapper">
        <Button type="submit" btn_name="Lapor" btn_class="btn btn-warning" />

        <Button
          type="button"
          btn_name="Batal"
          btn_class="btn btn-outline-secondary"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
    </form>
  </OffCanvas>
</template>

<script setup>
import Table from "../element/Table.vue";
import Button from "../element/Button.vue";
import OffCanvas from "../element/Off-Canvas.vue";
import InputText from "../element/InputText.vue";
import InputNumber from "../element/InputNumber.vue";
import TextArea from "../element/TextArea.vue";
import SelectDropdown from "../element/SelectDropdown.vue";
import Select from "../element/Select.vue";
import Pagination from "../element/Pagination.vue";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import { getAuth } from "firebase/auth";
import Multiselect from '@vueform/multiselect'
import { onMounted, reactive, ref, computed, watch } from "vue";
import axios from "axios";
import * as bootstrap from 'bootstrap';

import init from "../../firebaseDB";
import {
  getFirestore,
  getDocs,
  collection,
  addDoc,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import Swal from "sweetalert2";

let DaftarAlat = reactive({
  data: [],
  page: 1,
  currentPage: 1,
  currentEntries: 10,
  showEntries: [10, 25, 50],
});

let SearchQuery = ref("");
let TableTitle = ["No.", "Nama Alat", "Jumlah Stok", "Hapus alat"];
let lastId = null;
let firstId = null;
let prevStatus = ref(true);
let nextStatus = ref(false);
const activeUser = getAuth().currentUser;

let DataTambahAlat = reactive({
  nama: "",
  jumlah: 0,
  keterangan: "",
});

let PengadaanAlat = reactive({
  id: "",
  jumlah: 0,
  keterangan: "",
});

let LaporAlat = reactive({
  id: "",
  jumlah: 0,
  keterangan: "",
});

let value_select = ref(null);

const db = getFirestore(init);
const colRef = collection(db, "DaftarAlat");

onMounted(() => {
  getDataAlat();
});

const showOffCanvas = (id) => {
    var myOffcanvas = document.getElementById(id);
    var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
    bsOffcanvas.show();
}

const showDataByEntries = () => {
  return SearchedAlat;
};

const SearchedAlat = computed(() => {
  let arraySearch = DaftarAlat.data.filter((alat) => {
    return (
      alat.nama_alat.toLowerCase().indexOf(SearchQuery.value.toLowerCase()) !=
      -1
    );
  });

  let page_size = DaftarAlat.currentEntries;
  let pages = paginate(arraySearch, page_size);

  if (arraySearch.length % page_size >= 1) {
    DaftarAlat.page = Math.floor(arraySearch.length / page_size) + 1;
  } else {
    DaftarAlat.page = Math.floor(arraySearch.length / page_size);
  }

  return pages[DaftarAlat.currentPage - 1];
});

const getListAlat = computed(() => {
  const sortedList = [];
  DaftarAlat.data.map(x => {
    let Obj = Object.create({});
    Obj.value = x.id_alat
    Obj.label = x.nama_alat
    sortedList.push(Obj);
  });
  return sortedList;
})

//ambil data dari firebase
const getDataAlat = async () => {
  await getDocs(query(colRef, orderBy("nama"))).then((snap) => {
    snap.docs.forEach((alat) => {
      const jumlahPengadaanAlat = alat
        .data()
        .PengadaanAlat.reduce(
          (counter, obj) =>
            obj.jumlah_alat > 0 ? (counter += obj.jumlah_alat) : counter,
          0
        );
      const jumlahAlatRusak = alat
        .data()
        .AlatRusak.reduce(
          (counter, obj) =>
            obj.jumlah_rusak > 0 ? (counter += obj.jumlah_rusak) : counter,
          0
        );
      let stokAlat = jumlahPengadaanAlat - jumlahAlatRusak;
      stokAlat = stokAlat >= 0 ? stokAlat : 0

      // DaftarAlat.data.push({id: alat.id, nama_alat: alat.data(0).nama, pengadaan_alat: alat.data().PengadaanAlat, alat_rusak: alat.data().AlatRusak, stok_alat: stokAlat });
      DaftarAlat.data.push({
        id_alat: alat.id,
        nama_alat: alat.data(0).nama,
        stok_alat: stokAlat,
      });

      if (DaftarAlat.data.length % DaftarAlat.currentEntries >= 1) {
        DaftarAlat.page = Math.floor(DaftarAlat.data.length / DaftarAlat.currentEntries) + 1;
      } else {
        DaftarAlat.page = Math.floor(DaftarAlat.data.length / DaftarAlat.currentEntries);
      }
    });
  });
};

const paginate = (arr, size) => {
  return arr.reduce((acc, val, i) => {
    let idx = Math.floor(i / size);
    let page = acc[idx] || (acc[idx] = []);
    page.push(val);

    return acc;
  }, []);
};

//tambah data ke firebase
const addDataAlat = async () => {
  await addDoc(colRef, {
    nama: DataTambahAlat.nama,
    PengadaanAlat: [
      {
        jumlah_alat: DataTambahAlat.jumlah,
        tanggal_pengadaan_alat: Timestamp.now(),
        keterangan: DataTambahAlat.keterangan,
        di_input_oleh: activeUser.email
      },
    ],
    AlatRusak: [
      {
        jumlah_rusak: LaporAlat.jumlah,
        tanggal_laporan_rusak: Timestamp.now(),
        keterangan: LaporAlat.keterangan,
        di_input_oleh: activeUser.email
      },
    ],
  })
    .then(() => {
      DaftarAlat.data = [];
      getDataAlat();
      DataTambahAlat.nama = "";
      DataTambahAlat.jumlah = 0;
      DataTambahAlat.keterangan = "";
    })
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Data yang anda masukkan, berhasil di simpan.",
        showConfirmButton: false,
        timer: 1500,
      });
      var myOffcanvas = document.getElementById('offcanvas-tambah-alat');
      var bsOffcanvas = bootstrap.Offcanvas.getInstance(myOffcanvas);
      bsOffcanvas.hide();
    });
};
//hapus data alat di firebase
const deleteDataAlat = async (id) => {
  Swal.fire({
    title: "Apakah kamu yakin ingin mengahapus data tersebut?",
    text: "Data yang terhapus tidak dapat di kembalikan.",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
    allowOutsideClick: false,
    showCloseButton: true,
    reverseButtons: true,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      deleteDoc(doc(db, "DaftarAlat", id))
        .then(() => {
          DaftarAlat.data = [];
          getDataAlat();
        })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Data terhapus!",
            text: "Data yang terhapus tidak dapat di kembalikan.",
            confirmButtonColor: "#198754",
            confirmButtonText: "Okay",
            showCloseButton: true,
          });
        });
    }
  });
};

const addPengadaanAlat = async () => {
  await updateDoc(doc(db, "DaftarAlat", PengadaanAlat.id), {
    PengadaanAlat: arrayUnion({
      jumlah_alat: PengadaanAlat.jumlah,
      tanggal_pengadaan_alat: Timestamp.now(),
      keterangan: PengadaanAlat.keterangan,
      di_input_oleh: activeUser.email
    }),
  })
    .then(() => {
      DaftarAlat.data = [];
      getDataAlat();
      PengadaanAlat.id = "";
      PengadaanAlat.jumlah = 0;
      PengadaanAlat.keterangan = "";
    })
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Data yang anda masukkan, berhasil di simpan.",
        showConfirmButton: false,
        timer: 1500,
      });
      var myOffcanvas = document.getElementById('offcanvas-pengadaan-alat');
      var bsOffcanvas = bootstrap.Offcanvas.getInstance(myOffcanvas);
      bsOffcanvas.hide();
    });
};

const addAlatRusak = async () => {
  await updateDoc(doc(db, "DaftarAlat", LaporAlat.id), {
    AlatRusak: arrayUnion({
      jumlah_rusak: LaporAlat.jumlah,
      tanggal_laporan_rusak: Timestamp.now(),
      keterangan: LaporAlat.keterangan,
      di_input_oleh: activeUser.email
    }),
  })
    .then(() => {
      DaftarAlat.data = [];
      getDataAlat();
      LaporAlat.id = "";
      LaporAlat.jumlah = 0;
      LaporAlat.keterangan = "";
    })
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Data yang anda masukkan, berhasil di simpan.",
        showConfirmButton: false,
        timer: 1500,
      });
      var myOffcanvas = document.getElementById('offcanvas-lapor-alat-rusak');
      var bsOffcanvas = bootstrap.Offcanvas.getInstance(myOffcanvas);
      bsOffcanvas.hide();
    });
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style>
.multiselect-option span {
    text-transform: lowercase;
}
.multiselect-option span::first-line {
    text-transform: capitalize;
}
</style>

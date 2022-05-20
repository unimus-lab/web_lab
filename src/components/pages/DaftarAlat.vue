<template>
  <div class="row">
    <div class="col-sm-12 col-md-4 mb-4 mb-sm-0">
      <div class="d-flex">
        <input
          class="form-control me-md-2"
          type="search"
          placeholder="Tulis nama alat"
          aria-label="Search"
          v-model.trim="SearchQuery"
        />
      </div>
    </div>
    <div class="col-sm-12 col-md-8">
      <div class="button-table">
        <Button
          btn_class="btn btn-outline-warning float-md-end mb-4 mb-sm-0"
          btn_name="Lapor Alat Rusak"
          @click="showOffCanvas('offcanvas-lapor-alat-rusak')"
          v-if="isLogin"
        />
        <Button
          btn_class="btn btn-outline-success float-md-end mx-md-4 mb-4 mb-sm-0"
          btn_name="Pengadaan Alat"
          @click="showOffCanvas('offcanvas-pengadaan-alat')"
          v-if="isLogin"
        />
        <Button
          btn_class="btn btn-success float-md-end"
          btn_name="Tambah Alat Baru"
          @click="showOffCanvas('offcanvas-tambah-alat')"
          v-if="isLogin"
        />
      </div>
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
      :button_info_func="showInfo"
      :hide_func="isLogin"
    />
    <div class="d-flex justify-content-center">
      <VPagination
        v-model="DaftarAlat.currentPage"
        :pages="DaftarAlat.page"
        :range-size="DaftarAlat.currentPage"
      />
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
  <!-- Modal info details -->
  <Modal modal_title="Info Detail" modal_id="modal-info-detail">
    <Datepicker
      v-model="date"
      placeholder="klik untuk memilih tanggal"
      autoApply
      range
      class="mb-4"
    ></Datepicker>
    <table class="table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Tanggal</th>
          <th>Penginput</th>
          <th>Keterangan</th>
          <th>Jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in handleDate"
          :key="index"
          :id="index"
          :class="
            row.status.toLowerCase().replace(/\s+/g, '') == 'laporanalatrusak'
              ? 'table-warning'
              : 'table-success'
          "
        >
          <td>{{ row.status }}</td>
          <td>{{ row.tanggal }}</td>
          <td>{{ row.penginput }}</td>
          <td>{{ row.keterangan }}</td>
          <td>{{ row.jumlah }}</td>
        </tr>
        <tr>
          <td colspan="4" class="text-center">TOTAL JUMLAH STOK</td>
          <td>
            <b>{{ DataRekap.total }}</b>
          </td>
        </tr>
      </tbody>
    </table>
  </Modal>
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
import Modal from "../element/Modal.vue";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Multiselect from "@vueform/multiselect";
import { onMounted, reactive, ref, computed, watch } from "vue";
import axios from "axios";
import * as bootstrap from "bootstrap";

import init from "../../firebaseDB";
import {
  getFirestore,
  getDocs,
  getDoc,
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
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const date = ref();
let DaftarAlat = reactive({
  data: [],
  page: 1,
  currentPage: 1,
  currentEntries: 10,
  showEntries: [10, 25, 50],
});

let SearchQuery = ref("");
let TableTitle = ref([]);
let lastId = null;
let firstId = null;
let prevStatus = ref(true);
let nextStatus = ref(false);
const isLogin = ref(false);

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

let DataRekap = reactive({
  data: [],
  total: 0,
});

let value_select = ref(null);
const activeUser = getAuth().currentUser;

const db = getFirestore(init);
const colRef = collection(db, "DaftarAlat");

onMounted(() => {
  getDataAlat();
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      isLogin.value = true;
      TableTitle.value = [
        "No.",
        "Nama Alat",
        "",
        "Jumlah Stok",
        "Rekap Alat",
        "Hapus alat",
      ];
    } else {
      isLogin.value = false;
      TableTitle.value = ["No.", "Nama Alat", "", "Jumlah Stok", "Rekap Alat"];
    }
  });
  let dateInstance = new Date();
  const startDate = new Date(
    dateInstance.getFullYear(),
    dateInstance.getMonth(),
    1
  );
  const endDate = new Date(
    dateInstance.getFullYear(),
    dateInstance.getMonth() + 1,
    0
  );
  date.value = [startDate, endDate];
});

const showOffCanvas = (id) => {
  var myOffcanvas = document.getElementById(id);
  var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
  bsOffcanvas.show();
};

const showDataByEntries = () => {
  return SearchedAlat;
};

const handleDate = computed(() => {
  var resultProductData = DataRekap.data.filter((a) => {
    var xdate = new Date(a.tanggal);
    return xdate >= date.value[0] && xdate <= date.value[1];
  });

  return resultProductData;
});

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
  DaftarAlat.data.map((x) => {
    let Obj = Object.create({});
    Obj.value = x.id_alat;
    Obj.label = x.nama_alat;
    sortedList.push(Obj);
  });
  return sortedList;
});

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
      stokAlat = stokAlat >= 0 ? stokAlat : 0;

      // DaftarAlat.data.push({id: alat.id, nama_alat: alat.data(0).nama, pengadaan_alat: alat.data().PengadaanAlat, alat_rusak: alat.data().AlatRusak, stok_alat: stokAlat });
      DaftarAlat.data.push({
        id_alat: alat.id,
        nama_alat: alat.data(0).nama,
        stok_alat: stokAlat,
      });

      if (DaftarAlat.data.length % DaftarAlat.currentEntries >= 1) {
        DaftarAlat.page =
          Math.floor(DaftarAlat.data.length / DaftarAlat.currentEntries) + 1;
      } else {
        DaftarAlat.page = Math.floor(
          DaftarAlat.data.length / DaftarAlat.currentEntries
        );
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
        di_input_oleh: activeUser.email,
      },
    ],
    AlatRusak: [
      {
        jumlah_rusak: LaporAlat.jumlah,
        tanggal_laporan_rusak: Timestamp.now(),
        keterangan: LaporAlat.keterangan,
        di_input_oleh: activeUser.email,
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
      var myOffcanvas = document.getElementById("offcanvas-tambah-alat");
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
      di_input_oleh: activeUser.email,
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
      var myOffcanvas = document.getElementById("offcanvas-pengadaan-alat");
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
      di_input_oleh: activeUser.email,
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
      var myOffcanvas = document.getElementById("offcanvas-lapor-alat-rusak");
      var bsOffcanvas = bootstrap.Offcanvas.getInstance(myOffcanvas);
      bsOffcanvas.hide();
    });
};

const showInfo = async (id) => {
  DataRekap.data = [];

  var myModal = new bootstrap.Modal(
    document.getElementById("modal-info-detail"),
    {
      keyboard: false,
    }
  );

  await getDoc(doc(db, "DaftarAlat", id))
    .then((docSnap) => {
      let arrayAlatRusak = docSnap.data().AlatRusak;
      let arrayPengadaanAlat = docSnap.data().PengadaanAlat;
      let arrayMerge = arrayAlatRusak.concat(arrayPengadaanAlat);
      let total = 0;

      arrayMerge.forEach((data) => {
        if (data.jumlah_alat > 0 || data.jumlah_rusak > 0) {
          DataRekap.data.push({
            status:
              data.tanggal_pengadaan_alat != null
                ? "Pengadaan Alat"
                : data.tanggal_laporan_rusak != null
                ? "Laporan Alat Rusak"
                : "",
            tanggal:
              data.tanggal_pengadaan_alat != null
                ? data.tanggal_pengadaan_alat.toDate().toLocaleString()
                : data.tanggal_laporan_rusak != null
                ? data.tanggal_laporan_rusak.toDate().toLocaleString()
                : "",
            penginput: data.di_input_oleh,
            jumlah: data.jumlah_alat > 0 ? data.jumlah_alat : data.jumlah_rusak,
            keterangan: data.keterangan,
          });

          if (data.tanggal_pengadaan_alat != null) {
            total += data.jumlah_alat;
          } else {
            total -= data.jumlah_rusak;
          }
        }
      });

      DataRekap.total = total;
    })
    .then(() => {
      myModal.show(myModal);

      DataRekap.data.sort(function (a, b) {
        var c = new Date(a.tanggal);
        var d = new Date(b.tanggal);
        return c - d;
      });
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

@media only screen and (max-width: 767px) {
  .button-table button {
    width: 100%;
  }
}
</style>

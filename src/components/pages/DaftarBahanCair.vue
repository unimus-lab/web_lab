<template>
  <div class="row">
    <div class="col-3">
      <div class="d-flex">
        <input
          class="form-control me-2"
          type="search"
          placeholder="Tulis nama bahan cair"
          aria-label="Search"
          v-model.trim="SearchQuery"
        />
      </div>
    </div>
    <div class="col-9">
      <Button
        btn_class="btn btn-outline-warning float-md-end"
        btn_name="Lapor Bahan Rusak"
        @click="showOffCanvas('offcanvas-lapor-alat-rusak')"
        v-if="isLogin"
      />
      <Button
        btn_class="btn btn-outline-success float-md-end mx-4"
        btn_name="Pengadaan Bahan"
        @click="showOffCanvas('offcanvas-pengadaan-alat')"
        v-if="isLogin"
      />
      <Button
        btn_class="btn btn-success float-md-end"
        btn_name="Tambah Bahan Baru"
        @click="showOffCanvas('offcanvas-tambah-bahan')"
        v-if="isLogin"
      />
    </div>
  </div>
  <br />
  <div v-if="DaftarBahan.data.length > 0">
    <div class="row g-3 align-items-center">
      <div class="col-auto">
        <label class="bold">Show :</label>
      </div>
      <div class="col-auto">
        <Select
          :options="DaftarBahan.showEntries"
          v-model:selected.number="DaftarBahan.currentEntries"
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
        v-model="DaftarBahan.currentPage"
        :pages="DaftarBahan.page"
        :range-size="DaftarBahan.currentPage"
      />
    </div>
  </div>
  <div v-else>
    <div class="alert alert-secondary text-center">Tidak ada data...</div>
  </div>
  <!--- Tambah alat baru --->
  <OffCanvas
    offcanvas_title="Tambah Bahan Cair"
    offcanvas_id="offcanvas-tambah-bahan"
  >
    <form @submit.prevent="addDataAlat">
      <InputText
        label_name="Nama Bahan"
        placeholder_text="Nama Bahan"
        v-model="DataTambahBahan.nama"
        required="required"
      />
      <InputNumber
        label_name="Jumlah Bahan (liter)"
        placeholder_text="Jumlah Bahan (liter)"
        v-model.number="DataTambahBahan.jumlah"
        required="required"
      />

      <InputNumber
        label_name="Konsentrasi (pH)"
        placeholder_text="Konsentrasi cairan (pH)"
        v-model.number="DataTambahBahan.konsentrasi"
        required="required"
      />

      <TextArea
        label_name="Keterangan"
        placeholder_text="Keterangan"
        v-model="DataTambahBahan.keterangan"
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
    offcanvas_title="Pengadaan Bahan Cair"
    offcanvas_id="offcanvas-pengadaan-alat"
  >
    <form @submit.prevent="addPengadaanAlat">
      <label>Nama Bahan :</label>
      <Multiselect
        v-model="PengadaanBahan.id"
        :searchable="true"
        :options="getListAlat"
        placeholder="Masukkan nama bahan..."
        :required="true"
      />
      <br />
      <InputNumber
        label_name="Jumlah Pengadaan Bahan"
        placeholder_text="Jumlah Pengadaan Bahan"
        v-model.number="PengadaanBahan.jumlah"
        required="required"
      />
      <TextArea
        label_name="Keterangan"
        placeholder_text="Keterangan"
        v-model="PengadaanBahan.keterangan"
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
    offcanvas_title="Lapor Bahan Cair Rusak"
    offcanvas_id="offcanvas-lapor-alat-rusak"
  >
    <form @submit.prevent="addAlatRusak">
      <label>Nama Bahan :</label>
      <Multiselect
        v-model="LaporBahan.id"
        :searchable="true"
        :options="getListAlat"
        placeholder="Masukkan nama bahan..."
        :required="true"
      />
      <br />
      <InputNumber
        label_name="Jumlah Pengadaan Bahan"
        placeholder_text="Jumlah Pengadaan Bahan"
        v-model.number="LaporBahan.jumlah"
        required="required"
      />

      <TextArea
        label_name="Keterangan"
        placeholder_text="Keterangan"
        v-model="LaporBahan.keterangan"
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
            row.status.toLowerCase().replace(/\s+/g, '') == 'laporanbahanrusak'
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
          <td colspan="4" class="text-center">TOTAL JUMLAH STOK (liter)</td>
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
import Multiselect from "@vueform/multiselect";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
let DaftarBahan = reactive({
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

let DataTambahBahan = reactive({
  nama: "",
  jumlah: 0,
  konsentrasi: 0,
  keterangan: "",
});

let PengadaanBahan = reactive({
  id: "",
  jumlah: 0,
  keterangan: "",
});

let LaporBahan = reactive({
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
const colRef = collection(db, "DaftarBahanCair");

onMounted(() => {
  getDataBahan();
  onAuthStateChanged(getAuth(), (user) => {
    if(user) {
      isLogin.value = true;
      TableTitle.value = [
  "No.",
  "Nama Bahan",
  "Konsentrasi (pH)",
  "Jumlah Stok (liter)",
  "Rekap Barang",
  "Hapus bahan",
];
    } else {
      isLogin.value = false;
      TableTitle.value = [
  "No.",
  "Nama Bahan",
  "Konsentrasi (pH)",
  "Jumlah Stok (liter)",
  "Rekap Barang"
]
    }
  })
  let dateInstance = new Date();
  const startDate =  new Date(dateInstance.getFullYear(), dateInstance.getMonth(), 1);
  const endDate = new Date(dateInstance.getFullYear(), dateInstance.getMonth() + 1, 0);
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
  let arraySearch = DaftarBahan.data.filter((alat) => {
    return (
      alat.nama_alat.toLowerCase().indexOf(SearchQuery.value.toLowerCase()) !=
      -1
    );
  });

  let page_size = DaftarBahan.currentEntries;
  let pages = paginate(arraySearch, page_size);

  if (arraySearch.length % page_size >= 1) {
    DaftarBahan.page = Math.floor(arraySearch.length / page_size) + 1;
  } else {
    DaftarBahan.page = Math.floor(arraySearch.length / page_size);
  }

  return pages[DaftarBahan.currentPage - 1];
});

const getListAlat = computed(() => {
  const sortedList = [];
  DaftarBahan.data.map((x) => {
    let Obj = Object.create({});
    Obj.value = x.id_alat;
    Obj.label = x.nama_alat;
    sortedList.push(Obj);
  });
  return sortedList;
});

// const jumlahTotalBahan = computed(() => {
//   const total = 0;
//   DataRekap.filter((data_row) => {
//     return data_row.
//   });
// });

//ambil data dari firebase
const getDataBahan = async () => {
  await getDocs(query(colRef, orderBy("nama_bahan"))).then((snap) => {
    snap.docs.forEach((alat) => {
      const jumlahPengadaanAlat = alat
        .data()
        .PengadaanBahan.reduce(
          (counter, obj) =>
            obj.jumlah_bahan > 0 ? (counter += obj.jumlah_bahan) : counter,
          0
        );
      const jumlahAlatRusak = alat
        .data()
        .BahanRusak.reduce(
          (counter, obj) =>
            obj.jumlah_bahan > 0 ? (counter += obj.jumlah_bahan) : counter,
          0
        );
      let stokAlat = jumlahPengadaanAlat - jumlahAlatRusak;
      stokAlat = stokAlat >= 0 ? stokAlat : 0;

      // DaftarAlat.data.push({id: alat.id, nama_alat: alat.data(0).nama, pengadaan_alat: alat.data().PengadaanAlat, alat_rusak: alat.data().AlatRusak, stok_alat: stokAlat });
      DaftarBahan.data.push({
        id_alat: alat.id,
        nama_alat: alat.data(0).nama_bahan,
        konsentrasi: alat.data(0).konsentrasi,
        stok_alat: stokAlat,
      });
      if (DaftarBahan.data.length % DaftarBahan.currentEntries >= 1) {
        DaftarBahan.page =
          Math.floor(DaftarBahan.data.length / DaftarBahan.currentEntries) + 1;
      } else {
        DaftarBahan.page = Math.floor(
          DaftarBahan.data.length / DaftarBahan.currentEntries
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
    nama_bahan: DataTambahBahan.nama,
    konsentrasi: DataTambahBahan.konsentrasi,
    PengadaanBahan: [
      {
        jumlah_bahan: DataTambahBahan.jumlah,
        tanggal_pengadaan_bahan: Timestamp.now(),
        keterangan: DataTambahBahan.keterangan,
        di_input_oleh: activeUser.email,
      },
    ],
    BahanRusak: [
      {
        jumlah_bahan: LaporBahan.jumlah,
        tanggal_laporan_bahan: Timestamp.now(),
        keterangan: LaporBahan.keterangan,
        di_input_oleh: activeUser.email,
      },
    ],
  })
    .then(() => {
      DaftarBahan.data = [];
      getDataBahan();
      DataTambahBahan.nama = "";
      DataTambahBahan.jumlah = 0;
      DataTambahBahan.konsentrasi = 0;
      DataTambahBahan.keterangan = "";
    })
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Data yang anda masukkan, berhasil di simpan.",
        showConfirmButton: false,
        timer: 1500,
      });
      var myOffcanvas = document.getElementById("offcanvas-tambah-bahan");
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
      deleteDoc(doc(db, "DaftarBahanCair", id))
        .then(() => {
          DaftarBahan.data = [];
          getDataBahan();
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
  await updateDoc(doc(db, "DaftarBahanCair", PengadaanBahan.id), {
    PengadaanBahan: arrayUnion({
      jumlah_bahan: PengadaanBahan.jumlah,
      tanggal_pengadaan_bahan: Timestamp.now(),
      keterangan: PengadaanBahan.keterangan,
      di_input_oleh: activeUser.email,
    }),
  })
    .then(() => {
      DaftarBahan.data = [];
      getDataBahan();
      PengadaanBahan.id = "";
      PengadaanBahan.jumlah = 0;
      PengadaanBahan.keterangan = "";
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
  await updateDoc(doc(db, "DaftarBahanCair", LaporBahan.id), {
    BahanRusak: arrayUnion({
      jumlah_bahan: LaporBahan.jumlah,
      tanggal_laporan_bahan: Timestamp.now(),
      keterangan: LaporBahan.keterangan,
      di_input_oleh: activeUser.email,
    }),
  })
    .then(() => {
      DaftarBahan.data = [];
      getDataBahan();
      LaporBahan.id = "";
      LaporBahan.jumlah = 0;
      LaporBahan.keterangan = "";
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

  await getDoc(doc(db, "DaftarBahanCair", id))
    .then((docSnap) => {
      let arrayBahanRusak = docSnap.data().BahanRusak;
      let arrayPengadaanBahan = docSnap.data().PengadaanBahan;
      let arrayMerge = arrayBahanRusak.concat(arrayPengadaanBahan);
      let total = 0;

      arrayMerge.forEach((data) => {
        if (data.jumlah_bahan > 0) {
          DataRekap.data.push({
            status:
              data.tanggal_pengadaan_bahan != null
                ? "Pengadaan Bahan"
                : data.tanggal_laporan_bahan != null
                ? "Laporan Bahan Rusak"
                : "",
            tanggal:
              data.tanggal_pengadaan_bahan != null
                ? data.tanggal_pengadaan_bahan.toDate().toLocaleString()
                : data.tanggal_laporan_bahan != null
                ? data.tanggal_laporan_bahan.toDate().toLocaleString()
                : "",
            penginput: data.di_input_oleh,
            jumlah: data.jumlah_bahan,
            keterangan: data.keterangan,
          });

          if (data.tanggal_pengadaan_bahan != null) {
            total += data.jumlah_bahan;
          } else {
            total -= data.jumlah_bahan;
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

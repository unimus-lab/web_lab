<template>
  <div class="dropdown">
    <button
      class="btn btn-outline-secondary dropdown-toggle form-control"
      type="button"
      data-bs-toggle="dropdown"
      >
      {{ selected.nama_alat }}
    </button>

    <ul class="dropdown-menu form-control">
      <li class="px-2">
        <input type="search" class="form-control" placeholder="Cari nama alat..." v-model.trim="searchQuery">
      </li>
      <li v-for="(item, index) in searchNamaAlat" :key="index">
        <button class="dropdown-item" type="button" @click="selectAlat(item)">{{ item.nama_alat }}</button>
      </li>
    </ul>
  </div>
</template>



<script setup>
import { ref, computed, reactive } from "vue";

const dataListProps = defineProps({
  dataListValue: {
    type: Array,
    default: [],
  },
  dataListLabel: {
    type: String,
    default: "",
  },
  placeholderName: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(['selectAlat']);

let selected = reactive({
  nama_alat: "Pilih alat",
  id_alat: ""
});

let searchQuery = ref("");

const selectAlat = (data) => {
  emits('selectAlat', data);
  selected.nama_alat = data.nama_alat;
}

const searchNamaAlat = computed(()=>{
  return dataListProps.dataListValue.filter((alat) => {
    return alat.nama_alat.toLowerCase().indexOf(searchQuery.value.toLowerCase()) !=
      -1
  })
});


</script>
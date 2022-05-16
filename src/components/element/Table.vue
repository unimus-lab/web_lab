<template>
  <div class="table-responsive">
    <table class="table table-striped">
      <thead>
        <tr>
          <th v-for="(col, index) in cols" :key="index">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="index" :id="index">
          <td>{{ index + 1 }}</td>
          <td>{{ row.nama_alat }}</td>
          <td class="konsentrasi">{{ row.konsentrasi }}</td>
          <td>{{ row.stok_alat }}</td>
          <td><Button type="button" btn_name="Info Detail" btn_class="btn btn-warning" :id="'info-' + index" @onClick="button_info_func(row.id_alat)" /></td>
          <td v-if="hide_func"><Button type="button" btn_name="Hapus" btn_class="btn btn-danger" :id="'hapus-' + index" @onClick="button_delete_func(row.id_alat)" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from "vue";
import Button from "../element/Button.vue";

const table_props = defineProps({
    cols: {
        type: Array,
        default: []
    },
    rows: {
        type: Array,
        default: []
    },
    button_delete_func: {
        type: Function,
    },
    button_info_func: {
        type: Function,
    },
    hide_func: {
      type: Boolean
    }
});


</script>

<style scoped>
.table>tbody, .table>thead {
  text-align: center;
}

.table > tbody > tr > td:nth-child(2) {
  text-transform: lowercase;
}
.table > tbody > tr > td:nth-child(2)::first-line {
  text-transform: capitalize;
}

</style>


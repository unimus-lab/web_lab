<template>
  <div>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li :class="['page-item', prevStatus ? 'disabled' : '']">
          <a class="page-link" href="#" @click.prevent="goPrev">Previous</a>
        </li>

        <li :class="['page-item', nextStatus ? 'disabled' : '']">
          <a class="page-link" href="#" @click.prevent="goNext">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>

const props = defineProps({
  prevStatus: {
    type: Boolean
  },
  nextStatus: {
    type: Boolean
  }
});
const emits = defineEmits(['goNext', 'goPrev']);

const goNext = () => emits('goNext');
const goPrev = () => emits('goPrev')

</script>

<style scope>
.pagination .page-link {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>
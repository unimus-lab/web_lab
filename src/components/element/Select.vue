<template>
  <select class="form-select" @change="emits('update:selected', $event.target.value)" :value="selected">
    <option v-for="(opt, index) in options" :key="index">{{ opt }}</option>
  </select>
</template>

<script setup>
const props = defineProps({
    selected: {
        type: Number
    },
    options: {
        type: Array
    }
});

const emits = defineEmits(['update:selected']);

</script>
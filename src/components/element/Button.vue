<template>
    <button :class="btn_class" type="button" @click="button_emit('onClick')">{{ btn_name }}</button>
</template>

<script setup>

const button_props = defineProps({
    btn_name: {
        type: String,
        default: ""
    },
    btn_class: {
        type: String,
        default: ""
    }
});

const button_emit = defineEmits(['onClick']);

</script>
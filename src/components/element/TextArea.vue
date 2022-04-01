<template>

<div class="form-floating">
  <textarea 
        class="form-control" 
        :value="textarea_props.modelValue" 
        :placeholder="placeholder_text" 
        id="floatingTextarea"
        @input="handleInput($event.target.value)"
        :required = required
        ></textarea>
  <label for="floatingTextarea">{{ label_name }}</label>
</div>

</template>

<script setup>

const textarea_props = defineProps({
    label_name: {
        type: String,
        default: ""
    },
    placeholder_text: {
        type: String,
        default: ""
    },
    modelValue: {
        type: String,
    },
    required: {
      type: Boolean,
    },
});

const emits = defineEmits(['update:modelValue']);

const handleInput = (value) => emits('update:modelValue', value)

</script>
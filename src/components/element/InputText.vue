<template>
  <div class="form-floating mb-3">
    <input
      type="text"
      class="form-control"
      id="floatingInput"
      :placeholder="placeholder_text"
      :value="input_text_props.modelValue"
      @input="handleInput($event.target.value)"
      :required = required
    />
    <label for="floatingInput">{{ label_name }}</label>
  </div>
</template>

<script setup>

const input_text_props = defineProps({
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
      type: String,
    },
});

const emits = defineEmits(['update:modelValue']);

const handleInput = (value) => emits('update:modelValue', value)

</script>
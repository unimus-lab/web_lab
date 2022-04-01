<template>
  <div class="form-floating mb-3">
    <input
      type="text"
      class="form-control"
      id="floatingInput"
      :placeholder="placeholder_text"
      :maxlength="10"
      :value="input_text_props.modelValue"
      @keypress="acceptNumber($event)"
      @input="handleInput($event.target.value)"
      :required = required
    />
    <label for="floatingInput">{{ label_name }}</label>
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";


const input_text_props = defineProps({
  label_name: {
    type: String,
    default: "",
  },
  placeholder_text: {
    type: String,
    default: "",
  },
  modelValue: {
        type: Number,
        default: 0
    },
    required: {
      type: String,
    },
});

const acceptNumber = (event) => {
  let keyCode = event.keyCode;
  if (keyCode < 48 || keyCode > 57) {
    event.preventDefault();

  }
};

const emits = defineEmits(['update:modelValue']);

const handleInput = (value) => emits('update:modelValue', value == "" || value == null ? 0 : value);


</script>
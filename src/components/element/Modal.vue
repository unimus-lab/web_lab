<template>
  <div class="modal" tabindex="-1" :id="modal_id">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ modal_title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <slot/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
    modal_title: {
        type: String
    },
    modal_id: {
        type: String
    }
});
</script>
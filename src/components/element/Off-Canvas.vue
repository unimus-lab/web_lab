<template>
  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    :id="offcanvas_id"
  >
    <div class="offcanvas-header">
      <h5 id="offcanvasRightLabel">{{ offcanvas_title }}</h5>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body">
        <slot/>
    </div>
  </div>
</template>

<script setup>

const offcanvas_props = defineProps({
    offcanvas_title: {
        type: String,
        default: ""
    },
    offcanvas_id:{
      type: String,
        default: ""
    }

});

</script>
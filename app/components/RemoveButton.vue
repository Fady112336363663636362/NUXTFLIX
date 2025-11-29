<template>
  <button
    @click="handleRemove"
    class="px-3 py-1 text-white transition bg-red-600 rounded-md hover:bg-red-700"
  >
    Remove
  </button>
</template>

<script setup>
const props = defineProps({
  movieId: {
    type: Number,
    required: true
  },
  onRemove: {
    type: Function,
    required: true
  }
});

const handleRemove = () => {
  props.onRemove(props.movieId);
};
</script>

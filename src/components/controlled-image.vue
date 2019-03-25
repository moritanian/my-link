<template>
<div class="c-image" v-show="visible">
  <img :src="url" v-on:load="load">
</div>
</template>

<script>
export default {
  name: 'ControlledImage',
  props: {
    visible: {
      default: true,
      type: Boolean
    },
    url: '',
  },
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    load (e) {
      this.$emit('load', e);
    }
  }
}
</script>
<style lang='scss'>
.c-image {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>

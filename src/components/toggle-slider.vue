<template>
<span class="toggle-slider" @click="onClick">
  <svg class="toggle-switch" :class="{on: value}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle :class="{on: value}" cx="50" cy="50" r="50"></circle>
  </svg>
</span>
</template>

<script>
export default {
  name: 'ToggleSlider',
  props: {
    defaultValue: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      value: this.defaultValue
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    onClick () {
      this.value = !this.value;
      this.$emit('change', this.value);
    }
  }
}
</script>
<style lang='scss' scoped>
.toggle-slider {
  height: 20px;
  width: 33px;
  float: right;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 30px;

  .toggle-switch {
    height: 12px;
    width: 12px;
    top: 4px;
    left: 3px;
    display: inline-block;
    transform-origin: 50% 50%;
    transition: transform .15s ease;
    vertical-align: top;
    position: relative;
    &.on {
      transform: translateX(14px) scale(1.33333);
    }

    circle {
      fill: #fff;
      opacity: .5;
      &.on {
        opacity: 1;
      }
    }
  }
}


</style>

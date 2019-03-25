<template>
<div v-show="visible">
  <div class="dialog-modal" @click="onclickBackground">
  </div>
  <div class="dialog">
    <div class="dialog-title">Customize</div>
  </div>
</div>
</template>

<script>
export default {
  name: 'CustomizeDialog',
  data () {
    return {
      visible: false,
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    open () {
      this.visible = true;
    },
    close () {
      this.visible = false;
    },
    onclickBackground (e) {
      e.preventDefault();
      e.stopPropagation();
      this.close();
    }
  }
}
</script>
<style lang='scss'>
.dialog-modal {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #00000094;
  top: 0;
  left: 0;
  z-index: 500;
}

.dialog {
    width: 400px;
    height: 180px;
    z-index: 500;
    left: 0;
    right: 0;
    margin: auto;
    top: 0;
    bottom: 0;
    position: absolute;
    background-color: #ffffffd6;
    padding: 10px;
    border-radius: 5px;

    .dialog-title {
      font-size: 18px;
      margin: 10px;
    }
  }
</style>

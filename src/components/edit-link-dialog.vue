<template>
<div v-show="visible">
  <div class="dialog-modal" @click="onclickBackground">
  </div>
  <div class="dialog">
    <div class="dialog-title">Edit Link</div>
    <div class="input-item">
      <div class="input-title">name</div>
      <input type="text" class="input-text" v-model="title"/>
    </div>
    <div class="input-item">
      <div class="input-title">URL</div>
      <input type="text" class="input-text" v-model="url"/>
    </div>

    <div class="foot-items">
      <button class="foot-button delete-button" @click="deleteItem">Delete</button>
      <button class="foot-button cancel-button" @click="cancel">Cancel</button>
      <button class="foot-button update-button" @click="updateItem">Update</button>
  </div>
</div>
</template>

<script>
export default {
  name: 'EditLinkDialog',
  data () {
    return {
      visible: false,
      url: '',
      title: ''
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    open (urlItem) {
      this.url = urlItem.url;
      this.title = urlItem.title;
      this.visible = true;
    },
    close () {
      this.visible = false;
    },
    deleteItem () {
      this.$emit('deleteItem');
      this.close();
    },
    updateItem () {
      this.$emit('updateItem', {
        url: this.url,
        title: this.title
      });
      this.close();
    },
    cancel () {
      this.close();
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
  z-index: 500;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #00000094;
  top: 0;
  left: 0;
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
    line-height: 20px;
    margin: 10px;
  }
}

.input-item {

  margin: 10px;

  .input-title {
    font-size: 14px;
    color: #949494;
    line-height: 20px;
  }
  .input-text {
    width: 350px;
    font-size: 13px;
  }
}

.foot-items {
  display: flex;
  margin-top: 20px;
  position: relative;
  .foot-button {
    width: 60px;
    height: 24px;
  }

  .update-button {
    background-color: #1083ff;
    color: white;
    position: absolute;
    right: 0;
  }
}
</style>

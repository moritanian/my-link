<template>
<div class='link-icon' v-on:click='onclick'>
  <div class='link-icon-content' v-on:click='onclick'>
    <div class="background"></div>
    <a :href='url' class="link-icon-inner" :class="{dir: dir, open: open}">
      <div class="edit-button" @click="onclickEditButton">
        <img src="./../img/edit-menu.svg">
      </div>
      <div class='link-image' :style="{ 'background-image': 'url(' + linkImage + ')' }"></div>
      <div class='link-title'>{{linkTitle}}</div>
    </a>
  </div>
</div>
</template>

<script>
export default {
  name: 'LinkIcon',
  props: ['id', 'linkImage', 'linkTitle', 'url', 'dir', 'open'],
  created () {
    console.log('linkicon created', this.id, this.linkTitle);
  },
  methods: {
    onclick (e) {
      if (this.dir){
        e.stopPropagation();
        e.preventDefault();
        this.$emit('toggle', this.id);
      }
      
    },
    onclickEditButton (e) {
      e.preventDefault();
      e.stopPropagation();
      this.$emit('edit', this.id);
    }
  }
}
</script>
<style lang='scss' scoped>
.link-image {
  width: 32px;
  height: 32px;
  background-size: cover;
  cursor: pointer;
  margin: 0px auto;
}

.link-icon {
  width: 110px;
  height: 110px;

  .link-icon-content {
    padding: 10px;
    border-radius: 10px;

    &:hover {
      background-color: #ffffff24;
    }

    .link-icon-inner {
      position: relative;

      .edit-button {
        position: absolute;
        right: 3px;
        top: 3px;
        border-radius: 10px;
        width: 14px;
        height: 14px;

        &:hover {
          background-color: #ffffff61;
        }

        img {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          margin: auto;

          svg {
            fill: white;
          }
        }
      }

      padding: 5px;
      text-decoration: none;
      width: 80px;
      min-height: 80px;
      height: 80px;
      display: grid;
      background-color: white;
      border-radius: 5px;
      box-shadow: #6f6f6fa1 3px 1px 8px;

      color: #efefef;
      background-color: #3c3c3ca8;
      background-color: rgba(0, 0, 0, 0.58);
      border: solid #ffffffb3 1px;

      &.dir {
        background-color: rgba(74, 86, 95, 0.95);
      }

      &.dir.open {
        background-color: rgba(130, 130, 130, 0.88);
      }

      &:hover {
        height: auto;
        z-index: 100;
      }

      .link-title {
        overflow: hidden;
        cursor: pointer;
        text-align: center;
        user-select: none;
        font-size: 12px;
        line-height: 13px;
      }
    }
  }
}
</style>

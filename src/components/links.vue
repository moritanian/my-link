<template>
<div class="link-items">
  <div v-for="(item, url) in urls.children" :key="url">
    <link-icon :dir="item.dir" :open="item.open"
      :id="item.id" :link-image="item.favicon" :link-title="item.title" :url="item.url" @edit="editLinkItem" @toggle="toggleLinkItem"></link-icon>
    <links v-if="item.dir && item.open" :urls="item" @edit='editLinkItem' @toggle="toggleLinkItem"></links>
  </div>
</div>
</template>
<script>
import Vue from 'vue'
import LinkIcon from './link-icon';
import Links from './links';

export default {
  name: 'Links',
  components: {LinkIcon, Links},
  props: ['urls'],
  data () {
    console.log(this.urls);
    return {
    }
  },
  created () {
    
  },
  mounted () {
  },
  methods: {
    editLinkItem (id) {
      this.$emit('edit', id);
    },
    toggleLinkItem (id) {
      console.log('toggle', id);
      this.$emit('toggle', id);
    }
  }
}
</script>
<style lang="scss">
.link-items {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 10px 0;
}
</style>

<template>
<div v-if="visible">
  <div class="dialog-modal" @click="onclickBackground">
  </div>
  <div class="dialog">
    <div class="dialog-title">Customize</div>
    <div class="setting-item" v-for="(item, index) in settingList" :key="index">
      <span>{{item.title}}</span>
      <toggle-slider v-if="item.type === Boolean"
        :defaultValue="item.value" @change="value => onChange(item.key, value)" ></toggle-slider>
      <input class="text-input" type="text" v-if="item.type === String" v-model="item.value" @change="value => onChange(item.key, item.value)">
    </div>
  </div>
</div>
</template>

<script>
import ToggleSlider from './toggle-slider';

export default {
  name: 'CustomizeDialog',
  props: ['settings'],
  components: {ToggleSlider},
  data () {
    var settingList = [
        {
          key: 'useBookmark',
          title: 'Bookmark',
          type: Boolean
        },
        {
          key: 'visibleClock',
          title: 'Clock',
          type: Boolean
        },
         {
          key: 'backgroundImage',
          title: 'Background image',
          type: String
        },
        {
          key: 'backgroundBlur',
          title: 'Background blur',
          type: Boolean
        },
        {
          key: 'backgroundRandomImage',
          title: 'Random image',
          type: Boolean
        },
        {
          key: 'debug',
          title: 'debug',
          type: Boolean
        }
      ];

    return {
      visible: false,
      settingList: settingList
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    open () {
      console.log(this.settings);
       this.settingList.forEach(
          item => {
            item.value = this.settings[item.key];
        }
      );
      this.visible = true;
    },
    close () {
      this.visible = false;
    },
    onclickBackground (e) {
      e.preventDefault();
      e.stopPropagation();
      this.close();
    },
    onChange (key, value) {
      console.log(key, value)
      this.$emit('change', {[key]: value});
    },
    log (...values) {
      console.log(...values)
    }
  }
}
</script>
<style lang='scss' scoped>
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
  height: 270px;
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

  .setting-item {
    height: 22px;
    border-bottom: solid #5f5f5f 1px;
    margin-top: 10px;
  }

  .text-input {
    width: 280px;
    float: right;
  }
}
</style>

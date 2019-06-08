<template>
<div class='links' v-show="visible">
  <controlled-image
    class="bg-image"
    :class="{blur: settings.backgroundBlur}"
    :url="settings.backgroundImage" @load="onloadBackground" @failed="onfailedBackground"> </controlled-image>
  <!--<controlled-image class="bg-image" url='https://farm5.staticflickr.com/4273/34378170890_3901a0ac25_k.jpg'> </controlled-image>-->
  <!--<controlled-image class="bg-image" url='https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e'> </controlled-image>-->
  
  <ul class="header">
    <li>
      <a class="header-icon" href="chrome-search://local-ntp/local-ntp.html" class="local">
        <svg class="icon-favicon icon-svg icon-chrome-tab" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 497.401 497.401"><g><path d="M478.742 154.382H320.714c28.366 21.765 47.111 55.717 47.111 94.307 0 30.63-14.345 56.386-30.933 79.445-28.322 39.41-95.817 168.878-95.817 168.878 2.567.043 5.026.388 7.636.388 137.341 0 248.69-111.348 248.69-248.69-.022-33.412-6.709-65.229-18.659-94.328z"></path><path d="M248.172 129.619c54.402-.388 217.628-2.049 217.628-2.049C423.24 51.511 342.069 0 248.69 0 170.819 0 101.361 35.829 55.782 91.848l75.972 134.925c10.268-55.113 58.349-96.744 116.418-97.154z"></path><path d="M248.668 367.825c-51.964 0-91.568-35.117-111.974-79.855-20.535-45.018-98.061-171.984-98.061-171.984C14.301 154.425 0 199.832 0 248.69c0 124.744 91.935 227.744 211.696 245.648l77.288-134.019c-12.641 4.615-26.101 7.506-40.316 7.506z"></path><circle cx="248.668" cy="248.711" r="80.416"></circle></g></svg>
                Chrome Tab
      </a>
    </li>
  </ul>

  <div class="clock-container">
    <emitting-analog-clock v-if="settings.visibleClock" id='main-clock' :size='260' :showDigital="true" class="main-clock"></emitting-analog-clock>
  </div>

  <links :urls="urls" @edit='editLinkItem' @toggle="toggleLinkItem"></links>

  <div class="debug-modes" v-if="settings.debug">
   <button id='delete' v-on:click="deleteUrls">delete</button>
   <button id='format' v-on:click="formatUrls">format</button>
  </div>

  <img class="customize-icon" @click="onclickCustomize" src="./../img/toggle.svg" />

  <customize-dialog ref="customizeDialog" @change="onRequestChangeSettings" :settings="settings"> </customize-dialog>
  <edit-link-dialog @updateItem='updateLinkItem' @deleteItem='deleteLinkItem' ref="editLinkDialog"></edit-link-dialog>
</div>
</template>

<script>
import Vue from 'vue'
import Links from './links';
import EditLinkDialog from './edit-link-dialog';
import CustomizeDialog from './customize-dialog';
import ControlledImage from './controlled-image';
import EmittingAnalogClock from 'vue-emitting-analog-clock';
import getImage, {prefetchImage} from './../unsplash';

const sampleUrls = {
    children: [
      {
        id: "1",
        favicon: '',
        title: 'title',
        url: 'http://localhost',
        parentId: "0",
        index: 0
      },
      {
        id: "2",
        favicon: '',
        title: 'title2',
        url: 'http://localhost2',
        parentId: "0",
        index: 1
      },
      {
        id: "3",
        title: 'dir',
        dir: true,
        open: false,
        children: [
          {
            id: "4",
            favicon: '',
            title: 'title4',
            url: 'http://localhost',
            parentId: "3",
            index: 0
          },
          {
            id: "5",
            favicon: '',
            title: 'title5',
            url: 'http://localhost2',
            parentId: "3",
            index: 1
          },
        ]
      }
    ],
    id: "0"
  };

const defaultBackgroundImage = '/img/kyoto1.jpg';

export default {
  name: 'app',
  components: {Links, EditLinkDialog, CustomizeDialog, ControlledImage, EmittingAnalogClock},
  data () {
    return {
      settings: {
        useBookmark: false,
        visibleClock: true,
        debug: true,
        backgroundBlur: false,
        backgroundImage: defaultBackgroundImage,
        backgroundRandomImage: true
      },
      urls: {
        children: []
      },
      editLinkDialog: null,
      editingItem: {},
      extensionEnv: !!chrome.storage,
      visible: false
    }
  },
  created () {
    this.getStorage('settings').then(settings => {
      console.log('settings get', settings);
      if (settings) {
        settings.backgroundImage = settings.nextBackgroundImage || defaultBackgroundImage
        Vue.set(this, 'settings', settings);
      }
      
      if (this.settings.backgroundRandomImage) {
        setTimeout( () => {
          var randomWord = Array.from(Array(2)).map(i => Math.floor(Math.random()*26) + 97 ).map(i => String.fromCharCode(i)).join('');
          console.log(randomWord)
          getImage(randomWord, Math.random()*100).then(url => {
            this.settings.nextBackgroundImage = url;
            prefetchImage(url).then(buffer => console.log(buffer));
            this.setStorage('settings', this.settings);
          }).catch(e => {
            console.error(e)
          })
        }, 5000);
      }
    });

    this.getStorage('urls', sampleUrls).then(urls => {
      if (!urls) {
        urls = sampleUrls;
      }
      console.log('updated', urls)
      this.urls = urls;
    });
    if(this.extensionEnv){

      chrome.storage.onChanged.addListener((data => {
        if (data.urls){
          this.urls = data.urls.newValue;
        }
        if (data.settings) {
          // Vue.set(this, 'settings', data.settings.newValue);
        }
      }));

      if (this.useBookmark) {
        this.readBookmark();
      }
      /*
      chrome.contextMenus.create({  
        title: "コンテキストメニューを追加",
        contexts: ["all"],
        type: "normal",
        onclick: function (info) {
            console.log(info);
        }
      });
      */
     
    }
  },
  mounted () {
  },
  methods: {
    getStorage (key, defaultValue) {
      if (!this.extensionEnv) {
        return Promise.resolve(defaultValue);
      }
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, (data) => {
          resolve(data[key]);
        });
      })
    },
    setStorage (key, value) {
      if (!this.extensionEnv) {
        return Promise.resolve(value);
      }
      return new Promise((resolve, reject) => {
        chrome.storage.sync.set({[key]: value}, () => {
          resolve();
        });
      });
    },
    deleteUrls () {
      this.updateUrls({children: []});
    },
    formatUrls () {
      this.urls.children.forEach((item, index) => {
        item.id = index + 1;
      });
      this.setStorage('urls', this.urls);
    },
    updateUrls (urls) {
      if (!this.extensionEnv) {
        this.urls = urls;
        return;
      }
      chrome.storage.sync.set({'urls': urls}, (urls) => {
      });
    },
    getLinkItem (id, searchTarget = this.urls) {
      if (searchTarget.id === id) {
        return searchTarget;
      } else if(searchTarget.children && searchTarget.children.length) {
        var result = searchTarget.children.map(child => this.getLinkItem(id, child)).filter(item => !!item)
        return result.length === 1 ? result[0] : null;
      }
      return null;
    },
    updateLinkItem ({url, title}) {
      this.editingItem.url = url;
      this.editingItem.title = title;
      this.updateUrls(this.urls);
      this.editingItem = null;
    },
    deleteLinkItem () {
      var parent = this.getLinkItem(this.editingItem.parentId);
      parent.children.splice(parent.children.indexOf(this.editingItem) ,1);
      this.updateUrls(this.urls);
    },
    editLinkItem (id) {
      console.log(id)
      this.editingItem = this.getLinkItem(id);
     
      // Vue.set(this, 'editingItem', this.urls[key]);
      console.log('key', this.editingItem);
      this.$refs.editLinkDialog.open(this.editingItem);

    },
    toggleLinkItem (id) {
      console.log(id, 'toggle')
      var item = this.getLinkItem(id);
      item.open = !item.open;
      console.log(this.urls, item, item.open);

    },
    onclickCustomize () {
      this.$refs.customizeDialog.open();
    },
    onloadBackground (){
      this.visible = true;
    },
    onfailedBackground () {
      console.log('failed')
      this.settings.backgroundImage = defaultBackgroundImage
    },
    readBookmark () {
      chrome.bookmarks.getTree((data) => {
        console.log('bookmark', data);
        return;
        this.urls = data[0];
        decorate(this.urls);
        function decorate (items){
          items.children.map(item => {
            if (item.children) {
              Vue.set(item, 'dir', true);
              Vue.set(item, 'open', false);
              decorate(item);
            } else {
              item.favicon = 'chrome://favicon/' + item.url;
            }
          });
        }
      });
    },
    onRequestChangeSettings (newSettings) {
      for (var key in newSettings) {
        this.settings[key] = newSettings[key];
      }
      this.setStorage('settings', this.settings).then(() => {
        console.log('set item settings', this.settings);
      });
    }
  }
}
</script>
<style lang="scss">
.links {
  height: 100%;
}

.bg-image {
  position: absolute;
  top: 0;
  z-index: -1;

  &.blur {
    filter: blur(2px);
  }
}
.header {
  
  .header-icon {
    width: 20px;
    height: 20px;
    text-decoration: none;
    color: #0c0c0c;
    background-color: #d2d2d2;
    line-height: 20px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
}

.clock-container {
  height: 260px;
}
.link-items {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 10px 0;
}

.main-clock {
  opacity: 0.85;
}

.customize-icon {
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 10px;
  left: 10px;
}
</style>

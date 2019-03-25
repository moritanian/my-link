<template>
<div class='links' v-show="visible">
  <controlled-image class="bg-image" url='/img/kyoto1.jpg' @load="onloadBackground"> </controlled-image>
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
  <emitting-analog-clock id='main-clock' :size='260' :showDigital="true" class="main-clock"></emitting-analog-clock>
  
  <links :urls="urls" @edit='editLinkItem' @toggle="toggleLinkItem"></links>
  <button id='delete' v-on:click="deleteUrls">delete</button>
  
  <img class="customize-icon" @click="onclickCustomize" src="./../img/toggle.svg" />

  <customize-dialog ref="customizeDialog"> </customize-dialog>
  <edit-link-dialog @updateItem='updateLinkItem' @deleteItem='deleteLinkItem' ref="editLinkDialog"></edit-link-dialog>
</div>
</template>

<script>
import Vue from 'vue'
import Links from './links';
import EditLinkDialog from './edit-link-dialog';
import CustomizeDialog from './customize-dialog';
import ControlledImage from './controlled-image';
import EmittingAnalogClock from './emitting-analog-clock';

export default {
  name: 'app',
  components: {Links, EditLinkDialog, CustomizeDialog, ControlledImage, EmittingAnalogClock},
  data () {
    return {
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
    if(this.extensionEnv){
      chrome.storage.sync.get('urls', (data) => {
        console.log('updated', data.urls)
        this.urls = data.urls;
      });

      chrome.storage.onChanged.addListener((data => {
        this.urls = data.urls.newValue;
      }));

      chrome.bookmarks.getTree((data) => {
        console.log('bookmark', data);
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
     
    } else {
      // For test
      this.urls = {
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
      }
    }
  },
  mounted () {
  },
  methods: {
    deleteUrls () {
      this.updateUrls({children: []});
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
      parent.children.splice(this.editingItem.index ,1)
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
      console.log(this.$refs)
      this.$refs.customizeDialog.open();
    },
    onloadBackground (){
      console.log('onload background');
      this.visible = true;
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

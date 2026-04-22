<template>
  <v-container
    style="max-width: 1500px; padding-left: 0; padding-right: 0; padding-top: 0"
    class="wraper"
    :class="this.$store.state.globalSpinner ? 'no-scroll' : ''"
  >

      <div
        style="position: fixed; z-index: 99999; right: 20px; top: 20px; max-width: 400px"
      >
        <v-alert
          v-for="notification in this.$store.state.notifications"
          :text="notification.text"
          :title="notification.title"
          :type="notification.type"
          class="mb-3 elevation-5 text-left"
        ></v-alert>
      </div>

      <div class="globalSpinnerWraper" v-if="this.$store.state.globalSpinner">
        <v-progress-circular
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>

    <v-dialog
      v-model="openPopupProps"
      width="auto"
    >
      <v-card
        max-width="400"
        prepend-icon="mdi-cursor-default-click"
        title="Список промптов"
      >
        <!-- <template v-slot:actions> -->
          <!-- <v-btn
            class="ms-auto"
            text="Закрыть"
            @click="openPopupProps = false"
          ></v-btn> -->
        <!-- </template> -->

        <v-btn @click="defaultProps(1)">
          Простая форма
        </v-btn>
      </v-card>
    </v-dialog>

    <Navbar  :scrollToElement="() => this.scrollToElement()" :key="this.$store.state.componentKey" />
    <v-row class="ma-0 mt-3" style="display: flex; justify-content: space-around; position: relative; overflow: hidden;">
      
      <v-col cols="12" xm="12" md="4" class="pa-2 " align-self="end" style="display: flex; flex-direction: column; " v-if="this.$store.state.collapse">
        <div class="chatWrap" ref="bottomElementRef" v-if="this.$store.state.show_history" :style="{marginBottom : (!(this.$store.state.screen_width < 960) ? '173px' : '15px')}">
          <div v-for="(item, index) in this.$store.state.history" :key="index">
            <Chat :scrollToElement="() => this.scrollToElement()" :key="this.$store.state.componentKey" :number="index" />
          </div>
        </div>
         <div class="chatWrap" ref="bottomElementHistoryRef" v-if="!this.$store.state.show_history" :style="{marginBottom : (!(this.$store.state.screen_width < 960) ? '173px' : '15px')}">
          <div v-for="(item, index) in this.$store.state.history" :key="index">
            <History :scrollToElement="() => this.scrollToElement()" :key="this.$store.state.componentKey" :number="index" />
          </div>
        </div>

        <div class="textfieldPrompt" :style="{position : (this.$store.state.show_history && this.$store.state.screen_width < 960) || this.$store.state.screen_width < 960 ? 'relative' : 'absolute'}">
          <!-- <v-textarea
            bg-color="grey-lighten-2"
            @click.right.prevent="triggerFileInput"
            color="primary"
            label="Введите ваш промт"
            v-model="this.$store.state.prompt"
            :style="{height : this.$store.state.show_history || this.$store.state.screen_width < 960 ? '' : '68vh'}"
          ></v-textarea> -->
          <!-- <froala 
            id="edit" 
            :tag="'textarea'" 
            :config="config" 
            v-model:value="this.$store.state.prompt" 
            height="68vh"
            :style="{minHeight : '68vh'}"
          >
          </froala> -->

          <!-- <tinymce id="d1" api-key="d1fowt1qg1b5b0zhq963qisa783lq0t8z7z0jk1cgyiruwsx" v-model="myPrompt"  :other_options="options" :plugins="['image']" toolbar1='image'></tinymce> -->
          

           <Editor
              api-key="d1fowt1qg1b5b0zhq963qisa783lq0t8z7z0jk1cgyiruwsx"
              :init="options"
              v-model="myPrompt"
            />

          <v-btn icon="mdi-arrow-up" :disabled="this.$store.state.disable_send_button" class="px-0 bg-primary buttonSend" @click="this.$store.dispatch('getCode', {scrollElement: () => this.scrollToElement()}); this.$store.state.prompt = ''"></v-btn>
          
          <!-- <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;" /> -->
          <button @click="openPopupProps = true" class="buttonDefaultProps"><v-icon size="small" icon="mdi-cursor-default-click"></v-icon>Выбрать промпт</button>
        </div>
      </v-col>  

      <v-col cols="12" xm="12" :md="this.$store.state.collapse ? '7' : '11'" class="pa-2 border-sm viewField" :style="(!this.$store.state.show_history && this.$store.state.screen_width < 960) || this.$store.state.screen_width < 960 ? 'margin-top: 0' : ''">
        <iframe class="resultIframe" :class="this.$store.state.show_mobil ? 'resultIframeMobilSize' : ''" frameborder="0" :srcdoc="iframeContent" v-if="!this.$store.state.show_code && (!this.$store.state.disable_send_button || this.$store.state.text)"></iframe>

        <prism-editor
          class="my-editor"
          :key="this.$store.state.componentKey"
          style="width: 100%;"
          v-if="this.$store.state.show_code && (!this.$store.state.disable_send_button || this.$store.state.text)"
          v-model="this.$store.state.text" :highlight="highlighter"
          line-numbers
        >
        </prism-editor>


        <v-progress-circular
          v-if="this.$store.state.disable_send_button && !this.$store.state.text"
          color="primary"
          indeterminate
          :size="53"
          :width="9"
          style="margin: auto; margin-top: 49%;"
        ></v-progress-circular>
      </v-col> 
    </v-row>    
  </v-container>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import History from "@/components/History.vue";
import Chat from "@/components/Chat.vue";

import Editor from '@tinymce/tinymce-vue'

// import Prism Editor
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles

export default {
  name: "MainLayout",
  data: () => ({
    width: window.innerWidth,
    code: 'console.log("Hello World")',
    openPopupProps: false,

    options: {
      menubar: false,
      // statusbar: false,
      toolbar: false,
      plugins: 'image',
      image_title: true,
      automatic_uploads: true,
      file_picker_types: 'image',
      statusbar: 'custom_button',
      // skin: 'borderless',
      inline_boundaries: false,

      setup: function(editor) {
        editor.on('init', function() {
          // Create a custom button element
          var customButton = document.createElement('button');
          customButton.textContent = 'My Status Button';
          customButton.className = 'mce-widget mce-btn myMceButton'; // Apply TinyMCE button styling
          customButton.innerHTML = '<i class="mce-ico mce-i-image"></i>'
          customButton.onclick = function() {
            editor.execCommand('mceImage');
          };

          // Find the status bar and append the button
          var statusBar = editor.getContainer().querySelector('.mce-statusbar'); // For TinyMCE 6+
          // For older versions, you might need to target a different class like '.mce-statusbar'
          if (statusBar) {
            statusBar.appendChild(customButton);
          }
        });
      },

      file_picker_callback: function (cb, value, meta) {
      var input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');

      /*
        Note: In modern browsers input[type="file"] is functional without
        even adding it to the DOM, but that might not be the case in some older
        or quirky browsers like IE, so you might want to add it to the DOM
        just in case, and visually hide it. And do not forget do remove it
        once you do not need it anymore.
      */

      input.onchange = function () {
        var file = this.files[0];

        var reader = new FileReader();
        reader.onload = function () {
          /*
            Note: Now we need to register the blob in TinyMCEs image blob
            registry. In the next release this part hopefully won't be
            necessary, as we are looking to handle it internally.
          */
          var id = 'blobid' + (new Date()).getTime();
          var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
          var base64 = reader.result.split(',')[1];
          var blobInfo = blobCache.create(id, file, base64);
          blobCache.add(blobInfo);

          /* call the callback and populate the Title field with the file name */
          cb(blobInfo.blobUri(), { title: file.name });
        };
        reader.readAsDataURL(file);
      };

      input.click();
    },
    },

    config: {
        events: {
          initialized: function () {
            console.log('initialized')
          }
        },
        toolbarButtons: [['insertImage']],
        toolbarBottom: true,
        wordCounterCount: false,
        charCounterCount: false,
        quickInsertEnabled: false,
        placeholderText: 'Введите ваш промпт',
        height: 120
      },
      model: 'Edit Your Content Here!'
  }),

  computed: {
    iframeContent() {
      const text = this.$store.state.text;
      if (!text) return '';

      const trimmed = text.trim();
      // Return plain HTML as-is
      if (trimmed.startsWith('<!') || trimmed.toLowerCase().startsWith('<html')) {
        return text;
      }
      // Not a Vue SFC if there's no <template> block
      if (!trimmed.includes('<template>')) {
        return text;
      }

      const templateMatch = text.match(/<template>([\s\S]*)<\/template>/);
      const scriptMatch = text.match(/<script(?!\s+src)[^>]*>([\s\S]*?)<\/script>/);
      const styleMatch = text.match(/<style[^>]*>([\s\S]*?)<\/style>/);

      const template = templateMatch ? templateMatch[1].trim() : '<div></div>';
      const script = scriptMatch ? scriptMatch[1].trim() : '';
      const style = styleMatch ? styleMatch[1].trim() : '';

      const processedScript = script
        .replace(/^\s*import\s+.+from\s+['"].+['"]\s*;?\s*$/gm, '')
        .replace(/export\s+default\s+/, 'const __component = ');

      return [
        '<!DOCTYPE html><html><head>',
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<script src="https://unpkg.com/vue@3/dist/vue.global.js"><\/script>',
        '<style>' + style + '<\/style>',
        '</head><body>',
        '<div id="app"></div>',
        '<script>',
        '(function() {',
        '  try {',
        processedScript,
        '    var __opts = typeof __component !== "undefined" ? __component : {};',
        '    __opts.template = ' + JSON.stringify(template) + ';',
        '    Vue.createApp(__opts).mount("#app");',
        '  } catch(e) {',
        '    document.body.innerHTML = "<pre style=\'color:red\'>" + e.message + "</pre>";',
        '  }',
        '})();',
        '<\/script>',
        '</body></html>'
      ].join('\n');
    },

    myPrompt: {
      get() {
        return this.$store.state.prompt
      },
      set(newValue) {
        console.log('newValue', newValue)
        this.$store.state.prompt = newValue
      }
    }
  },
  components: {
    Navbar,
    History,
    Chat,
    PrismEditor,
    Editor
  },
  methods: {
      highlighter(code) {
        return highlight(code, languages.js); // languages.<insert language> to return html with markup
      },

      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      handleFileChange(event) {
        this.selectedFile = event.target.files[0];
        // You can now do something with the selected file,
        // like uploading it to a server or processing it locally.
        console.log('File selected:', this.selectedFile);
      },
      defaultProps(item = 1) {
        const list = {
          // 1: "Simple page with form where has field for phone and atribute name=phone. Language for page is russion"
          1: "Страница с формой обратной связи, где есть обязательное поле  для ввода телефона с name=phone и поле для сообщений с name=message"
        }

        this.openPopupProps = false
        this.$store.state.prompt = list[item]
      },
      scrollToElement() {
        const el = this.$refs.bottomElementRef;

        if (el) {
          console.log('el', el.scrollHeight)
          el.scrollTo(0, el.scrollHeight);
        }

        const elHistory = this.$refs.bottomElementHistoryRef;

        if (elHistory) {
          console.log('elHistory', elHistory.scrollHeight)
          elHistory.scrollTo(0, elHistory.scrollHeight);
        }
      }
    },

  mounted() {
    let id = 0

    if (document.body.getAttribute('aiid') != null) {
      id = document.body.getAttribute('aiid')
    } else {
      let path = window.location.pathname;
      let pathArray = path.split('/').filter(Boolean);
      id = pathArray[pathArray.length - 2];
    }

    console.log('isId', id)
    
    // this.$store.state.is_admin = window.location.href.includes('admin');

    let payload = {
      id: id,
      activeCard: null,
      scrollElement: () => this.scrollToElement()
    }
    // if (typeof(token) != 'undefined' && token.length > 4) {
      this.$store.dispatch('getData', payload)
    // }

    this.scrollToElement()

    let that = this

    window.onresize = displayWindowSize;
    window.onload = displayWindowSize;

    function displayWindowSize() {
      that.$store.state.screen_width = window.innerWidth;

      const el = that.$refs.bottomElementRef;

      if (el) {
        console.log('el2', el.scrollHeight)
        el.scrollTo(0, el.scrollHeight);
      }

      const elHistory = that.$refs.bottomElementHistoryRef;

      if (elHistory) {
        console.log('elHistory', elHistory.scrollHeight)
        elHistory.scrollTo(0, elHistory.scrollHeight);
      }
    };
  },
  created() {
    this.unwatch = this.$store.watch(
      (state) => state.prompt, // Function that returns the value to watch
      (newValue, oldValue) => {
        console.log('Old Value:', oldValue);
        console.log('New Value:', newValue);
      },
      // Optional deep: true option
      { deep: true }
    );
  },
  beforeDestroy() {
    this.unwatch(); // Stop watching when the component is destroyed
  }
};
</script>

<style lang="scss">
  .myMceButton {
    position: absolute !important;
    top: 5px;
    left: 13px;

  }

  .mce-branding {
    display: none !important;
  }

  .mce-container {
    border: 0px !important;
  }

  #mceu_1, #mceu_2, #mceu_3 {
    border-radius: 20px;
  }

  #mceu_3 {
    margin-left: 3px;
  }

  #mceu_0-body {
    border: 1px solid gray;
    border-radius: 20px;
  }

  #mceu_0 {
    box-shadow: unset;
  }

  .mce-path-item, .mce-path .mce-divider {
    color: white !important;
  }

  .textfieldPrompt {
    max-width: 33.3333333333%;
    position: absolute;
    bottom: 0px;
    // bottom: -21px;
    width: 98vw;

    @media only screen and (max-width: 960px) {
            max-width: calc(103% - 15px);
        }
  }
  .chatWrap {
    height: 67vh;
    overflow-y: scroll;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    scrollbar-width: none;
    margin-top: -245px;

    @media only screen and (max-width: 960px) {
      height: 55vh;
      margin-top: 0;
    }
  }

  .buttonSend {
    position: absolute !important;
    right: 7px;
    top: 7px;
    z-index: 9999;
  }

  .viewField {
    height: 88vh;
    overflow-y: scroll;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    scrollbar-width: none; /* For Firefox */

    @media only screen and (max-width: 960px) {
      margin-top: 21vh;
      max-width: 98vw !important;
    }
  }

  .resultIframe {
    width: 100%;
    height: 100%;
  }

  .resultIframeMobilSize {
    max-height: 844px;
    max-width: 390px;
  }

.v-field__field {
  background: white;
}

.v-field-label {
  font-weight: 400;
}

.activeButton {
    height: auto !important;
    background: white !important;
    margin: 2px !important;
    border-radius: 3px !important;
}

.buttonDefaultProps {
  position: absolute;
  z-index: 30;
  bottom: 9px;
  left: 52px;
  // border: 1px solid #333333;
  border-radius: 4px;
  color: #333333;
  padding: 1px;
  padding-right: 4px;
  font-size: 9px;
  background-color: #e9e9e9; 
}
.fr-newline {
  display: none !important;
}
.fr-desktop .fr-command:hover:not(.fr-table-cell) {
  background: white !important;
}

button:focus {
      outline: none !important;
}

.fr-sticky-on {
    position: absolute !important;
}

.globalSpinnerWraper {
    position: absolute;
    z-index: 9999999;
    background: #ffffff8a;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

  .no-scroll {
      overflow: hidden !important;
      height: 100vh !important;
  }
</style>
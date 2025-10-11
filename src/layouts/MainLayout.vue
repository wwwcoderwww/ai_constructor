<template>
  <v-container
    style="max-width: 1500px; padding-left: 0; padding-right: 0; padding-top: 0"
    class="wraper"
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

    <Navbar  :key="this.$store.state.componentKey" />
    <v-row class="ma-0 mt-3" style="display: flex; justify-content: space-around; position: relative; overflow: hidden;">
      
      <v-col cols="12" xm="12" md="4" class="pa-2 " align-self="end" style="display: flex; flex-direction: column; " v-if="this.$store.state.collapse">
        <div class="chatWrap" v-if="this.$store.state.show_history" :style="{marginBottom : (!(this.$store.state.screen_width < 960) ? '180px' : '30px')}">
          <div v-for="(item, index) in this.$store.state.history" :key="index">
            <History  :key="this.$store.state.componentKey" :number="index" />
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
          <froala 
            id="edit" 
            :tag="'textarea'" 
            :config="config" 
            v-model:value="this.$store.state.prompt" 
            :style="{height : this.$store.state.show_history || this.$store.state.screen_width < 960 ? '' : '68vh'}"
          >
          </froala>
          
          <v-btn icon="mdi-arrow-up" :disabled="this.$store.state.disable_send_button" class="px-0 bg-primary buttonSend" @click="this.$store.dispatch('getCode'); this.$store.state.prompt = ''"></v-btn>
          
          <!-- <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;" /> -->
          <button @click="openPopupProps = true" class="buttonDefaultProps"><v-icon size="small" icon="mdi-cursor-default-click"></v-icon>Выбрать промпт</button>
        </div>
      </v-col>  

      <v-col cols="12" xm="12" :md="this.$store.state.collapse ? '7' : '11'" class="pa-2 border-sm viewField" :style="(!this.$store.state.show_history && this.$store.state.screen_width < 960) || this.$store.state.screen_width < 960 ? 'margin-top: 0' : ''">
        <iframe class="resultIframe" :class="this.$store.state.show_mobil ? 'resultIframeMobilSize' : ''" frameborder="0" :srcdoc="this.$store.state.text" v-if="!this.$store.state.show_code && !this.$store.state.disable_send_button"></iframe>

        <prism-editor 
          class="my-editor" 
          :key="this.$store.state.componentKey"
          style="width: 100%;"
          v-if="this.$store.state.show_code && !this.$store.state.disable_send_button"
          v-model="this.$store.state.text" :highlight="highlighter" 
          line-numbers
        >
        </prism-editor>


        <v-progress-circular
          v-if="this.$store.state.disable_send_button"
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
        placeholderText: 'Введите ваш промпт'
      },
      model: 'Edit Your Content Here!'
  }),

  components: {
    Navbar,
    History,
    PrismEditor
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
      activeCard: null
    }
    // if (typeof(token) != 'undefined' && token.length > 4) {
      this.$store.dispatch('getData', payload)
    // }

    let that = this

    window.onresize = displayWindowSize;
    window.onload = displayWindowSize;

    function displayWindowSize() {
      that.$store.state.screen_width = window.innerWidth;
    };
  }
};
</script>

<style lang="scss">
  .textfieldPrompt {
    max-width: 33.3333333333%;
    position: absolute;
    bottom: 0px;
    // bottom: -21px;
    width: 98vw;

    @media only screen and (max-width: 960px) {
            max-width: calc(100vw - 15px);
        }
  }
  .chatWrap {
    height: 88vh;
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
  bottom: 17px;
  left: 52px;
  border: 2px solid #333333;
  border-radius: 4px;
  color: #333333;
  padding-right: 4px;
  font-size: 9px;
}
.fr-newline {
  display: none !important;
}
.fr-desktop .fr-command:hover:not(.fr-table-cell) {
  background: white !important;
}
</style>
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

    <Navbar />
    <v-row class="ma-0 mt-3" style="display: flex; justify-content: space-around;">
      
      <v-col cols="12" xm="12" md="4" class="pa-2 " align-self="end" style="display: flex; flex-direction: column" v-if="this.$store.state.collapse">
        <div class="chatWrap" v-if="this.$store.state.show_history">
          <div v-for="(item, index) in this.$store.state.history" :key="index">
            <History :number="index" />
          </div>
        </div>

        <div class="textfieldPrompt" :style="{position : (!this.$store.state.show_history && this.$store.state.screen_width < 960)  ? 'relative' : 'absolute'}">
        <v-textarea
          bg-color="grey-lighten-2"
          color="primary"
          label="Ваш промпт"
          v-model="this.$store.state.prompt"
          :style="{height : this.$store.state.show_history || this.$store.state.screen_width < 960 ? '' : '68vh'}"
        ></v-textarea>
        <v-btn icon="mdi-arrow-up" :disabled="this.$store.state.disable_send_button" class="px-0 bg-primary buttonSend" @click="this.$store.dispatch('getCode')"></v-btn>
        </div>
      </v-col>  

      <v-col cols="12" xm="12" :md="this.$store.state.collapse ? '7' : '11'" class="pa-2 border-sm viewField" :style="!this.$store.state.show_history && this.$store.state.screen_width < 960 ? 'margin-top: 0' : ''">
        <iframe class="resultIframe" :class="this.$store.state.show_mobil ? 'resultIframeMobilSize' : ''" frameborder="0" :srcdoc="this.$store.state.text" v-if="!this.$store.state.show_code && !this.$store.state.disable_send_button"></iframe>

        <VCodeBlock
          v-if="this.$store.state.show_code && !this.$store.state.disable_send_button"
          :code="this.$store.state.text"
          lang="html"
          theme="okaidia"
          :prismjs='true'
          style="width: 100%;"
        ></VCodeBlock>

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
import { VCodeBlock } from '@wdns/vue-code-block';

export default {
  name: "MainLayout",
  data: () => ({
    width: window.innerWidth
  }),

  components: {
    Navbar,
    History,
    VCodeBlock
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
    bottom: -14px;
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

    @media only screen and (max-width: 960px) {
      height: 55vh;
    }
  }

  .buttonSend {
    position: absolute !important;
    right: 7px;
    top: 7px;
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
</style>
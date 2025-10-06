<template>
  <v-container
    style="max-width: 1500px; padding-left: 0; padding-right: 0; padding-top: 0"
    class="wraper"
  >
    <Navbar />
    <v-row class="ma-0 mt-3 d-flex justify-space-beetvin" >
      
      <v-col cols="12" xm="12" md="4" class="pa-2 " align-self="end" style="display: flex; flex-direction: column">
        <div class="chatWrap">
          <div v-for="(item, index) in this.$store.state.history" :key="index">
            <History :number="index" />
          </div>
        </div>
        <div class="textfieldPrompt">
        <v-textarea
          bg-color="grey-lighten-2"
          color="primary"
          label="Ваш промпт"
        ></v-textarea>
        <v-btn icon="mdi-arrow-up" variant="plain" class="px-0 bg-primary buttonSend"></v-btn>
        </div>
      </v-col>  

      <!-- <v-col cols="12" xm="12" md="7" class="pa-2 border-sm"> -->
        
      <!-- </v-col>  -->
    </v-row>    
  </v-container>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import History from "@/components/History.vue";

export default {
  name: "MainLayout",
  data: () => ({
  }),

  components: {
    Navbar,
    History
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
    height: 66vh;
    overflow-y: scroll;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;

    @media only screen and (max-width: 960px) {
      height: 55vh;
    }
  }

  .buttonSend {
    position: absolute;
    right: 7px;
    top: 7px;
  }
</style>
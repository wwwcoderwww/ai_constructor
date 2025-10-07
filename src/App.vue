<template>
  <main-layout>
    <v-container>
      
      <v-row>
        <v-col cols="12" sm="12" md="6">
          <!-- <HeaderAndBody /> -->
        </v-col>
      </v-row>
    </v-container>
    <router-view />
  </main-layout>
</template>

<script>
import MainLayout from "@/layouts/MainLayout.vue";

// export default defineComponent({
//   setup() {

//   },
// })
export default {
  components: {
    MainLayout,
  },
};
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 100%;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.tox-statusbar__text-container {
  display: none !important;
}
.tox-statusbar__resize-handle {
  width: 100% !important;
}
</style>

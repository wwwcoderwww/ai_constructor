import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VueSocials from 'vue-socials';

import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App)
    .use(store)
    .use(router)
    .use(vuetify);

app.use(VueSocials)

app.config.globalProperties.window = window

app.mount('#app')

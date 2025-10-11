<template>
    <v-btn variant="plain" size="small" value="render" @click="openDialog = true" style="rgb(44, 62, 80)">Поделиться</v-btn>

    <v-dialog
      v-model="openDialog"
      width="600"
    >
      <v-card
        max-width="600"
        title="Поделиться"
        style="justify-content: start;"
      >
        <template v-slot:actions>
            <div class="py-4 px-4">
            <v-row class="px-4 mb-9" justify="space-around">
                <SFacebook
                    :window-features="windowFeatures"
                    :share-options="shareOptions"
                    :use-native-behavior="useNativeBehavior"
                    @popup-close="onClose"
                    @popup-open="onOpen"
                    @popup-block="onBlock"
                    @popup-focus="onFocus"
                >
                   <img src="https://raw.githubusercontent.com/webistomin/vue-socials/main/assets/icons/facebook.svg" width="23" height="23" style="max-width: 100%;">
                </SFacebook>
                <SVkontakte
                    :window-features="windowFeatures"
                    :share-options="shareOptions"
                    :use-native-behavior="useNativeBehavior"
                    @popup-close="onClose"
                    @popup-open="onOpen"
                    @popup-block="onBlock"
                    @popup-focus="onFocus"
                >
                   <img src="https://raw.githubusercontent.com/webistomin/vue-socials/main/assets/icons/vkontakte.svg" width="23" height="23" style="max-width: 100%;">
                </SVkontakte>
                <SOdnoklassniki
                    :window-features="windowFeatures"
                    :share-options="shareOptions"
                    :use-native-behavior="useNativeBehavior"
                    @popup-close="onClose"
                    @popup-open="onOpen"
                    @popup-block="onBlock"
                    @popup-focus="onFocus"
                >
                    <img src="https://raw.githubusercontent.com/webistomin/vue-socials/main/assets/icons/odnoklassniki.svg" width="23" height="23" style="max-width: 100%;">
                </SOdnoklassniki>
                <STelegram
                    :window-features="windowFeatures"
                    :share-options="shareOptions"
                    :use-native-behavior="useNativeBehavior"
                    @popup-close="onClose"
                    @popup-open="onOpen"
                    @popup-block="onBlock"
                    @popup-focus="onFocus"
                >
                    <img src="https://raw.githubusercontent.com/webistomin/vue-socials/main/assets/icons/telegram.svg" width="23" height="23" style="max-width: 100%;">
                </STelegram>
                <SViber
                    :window-features="windowFeatures"
                    :share-options="shareOptions"
                    :use-native-behavior="useNativeBehavior"
                    @popup-close="onClose"
                    @popup-open="onOpen"
                    @popup-block="onBlock"
                    @popup-focus="onFocus"
                >
                    <img src="https://raw.githubusercontent.com/webistomin/vue-socials/main/assets/icons/viber.svg" width="23" height="23" style="max-width: 100%;">
                </SViber>
                <SWhatsApp
                    :window-features="windowFeatures"
                    :share-options="shareOptions"
                    :use-native-behavior="useNativeBehavior"
                    @popup-close="onClose"
                    @popup-open="onOpen"
                    @popup-block="onBlock"
                    @popup-focus="onFocus"
                >
                    <img src="https://raw.githubusercontent.com/webistomin/vue-socials/main/assets/icons/whatsapp.svg" width="23" height="23" style="max-width: 100%;">
                </SWhatsApp>

            </v-row>

            
            <div class="px-4" justify="start">
                Url &nbsp;&nbsp; <code>https://leadpushka.ru/ai/landing/{{this.$store.state.token}}</code>
            </div>
            </div>
            

            <!-- <v-btn
                class="ms-auto"
                text="Закрыть"
                @click="openDialog = false"
            ></v-btn> -->
        </template>
      </v-card>
    </v-dialog>
</template>

<script>
import { SOdnoklassniki, SFacebook, STelegram, SWhatsApp, SViber, SVkontakte } from 'vue-socials'

export default {
    name: 'Share',
    components: {
        SOdnoklassniki, SFacebook, STelegram, SWhatsApp, SViber, SVkontakte
    },
    data: () => ({
        windowFeatures: {},
        
        useNativeBehavior: false,

        openDialog: false,
        
    }),
    methods: {
        onClose() {},
        onOpen() {},
        onBlock() {},
        onFocus() {},
        collapse() {
            this.$store.state.collapse = !this.$store.state.collapse
        },
        showHistory() {
            this.$store.state.show_history = !this.$store.state.show_history
        },
        shareContent() {
            if (navigator.share) {
            navigator.share({
                title: 'Share this page',
                text: 'Check out this awesome content!',
                url: window.location.href, // Or a specific URL
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
            } else {
            // Fallback for browsers that don't support navigator.share
            alert('Your browser does not support the share API.');
            }
        }
    },
    computed: {
        shareOptions() {
            return { 
            url: 'https://leadpushka.ru/ai/landing/' + this.$store.state.token, 
            title: 'Leadpushka', 
            text: '',
            }
        } 
    }
}
</script>

<style lang="scss">
    .select-model {
        max-width: 200px;

        @media only screen and (max-width: 960px) {
            max-width: 85%;
        }
    }
    
    .v-btn__content {
         font-size: 12px;
        text-transform: capitalize;
        letter-spacing: 1px;
    }

    .v-card-actions {
        justify-content: start !important;
    }
</style>
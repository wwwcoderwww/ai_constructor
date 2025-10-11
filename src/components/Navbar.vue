<template>
    <v-row no-gutters  justify="space-between" align="center" class="border-md-b-sm">
        <v-col cols="12" md="3" sm="12" class="d-flex" style="margin-top: 15px">
            <v-btn icon="mdi-arrow-left" variant="plain" size="small" @click="window.history.back()"></v-btn>

            <v-select align="center"
                label="Модель"
                v-model="this.$store.state.model_id"
                :items="this.$store.state.models"
                item-title="name"
                item-value="id"
                variant="outlined"
                density="compact"
                class="select-model"
                >
            </v-select>
        </v-col>

        <v-col cols="12" sm="12" md="6" class="d-flex">
                <v-btn icon="mdi-history" size="small" variant="plain" class="px-0" @click="showHistory"></v-btn>
                
                <v-dialog max-width="500">
                    <template v-slot:activator="{ props: activatorProps }">           
                        <v-btn v-bind="activatorProps" icon="mdi-help-circle-outline" variant="plain" size="small"></v-btn>
                    </template>

                  <template v-slot:default="{ isActive }">
                        <v-card title="FAQ">
                        <v-card-text>
                            Часто задаваемые вопросы
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn
                            text="Закрыть"
                            @click="isActive.value = false"
                            ></v-btn>
                        </v-card-actions>
                        </v-card>
                    </template>
                </v-dialog>

                <v-btn icon="mdi-arrow-collapse-left" variant="plain" size="small" v-if="this.$store.state.collapse" @click="collapse"></v-btn>
                <v-btn icon="mdi-arrow-collapse-right" variant="plain" size="small" v-if="!this.$store.state.collapse" @click="collapse"></v-btn>
                <v-btn-toggle border v-model="this.$store.state.show_code" mandatory  size="small" style="max-height: 38px">
                    <v-btn :class="this.$store.state.show_code ? '' : 'activeButton'" variant="plain" size="small">Просмотр</v-btn>
                    <v-btn :class="!this.$store.state.show_code ? '' : 'activeButton'" variant="plain" size="small">Код</v-btn>
                </v-btn-toggle>
                <v-btn icon="mdi-autorenew" variant="plain" size="small" @click="reload()"></v-btn>
                <v-btn-toggle border v-model="this.$store.state.show_mobil" size="small" style="max-height:38px" class="d-md-flex d-none">
                    <v-btn :class="this.$store.state.show_mobil ? '' : 'activeButton'" size="small"  variant="plain" icon="mdi-monitor"></v-btn>
                    <v-btn :class="!this.$store.state.show_mobil ? '' : 'activeButton'" size="small"  variant="plain" icon="mdi-cellphone"></v-btn>
                </v-btn-toggle>
        </v-col>

        <v-col cols="12" sm="12" md="3" class="d-flex align-center ml-3 mt-4 mt-md-0 ml-md-0">
            <v-btn-toggle border v-model="view_monitor" size="small" style="max-height:38px" class="d-md-none d-flex">
                <v-btn size="small"  @click="dialog = true" variant="plain" value="monitor" icon="mdi-monitor"></v-btn>
                <v-btn size="small"  variant="plain" value="mobil" icon="mdi-cellphone"></v-btn>
            </v-btn-toggle>

            <Share />
            <v-btn value="code" class="bg-primary" @click="this.$store.dispatch('saveLanding')">Сохранить</v-btn>
        </v-col>

    </v-row>
</template>

<script>
import Share from "@/components/Share.vue";

export default {
    name: 'Navbar',
    components: {
        Share
    },
    data: () => ({
        windowFeatures: {},
        shareOptions: { 
          url: 'https://github.com/', 
          title: 'Title', 
          text: 'Text',
        },
        useNativeBehavior: false,

        view_monitor: 'mobil',
        view_format: 'render',
        
    }),
    methods: {
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
        },
        reload() {
            this.$store.state.componentKey = this.$store.state.componentKey + 1;
            this.$store.state.show_code = 0;
            this.$store.state.show_mobil = 0;
        }
    },
    computed: {

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
</style>
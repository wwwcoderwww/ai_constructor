<template>
    <v-row no-gutters  justify="space-between" align="center" class="border-md-b-sm">
        <v-col cols="12" md="3" sm="12" class="d-flex" style="margin-top: 15px">
            <v-btn icon="mdi-arrow-left" variant="plain" size="small"></v-btn>

            <v-select align="center"
                label="Модель"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                variant="outlined"
                density="compact"
                class="select-model"
                >
            </v-select>
        </v-col>

        <v-col cols="12" sm="12" md="6" class="d-flex">
                <v-btn icon="mdi-history" size="small" variant="plain" class="px-0"></v-btn>
                <v-btn icon="mdi-help-circle-outline" variant="plain" size="small"></v-btn>
                <v-btn icon="mdi-arrow-collapse-left" variant="plain" size="small"></v-btn>
                <v-btn-toggle border v-model="view_format" mandatory  size="small" style="max-height: 38px">
                    <v-btn variant="plain" size="small" value="render">Просмотр</v-btn>
                    <v-btn variant="plain" size="small" value="code">Код</v-btn>
                </v-btn-toggle>
                <v-btn icon="mdi-autorenew" variant="plain" size="small"></v-btn>
                <v-btn-toggle border v-model="view_monitor" size="small" style="max-height:38px" class="d-md-flex d-none">
                    <v-btn size="small"  variant="plain" value="monitor" icon="mdi-monitor"></v-btn>
                    <v-btn size="small"  variant="plain" value="mobil" icon="mdi-cellphone"></v-btn>
                </v-btn-toggle>
        </v-col>

        <v-col cols="12" sm="12" md="3" class="d-flex align-center ml-3 mt-4 mt-md-0 ml-md-0">
            <v-btn-toggle border v-model="view_monitor" size="small" style="max-height:38px" class="d-md-none d-flex">
                <v-btn size="small"  variant="plain" value="monitor" icon="mdi-monitor"></v-btn>
                <v-btn size="small"  variant="plain" value="mobil" icon="mdi-cellphone"></v-btn>
            </v-btn-toggle>

            <v-btn variant="plain" size="small" value="render">Поделиться</v-btn>
            <v-btn variant="plain" value="code" class="bg-primary">Сохранить</v-btn>
        </v-col>

    </v-row>
</template>

<script>
export default {
    name: 'Navbar',
    data: () => ({
        view_monitor: 'mobil',
        view_format: 'render'
    })
}
</script>

<style lang="scss">
    .select-model {
        max-width: 200px;

        @media only screen and (max-width: 960px) {
            max-width: 85%;
        }
    }
</style>
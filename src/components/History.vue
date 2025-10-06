<template>
     <v-card 
        title="" 
        :variant="history.is_question ? 'tonal' : 'outlined'"
        class="mt-4"
        :class="history.is_question ? 'float-right' : 'float-left border-sm'"
        style="width: 85%"
    >
    <v-card-text style="text-align: left">{{history.is_question ? history.title : history.text}}</v-card-text>
        <div style="text-align: left; padding-left: 9px; padding-bottom: 3px; font-size: 12px;">{{new Date(history.created_at).toLocaleDateString()}}</div>
        <v-card-actions class="float-right" style="position: absolute; right: -3px; bottom: -7px" v-if="history.is_question">
            <v-btn prepend-icon="mdi-autorenew"  variant="outlined" size="small">Обновить</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: {
        number: {
            default: 0,
            type: Number,
        },
    },
    computed: {
        history: {
            get() {
                return this.$store.state.history[this.number];
            },
            set(value) {
                let payload = {
                card: this.cardName,
                name: "radius",
                value: value,
                };
                this.$store.commit("updateCard", payload);
            },
        },
    }
}
</script>

<style>

</style>
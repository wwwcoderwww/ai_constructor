<template>
     <v-card 
        :title="title(history.title, history.text)" 
        :variant="history.is_question ? 'tonal' : 'outlined'"
        class="mt-4"
        :class="history.is_question ? 'float-right' : 'float-left border-sm'"
        style="width: 85%; text-align: start;"
    >
    <v-card-text style="text-align: left" class="chat-item">{{text(history.title, history.text)}}</v-card-text>
        <div class="hourAgo">{{getHourAgo(history.created_at)}} часов назад</div>
        <div style="text-align: left; padding-left: 9px; padding-bottom: 3px; font-size: 12px;">{{dateTime(history.created_at)}}</div>
        <v-card-actions class="float-right" style="position: absolute; right: -3px; bottom: -10px" v-if="history.is_question">
            {{this.props}}
            <v-btn prepend-icon="mdi-autorenew" variant="outlined" size="small" :disabled="this.$store.state.disable_send_button" @click="this.$store.dispatch('getCode', {prompt: history.text}); scrollToElementMethod(); ">Обновить</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { convert, compile } from 'html-to-text';

export default {
    props: {
        number: {
            default: 0,
            type: Number,
        },
        scrollToElement: {
        }
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
    },
    methods: {
        scrollToElementMethod() {
            this.scrollToElement()

            setTimeout(() => {
                this.scrollToElement()
            }, 150)
        },
        getHourAgo(date = 0) {
            const now = new Date();
            const diffMilliseconds = now.getTime() - new Date(date).getTime();
            const hoursAgo = diffMilliseconds / (1000 * 60 * 60);

            return Math.floor(hoursAgo); // Returns whole hours
        },
        
        dateTime(dateTime) {
            const formatter = new Intl.DateTimeFormat('ru-Ru', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });

            let nowDate = new Date(dateTime)

            return formatter.format(nowDate).replace(' г.', ''); 
        },
        title(title, text) {
            if (title) {
                return convert(title.replace('Powered by Froala Editor', '').replace('[https://www.froala.com/wysiwyg-editor?pb=1]', ''))
            }

            return text ? convert(text.replace('Powered by Froala Editor', '').replace('[https://www.froala.com/wysiwyg-editor?pb=1]', '')).slice(0, 50) : '';
        },
        text(title, text) {
            // if (title) {
            //     return text
            // }

            return text ? convert(text).slice(0, 250).replace('Powered by Froala Editor', '').replace('[https://www.froala.com/wysiwyg-editor?pb=1]', '') : '';
        }
    }
}
</script>

<style lang="scss">
    .chatWrap {
        & .v-btn__prepend {
            font-size: 9px !important;
            margin-right: 0 !important;
        }

        .v-btn__content {
            font-size: 8px;
            text-transform: capitalize;
            letter-spacing: 1px;
        }

            button {
                height: 21px !important;
                padding: 0 3px !important;
        }
    }

    .hourAgo {
        font-size: 12px;
        color: gray;
        font-weight: 400;
        text-align: start;
        padding-left: 10px;
    }
    .v-card .v-card-text {
        margin-top: -5px;
        margin-bottom: -5px;
    }
</style>
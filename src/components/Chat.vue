<template>
     <v-card
        :variant="history.is_question ? 'tonal' : 'outlined'"
        class="mt-4"
        :class="history.is_question ? 'float-right' : 'float-left border-sm'"
        style="width: 85%; text-align: start;"
    >
    <v-card-text style="text-align: left; position: relative;" class="chat-item" :class="{ 'has-fold-btn': !history.is_question && isLong && !isStreaming, 'answer-text': !history.is_question, 'collapsed': !history.is_question && isLong && !expanded && !isStreaming }">
        <v-btn
            v-if="!history.is_question && isLong && !isStreaming"
            :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            variant="outlined"
            size="x-small"
            rounded="md"
            class="fold-btn"
            @click="expanded = !expanded"
        ></v-btn>
        <div v-if="!history.is_question" class="answer-content" v-html="renderedAnswer"></div>
        <template v-else>{{displayText}}</template>
    </v-card-text>
        <div class="hourAgo">{{getHourAgo(history.created_at)}} часов назад</div>
        <div style="text-align: left; padding-left: 9px; padding-bottom: 3px; font-size: 12px;">{{dateTime(history.created_at)}}</div>
        <v-card-actions class="float-right" style="position: absolute; right: -3px; bottom: -10px" v-if="history.is_question">
            {{this.props}}
            <v-btn prepend-icon="mdi-autorenew" variant="outlined" size="small" :disabled="this.$store.state.disable_send_button" @click="this.$store.state.prompt = history.text; scrollToElementMethod(); ">Обновить</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { convert, compile } from 'html-to-text';
import { marked } from 'marked';

marked.setOptions({ breaks: true, gfm: true });

export default {
    props: {
        number: {
            default: 0,
            type: Number,
        },
        scrollToElement: {
        }
    },
    data() {
        return {
            expanded: false,
        };
    },
    watch: {
        // When live generation finishes, keep the just-streamed answer
        // fully open instead of abruptly collapsing it to 240px.
        isStreaming(now, prev) {
            if (prev && !now) {
                this.expanded = true;
            }
        },
        // Follow the answer as it streams in: scroll to the bottom on each
        // text update so the latest content stays visible instead of being
        // hidden behind the prompt input.
        'history.text'() {
            if (this.isStreaming && this.scrollToElement) {
                this.$nextTick(() => this.scrollToElement());
            }
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
        cleanedText() {
            if (!this.history.text) return '';
            return convert(this.history.text)
                .replace('Powered by Froala Editor', '')
                .replace('[https://www.froala.com/wysiwyg-editor?pb=1]', '');
        },
        renderedAnswer() {
            if (!this.history.text) return '';
            try {
                return marked.parse(this.history.text);
            } catch (e) {
                return this.history.text;
            }
        },
        isLong() {
            return this.cleanedText.length > 250;
        },
        isStreaming() {
            return !this.history.is_question
                && this.$store.state.disable_send_button
                && this.number === this.$store.state.history.length - 1;
        },
        displayText() {
            if (this.history.is_question) {
                return this.cleanedText.slice(0, 250);
            }
            if (this.isLong && !this.expanded) {
                return this.cleanedText.slice(0, 250) + '…';
            }
            return this.cleanedText;
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
                height: 19px !important;
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
    .fold-btn {
        position: absolute !important;
        top: 10px;
        right: 4px;
        z-index: 1;
        width: 32px !important;
        height: 22px !important;
        min-width: 0 !important;
        border-radius: 6px !important;
        float: right;
    }
    .chat-item.has-fold-btn {
        padding-top: 34px !important;
    }
    .chat-item.answer-text {
        word-break: break-word;
    }
    .chat-item.answer-text .answer-content {
        font-size: 14px;
        line-height: 1.45;
    }
    .chat-item.answer-text .answer-content h1,
    .chat-item.answer-text .answer-content h2,
    .chat-item.answer-text .answer-content h3,
    .chat-item.answer-text .answer-content h4,
    .chat-item.answer-text .answer-content h5,
    .chat-item.answer-text .answer-content h6 {
        font-weight: 600;
        margin: 10px 0 4px;
        line-height: 1.3;
    }
    .chat-item.answer-text .answer-content h1 { font-size: 17px; }
    .chat-item.answer-text .answer-content h2 { font-size: 16px; }
    .chat-item.answer-text .answer-content h3,
    .chat-item.answer-text .answer-content h4,
    .chat-item.answer-text .answer-content h5,
    .chat-item.answer-text .answer-content h6 { font-size: 15px; }
    .chat-item.answer-text .answer-content p {
        margin: 4px 0;
    }
    .chat-item.answer-text .answer-content ul,
    .chat-item.answer-text .answer-content ol {
        margin: 4px 0;
        padding-left: 20px;
    }
    .chat-item.answer-text .answer-content li {
        margin: 2px 0;
    }
    .chat-item.answer-text .answer-content hr {
        margin: 10px 0;
        border: none;
        border-top: 1px solid rgba(0, 0, 0, 0.12);
    }
    .chat-item.answer-text .answer-content code {
        background: rgba(0, 0, 0, 0.06);
        padding: 1px 4px;
        border-radius: 3px;
        font-size: 12.5px;
    }
    .chat-item.answer-text .answer-content pre {
        background: rgba(0, 0, 0, 0.06);
        padding: 8px 10px;
        border-radius: 4px;
        overflow-x: auto;
        font-size: 12.5px;
        margin: 6px 0;
    }
    .chat-item.answer-text .answer-content pre code {
        background: transparent;
        padding: 0;
    }
    .chat-item.answer-text .answer-content table {
        border-collapse: collapse;
        margin: 6px 0;
        font-size: 13px;
    }
    .chat-item.answer-text .answer-content th,
    .chat-item.answer-text .answer-content td {
        border: 1px solid rgba(0, 0, 0, 0.12);
        padding: 4px 8px;
        text-align: left;
    }
    .chat-item.answer-text .answer-content blockquote {
        border-left: 3px solid rgba(0, 0, 0, 0.2);
        padding-left: 10px;
        margin: 6px 0;
        color: rgba(0, 0, 0, 0.7);
    }
    .chat-item.answer-text .answer-content img {
        max-width: 100%;
        height: auto;
    }
    .chat-item.answer-text.collapsed .answer-content {
        max-height: 240px;
        overflow: hidden;
        mask-image: linear-gradient(to bottom, black 60%, transparent);
        -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent);
    }
</style>
import { createStore } from 'vuex'
import axios from 'axios';
import config from '@/config/config';
import { Client } from "@gradio/client";
import { convert, compile } from 'html-to-text';


export default createStore({
  state: {
    collapse: true,
    show_history: 1,
    show_code: 0,
    show_mobil: 0,
    componentKey: 1,
    disable_send_button: 0,
    model_id: 1,
    globalSpinner: 0,
    models: [
      {id: 1, name: 'Qwen/Qwen3-Coder-WebDev'}
    ],
    notifications: []
  },
  getters: {
    getNameModelById (state) {
      return state.models.filter(element => {
        return element.id == state.model_id
      });
    }
  },
  mutations: {
  },
  actions: {
    getData({state, dispatch}, payload) {
      axios.get(config.serverApi + '/ai/landings/' + payload.id)
      .then(function (response) {
        if (response.status == 200) {
          state.id = response.data.id;
          state.history = response.data.history;
          state.user = response.data.user;
          state.model_id = parseInt(response.data.model_id) ? parseInt(response.data.model_id) : parseInt(1);
          state.name = response.data.name;
          state.prompt = response.data.prompt;
          state.status = response.data.status;
          state.text = response.data.text;
          state.token = response.data.token;
        }
        console.log('getData', state);
      })
      .catch(function (error) {
        console.log('getDataError', error);
      })
      .finally(function () {
        // always executed
        payload.scrollElement()
      });  
    },

    saveHistory({state}) {
      axios.post(config.serverApi + '/ai/landings/add_history', {
        a_i_landing_id: state.id,
        text: state.prompt,
        title: state.historyTitle,
        is_question: 1
      })
    },

    saveLanding({state}) {
      axios.post(config.serverApi + '/ai/landings/update', {
        id: state.id,
        model_id: state.model_id,
        prompt: state.prompt,
        text: state.text
      })
      .then(function (response) {
        console.log(response) 
        state.notifications.push({
          title: "Сохранение",
          type: "success",
          text: response.data
        })
        setTimeout(()=>{
          state.notifications.shift()
        }, 2000)
        
      })
      .catch(function (error) {
        console.log(error);

        state.notifications.push({
          title: "Ошибка",
          type: "error",
          text: typeof(error.response) != 'undefined' ? error.response.data : 'Не удалось сохранить изменения!'
        })
        setTimeout(()=>{
          state.notifications.shift()
        }, 4000)
      });
    },

    async getCode(store, context) {
      store.state.prompt = typeof(context) != 'undefined' && context.prompt ? context.prompt : store.state.prompt

      if (store.state.prompt.length < 20) {
        store.state.notifications.push({
          title: "Ошибка",
          type: "error",
          text: 'Промпт должен быть не менее 20 символов'
        })
        setTimeout(()=>{
          store.state.notifications.shift()
        }, 4000)

        return 
      }

      store.state.disable_send_button = 1;

      store.state.historyTitle = context.title
      let newHistory = {
        text: store.state.prompt,
        title: context.title,
        created_at: new Date(),
        is_question: 1
      }

      store.state.history.push(newHistory)
      store.dispatch('saveHistory')
      context.scrollElement ? setTimeout(() => {context.scrollElement()}, 150) : ''

      let prompt = convert(store.state.prompt).toString().replace('Powered by Froala Editor', '').replace('[https://www.froala.com/wysiwyg-editor?pb=1]', '')

      store.state.prompt = ''

      const client = await Client.connect(store.getters.getNameModelById[0].name);
      const result = await client.predict("/generate_code", { 		
              input_value: prompt, 		
              system_prompt_input_value: "null", 
      });

      let code = result.data[0].value
      code = code.slice(7)
      code = code.slice(0, - 3)
      store.state.text = code

      store.state.disable_send_button = 0;
    }
    
  },
  modules: {
  }
})

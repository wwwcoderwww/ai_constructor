import { createStore } from 'vuex'
import axios from 'axios';
import config from '@/config/config';

export default createStore({
  state: {
  },
  getters: {
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
          state.model_id = response.data.model_id;
          state.name = response.data.name;
          state.prompt = response.data.prompt;
          state.status = response.data.status;
          state.text = response.data.text;
        }
        console.log('getData', state);
      })
      .catch(function (error) {
        console.log('getDataError', error);
      })
      .finally(function () {
        // always executed
      });  
    },
  },
  modules: {
  }
})

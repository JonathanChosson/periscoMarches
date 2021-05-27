import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sessionStorage : "",
    logged : false,
    userActif: "",
    urlApi: {
      "inscription" : `http://${window.location.hostname}:3000/api/user/signup`,
      "connexion" : `http://${window.location.hostname}:3000/api/user/login`,
      "getoneprofil": `http://${window.location.hostname}:3000/api/user/getoneprofil`,
      "updateUser": `http://${window.location.hostname}:3000/api/user/update`,
      "deleteUser": `http://${window.location.hostname}:3000/api/user/delete`,
      "reservation": `http://${window.location.hostname}:3000/api/date/inscription`,
      "getonereservation" : `http://${window.location.hostname}:3000/api/date/getonereservation`,
      "getAllProfile" : `http://${window.location.hostname}:3000/api/user/getAllProfile`
    },
    reservation :""
  },
  mutations: {
    connexion(state, data){
      state.logged = true;
      state.sessionStorage = window.sessionStorage
      state.sessionStorage.setItem(0, JSON.stringify(data));
    },
    update(state, data){
      state.logged = true;
      state.sessionStorage = window.sessionStorage
      state.sessionStorage.setItem(0, JSON.stringify(data));
    },
    deconnexion(state){
      state.logged = false;
      sessionStorage.clear();
      location.href=`http://${window.location.hostname}:8080`;
    },
    userProfile(state, data){
      state.userActif = data
    },
    reservation(state, data){
      state.reservation = data
    }
  },
  actions: {
  },
  modules: {
  },
  getters : {
    getMyState: state => state.sessionStorage
  }
})

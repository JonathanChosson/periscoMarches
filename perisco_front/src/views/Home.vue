<template>
  <div class="home">
    <Header></Header>
    <Sign v-if="!logged"></Sign>
    <Premiereconnexion v-if="userActif.premiereConnexion && logged"></Premiereconnexion>
    <Comptevalid v-if="!userActif.premiereConnexion && !userActif.compteValid && logged"></Comptevalid>
    <b-badge v-if="userActif.compteValid && logged" variant="secondary" class="m-2">
      <router-link to="/reservation" class="text-white h3">Réserver </router-link>
      <b-icon icon="calendar2-date-fill" font-scale="2"></b-icon>
    </b-badge>
    <Enfantreservation></Enfantreservation>
  </div>
</template>

<script>
import Header from '../components/header';
import Sign from '../components/sign';
import Premiereconnexion from '../components/premiereconnexion';
import Comptevalid from '../components/comptevalid';
import Enfantreservation from '../components/enfantreservation';
import { mapState } from 'vuex'


export default {
  name: 'Home',
  data(){
    const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      // 15th two months prior
      const minDate = new Date(today)
      minDate.setMonth(minDate.getMonth())
      minDate.setDate(minDate.getDate() +2)
      // 15th in two months
      const maxDate = new Date(today)
      maxDate.setMonth(maxDate.getMonth() + 2)
      maxDate.setDate(15)
    return{
      enfantResa: '',
    }
  },
  components: {
    Header,
    Sign,
    Premiereconnexion,
    Comptevalid,
    Enfantreservation
  },
  computed:{
    ...mapState(['logged','userActif','sessionStorage','urlApi','reservation']),
    disabled() {
        return this.state === 'disabled'
      }
  },
  methods: {
    getReservation (){
      let tokenInfo = JSON.parse(this.sessionStorage[0])
        let requestOption = {
                method :"GET",
                mode: "cors",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenInfo.token}`,
                    "userId": tokenInfo.userId,
                }
        }
        fetch(this.urlApi.getonereservation, requestOption)
        .then((reponse) => 
            reponse.json()
            .then((data) => {
              this.enfantResa = data;
              this.$store.commit("reservation", data);
            })
        ).catch(erreur => console.log('erreur : ' + erreur));
    },
  },
  mounted: function(){
    if(window.sessionStorage.length > 0){
        this.$store.commit("update", JSON.parse(window.sessionStorage[0]));
        this.getReservation();
    }
  },
  
  
}
</script>

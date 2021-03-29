<template>
  <div class="home">
    <Header></Header>
    <Sign v-if="!logged"></Sign>
    <Premiereconnexion v-if="userActif.premiereConnexion && logged"></Premiereconnexion>
    <Comptevalid v-if="!userActif.premiereConnexion && !userActif.compteValid && logged"></Comptevalid>
    <b-badge v-if="userActif.compteValid && logged" variant="secondary" class="m-2">
      <router-link to="/reservation" class="text-white h3">Effectuer une réservation </router-link>
      <b-icon icon="calendar2-date-fill" font-scale="2"></b-icon>
    </b-badge>

    <div class="d-flex justify-content-around align-self-center p-1">
      <div class="border border-info rounded m-1" v-for="enfant in userActif.enfants" :key="enfant.id">
        <p class="h5 p-1 bg-info text-white">Réservation pour le mois</p>
        <div>
            <b-avatar></b-avatar>
            <p class="m-0 font-weight-bold">{{enfant.prenom}} {{enfant.nom}}</p>
            <p>{{enfant.classe}}</p><p v-show="none">{{ dateReserve(enfant.prenom) }}</p>
        </div>
        <b-row>
          <b-col md="auto" class="m-1">
            <b-calendar v-model="value" @context="onContext" :disabled="disabled" :min="min" :max="max" :date-disabled-fn="dateDisabled" :date-info-fn="dateClass" today-variant="info"></b-calendar>
          </b-col>
        </b-row>
      </div>
    </div>

  </div>
</template>

<script>
import Header from '../components/header';
import Sign from '../components/sign';
import Premiereconnexion from '../components/premiereconnexion';
import Comptevalid from '../components/comptevalid'
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
      value: '',
      context: null,
      min: minDate,
      max: maxDate,
      enfantResa: '',
      state: 'disabled'
    }
  },
  components: {
    Header,
    Sign,
    Premiereconnexion,
    Comptevalid
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
              this.$store.commit("reservation", data);
            })
        ).catch(erreur => console.log('erreur : ' + erreur));
    },
    dateReserve(prenom){
      console.log(this.reservation);
      const resultat = this.reservation.reservation.find(enfant => enfant.prenom === prenom)
      this.enfantResa = resultat.dates;
      console.log(resultat.dates);
      return resultat.dates
    },
    onContext(ctx) {
        this.context = ctx
    },
    dateDisabled(ymd, date) {
        // Disable weekends (Sunday = `0`, Saturday = `6`) and
        // disable days that fall on the 13th of the month
        const weekday = date.getDay()
        // Return `true` if the date should be disabled
        return weekday === 0 || weekday === 6 || weekday === 3
    },
    dateClass(ymd) {
      if (this.enfantResa.find( dates => dates === ymd)){
        return 'table-success'
      }else {
        return ''
      }
        // return day >= 10 && day <= 20 ? 'table-info' : ''
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

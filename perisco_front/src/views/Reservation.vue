<template>
  <div class="reservation">
    <Header></Header>
    <div class="container">
      <p class="h4">Réservation</p>
      <div class="border border-info rounded mb-2">
        <p class="h5 pt-1 pb-1 bg-info text-white">Selectionner votre/vos enfant/s</p>
        <div class="d-flex justify-content-around align-self-center p-1">
          <div v-for="enfant in userActif.enfants" :key="enfant.id" @click="selectEnfant(enfant)">
              <b-avatar variant="success" v-if="validationEnfant(enfant.prenom)"></b-avatar>
              <b-avatar v-else></b-avatar>
              <p class="m-0 font-weight-bold">{{enfant.prenom}} {{enfant.nom}}</p>
              <p>{{enfant.classe}}</p>
              <!-- <div class="d-flex justify-content-around align-self-center p-1">
                  <div class="border border-info rounded m-1" >
                  <p class="h5 p-1 bg-info text-white">Réservation en cours</p>
                  <div>
                      <b-badge class="m-1" v-for="dates in reservation.reservation[userActif.enfants.indexOf(enfant)].dates" :key="dates.id" >{{date(dates)}}</b-badge>
                  </div>
                  </div>
              </div> -->
          </div>
        </div>
      </div>
      <div class="border border-info rounded mb-2">
        <p class="h5 pt-1 pb-1 bg-info text-white">Sélectionner votre/vos date/s</p>
        <b-row>
          <b-col md="auto" class="m-1">
            <b-calendar v-model="value" @context="onContext" :min="min" :max="max" :date-disabled-fn="dateDisabled" :date-info-fn="dateClass" today-variant="info"></b-calendar>
          </b-col>
          <b-col>
            <b-badge v-if="this.value.length > 0 && !validationDate(value) && this.enfants.length >0" variant="info" class="m-2" @click="ajoutDate(value)" >
              <b-icon icon="plus-circle-fill" font-scale="1.6"></b-icon> <p class="m-0 mt-1">Ajouter le {{context.activeFormatted}}</p>
            </b-badge>
            <b-badge v-else-if="this.value.length > 0 && validationDate(value) && this.enfants.length >0" variant="warning" class="m-2" @click="ajoutDate(value)" >
              <b-icon icon="plus-circle-fill" font-scale="1.6"></b-icon> <p class="m-0 mt-1">Retirer le {{context.activeFormatted}}</p>
            </b-badge>
            <b-badge v-else variant="secondary" class="m-2">
              <b-icon icon="plus-circle-fill" font-scale="1.6"></b-icon> <p class="m-0 mt-1">Sélectionner une date</p>
            </b-badge>
          </b-col>
        </b-row>
      </div>
    <b-badge v-if="enfants.length >0 && dates.length >0" variant="info" class="m-2" @click="reserver()">
      <p class="m-0 mt-1 h4">Valider vos réservations</p>
    </b-badge>
    <b-badge v-else variant="secondary" class="m-2">
      <p class="m-0 mt-1 h4">Valider vos réservations</p>
    </b-badge>
    </div>
  </div>
</template>


<script>
import Header from '../components/header';
import { mapState } from 'vuex'


export default {
  name: 'Reservation',
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
      enfants :[],
      dates:[],
      datesValidation:[]
    }
  },
  components: {
    Header,
  },
  computed:{
    ...mapState(['logged','userActif','sessionStorage','urlApi','reservation']),
  },
  methods: {
    //propre à calendar bootstrap
    onContext(ctx) {
        this.context = ctx
    },
    //Rend les dates inactive bootstrap calendar
    dateDisabled(ymd, date) {
        // Disable weekends (Sunday = `0`, Saturday = `6`) and
        // disable days that fall on the 13th of the month
        const weekday = date.getDay()
        // Return `true` if the date should be disabled
        return weekday === 0 || weekday === 6 || weekday === 3
    },
    //rempli le tableau des enfants selectionnées
    selectEnfant(enfant){
      this.dates = [];
      const resultat = this.reservation.reservation.find(enfants => enfants.enfant.prenom == enfant.prenom)
      if(this.enfants.indexOf(enfant) === -1) {
        this.enfants.push(enfant);
        for (let i in resultat.dates){
          if(this.datesValidation.indexOf(resultat.dates[i]) === -1){
            this.datesValidation.push(resultat.dates[i]);
          }
        }
      }else{
        this.dates = [];
        this.enfants.splice(this.enfants.indexOf(enfant), 1);
        for (let i in resultat.dates){
          this.datesValidation.splice(this.datesValidation.indexOf(resultat.dates[i]), 1);
        }
        for (let enfant in this.enfants){
          console.log(this.enfants[enfant].prenom);
          const resultat = this.reservation.reservation.find(enfants => enfants.enfant.prenom == this.enfants[enfant].prenom)
          console.log(resultat.dates);
          for (let i in resultat.dates){
          if(this.datesValidation.indexOf(resultat.dates[i]) === -1){
            this.datesValidation.push(resultat.dates[i]);
          }
        }
        }
      }
    },
    //ajoute la date au tableau
    ajoutDate(date){
      if(this.dates.indexOf(date) === -1 && this.datesValidation.indexOf(date) ===-1) {
        this.dates.push(date);
        this.datesValidation.push(date);
        this.value = '';
      }else if (this.dates.indexOf(date) !== -1 && this.datesValidation.indexOf(date) !==-1){
        this.dates.splice(this.dates.indexOf(date), 1);
        this.datesValidation.splice(this.datesValidation.indexOf(date),1);
        this.value = '';
      }else if (this.dates.indexOf(date) === -1 && this.datesValidation.indexOf(date) !==-1){
        this.dates.push(date);
        this.datesValidation.splice(this.datesValidation.indexOf(date),1);
        this.value = '';
      }else if (this.dates.indexOf(date) !== -1 && this.datesValidation.indexOf(date) ===-1){
        this.dates.splice(this.dates.indexOf(date), 1);
        this.datesValidation.push(date);
        this.value = '';
      }
    },
    //Valide le choix d'un enfant
    validationEnfant(prenom){
      const resultat = this.enfants.find( enfants => enfants.prenom === prenom);
      return resultat
    },
    //valide le choix d'une date
    validationDate(date){
      const resultat = this.datesValidation.find( dates => dates === date);
      return resultat
    },
    //Fond vert pour les dates dans le tableau this.date
    dateClass(ymd) {
        if (this.datesValidation.find( dates => dates === ymd)){
          return 'table-success'
        }else {
          return ''
        }
        // return day >= 10 && day <= 20 ? 'table-info' : ''
      },
    //envoi au back la demande de reservation 
    reserver(){
      let tokenInfo = JSON.parse(this.sessionStorage[0]);
      let requestOption = {
              method :"POST",
              mode: "cors",
              headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${tokenInfo.token}`,
              },
              body : JSON.stringify({
                  "userId":tokenInfo.userId,
                  "dates":this.dates,
                  "enfants": this.enfants,
              })
          }
          fetch(this.urlApi.reservation, requestOption)
          .then((reponse) => 
              reponse.json()
              .then((data) => {
                console.log(data);
                location.href=`http://${window.location.hostname}:8080`;
              })
          ).catch(erreur => console.log('erreur : ' + erreur));
    },
    //affiche la date format 12-01-2021
    date(dates){
            let date = dates.split('-');
            date = `${date[2]}-${date[1]}-${date[0]}`
            return date
        },
    //obtenir les réservation déjà en cours
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
  },
  mounted: function(){
        if(window.sessionStorage.length > 0){
            this.$store.commit("update", JSON.parse(window.sessionStorage[0]))
            this.getReservation();
        }
  },
  
}
</script>

<template>
    <div class="d-flex justify-content-around align-self-center p-1 flex-wrap">
        <div class="border border-info rounded m-1" v-for="enfant in reservation.reservation" :key="enfant.id">
            <p class="h5 p-1 bg-info text-white">Réservation en cours</p>
            <div>
                <b-avatar></b-avatar>
                <p class="m-0 font-weight-bold">{{enfant.enfant.prenom}} {{enfant.enfant.nom}}</p>
                <p>{{enfant.enfant.classe}}</p>
                <b-badge class="m-1" v-for="dates in enfant.dates" :key="dates.id">{{date(dates)}}</b-badge>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'


export default {
    name: 'enfantreservation',
    data(){
        return{
            enfantResa : ""
        }
    },
    components: {
    },
    computed:{
        ...mapState(['logged','userActif','sessionStorage','urlApi','reservation']),
    },
    methods: {
        date(dates){
            let date = dates.split('-');
            date = `${date[2]}-${date[1]}-${date[0]}`
            return date
        }
    },

}
</script>

<style>
.none{
    display: none;
}
</style>

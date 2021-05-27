<template>
<div class="home">
    <Header></Header>
    <Sign v-if="!logged"></Sign>
    <div v-if="userActif.isAdmin && logged">
        <div class="border border-info rounded m-1" >
            <p class="h5 p-1 bg-info text-white">Enfants Inscrit</p>
        </div>
        <div class="border border-info rounded m-1" >
            <p class="h5 p-1 bg-info text-white">Création de compte <span v-if="attenteValidation.length > 0" class="badge badge-pill badge-danger">{{attenteValidation.length}}</span></p>
            <table class="table p-1">
                <thead>
                    <tr>
                    <th scope="col">Nom</th>
                    <th scope="col">Voir la Fiche</th>
                    <th scope="col">Sélection</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="profile in attenteValidation" :key="profile.id">
                        <th scope="row">{{profile.nomDeFamille}}</th>
                        <td>
                            <b-badge variant="secondary">
                                <b-icon icon="zoom-in" font-scale="2"></b-icon>
                            </b-badge>
                        </td>
                        <td>
                            <b-badge variant="secondary">
                                <b-icon icon="check2-circle" font-scale="2"></b-icon>
                            </b-badge>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="border border-info rounded m-1" >
            <p class="h5 p-1 bg-info text-white">Modification de compte</p>
        </div>
    </div>
    <div v-if="!userActif.isAdmin && logged">
        <p>Il semblerai que vous n'ayez pas le droit d'être ici</p>
    </div>
</div>
</template>

<script>
import Header from '../components/header';
import Sign from '../components/sign';
import { mapState } from 'vuex'


export default {
name: 'Home',
data(){
    return{
    enfantResa: '',
    allProfile:''
    }
},
components: {
    Header,
    Sign
},
computed:{
    ...mapState(['logged','userActif','sessionStorage','urlApi','reservation']),
    disabled() {
        return this.state === 'disabled'
    },
    attenteValidation : function(){
        return this.allProfile.filter(i => i.compteValid == false)
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
    getAllProfile (){
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
        fetch(this.urlApi.getAllProfile, requestOption)
        .then((reponse) => 
            reponse.json()
            .then((data) => {
            this.allProfile = data;
            })
        ).catch(erreur => console.log('erreur : ' + erreur));
    }
},
mounted: function(){
    if(window.sessionStorage.length > 0){
        this.$store.commit("update", JSON.parse(window.sessionStorage[0]));
        this.getReservation();
        this.getAllProfile();
    }
},


}
</script>

<template>
    <div class="container">
        <p class="h3">Bienvenue famille {{userActif.nomDeFamille}}</p>
        <p>Afin d'avoir accès au service de réservation merci de compléter votre profil</p>
        <b-form @submit.prevent="onSubmit">
            <div class="border border-info rounded mb-2">
                <p class="h5 pt-1 pb-1 bg-info text-white">Contact</p>
                <b-form-group id="input-group-adresse" label-for="input-adresse" class="p-1">
                    <b-form-input
                    id="input-adresse"
                    v-model="adresse"
                    type="text"
                    placeholder="Entrer votre adresse"
                    required
                    :state="validationAdresse"
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-tel1" label-for="input-tel1" class="p-1">
                    <b-form-input
                    id="input-tel1"
                    v-model="tel1"
                    type="number"
                    placeholder="Téléphone principal"
                    required
                    :state="validationTel"
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-tel2" label-for="input-tel2" class="p-1">
                    <b-form-input
                    id="input-tel2"
                    v-model="tel2"
                    placeholder="Téléphone secondaire "
                    ></b-form-input>
                </b-form-group>
            </div>

            <div class="border border-info rounded mb-2">
                <p class="h5 pt-1 pb-1 bg-info text-white">Votre/vos enfants</p>
                <div class="d-flex justify-content-around align-items-center p-1">
                    <b-form-group id="input-group-prenom" label="Prénom" label-for="input-prenom">
                        <b-form-input
                        id="input-prenom"
                        v-model="prenom"
                        type="text"
                        placeholder="Prénom"
                        :state="validationPrenom"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-nom" label="Nom" label-for="input-nom">
                        <b-form-input
                        id="input-nom"
                        v-model="nom"
                        placeholder="Nom "
                        :state="validationNom"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-classe" label="Classe" label-for="input-classe">
                        <b-form-select 
                        id="input-classe" 
                        v-model="classe" 
                        :options="options" 
                        :state="validationClasse" 
                        placeholder="Classe"
                        ></b-form-select>
                    </b-form-group>

                </div>
                <div class="d-flex justify-content-center align-self-center p-1">
                    <p class="m-0 mr-2">Ajouter un enfant</p>
                    <b-badge v-if="validationPrenom && validationNom && validationClasse" variant="info" class="mb-2" @click="ajoutEnfant()" >
                        <b-icon icon="plus-circle-fill" font-scale="1.6"></b-icon>
                    </b-badge>
                    <b-badge v-else variant="dark" class="mb-2">
                        <b-icon icon="plus-circle-fill" font-scale="1.6"></b-icon>
                    </b-badge>
                </div>
                <div class="d-flex justify-content-around align-self-center p-1">
                    <div v-for="enfant in enfants" :key="enfant.id">
                        <b-avatar></b-avatar>
                        <p class="m-0 font-weight-bold">{{enfant.prenom}} {{enfant.nom}}</p>
                        <p>{{enfant.classe}}</p>
                    </div>
                </div>
            </div>

            <b-button v-if="validationAdresse && validationTel && validationEnfants" type="submit" variant="primary">Compléter mon Profil</b-button>
            <b-button v-else type="submit" variant="dark">Compléter mon Profil</b-button>
        </b-form>
    </div>
</template>

<script>
import { mapState } from 'vuex'


export default {
    name: 'Premiereconnexion',
    data(){
        return{
            adresse: "",
            tel1:"",
            tel2:"",
            prenom:"",
            nom:"",
            classe:"",
            enfants:[],
            options: [
                { value: '', text: 'Choisir une classe' },
                { value: 'PS', text: 'PS' },
                { value: 'MS', text: 'MS' },
                { value: 'GS', text: 'GS' },
                { value: 'CP', text: 'CP' },
                { value: 'CE1', text: 'CE1' },
                { value: 'CE2', text: 'CE2' },
                { value: 'CM1', text: 'CM1' },
                { value: 'CM2', text: 'CM2' },  
            ]
        }
    },
    components: {

    },
    computed:{
        ...mapState(['userActif','sessionStorage','urlApi']),
        validationAdresse() {
        return this.adresse.length > 4
        },
        validationTel() {
        return this.tel1.length === 10
        },
        validationPrenom() {
        return this.prenom.length > 2
        },
        validationNom() {
        return this.nom.length > 2
        },
        validationClasse() {
        return this.classe.length >= 2
        },
        validationEnfants() {
        if (this.enfants.length < 1){
            return false
        }else{
            return true
        }
        }
    },
    methods: {
        onSubmit() {
            let tokenInfo = JSON.parse(this.sessionStorage[0]);
            let requestOption = {
                    method :"PUT",
                    mode: "cors",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenInfo.token}`,
                    },
                    body : JSON.stringify({
                        "userId":tokenInfo.userId,
                        "adresse":this.adresse,
                        "tel1": this.tel1,
                        "tel2": this.tel2,
                        "enfants": this.enfants,
                        "premiereConnexion" : false,
                    })
                }
                fetch(this.urlApi.updateUser, requestOption)
                .then((reponse) => 
                    reponse.json()
                    .then(() => {
                        this.updateUserStore();
                    })
                ).catch(erreur => console.log('erreur : ' + erreur));
        },
        ajoutEnfant(){
            let enfant = {
                "prenom": this.prenom,
                "nom": this.nom,
                "classe": this.classe
            }
            this.enfants.push(enfant);
            this.prenom ="";
            this.nom="";
            this.classe=""
        },
        updateUserStore(){
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
            fetch(this.urlApi.getoneprofil, requestOption)
            .then((reponse) => 
                reponse.json()
                .then((data) => {
                    this.$store.commit('userProfile', data)
                })
            ).catch(erreur => console.log('erreur : ' + erreur));
        }
    },
    mounted: function(){
        if(window.sessionStorage.length > 0){
            this.$store.commit("update", JSON.parse(window.sessionStorage[0]))
        }
    },
    
}
</script>
<template>
    <div>
        <Header></Header>
        <div class="border border-info rounded m-1" >
            <p class="h5 p-1 bg-info text-white">Votre Profil</p>
            <div v-if="!modeEdition" class="d-flex flex-column justify-content-around align-self-start align-items-start p-1 flex-wrap">
                <p class="h3">Famille {{userActif.nomDeFamille}}</p>
                <p><span class="font-weight-bold">Mail :</span> {{userActif.email}}</p>
                <p><span class="font-weight-bold">Adresse :</span> {{userActif.adresse}}</p>
                <p><span class="font-weight-bold">Téléphone 1 :</span> {{userActif.tel1}}</p>
                <p><span class="font-weight-bold">Téléphone 2 :</span> {{userActif.tel2}}</p>
                <div class="border border-info rounded w-100">
                <p class="h5 pt-1 pb-1 bg-info text-white">Votre/vos enfants</p>
                    <div class="d-flex justify-content-around align-self-center p-1">
                        <div v-for="enfant in userActif.enfants" :key="enfant.id" class="m-1">
                            <b-avatar></b-avatar>
                            <p class="m-0 font-weight-bold">{{enfant.prenom}} {{enfant.nom}}</p>
                            <p>{{enfant.classe}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="d-flex flex-row justify-content-around align-self-start align-items-start p-1 flex-wrap">
                <p class="h3">Famille {{userActif.nomDeFamille}}</p>
                <b-form-group id="input-group-mail" label="Mail" label-for="input-mail">
                    <b-form-input
                    id="input-mail"
                    v-model="nouveauMail"
                    type="text"
                    :placeholder = userActif.email
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-adresse" label="Adresse" label-for="input-adresse">
                    <b-form-input
                    id="input-adresse"
                    v-model="nouvelleAdresse"
                    type="text"
                    :placeholder = userActif.adresse
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-tel1" label="Téléphone 1" label-for="input-tel1">
                    <b-form-input
                    id="input-tel1"
                    v-model="nouveauTel1"
                    type="text"
                    :placeholder = userActif.tel1
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-tel2" label="Téléphone 2" label-for="input-tel2">
                    <b-form-input
                    id="input-tel2"
                    v-model="nouveauTel2"
                    type="text"
                    :placeholder = userActif.tel2
                    ></b-form-input>
                </b-form-group>
                <div class="border border-info rounded w-100">
                <p class="h5 pt-1 pb-1 bg-info text-white">Votre/vos enfants</p>
                    <div class="d-flex justify-content-around align-self-center p-1">
                        <div v-for="enfant in userActif.enfants" :key="enfant.id" class="m-1">
                            <b-avatar></b-avatar>
                            <p class="m-0 font-weight-bold">{{enfant.prenom}} {{enfant.nom}}</p>
                            <p>{{enfant.classe}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!modeEdition">
                <b-button type="submit" variant="success" class="m-1" @click="updateMode()">Modifier</b-button>
                <b-button type="submit" variant="danger" v-b-toggle="'collapse-1'"  class="m-1">Suprimer mon compte</b-button>
            </div>
            <div v-else>
                <b-button type="submit" variant="success" class="m-1" @click="updateProfil(userActif._id)">Valider modifications</b-button>
                <b-button class="m-1" variant="warning" @click="updateMode()" > Anuler modifications</b-button>
            </div>
            
            <b-collapse id="collapse-1">
                        <b-card>
                            Confirmer la suppresion ? <br/>
                            <b-button class="m-1" variant="danger" @click="supprProfil(userActif._id)" > Confirmer</b-button><br/>
                            <b-button class="m-1" variant="success" v-b-toggle="'collapse-1'" > Conserver</b-button>
                        </b-card>
            </b-collapse>
        </div>
    </div>
</template>

<script>
import Header from '../components/header';
import { mapState } from 'vuex'


export default {
name: 'Profil',
data(){
return{
    modeEdition: false,
    nouveauMail: "",
    nouvelleAdresse: "",
    nouveauTel1: "",
    nouveauTel2: "",
}
},
components: {
Header,
},
computed:{
...mapState(['logged','userActif','sessionStorage','urlApi','reservation']),
},
methods: {
    supprProfil(id){
        let tokenInfo = JSON.parse(this.sessionStorage[0])
        let requestOption = {
                method :"DELETE",
                mode: "cors",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenInfo.token}`,
                },
                body : JSON.stringify({
                    "userId":id,
                })
        }
        fetch(this.urlApi.deleteUser, requestOption)
        .then((reponse) => 
            reponse.json()
            .then(() => {
                this.$store.commit("deconnexion")
            })
        ).catch(erreur => console.log('erreur : ' + erreur));
    },
    updateMode(){
        this.modeEdition = !this.modeEdition;
        this.nouveauMail = "";
        this.nouvelleAdresse = "";
        this.nouveauTel1 = "";
        this.nouveauTel2 = "";
    },
    updateProfil(id){
        console.log(id);
        if(!this.nouveauMail){
            this.nouveauMail = this.userActif.email;
        }
        if(!this.nouvelleAdresse){
            this.nouvelleAdresse = this.userActif.adresse
        }
        if(!this.nouveauTel1){
            this.nouveauTel1 = this.userActif.tel1
        }
        if(!this.nouveauTel2){
            this.nouveauTel2 = this.userActif.tel2
        }
        let tokenInfo = JSON.parse(this.sessionStorage[0])
        let requestOption = {
                method :"PUT",
                mode: "cors",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenInfo.token}`,
                },
                body : JSON.stringify({
                    "userId":id,
                    "mail":this.nouveauMail,
                    "adresse":this.nouvelleAdresse,
                    "tel1": this.nouveauTel1,
                    "tel2": this.nouveauTel2,
                })
        }
        fetch(this.urlApi.updateUser, requestOption)
        .then((reponse) => 
            reponse.json()
            .then(() => {
                this.updateUserStore();
                this.updateMode();
            })
        ).catch(erreur => console.log('erreur : ' + erreur));
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

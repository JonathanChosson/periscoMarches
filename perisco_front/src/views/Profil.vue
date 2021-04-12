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

            <b-button type="submit" variant="success" class="m-1" @click="updateProfil(userActif._id)">Modifier</b-button>
            <b-button type="submit" variant="danger" v-b-toggle="'collapse-1'"  class="m-1">Suprimer mon compte</b-button>
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
        console.log(id);
    },
    updateProfil(id){
        this.modeEdition = true;
        console.log(id);
    }
},
mounted: function(){
    if(window.sessionStorage.length > 0){
        this.$store.commit("update", JSON.parse(window.sessionStorage[0]))
    }
},

}
</script>

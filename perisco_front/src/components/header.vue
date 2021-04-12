<template>
    <div class="sticky-top">
    <b-navbar toggleable="lg" type="light" variant="light">
        <b-navbar-brand href="#">
            <img src="../assets/images/logo.png" alt="Réservation Cantine" class="header_img" />
            <p class="h6">Réservation Cantine</p>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="d-flex align-items-center">
                <b-nav-item>
                    <router-link to="/" class="text-dark">
                        <b-avatar variant="secondary" icon="house-fill" ></b-avatar><br />
                        Accueil
                    </router-link>
                </b-nav-item>
                <b-nav-item v-if="userActif.compteValid && logged">
                    <router-link to="/reservation" class="text-dark">
                        <b-avatar variant="secondary" icon="calendar2-date-fill" ></b-avatar><br />
                        Réserver
                    </router-link>
                </b-nav-item>
                <b-nav-item v-if="userActif.compteValid && logged">
                    <router-link to="/profil" class="text-dark">
                        <b-avatar variant="secondary"></b-avatar><br />
                        Mon profil
                    </router-link>
                </b-nav-item>
                <!-- <b-nav-item v-if="logged" v-b-modal="'modif-user-modal'">
                    <b-avatar v-if="!userInfo.user.photo"></b-avatar>
                    <b-avatar v-else :src="userInfo.user.photo"></b-avatar>
                    <p class="text-white m-0"  > {{userInfo.user.userName}}</p>
                </b-nav-item> -->
                <b-nav-item v-if="logged" @click="deconnexion()">
                    <b-avatar variant="warning" icon="power" ></b-avatar>
                    <p class="text-dark m-0">Deconnexion</p>
                </b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default {
    name: 'Header',
    data(){
        return{
        
        }
    },
    props: {
        
    },
    computed: {
        ...mapState(['logged','urlApi','userActif']),
        ...mapGetters({myState: 'getMyState'}),
    },
    methods : {
        // Deconnexion
        deconnexion(){
            this.$store.commit("deconnexion")
        }
    },
    watch: {
        '$store.state.sessionStorage': function() {
            let tokenInfo = JSON.parse(this.$store.getters.getMyState[0])
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
    }
}
</script>
<style>
.header_img{
    max-width: 150px;
}
</style>

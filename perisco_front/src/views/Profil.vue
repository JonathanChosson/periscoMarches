<template>
    
</template>

<script>
import Header from '../components/header';
import { mapState } from 'vuex'


export default {
name: 'Profil',
data(){
return{
}
},
components: {
Header,
},
computed:{
...mapState(['logged','userActif','sessionStorage','urlApi','reservation']),
},
methods: {

},
mounted: function(){
    if(window.sessionStorage.length > 0){
        this.$store.commit("update", JSON.parse(window.sessionStorage[0]))
    }
},

}
</script>

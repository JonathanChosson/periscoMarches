const Dateresa = require('../models/date');
const User = require('../models/user');

//Route inscription http://localhost:3000/api/date/inscription
exports.inscription = (req, res, next) => {
    Dateresa.find()
    .then((datesBdd) => {
        for(i in req.body.dates){
            const resultat = datesBdd.find( datesBdd => datesBdd.dateResa == req.body.dates[i]);
            if(!resultat){
                const newResa = new Dateresa({
                    dateResa: req.body.dates[i],
                    enfantsInscrit: req.body.enfants
                })
                newResa.save()
            }else{
                for(i in req.body.enfants){
                    const dejaInscrit = resultat.enfantsInscrit.find(enfant => enfant.prenom == req.body.enfants[i].prenom && enfant.nom == req.body.enfants[i].nom)
                    if(!dejaInscrit){
                        resultat.enfantsInscrit.push(req.body.enfants[i])
                    }else{
                        resultat.enfantsInscrit.splice(resultat.enfantsInscrit.indexOf(dejaInscrit), 1)
                    } 
                }
                Dateresa.updateOne({_id: resultat._id}, {enfantsInscrit: resultat.enfantsInscrit, _id: resultat._id})
                .then(() => res.status(200).json({message : 'Inscription confirmé'}))
                .catch(error => res.status(400).json({ error }));
            }
        }
    }
    )
    .catch(error => res.status(400).json({ error }));
};

exports.getonereservation = (req, res, next) => {
    //obtenir tableau des dates
    async function dateArray(){
        let ajd = new Date();
        ajd = ajd.toJSON();
        ajd = ajd.split('T',1)
        const reponse = await Dateresa.find({dateResa :{$gte : ajd[0]}})
        return reponse
    }
    
    //obtenir tableau enfants
    async function enfantArray(){
        const reponse = await User.findOne({_id : req.headers.userid}).select('enfants')
        return reponse
    }
    
    //comparer les deux tableaux 
    async function compare(){
        let tableauDate = await dateArray();
        let tableauEnfant = await enfantArray();
        let tableauReservation = [];
        for (t in tableauEnfant.enfants){
            const enfant = {
                "enfant": tableauEnfant.enfants[t],
                "dates" :[]
            }
            for (i in tableauDate){
                const resultat = tableauDate[i].enfantsInscrit.find( enfant => enfant.prenom == tableauEnfant.enfants[t].prenom && enfant.nom == tableauEnfant.enfants[t].nom);
                if(resultat){
                    enfant.dates.push(tableauDate[i].dateResa)
                }
            }
            tableauReservation.push(enfant)
        }
        res.status(200).json({reservation : tableauReservation})
    }
    compare()
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//Route inscription http://localhost:3000/api/user/signup
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
        email: req.body.email,
        password: hash,
        premiereConnexion : true,
        compteValid: false,
        nomDeFamille: req.body.nomDeFamille,
        isAdmin: false
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//Route connexion http://localhost:3000/api/user/login
exports.login = (req,res,next) => {
    User.findOne({email : req.body.email})
    .then(user =>{
        if (!user) {
            return res.status(401).json({error : 'Utilisateur non trouvé !'});
        }
        else{
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid){
                    return res.status(401).json({error : 'Mot de passe incorrect !'});
                }else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId : user._id},
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        )
                    });
                }
            })
            .catch(error => res.status(500).json({error}));
        }
    })
    .catch(error => res.status(500).json({error}));
}; 

//Route Avoir un profil http://localhost:3000/api/user/getone
exports.getoneprofil = (req,res,next) => {  
    let userIn = "";
    if (req.body.userId === undefined){
    userIn = req.headers.userid;
    }else {
    userIn = req.body.userId;
    }
    User.findOne({ _id: userIn }).select("-password")
    .then(user => res.status(200).json(user))
    .catch(error => res.status(400).json({ error }))
}

//Route Avoir un profil http://localhost:3000/api/user/getAllProfile
exports.getAllProfile = (req,res,next) => {  
    User.find().select("-password")
    .then(user => res.status(200).json(user))
    .catch(error => res.status(400).json({ error }))
}

//Route modification http://localhost:3000/api/user/update
exports.update = (req,res,next) => {
    const userObject = { ...req.body};
    User.updateOne({_id: req.body.userId}, {...userObject , _id: req.body.userId})
    .then(() => res.status(200).json({ message: 'Utilisateur Modifié !'}))
    .catch(error => res.status(400).json({ error })); 
}

//Route modification http://localhost:3000/api/user/updateAll
exports.updateAll = (req,res,next) => {
    console.log(req.body.fiche);
    for(ficheValid in req.body.fiche){
        console.log(req.body.fiche[ficheValid]);
        User.updateOne({_id: req.body.fiche[ficheValid]}, {compteValid : true})
        .then(() =>console.log('modifié'))
        .catch(error => console.log(error)); 
    }
    res.status(200).json({ message: 'Utilisateurs Modifiés !'})
}

//Route delete http://localhost:3000/api/user/delete
exports.delete = (req,res,next) => {
    User.findOne({_id : req.body.userId})
    .then(() => {
        User.deleteOne({_id: req.body.userId})
        .then(() => res.status(200).json({message : 'Compte supprimé'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error })); 
}
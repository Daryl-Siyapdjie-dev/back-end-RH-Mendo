import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import logging from '../config/logging';
import User from '../models/user.model';
import signJWT from '../library/signJWT';
import { v4 as uuidv4 } from 'uuid';
const NAMESPACE = 'User';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Token validated, user authorized.');

    return res.status(200).json({
        message: 'Token(s) validated'
    });
};

const register = (req: Request, res: Response, next: NextFunction) => {
    
    let { matricule, email, password } = req.body;
    
    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(401).json({
                message: hashError.message,
                error: hashError
            });
        }
 
        const _user = new User({
            ...req.body,
            _id: new mongoose.Types.ObjectId(),

            matricule,
            email,
            password: hash,
            
        });
 
        return _user.save().then((user) => {
                return res.status(201).json({
                   user
                });
            })
            .catch((error) => {
                return res.status(500).json({
                   message: error.message,
                   error
                });
            });
    });
 };

 const login = (req: Request, res: Response, next: NextFunction) => {
   
    let { matricule, email, password } = req.body;
  
    User.find({ matricule, email }).exec()
       .then((users) => {

            if (users.length !== 1) {
                return res.status(401).send({
                   message: 'Non autorisé'
                });
            }
  
            bcryptjs.compare(password, users[0].password, (error, result) => {
                if (error) {
                   return res.status(401).send({message: 'Non concordance des mots de passe' });
                } else if (result) {
                   signJWT(users[0], (_error, token) => {
                       if (_error) {
                           return res.status(500).json({
                               message: _error.message,
                               error: _error
                           });
                       } else if (token) {
                           return res.status(200).json({
                               message: 'Auth successful',
                               token: token,
                               user: users[0]
                           });
                       }
                   });
                }
            });
        })
        .catch((err) => {console.log(err);
             res.status(500).json({error: err});
        });
  };

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select('-password')
        .exec()
        .then((users) => {
            return res.status(200).json({
                users: users,
                count: users.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};


   const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
    
        const personnel = await User.findById(id);
        if (!personnel) {
          return res.status(404).json({ error: 'Personnel non trouvé.' });
        }
    
        // Suppression du personnel de la base de données
        await User.findByIdAndDelete(id);
    
        res.status(200).json({ message: 'Personnel supprimé avec succès' });
     } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du personnel.' });
     }
   };

   const updateUser = async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { nom, prenom, sexe, email, telephone, statut, poste, role, roleIdrole, matricule, password } = req.body;
    
        // Vérification des champs requis
        if (!nom || !prenom || !sexe || !email || !telephone || !poste || !role || !matricule || !password) {
          return res.status(400).json({ error: 'Tous les champs sont requis.' });
        }
    
        const personnel = await User.findById(id);
        if (!personnel) {
          return res.status(404).json({ error: 'Personnel non trouvé.' });
        }
    
        // Mise à jour des informations du personnel
        personnel.nom = nom;
        personnel.prenom = prenom;
        personnel.sexe = sexe;
        personnel.email = email;
        personnel.telephone = telephone;
        personnel.statut = statut;
        personnel.poste = poste;
        personnel.role = role;
        personnel.roleIdrole = roleIdrole;
        personnel.matricule = matricule;
        personnel.password = password;
    
        await personnel.save();
    
        res.status(200).json({ message: 'Personnel mis à jour avec succès', personnel });
     } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du personnel.' });
     }
    };
   

export default { validateToken, register, login, getAllUsers,deleteUser, updateUser };
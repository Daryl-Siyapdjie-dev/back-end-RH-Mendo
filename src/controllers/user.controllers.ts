import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import logging from '../config/logging';
import User, { IUser } from '../models/user.model';
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

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (id) {
            // Recherchez un utilisateur spécifique par son ID
            const user = await User.findById(id).select('-password');
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé.' });
            }
            return res.status(200).json(user);
        } else {
            // Recherchez tous les utilisateurs
            const users = await User.find().select('-password');
            return res.status(200).json({
                users: users,
                count: users.length
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error
        });
    }
};


   const deleteUser = async (req: Request, res: Response) => {
    try {
        const { _id } = req.params;
    
        const personnel = await User.findById(_id);
        if (!personnel) {
          return res.status(404).json({ error: 'Personnel non trouvé.' });
        }
    
        // Suppression du personnel de la base de données
        await User.findByIdAndDelete(_id);
    
        res.status(200).json({ message: 'Personnel supprimé avec succès' });
     } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du personnel.' });
     }
   };

   const updateUser = async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      const updateFields: Partial<IUser> = req.body; // Requête contenant les champs à mettre à jour
  
      // Vérification si l'utilisateur existe
      const personnel = await User.findById(_id);
      if (!personnel) {
        return res.status(404).json({ error: 'Personnel non trouvé.' });
      }
  
      // Mise à jour des champs modifiés
      Object.keys(updateFields).forEach((key) => {
        // Utilisation de $set pour mettre à jour chaque champ individuellement
        personnel[key] = updateFields[key];
      });
  
      // Sauvegarde des modifications
      await personnel.save();
  
      res.status(200).json({ message: 'Personnel mis à jour avec succès', personnel });
    } catch (error) {
      console.error(error);
  
      // Gestion des erreurs
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((e: any) => e.message);
        return res.status(400).json({ error: errors });
      }
  
      res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du personnel.' });
    }
  };
   

export default { validateToken, register, login, getAllUsers,deleteUser, updateUser };
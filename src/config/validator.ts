import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';



const validate = (data) => {
    const schema = Joi.object({
     idpersonnel: Joi.number().label("Id Personnel"),
     nom: Joi.string().label("Nom"),
     personnelcol: Joi.string().label("Personnel Coll"),
     prenom: Joi.string().label("Prenom"),
     sexe: Joi.string().label("Sexe"),
     email: Joi.string().email().required().label("Email"),
     telephone: Joi.number().label("Telephone"),
     statut: Joi.string().label("Statut"),
     poste: Joi.string().label("Poste"),
     role: Joi.string().label("Role"),
     roleIdrole: Joi.number().label("Role Id Role"),
     matricule: Joi.string().min(4).required().label("Matricule"),
     password: passwordComplexity().min(6).required().label("Password"),
    });
   
    return schema.validate(data);
   };

   export default validate
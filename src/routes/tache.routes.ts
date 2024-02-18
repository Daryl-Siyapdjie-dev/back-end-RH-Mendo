import { Router } from 'express';
import Controller from '../controllers/tache.controllers'

const router = Router();


router.post('/creerTache', Controller.creerTache);

router.get('/lireTache/:id?', Controller.lireTache);

router.patch('/modifierTache/:id', Controller.modifierTache);

router.delete('/supprimerTache/:id', Controller.supprimerTache);

export default router;
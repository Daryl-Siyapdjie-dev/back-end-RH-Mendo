import express from 'express';
import extractJWT from '../middleware/extractJWT.middleware';
import controller from '../controllers/user.controllers'

const router = express.Router();


router.get('/validate', extractJWT, controller.validateToken);
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/getAllUsers', controller.getAllUsers);
router.delete("/deleteUsers/:id",controller.deleteUser);
router.patch("/updateUsers/:id", controller.updateUser);

export default router;
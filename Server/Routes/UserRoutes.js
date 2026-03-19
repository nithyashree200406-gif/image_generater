import express from 'express'
import {registerUser,loginUser, userCredits} from '../Controllers/UserControllers.js';
import userAuth from '../MiddleWares/Auth.js'

const UserRouter = express.Router();

UserRouter.post('/register',registerUser)
UserRouter.post('/login',loginUser)
UserRouter.post('/credits',userAuth,userCredits)

export default UserRouter;
//http://localhost:4000/api/user/register
//http://localhost:4000/api/user/login
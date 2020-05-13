import { Router } from 'express';
import ForgotPasswordContoller from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordsRouter = Router();

const forgotPasswordContoller = new ForgotPasswordContoller();
const resetPasswordController = new ResetPasswordController();

passwordsRouter.post('/forgot', forgotPasswordContoller.create);

passwordsRouter.post('/reset', resetPasswordController.create);

export default passwordsRouter;

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ResetPasswordController {
    async create(req: Request, res: Response): Promise<Response> {
        const { password, token } = req.body;

        const sendForgotPasswordEmail = container.resolve(ResetPasswordService);

        await sendForgotPasswordEmail.execute({ password, token });

        return res.status(204).json();
    }
}

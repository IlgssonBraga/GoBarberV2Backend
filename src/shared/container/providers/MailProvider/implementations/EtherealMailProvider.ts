import nodemailer, { Transporter } from 'nodemailer';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import { inject, injectable } from 'tsyringe';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
class EtherealMailProvider implements IMailProvider {
    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider,
    ) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'okey0@ethereal.email',
                pass: 'KQhZx7bH3T1kpem4H9',
            },
        });

        this.client = transporter;
    }

    public async sendMail({
        to,
        from,
        subject,
        templateData,
    }: ISendMailDTO): Promise<void> {
        const message = await this.client.sendMail({
            from: {
                name: from?.name || 'Equipe GoBarber',
                address: from?.email || 'equipe@gobarber.com.br',
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData),
        });

        console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}

export default EtherealMailProvider;

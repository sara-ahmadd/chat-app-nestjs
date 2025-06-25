import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerEmailService {
  constructor(private readonly Mailer_Service: MailerService) {}

  async sendEmail({
    email,
    subject,
    html,
  }: {
    email: string;
    subject: string;
    html: string;
  }) {
    this.Mailer_Service.sendMail({
      from: 'Chat App 📧',
      to: email,
      subject,
      html,
    });
  }
}

import { mail } from './dto/mails.dto';
import { MailService } from './mails.service';

export const Mailer = (mailService: MailService) => {
  const welcomeMail = async (data: { email: string; name: string }) => {
    const payload: mail = {
      subject: 'Welcome to SwiftDrop!',
      recipients: data.email,
      template: 'welcome.ejs',
      context: {
        name: data.name,
        email: data.email,
        verificationLink: 'https://swiftdrop.vercel.app/login',
      },
    };
    await mailService.sendEmail(payload);
  };
  return {
    welcomeMail,
  };
};

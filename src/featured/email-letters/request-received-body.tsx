import { emailStyle, moddleEmailFooter } from './credentials-body';
import { htmlTemplate } from './html-template';

export const requestReceivedBody = ({
  username,
  packageName,
}: {
  username: string;
  packageName?: string;
}) => {
  return htmlTemplate({
    body: `
      <div style="width: 595px; margin: 0 auto;">
        <img style="display:block; border:0; outline:none; text-decoration:none; font-size:0; line-height:0;" src="https://moddle3d.com/images/email/header.png" alt="Moddle 3D" width="595" height="100" />
        <div class="wrapper">
          <div class="main">
            <p style="font-size: 24px; color: #fff; margin-bottom: 24px; font-weight: 600;">We have received your request</p>
            <p class="text" style="color: #717173; margin-bottom: 16px;">Dear ${username},</p>
            <p class="text" style="color: #717173; margin-bottom: 16px;">We have successfully received your inquiry for the${packageName ? ` <span style="color: #fff; font-weight: 600;">${packageName}</span>` : ' selected creative'} package.</p>
            <p class="text" style="color: #717173; margin-bottom: 16px;">Before we can proceed, we kindly ask you to provide a few details about your project so that we can review your requirements and prepare for production:</p>
            <ul class="text" style="color: #717173; margin: 0 0 24px; padding-left: 20px;">
              <li style="margin-bottom: 8px;">A brief description of your project and its objective.</li>
              <li style="margin-bottom: 8px;">The script (if available), or let us know if you require scriptwriting assistance.</li>
              <li style="margin-bottom: 8px;">Any reference videos or examples of the style you would like to achieve.</li>
              <li style="margin-bottom: 8px;">Any branding materials (logo, brand colors, fonts, etc.), if applicable.</li>
              <li style="margin-bottom: 8px;">Any other requirements or information you would like us to take into account.</li>
            </ul>
            <p class="text" style="color: #717173; margin-bottom: 16px;">Once we receive these details, our team will review your project to ensure everything is clear.</p>
            <p class="text" style="color: #717173; margin-bottom: 16px;">After that, we will send you our IBAN details for payment via bank transfer. As soon as we receive your payment, we will begin working on your project.</p>
            <p class="text" style="color: #717173; margin-bottom: 16px;">If you have any questions, please feel free to reply to this email.</p>
            <p class="text" style="color: #717173; margin-bottom: 24px;">We look forward to working with you!</p>
            <p style="color: #fff; font-size: 20px; font-weight: 600;">Cheers, <br /><span style="color: #2583FF;">The Moddle 3D Team</span></p>
          </div>
        </div>
        ${moddleEmailFooter}
      </div>
    `,
    style: emailStyle,
  });
};

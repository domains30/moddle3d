import { htmlTemplate } from './html-template';

export const credentialsBody = ({
  username,
  email,
  password,
  loginUrl,
}: {
  username: string;
  email: string;
  password: string;
  loginUrl: string;
}) => {
  return htmlTemplate({
    body: `
      <div style="width: 595px; margin: 0 auto;">
        <img style="display:block; border:0; outline:none; text-decoration:none; font-size:0; line-height:0;" src="https://moddle3d.com/images/email/header.png" alt="Moddle 3D" width="595" height="100" />
        <div class="wrapper">
          <div class="main">
            <p style="font-size: 24px; color: #fff; margin-bottom: 24px; font-weight: 600;">Welcome to <span style="color: #2583FF;">Moddle 3D</span>!</p>
            <p class="text" style="color: #717173; margin-bottom: 16px;">Dear ${username},</p>
            <p class="text" style="color: #717173; margin-bottom: 16px;">We’ve created an account for you so you can track your orders and download your files anytime. Here are your login details:</p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="background: #191A1C; padding: 24px; border-radius: 12px;">
                  <table width="100%" cellpadding="8" cellspacing="0" border="0" style="border-collapse: collapse; color: #717173; font-size: 16px;">
                    <tr>
                      <td style="border-bottom: 1px solid rgba(113, 113, 115, 0.15); font-weight: 500; color: #717173;">Email:</td>
                      <td style="border-bottom: 1px solid rgba(113, 113, 115, 0.15); font-weight: 500; color: #fff;">${email}</td>
                    </tr>
                    <tr>
                      <td style="font-weight: 500; color: #717173;">Password:</td>
                      <td style="font-weight: 500; color: #fff;">${password}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <p class="text" style="color: #717173; margin-bottom: 16px;">For your security, we recommend logging in and changing your password as soon as possible.</p>
            <p style="margin-bottom: 24px;"><a href="${loginUrl}" style="display: inline-block; background: #2583FF; color: #fff; padding: 14px 24px; border-radius: 24px; text-decoration: none; font-weight: 600;">Log in to your account</a></p>
            <p class="text" style="color: #717173; margin-bottom: 16px;">If you didn’t place this order, please contact us right away.</p>
            <p style="color: #fff; font-size: 20px; font-weight: 600;">Cheers, <br /><span style="color: #2583FF;">The Moddle 3D Team</span></p>
          </div>
        </div>
        ${moddleEmailFooter}
      </div>
    `,
    style: emailStyle,
  });
};

export const moddleEmailFooter = `
  <div style="background: #121316; padding: 24px 16px; text-align: center;">
    <p style="color: #fff; font-size: 18px; font-weight: 600; margin: 0 0 8px;">Moddle 3D</p>
    <p style="color: #717173; font-size: 14px; margin: 0;">
      <a href="mailto:support@moddle3d.com" style="color: #717173; text-decoration: none;">support@moddle3d.com</a>
      &nbsp;&nbsp;
      <a href="tel:+48732143539" style="color: #717173; text-decoration: none;">+48732143539</a>
    </p>
  </div>
`;

export const emailStyle = `
  .main {
    border-radius: 24px;
    border: 1px solid #222325;
    background: #141517;
    padding: 24px;
  }

  .wrapper {
    background: #121316;
    padding: 16px;
  }

  .strong {
    font-weight: 600;
    color: #000;
  }

  .text {
    color: #717173 !important;
    font-size: 16px;
  }
`;

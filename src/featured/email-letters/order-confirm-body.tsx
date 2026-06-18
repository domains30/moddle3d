import { moddleEmailFooter } from './credentials-body';
import { htmlTemplate } from './html-template';

export const orderConfirmBody = ({
  username,
  orderNumber,
  description,
  orderDate,
  total,
}: {
  username: string;
  orderNumber: string;
  orderDate: string;
  description: string;
  total: string;
}) => {
  return htmlTemplate({
    body: `
      <div style="width: 595px; margin: 0 auto;">
        <img style="display:block; border:0; outline:none; text-decoration:none; font-size:0; line-height:0;" src="https://moddle3d.com/images/email/header.png" alt="full-logo" width="595" height="100" />
        <div class="wrapper">
          <div class="main">
            <p style="font-size: 24px; color: #fff; margin-bottom: 24px; font-weight: 600;">Your Order is On! Let’s Get This Party Started – <span style="color: #2583FF;">${orderNumber}</span></p>
            <p class="text" style="color: #717173; margin-bottom: 16px;">Dear ${username},</p>
            <p class="text" style="color: #717173; margin-bottom: 16px;">Guess what? Your order has been officially received and is ready for action! We’re super excited to start bringing your project to life and make it shine.</p>
            <p class="text" style="color: #717173; margin-bottom: 16px;">To get moving, we’ll send over the payment details shortly. Once we have the funds, we’ll jump right in and get to work on your project. </p>
            <p class="text" style="color: #717173; margin-bottom: 24px;">Here’s a quick peek at your order details: </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="background: #191A1C; padding: 24px; border-radius: 12px;">
                  <table width="100%" cellpadding="8" cellspacing="0" border="0" style="border-collapse: collapse; color: #717173; font-size: 16px;">
                    <tr>
                      <td style="border-bottom: 1px solid rgba(113, 113, 115, 0.15); font-weight: 500; color: #717173;">Order Number:</td>
                      <td style="border-bottom: 1px solid rgba(113, 113, 115, 0.15); font-weight: 500; color: #fff;">${orderNumber}</td>
                    </tr>
                    <tr>
                      <td style="border-bottom: 1px solid rgba(113, 113, 115, 0.15); font-weight: 500; color: #717173;">Order Date:</td>
                      <td style="border-bottom: 1px solid rgba(113, 113, 115, 0.15); font-weight: 500; color: #fff;">${orderDate}</td>
                    </tr>
                    <tr>
                      <td style="border-bottom: 1px solid rgba(113, 113, 115, 0.15); font-weight: 500; color: #717173;">Description:</td>
                      <td style="border-bottom: 1px solid rgba(113, 113, 115, 0.15); font-weight: 500; color: #fff;">${description}</td>
                    </tr>
                    <tr>
                      <td style="font-weight: 500; color: #717173;">Total Amount Due:</td>
                      <td style="font-weight: 500; color: #fff;">${total}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <p class="text" style="color: #717173; margin-bottom: 16px;">To keep things running smoothly, please complete the payment as soon as possible. If you need anything or have any questions, we’re here to help!</p>
            <p class="text" style="color: #717173; margin-bottom: 16px;">Thank you for trusting Moddle 3D! We can’t wait to create something amazing for you!</p>
            <p style="color: #fff; font-size: 20px; font-weight: 600;">Cheers, <br /><span style="color: #2583FF;">The Moddle 3D Team</span></p>
          </div>
        </div>
        ${moddleEmailFooter}
      </div>
    `,
    style: `      
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
    `,
  });
};

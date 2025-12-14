import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface InvoiceEmailData {
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: Date;
  description: string;
  paymentLink: string;
}

export const sendInvoiceEmail = async (data: InvoiceEmailData): Promise<void> => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${data.invoiceNumber}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Invoice Notification</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Dear ${data.clientName},</p>
        
        <p style="font-size: 16px;">We have issued a new invoice for your records:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Invoice Number:</td>
              <td style="padding: 8px 0; text-align: right;">${data.invoiceNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Amount:</td>
              <td style="padding: 8px 0; text-align: right; font-size: 18px; color: #667eea; font-weight: bold;">${data.currency} ${data.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Due Date:</td>
              <td style="padding: 8px 0; text-align: right;">${new Date(data.dueDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Description:</td>
              <td style="padding: 8px 0; text-align: right;">${data.description}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.paymentLink}" 
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            Pay Now
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          You can also copy and paste this link into your browser:<br>
          <a href="${data.paymentLink}" style="color: #667eea; word-break: break-all;">${data.paymentLink}</a>
        </p>
        
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          If you have any questions, please don't hesitate to contact us.
        </p>
        
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          Best regards,<br>
          Invoicing Platform Team
        </p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: data.clientEmail,
    subject: `Invoice ${data.invoiceNumber} - Payment Required`,
    html: htmlTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invoice email sent to ${data.clientEmail}`);
  } catch (error) {
    console.error('Error sending invoice email:', error);
    throw error;
  }
};

export interface ResetPasswordEmailData {
  userEmail: string;
  userName: string;
  resetLink: string;
}

export const sendPasswordResetEmail = async (data: ResetPasswordEmailData): Promise<void> => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Password Reset Request</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hello ${data.userName || 'User'},</p>
        
        <p style="font-size: 16px;">You requested to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" 
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            Reset Password
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>
        
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          You can also copy and paste this link into your browser:<br>
          <a href="${data.resetLink}" style="color: #667eea; word-break: break-all;">${data.resetLink}</a>
        </p>
        
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          Best regards,<br>
          Invoicing Platform Team
        </p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: data.userEmail,
    subject: 'Password Reset Request',
    html: htmlTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${data.userEmail}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};



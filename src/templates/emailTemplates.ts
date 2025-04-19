export const verificationEmailTemplate = (
  user: { firstName: string },
  verificationUrl: string
): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
    <!-- Wrapper Table -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <!-- Logo Section -->
      <tr>
        <td align="center" style="padding: 40px 10px;">
          <img src="https://cdn.dribbble.com/userupload/16575912/file/original-6f6c8aef3c1d7b55fb33492302814312.jpg?resize=1024x768&vertical=center" alt="Your Company Logo" style="display: block; width: 150px; max-width: 100%;" />
        </td>
      </tr>
      <!-- Email Container -->
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.1);">
            <!-- Header -->
            <tr>
              <td align="center" style="padding: 40px 30px 20px 30px;">
                <h1 style="font-size:24px; margin:0; color:#333333;">Verify Your Email Address</h1>
              </td>
            </tr>
            <!-- Body Text -->
            <tr>
              <td style="padding: 20px 30px 40px 30px; color:#666666; font-size:16px; line-height:24px;">
                <p style="margin:0 0 16px 0;">Hello ${user.firstName},</p>
                <p style="margin:0 0 16px 0;">Thank you for signing up! Please click the button below to verify your email address and complete your registration.</p>
                <p style="margin:0 0 16px 0;">If you did not sign up for this account, you can safely ignore this email.</p>
                <p style="margin:0;">Cheers,<br />AI Labs Bootcamp Team</p>
              </td>
            </tr>
            <!-- Button -->
            <tr>
              <td align="center" style="padding-bottom:40px;">
                <a href="${verificationUrl}" target="_blank" style="background-color:#28a745; color:#ffffff; padding:15px 30px; text-decoration:none; border-radius:5px; font-size:16px; display:inline-block;">Verify Email</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td align="center" style="padding:20px 10px; font-size:12px; color:#aaaaaa;">
          <p style="margin:0;">If you're having trouble clicking the "Verify Email" button, copy and paste the URL below into your web browser:</p>
          <p style="margin:0;"><a href="${verificationUrl}" style="color:#28a745; text-decoration:none;">${verificationUrl}</a></p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const confirmationEmailTemplate = (user: {
  firstName: string;
}): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verified</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 40px 10px;">
          <img src="https://cdn.dribbble.com/userupload/16575912/file/original-6f6c8aef3c1d7b55fb33492302814312.jpg?resize=1024x768&vertical=center" alt="Your Company Logo" style="display: block; width: 150px; max-width: 100%;" />
        </td>
      </tr>
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.1);">
            <tr>
              <td align="center" style="padding: 40px 30px 20px 30px;">
                <h1 style="font-size:24px; margin:0; color:#333333;">Email Verified</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px 40px 30px; color:#666666; font-size:16px; line-height:24px;">
                <p style="margin:0 0 16px 0;">Hello ${user.firstName},</p>
                <p style="margin:0 0 16px 0;">Congratulations! Your email address has been successfully verified. You can now enjoy all the features our service offers.</p>
                <p style="margin:0;">Cheers,<br />AI Labs Bootcamp Team</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:20px 10px; font-size:12px; color:#aaaaaa;">
          <p style="margin:0;">If you have any questions, feel free to reply to this email.</p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const passwordChangedEmailTemplate = (user: {
  firstName: string;
}): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Changed</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 40px 10px;">
          <img src="https://cdn.dribbble.com/userupload/16575912/file/original-6f6c8aef3c1d7b55fb33492302814312.jpg?resize=1024x768&vertical=center" alt="Your Company Logo" style="display: block; width: 150px; max-width: 100%;" />
        </td>
      </tr>
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.1);">
            <tr>
              <td align="center" style="padding: 40px 30px 20px 30px;">
                <h1 style="font-size:24px; margin:0; color:#333333;">Password Changed Successfully</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px 40px 30px; color:#666666; font-size:16px; line-height:24px;">
                <p style="margin:0 0 16px 0;">Hello ${user.firstName},</p>
                <p style="margin:0 0 16px 0;">This email is to confirm that your account password has been changed successfully. If you did not perform this action, please contact support immediately.</p>
                <p style="margin:0;">Cheers,<br />AI Labs Bootcamp Team</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:20px 10px; font-size:12px; color:#aaaaaa;">
          <p style="margin:0;">If you have any questions or did not change your password, please reach out to our support team.</p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const forgetPasswordEmailTemplate = (
  user: { firstName: string },
  resetUrl: string
): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset Your Password</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 40px 10px;">
          <img src="https://cdn.dribbble.com/userupload/16575912/file/original-6f6c8aef3c1d7b55fb33492302814312.jpg?resize=1024x768&vertical=center" alt="Your Company Logo" style="display: block; width: 150px; max-width: 100%;" />
        </td>
      </tr>
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.1);">
            <tr>
              <td align="center" style="padding: 40px 30px 20px 30px;">
                <h1 style="font-size:24px; margin:0; color:#333333;">Reset Your Password</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px 40px 30px; color:#666666; font-size:16px; line-height:24px;">
                <p style="margin:0 0 16px 0;">Hello ${user.firstName},</p>
                <p style="margin:0 0 16px 0;">We received a request to reset your password. Click the button below to reset it. If you did not request a password reset, please ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:40px;">
                <a href="${resetUrl}" target="_blank" style="background-color:#28a745; color:#ffffff; padding:15px 30px; text-decoration:none; border-radius:5px; font-size:16px; display:inline-block;">Reset Password</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:20px 10px; font-size:12px; color:#aaaaaa;">
          <p style="margin:0;">If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>
          <p style="margin:0;"><a href="${resetUrl}" style="color:#28a745; text-decoration:none;">${resetUrl}</a></p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

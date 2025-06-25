export const verifyEmailUpdate = (otp: string) => {
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
        margin: 0;
      }
      .container {
        background-color: #ffffff;
        max-width: 600px;
        margin: 0 auto;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        color: #333333;
      }
      .otp-box {
        background-color: #f0f2ff;
        color: #6770e7;
        font-size: 24px;
        font-weight: bold;
        padding: 15px;
        text-align: center;
        letter-spacing: 4px;
        border-radius: 6px;
        margin: 30px 0;
      }
      .footer {
        font-size: 12px;
        color: #888888;
        text-align: center;
        margin-top: 20px;
      }
      @media (max-width: 600px) {
        .container {
          padding: 20px;
        }
        .otp-box {
          font-size: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2 class="header">Verify Your New Email Address</h2>
      <p>Hello,</p>
      <p>
        We received a request to update the email address associated with your account.
        To verify your new email address, please enter the OTP below in the app:
      </p>

      <div class="otp-box">${otp}</div>

      <p>
        This code is valid for the next 10 minutes. If you didn’t request this change,
        please ignore this email or contact our support team immediately.
      </p>

      <p>Thanks,<br />The Support Team</p>

      <div class="footer">
        &copy; 2025 Your Company. All rights reserved.
      </div>
    </div>
  </body>
</html>

    `;
};

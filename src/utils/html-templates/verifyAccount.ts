export function verifyAccount(otp: string) {
  return `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Account</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f8f9fa;
        padding: 20px;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
      }
      .otp {
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 4px;
        color: #007bff;
        text-align: center;
        margin: 20px 0;
      }
      .footer {
        font-size: 12px;
        text-align: center;
        color: #999;
        margin-top: 30px;
      }
      .btn {
        display: inline-block;
        background-color: #007bff;
        color: #fff !important;
        padding: 10px 20px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Verify Your Email</h2>
        <p>Use the code below to verify your account:</p>
      </div>

      <div class="otp">${otp}</div>

      <p style="text-align: center;">
        This code will expire in 10 minutes.<br />
        If you did not request this, please ignore this email.
      </p>

      <div class="footer">
        &copy; 2025 Your Company. All rights reserved.
      </div>
    </div>
  </body>
</html>

        `;
}

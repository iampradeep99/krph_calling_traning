function accountDetails(username, password, recipientName, loginUrl) {
    const emailContent = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333;
                        background-color: #f4f4f9;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }
                    h2 {
                        color: #4CAF50;
                    }
                    .info-box {
                        background-color: #f9f9f9;
                        border-radius: 8px;
                        padding: 15px;
                        margin-bottom: 20px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                    }
                    .info-box p {
                        margin: 5px 0;
                        color: #555;
                    }
                    .info-box strong {
                        color: #333;
                    }
                    .btn {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        text-align: center;
                        font-weight: bold;
                        margin-top: 20px;
                    }
                    .btn:hover {
                        background-color: #45a049;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #777;
                        text-align: center;
                    }
                    @media screen and (max-width: 600px) {
                        .container {
                            width: 100%;
                            padding: 10px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Welcome, ${recipientName}!</h2>
                    <p>Thank you for registering with us! Below are your account details:</p>

                    <div class="info-box">
                        <p><strong>Username:</strong> ${username}</p>
                        <p><strong>Password:</strong> ${password}</p>
                    </div>

                    <p>Please keep your login details safe. If you have any issues logging in or have forgotten your password, please don't hesitate to contact us.</p>

                    <p>To access your account, click the link below:</p>
                    <a href="${loginUrl}" class="btn">Go to Login</a>

                    <div class="footer">
                        <p>If you did not register with us, please ignore this email.</p>
                    </div>
                </div>
            </body>
        </html>
    `;

    return emailContent;
}

function forgotPasswordEmailTemplate(recipientName, resetLink) {
    const emailContent = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333;
                        background-color: #f4f4f9;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }
                    h2 {
                        color: #4CAF50;
                    }
                    .info-box {
                        background-color: #f9f9f9;
                        border-radius: 8px;
                        padding: 15px;
                        margin-bottom: 20px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                    }
                    .info-box p {
                        margin: 5px 0;
                        color: #555;
                    }
                    .info-box strong {
                        color: #333;
                    }
                    .btn {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        text-align: center;
                        font-weight: bold;
                        margin-top: 20px;
                    }
                    .btn:hover {
                        background-color: #45a049;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #777;
                        text-align: center;
                    }
                    @media screen and (max-width: 600px) {
                        .container {
                            width: 100%;
                            padding: 10px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Password Reset Request</h2>
                    <p>Hello ${recipientName},</p>

                    <p>We received a request to reset the password for your account. If you made this request, please click the link below to reset your password.</p>

                    <div class="info-box">
                        <p><strong>If you didn't request a password reset, please ignore this email.</strong></p>
                    </div>

                    <p>Click the link below to reset your password:</p>
                    <a href="${resetLink}" class="btn">Reset Password</a>

                    <div class="footer">
                        <p>If you have trouble resetting your password, please contact our support team.</p>
                    </div>
                </div>
            </body>
        </html>
    `;

    return emailContent;
}


module.exports = {
    accountDetails,
    forgotPasswordEmailTemplate
}

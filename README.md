# Elementor Form 4 Google Sheets Webhook

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Apache%202.0-green.svg)

A powerful and flexible Google Apps Script that captures form submissions from Elementor through a webhook, stores the data in Google Sheets, and optionally sends email notifications.

## Features

-   Dynamically adapts to any Elementor form structure
-   Automatically creates and updates Google Sheets based on form submissions
-   Intelligent error handling and logging
-   Optional email notifications for new submissions
-   Flattens nested form data for easier processing
-   Timestamps each submission for accurate tracking

## Getting Started

### Prerequisites

-   A Google account with access to Google Sheets and Google Apps Script
-   An Elementor form with webhook functionality enabled

### Installation

1. Open Google Sheets and create a new spreadsheet.
2. Go to Tools > Script editor to open the Google Apps Script editor.
3. Copy the entire code from `elementor-form-to-google-sheets-webhook.js` and paste it into the script editor.
4. Save the project with a name of your choice.

### Configuration

1. In the script, set the `emailNotification` variable to `true` if you want to receive email notifications for new submissions.
2. Update the `emailAddress` variable with your email address if you enabled notifications.

### Deployment

1. In the Google Apps Script editor, click on "Deploy" > "New deployment".
2. Choose "Web app" as the deployment type.
3. Set the following options:
    - Execute as: Your Google account
    - Who has access: Anyone
4. Click "Deploy" and authorize the necessary permissions.
5. Copy the provided Web app URL. This is your webhook URL.

### Connecting to Elementor

1. In your Elementor form settings, find the webhook or form submission URL field.
2. Paste the Web app URL you copied from the Google Apps Script deployment.

## Usage

Once set up, the script will automatically:

1. Receive form submissions from Elementor
2. Create a new sheet for each unique form (if it doesn't exist)
3. Update headers as new form fields are encountered
4. Append new submissions to the appropriate sheet
5. Send an email notification (if enabled) with submission details

## Customization

-   Modify the `processIncomingData` function to add custom data processing logic.
-   Adjust the `sendNotification` function to customize email content.
-   Implement additional security measures in the `doPost` function if needed.

## Contributing

-   `@Takk8IS`
-   `@davcavalcante`
-   `@fjallstoppur`

We welcome contributions from the community! If you'd like to contribute, please fork the repository, create a new branch, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the Attribution 4.0 International License.

## Support

If you need help with this project, please contact via email at say@takk.ag.

## Donations

If this script has been helpful for you, consider making a donation to support our work:

-   $USDT (TRC-20): `TGpiWetnYK2VQpxNGPR27D9vfM6Mei5vNA`

Your donations help us continue developing useful and innovative tools.

## Takk™ Innovate Studio

Leading the Digital Revolution as the Pioneering 100% Artificial Intelligence Team.

-   Copyright (c)
-   License: Attribution 4.0 International (CC BY 4.0)
-   Author: David C Cavalcante
-   LinkedIn: https://www.linkedin.com/in/hellodav/
-   Medium: https://medium.com/@davcavalcante/
-   Positive results, rapid innovation
-   URL: https://takk.ag/
-   X: https://twitter.com/takk8is/
-   Medium: https://takk8is.medium.com/

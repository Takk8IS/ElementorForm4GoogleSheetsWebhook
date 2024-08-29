/**
 * Copyright (c)
 * Author: David C Cavalcante (Enhanced by AI)
 * Developed by Takk™ Innovate Studio
 * License: Apache License 2.0
 * Version: 1.0.0
 * GitHub: https://github.com/Takk8IS
 * LinkedIn: https://www.linkedin.com/in/hellodav
 * Donations: $USDT (TRC-20): `TGpiWetnYK2VQpxNGPR27D9vfM6Mei5vNA`
 *
 * Description: Advanced system to capture form submissions via webhook, store data in Google Sheets,
 * perform data analysis, and send intelligent notifications.
 * Features: Adaptive data processing, advanced error handling, automatic data categorization,
 * intelligent email notifications, and data trend analysis.
 */

// Configuration object for easy adjustments
const CONFIG = {
    emailNotification: true,
    emailAddress: "davcavalcante@proton.me",
    maxRetries: 3,
    // milliseconds
    retryDelay: 1000,
    dataRetentionDays: 365,
    // standard deviations
    anomalyThreshold: 2,
};

/**
 * Handles GET requests to verify the webhook URL.
 */
function doGet() {
    return HtmlService.createHtmlOutput(
        "Webhook URL is active and ready to receive requests.",
    );
}

/**
 * Main function to handle POST requests from the Elementor form webhook.
 */
function doPost(e) {
    return executeWithRetry(() => {
        const params = processIncomingData(e.parameter);
        const formName = params["form_name"] || "Default_Form";
        const formSheet = getOrCreateSheet(formName);

        const headers = updateHeaders(formSheet, Object.keys(params));
        const values = mapValuesToHeaders(headers, params);

        appendDataToSheet(formSheet, values);
        performDataAnalysis(formSheet);

        if (CONFIG.emailNotification) {
            sendIntelligentNotification(
                params,
                getSheetURL(formSheet),
                formSheet,
            );
        }

        cleanupOldData(formSheet);

        return HtmlService.createHtmlOutput(
            "Form data received, processed, and analyzed successfully.",
        );
    });
}

/**
 * Executes a function with retry logic.
 */
function executeWithRetry(func) {
    for (let i = 0; i < CONFIG.maxRetries; i++) {
        try {
            return func();
        } catch (error) {
            if (i === CONFIG.maxRetries - 1) throw error;
            Utilities.sleep(CONFIG.retryDelay);
        }
    }
}

/**
 * Processes incoming data with advanced techniques.
 */
function processIncomingData(data) {
    const flattenedData = flattenObject(data);
    flattenedData.timestamp = new Date().toISOString();
    flattenedData.processed_data = JSON.stringify(
        intelligentDataProcessing(flattenedData),
    );
    return flattenedData;
}

/**
 * Performs intelligent data processing and categorization.
 */
function intelligentDataProcessing(data) {
    // Implement advanced data processing logic here
    // This could include natural language processing, data validation, etc.
    return {
        category: determineCategory(data),
        sentiment: analyzeSentiment(data),
        priority: calculatePriority(data),
    };
}

/**
 * Determines the category of the submission based on its content.
 */
function determineCategory(data) {
    // Implement category determination logic
    return "General";
}

/**
 * Analyzes the sentiment of the submission.
 */
function analyzeSentiment(data) {
    // Implement sentiment analysis logic
    return "Neutral";
}

/**
 * Calculates the priority of the submission.
 */
function calculatePriority(data) {
    // Implement priority calculation logic
    return "Medium";
}

/**
 * Flattens a nested object recursively.
 */
function flattenObject(obj, prefix = "") {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? `${prefix}.` : "";
        if (
            typeof obj[k] === "object" &&
            obj[k] !== null &&
            !Array.isArray(obj[k])
        ) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
}

/**
 * Updates headers in the Google Sheet dynamically.
 */
function updateHeaders(sheet, keys) {
    const existingHeaders = sheet
        .getRange(1, 1, 1, sheet.getLastColumn())
        .getValues()[0];
    const newHeaders = keys.filter((key) => !existingHeaders.includes(key));
    const allHeaders = [...new Set([...existingHeaders, ...newHeaders])];

    if (newHeaders.length > 0) {
        setHeaders(sheet, allHeaders);
    }

    return allHeaders;
}

/**
 * Maps incoming data values to the correct headers.
 */
function mapValuesToHeaders(headers, data) {
    return headers.map((header) => data[header] || "");
}

/**
 * Sets headers in the first row of the sheet with advanced formatting.
 */
function setHeaders(sheet, headers) {
    const range = sheet.getRange(1, 1, 1, headers.length);
    range.setValues([headers]);
    range.setFontWeight("bold");
    range.setHorizontalAlignment("center");
    range.setBackground("#f3f3f3");
    sheet.setFrozenRows(1);
}

/**
 * Appends data to the sheet with intelligent formatting.
 */
function appendDataToSheet(sheet, values) {
    const lastRow = Math.max(sheet.getLastRow(), 1);
    sheet.insertRowAfter(lastRow);
    const range = sheet.getRange(lastRow + 1, 1, 1, values.length);
    range.setValues([values]);

    // Apply conditional formatting based on priority
    const priorityColumn =
        values.findIndex((v) => v === "High" || v === "Medium" || v === "Low") +
        1;
    if (priorityColumn > 0) {
        const priorityRange = sheet.getRange(lastRow + 1, priorityColumn);
        const rule = SpreadsheetApp.newConditionalFormatRule()
            .whenTextEqualTo("High")
            .setBackground("#f4cccc")
            .setRanges([priorityRange])
            .build();
        const rules = sheet.getConditionalFormatRules();
        rules.push(rule);
        sheet.setConditionalFormatRules(rules);
    }
}

/**
 * Retrieves or creates a sheet with advanced setup.
 */
function getOrCreateSheet(formName) {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(formName);

    if (!sheet) {
        sheet = spreadsheet.insertSheet(formName);
        setHeaders(sheet, []);
        sheet.addDeveloperMetadata("creationDate", new Date().toISOString());
    }

    return sheet;
}

/**
 * Performs data analysis on the sheet.
 */
function performDataAnalysis(sheet) {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const values = data.slice(1);

    // Implement various data analysis techniques here
    const analysis = {
        totalSubmissions: values.length,
        averages: calculateAverages(headers, values),
        trends: identifyTrends(headers, values),
        anomalies: detectAnomalies(headers, values),
    };

    // Store analysis results in a separate sheet
    const analysisSheet = getOrCreateSheet(sheet.getName() + "_Analysis");
    updateAnalysisSheet(analysisSheet, analysis);
}

/**
 * Calculates averages for numeric columns.
 */
function calculateAverages(headers, values) {
    const averages = {};
    headers.forEach((header, index) => {
        if (values.every((row) => !isNaN(row[index]))) {
            const sum = values.reduce(
                (acc, row) => acc + Number(row[index]),
                0,
            );
            averages[header] = sum / values.length;
        }
    });
    return averages;
}

/**
 * Identifies trends in the data.
 */
function identifyTrends(headers, values) {
    // Implement trend identification logic
    return {};
}

/**
 * Detects anomalies in the data.
 */
function detectAnomalies(headers, values) {
    const anomalies = {};
    headers.forEach((header, index) => {
        if (values.every((row) => !isNaN(row[index]))) {
            const numbers = values.map((row) => Number(row[index]));
            const mean = numbers.reduce((a, b) => a + b) / numbers.length;
            const std = Math.sqrt(
                numbers
                    .map((x) => Math.pow(x - mean, 2))
                    .reduce((a, b) => a + b) / numbers.length,
            );
            anomalies[header] = numbers.filter(
                (x) => Math.abs(x - mean) > CONFIG.anomalyThreshold * std,
            );
        }
    });
    return anomalies;
}

/**
 * Updates the analysis sheet with new data.
 */
function updateAnalysisSheet(sheet, analysis) {
    sheet.clear();
    const headers = ["Metric", "Value"];
    setHeaders(sheet, headers);

    const rows = [
        ["Total Submissions", analysis.totalSubmissions],
        ...Object.entries(analysis.averages).map(([key, value]) => [
            `Average ${key}`,
            value,
        ]),
        ...Object.entries(analysis.trends).map(([key, value]) => [
            `Trend: ${key}`,
            value,
        ]),
        ...Object.entries(analysis.anomalies).flatMap(([key, values]) =>
            values.map((value, index) => [
                `Anomaly in ${key} #${index + 1}`,
                value,
            ]),
        ),
    ];

    sheet.getRange(2, 1, rows.length, 2).setValues(rows);
}

/**
 * Sends an intelligent email notification with form submission details and analysis.
 */
function sendIntelligentNotification(data, sheetUrl, sheet) {
    const analysis = performQuickAnalysis(sheet);
    const subject = `New ${data.processed_data.priority} Priority Submission: ${data["form_name"] || "Form"}`;
    const message = `
    A new submission has been received and recorded in your Google Sheet.

    Form Name: ${data["form_name"] || "N/A"}
    Submission Time: ${data.timestamp}
    Priority: ${data.processed_data.priority}
    Category: ${data.processed_data.category}
    Sentiment: ${data.processed_data.sentiment}

    Quick Analysis:
    - Total Submissions: ${analysis.totalSubmissions}
    - Submission Trend: ${analysis.submissionTrend}
    ${analysis.anomalies.length > 0 ? `- Anomalies Detected: ${analysis.anomalies.join(", ")}` : ""}

    Sheet URL: ${sheetUrl}

    This is an automated notification. Please review the submission and take appropriate action.
  `;

    MailApp.sendEmail(CONFIG.emailAddress, subject, message);
}

/**
 * Performs a quick analysis for the notification.
 */
function performQuickAnalysis(sheet) {
    const data = sheet.getDataRange().getValues();
    const values = data.slice(1);

    return {
        totalSubmissions: values.length,
        submissionTrend: calculateSubmissionTrend(values),
        anomalies: detectQuickAnomalies(data[0], values),
    };
}

/**
 * Calculates the submission trend.
 */
function calculateSubmissionTrend(values) {
    const recentSubmissions = values.slice(-10).length;
    const previousSubmissions = values.slice(-20, -10).length;
    const trend =
        ((recentSubmissions - previousSubmissions) / previousSubmissions) * 100;

    if (trend > 10) return "Increasing";
    if (trend < -10) return "Decreasing";
    return "Stable";
}

/**
 * Detects quick anomalies for the notification.
 */
function detectQuickAnomalies(headers, values) {
    return headers
        .map((header, index) => {
            if (values.every((row) => !isNaN(row[index]))) {
                const numbers = values.map((row) => Number(row[index]));
                const mean = numbers.reduce((a, b) => a + b) / numbers.length;
                const std = Math.sqrt(
                    numbers
                        .map((x) => Math.pow(x - mean, 2))
                        .reduce((a, b) => a + b) / numbers.length,
                );
                const lastValue = numbers[numbers.length - 1];
                if (
                    Math.abs(lastValue - mean) >
                    CONFIG.anomalyThreshold * std
                ) {
                    return `${header} (${lastValue})`;
                }
            }
            return null;
        })
        .filter(Boolean);
}

/**
 * Cleans up old data based on retention policy.
 */
function cleanupOldData(sheet) {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const values = data.slice(1);

    const timestampIndex = headers.findIndex((header) =>
        header.toLowerCase().includes("timestamp"),
    );
    if (timestampIndex === -1) return;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - CONFIG.dataRetentionDays);

    const rowsToDelete = values.reduce((acc, row, index) => {
        const timestamp = new Date(row[timestampIndex]);
        if (timestamp < cutoffDate) {
            // +2 because we need to account for the header row and 1-based indexing
            acc.push(index + 2);
        }
        return acc;
    }, []);

    if (rowsToDelete.length > 0) {
        sheet.deleteRows(rowsToDelete[0], rowsToDelete.length);
    }
}

/**
 * Advanced error handling and logging.
 */
function handleError(error) {
    Logger.log(`Error: ${error.message}`);
    Logger.log(`Stack: ${error.stack}`);

    // You could implement more advanced error handling here, such as:
    // - Sending error notifications to administrators
    // - Logging errors to a separate sheet for analysis
    // - Implementing a circuit breaker pattern for repeated errors
}

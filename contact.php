<?php

declare(strict_types=1);


ini_set(
    'display_errors',
    '0'
);

ini_set(
    'html_errors',
    '0'
);

error_reporting(E_ALL);

ob_start();

$recipientEmail = 'hello@novaperformance.agency';

$siteName = 'NOVA Performance';

$successMessage = 'Successfully sent!';

if (
    !filter_var(
        $recipientEmail,
        FILTER_VALIDATE_EMAIL
    )
) {
    sendJsonResponse(
        false,
        'The message could not be sent right now. Please try again later.',
        500
    );
}




function sendJsonResponse(
    bool $success,
    string $message,
    int $statusCode = 200
): void {
    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    http_response_code($statusCode);

    header(
        'Content-Type: application/json; charset=UTF-8'
    );

    header(
        'Cache-Control: no-store, no-cache, must-revalidate, max-age=0'
    );

    echo json_encode(
        [
            'success' => $success,
            'message' => $message
        ],
        JSON_UNESCAPED_UNICODE |
        JSON_UNESCAPED_SLASHES
    );

    exit;
}




if (
    !isset($_SERVER['REQUEST_METHOD']) ||
    $_SERVER['REQUEST_METHOD'] !== 'POST'
) {
    header(
        'Allow: POST'
    );

    sendJsonResponse(
        false,
        'Invalid request method.',
        405
    );
}




$contentLength = isset($_SERVER['CONTENT_LENGTH'])
    ? (int) $_SERVER['CONTENT_LENGTH']
    : 0;

if ($contentLength > 100000) {
    sendJsonResponse(
        false,
        'The submitted form is too large.',
        413
    );
}




function getPostValue(string $key): string
{
    if (!isset($_POST[$key])) {
        return '';
    }

    if (is_array($_POST[$key])) {
        return '';
    }

    return trim((string) $_POST[$key]);
}


function cleanSingleLine(string $value): string
{
    $value = str_replace(
        ["\r", "\n", "\0"],
        ' ',
        $value
    );

    $value = preg_replace(
        '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/',
        '',
        $value
    ) ?? '';

    $value = preg_replace(
        '/\s+/',
        ' ',
        $value
    );

    return trim(
        (string) $value
    );
}


function cleanMultiLine(string $value): string
{
    $value = str_replace(
        "\0",
        '',
        $value
    );

    $value = str_replace(
        ["\r\n", "\r"],
        "\n",
        $value
    );

    $value = preg_replace(
        '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/',
        '',
        $value
    ) ?? '';

    return trim($value);
}


function limitString(
    string $value,
    int $maxLength
): string {
    if (strlen($value) <= $maxLength) {
        return $value;
    }

    return substr(
        $value,
        0,
        $maxLength
    );
}


function cleanHeaderText(string $value): string
{
    $value = cleanSingleLine($value);

    $value = str_replace(
        [
            '"',
            '<',
            '>'
        ],
        '',
        $value
    );

    return trim($value);
}




$name = cleanSingleLine(
    getPostValue('name')
);

$company = cleanSingleLine(
    getPostValue('company')
);

$email = cleanSingleLine(
    getPostValue('email')
);

$website = cleanSingleLine(
    getPostValue('website')
);

$businessType = cleanSingleLine(
    getPostValue('business_type')
);

$budget = cleanSingleLine(
    getPostValue('budget')
);

$helpWith = cleanSingleLine(
    getPostValue('help_with')
);

$message = cleanMultiLine(
    getPostValue('message')
);

$privacyConsent = cleanSingleLine(
    getPostValue('privacy_consent')
);




$honeypot = getPostValue('website_check');

if ($honeypot !== '') {
    sendJsonResponse(
        true,
        $successMessage
    );
}




$name = limitString(
    $name,
    120
);

$company = limitString(
    $company,
    160
);

$email = limitString(
    $email,
    254
);

$website = limitString(
    $website,
    500
);

$businessType = limitString(
    $businessType,
    100
);

$budget = limitString(
    $budget,
    100
);

$helpWith = limitString(
    $helpWith,
    120
);

$message = limitString(
    $message,
    5000
);

$privacyConsent = limitString(
    $privacyConsent,
    20
);




if ($name === '') {
    sendJsonResponse(
        false,
        'Please enter your name.',
        422
    );
}


if ($email === '') {
    sendJsonResponse(
        false,
        'Please enter your business email.',
        422
    );
}


if (
    !filter_var(
        $email,
        FILTER_VALIDATE_EMAIL
    )
) {
    sendJsonResponse(
        false,
        'Please enter a valid email address.',
        422
    );
}


if ($message === '') {
    sendJsonResponse(
        false,
        'Please enter your main goal or message.',
        422
    );
}

if (
    !in_array(
        strtolower($privacyConsent),
        [
            '1',
            'on',
            'true',
            'yes'
        ],
        true
    )
) {
    sendJsonResponse(
        false,
        'Please accept the Privacy Policy.',
        422
    );
}




if ($website !== '') {

    $websiteToValidate = $website;

    if (
        !preg_match(
            '~^https?://~i',
            $websiteToValidate
        )
    ) {
        $websiteToValidate =
            'https://' .
            $websiteToValidate;
    }


    if (
        !filter_var(
            $websiteToValidate,
            FILTER_VALIDATE_URL
        )
    ) {
        sendJsonResponse(
            false,
            'Please enter a valid website address.',
            422
        );
    }


    $website =
        $websiteToValidate;
}




$allowedBusinessTypes = [
    '',
    'Lead Generation',
    'E-commerce',
    'Local Business',
    'B2B / SaaS',
    'Mobile App',
    'Other'
];

$allowedHelpOptions = [
    '',
    'Google Ads Management',
    'Performance Max',
    'Shopping',
    'Lead Generation',
    'Tracking & Analytics',
    'Marketing Automation',
    'Account Audit',
    'Other'
];

$allowedBudgets = [
    '',
    'Under $2,500',
    '$2,500 – $5,000',
    '$5,000 – $10,000',
    '$10,000 – $25,000',
    '$25,000+'
];


if (
    !in_array(
        $businessType,
        $allowedBusinessTypes,
        true
    )
) {
    sendJsonResponse(
        false,
        'Invalid business type.',
        422
    );
}


if (
    !in_array(
        $helpWith,
        $allowedHelpOptions,
        true
    )
) {
    sendJsonResponse(
        false,
        'Invalid service selection.',
        422
    );
}


if (
    !in_array(
        $budget,
        $allowedBudgets,
        true
    )
) {
    sendJsonResponse(
        false,
        'Invalid advertising budget.',
        422
    );
}




if (
    preg_match(
        '/[\r\n]/',
        $email
    )
) {
    sendJsonResponse(
        false,
        'Invalid email address.',
        422
    );
}




$subject =
    'New Free Audit Request - ' .
    $siteName;




$emailBody = '';

$emailBody .=
    "NEW WEBSITE ENQUIRY\n";

$emailBody .=
    "==============================\n\n";


$emailBody .=
    "Name:\n" .
    $name .
    "\n\n";


$emailBody .=
    "Company:\n" .
    ($company !== ''
        ? $company
        : 'Not provided'
    ) .
    "\n\n";


$emailBody .=
    "Business Email:\n" .
    $email .
    "\n\n";


$emailBody .=
    "Website:\n" .
    ($website !== ''
        ? $website
        : 'Not provided'
    ) .
    "\n\n";


$emailBody .=
    "Main Goal / Message:\n" .
    $message .
    "\n\n";


$emailBody .=
    "Privacy Consent:\nAccepted\n\n";


$emailBody .=
    "==============================\n";

$emailBody .=
    "Sent from: " .
    $siteName .
    " website\n";


if (
    isset($_SERVER['REMOTE_ADDR']) &&
    $_SERVER['REMOTE_ADDR'] !== ''
) {
    $emailBody .=
        "IP: " .
        cleanSingleLine(
            (string) $_SERVER['REMOTE_ADDR']
        ) .
        "\n";
}




$host = isset($_SERVER['HTTP_HOST'])
    ? (string) $_SERVER['HTTP_HOST']
    : 'localhost';


$host = preg_replace(
    '/:\d+$/',
    '',
    $host
);


$host = preg_replace(
    '/^www\./i',
    '',
    $host
);


$isValidHost =
    preg_match(
        '/^[a-z0-9.-]+\.[a-z]{2,}$/i',
        $host
    );


if ($isValidHost) {
    $fromEmail =
        'noreply@' .
        $host;
} else {
    

    $fromEmail =
        $recipientEmail;
}


$headerSiteName = cleanHeaderText($siteName);

$replyToName = cleanHeaderText($name);


$headers = [];

$headers[] =
    'MIME-Version: 1.0';

$headers[] =
    'Content-Type: text/plain; charset=UTF-8';

$headers[] =
    'From: ' .
    $headerSiteName .
    ' <' .
    $fromEmail .
    '>';

$headers[] =
    'Reply-To: ' .
    $replyToName .
    ' <' .
    $email .
    '>';

$headers[] =
    'X-Mailer: PHP/' .
    phpversion();




$mailSent = @mail(
    $recipientEmail,
    $subject,
    $emailBody,
    implode(
        "\r\n",
        $headers
    )
);




if (!$mailSent) {

    

    sendJsonResponse(
        false,
        'The message could not be sent right now. Please try again later.',
        500
    );
}


sendJsonResponse(
    true,
    $successMessage
);

wpm\_cert\_checker
======================

This repository provides a Lambda function to check and retrieve SSL certificate details for a given URL. The details returned include the issue date, the domain/hostname the certificate is issued to, and its expiration date.

Additionally, it offers a script for Vercara's UltraWPM product to trigger the Lambda function and generate an alert if the provided URL's certificate has expired or is expiring within the next 30 days.

## Features

* Fetch SSL certificate details using a Lambda function.
* Integration script for Vercara's UltraWPM to automate certificate expiry checks.

## Example Response

```json
{
  "issued_date": "2023-03-24 00:00:00",
  "issued_to": "*.vercara.com",
  "expiration_date": "2024-04-23 23:59:59"
}
```

## Setup

### Lambda

1. Navigate to AWS Lambda in your AWS Console.
2. Create a new function and name it appropriately.
3. Copy and paste the code from `lambda_handler.py` into your Lambda function code editor.
	* _Note:_ This script uses only native Python libraries, so no additional dependencies are required.
	* The Lambda event parsing assumes you're utilizing Lambda's "function URL" feature, which embeds the payload within a nested parameter labeled "body."

### WPM Script

1. Navigate to the UltraWPM scripting interface.
2. Copy and paste the content from `certChecker.js`.
3. Customize the script:
	* Replace `https://example.lambda-url.region.on.aws/` with your Lambda function's URL.
	* Replace `https://www.example.com` with the URL you intend to query

## License

This project is licensed under the terms of the MIT license. See LICENSE.md for more details.
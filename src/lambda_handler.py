import ssl
import socket
import json
from urllib.parse import urlparse
from datetime import datetime

def lambda_handler(event, context):
    print("Event Info: ", json.dumps(event)) 
    event_body = json.loads(event['body'])
    # Extract hostname from URL
    parsed_url = urlparse(event_body['url'])
    hostname = parsed_url.hostname

    # Connect to the server and retrieve certificate details
    context = ssl.create_default_context()
    with context.wrap_socket(socket.socket(), server_hostname=hostname) as s:
        s.connect((hostname, 443))
        cert = s.getpeercert()

    # Extract certificate details
    subject = dict(x[0] for x in cert['subject'])
    issued_to = subject['commonName']
    issued_date = datetime.strptime(cert['notBefore'], '%b %d %H:%M:%S %Y %Z')
    expiration_date = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')

    return {
        'issued_to': issued_to,
        'issued_date': issued_date.strftime('%Y-%m-%d %H:%M:%S'),
        'expiration_date': expiration_date.strftime('%Y-%m-%d %H:%M:%S')
    }
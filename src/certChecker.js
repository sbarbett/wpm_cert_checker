var c = openHttpClient();
var lambda = 'https://example.lambda-url.region.on.aws/';
var url = 'https://www.example.com';

function daysUntilExpiry(d) {
    // Manually parse the date string
    var parts = d.split(' ');
    var dateParts = parts[0].split('-');
    var timeParts = parts[1].split(':');
    
    var expiryDate = new Date(
        parseInt(dateParts[0], 10), // Year
        parseInt(dateParts[1], 10) - 1, // Month (0-indexed)
        parseInt(dateParts[2], 10), // Day
        parseInt(timeParts[0], 10), // Hours
        parseInt(timeParts[1], 10), // Minutes
        parseInt(timeParts[2], 10)  // Seconds
    );

    var currentDate = new Date();
    var diffMS = expiryDate - currentDate;
    var diffDays = diffMS / (24 * 60 * 60 * 1000);

    return Math.round(diffDays);
}

beginTransaction(function(tx) {
	var resp;
	var expiry;
	var host;
	
	beginStep('Invoke Lambda', 30000, function(step) {
		var post = c.newPost(lambda);
		post.addRequestHeaders({
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		});
		post.setRequestBody('{"url":"' + url + '"}');
		try {
			resp = post.execute();
		} catch (e) {
			fail('There was an error reaching ' + post.getUrl() + ': ' + e);
		}
	});
	
	beginStep('Log the response', 2000, function(step) {
		try {
			var certInfo = JSON.parse(resp.getBody());
		} catch (e) {
			fail('Error parsing JSON: ' + e);
		}
		log('Issued Date: ' + certInfo['issued_date']);
		host = certInfo['issued_to'];
		log('Issued To: ' + host);
		expiry = certInfo['expiration_date'];
		log('Expiration Date: ' + expiry);
	});
	
	beginStep('Alert if expires in < 30 days', 2000, function(step) {
		var ttl = daysUntilExpiry(expiry);
		log('Expires in ' + ttl + ' days');
		if (ttl < 0) {
			fail('The certificate for ' + host + ' expired ' + Math.abs(ttl) + ' days ago.');
		} else if (ttl < 30) {
			fail('The certificate for ' + host + ' expires in ' + ttl + ' days.')
		}
	});
	
});
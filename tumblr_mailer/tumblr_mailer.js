var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');
var emailTemplate = fs.readFileSync("email_template.html", "utf8")
var client = tumblr.createClient({
  consumer_key: 'MaUvE7hmVPC8rmT0O7OpTyrbrEctRqEhExy7urL3F9c2F0Mmiw',
  consumer_secret: '696qxLVGDV6e9DCoWUyvlRvVkGsD2MEztK12cmrje4I2sWgYdJ',
  token: 'YaPsQTtaO4KJa66x1mRcmjQgBo47LDRc5aRWVlerHBERXwg27g',
  token_secret: 'A8TvSCd8GYYVpleTdaod5ETWxLwIsPLjYYOwrDMk8AMD4nCrGe'
});
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('0k6i-Fr7FPfIwG5IJZCMIg');


var csvFile = fs.readFileSync("friend_list.csv","utf8");
console.log(csvFile);

function csvParse(csv) {
	var objectArray = [];
	var csvArray = csv.split("\n");
	var keys = csvArray.shift().split(",")
	csvArray.forEach(function(contact) {
		contact = contact.split(',')
		var obj = {};
		for (i = 0; i < contact.length; i++) {
			obj[keys[i]] = contact[i]
		}
		objectArray.push(obj)
	})
	return objectArray
}

var friendList = csvParse(csvFile)

client.posts('jaredlmayer.tumblr.com', function(error, blog) {
	var latestPosts = []
	blog.posts.forEach(function(post) {
		var today = new Date();
		var postDate = post.timestamp/(3600*24);
		var currentDate = today.getTime()/(1000*3600*24);
		var timeDiff = Math.floor(Math.abs(currentDate-postDate));
		if (timeDiff <= 7) {
			latestPosts.push(post);
		}
		console.log(blog);
	})

	friendList.forEach(function(friend) {
	var firstName = friend["firstName"];
	var numMonthsSinceContact = friend["numMonthsSinceContact"];
	var templateCopy = emailTemplate;
	var customizedTemplate = ejs.render(templateCopy, {
		firstName: firstName,
		numMonthsSinceContact: numMonthsSinceContact,
		latestPosts: latestPosts
		});
	sendEmail(firstName, friend["emailAddress"], "Jared Mayer", "jaredlmayer@gmail.com", "My Fullstack Academy Progress", customizedTemplate);
	});
});

function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,    
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]    
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        // console.log(message);
        // console.log(result);   
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
 }























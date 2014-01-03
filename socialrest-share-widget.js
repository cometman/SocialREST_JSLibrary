// SocialREST.me
// SocialREST Share Widget
// 12-21/2013

var site_name, site_title, site_url, site_description, site_image, site_appid;
var srtoken = "953063";
var tw_account = "clay_selby";
var appid = "1";
var host = "localhost:3000"
var srURL = "http://" + host + "/api/impressions"
var sr_user_create = "http://" + host + "/api/users"
// Link use for the tweet share button
var generated_link;



$(document).ready(function(){

	// Facebook
	findIntegrationPoints();

	$(".fbshare").click(function(){
		facebookShareUI();
	});
	loadSiteMetaData();

	// Twitter
	loadTwitter();
	twttr.ready(function (twttr) {
  		addTwitterShareButton();
		  twttr.events.bind('tweet', function (event) {
		 	console.log(" Tweet Sent" + event);
		 	// Send the generated link as the social object since we don't have an ID.
		 	// saveGraphObject(generated_link, "Twitter")
		});
	});
});

function loadTwitter()
{
	window.parent.twttr = (function (d,s,id) {
			  var t, js, fjs = d.getElementsByTagName(s)[0];
			  if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;
			  js.src="https://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
			  return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
		}(document, "script", "twitter-wjs"));
}

function addTwitterShareButton()
{
	var link = document.location.href;
	// Add the SR Token and a Referrer string to the end of the URL.
	var ref = srtoken + "_" + new Date().getTime() +  Math.floor(Math.random()*100000)
	var appender = "&ref=";
	if (link.indexOf("?") == -1)
	{
		appender = "?ref=";
	}
	generated_link = link+appender+ref;
	twttr.widgets.createShareButton(
		  generated_link,
		  document.getElementById('socialrest-tw-share-widget'),
		  function (el) {
		    console.log("Button created.")
		  },
		  {
		    count: 'none',
		    text: site_description,
		    via: tw_account
		  }
	);
}

function findIntegrationPoints()
{
	var elements = $("#socialrest-fb-share-widget");
	// Only one Facebook integration per page
	if (elements !== null && elements.length > 0)
	{
		$("#socialrest-fb-share-widget").append("<a href='#' class='fbshare'> <div class='blueButton'> <div class='pluginButtonImage'> <span class='pluginButtonLabel'>Share</span> </div> </div> </a> ");
	}
}

function loadSiteMetaData()
{
	site_name = $('meta[property="og:site_name"]').attr('content')
	site_title = $('meta[property="og:title"]').attr('content')
	site_url = $('meta[property="og:url"]').attr('content')
	site_description = $('meta[property="og:description"]').attr('content')
	site_image = $('meta[property="og:image"]').attr('content')
	site_appid = $('meta[property="og:app_id"]').attr('content')

	$.ajaxSetup({ cache: true });
  	$.getScript('https://connect.facebook.net/en_UK/all.js', function(){
	    FB.init({
	      appId: site_appid,
	    });
 	});
}

function facebookShareUI()
{
	FB.ui(
	  {
	   method: 'feed',
	   name: site_title,
	   description: site_description,
	   link: site_url,
	   picture: site_image
	  },
	  function(response) {
	    if (response && response.post_id) {
	      console.log("Post was published!");
	      console.log(response);
	      saveGraphObject(response.post_id, "Facebook");
	    } else {
	    	// Something went wrong..
	    }
	  }
	);
}

function saveGraphObject(object_id, network)
{
	var data = {};
	// We will not have the object_id for the tweet yet.  Only for Facebook
	data.social_object = object_id;
	data.social_network = network;
	data.socialrest_token = srtoken;
	data.post_link = site_url;
	data.post_picture = site_image;
	data.post_name = site_name;
	data.post_caption = site_title;
	data.post_description = site_description;

	$.ajax({
		type: "POST",
		url: srURL,
		data: data,
		success: function (data, text) {
			console.log("Success!");
			console.log(data);
			console.log(text);

    	},
	    error: function (request, status, error) {
	    	console.log("FAILURE!");
	        console.log(error);
	        console.log(request);
	        console.log(status);
	    }
	});
}

window.fbAsyncInit = function() {
		FB.init({
		    appId      : site_appid,
		    status     : true, // check login status
		    cookie     : true, // enable cookies to allow the server to access the session
		    xfbml      : true  // parse XFBML
		});

		FB.Event.subscribe('auth.authResponseChange', function(response) {
		    // Here we specify what we do with the response anytime this event occurs.
		    if (response.status === 'connected') {
		    	// Proceed to do normal things!
		    	console.log(response);
		    	saveFacebookUser(response);
		      // saveFacebookUser(response);
		    }  else {
		      FB.login(function(response) {
			    	if (response.authResponse) {
			        // The person logged into your app
			        saveFacebookUser(response);
				}
				else {
			        // The person cancelled the login dialog
			   	}
			});
		    }
	  	});
  };

  // Here we run a very simple test of the Graph API after login is successful.
  // This testAPI() function is only called in those cases.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Good to see you, ' + response.name + '.');
    });
}

function saveFacebookUser(response)
{
	// Get the user name and username
	FB.api('/me', function(_rsp) {
		var data = {};
		data.name = _rsp.name;
		data.social_network = "Facebook";
		data.socialrest_token = srtoken;
		data.user_social_token = response.authResponse.accessToken;
		data.token_expiry = response.authResponse.expiresIn;
		data.graph_id = _rsp.id

	    $.ajax({
		type: "POST",
		url: sr_user_create,
		data: data,
		success: function (data, text) {
			console.log("Success!");
			console.log(data);
			console.log(text);
	    	},
		    error: function (request, status, error) {
		    	console.log("FAILURE!");
		        console.log(error);
		        console.log(request);
		        console.log(status);
		    }
		});
      });
}

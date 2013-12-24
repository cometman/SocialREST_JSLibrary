// SocialREST.me
// SocialREST Share Widget
// 12-21/2013

var site_name, site_title, site_url, site_description, site_image, site_appid;
var srtoken = "667943";
var host = "localhost:3000"
var srURL = "http://" + host + "/api/impressions"

$(document).ready(function(){
	
	// findIntegrationPoints();

	$(".fbshare").click(function(){
		// $("#share-content-window").toggle("drop", 0);
		$("#opacity-share-container").toggle("size", 0);
		// $("#share-content-window").css("margin-left", $("#share-content-window").width()/2 * -1);		console.log("Clicked me!");
		facebookShareUI();
	});

	$("#opacity-share-container").click(function(){
		// $("#share-content-window").toggle();
		$("#opacity-share-container").toggle();
	});

	loadFacebook();
});

function findIntegrationPoints()
{
	var elements = $("#socialrest-share-widget");
	if (elements !== null && elements.length > 0)
	{
		for (i = 0; i <= elements.length-1; i++)
		{
			$("#socialrest-share-widget").append("<a href='#' class='fbshare'> <div class='blueButton'> <div class='pluginButtonImage'> <span class='pluginButtonLabel'>Share</span> </div> </div> </a> "); 
		}
	}
}

function appendFacebookButton(element)
{
	// element./
}


function loadFacebook()
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
    // $('#loginbutton,#feedbutton').removeAttr('disabled');
    // FB.getLoginStatus(updateStatusCallback);
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
	      $("#opacity-share-container").toggle();
	      saveGraphObject(response.post_id);
	    } else {
	    // $("#share-content-window").toggle();
		$("#opacity-share-container").toggle();
	      // alert('Post was not published.');
	    }
	  }
	);
}

function saveGraphObject(object_id)
{
	var data = {};
	data.social_object = object_id;
	data.social_network = "Facebook";
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

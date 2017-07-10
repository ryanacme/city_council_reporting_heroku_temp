import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';


import './main.html';



Meteor.startup(function() {
    GoogleMaps.load({
    	key: "AIzaSyADLWoisprDl-4dpjtzeGaHDbEMEfTEx8k",
    });
    Session.set("category", "Backlog");

});

// $(document).ready(function() {
// 	$("#e1").select2();
	
// });



//---- routing------------------

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
	// history.back();
	// this.render("navbar", {
	// 	to:"nav1"
	// });
	this.render('welcome', {
		to:"main"
	});
	document.body.className = "showBackgroundImage";
});

Router.route("/images", function(){

	Tracker.autorun(function () {
  		var current = Router.current();
  		Tracker.afterFlush(function () {
    		$(window).scrollTop(Session.get("scrollLocation"));
  		});
	});
	
	this.render("navbar", {
		to:"nav1"
	});
	this.render("image_add_form", {
		to:"nav2"
	});
	this.render("images", {
		to:"main"
	});
	document.body.className = "showBackgroundImage2";

	
});

Router.route("/image/:_id", function(){
	Session.set("scrollLocation", $(window).scrollTop());
	$(window).scrollTop(0);


	this.render("navbar", {
		to:"nav1"
	});
	this.render("image", {
		to:"main",
		data: function(){
			Session.set("singleImageId", this.params._id);
			return Images.findOne({_id:this.params._id});
		}
	});

});

Router.route("/telegram/:_id", function(){
	// Session.set("scrollLocation", $(window).scrollTop());
	// $(window).scrollTop(0);

	this.render("navbar", {
		to:"nav1"
	});
	this.render("messageForm", {
		to:"main",
		data: function(){
			console.log(this.params._id);
			return Images.findOne({_id:this.params._id});
		}
	});
	// this.render("image", {
	// 	to:"main",
	// 	data: function(){
	// 		console.log(this.params._id);
	// 		return Images.findOne({_id:this.params._id});
	// 	}
	// });
});
// Router.route('/images', function () {
//   this.render('images');
// });

//---- infinit scroll------------------

Session.set("imageLimit", 8);
lastScrollTop = 0;

$(window).scroll(function(event){
	// test if we are near the bottom of the window
	if ($(window).height() + $(window).scrollTop() > $(document).height() - 100 ){
		// where we are in the page?
		var scrollTop = $(this).scrollTop();
		// test if we are going down.
		if (scrollTop > lastScrollTop){
			// yes we are heading down
			lastScrollTop = scrollTop;
			Session.set("imageLimit", Session.get("imageLimit")+ 4);
		}
	 }
});


//---- accounts config------------------

Accounts.ui.config({
	passwordSignupFields:"USERNAME_AND_EMAIL"
});

//---- helpers functions------------------

Template.body.helpers({ username: function(){
	if (Meteor.user()){
		// return Meteor.user().emails[0].address;
		return Meteor.user().username;
	}
	else{
		return "anonymous user";
	}
	
	}

});

Template.image.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });

});

Template.image.onRendered(function() {
    this.$('.selectpicker').selectpicker();
    categorySet();
    $("#rowTwo").width($(".single-img").width()+16);
    // console.log($(".single-img").width());
    // $("#rowTwo").width(300);
});

Template.welcome.onRendered(function() {
    $('[data-toggle="tooltip"]').tooltip();   
});

Template.image.helpers({
	getDate: function(date){
		if (date){
			var year = date.getFullYear();
			var month = date.getMonth();
			var dayMonth = date.getDate();
			var dayWeek = date.getDay();
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			var milliseconds = date.getMilliseconds();
			var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			var monthNames = ["January", "February", "March", "April", "May", "June",
  								"July", "August", "September", "October", "November", "December"];
			return dayNames[dayWeek] + " " + dayMonth + " "+ monthNames[month] + " "+
					year + " " + hours + ":" + minutes + ":" + seconds;
		}
		else{
			return "N/A";
		}
	},
	findAddress: function(inputLocation){
		if (inputLocation){
			// Session.set('LatLng', inputLocation);
			var lat = inputLocation.latitude;
			var lng = inputLocation.longitude;
			reverseGeocode.getLocation(lat, lng, function(location){
				//location is straight output from Google
				//or you can now access it from reverseGeocode object
				Session.set('location', reverseGeocode.getAddrStr());
			}); //reverseGeocode
			return Session.get('location');
		} //if
		else{
			return "N/A";
		} //else
	},

	// getLocation: function(inputLocation){
	// 	console.log(inputLocation);
	// },
	updateAddress: function(inputLocation){
		Session.set('LatLng', inputLocation);
	},
	exampleMapOptions: function() {
		var inputLocation = Session.get('LatLng');
    // Make sure the maps API has loaded
    	var lat = inputLocation.latitude;
		var lng = inputLocation.longitude;
		var uluru = {lat: -25.363, lng: 131.044};
    	if (GoogleMaps.loaded()) {
      		// Map initialization options
      		return {

           		center: new google.maps.LatLng(lat, lng),
           		// marker: new google.maps.Marker((lat, lng),
        		zoom: 15
      		};
    	}
  	},

  	categories: function(){
  	  
      return ["Backlog", "Water Supply", "Rubbish", "Road", "Wastewater", "Industrial Pollution"];
    },
    catSet: function(){
    	categorySet();
    }//catSet
});

Template.images.helpers({
	pics: function(){
		if (Session.get("userFilter")){ //they set a filter
			return Images.find({createdBy:Session.get("userFilter")},{sort:{createdOn:-1, rating:-1}});
		}//if
		else{
			return Images.find({category:Session.get("category")},{sort:{createdOn:-1, rating:-1}, limit:Session.get("imageLimit")});
		}//else
		
	}, //helper
	getDepermentTitle: function(){
		var department = Session.get("category")
		if (department == "Backlog"){
			return "Here are list of all unassigned jobs";
		}
		else {
			return "Welcome to Department of " + department;
		}
	},

	filtering_images: function(){
		if (Session.get("userFilter")){ //they set a filter
			return true;
		}//if
		else{
			return false;
		}//else
				

	}, //helper
	getfilterUser: function(){
		if (Session.get("userFilter")){ //they set a filter
			var user = Meteor.users.findOne({_id:Session.get("userFilter")});
			return user.username;
		}//if
		else{
			return "anonymous";
		}//else
	},//helper
	getUser: function(user_id){
		// console.log(user_id);
		var user = Meteor.users.findOne({_id:user_id});
		var telegramImg = Images.findOne( { createdBy: { $exists: true, $eq: user_id } } );
		if(user){
			return user.username;
		} else if (telegramImg){
			return telegramImg.createdBy;
		} else{
			return "anonymous";
		}//else
	},//helper

});//helpers function

Template.messageForm.helpers({
	imgId: function(){
		return "this is a test";
	}
});

Template.navbar.events({
	
	"click .js-select-department":function(event){
		var department = event.currentTarget.text;
		Session.set("category", department);
		console.log(department);
		

		// console.log(event);
		// console.log(event.target);
		// console.log(event.currentTarget);
	},
});

Template.image.events({
	
	"change #category-select": function (event, template) {
		var image_id = this._id;
        var category = $(event.currentTarget).val();
        console.log("category : " + category);
        Images.update({_id:image_id}, {$set:{category:category}});
    },
});

Template.images.events({
	// "click .js-image":function(event){
	// 	$(event.target).css("width","250px");
	// 	return false;
	// },
	"click .js-del-image":function(event){
		var image_id = this._id;
		console.log(this);
		$("#"+image_id).hide('slow', function(){
			Images.remove({"_id":image_id});

		// console.log(event);
		// console.log(event.target);
		// console.log(event.currentTarget);
		});
	},
	"click .js-rate-image":function(event){
		console.log(event);
		console.log(this);
		var rating = $(event.currentTarget).data('userrating');
		console.log(rating);
		var image_id = this.data_id;
		console.log(image_id);
		// Images.update({_id:image_id}, { $set:{rating:rating} });
		// Images.update({_id:image_id},
		// 			  {$set: {rating:rating}}
		// );

		$("#"+image_id).hide('slow', function(){
			// Images.remove({"_id":image_id});
				Images.update({_id:image_id},
					  {$set: {rating:rating}}
				);
		});

		$("#"+image_id).show('slow', function(){
			// Images.remove({"_id":image_id});
				// Images.update({_id:image_id},
				// 	  {$set: {rating:rating}}
				// );
		});
		// return false;

	},

	"click .js-show-image-form":function(event){
		$("#exampleModal").modal("show");
	},

	"click .js-set-image-filter":function(event){
		Session.set("userFilter", this.createdBy);
	},

	"click .js-unset-image-filter":function(event){
		Session.set("userFilter", undefined);
	},	
});


Template.image_add_form.events({
	// "click .js-add-image":function(event){
	"submit .js-add-image":function(event){
		var img_src, img_alt;
		img_src = event.target.img_src.value;
		img_alt = event.target.img_alt.value;
		// img_src = $("#img_src").val();
		// img_alt = $("#img_alt").val();
		console.log(img_src);
		console.log(img_alt);
		if (Meteor.user()){
			Images.insert({
				img_src:img_src,
				img_alt:img_alt,
				createdOn: new Date(),
				createdBy: Meteor.user()._id
			}); //Image.insert
		}// if
		// console.log(Meteor.User());
		$("#exampleModal").modal("hide");
		return false;

	},

	// "click .js-show-image-form":function(event){
	// 	$("#exampleModal").modal("show");		
	// 	return false;
	// },
});


$(window).load(function() {
  $('img').each(function() {
    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
      // image was broken, replace with your new image
      // console.log(this.id);
      Meteor.call('checkTelegramImage', [this.id], function (err, response) {
  			console.log(response);
		});
      // this.src = '/ryan.png';

    }
  });
});

function categorySet(){
	var image_id = Session.get("singleImageId");
	var img = Images.findOne({_id:image_id});
	if (img && img.category){
		category = img.category;
    	$('#category-select').selectpicker('val', category);
  	}
  	else{
		console.log("Category has not been set yet.");
	}// else
}





import { Meteor } from 'meteor/meteor';


// Meteor.startup(() => {
//   // code to run on server at startup
// });
Meteor.startup(function(){
	console.log("*".repeat(40));
	// if (Images.find().count() == 0){
	// 	for (var i=1; i < 23; i++){
	// 		Images.insert({
	// 			img_src:"/img_"+i+".jpg",
	// 			img_alt:"Image "+i
	// 		});
	// 	}
	// 	console.log("main-server.js says: "+Images.find().count());	
	// }

	
	TelegramBot.token = '354964034:AAG9tWGKLKGHti7x8BS2yhnPKIoqW97fGIo';
	TelegramBot.start(); // start the bot
	// var obj = {};
	// var imgTelegram = {};


	TelegramBot.addListener('incoming_caption', function(command, username, original) {
		obj = {};
		imgTelegram = {};
		console.log(obj);
		var message_id = original.message_id;
		var file = TelegramBot.method('getFile', {
			file_id: original.photo[2].file_id
		});
		console.log(file);

		// TelegramBot.method('deleteMessage',{
	 //    		chat_id: original.chat.id,
	 //    		message_id: original.message_id,
		// });
		
		// Don't do this in production because it will expose your Telegram Bot's API key
		var filePath = 'https://api.telegram.org/file/bot' + TelegramBot.token + '/' + file.result.file_path;
		imgTelegram = {telegramImage: true,
					   img_src:filePath, 
					   img_alt:"Telegram_" + message_id,
					   img_caption: original.caption,
					   createdOn: new Date(),
					   createdBy: username,
					   category: "Backlog",
					   photoFileId: file.result.file_id};
		console.log(imgTelegram);
		var ifPhotoExist = Images.findOne({ "photoFileId": { $eq: file.result.file_id } });
		// console.log(ifPhotoExist);

		if (ifPhotoExist){
			console.log("Photo has already been inserted!!");
			imgTelegram = {};
			obj = {};
			TelegramBot.send("Sorry we don't accept this photo as you have already sent it to us!!", original.chat.id);
		}

		else{
			obj.stage = 0;
			// var replyKeyboardRemove= {
	  //   		'remove_keyboard': true, 
			// };
			// var reply_markup = JSON.stringify(replyKeyboardRemove);
			// TelegramBot.method('sendMessage',{
	  //   		chat_id: original.chat.id,
	  //   		text:'We have got your photo. Thanks!', 
	  //   		reply_markup:reply_markup,
	  //   		// reply_to_message: "good"
			// });
			var a={
				text: "Send your Name & Number",
				request_contact: true,
			};
			var keyboard = [
	         	[a]
			];
			var replyKeyboardMarkup= {
	    		'keyboard': keyboard, 
	    		'resize_keyboard': true, 
	    		'one_time_keyboard': true
			};
			var reply_markup = JSON.stringify(replyKeyboardMarkup);
			TelegramBot.method('sendMessage',{
	    		chat_id: original.chat.id,
	    		text:'We got your photo, Thanks!. Please let us know your name and number by pressing the below button!', 
	    		reply_markup:reply_markup,
	    		// reply_to_message: "good"
			});
			console.log(obj);
			console.log("-".repeat(40));

		}	//else
	}, 'caption'); // incoming_photo listener



	TelegramBot.addListener('incoming_photo', function(command, username, original) {
		obj = {};
		imgTelegram = {};
		console.log(obj);
		var message_id = original.message_id;
		var file = TelegramBot.method('getFile', {
			file_id: original.photo[2].file_id
		});
		console.log(file);

		// TelegramBot.method('deleteMessage',{
	 //    		chat_id: original.chat.id,
	 //    		message_id: original.message_id,
		// });
		
		// Don't do this in production because it will expose your Telegram Bot's API key
		var filePath = 'https://api.telegram.org/file/bot' + TelegramBot.token + '/' + file.result.file_path;
		imgTelegram = {telegramImage: true,
					   img_src:filePath, 
					   img_alt:"Telegram_" + message_id,
					   img_caption: "No additional information has been provided!",
					   createdOn: new Date(),
					   createdBy: username,
					   category:"Backlog",
					   photoFileId: file.result.file_id};
		console.log(imgTelegram);
		var ifPhotoExist = Images.findOne({ "photoFileId": { $eq: file.result.file_id } });
		// console.log(ifPhotoExist);

		if (ifPhotoExist){
			console.log("Photo has already been inserted!!");
			imgTelegram = {};
			obj = {};
			TelegramBot.send("Sorry we don't accept this photo as you have already sent it to us!!", original.chat.id);
		}

		else{
			obj.stage = 0;
			// var replyKeyboardRemove= {
	  //   		'remove_keyboard': true, 
			// };
			// var reply_markup = JSON.stringify(replyKeyboardRemove);
			// TelegramBot.method('sendMessage',{
	  //   		chat_id: original.chat.id,
	  //   		text:'We have got your photo. Thanks!', 
	  //   		reply_markup:reply_markup,
	  //   		// reply_to_message: "good"
			// });
			var a={
				text: "Send your Name & Number",
				request_contact: true,
			};
			var keyboard = [
	         	[a]
			];
			var replyKeyboardMarkup= {
	    		'keyboard': keyboard, 
	    		'resize_keyboard': true, 
	    		'one_time_keyboard': true
			};
			var reply_markup = JSON.stringify(replyKeyboardMarkup);
			TelegramBot.method('sendMessage',{
	    		chat_id: original.chat.id,
	    		text:'We got your photo, Thanks!. Please let us know your name and number by pressing the below button!', 
	    		reply_markup:reply_markup,
	    		// reply_to_message: "good"
			});
			console.log(obj);
			console.log("-".repeat(40));

		}	//else	
	}, 'photo'); // incoming_photo listener

	TelegramBot.addListener('incoming_contact', function(command, username, original) {
		obj.stage = 1;
		obj.contactDetail = {username: "", user_id: "", first_name: "", last_name: "", phone_number: ""};
		obj.contactDetail = {username: original.from.username, user_id: original.contact.user_id, 
							first_name: original.contact.first_name, last_name: original.contact.last_name,
							phone_number: original.contact.phone_number};
		console.log(obj);
		console.log("-".repeat(40));

		var text = "We have got this information:\n" + "Username: " + original.from.username +
			"\nUser ID: " + original.contact.user_id + "\nFirst Name: " + original.contact.first_name + 
			"\nLast Name: " + original.contact.last_name + "\nPhone Number: " + original.contact.phone_number;

		// var replyKeyboardRemove= {
	 //    		'remove_keyboard': true, 
		// };
		// var reply_markup = JSON.stringify(replyKeyboardRemove);
		// TelegramBot.method('sendMessage',{
  //   		chat_id: original.chat.id,
  //   		text:text, 
  //   		reply_markup:reply_markup,
  //   		// reply_to_message: "good"
		// });
		var a={
			text: "Send your Location",
			request_location: true
		};
		var keyboard = [
         	[a]
		];
		var replyKeyboardMarkup= {
    		'keyboard': keyboard, 
    		'resize_keyboard': true, 
    		'one_time_keyboard': true
		};
		var reply_markup = JSON.stringify(replyKeyboardMarkup);
		TelegramBot.method('sendMessage',{
    		chat_id: original.chat.id,
    		text:'Please let us know your location too by pressing the below button!', 
    		reply_markup:reply_markup,
    		// reply_to_message: "good"
		});
	}, 'contact'); //incoming_contact listener

	TelegramBot.addListener('incoming_location', function(command, username, original) {
		obj.stage = 2;
		obj.location = {longitude: "", latitude: ""};
		obj.location = {longitude: original.location.longitude, latitude: original.location.latitude};
		console.log(obj);
		console.log("-".repeat(40));
		var text = "We have got your location:\n " + "longitude: " + original.location.longitude+ "\n"+
					'latitude: ' + original.location.latitude;
		// var replyKeyboardRemove= {
	 //    		'remove_keyboard': true, 
		// };
		// var reply_markup = JSON.stringify(replyKeyboardRemove);
		// TelegramBot.method('sendMessage',{
  //   		chat_id: original.chat.id,
  //   		text:text, 
  //   		reply_markup:reply_markup,
  //   		// reply_to_message: "good"
		// });
		if (obj.stage == 2){
			var finalObj = Object.assign({},imgTelegram,obj);
			console.log(finalObj);
			Images.insert(finalObj);
			TelegramBot.send("Thanks *" + obj.contactDetail.first_name + "*. We got all information. Good bye!", original.chat.id, true);
		}
		else{
			TelegramBot.send('Sorry something is wrong! Plz start again.', original.chat.id);
		}
		console.log("-".repeat(40));
	}, 'location'); // incoming_location Listener



	


	Meteor.methods({
		checkTelegramImage: function(id) {
			var id = id[0];
			console.log(id);
			var imgBroken = Images.findOne({_id:id});
			// console.log(imgBroken);
			console.log(imgBroken);
			var file = TelegramBot.method('getFile', {
				file_id: imgBroken.photoFileId,
			});
			console.log(file);
			var filePath = 'https://api.telegram.org/file/bot' + TelegramBot.token + '/' + file.result.file_path;
			Images.update({_id: imgBroken._id}, {$set:{img_src:filePath}});
			// }
			console.log("Image " +id + " has been fixed");
			return "Image " +id + " has been fixed";	

		},

		insertMessage: function(schemaObj){
        // console.log(schemaObj);
        // if (this.userId){
            schemaObj.createdOn = new Date();
            // schemaObj.userId = this.userId;
            var t = Messages.insert(schemaObj);
            console.log(t);
            TelegramBot.send(schemaObj.messageText, schemaObj.telegramUserId);
            return t;
        // }
        // return;

    },
	});

});


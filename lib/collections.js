import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Messages = new Mongo.Collection("messages");

//it gets run on both client and server
Images = new Mongo.Collection("images");
console.log("collections.js says: " +Images.find().count());

// set up security on Images collection.
// happens only on server

Images.allow({
	insert: function(userId,doc){
		// console.log(userId);
		// console.log(doc);
		return verifyUser(userId,doc);
	},
	// remove: function(userId,doc){
	// 	return verifyUser(userId,doc);
	// },
    remove: function(){
        if (Meteor.user()){
            return true;
        }
        else{
            return false;
        }
    },
	update: function(){
		if (Meteor.user()){
			return true;
		}
		else{
			return false;
		}
	},
});

function verifyUser(userId,doc){
	if (Meteor.user()){ // they have logged in
		if (userId == doc.createdBy){//the user has logged in, the image has a correct user id
			return true;
		}//if
		else{//the user is messing about
			return false;
		}//else
	}//if
	else{ //user has not logged in
		return false;
	}//else
}//function


Messages.attachSchema(new SimpleSchema({
    messageText: {
        type: String,
        label: "Message",
        max: 1000
    },
    telegramUserId:{
       type: String,    
    },
    telegramFullName:{
        type: String,
    },
    telegramUsername:{
        type: String,
    },
    // nickname: {
    //     type: String,
    //     autoform: {
    //         // type: "hidden",
    //         label: false
    //     },
    //     defaultValue: '0'
    // },
    createdOn: {
        type: Date,
        autoform: {
            // type: "hidden",
            // label: false
        },
        defaultValue: new Date(),
    },
    userId: {
        type: String,
        autoform: {
            // type: "hidden",
            // label: false
        },
        defaultValue: '0'
    },

    imgId: {
        type: String,
    },

}));



// Images.allow({
// 	insert:function(userId, doc){
// 		// console.log(doc);
// 		if(Meteor.user()){ //they are logged in
// 			if (userId != doc.createdBy){ //the user is messing about
// 				return false;
// 			}//if
// 			else{ //the user is logged in, the image has the correct user id
// 				return true;
// 			}//else
// 		}//if
// 		else{ //user not logged in
// 			return false;
// 		}//else
// 	},
// 	remove:function(userId, doc){
// 		console.log(doc);
// 		return true;

// 	}
// });
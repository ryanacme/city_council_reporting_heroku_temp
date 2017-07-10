// Meteor.methods({
//     insertMessage: function(schemaObj){
//         // console.log(schemaObj);
//         // if (this.userId){
//             schemaObj.createdOn = new Date();
//             // schemaObj.userId = this.userId;
//             var t = Messages.insert(schemaObj);
//             console.log(t);
//             TelegramBot.send(schemaObj.messageText, schemaObj.telegramUserId);
//             return t;
//         // }
//         // return;

//     },
// });
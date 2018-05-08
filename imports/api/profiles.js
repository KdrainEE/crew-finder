//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Used to insert or delete user profile records.
//   Includes a method for sending email notifications for
//   account changes.
//
// Last Modified: 4/30/2018
// Last Modified By:  Katie Austin
//************************************************************

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Profiles = new Mongo.Collection('profiles');

// publishes profiles on the server side
if(Meteor.isServer)
{
  Meteor.publish('profiles', function profilesPublication(){
    return Profiles.find({
    });
  });
}

// Methods used to insert and delete profile accounts.
// Includes email notificaton for profile changes.
Meteor.methods({

  'profiles.insert'(firstName, lastName, memberType, passedEmail, passedPhone, skillOne, skillTwo, skillThree, skillFour, skillFive, boatType, createDate, updateDate, deleteDate)
  // original insert method, updated to remove fields no longer needed
  //'profiles.insert'(firstName, lastName, memberType, passedEmail, passedPhone, skillOne, skillTwo, skillThree, skillFour, skillFive, passedDate, passedCity,
  //  passedState, passedZip)
  {

      if (Profiles.find({ accountId: Meteor.user()._id }).count() != 0)
      {
          throw new Meteor.Error('this account already has profile info');
      }

      var firstToInsert = firstName;
      var lastToInsert = lastName;
      var memberToInsert = memberType;
      var emailToInsert = passedEmail.toString();
      var phoneToInsert = passedPhone;
      var skill1ToInsert = skillOne;
      var skill2ToInsert = skillTwo;
      var skill3ToInsert = skillThree;
      var skill4ToInsert = skillFour;
      var skill5ToInsert = skillFive;
      var boatTypeToInsert = boatType;

      var createdAtToInsert = createDate;
      createDateToInsert = new Date();
      createDateToInsert.setDate(createDateToInsert.getDate());
      createDateToInsert = (createDateToInsert.getMonth() + 1) + "/" + createDateToInsert.getDate() + "/" + createDateToInsert.getFullYear();

      var updateDateToInsert = updateDate;
      var deleteDateToInsert = deleteDate;

    Profiles.insert
    ({
        accountId: Meteor.user()._id,
        first: firstToInsert,
        last: lastToInsert,
        member: memberToInsert,
        email: emailToInsert,
        phone: phoneToInsert,
        skillone: skill1ToInsert,
        skilltwo: skill2ToInsert,
        skillthree: skill3ToInsert,
        skillfour: skill4ToInsert,
        skillfive: skill5ToInsert,
        boattype: boatTypeToInsert,
        createdAt: createDateToInsert,
        updatedAt: updateDateToInsert,
        deletedAt: deleteDateToInsert,
        activated: false,

          });
  },
  'profiles.delete'(profileId)
  {
      Profiles.remove(profileId);
  },
  'profiles.sendemail'(email, activated)
  {
      try {
          var nodemailer = require('nodemailer');
          var activate;
          var message;

          if (activated) {
              activate = "Activated";
              message = "Your Gamecock Sailing Club Application account has been activated!\n" +
                  "You can now access your profile and join sailing opportunities";
          }
          else {
              activate = "Deactivated";
              message = "Your Gamecock Sailing Club Application account has been deactivated\n" +
                  "If you believe this is in error, please contact the administrator to reactivate your account";
          }

          var name = "Profile " + activate;
          var from = "gamecocksailingclubapp@gmail.com";

          var to = email;

          var smtpTransport = nodemailer.createTransport({
              service: "Gmail",
              auth: {
                  user: "gamecocksailingclubapp@gmail.com",
                  pass: "GsClMyRa18"
              }
          });

          var mailOptions = {
              from: from,
              to: to,
              subject: name,
              text: message
          }

          smtpTransport.sendMail(mailOptions);
      }
      catch (error) {
          swal("Error sending email:\n" + error.message);
      }
  },
});

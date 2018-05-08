//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Used to insert or delete event records.
//   Includes a method for sending email notifications for
//   event changes.
//
// Last Modified: 4/30/2018
// Last Modified By:  Katie Austin
//************************************************************

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import nodemailer from 'nodemailer';

export const Posts = new Mongo.Collection('posts');

if(Meteor.isServer)
{
  Meteor.publish('posts', function profilesPublication(){
    return Posts.find({
      $or: [
        { },
      ],
    });
  });
}

// Methods for inserting and deleting events.
// Includes email notificaton for event changes.
Meteor.methods({
    'posts.insert'(passedId, passedUsername, passedType, passedDate, passedTime, passedEventTitle, passedBoatType,
        passedCrewPosition, passedComments, passedRequestor, passedEventId)
  {
      var idToInsert = passedId;
      if(passedUsername != null)
        var usernameToInsert = passedUsername.toString();
      var postType = passedType;
      var dateToInsert = new Date(passedDate);
      dateToInsert = (dateToInsert.getMonth() + 1) + "/" + dateToInsert.getDate() + "/" + dateToInsert.getFullYear();
      var timeToInsert = passedTime
      var eventTitleToInsert = passedEventTitle;
      var boatTypeToInsert = passedBoatType;
      var crewPositionToInsert = passedCrewPosition;
      var commentsToInsert = passedComments;
      if (passedRequestor != null)
          var requestorToInsert = passedRequestor.toString();
      else
          var requestorToInsert = null;
      var eventToInsert = passedEventId;

    Posts.insert
        ({
        accountId: idToInsert,
        username: passedUsername,
        type: postType,
        date: dateToInsert,
        time: timeToInsert,
        eventTitle: eventTitleToInsert,
		boatType: boatTypeToInsert,
        crewPosition: crewPositionToInsert,
        comments: commentsToInsert,
        requestor: requestorToInsert,
        eventId: eventToInsert,
          });
    },
  'posts.delete'(postId)
  {
      Posts.remove(postId);
  },

  'posts.sendemail'(username, requestor, eventTitle, date, time, boatType, crewPosition, comments)
  {
      try {
          var nodemailer = require('nodemailer');

          var name = "Match Made! " + eventTitle + " (" + date + ")";
          var from = "gamecocksailingclubapp@gmail.com";

          var message = "Match Created: " + username + " and " + requestor + "\nEvent: " + eventTitle + "\nDate: " + date + "\nDuration: "
              + time + "\nBoat Type: " + boatType + "\nCrew Position: " + crewPosition + "\nComments: " + comments
              + "\nHappy Sailing!";

          var to = username + ";" + requestor;

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
          swal("Error sending email:\n" + error.message + "\nPlease notify the admin.");
      }
  }
});

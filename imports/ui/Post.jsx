//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: This page handles the displaying and creating
// of events after the initial event has been created.
//
// Types of posts:
//   SailingEvent - Created by the Admin.  Represents an event that LMYRA
//     members can request crew to join them for.
//   CrewRequest - Created by LMYRA users from the event they want crew
//     members for.  CrewRequests are shown to GSC members who have the
//    appropriate skills.
//   SailingRequest - Created by GSC users. Lets GSC users select a date
//     that they're available so LMYRA users can instantly match with them
//    instead of creating a request.
//   Match - A SailingRequest becomes a match when the LMYRA user accepts
//    the GSC user's SailingRequest.  The Match will show up under both
//    users' Upcoming Events ***Subject to change for LMYRA
//
// Last Modified: 4/30/2018
// Last Modified By:  Katie Austin
//************************************************************

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Posts } from '../api/posts.js';
import { Profiles } from '../api/profiles.js';
import swal from 'sweetalert';

export default class Post extends Component {

  //Method to populate fields in the "SailingEvent"s edit form
  editPost() {
      var toShow = this.props.post._id;
      document.getElementById(toShow).hidden = !document.getElementById(toShow).hidden;

      var editPostEventTitle = "editPostEventTitle-" + this.props.post._id;
      var editPostDate = "editPostDate-" + this.props.post._id;
      var editDuration = "editDuration-" + this.props.post._id;

      document.getElementById(editPostEventTitle).value = this.props.post.eventTitle;

      var dateToConvert = this.props.post.date.split('/');
      if (Number(dateToConvert[0]) < 10)
          dateToConvert[0] = "0" + dateToConvert[0];
      if (Number(dateToConvert[1]) < 10)
          dateToConvert[1] = "0" + dateToConvert[1];
      var convertedDate = dateToConvert[2] + "-" + dateToConvert[0] + "-" + dateToConvert[1];
      console.log(convertedDate);
      console.log(document.getElementById(editPostDate).value);

      document.getElementById(editPostDate).value = convertedDate;
      document.getElementById(editDuration).value = this.props.post.time;

      console.log(document.getElementById(editPostDate).value);
  }

  //Used by GSC members to accept "CrewRequest"s created by LMYRA members
  //Changes the post to type "Match" and emails both the requestor and the acceptor
  approvePost() {
      swal("Are you sure you want to match with this post?", { buttons: { Yes: "Yes", No: "No" } })
          .then((value) => {
              if (value == "Yes") {
                  var email = Profiles.findOne({ accountId: Meteor.user()._id }).email;
                  Posts.update(this.props.post._id, {
                      $set: { type: 'Match', username: email }
                  });
                  Meteor.call('posts.sendemail', email, this.props.post.requestor,
                      this.props.post.eventTitle, this.props.post.date, this.props.post.time, this.props.post.boatType,
                  this.props.post.crewPosition, this.props.post.comments);
              }
          });
  }

  //Deletes a "SailingEvent" on the admin page
  deletePost() {
      swal("Are you sure you want to delete this post?", { buttons: { Yes: "Yes", No: "No" } })
          .then((value) => {
              if (value == "Yes") {
                  let allPosts = Posts.find({}).fetch();
                  //Delete all other posts associated with the event
                  for (i = 0; i < allPosts.length; i++) {
                      if (allPosts[i].eventId == this.props.post._id)
                          Meteor.call('posts.delete', allPosts[i]._id);
                  }
                  Meteor.call('posts.delete', this.props.post._id);
              }
          });
  }

  //Toggles the visibility of a request or edit form
  toggleRequestForm() {
      var toShow = this.props.post._id;
      document.getElementById(toShow).hidden = !document.getElementById(toShow).hidden;
  }

  //Submits an edit to a "SailingEvent" from the admin
  submitEdit(event) {
      event.preventDefault();
      var editPostEventTitle = "editPostEventTitle-" + this.props.post._id;
      var editPostDate = "editPostDate-" + this.props.post._id;
      var editDuration = "editDuration-" + this.props.post._id;

      var newTitle = document.getElementById(editPostEventTitle).value;
      var dateToConvert = new Date(document.getElementById(editPostDate).value);
      var newDate = (dateToConvert.getMonth() + 1) + "/" + dateToConvert.getDate() + "/" + dateToConvert.getFullYear();
      var newDuration = document.getElementById(editDuration).value;

      Posts.update(this.props.post._id, {
          $set: {
              eventTitle: newTitle, date: newDate, time: newDuration
          }
      });

      swal("Changes Saved");

      this.toggleRequestForm();
  }

  //Method to submit a "SailingRequest" from an LMYRA member
  //Takes a crew position and comments from the form
  //Retrieves boat type and email from the user's profile
  //Retrieves event information from the post the form is attached to
  //Inserts a new post into the Posts database
  submitRequest(event) {
      event.preventDefault();

      swal("Are you sure you want to submit this request?", { buttons: { Yes: "Yes", No: "No" } })
          .then((value) => {
              if (value == "Yes") {
                  var editCrewPosition = "editCrewPosition-" + this.props.post._id;
                  var editPostComments = "editPostComments-" + this.props.post._id;

                  var newCrewPosition = document.getElementById(editCrewPosition).value;
                  var newComments = document.getElementById(editPostComments).value;

                  var boatType = Profiles.findOne({ accountId: Meteor.user()._id }).boattype;

                  var email = Profiles.findOne({ accountId: Meteor.user()._id }).email.toString();

                  Meteor.call('posts.insert', Meteor.user()._id, null, 'CrewRequest',
                      this.props.post.date, this.props.post.time, this.props.post.eventTitle, boatType, newCrewPosition,
                      newComments, email, this.props.post._id);
              }
          });
  }

  //Method to accept a 'SailingRequest' from a GSC member.
  //Updates the exist post to be a 'Match' with the crew position and boat type
  //they are being hired for.
  //Sends an email to both members of the new 'Match'
  hireGSCMember(event) {
      event.preventDefault();

      swal("Are you sure you want to hire this GSC Member?", { buttons: { Yes: "Yes", No: "No" } })
          .then((value) => {
              if (value == "Yes") {
                  var editCrewPosition = "editCrewPosition-" + this.props.post._id;
                  var email = Profiles.findOne({ accountId: Meteor.user()._id }).email.toString();
                  var boatType = Profiles.findOne({ accountId: Meteor.user()._id }).boattype;

                  var position = document.getElementById(editCrewPosition).value;

                  Posts.update(this.props.post._id, {
                      $set: {
                          username: email, type: 'Match', crewPosition: position, boatType: boatType
                      }
                  });

                  var boatType = Profiles.findOne({ accountId: Meteor.user()._id }).boattype;

                  Meteor.call('posts.sendemail', email, this.props.post.requestor,
                      this.props.post.eventTitle, this.props.post.date, this.props.post.time, boatType, position, this.props.post.comments);
              }
          });
  }

  //Used to populate the dropdown of events for a GSC "SailingRequest"
  //Forces the user to only be able to select an event that is in the
  //list defined by the admin
  //Returns an <option> object for each event that has not passed yet
  listEvents() {
      let eventsToDisplay = Posts.find({ type: 'SailingEvent' });
      var today = new Date();
      return eventsToDisplay.map((event) => {
          var dayMonthYear = event.date.split('/');
          var newTime = event.time.split(':');
          var postDate = new Date(dayMonthYear[2], dayMonthYear[0] - 1, dayMonthYear[1], 0, 0);
          postDate.setDate(postDate.getDate() + 1);
          if (postDate.getTime() >= today.getTime()) {
              var id = event.title + "-" + event._id;
              return (<option id={id} value={event._id}>
                  {event.eventTitle} - {event.date}
                  </option>
                  )
          }
      });
  }

  //Method for LMYRA/GSC users to edit their pending requests
  //LMYRA users edit crew position, event, and comments
  //GSC users edit event, boat type, and comments
  //Updates the post in the Posts database
  editPendingPost(event) {
      event.preventDefault();

      var editCrewPosition = "editCrewPosition-" + this.props.post._id;
      var editComments = "editPostComments-" + this.props.post._id;
      var selectEvent = "selectEvent-" + this.props.post._id;
      var editPostBoatType = "editPostBoatType-" + this.props.post._id;

      if (this.props.role == "LMYRA") {
          var selectedEvent = document.getElementById(selectEvent);
          var id = selectedEvent.options[selectedEvent.selectedIndex].value;
          var position = document.getElementById(editCrewPosition).value;
          var comments = document.getElementById(editComments).value;

          var event = Posts.findOne({ _id: id }).eventTitle;
          var date = Posts.findOne({ _id: id }).date;
          var time = Posts.findOne({ _id: id }).time;
          Posts.update(this.props.post._id, {
              $set: {
                  eventTitle: event, date: date, time: time,
                  crewPosition: position, eventId: id, comments: comments
              }
          });
      }
      else {
          var selectedEvent = document.getElementById(selectEvent);
          var id = selectedEvent.options[selectedEvent.selectedIndex].value;
          var comments = document.getElementById(editComments).value;
          var boat = document.getElementById(editPostBoatType).value;
          var event = Posts.findOne({ _id: id }).eventTitle;
          var date = Posts.findOne({ _id: id }).date;
          var time = Posts.findOne({ _id: id }).time;
          Posts.update(this.props.post._id, {
              $set: {
                  eventTitle: event, date: date, time: time,
                  crewPosition: position, eventId: id, boatType: boat, comments: comments
              }
          });
      }

      swal("Changes Saved");
  }

  render() {
    //These variables are used per post in order to make their HTML ID unique
    //Otherwise, only the first of each type would be called when referenced
    //Made unique using the Meteor generated ID of each post
    var editPostEventTitle = "editPostEventTitle-" + this.props.post._id;
    var editPostDate = "editPostDate-" + this.props.post._id;
    var editDuration = "editDuration-" + this.props.post._id;
    var editPostBoatType = "editPostBoatType-" + this.props.post._id;
    var editPostDivision = "editPostDivision-" + this.props.post._id;
    var editCrewPosition = "editCrewPosition-" + this.props.post._id;
    var editPostComments = "editPostComments-" + this.props.post._id;
    var editAssignedTo = "editAssignedTo-" + this.props.post._id;
    var selectEvent = "selectEvent-" + this.props.post._id;
    var editPostSubmit = "editPostSubmit-" + this.props.post._id;
    var editPostCancel = "editPostCancel-" + this.props.post._id;

    return (
      <div className= "post">

            <span className="text">
                    {/*Event TItle.  Shown for all posts*/}
                    <div class="line">
                        <div class="col-25">Event:</div>
                        <div class="col-75">{this.props.post.eventTitle} <br /></div>
                    </div>
                {/*Date of event.  Shown for all posts*/}
              <div class="line">
                <div class="col-25">Date:</div>
                <div class="col-75 vertCent">{this.props.post.date}<br /></div>
              </div>
              {/*Duration of event.  Not shown for "SailingRequest", redundant otherwise*/}
              {this.props.post.type == "SailingEvent" || this.props.post.type == "CrewRequest" ?
              (<div class="line">
                <div class="col-25">Duration:</div>
                <div class="col-75">{this.props.post.time}
                {this.props.post.time == 1 ? " Day" : " Days"}
                <br /></div>
                  </div>) : ""}
              {/*Boat type.  Not shown for "SailingEvent" as it is based on LMYRA user*/}
              {/*'Boat Type' shown for GSC members, whereas LMYRA members see the GSC user's 'Preferred Boat Type'*/}
              {this.props.post.type == 'CrewRequest' || (this.props.post.type == 'SailingRequest')?
                    <div>
                        {this.props.post.type == 'CrewRequest' ?
                            <div class="line">
                                <div class="col-25">Boat Type:</div>
                                <div class="col-75">{this.props.post.boatType} <br /></div>
                            </div>
                            :
                            <div class="line">
                                <div class="col-25">Preferred Boat Type:</div>
                                <div class="col-75">{this.props.post.boatType} <br /></div>
                            </div>}
                      {/*Position Needed.  Only shown for "CrewRequest"s*/}
                      {this.props.post.type == 'CrewRequest' ?

                          <div class="line">
                            <div class="col-25">Position Needed:</div>
                            <div class="col-75">{this.props.post.crewPosition}<br /></div>
                          </div>
                          : ""}
                    {/*Comments,  Only shown for "CrewRequest"s and "SailingRequest"s*/}
                    <div class="line">
                      <div class="col-25">Comments:</div>
                      <div class="col-75">{this.props.post.comments}<br /></div>
                    </div>
                  </div> : ""}
              {/*GSC member's skills.  Only shown on "SailingRequests" on the LMYRA page*/}
              {this.props.role == "LMYRA" && this.props.post.type == "SailingRequest" ? (
                  <div>
                    <div class="line">
                        <div class="col-25">Jib Trimming:</div>
                        <div class="col-75 vertCent">{Profiles.findOne({email:this.props.post.requestor}).skillone}<br/></div>
                    </div>
                    <div class="line">
                        <div class="col-25">Main Trimming:</div>
                        <div class="col-75 vertCent">{Profiles.findOne({ email: this.props.post.requestor }).skilltwo}<br /></div>
                    </div>
                    <div class="line">
                        <div class="col-25">Spinnaker Trimming:</div>
                        <div class="col-75 vertCent">{Profiles.findOne({ email: this.props.post.requestor }).skillthree}<br /></div>
                    </div>
                    <div class="line">
                        <div class="col-25">Foredeck:</div>
                        <div class="col-75 vertCent">{Profiles.findOne({ email: this.props.post.requestor }).skillfour}<br /></div>

                    </div>
                    <div class="line">
                            <div class="col-25">Other Skills:</div>
                            <div class="col-75">{Profiles.findOne({ email: this.props.post.requestor }).skillfive}<br/></div>
                    </div>
                  </div>
              ) : ""}
              {/*Request Crew Members button.  Attached to "SailingEvent"s*/}
              {this.props.role == "LMYRA" && this.props.post.type == 'SailingEvent' ? (
                    <span>
                        <br/>
                        <button class="edit longButton" onClick={this.toggleRequestForm.bind(this)}>
                            Request Crew Members
                        </button>
                        <br />
                        <br />
                    </span>
              ) : ""}
              {/*Hire Crew Member button.  Attached to "SailingRequest"s on the LMYRA page*/}
              {this.props.role == "LMYRA" && this.props.post.type == 'SailingRequest' ? (
                  <span>
                      <br />
                      <button class="edit longButton" onClick={this.toggleRequestForm.bind(this)}>
                          Hire Crew Member
                        </button>
                      <br />
                      <br />
                  </span>
              ) : ""}
              {/*Edit/Delete buttons.  Only shown to Admin*/}
                {this.props.role == "ADMIN" ? (
                   <div class="holdButtons">
                    <button class="edit" onClick={this.editPost.bind(this)} value={this.props.post._id}>
                        Edit
                    </button>
                    <button class="delete" onClick={this.deletePost.bind(this)}>
                        Delete
                    </button>
                  </div>
                ) : ""}
            </span>
            {/*Edit button for LMYRA users' pending requests*/}
            {this.props.post.type == 'CrewRequest' && this.props.role == 'LMYRA' ?
                <button class="edit" onClick={this.toggleRequestForm.bind(this)}>Edit</button> : ""}
            {/*Edit button for GSC users' pending requests*/}
            {this.props.post.type == 'SailingRequest' && this.props.role == 'GSC' ?
                <button class="edit" onClick={this.toggleRequestForm.bind(this)}>Edit</button> : ""}
            {/*Edit form for LMYRA users' pending requests*/}
            {this.props.post.type == 'CrewRequest' && this.props.role == 'LMYRA' ?
                <form id={this.props.post._id} onSubmit={this.editPendingPost.bind(this)} hidden>
                    <br /> <br/>
                    <select id={editCrewPosition} defaultValue={this.props.post.crewPosition}>
                        <option value="Jib Trimmer">Jib Trimmer</option>
                        <option value="Main Trimmer">Main Trimmer</option>
                        <option value="Spinnaker Trimmer">Spinnaker Trimmer</option>
                        <option value="Foredeck">Foredeck</option>
                        <option value="Other">Other</option>
                    </select> <br /> <br />
                    <select id={selectEvent}>
                        {this.listEvents()}
                    </select> <br /><br />
                    <input id={editPostComments} type="textarea" placeholder="Additional Comments" defaultValue={this.props.post.comments} /><br /><br />
                    <input id={editPostSubmit} type="submit" value="Save" />
                    <input id={editPostCancel} type="button" value="Cancel" onClick={this.toggleRequestForm.bind(this)} /> <br /> <br />
                </form> : ""}
            {/*Edit form for GSC users' pending requests*/}
            {this.props.post.type == 'SailingRequest' && this.props.role == 'GSC' ?
                <form id={this.props.post._id} onSubmit={this.editPendingPost.bind(this)} hidden>
                    <br /> <br/>
                    <select id={selectEvent}>
                        {this.listEvents()}
                    </select> <br /><br />
                    <input id={editPostBoatType} type="text" placeholder="Boat Type" defaultValue={this.props.post.boatType} /> <br/> <br/>
                    <input id={editPostComments} type="textarea" placeholder="Additional Comments" defaultValue={this.props.post.comments}/><br /><br />
                    <input id={editPostSubmit} type="submit" value="Save" />
                    <input id={editPostCancel} type="button" value="Cancel" onClick={this.toggleRequestForm.bind(this)} /> <br /> <br />
                </form> : ""}
            {/*Set Sail button.  Used to accept "CrewRequest"s made by LMYRA members*/}
            {this.props.role == "GSC" && this.props.post.type != "SailingRequest" ?
                <button class="approve longButton" onClick={this.approvePost.bind(this)}>Set Sail</button> : ""}
            <br />
            {/*Edit form for Admin's "SailingEvent"s*/}
            {this.props.role == "ADMIN" ? (
                <form id={this.props.post._id} onSubmit={this.submitEdit.bind(this)} hidden>

                    <h4>Event Title</h4>
                    <input id={editPostEventTitle} type="text" placeholder="Event Title" defaultValue={this.props.post.eventTitle} />
                    <h4>Event Date</h4>
                    <input id={editPostDate} type="date" placeholder="Date" defaultValue={this.props.post.date} />
                    <h4>Length of Event (Days)</h4>
                    <input id={editDuration} type="number" placeholder="Length of Event (days)" defaultValue={this.props.post.time} />
                    <input id={editPostSubmit} type="submit" value="Save" />
                    <input id={editPostCancel} type="button" value="Cancel" onClick={this.toggleRequestForm.bind(this)} />
                </form>) : ""}
            {/*Form for LMYRA user's to input information attached to a "CrewRequest"*/}
            {this.props.role == "LMYRA" && this.props.post.type != 'SailingRequest' ? (
                <form id={this.props.post._id} onSubmit={this.submitRequest.bind(this)} hidden>
                    <br />
                    <select id={editCrewPosition} defaultValue={this.props.post.crewPosition}>
                        <option value="Jib Trimmer">Jib Trimmer</option>
                        <option value="Main Trimmer">Main Trimmer</option>
                        <option value="Spinnaker Trimmer">Spinnaker Trimmer</option>
                        <option value="Foredeck">Foredeck</option>
                        <option value="Other">Other</option>
                    </select> <br /> <br />
                    <input id={editPostComments} type="textarea" placeholder="Additional Comments" defaultValue={this.props.post.comments} /><br /><br />
                    <input id={editPostSubmit} type="submit" value="Save" />
                    <input id={editPostCancel} type="button" value="Cancel" onClick={this.toggleRequestForm.bind(this)} /> <br /> <br />
                </form>) : ""}
            {/*Form for LMYRA user's to input information attached to a "SailingRequest" and accept the post*/}
            {this.props.role == "LMYRA" && this.props.post.type == 'SailingRequest' ? (
                <form id={this.props.post._id} onSubmit={this.hireGSCMember.bind(this)} hidden>
                    <br />
                    <select id={editCrewPosition} defaultValue={this.props.post.crewPosition}>
                        <option value="Jib Trimmer">Jib Trimmer</option>
                        <option value="Main Trimmer">Main Trimmer</option>
                        <option value="Spinnaker Trimmer">Spinnaker Trimmer</option>
                        <option value="Foredeck">Foredeck</option>
                        <option value="Other">Other</option>
                    </select> <br /> <br />
                    <input id={editPostSubmit} type="submit" value="Save" />
                    <input id={editPostCancel} type="button" value="Cancel" onClick={this.toggleRequestForm.bind(this)} /> <br /> <br />
                </form>) : ""}
      </div>
    );
  }
}

Post.propTypes =
{
    post: PropTypes.object.isRequired,
    role: PropTypes.object.isRequired,
//showPrivateButton: PropTypes.bool.isRequired,
};

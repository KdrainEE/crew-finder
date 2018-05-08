//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Displays the following details for the GSC
//   member logged into the application:
//    - All crew requests submitted by LMYRA members. Once
//      accepted by GSC member they will be listed under
//      'My Events'.
//    - All of the member's pending sailing requests. Displays
//      only those requests the member submitted not matched.
//    - Provides a method for the member to submit a sailing
//      request.
//    - Provides an 'Available Events' list that is filterable.
//
// Last Modified: 4/30/2018
// Last Modified By:  Katie Austin
//************************************************************

import React from 'react';
import PropTypes from 'prop-types';
import { Mongo } from 'meteor/mongo';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Profiles } from '../../api/profiles.js';
import { Posts } from '../../api/posts.js';
import moment from 'moment';
import Post from "../../ui/Post.jsx";
import swal from 'sweetalert';
import GSCProfile from "../../ui/GSCProfile.jsx";

export class GscPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      crewPositionFilter: '',
      dateFilter: '',
      renderDateFilter: '',
    };
  }

  //Method to submit a 'SailingRequest'
  //Takes values from the 'postEvent', 'postBoatType', and 'postComments' HTML elements
  //Creates a new entry in the Posts database that is then viewable in LMYRA members'
  //"Available GSC Requests" section
  createPost(event) {
      event.preventDefault();

      swal("Are you sure you want to submit this request?", { buttons: { Yes: "Yes", No: "No" } })
          .then((value) => {
              if (value == "Yes") {
                  var boatType = document.getElementById("postBoatType").value;
                  var username = Profiles.findOne({ accountId: Meteor.user()._id }).email;
                  var comments = document.getElementById("postComments").value;

                  var event = document.getElementById("postEvent").value;
                  var date = Posts.findOne({ _id: event }).date;
                  var time = Posts.findOne({ _id: event }).time;
                  var eventTitle = Posts.findOne({ _id: event }).eventTitle;

                  Meteor.call('posts.insert', Meteor.user()._id, null, 'SailingRequest', date, time, eventTitle, boatType, null, comments, username, event);
              }
          });
  }

  //Toggles the "Submit New Request" form
  showRequestForm() {
      document.getElementById("createPost").hidden = !document.getElementById("createPost").hidden
  }

  //Method used to render the user's upcoming events
  //Displays posts marked as a 'Match' that have the user either as the requestor
  //or the acceptor
  //Returns pure HTML with information from the posts that match the criteria
  renderEvents() {
      var text = [];
      var email = Profiles.findOne({ accountId: Meteor.user()._id }).email;
      let postsToDisplay = Posts.find({ $or: [{ username: email }, { requestor: email }], type: 'Match' });
      var today = new Date();
      return postsToDisplay.map((post) => {
          var dayMonthYear = post.date.split('/');
          var postDate = new Date(dayMonthYear[2], dayMonthYear[0] - 1, dayMonthYear[1], 0, 0);
          postDate.setDate(postDate.getDate() + 1);
          //Check if the event is in the past
          if (postDate.getTime() >= today.getTime()) {
              //Check if the user is the requestor or the acceptor
              if (Posts.findOne(post).username == email)
                  var toDisplay = "With: " + Posts.findOne(post).requestor;
              else if (Posts.findOne(post).requestor == email)
                  var toDisplay = "With: " + Posts.findOne(post).username;
              return (
                  <div className="events">
                      <span>{Posts.findOne(post).eventTitle}</span>
                      <br /><span>{Posts.findOne(post).date} ({Posts.findOne(post).time} {Posts.findOne(post).time == 1 ? " Day" : " Days"})</span>
                      <br /><span>{toDisplay}</span>

                  </div>
              );
          }
          else {
              //don't show event if the date and time has passed
          }
      });
  }

  renderGSCProfile() {
    var text = [];
    let profilesToDisplay = Profiles.find({accountId: Meteor.user()._id}).fetch();
    return profilesToDisplay.map((profile) => {
      return (
        <div class="profile">
          <GSCProfile key ={profile._id} profile={profile} role= {Profiles.findOne({ accountId: Meteor.user()._id}).member }/>
          <br/>
        </div>

      );
    });
  }

  //Method to display all of the user's pending 'SailingRequest's
  //Checks whether the user is the requestor of the 'SailingRequest' to
  //determine whether to display it or not.
  //Returns Post.jsx elements as HTML
  renderPendingPosts() {
      var email = Meteor.user().emails[0].address.toString();
      let postsToDisplay = Posts.find({ type: 'SailingRequest', requestor: email });
      var today = new Date();
      return postsToDisplay.map((post) => {
          var dayMonthYear = post.date.split('/');
          var postDate = new Date(dayMonthYear[2], dayMonthYear[0] - 1, dayMonthYear[1], 0, 0);
          //Check if the event is in the past
          postDate.setDate(postDate.getDate() + 1);
          if (postDate.getTime() >= today.getTime())
          return (
              <Post key={post._id} post={post} role={Profiles.findOne({accountId: Meteor.user()._id}).member} />
              )
      });
  }

  //Method to display all "CrewRequest"s submitted by LMYRA members
  //GSC members can accept these posts and they will be moved to "My Events" as
  //a "Match"
  //Returns Post.jsx elements as HTML
  renderPosts() {
      var text = [];
      let postsToDisplay;
      if(this.state.crewPositionFilter != "" && this.state.renderDateFilter != "") {
          postsToDisplay = Posts.find({
              type: 'CrewRequest', crewPosition: this.state.crewPositionFilter,
          date: this.state.renderDateFilter});
      }
      else if (this.state.crewPositionFilter != "") {
          postsToDisplay = Posts.find({
              type: 'CrewRequest', crewPosition: this.state.crewPositionFilter,
          });
      }
      else if (this.state.renderDateFilter != "") {
          postsToDisplay = Posts.find({
              type: 'CrewRequest', date: this.state.renderDateFilter
          });
      }
      else {
          postsToDisplay = Posts.find({ type: 'CrewRequest' });
      }
      var today = new Date();
      return postsToDisplay.map((post) => {
          var dayMonthYear = post.date.split('/');
          var postDate = new Date(dayMonthYear[2], dayMonthYear[0] - 1, dayMonthYear[1], 0, 0);
          postDate.setDate(postDate.getDate() + 1);
          //Check if the event is in the past
          if (postDate.getTime() >= today.getTime()) {
              return (

                  <Post key={post._id} post={post} role={Profiles.findOne({ accountId: Meteor.user()._id }).member}/>

                  );
          }
          else {
              //don't show event if the date and time has passed
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
          //Check if the event is in the past
          if (postDate.getTime() >= today.getTime()) {
              var id = event.title + "-" + event._id;
              return (<option id={id} value={event._id}>
                  {event.eventTitle} - {event.date}
              </option>
              )
          }
      });
  }

  //Updates the "crewPositionFilter" state when the "crewPositionFilter"
  //HTML element is changed.  This change of state causes React elements to
  //re-render, filtering the "Available Events" list.
  //Sets crewPositionFilter to the value of the HTML element of the same name,
  //passed as e
  crewPositionFilter(e) {
      this.setState({ crewPositionFilter: e.target.value });
  }

  //Updates the "dateFilter" state and the "renderDateFilter" state when
  //the "dateFilter" HTML element is changed.  The "dateFilter" state represents
  //the value of the "dateFilter" HTML element.
  //The date is parsed to match the format of dates stored in the Posts table
  //"renderDateFilter" is set to this value, causing React elements to re-render,
  //filtering the "Available Events" list.
  dateFilter(e) {
      this.setState({ dateFilter: e.target.value });
      var theDate = e.target.value;
      var toParse = theDate.split('-');
      var newDate = Number(toParse[1]) + "/" + Number(toParse[2]) + "/" + Number(toParse[0]);
      if (e.target.value == "")
          this.setState({ renderDateFilter: "" });
      else
        this.setState({ renderDateFilter: newDate });
  }

  render() {
    return (
      <div>
        <h3 class="pageHead">Sailing Club</h3>
          <div class="row">
            <div class="col-md-4">
              <div class="inner">
                        <h4 class="heading">Profile</h4> <br/>
                        {this.renderGSCProfile()}
              </div>
            </div>



            <div class="col-md-4">
              <div class="inner">

                    <button id="createPostButton" type="button" onClick={this.showRequestForm}>Submit New Request</button>
                    <form id="createPost" onSubmit={this.createPost.bind(this)} hidden="hidden">
                    <h4 style={{color: "black"}}>Event</h4>
                    <select id="postEvent" required>
                        {this.listEvents()}
                    </select> <br /><br />
                    <input id="postBoatType" type="text" placeholder="Preferred Boat Type" required /><br /><br />
                    <input id="postComments" type="text" placeholder="Comments" /><br/><br/>
                    <input id="postSubmit" type="submit" value="Submit Request" />
                </form>

                  </div>


                </div>



            <div class="col-md-4">
              <div class="inner">
                      <h4 class="heading">Available Events</h4>

                      <div className="filter">
                          <div id="filterHead">
                            <h3 style={{ color: "white" }}>Filters</h3>
                          </div>
                          <div class="filters">
                            <h4 style={{ color: "white" }}>Crew Position</h4>

                            {/*<input type="text" placeholder="Skill Search" onChange={this.filterList} />*/}
                            <select id="crewPositionFilter" onChange={e => this.crewPositionFilter(e)} value={this.state.crewPositionFilter}>
                                <option value="">(none)</option>
                                <option value="Jib Trimmer">Jib Trimmer</option>
                                <option value="Main Trimmer">Main Trimmer</option>
                                <option value="Spinnaker Trimmer">Spinnaker Trimmer</option>
                                <option value="Foredeck">Foredeck</option>
                                <option value="Other">Other</option>
                            </select>
                          </div>
                          <div class="filters">
                            <h4 style={{ color: "white" }}>  Date</h4>
                            <input id="dateFilter" type="date" onChange={e => this.dateFilter(e)} value={this.state.dateFilter} />
                          </div>
                          <div id="posts" class="scroll">
                            {this.renderPosts()}
                          </div>
                        </div>
                      <br/><br/>
              </div>
            </div>
            </div>
            <div class="row">
            <div class="col-md-4">
              <div class="inner">
               <h4 class="heading">My Events</h4>
                    <div class="scroll">
                      {this.renderEvents()}
                    </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="inner">
                <h4 class="heading">Pending Requests</h4>
                <div class="scroll">
                  {this.renderPendingPosts()}
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  }
};
export default createContainer(() => {
    Meteor.subscribe('posts');
  return {
      user: Meteor.user(),
      posts: Posts.find({}, { sort: { createdAt: - 1 } }).fetch(),
      crewPositionFilter: "",
    }
}, GscPage);

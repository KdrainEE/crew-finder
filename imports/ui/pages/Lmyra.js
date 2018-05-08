//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Displays the following details for the LMYRA
//   member logged into the application:
//    - Events that have the user as the accepting user or
//      the requestor that have been changed to type 'Match'.
//    - Populates "Pending Requests" section with those
//      crew requests that have not been changed to type
//      'Match'.
//    - Populates "Upcoming Events" section with sailing
//      events created by an admin.
//    - Populates 'Available GSC Members' section with
//      sailing requests that have not yet been converted
//      to type 'Match'.
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
import LMYRAProfile from "../../ui/LMYRAProfile.jsx";
import swal from 'sweetalert';
//not formatted for our data set
//normally organizes the data

export class LmyraPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: ''
    };
  }

  //Method for populating "My Events"
  //Displays pure HTML using information from events that have the user as the accepting user
  //or the requestor that have been changed to type 'Match'
  //Mostly used just to remind the user of what events they have, they also received an email
  //for each of these events
  renderMyEvents() {
      var text = [];
      var email = Profiles.findOne({ accountId: Meteor.user()._id }).email.toString();
      let postsToDisplay = Posts.find({ $or: [{ requestor: email }, { username: email }], type: 'Match' });
      var today = new Date();
      return postsToDisplay.map((post) => {
          var dayMonthYear = post.date.split('/');
          var postDate = new Date(dayMonthYear[2], dayMonthYear[0] - 1, dayMonthYear[1]);
          postDate.setDate(postDate.getDate() + 1);
          //Check if the event is in the past
          if (postDate.getTime() >= today.getTime()) {
              if (post.requestor == email)
                  var toDisplay = "With: " + Posts.findOne(post).username;
              else if (post.username == email)
                  var toDisplay = "With: " + Posts.findOne(post).requestor;
              return (
                  /*<ul class="normal" style={{ color: "white" }}>
                      <li>
                      {Posts.findOne(post).date} ({Posts.findOne(post).time} {Posts.findOne(post).time == 1 ? " Day" : "Days"}): {Posts.findOne(post).eventTitle}
                          <br />
                          <span>{toDisplay}</span>
                      </li>
                  </ul>*/
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

  //Method to show the user's pending crew requests created from a "Request
  //Crew Members" button.  Only shows requests that have not been changed to type
  //'Match' yet and are still 'CrewRequest's
  //Populates the "Pending Requests" section
  //Returns Post.jsx elements as HTML
  renderPendingPosts() {
      var email = Meteor.user().emails[0].address.toString();
      let postsToDisplay = Posts.find({ type: 'CrewRequest', requestor: email, username: null });
      var today = new Date();
      return postsToDisplay.map((post) => {
          var dayMonthYear = post.date.split('/');
          var postDate = new Date(dayMonthYear[2], dayMonthYear[0] - 1, dayMonthYear[1]);
          postDate.setDate(postDate.getDate() + 1);
          //Check if the event is in the past
          if(postDate.getTime() >= today.getTime())
          return (
              <Post key={post._id} post={post} role={Profiles.findOne({ accountId: Meteor.user()._id }).member} />
          )
      });
  }

  renderLMYRAProfile() {
    var text = [];
    let profilesToDisplay = Profiles.find({accountId: Meteor.user()._id}).fetch();
    return profilesToDisplay.map((profile) => {
      return (
        <div class="profile">
          <LMYRAProfile key ={profile._id} profile={profile} role= {Profiles.findOne({ accountId: Meteor.user()._id}).member }/>
          <br/>
        </div>

      );
    });
  }
  //Method to show the upcoming 'SailingEvent's created by an ADMIN
  //Populates the "Upcoming Events" section
  //Returns Post.jsx elements as HTML
  renderUpcomingEvents() {
      var text = [];
      var email = Profiles.findOne({ accountId: Meteor.user()._id }).email.toString();
      let postsToDisplay = Posts.find({ type: { $in: ['SailingEvent'] } });
      var today = new Date();
      return postsToDisplay.map((post) => {
          var dayMonthYear = post.date.split('/');
          var postDate = new Date(dayMonthYear[2], dayMonthYear[0] - 1, dayMonthYear[1], 0, 0);
          postDate.setDate(postDate.getDate() + 1);
          //Check if the event is in the past
          if (postDate.getTime() >= today.getTime()) {
              return (
                  <span>
                    <Post key={ post._id } post= { post } role= { Profiles.findOne({ accountId: Meteor.user()._id }).member } />
                    <br />
                  </span>
                      //</ul >

                  );
      }
          else {
            //don't show event if the date and time has passed
          }
       });
  }

  //Method to show GSC member 'SailingRequest's that have not yet
  //been converted to a 'Match'.  Populates the 'Available GSC Members'
  //section
  //Returns Post.jsx elements as HTML
  renderGSCRequests() {
      var email = Meteor.user().emails[0].address.toString();
      let requestsToDisplay = Posts.find({ type: 'SailingRequest' });
      var today = new Date();
      return requestsToDisplay.map((request) => {
          var dayMonthYear = request.date.split('/');
          var postDate = new Date(dayMonthYear[2], dayMonthYear[0] - 1, dayMonthYear[1], 0, 0);
          postDate.setDate(postDate.getDate() + 1);
          //Check if the event is in the past
          if(postDate.getTime() >= today.getTime())
          return (
              <span>
                  <Post key={request._id} post={request} role={Profiles.findOne({ accountId: Meteor.user()._id }).member } />
              </span>
          )
      })
  }

  render() {
    return (
      <div>
        <h3 class="pageHead">LMYRA Page</h3>
        <div className="row">
          <div class="col-md-4">
            <div class="inner">
              {/*Profile section.  Pure HTML using information from the user's profile*/}
              <h4 class="heading">Profile</h4> <br/>
                {this.renderLMYRAProfile()}

              <br />
              <hr></hr>
            </div>
          </div>
          <div class="col-md-4">
             <div class="inner">
                {/*My Events Section.  Populates using renderMyEvents()*/}
                <h4 class="heading">My Events</h4>

                  <div className="scroll">
                          {this.renderMyEvents()}
                        </div>

            </div>
          </div>
          <div class="col-md-4">
              <div class="inner">
                  {/*Upcoming Events Section.  Populates using renderUpcomingEvents()*/}
                  <h4 class="heading">Upcoming Events:</h4>
                          <div class="scroll">
                            {this.renderUpcomingEvents()}
                          </div>
               </div>
          </div>
          <div class="col-md-4">
            <div class="inner">
              {/*GSC Member Request section.  Populates using renderGSCRequests()*/}
              <h4 class="heading">Available GSC Members</h4>
              <div class="scroll">
                {this.renderGSCRequests()}
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="inner">
              {/*Pending Requests section.  Populates using renderPendingPosts()*/}
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
      posts: Posts.find({}, { sort: { createdAt: - 1 } } ).fetch(),
    }
}, LmyraPage);

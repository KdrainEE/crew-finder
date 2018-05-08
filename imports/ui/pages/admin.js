//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Provides the following for the ADMIN
//   member logged into the application:
//    - Method for creating a new sailing event.
//    - Lists all user profiles.
//    - Lists sailing events that have been created by
//      admin users.
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

import Profile from "../../ui/Profile.jsx";
import Post from "../../ui/Post.jsx";
import swal from 'sweetalert';

export class AdminPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: ''
    };
  }

  //Toggles view of "createPost" form
  changeCreatePostView() {
      if (document.getElementById("createPost").hidden)
          document.getElementById("createPostButton").innerHTML = "Hide New Event";
      else
          document.getElementById("createPostButton").innerHTML = "Add New Event";
      document.getElementById("createPost").hidden = !document.getElementById("createPost").hidden;
  }

  //Method to create a new "SailingEvent"
  //Adds a new post to the Posts database with the name, date, and length of the event
  createPost(event) {
      event.preventDefault();
      var type = 'SailingEvent';
      var date = document.getElementById("postDate").value;
      var time = document.getElementById("duration").value;
      var eventTitle = document.getElementById("postEventTitle").value;

      Meteor.call('posts.insert', null, null, type, date, time, eventTitle, null, null, null, null, null, (error) => {
          if (error) {
              alert(error.reason);
          } else {
              swal("Event created successfully.");
          }
      });

      event.target.reset();
  }

  //Renders the list of "SailingEvent"s that have been created by admin users.
  //Returns Post.jsx elements as HTML
  renderEvents() {

      var text = [];
      let postsToDisplay = Posts.find({ type: { $in: ['SailingEvent'] }}, {sort: {date: 1}}).fetch();
      var removalDate = new Date();
      return postsToDisplay.map((post) => {
          var dayMonthYear = post.date.split('/');
          var postDate = new Date(dayMonthYear[2], dayMonthYear[0] - 1, dayMonthYear[1], 0, 0);
          postDate.setDate(postDate.getDate() + 1);
          if (postDate.getTime() < removalDate.getTime())
              return;
          return (
              <div class="event">
                  <Post key={post._id} post={post} role={ Profiles.findOne({ accountId: Meteor.user()._id }).member }/>

              </div>
          );
      });
  }

  //Renders the list of all user profiles
  //Returns Profile.jsx elements as HTML
  renderProfiles() {
    var text = [];
    let profilesToDisplay = Profiles.find({deletedAt: null}).fetch();
    return profilesToDisplay.map((profile) => {
      return (
        <div class="profile">
          <Profile key ={profile._id} profile={profile} role= {Profiles.findOne({ accountId: Meteor.user()._id}).member }/>
          <br/>
        </div>

      );
    });
  }

  render() {

    return (

      <div>
        <h3 class="pageHead">Admin Page</h3>
          <div className="row">

          <div class="col-md-4">
                <div class="inner">
                    {/*Events section.  Populated by renderEvents()*/}
                    <h4 class="heading">All Events</h4>
                      <div class="scroll">
                        {this.renderEvents()}
                      </div>

                </div>
          </div>
          {/*Form for admins to create new "SailingEvent"*/}
          <div class="col-md-4">
            <div class="inner">
              <button id="createPostButton" type="button" onClick={this.changeCreatePostView}>Add New Event</button>
              <form id="createPost" onSubmit={this.createPost.bind(this)} hidden="hidden">
                  <input id="postEventTitle" type="text" placeholder="Event Title" required/><br /><br />
                  <input id="postDate" type="date" placeholder="Date" required/><br /><br />
                  <input id="duration" type="number" placeholder="Length of Event (days)" required/> <br/> <br/>
                  <input id="postSubmit" type="submit" value="Create New Event" />
              </form>
            </div>
          </div>


          <div class="col-md-4">
            <div class="inner">
              {/*Profiles section.  Populated by renderProfiles()*/}
              <h4 class="heading">Users</h4>
              <div class="scroll">
                {this.renderProfiles()}
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
};
export default createContainer(() => {
    Meteor.subscribe('profiles');
    Meteor.subscribe('posts');
  return {
      user: Meteor.user(),
      posts: Posts.find({}, { sort: { date: 1 } } ).fetch(),
    }
}, AdminPage);

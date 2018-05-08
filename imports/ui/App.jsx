//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Creates new user profile with member type
//  specific details such as skills for GSC members and
//  boat type for LMYRA members.  Once created, based on the
//  user's member type either the GSC, LMYRA or Admin page is
//  displayed.
//
//  Note: the member will only be able to create a GSC or
//     LMYRA account.  If the client would like to grant
//     another member 'admin' access they will be able to
//     modify the user's member type.
//
// Last Modified: 4/30/2018
// Last Modified By:  Katie Austin
//*******************************************************************************************************************

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Mongo} from 'meteor/mongo';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Profiles } from '../api/profiles.js';
import { Posts } from '../api/posts.js';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import GscPage from './pages/Gsc.js';
import LmyraPage from './pages/Lmyra.js';
import AdminPage from './pages/admin.js';
import UserProfilePage from './pages/Profiles.js';
import YouTube from 'react-youtube';
class App extends Component {

constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
      isFormValid: true,
    };
}

// logs the user out of the application
handleSubmit(event) {
      Meteor.logout();
}

// shows or hides the form fields based on member type
showHideFormFields(event) {
  var memberType = document.getElementById("member").value;
  if (memberType == 'LMYRA') {
      document.getElementById("skills").classList.add("hidden");
      document.getElementById("boatinfo").classList.remove("hidden");
    //document.getElementById("boatinfo").style.visibility="visible";
  } else {
      document.getElementById("skills").classList.remove("hidden");
      document.getElementById("boatinfo").classList.add("hidden");
  }
}

// returns the post records
renderPosts() {
    var text = [];
    let postsToDisplay = this.props.posts;
    return postsToDisplay.map((post) => {
        <h5>Post:</h5>
        return (
            <ul>
                <li>{Posts.findOne(post).accountId}</li>
                <li>{Posts.findOne(post).date}</li>
                <li>{Posts.findOne(post).boatType}</li>
                <li>{Posts.findOne(post).division}</li>
                <li>{Posts.findOne(post).comments}</li>
            </ul>
            );
  });
}

// updates the user profile fields
updateProfile(event) {
    event.preventDefault();
    var first = document.getElementById("first").value;
    var last = document.getElementById("last").value;
    var memberType = document.getElementById("member").value;
    var phone = document.getElementById("phone").value;
    var s1 = document.getElementById("skillone").value;
    var s2 = document.getElementById("skilltwo").value;
    var s3 = document.getElementById("skillthree").value;
    var s4 = document.getElementById("skillfour").value;
    var s5 = document.getElementById("skillfive").value;

    if (document.getElementById("member").value == "GSC" | document.getElementById("member").value == "ADMIN") {
      var boatType = "NA";
    } else {
      var boatType = document.getElementById("boattype").value;
    }

    var createDate = document.getElementById("createdate").value;

    // create user account is form entries are validated
    if (this.state.isFormValid) {
      Meteor.call('profiles.insert', first, last, memberType, Meteor.user().emails[0].address, phone, s1, s2, s3, s4, s5, boatType, createDate, null, null, false);
    }
   let userId = Meteor.userId();
}

// main method
render() {

    // youtube player options
    // https://developers.google.com/youtube/player_parameters
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 1
      }
    };

    // returns the form for the user to complete for account creation
    return (

      <div className="custom-container container-fluid">
            {this.props.currentUser != null && Profiles.find({ accountId: Meteor.user()._id }).count() == 0 ?
                <div id="create-profile">
                  <form id="create" onSubmit={this.updateProfile.bind(this)}>
                    <span class="profile-form">First Name <input id="first" type="text" pattern="[A-Za-z]{1,10}" required></input></span>
                    <span class="profile-form">Last Name <input id="last" type="text" pattern="[A-Za-z]{3,25}" required></input></span>
                    <span class="profile-form">Member Type <select id="member" type="text" onClick={this.showHideFormFields} required>
                        <option value="GSC">GSC</option>
                        <option value="LMYRA">LMYRA</option>
                    </select></span><br />
                    <span class="profile-form">Phone Number (in the form xxx-xxx-xxxx) <input id="phone" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" maxLength="12" required></input></span>
                    <br />
                    <div id="skills">
                      <span class="profile-form">
                      Indicate your experience level for each of the skills below:<br />
                        Jib Trim:
                        <select id="skillone" type="text" required>
                          <option value="None">None</option>
                          <option value="Novice">Novice</option>
                          <option value="Experienced">Experienced</option>
                        </select>
                        Main Trim:
                        <select id="skilltwo" type="text" required>
                          <option value="None">None</option>
                          <option value="Novice">Novice</option>
                          <option value="Experienced">Experienced</option>
                        </select>
                        Spinnaker Trim:
                        <select id="skillthree" type="text" required>
                          <option value="None">None</option>
                          <option value="Novice">Novice</option>
                          <option value="Experienced">Experienced</option>
                        </select>
                        Foredeck:
                        <select id="skillfour" type="text" required>
                          <option value="None">None</option>
                          <option value="Novice">Novice</option>
                          <option value="Experienced">Experienced</option>
                        </select>
                        Other skill(s):
                        <input id="skillfive" type="text"></input>
                      </span>
                    </div>
                    <div id="boatinfo" class="hidden">
                      <span class="profile-form">
                        If you own a boat, enter the boat type: <input id="boattype" type="text"></input>
                      </span>
                    </div>
                    <br />
                    <div id="timestamps" class="hidden">
                      <input id="createdate" type="date" value=""></input>
                      <input id="updatedate" type="date" value=""></input>
                      <input id="deletedate" type="date" value=""></input>
                    </div>
                    <span class="profile-form"><input type="submit" value="Submit" /></span>
                    </form>
                </div> : this.props.currentUser == null ?

                // information dislayed on the home page before the user logs into the application
                <div class="inner">
                        <h1 class="main">Where the Gamecock Sailing Club and LMYRA connect</h1><br/><br/>
                        <h1 class="main">To create a new account, select Sign In/Join.  Enter your email address and a password to use, select Create Account and then fill out form with your information.
                            Once the Admin approves your account, you will be taken to your respective home page.</h1>
                        <h1 class="main">To log into an existing account, select Sign In/Join and enter your username and password.</h1><br/>
                        <br />
                        <h1 class="main">GSC members can match with LMYRA members by accepting their requests for help or by submitting their own request for a particular day</h1>
                        <h1 class="main">LMYRA members can connect with GSC members by submitting requests or directly matching with those who have made themselves available.</h1>
                        <h1 class="main">Admin manages Club events and Accounts.</h1><br/>
                        <h1 class="main">Watch a quick video that walks you through our web application</h1><br/>
                        <center>
                          <YouTube
                            videoId="NnJT7v9MGu8"
                            opts={opts}
                            onReady={this._onReady}
                          /> <br/>
                        	<img src="admin.jpg" alt="admin" width="600"/> <br/>
                        	<img src="GSC.png" alt="gsc" width="600" /> <br/>
                        	<img src="lmyra.jpg" alt="lmyra" width="600"/> <br/>
                        </center>
                </div>
                    // used to render page information based on user member type logged in
                        :
                    !Profiles.findOne({ accountId: Meteor.user()._id }).activated && Profiles.findOne({ accountId: Meteor.user()._id }).member != 'ADMIN' ?
                        <div class="inner">
                            <h1 class="main">Your account is currently Deactivated</h1>
                            <h1 class="main">If this is a new account, please wait for the Admin to approve your account.</h1>
                            <h1 class="main">When your account is activated, you will receive an email from gamecocksailingclubapp@gmail.com.</h1>
                            <h1 class="main">Please check your spam folder for this email if you do not receive a response soon</h1>
                            <h1 class="main">If you believe this is an error, please contact the Admin with your account information</h1>
                        </div> :
                    Profiles.findOne({ accountId: Meteor.user()._id }, { member: 1 }).member == "GSC" ?
                        <div id="profile">
                            <GscPage />
                        </div>
                        : Profiles.findOne({ accountId: Meteor.user()._id }, { member: 1 }).member == "LMYRA" ?
                            <div id="profile">
                              <LmyraPage />
                            </div>
                            : Profiles.findOne({ accountId: Meteor.user()._id }, { member: 1 }).member == "ADMIN" ?
                                <div id="profile">
                                  <AdminPage />
                                </div> : < form id="logout" onSubmit={this.handleSubmit.bind(this)}>
                                    <input type="submit" value="Logout" />
            </form>}
      </div>
    );
    }

    // youtube player actions when the home page loads
    _onReady(event) {
      //event.target.playVideo();  // video starts when home page loads
      //event.target.pauseVideo();  // video paused when home page loads
      event.target.stopVideo();  // video in a stopped mode when home page loads
    }
}

App.propTypes = {
  profiles: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('profiles');
  Meteor.subscribe('posts');

  return {
    currentUser: Meteor.user(),
    count: Profiles.find({}).count(),
    profiles: Profiles.find({}, { sort: { createdAt: - 1 } }).fetch(),
    posts: Posts.find({}, { sort: { createdAt: - 1 } }).fetch()
  };
}, App);

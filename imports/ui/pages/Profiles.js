//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Used to manage member account (profile) data.
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
export class UserProfilePage extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });

    if ([name] == "firstName")
      {
        Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.firstName": value }});
      }
      else {
        Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.lastName": value }});
      }
  }

  renderPosts() {
      var text = [];
      let postsToDisplay = this.props.posts;
      return postsToDisplay.map((post) => {
          return (
              <ul class="normal">
                  <li>{Posts.findOne(post).accountId}</li>
                  <li>{Posts.findOne(post).date}</li>
                  <li>{Posts.findOne(post).boatType}</li>
                  <li>{Posts.findOne(post).division}</li>
                  <li>{Posts.findOne(post).comments}</li>
                  <br></br>
                  <br></br>
              </ul>
          );
      });
      /*for (i=0; i < Posts.find({}).count(); i++) {
        text.push("Post " +(i+1)+ ": ")
        text.push(<ul><li>{Posts.findOne({ accountId: Meteor.user()._id }, {skip: i}).accountId}</li>
        <li>{Posts.findOne({ accountId: Meteor.user()._id }, {skip: i}).date}</li>
        <li>{Posts.findOne({ accountId: Meteor.user()._id }, {skip: i}).boatType}</li>
        <li>{Posts.findOne({ accountId: Meteor.user()._id }, {skip: i}).division}</li>
        <li>{Posts.findOne({ accountId: Meteor.user()._id }, {skip: i}).comments}</li></ul>)


    }
      return text;*/
  }

  changeCreatePostView() {
      if (document.getElementById("createPost").hidden)
          document.getElementById("createPostButton").innerHTML = "Hide Create Post";
      else
          document.getElementById("createPostButton").innerHTML = "Create Post";
      document.getElementById("createPost").hidden = !document.getElementById("createPost").hidden;
  }

  createPost(event) {
      event.preventDefault();
      var date = document.getElementById("postDate").value;
      var boatType = document.getElementById("postBoatType").value;
      var division = document.getElementById("postDivision").value;
      var comments = document.getElementById("postComments").value;
      Meteor.call('posts.insert', date, boatType, division, comments);
  }

  render() {
    // if (this.props.user) {
    //    this.state.firstName = this.props.user.profile.firstName;
    //    this.state.lastName = this.props.user.profile.lastName;
    // }
    return (
      <div>
            <h1>User Profile</h1>
          <div className="page-content">
          <div class="column">
                    <h3>First Name: {Profiles.findOne({ accountId: Meteor.user()._id }).first}</h3>
                    <h3>Last Name: {Profiles.findOne({ accountId: Meteor.user()._id }).last}</h3>
                    <h3>Member Type: {Profiles.findOne({ accountId: Meteor.user()._id }).member}</h3>
                    <h3>Email: {Profiles.findOne({ accountId: Meteor.user()._id }).email}</h3>
                    <h3>Phone Number: {Profiles.findOne({ accountId: Meteor.user()._id }).phone}</h3>

                    <br/><br/>
                    <hr></hr>
                    <h3>Jib Trim: {Profiles.findOne({ accountId: Meteor.user()._id }).skillone}</h3>
                    <h3>Main Trim: {Profiles.findOne({ accountId: Meteor.user()._id }).skilltwo}</h3>
                    <h3>Spinnaker Trim: {Profiles.findOne({ accountId: Meteor.user()._id }).skillthree}</h3>
                    <h3>Foredeck: {Profiles.findOne({ accountId: Meteor.user()._id }).skillfour}</h3>
                    <h3>Other: {Profiles.findOne({ accountId: Meteor.user()._id }).skillfive}</h3>

          </div>
          <div class="column">

            <header>
              <h3>Rate this member</h3>

              <form class="new-rating">
              <label for="fname">First Name</label>
                <input type="text" id="fname" name="firstname" placeholder="Your first name"/>
              <label for="lname">Last Name</label>
                <input type="text" id="lname" name="lastname" placeholder="Your last name.."/>

                <label for="rating">Star Rating</label>
                  <select id="rating" name ="rating">
                    <option value="1star">*</option>
                    <option value="2star">**</option>
                    <option value="3star">***</option>
                    <option value="4star">****</option>
                    <option value="5star">*****</option>
                  </select>
                <input type="text" name="text" placeholder="How was this member?" />
              </form>
            </header>

          </div>


          <br/><br/>
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
}, UserProfilePage);

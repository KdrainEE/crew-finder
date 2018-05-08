//**************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Used to collect and manage user's profile data
//    It also provides a way for the admin to update the user's
//    member type.
//
// Last Modified: 4/30/2018
// Last Modified By:  Katie Austin
//**************************************************************

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Profiles } from '../api/profiles.js';
import swal from 'sweetalert';

export default class Profile extends Component {


  //Sets the member type dropdown for the edit form to the member's current member type
  editProfile() {
      var toShow = this.props.profile._id;
      document.getElementById(toShow).hidden = !document.getElementById(toShow).hidden;

      var editMemberType = "editMemberType-" + this.props.profile._id;

      document.getElementById(editMemberType).value = this.props.profile.member;

  }

  //Method to delete profile information
  //Calls the Profiles database's "delete" function
  deleteProfile() {
      swal("Are you sure you want to delete this profile?  This email will no longer be usable by anybody.", { buttons: { Yes: "Yes", No: "No" } })
          .then((value) => {
              if (value == "Yes") {
                  Meteor.call('profiles.delete', this.props.profile._id);
              }
          });
  }

  //Submits the edit to a user's member type
  submitEdit(event) {
      event.preventDefault();

      var editMemberType = "editMemberType-" + this.props.profile._id;


      var newMemberType = document.getElementById(editMemberType).value;
          Profiles.update(this.props.profile._id, {
              $set: {
                  member: newMemberType
              }
          });

      swal("Member type successfully updated");

      this.cancelEdit();
  }

  //Hides the profile edit form
  cancelEdit() {
      var toHide = this.props.profile._id;
      document.getElementById(toHide).hidden = !document.getElementById(toHide).hidden;
  }

  //Method to activate a new or deactivated account
  //Changes "activated" to true
  //Sends an email notifying the user their account has been activated
  activateProfile() {
      var today = new Date();
      var updatedDateToInsert = today.getMonth() + "/" + today.getDay() + "/" + today.getYear();
      swal("Are you sure you want to Activate this account?", { buttons: { Yes: "Yes", No: "No" } })
          .then((value) => {
              if (value == "Yes") {
                  Profiles.update(this.props.profile._id, {
                      $set: {
                          activated: true, updatedAt: updatedDateToInsert
                      }
                  });
                  Meteor.call('profiles.sendemail', this.props.profile.email, true);
              }
          });
  }

  //Method to deactivate a profile
  //Updates the profile to have "activated" be false
  //Sends an email notifying the user their account has been activated
  deactivateProfile() {
      var today = new Date();
      var updatedDateToInsert = today.getMonth() + "/" + today.getDay() + "/" + today.getYear();
      swal("Are you sure you want to Deactivate this account?", { buttons: { Yes: "Yes", No: "No" } })
          .then((value) => {
              if (value == "Yes") {
                  Profiles.update(this.props.profile._id, {
                      $set: {
                          activated: false, updatedAt: updatedDateToInsert
                      }
                  });
                  Meteor.call('profiles.sendemail', this.props.profile.email, false);
              }
          });
  }

  render() {

    var editFirstName = "editFirstName-" + this.props.profile._id;
    var editLastName = "editLastName-" + this.props.profile._id;
    var editMemberType = "editMemberType-" + this.props.profile._id;
    var editEmail = "editEmail-" + this.props.profile._id;
    var editPhone = "editPhone-" + this.props.profile._id;
    var editSkill1 = "editSkill1" + this.props.profile._id;
    var editSkill2 = "editSkill2" + this.props.profile._id;
    var editSkill3 = "editSkill3" + this.props.profile._id;
    var editSkill4 = "editSkill4" + this.props.profile._id;
    var editSkill5 = "editSkill5" + this.props.profile._id;
    var editBoatType = "editBoatType" + this.props.profile._id;
    var editProfileSubmit = "editProfileSubmit-" + this.props.profile._id;
    var editProfileCancel = "editProfileCancel-" + this.props.profile._id;

    return (
      <div className= "post">

            <span className="text">
              <div class="line">
                <div class="col-25">First Name:</div>
                <div class="col-75">{this.props.profile.first} <br /></div>
              </div>
              <div class="line">
                <div class="col-25">Last Name:</div>
                <div class="col-75">{this.props.profile.last}<br /></div>
              </div>
              <div class="line">
                <div class="col-25">Member Type:</div>
                <div class="col-75">{this.props.profile.member}

                <br /></div>
              </div>
              <div class="line">
                <div class="col-25">Email:</div>
                <div class="col-75">{this.props.profile.email} <br /></div>
              </div>
              <div class="line">
                <div class="col-25">Phone:</div>
                <div class="col-75">{this.props.profile.phone} <br /></div>
              </div>
              {this.props.profile.member == 'GSC' ?
                  <div>
                  <div class="line">
                      <div class="col-25">Jib Trim:</div>
                      <div class="col-75">{this.props.profile.skillone} <br /></div>
                  </div>
                  <div class="line">
                      <div class="col-25">Main Trim:</div>
                      <div class="col-75">{this.props.profile.skilltwo} <br /></div>
                  </div>
                  <div class="line">
                      <div class="col-25">Spinnaker:</div>
                      <div class="col-75">{this.props.profile.skillthree} <br /></div>
                  </div>
                  <div class="line">
                      <div class="col-25">Foredeck:</div>
                      <div class="col-75">{this.props.profile.skillfour} <br /></div>
                  </div>
                  <div class="line">
                      <div class="col-25">Other:</div>
                      <div class="col-75">{this.props.profile.skillfive} <br /></div>
                  </div> </div> : ""}
              {this.props.profile.member == 'LMYRA' ?
                    <div class="line">
                        <div class="col-25">Boat Type:</div>
                        <div class="col-75">{this.props.profile.boattype} <br/> </div>
                    </div> : ""}

              <br/>
              {/*Admin buttons shown on profiles depending on whether the account is activated or not*/}
              {this.props.role == "ADMIN" && this.props.profile.email != "gamecocksailingclubapp@gmail.com" ? (
                    <button class="edit" onClick={this.editProfile.bind(this)} value={this.props.profile._id}>
                        Edit
                    </button>
                ) : ""}
              {this.props.role == "ADMIN" && this.props.profile.member != "ADMIN" && this.props.profile.activated ? (
                  <button class="deactivate" onClick={this.deactivateProfile.bind(this)}>
                      Deactivate
                    </button>
              ) : ""}
              {this.props.role == "ADMIN" && this.props.profile.member != "ADMIN" && !this.props.profile.activated ? (
                    <button class="approve" onClick={this.activateProfile.bind(this)}>
                        Activate
                    </button>
              ) : ""}
              {this.props.role == "ADMIN" && this.props.profile.member != "ADMIN" && !this.props.profile.activated ? (
                  <button class="delete" onClick={this.deleteProfile.bind(this)}>
                      Delete
                    </button>
              ) : ""}
            </span>
            <br />
            {/*Form for the admin to edit a member's user type*/}
            <form id={this.props.profile._id} onSubmit={this.submitEdit.bind(this)} hidden>

                    <h4>Member Type</h4>
                    <select id={editMemberType} type="text" placeholder="Member Type" defaultValue={this.props.profile.member} required >
                    <option value="GSC">GSC</option>
                    <option value="LMYRA">LMYRA</option>
                    <option value="ADMIN">ADMIN</option>
                    </select>

                <input id={editProfileSubmit} type="submit" value="Save"/>
                <input id={editProfileCancel} type="button" value="Cancel" onClick={this.cancelEdit.bind(this)} /> <br/> <br/>
            </form>
      </div>
    );
  }
}

Profile.propTypes =
{
    profile: PropTypes.object.isRequired,
    role: PropTypes.object.isRequired,

};

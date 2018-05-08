//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Enables GSC members to modify their
//    own profile information.
//
// Last Modified: 4/30/2018
// Last Modified By:  Jimmy Lin
//************************************************************

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Profiles } from '../api/profiles.js';
import swal from 'sweetalert';

export default class GSCProfile extends Component {


  //Edits the profile based on the GSC account user
  editProfile() {
    var toShow = this.props.profile._id;
    document.getElementById(toShow).hidden = !document.getElementById(toShow).hidden;

    document.getElementById("first").value = this.props.profile.first;
    document.getElementById("last").value = this.props.profile.last;
    document.getElementById("phone").value = this.props.profile.phone;
    document.getElementById("editSkill1").value = this.props.profile.skillone;
    document.getElementById("editSkill2").value = this.props.profile.skilltwo;
    document.getElementById("editSkill3").value = this.props.profile.skillthree;
    document.getElementById("editSkill4").value = this.props.profile.skillfour;
    document.getElementById("editSkill5").value = this.props.profile.skillfive;
  }



  //Submits profile referring to the GSC account page
  submitEdit(event) {
      event.preventDefault();

      var newFirst = document.getElementById("first").value;
      var newLast = document.getElementById("last").value;
      var newPhone = document.getElementById("phone").value;
      var newSkill1 = document.getElementById("editSkill1").value;
      var newSkill2 = document.getElementById("editSkill2").value;
      var newSkill3 = document.getElementById("editSkill3").value;
      var newSkill4 = document.getElementById("editSkill4").value;
      var newSkill5 = document.getElementById("editSkill5").value;
      Profiles.update(this.props.profile._id, {
      $set: {
          first: newFirst, last: newLast, phone: newPhone,
          skillone: newSkill1, skilltwo: newSkill2, skillthree: newSkill3,
          skillfour: newSkill4, skillfive: newSkill5
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




  render() {

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
                <div class="col-25">Email:</div>
                <div class="col-75">{this.props.profile.email} <br /></div>
              </div>
              <div class="line">
                <div class="col-25">Phone:</div>
                <div class="col-75">{this.props.profile.phone} <br /></div>
              </div>
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
                  </div> </div>

              <br/>
              {/*Edit buttons shown on GSC profile*/}
              {this.props.role == "GSC" && this.props.profile.member !="LMYRA" && this.props.profile.member !="ADMIN" ? (
                    <button class="edit" onClick={this.editProfile.bind(this)} value={this.props.profile._id}>
                        Edit
                    </button>

              ) : ""}
            </span>
            <br />
            {/*Form for the GSC user to edit their own profile*/}
            <form id={this.props.profile._id} onSubmit={this.submitEdit.bind(this)} hidden>
                <br />
                <div class="col-25" style={{ color: "black" }}>First Name:</div>
                <input id="first" type="text" pattern="[A-Za-z]{1,10}" required/>
                <div class="col-25" style={{ color: "black" }}>Last Name:</div>
                <input id="last" type="text" pattern="[A-Za-z]{3,25}" required/>
                <div style={{ color: "black" }}>Phone Number:</div>
                <input id="phone" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" maxLength="12" required/>
                <span class="profile-form">
                Jib Trim:
                <select id="editSkill1" type="text" defaultValue={this.props.profile.skillone} required>
                  <option value="None">None</option>
                  <option value="Novice">Novice</option>
                  <option value="Experienced">Experienced</option>
                </select>
                Main Trim:
                <select id="editSkill2" type="text" defaultValue={this.props.profile.skilltwo} required>
                  <option value="None">None</option>
                  <option value="Novice">Novice</option>
                  <option value="Experienced">Experienced</option>
                </select>
                Spinnaker Trim:
                <select id="editSkill3" type="text" defaultValue={this.props.profile.skillthree} required>
                  <option value="None">None</option>
                  <option value="Novice">Novice</option>
                  <option value="Experienced">Experienced</option>
                </select>
                Foredeck:
                <select id="editSkill4" type="text" defaultValue={this.props.profile.skillfour} required>
                  <option value="None">None</option>
                  <option value="Novice">Novice</option>
                  <option value="Experienced">Experienced</option>
                </select>
                Other skill(s):
                <input id="editSkill5" type="text" defaultValue={this.props.profile.skillfive} ></input>
                </span>
                <input id="editProfileSubmit" type="submit" value="Save"/>
                <input id="editProfileCancel" type="button" value="Cancel" onClick={this.cancelEdit.bind(this)} /> <br/> <br/>
            </form>
      </div>
    );
  }
}

GSCProfile.propTypes =
{
    profile: PropTypes.object.isRequired,
    role: PropTypes.object.isRequired,

};

//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Enables LMYRA members to modify their
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

export default class LMYRAProfile extends Component {


  //Edits the profile based on the GSC account user
  editProfile() {
    var toShow = this.props.profile._id;
    document.getElementById(toShow).hidden = !document.getElementById(toShow).hidden;

    document.getElementById("first").value = this.props.profile.first;
    document.getElementById("last").value = this.props.profile.last;
    document.getElementById("phone").value = this.props.profile.phone;
    document.getElementById("boattype").value = this.props.profile.boattype;

  }



  //Submits profile referring to the GSC account page
  submitEdit(event) {
      event.preventDefault();

      var newFirst = document.getElementById("first").value;
      var newLast = document.getElementById("last").value;
      var newPhone = document.getElementById("phone").value;
      var newBoatType = document.getElementById("boattype").value;

      Profiles.update(this.props.profile._id, {
      $set: {
          first: newFirst, last: newLast, phone: newPhone,
          boattype: newBoatType

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
              <div class="line">
                <div class="col-25">Boat Owned:</div>
                  <div class ="col-75">{this.props.profile.boattype} <br />

              </div>
              </div>


              <br/>
              {/*Edit buttons shown on GSC profile*/}
              {this.props.role == "LMYRA" && this.props.profile.member !="GSC" && this.props.profile.member !="ADMIN" ? (
                    <button class="edit" onClick={this.editProfile.bind(this)} value={this.props.profile._id}>
                        Edit
                    </button>

              ) : ""}
            </span>
            <br />
            {/*Form for the LMYRA user to edit their own profile*/}
            <form id={this.props.profile._id} onSubmit={this.submitEdit.bind(this)} hidden>
                <br />
                <div class="col-25" style={{ color: "black" }}>First Name:</div>
                <input id="first" type="text" pattern="[A-Za-z]{1,10}" required/>
                <div class="col-25" style={{ color: "black" }}>Last Name:</div>
                <input id="last" type="text" pattern="[A-Za-z]{3,25}" required/>
                <div class="col-25" style={{ color: "black" }}>Phone Number:</div>
                <input id="phone" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" maxLength="12" required/>
                <div class="col-25" style={{ color: "black" }}>Boat Owned:</div>
                <input id="boattype" type="text" required/>
                <input id="editProfileSubmit" type="submit" value="Save"/>
                <input id="editProfileCancel" type="button" value="Cancel" onClick={this.cancelEdit.bind(this)} /> <br/> <br/>
            </form>
      </div>
    );
  }
}

LMYRAProfile.propTypes =
{
    profile: PropTypes.object.isRequired,
    role: PropTypes.object.isRequired,

};

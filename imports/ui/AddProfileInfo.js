//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Used to insert a new user profile record in
//    the database.
//
// Last Modified: 4/30/2018
// Last Modified By:  Katie Austin
//************************************************************

import React from 'react';
import { Profiles } from './../api/profiles.js';

export default class AddProfileInfo extends React.Component{
  handleSubmit(event){
    let profileName = event.target.profileName.value;
    let firstName = event.target.profileName.value;
    let lastName = event.target.profileName.value;
    let memberType = event.target.profileName.value;
    let email = event.target.profileName.value;
    let phone = event.target.profileName.value;
    let dob = event.target.profileName.value;
    let city = event.target.profileName.value;
    let state = event.target.profileName.value;
    let zip = event.target.profileName.value;

    event.preventDefault();

    // if (Profiles.find({ accountId: Meteor.user()._id }).count() != 0)
    // {
    //     throw new Meteor.Error('this account already has profile info');
    // }

    if(profileName){
      event.target.profileName.value='';
      Profiles.insert({
        name: profileName,
        firstname: firstName,
        lastname: lastName,
        membertype: memberType,
        emailAdd: email,
        phoneNum: phone,
        birthDate: dob,
        memCity: city,
        memState: state,
        memZip: zip
      });
    }
  }

  render(){
    return(
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input type = "text" name="profileName" placeholder = "Profile Name"/>
        <input type = "text" name="firstName" placeholder = "First Name"/>
        <input type = "text" name="lastName" placeholder = "Last Name"/>
        <input type = "text" name="memberType" placeholder = "Member Type"/>
        <input type = "text" name="email" placeholder = "Email"/>
        <input type = "text" name="phone" placeholder = "Phone Number"/>
        <button>Update Profile</button>
      </form>
    );
  }
}

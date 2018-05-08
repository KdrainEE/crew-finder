//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Used to create new accounts.
//
// Last Modified: 4/30/2018
// Last Modified By:  Katie Austin
//************************************************************

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

export default class AccountsUIWrapper extends Component {
  componentDidMount()
  {
    this.view = Blaze.render(Template.loginButtons,
      ReactDOM.findDOMNode(this.refs.container));
  }

  componentWillUnmount()
  {
    Blaze.remove(this.view);
  }

  render()
  {
  return <span ref="container" id="test2" />;
  }

}

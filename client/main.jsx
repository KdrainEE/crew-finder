//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Used to start the application and display
//    the home page.
//
// Last Modified: 4/30/2018
// Last Modified By:  Katie Austin
//************************************************************

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import '../imports/startup/accounts-config.js';
import App from '../imports/ui/App.jsx';

Meteor.startup(() => {
      render(<App />, document.getElementById('render-target'));
});

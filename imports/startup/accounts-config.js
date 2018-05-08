//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Used to establish account config settings.
//
// Last Modified: 4/30/2018
// Last Modified By:  Katie Austin
//************************************************************

import { Accounts } from 'meteor/accounts-base';

  Accounts.ui.config({
     passwordSignupFields: 'EMAIL_ONLY',

});

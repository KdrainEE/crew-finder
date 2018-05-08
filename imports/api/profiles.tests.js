//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Used for profile unit testing.
//
// Last Modified: 4/30/2018
// Last Modified By:  Katie Austin
//************************************************************

 import { Meteor } from 'meteor/meteor';
 import { Random } from 'meteor/random';
 import { assert } from 'meteor/practicalmeteor:chai';
 import { Profiles } from './profiles.js';

 if(Meteor.isServer)
 {
   describe('Profiles', () => {
     describe('methods', () => {
       const userId = Random.id();
       let profileId;

       beforeEach(() =>{
         Profiles.remove({});
         profileId = Profiles.insert({
           accountId: userId,
           first: "First",
           last: "Last",
           member: "Admin",
           email: "firstlast@email.com",
           phone: "(555) 555-5555",
         });
       });

       it('profile created', () => {
         //const deleteTask = Meteor.server.method_handlers['tasks.remove'];

         //const invocation = { userId };

         //deleteTask.apply(invocation, [taskId]);

         assert.equal(Profiles.find().count(), 1);
       });
     });
   });
 }

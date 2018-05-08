**STEPS TO RUN THE APPLICATION**
1. Download Meteor
  * Windows:
    * Install Chocolatey from chocolatey.org/install
    * Using an administrator command prompt, type "choco install meteor"
  * Mac:
    * Using terminal, type "curl https://install.meteor.com/ | sh"
2. In command prompt/terminal in the folder where the files are located:
  * meteor npm install babel
  * meteor npm install --save babel-runtime
  * meteor add accounts-ui-unstyled
  * meteor add jamielob:accounts-ui-no-dropdown
  * npm install sweetalert --save
  * meteor npm install --save react-youtube
  * meteor npm install --save nodemailer
  * meteor

**UNIT TEST INSTRUCTIONS**

To perform unit testing, you will first need to install:
  1. meteor add meteortesting:mocha
  2. meteor npm install --save-dev chai
  3. meteor add practicalmeteor:chai

Once installed, run the below from a command prompt in the application folder:
  * meteor test --driver-package meteortesting:mocha

There are three test files:
  * core.tests.js
  * posts.tests.js
  * profiles.test.js

**BEHAVIOR TEST INSTRUCTIONS**

To perform behavior testing, you will first need to install:
  1. npm install --global chimp

Once installed, run the below from a command prompt in the application root folder:
  * Run 'meteor npm run chimp-watch'.
  * Run 'meteor test --full-app --driver-package tmeasday:acceptance-test-driver'.

**HOW TO DEPLOY (from Linux or macOS)**
 * add admin username and password to settings.json (included, but username and password have been removed)  for the mlab database,
   replacing the <dbuser> with your username, and the <dbpassword> with your password
 * Next, run from the code directory:

   DEPLOY_HOSTNAME=galaxy.meteor.com meteor deploy teamsailing.meteorapp.com --settings <settings.json location>
 * at this point you'll be asked for your username and password, use the site administrator username and password (not the same as the admin role on the website) This information will be given to the administrator.

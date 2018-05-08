//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
// Description: Used for post testing. 
//
// Last Modified: 4/30/2018
// Last Modified By:  Katie Austin
//************************************************************

function countPosts()
{
  browser.waitForVisible('.postSubmit',10000);
  const elements = browser.elements('.postSubmit');
  return elements.value.length;
};

describe ('list ui', function() {
  beforeEach(function (){
    browser.url('http://localhost:3000');

  });

  it('can create a post @watch', function ()
{
  const initialCount = countPosts();
  browser.click('.js-new-post');

  assert.equal(countPosts(), initialCount + 1);
});

});

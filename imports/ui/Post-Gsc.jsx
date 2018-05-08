//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Used to display events for GSC members.
//
// Last Modified: 4/30/2018
// Last Modified By:  Katie Austin
//************************************************************

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Posts } from '../api/posts.js';

export default class Post extends Component {
  togglePrivate()
  {
    //Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }

  render() {

    const postClassName = classnames({
    });

    return (
      <li className= {postClassName}>

            <span className="text">
                Date: {this.props.post.date}<br />
                Time: {this.props.post.time}<br />
                Event: {this.props.post.eventTitle} <br />
                Boat Type: {this.props.post.boatType} <br />
                Division: {this.props.post.division} <br />
                Position: {this.props.post.crewPosition} <br />
        </span>

        <br/>
      </li>
    );
  }
}

Post.propTypes =
{
post: PropTypes.object.isRequired,
//showPrivateButton: PropTypes.bool.isRequired,
};

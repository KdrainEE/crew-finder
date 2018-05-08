//************************************************************
// Author: Katie Austin, Jimmy Lin, Scott Rachwal,
//         Brandon Rader, Adam Yallum
// Date:   4/30/2018
//
// Description: Used to recover a member account password as 
//    requested.
//
// Last Modified: 4/30/2018
// Last Modified By:  Katie Austin
//************************************************************

import React from 'react';
import { Row, Col, Alert, FormGroup, FormControl, Button } from  'react-bootstrap';
import handleRecoverPassword from '../../modules/recover-password';

export default class RecoverPassword extends React.Component {
  componentDidMount(){
    handleRecoverPassword({component: this});
  }

  handleSubmit(e){
    e.preventDefault();
  }


  render(){
    return (
      <div className="RecoverPassword">
        <Row>
          <Col xs={ 12 } sm={ 6 } md={ 4 }>
            <h4 className="page-header">Recover Password</h4>
            <Alert bsStyle="info">
              Enter your email to receive a password reset link.
            </Alert>
            <form
                ref={ form => (this.recoverPasswordForm = form)}
                className="recover-password"
                onSubmit={ this.handleSubmit }
                >
                  <FormGroup>
                    <FormControl
                        type="email"
                        ref="emailAddress"
                        name="emailAddress"
                        placeholder="Email Address"
                      />
                  </FormGroup>
                  <Button type="submit" bsStyle="success">Recover Password</Button>
                </form>
          </Col>
        </Row>
      </div>
    );
  }
}

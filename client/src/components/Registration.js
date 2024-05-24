import React, { Component } from 'react';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthenticationHash from '../utils/AuthenticationHash';
import "../App.css";

class SignUp extends Component {
    state = {
        name: '',
        pufkey: '',
        response: '',
        alertMessage: '',
        status: '',
        signedUp: false
    }

    onSignUp = async () => {
        //this.setState({ signedUp: false });

        if (this.state.name !== '' && this.state.pufkey !== '') {
            let name = this.state.name.trim();
            let pufkey = this.state.pufkey.trim();
            //let response = this.state.response.trim();
            let crypto = require('crypto');
            let c  = name+pufkey;
            let response = crypto.createHash('sha256').update(c).digest('hex');

            //===
            if (pufkey.length < 8) {
                this.setState({
                    alertMessage: "at least 8 characters required",
                    status: 'failed',
                    pufkey: '',
                    response: '',
                });
                return;
            } else {

            } if (response.length < 6) {
                this.setState({
                    alertMessage: "at least 6 characters required",
                    status: 'failed',
                    response: ''
                });
                return
            } else {
                let userAddress = await this.props.contract.methods.getUserAddress()
                    .call({ from: this.props.account });

                if (userAddress !== '0x0000000000000000000000000000000000000000') {
                    this.setState({
                        alertMessage: 'this Device already exists',
                        status: 'failed',
                        name: '',
                        pufkey: '',
                        response: '',
                    });

                    return;
                } else {
                    let hash = await AuthenticationHash(name, this.props.account, pufkey, response, this.props.web3);

                    await this.props.contract.methods.register(hash).send({ from: this.props.account });

                    this.setState({
                        name: '',
                        pufkey: '',
                        response: '',
                        status: 'success',
                        alertMessage: "Registration Successfull \n" + "generated Response is = \n" + response,
                        signedUp: true
                    });

                    //window.alert("PUF-KEY is = " + response);

                    this.props.accountCreated(this.state.signedUp);
                    return;
                }
            }
        }

    }

    render() {
        return (
            <div className="sign-up">
                Device Registration
                <div className='signup-form'>
                    <Card fluid centered>
                        <Card.Content>
                            <Form size='large'>
                                {
                                    this.state.alertMessage !== '' && this.state.status === 'failed' ?
                                        <Message negative>
                                            {this.state.alertMessage}
                                        </Message> :
                                        this.state.alertMessage !== '' && this.state.status === 'success' ?
                                            <Message positive>
                                                {this.state.alertMessage}
                                            </Message> :
                                            console.log('')
                                }
                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='DeviceID'
                                        value={this.state.name}
                                        autoComplete="name"
                                        onChange={e => this.setState({ name: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='Challange'
                                        value={this.state.pufkey}
                                        autoComplete="current-pufkey"
                                        onChange={e => this.setState({ pufkey: e.target.value })}
                                    />
                                </Form.Field>
                                {/* <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='Response'
                                        value={this.state.response}
                                        autoComplete="response"
                                        onChange={e => this.setState({ response: e.target.value })}
                                    />
                                </Form.Field> */}
                                <Form.Field>
                                    <Button type='submit' primary fluid size='large' onClick={this.onSignUp}>
                                        Register
                                    </Button>
                                </Form.Field>
                            </Form>
                        </Card.Content>
                    </Card>
                </div>
            </div>
        );
    }
}

export default SignUp

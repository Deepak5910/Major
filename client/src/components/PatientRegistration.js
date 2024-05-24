import React, { Component } from 'react';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthenticationHash from '../utils/AuthenticationHash';
import "../App.css";

class PatientRegistration extends Component {
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
            let pufkey = this.state.paddress.trim()+this.state.pufkey.trim();
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
                        alertMessage: "Registration Successfull \n",
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
                Please Enter Your Details
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
                                        placeholder='UserName'
                                        value={this.state.name}
                                        autoComplete="name"
                                        onChange={e => this.setState({ name: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='Password'
                                        placeholder='Password'
                                        value={this.state.pufkey}
                                        autoComplete="current-pufkey"
                                        onChange={e => this.setState({ pufkey: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='email'
                                        placeholder='Email'
                                        value={this.state.email}
                                        autoComplete="email"
                                        onChange={e => this.setState({ email: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='Phone Number'
                                        value={this.state.phonenumber}
                                        autoComplete="phonenumber"
                                        onChange={e => this.setState({ phonenumber: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='number'
                                        placeholder='Age'
                                        value={this.state.age}
                                        autoComplete="age"
                                        onChange={e => this.setState({ age: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='Disease'
                                        value={this.state.specialty}
                                        autoComplete="specialty"
                                        onChange={e => this.setState({ specialty: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='Public Address'
                                        value={this.state.paddress}
                                        autoComplete="paddress"
                                        onChange={e => this.setState({ paddress: e.target.value })}
                                    />
                                </Form.Field>
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

export default PatientRegistration

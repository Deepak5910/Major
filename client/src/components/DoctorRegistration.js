import React, { Component } from 'react';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthenticationHash from '../utils/AuthenticationHash';
import { Link } from 'react-router-dom'; // Import Link from React Router
import "../App.css";

class DoctorRegistration extends Component {
    state = {
        name: '',
        password: '',
        email: '',
        phonenumber: '',
        specialty: '',
        paddress: '',
        alertMessage: '',
        status: '',
        signedUp: false
    }

    onSignUp = async () => {
        //this.setState({ signedUp: false });

        if (this.state.name !== '' && this.state.password !== '') {
            let name = this.state.name.trim();
            let password = this.state.paddress.trim() + this.state.password.trim();
            let crypto = require('crypto');
            let c = name + password;
            let response = crypto.createHash('sha256').update(c).digest('hex');

            //===
            if (password.length < 8) {
                this.setState({
                    alertMessage: "at least 8 characters required",
                    status: 'failed',
                    password: '',
                    response: '',
                });
                return;
            } else if (response.length < 6) {
                this.setState({
                    alertMessage: "at least 6 characters required",
                    status: 'failed',
                    response: ''
                });
                return;
            } else {
                let userAddress = await this.props.contract.methods.getUserAddress()
                    .call({ from: this.props.account });

                if (userAddress !== '0x0000000000000000000000000000000000000000') {
                    this.setState({
                        alertMessage: 'this Device already exists',
                        status: 'failed',
                        name: '',
                        password: '',
                        response: '',
                    });
                    return;
                } else {
                    let hash = await AuthenticationHash(name, this.props.account, password, response, this.props.web3);

                    await this.props.contract.methods.register(hash).send({ from: this.props.account });

                    this.setState({
                        name: '',
                        password: '',
                        response: '',
                        status: 'success',
                        alertMessage: "Registration Successfull \n",
                        signedUp: true
                    });

                    // Redirect to DoctorAccount page after successful registration
                    this.props.history.push({
                        pathname: '/doctor/account',
                        state: { 
                            name: name,
                            specialty: this.state.specialty,
                            email: this.state.email,
                            phoneNumber: this.state.phonenumber,
                            publicAddress: this.state.paddress
                        }
                    });

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
                                        value={this.state.password}
                                        autoComplete="current-password"
                                        onChange={e => this.setState({ password: e.target.value })}
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
                                        type='text'
                                        placeholder='Specialty'
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

export default DoctorRegistration;

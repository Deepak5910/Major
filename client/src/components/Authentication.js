import React, { Component } from 'react';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthValidation from '../utils/AuthValidation';
import "../App.css";





class SignIn extends Component {
    state = {
        name: '',
        pufkey: '',
        response: '',
        alertMessage: '',
        status: '',
        loggedIn: false
    }

    onSignIn = async () => {

        if (this.state.name !== '' && this.state.pufkey !== '') {
            let name = this.state.name.trim();
            let pufkey = this.state.pufkey.trim();
            //let response = this.state.response.trim();

            let crypto = require('crypto');
            let c  = name+pufkey;
            let response = crypto.createHash('sha256').update(c).digest('hex');

            let nameToSend = name;

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
                    alertMessage: "at least 8 characters required",
                    status: 'failed',
                    response: ''
                });
                return
            } else {
                let userAddress = await this.props.contract.methods.getUserAddress()
                    .call({ from: this.props.account });

                if (userAddress === '0x0000000000000000000000000000000000000000') {
                    this.setState({
                        alertMessage: 'Device does not exists',
                        status: 'failed',
                        name: '',
                        pufkey: '',
                        response: '',
                    });
                    return;
                } else {
                    let validated = await
                        AuthValidation(
                            name,
                            this.props.account,
                            pufkey, response,
                            this.props.web3,
                            this.props.contract
                        );

                    if (!validated) {
                        this.setState({
                            alertMessage: 'generated response is not same \n ' + response,
                            status: 'failed',
                            name: '',
                            pufkey: '',
                            response: '',
                        });

                        //window.alert("Resonse is Not Matche.......!!!! \n"  +"generated Response is = "+response);

                        return
                    } else {
                        this.setState({
                            name: '',
                            pufkey: '',
                            response: '',
                            status: 'success',
                            alertMessage: "Authentication successfull",
                            loggedIn: true
                        
                        });

                        this.props.userSignedIn(
                            this.state.loggedIn,
                            nameToSend
                        );

                        return;
                    }

                }
            }
        }


        this.setState({
            name: '',
            pufkey: '',
            response: ''
        })
    }
    render() {
        return (
            <div className="sign-up">
                Device Authentication
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
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='DeviceID'
                                        value={this.state.name}
                                        autoComplete="name"
                                        onChange={e => this.setState({ name: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='Challange'
                                        value={this.state.pufkey}
                                        autoComplete="current-pufkey"
                                        onChange={e => this.setState({ pufkey: e.target.value })}
                                    />
                                </Form.Field>
                                {/* <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='Response'
                                        value={this.state.response}
                                        autoComplete="response"
                                        onChange={e => this.setState({ response: e.target.value })}
                                    />
                                </Form.Field> */}
                                <Form.Field>
                                    <Button type='submit' primary fluid size='large' onClick={this.onSignIn}>
                                        Authenticate
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

export default SignIn

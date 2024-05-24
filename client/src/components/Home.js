import React, { Component } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../App.css';


class Home extends Component {
    render() {
        return (
            <div className="container">

                <div className="login-box">
                    <div className="link-box">
                        <Link to='/patient-authentication'>Login as Patient</Link> {/* Modified link */}
                    </div>
                    <div className="link-box">
                        <Link to="/patient-registration">Register as Patient</Link> {/* Modified link */}
                    </div>
                </div>


                <div className="login-box">
                    <div className="link-box">
                        <Link to='/dp-authentication'>Login as Doctor</Link>
                    </div>
                    <div className="link-box">
                        <Link to="/doctor-registration">Register as Doctor</Link> {/* Modified link */}
                    </div>
                </div>
                
               
            </div>

           
        );
    }
}

export default Home;

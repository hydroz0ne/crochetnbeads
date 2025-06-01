import React, { useState } from 'react';
import './CSS/LoginSignUp.css';
import { GoogleLogin } from '@react-oauth/google';

const LoginSignUp = () => {
    const [state, setState] = useState('Login');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const login = async () => {
        try {
            const response = await fetch('https://crochetnbeads.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            } else {
                alert(data.message || 'Login failed.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to connect to server.');
        }
    };

    const signup = async () => {
        try {
            const response = await fetch('https://crochetnbeads.onrender.com/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            } else {
                alert(data.message || 'Signup failed.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('Failed to connect to server.');
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const res = await fetch('https://crochetnbeads.onrender.com/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });

            const data = await res.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            } else {
                alert(data.message || 'Google login failed.');
            }
        } catch (err) {
            console.error('Google login error:', err);
            alert('Something went wrong with Google login.');
        }
    };

    return (
        <div className='loginsignup'>
            <div className='loginsignup-container'>
                <h1>{state}</h1>
                {state === 'Sign Up' ? 
                    <p className='loginsignup-login'>Already have an account? <span onClick={()=>{setState('Login')}}>Login here.</span></p> 
                    : 
                    <p className='loginsignup-login'>Don't have an account? <span onClick={()=>{setState('Sign Up')}}>Sign up here.</span></p>
                }
                <div className='loginsignup-form'>
                    {state === 'Sign Up' && 
                        <input name="username" value={formData.username} onChange={handleChange}  type='text' placeholder='Username' />
                    }
                    <input name="email" value={formData.email} onChange={handleChange} type='email' placeholder='Email' />
                    <input name="password" value={formData.password}  onChange={handleChange}  type='password'  placeholder='Password' />
                </div>
                <button onClick={() => {state === 'Login' ? login() : signup()}} className='btn'>
                    {state}
                </button>
                <div>
                    <p style={{textAlign: 'center'}}>- or -</p>
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => console.log('Google login failed.')}
                        useOneTap={false}
                        render={(renderProps) => (
                        <button 
                            onClick={renderProps.onClick} 
                            disabled={renderProps.disabled} 
                            className="btn"
                        >
                            Sign in with Google
                        </button>
                        )}
                    />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginSignUp;
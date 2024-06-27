import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import '../css/authentication.css';

function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        verifyPassword: '',
        name: '',
        email: '',
        street: '',
        suite: '',
        city: '',
        zipcode: '',
        lat: '',
        lng: '',
        phone: '',
        website: '',
        companyName: '',
        catchPhrase: '',
        bs: ''
    });
    const [errors, setErrors] = useState({});
    const history = useHistory();

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'username':
                if (value.trim() === '') {
                    error = 'Username is required';
                }
                break;
            case 'password':
                if (value.trim() === '') {
                    error = 'Password is required';
                } else if (value.length < 4) {
                    error = 'Password must be at least 4 characters long';
                }
                break;
            case 'verifyPassword':
                if (value !== formData.password) {
                    error = 'Passwords do not match';
                }
                break;
            case 'email':
                if (!/\S+@\S+\.\S+/.test(value)) {
                    error = 'Email is invalid';
                }
                break;
            case 'phone':
                if (!/^\d{10}$/.test(value)) {
                    error = 'Phone number must be 10 digits';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors({
            ...errors,
            [name]: error
        });
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        let valid = true;
        ['username', 'password', 'verifyPassword'].forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                valid = false;
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [field]: error
                }));
            }
        });
        if (valid) {
            setStep(step + 1);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        let valid = true;
        ['name', 'email', 'street', 'city', 'zipcode', 'phone', 'companyName'].forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                valid = false;
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [field]: error
                }));
            }
        });
        if (valid) {
            const newUser = {
                id: Date.now(),
                name: formData.name,
                username: formData.username,
                password: formData.password,
                email: formData.email,
                address: {
                    street: formData.street,
                    suite: formData.suite,
                    city: formData.city,
                    zipcode: formData.zipcode,
                    geo: {
                        lat: formData.lat,
                        lng: formData.lng
                    }
                },
                phone: formData.phone,
                website: formData.website,
                company: {
                    name: formData.companyName,
                    catchPhrase: formData.catchPhrase,
                    bs: formData.bs
                }
            };

            try {
                const response = await fetch('http://localhost:8000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newUser)
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                history.push('/login');
            } catch (error) {
                alert(error.message);
            }
        }
    };

    return (
        <div className="container">
            <form className="form" onSubmit={step === 1 ? handleNextStep : handleRegister}>
                {step === 1 ? (
                    <>
                        <input
                            className="input"
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                        {errors.username && <span className="error">{errors.username}</span>}
                        <input
                            className="input"
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        {errors.password && <span className="error">{errors.password}</span>}
                        <input
                            className="input"
                            type="password"
                            placeholder="Verify Password"
                            name="verifyPassword"
                            value={formData.verifyPassword}
                            onChange={handleInputChange}
                        />
                        {errors.verifyPassword && <span className="error">{errors.verifyPassword}</span>}
                        <button className="button" type="submit">Next</button>
                    </>
                ) : (
                    <>
                        <input
                            className="input"
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {errors.name && <span className="error">{errors.name}</span>}
                        <input
                            className="input"
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                        <input
                            className="input"
                            type="text"
                            placeholder="Street"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                        />
                        {errors.street && <span className="error">{errors.street}</span>}
                        <input
                            className="input"
                            type="text"
                            placeholder="Suite"
                            name="suite"
                            value={formData.suite}
                            onChange={handleInputChange}
                        />
                        {errors.suite && <span className="error">{errors.suite}</span>}
                        <input
                            className="input"
                            type="text"
                            placeholder="City"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                        />
                        {errors.city && <span className="error">{errors.city}</span>}
                        <input
                            className="input"
                            type="text"
                            placeholder="Zipcode"
                            name="zipcode"
                            value={formData.zipcode}
                            onChange={handleInputChange}
                        />
                        {errors.zipcode && <span className="error">{errors.zipcode}</span>}
                        <input
                            className="input"
                            type="text"
                            placeholder="Latitude"
                            name="lat"
                            value={formData.lat}
                            onChange={handleInputChange}
                        />
                        {errors.lat && <span className="error">{errors.lat}</span>}
                        <input
                            className="input"
                            type="text"
                            placeholder="Longitude"
                            name="lng"
                            value={formData.lng}
                            onChange={handleInputChange}
                        />
                        {errors.lng && <span className="error">{errors.lng}</span>}
                        <input
                            className="input"
                            type="text"
                            placeholder="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                        {errors.phone && <span className="error">{errors.phone}</span>}
                        <input
                            className="input"
                            type="text"
                            placeholder="Website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                        />
                        {errors.website && <span className="error">{errors.website}</span>}
                        <input
                            className="input"
                            type="text"
                            placeholder="Company Name"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                        />
                        {errors.companyName && <span className="error">{errors.companyName}</span>}
                        <input
                            className="input"
                            type="text"
                            placeholder="Catch Phrase"
                            name="catchPhrase"
                            value={formData.catchPhrase}
                            onChange={handleInputChange}
                        />
                        {errors.catchPhrase && <span className="error">{errors.catchPhrase}</span>}
                        <input
                            className="input"
                            type="text"
                            placeholder="BS"
                            name="bs"
                            value={formData.bs}
                            onChange={handleInputChange}
                        />
                        {errors.bs && <span className="error">{errors.bs}</span>}
                        <button className="button" type="submit">Register</button>
                    </>
                )}
                <Link to="/login" className="register-link">Already have an account? Login here.</Link>
            </form>
        </div>
    );
}

export default Register;

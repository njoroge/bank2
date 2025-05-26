import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    accountNumber: '',
    pin: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const { firstName, lastName, accountNumber, pin } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ firstName, lastName, accountNumber, pin });
      navigate('/dashboard'); // Redirect to dashboard after successful registration
    } catch (err) {
      console.error('Registration failed in component:', err);
      setError(err.response?.data?.msg || err.response?.data?.errors?.map(e => e.msg).join(', ') || 'Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={firstName}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={lastName}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Account Number"
            name="accountNumber"
            value={accountNumber}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="PIN"
            name="pin"
            value={pin}
            onChange={onChange}
            minLength="6" // As per backend validation
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

const SLIDESHOW_IMAGES = [
  '/public/download.jpeg',
  '/public/1.jpeg',
  '/public/2.jpeg',
  '/public/3.jpeg'
];

const LoginPage = () => {
  const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedEmail'));
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token) {
      // Verify token is still valid (you might want to add an API call to verify)
      // For now, we'll assume it's valid if it exists
      if (role === 'admin') {
        navigate('/admin/manage-products');
      } else {
        navigate('/client/items');
      }
    }
  }, [navigate]);

  // Handle slideshow rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });
  
      // Store authentication data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('userEmail', response.data.user.email);
      localStorage.setItem('userName', response.data.user.name || '');
      localStorage.setItem('role', response.data.user.is_admin ? 'admin' : 'client');
      
      // Remember email if checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Redirect based on user role
      if (response.data.user.is_admin) {
        navigate('/admin/manage-products');
      } else {
        navigate('/client/items');
      }

      
  
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Logo>Tyde Homes & Sanitary Fittings</Logo>
        <Title>Welcome Back</Title>
        <Subtitle>Please enter your credentials to login</Subtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <InputGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <PasswordInputContainer>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <TogglePasswordButton 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </TogglePasswordButton>
          </PasswordInputContainer>
        </InputGroup>
        
        <RememberMeContainer>
          <RememberMeCheckbox
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <RememberMeLabel htmlFor="rememberMe">Remember me</RememberMeLabel>
        </RememberMeContainer>
        
        <ForgotPasswordLink href="#">Forgot password?</ForgotPasswordLink>
        
        <LoginButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner />
              Logging in...
            </>
          ) : 'Login'}
        </LoginButton>
        
        <SignupText>
          Don't have an account? <SignupLink href="/register">Sign up</SignupLink>
        </SignupText>
      </LoginForm>
      
      <SlideshowContainer>
        {SLIDESHOW_IMAGES.map((image, index) => (
          <SlideshowImage 
            key={index}
            src={image} 
            alt="Antique illustration" 
            active={index === currentSlide}
          />
        ))}
        <SlideshowOverlay />
      </SlideshowContainer>
    </LoginContainer>
  );
};

// Styled components with antique styling
const fadeInOut = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f1e9;
  font-family: 'Georgia', serif;
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 480px;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fffaf0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e8d9b5;
  position: relative;
  z-index: 1;
`;

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #8b4513;
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Times New Roman', serif;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #5a3921;
  margin-bottom: 0.5rem;
  text-align: center;
  font-style: italic;
`;

const Subtitle = styled.p`
  color: #8b7355;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 0.95rem;
`;

const ErrorMessage = styled.p`
  color: #8b0000;
  background-color: #ffe8e8;
  padding: 0.75rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  text-align: center;
  border: 1px solid #ffcccc;
  font-size: 0.9rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #5a3921;
  margin-bottom: 0.5rem;
  font-style: italic;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d2b48c;
  border-radius: 0.25rem;
  font-size: 1rem;
  color: #5a3921;
  background-color: #fffdf5;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #8b4513;
    box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
  }

  &::placeholder {
    color: #b0a18d;
    font-style: italic;
  }
`;

const PasswordInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #8b7355;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #5a3921;
  }
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const RememberMeCheckbox = styled.input`
  margin-right: 0.5rem;
  accent-color: #8b4513;
`;

const RememberMeLabel = styled.label`
  font-size: 0.875rem;
  color: #5a3921;
  cursor: pointer;
`;

const ForgotPasswordLink = styled.a`
  font-size: 0.875rem;
  color: #8b4513;
  text-align: right;
  margin-bottom: 1.5rem;
  text-decoration: none;
  display: block;
  font-style: italic;

  &:hover {
    text-decoration: underline;
    color: #5a3921;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.85rem;
  background-color: #8b4513;
  color: #fffaf0;
  font-weight: 600;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  letter-spacing: 0.5px;

  &:hover {
    background-color: #5a3921;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #b0a18d;
    cursor: not-allowed;
    transform: none;
  }
`;

const Spinner = styled.div`
  border: 2px solid rgba(255, 250, 240, 0.3);
  border-radius: 50%;
  border-top: 2px solid #fffaf0;
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SignupText = styled.p`
  color: #8b7355;
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
`;

const SignupLink = styled.a`
  color: #8b4513;
  font-weight: 500;
  text-decoration: none;
  font-style: italic;

  &:hover {
    text-decoration: underline;
    color: #5a3921;
  }
`;

const SlideshowContainer = styled.div`
  flex: 1;
  display: none;
  position: relative;
  overflow: hidden;
  background-color: #e8d9b5;

  @media (min-width: 1024px) {
    display: block;
  }
`;

const SlideshowImage = styled.img`
  position: absolute;
  top: 0;
  left: -4;
  width: 70%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.active ? 1 : 0};
  transition: opacity 1.5s ease-in-out;
  animation: ${fadeInOut} 12s infinite;
`;

const SlideshowOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(245, 241, 233, 0.1), rgba(139, 69, 19, 0.1));
`;

export default LoginPage;
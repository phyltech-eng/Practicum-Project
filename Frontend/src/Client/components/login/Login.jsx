import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  IconButton, 
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Divider
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Person,
  School,
  Business
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export default function Login() {
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('member');

  // Validation Schema
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
  });

  // Formik Hook
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      loginType: 'member'
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        // Determine login endpoint based on login type
        let endpoint = '';
        switch(loginType) {
          case 'member':
            endpoint = '/api/member/login';
            break;
          case 'admin':
            endpoint = '/api/club-admin/login';
            break;
          case 'patron':
            endpoint = '/api/patron/login';
            break;
          default:
            endpoint = '/api/member/login';
        }

        // Perform login
        const response = await axios.post(endpoint, {
          email: values.email,
          password: values.password
        });

        // Handle successful login
        const { token, user } = response.data;

        // Store token and user info
        localStorage.setItem('authToken', token);
        localStorage.setItem('userInfo', JSON.stringify(user));

        // Redirect based on login type
        switch(loginType) {
          case 'member':
            window.location.href = '/member/dashboard';
            break;
          case 'admin':
            window.location.href = '/admin/dashboard';
            break;
          case 'patron':
            window.location.href = '/patron/dashboard';
            break;
          default:
            window.location.href = '/dashboard';
        }
      } catch (error) {
        // Handle login errors
        console.error('Login Error:', error);
        alert(error.response?.data?.message || 'Login failed');
      }
    }
  });

  // Login Type Options
  const loginTypes = [
    { 
      value: 'member', 
      label: 'Member', 
      icon: <Person /> 
    },
    { 
      value: 'admin', 
      label: 'Club Admin', 
      icon: <School /> 
    },
    { 
      value: 'patron', 
      label: 'Patron', 
      icon: <Business /> 
    }
  ];

  return (
    <Container maxWidth="xs">
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 3
        }}
      >
        <Paper 
          elevation={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            borderRadius: 3,
            width: '100%'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              mb: 3,
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            Campus Clubs Login
          </Typography>

          {/* Login Type Selector */}
          <ToggleButtonGroup
            value={loginType}
            exclusive
            onChange={(e, newLoginType) => {
              if (newLoginType !== null) {
                setLoginType(newLoginType);
                formik.setFieldValue('loginType', newLoginType);
              }
            }}
            sx={{ mb: 3, width: '100%' }}
          >
            {loginTypes.map((type) => (
              <ToggleButton 
                key={type.value} 
                value={type.value}
                sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                {type.icon}
                {type.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* Login Form */}
          <Box 
            component="form" 
            onSubmit={formik.handleSubmit}
            sx={{ width: '100%' }}
          >
            {/* Email Input */}
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              margin="normal"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                )
              }}
            />

            {/* Password Input */}
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* Forgot Password */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                mt: 1 
              }}
            >
              <Button 
                variant="text" 
                color="primary"
                sx={{ textTransform: 'none' }}
              >
                Forgot Password?
              </Button>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5
              }}
            >
              Sign In
            </Button>

            {/* Divider */}
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            {/* Social Login Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                startIcon={<img 
                  src="/google-icon.svg" 
                  alt="Google" 
                  style={{ width: 24, height: 24 }} 
                />}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                startIcon={<img 
                  src="/facebook-icon.svg" 
                  alt="Facebook" 
                  style={{ width: 24, height: 24 }} 
                />}
              >
                Facebook
              </Button>
            </Box>

            {/* Sign Up Link */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 3 
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Don't have an account? 
                <Button 
                  color="primary" 
                  sx={{ 
                    textTransform: 'none', 
                    ml: 1,
                    fontWeight: 'bold'
                  }}
                >
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

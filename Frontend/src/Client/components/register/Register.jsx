import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  IconButton, 
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Avatar,
  Grid
} from '@mui/material';
import { Visibility, VisibilityOff, CloudUpload } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export default function Register() {
  // State for password visibility and image
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clubImage, setClubImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Validation Schema
  const registerSchema = Yup.object().shape({
    club_image: Yup.mixed()
      .test('fileSize', 'File is too large', (value) => {
        return value ? value.size <= 5 * 1024 * 1024 : true; // 5MB limit
      })
      .test('fileType', 'Unsupported file type', (value) => {
        return value ? ['image/jpeg', 'image/png', 'image/gif'].includes(value.type) : true;
      })
      .required('Club logo is required'),
    
    club_name: Yup.string()
      .required('Club Name is required')
      .min(3, 'Club Name must be at least 3 characters'),
    
    club_type: Yup.string()
      .required('Club Type is required'),
    
    club_description: Yup.string()
      .required('Club Description is required')
      .min(10, 'Description must be at least 10 characters'),
    
    club_Admin: Yup.string()
      .required('Club Admin Name is required')
      .min(2, 'Admin Name must be at least 2 characters'),
    
    Password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must include uppercase, lowercase, number, and special character'
      ),
    
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('Password'), null], 'Passwords must match')
  });

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Set the file
      setClubImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  //reseting the image
  const  fileInputRef= React.useRef(null);

  // Initial form values
  const initialValues = {
    club_image: null,
    club_name: '',
    club_type: '',
    club_description: '',
    club_Admin: '',
    Password: '',
    confirmPassword: '',
  };

  // Formik hook
  const formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      
      const formData = new FormData();
     
      Object.keys(values).forEach(key => {
        if (key !== 'confirmPassword') {
          formData.append(key, values[key]);
        }
      });

      try {
        
        
        console.log('Submitted Values:', Object.fromEntries(formData));
        
        axios.post('http://localhost:5000/api/club/register', formData).then
        (resp=> {
          console.log(resp.data);
        }).catch(err=> {
          console.log('Error:', err); 
        });
        
        
        formik.resetForm();
        setImagePreview(null);
        
    
        localStorage.setItem('clubRegistration', JSON.stringify(Object.fromEntries(formData)));
        
       
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed');
      }
    },
  });

  // Club type options
  const clubTypes = [
    'Academic',
    'Cultural',
    'Sports',
    'Technical',
    'Social Service',
    'Arts',
    'Other'
  ];

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: '500px',
        margin: 'auto',
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: 'background.paper'
      }}
      noValidate
      autoComplete="off"
      onSubmit={formik.handleSubmit}
    >
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Club Registration
      </Typography>

      {/* Club Image Upload - Top of the Form */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mb: 2 
        }}
      >
        {/* Image Preview */}
        <Avatar
          src={imagePreview}
          sx={{ 
            width: 150, 
            height: 150, 
            mb: 2,
            border: '2px solid primary.main' 
          }}
        />

        {/* File Input */}
        <Button
          component="label"
          variant="contained"
          color="secondary"
          startIcon={<CloudUpload />}
          sx={{ mb: 1 }}
        >
          Upload Club Logo
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(event) => {
              handleImageUpload(event);
              formik.setFieldValue('club_image', event.target.files[0]);
            }}
          />
        </Button>

        {/* Error Message */}
        {formik.touched.club_image && formik.errors.club_image && (
          <Typography color="error" variant="caption">
            {formik.errors.club_image}
          </Typography>
        )}
      </Box>

      {/* Registration Form Fields */}
      <Grid container spacing={2}>
        {/* Club Name */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Club Name"
            name="club_name"
            value={formik.values.club_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.club_name && Boolean(formik.errors.club_name)}
            helperText={formik.touched.club_name && formik.errors.club_name}
          />
        </Grid>

        {/* Club Type */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Club Type</InputLabel>
            <Select
              name="club_type"
              value={formik.values.club_type}
              label="Club Type"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.club_type && Boolean(formik.errors.club_type)}
            >
              {clubTypes.map((type) => (
                <MenuItem key={type} value={type.toLowerCase()}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.club_type && formik.errors.club_type && (
              <Typography color="error" variant="caption">
                {formik.errors.club_type}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Club Description */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Club Description"
            name="club_description"
            value={formik.values.club_description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.club_description && Boolean(formik.errors.club_description)}
            helperText={formik.touched.club_description && formik.errors.club_description}
          />
        </Grid>

        {/* Club Admin */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Club Admin"
            name="club_Admin"
            value={formik.values.club_Admin}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.club_Admin && Boolean(formik.errors.club_Admin)}
            helperText={formik.touched.club_Admin && formik.errors.club_Admin}
          />
        </Grid>

        {/* Password */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Password"
            name="Password"
            value={formik.values.Password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.Password && Boolean(formik.errors.Password)}
            helperText={formik.touched.Password && formik.errors.Password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Confirm Password */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Submit Button */}
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        fullWidth
        size="large"
        sx={{ mt: 3 }}
      >
        Register Club
      </Button>
    </Box>
  );
}

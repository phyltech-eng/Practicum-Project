import { Password } from '@mui/icons-material';
import yup from 'yup';


export const registerSchema = yup.object().shape({
club_name: yup.string().required('Club Name is required'),
club_type: yup.string().required('Club Type is required'),
club_description: yup.string().required('Club Description must be atleast 500 characcters'),
club_Admin: yup.string().required('Club admin must have two names'),
Password: yup.string().required('Password is required').min(8, 'Password must be atleast 8 characters'),
confirmPassword: yup.string().oneOf([yup.ref('Password'), null], 'Passwords must match'),
});
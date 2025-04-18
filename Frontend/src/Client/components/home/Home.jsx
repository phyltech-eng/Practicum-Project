import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Paper,
  Chip,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { Group, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Create a custom theme with green as the primary color
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Dark green
      light: '#60ad5e',
      dark: '#005005',
      contrastText: '#fff',
    },
    secondary: {
      main: '#81c784', // Light green
      light: '#b2fab4',
      dark: '#519657',
      contrastText: '#000',
    },
    background: {
      default: '#f1f8e9', // Very light green for background
    },
  },
});

export default function Home() {
  // State for responsive design
  const [isMobile, setIsMobile] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [user, setUser] = useState(null); // Store user info
  const navigate = useNavigate();

  const handleJoinClub = async (clubId) => {
    if (!user) {
      alert('User must be logged in to join the club');
      return;
    }
    
    try {
      // Add user to club on backend
      const response = await fetch(`http://localhost:5000/api/clubs/${clubId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`, // Send token if using JWT authentication
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (response.ok) {
        // Update the user’s clubs data (you might want to refetch user data)
        const updatedUser = await response.json();
        setUser(updatedUser);
        console.log(`Joined club ${clubId}`);
      } else {
        console.error('Failed to join club');
      }
    } catch (error) {
      console.error('Error joining club:', error);
    }
  };

  const handleLeaveClub = async (clubId) => {
    if (!user) {
      console.log('User must be logged in to leave the club');
      return;
    }

    try {
      // Remove user from club on backend
      const response = await fetch(`http://localhost:5000/api/clubs/${clubId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`, // Send token if using JWT authentication
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (response.ok) {
        // Update the user’s clubs data (you might want to refetch user data)
        const updatedUser = await response.json();
        setUser(updatedUser);
        console.log(`Left club ${clubId}`);
      } else {
        console.error('Failed to leave club');
      }
    } catch (error) {
      console.error('Error leaving club:', error);
    }
  };

  // Example clubs data for testing - will be replaced by API data when fetched
  const exampleClubs = [
    {
      _id: '1',
      name: 'Coding Club',
      description: 'A community of programmers learning together',
      logo: '',
      members: 120
    },
    {
      _id: '2',
      name: 'Chess Club',
      description: 'For chess enthusiasts of all skill levels',
      logo: '',
      members: 85
    },
    {
      _id: '3',
      name: 'Photography Club',
      description: 'Capture moments and share your passion for photography',
      logo: '',
      members: 75
    }
  ];

  // Fetch clubs data from backend
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const clubsResponse = await fetch('http://localhost:5000/api/clubs/home');
        if (!clubsResponse.ok) {
          throw new Error(`Clubs API error: ${clubsResponse.status} ${clubsResponse.statusText}`);
        }

        const clubsData = await clubsResponse.json();
        if (clubsData.success) {
          setClubs(clubsData.data);
        } else {
          console.error('Failed to fetch clubs:', clubsData.message);
          setClubs(exampleClubs); // Use example data if API fails
        }

      } catch (error) {
        console.error('Error fetching clubs:', error.message);
        setClubs(exampleClubs); // Use example data if error occurs
      }
    };

    fetchClubs();
  }, []);

  // Fetch user info (simulating authentication here)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await fetch('http://localhost:5000/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is saved in localStorage
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        } else {
          console.log('No user found, please log in.');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  // Check if the user is a member of the club
  const isMember = (clubId) => {
    return user && user.clubs && user.clubs.includes(clubId);
  };

  // Use example clubs for rendering if API data is empty
  const displayClubs = clubs.length > 0 ? clubs : exampleClubs;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Banner Section */}
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            backgroundColor: 'primary.dark',
            color: '#fff',
            mb: 4,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: 'linear-gradient(to right, #2e7d32, #388e3c, #43a047)',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              backgroundColor: 'rgba(0,0,0,0.3)'
            }}
          />
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Welcome to Campus Clubs
            </Typography>
            <Typography 
              variant="h5" 
              color="inherit" 
              paragraph
            >
              Discover, Connect, and Grow with Student Organizations
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              sx={{ mt: 3, fontWeight: 'bold', px: 4, py: 1 }}
            >
              Explore Clubs
            </Button>
          </Container>
        </Paper>

        <Container maxWidth="xl">
          {/* Popular Clubs Section */}
          <Box sx={{ mb: 5 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 3,
                color: 'primary.main'
              }}
            >
              <Group sx={{ mr: 2, color: 'primary.main' }} />
              Most Popular Clubs
            </Typography>
            
            <Grid 
              container 
              spacing={3} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap' 
              }}
            >
              {displayClubs.map((club) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  key={club._id} 
                >
                  <Card 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      height: '100%',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 16px rgba(46, 125, 50, 0.2)'
                      },
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: 0,
                        paddingTop: '56.25%', // 16:9 aspect ratio
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(46, 125, 50, 0.1)',
                        position: 'relative'
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                      <Typography gutterBottom variant="h5" component="h3" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        {club.name || 'Untitled Club'}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 ,width:'300px'}}>
                        {club.description || 'No description available'}
                      </Typography>
                      <Chip 
                        icon={<Star sx={{ color: 'primary.main' }} />} 
                        label={`${club.members} Members`} 
                        variant="outlined" 
                        sx={{ mb: 2, borderColor: 'primary.light', color: 'primary.main' }}
                      />
                    </CardContent>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      px: 2, 
                      pb: 2,
                      mt: 'auto'  // Push buttons to bottom
                    }}>
                      {isMember(club._id) ? (
                        <Button 
                          variant="outlined" 
                          color="error"
                          sx={{ flex: 1, ml: 1 }}
                          onClick={() => handleLeaveClub(club._id)}
                        >
                          Leave
                        </Button>
                      ) : (
                        <Button 
                          variant="contained" 
                          color="primary"
                          sx={{ flex: 1, mr: 1 }}
                          onClick={() => handleJoinClub(club._id)}
                        >
                          Join
                        </Button>
                      )}
                      <Button 
                        variant="outlined" 
                        color="primary"
                        sx={{ flex: 1, ml: 1 }}
                        onClick={() => {
                          navigate(`/clubs/${club._id}/dashboard`);
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

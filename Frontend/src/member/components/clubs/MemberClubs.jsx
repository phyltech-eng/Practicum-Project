import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, TextField, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';

export default function MemberClubs() {
  const [clubs, setClubs] = useState([]);
  const exampleClubs = [
    {
      id: 1,
      name: 'Book Club',
      category: 'Literature',
      members: 45,
      description: 'For avid readers and literature enthusiasts. Weekly discussions and author events.',
      isFeatured: true,
      meetings: [
        { date: 'May 12, 2023', location: 'Library Room 203' },
        { date: 'May 26, 2023', location: 'Library Room 203' },
      ]
    },
    {
      id: 2,
      name: 'Tech Enthusiasts',
      category: 'Technology',
      members: 32,
      description: 'Exploring the latest in tech and innovation with workshops and hackathons.',
      isFeatured: false,
      meetings: [
        { date: 'May 15, 2023', location: 'Tech Hub Lab' }
      ]
    },
    // Add more clubs as needed...
  ];

  useEffect(() => {
    const fetchClubs = async () => {
      console.log('Fetching clubs data...');
      try {
        const clubsResponse = await fetch('http://localhost:5000/api/clubs/home');
        if (!clubsResponse.ok) {
          throw new Error(`Clubs API error: ${clubsResponse.status} ${clubsResponse.statusText}`);
        }
        const clubsData = await clubsResponse.json();
        console.log('Fetched clubs data:', clubsData);
        if (clubsData.success) {
          setClubs(clubsData.data);
        } else {
          console.error('Failed to fetch clubs:', clubsData.message);
          setClubs(exampleClubs); // Fallback data
        }
      } catch (error) {
        console.error('Error fetching clubs:', error.message);
        setClubs(exampleClubs); // Fallback data
      }
    };
    fetchClubs();
  }, []);

  const featuredClubs = clubs.filter(club => club.isFeatured);
  const otherClubs = clubs.filter(club => !club.isFeatured);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'success.main' }}>
        Clubs & Groups
      </Typography>

      <Paper elevation={0} sx={{ mb: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search clubs..."
            InputProps={{ startAdornment: <Search color="action" sx={{ mr: 1 }} /> }}
            sx={{ width: 300 }}
          />
          <Box>
            <Button sx={{ mr: 1 }}>All</Button>
            <Button sx={{ mr: 1 }}>My Clubs</Button>
            <Button>Categories</Button>
          </Box>
        </Box>
      </Paper>

      {featuredClubs.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'success.main' }}>
            Featured Clubs
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {featuredClubs.map(club => (
              <Grid item xs={12} sm={6} md={4} key={club.id}>
                <Box sx={{ p: 2, borderRadius: 2, boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6">{club.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {club.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {club.members} members
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Upcoming Meetings:</Typography>
                    {club.meetings.map((meeting, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {meeting.date} - {meeting.location}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button size="small" variant="outlined" color="success">View Details</Button>
                    <Button size="small" variant="contained" color="success">Join Club</Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'success.main' }}>
        All Clubs
      </Typography>
      <Grid container spacing={3}>
        {otherClubs.map(club => (
          <Grid item xs={12} sm={6} md={4} key={club.id}>
            <Box sx={{ p: 2, borderRadius: 2, boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6">{club.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 , width: '300'}}>
                {club.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {club.members} members
              </Typography>
              {/* <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Upcoming Meetings:</Typography>
                {club.meetings.map((meeting, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {meeting.date} - {meeting.location}
                    </Typography>
                  </Box>
                ))}
              </Box> */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size="small" variant="outlined" color="success">View Details</Button>
                <Button size="small" variant="contained" color="success">Join Club</Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {clubs.length === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No clubs available
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Check back later or contact admin to start a new club
          </Typography>
        </Box>
      )}
    </Box>
  );
}

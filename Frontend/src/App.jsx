import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Club from './club/Club';
import Dashboard from './club/components/Dashboard';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Parent Route */}
          <Route path="clubs" element={<Club />}>
            {/* Relative path for the nested route */}
            <Route path=":clubId/dashboard" element={<Dashboard />} />
            <Route path="member" element={<Member />} />
            <Route path="patrons" element={<Patrons />} />
            <Route path="meeting" element={<Meeting />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ClubAdmin />}>
            <Route index element={<AdminDashboard />} />
            <Route path="clubs" element={<AdminClubs />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="notices" element={<AdminNotices />} />
          </Route>

          {/* Patron Routes */}
          <Route path="patron" element={<Patron />}>
            <Route index element={<PatronDashboard />} />
            <Route path="profile" element={<PatronProfile />} />
            <Route path="members" element={<PatronMembers />} />
            <Route path="meetings" element={<MeetingPatron />} />
          </Route>

          {/* Member Routes */}
          <Route path="member" element={<Members />}>
            <Route index element={<MemberDashboard />} />
            <Route path="profile" element={<MemberProfile />} />
            <Route path="clubs" element={<MemberClubs />} />
            <Route path="meetings" element={<MeetingMember />} />
          </Route>

          {/* Client Routes */}
          <Route path="" element={<Client />}>
            <Route path='home' element={<Home />} />
            <Route index element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="registerClub" element={<ClubRegistrationForm />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const PrivacyPolicy: React.FC = () => {
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        p: 4,
      }}
    >
      <Typography fontFamily="PrimaryFont" variant="h3" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body2" gutterBottom>
        Effective Date: 10/27/2025
      </Typography>

      <Typography variant="body1" mb={2}>
        We value your privacy. This Privacy Policy explains how we collect, use, and protect your information when you interact with our services.
      </Typography>

      <Box mt={4}>
        <Typography fontFamily="PrimaryFont" variant="h6" gutterBottom>
          1. Information We Collect
        </Typography>
        <List sx={{ pl: 4, listStyleType: 'disc' }}>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Personal Information: Name, email, phone number, or other identifiers you provide." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Authentication Information: Login credentials and session tokens." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Cookies and Tracking Technologies: Cookies, web beacons, and pixels to track interactions, analytics, and personalize content." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Device and Usage Information: IP address, browser type, OS, pages visited, and actions performed." />
          </ListItem>
        </List>
      </Box>

      <Box mt={4}>
        <Typography fontFamily="PrimaryFont" variant="h6" gutterBottom>
          2. How We Use Your Information
        </Typography>
        <List sx={{ pl: 4, listStyleType: 'disc' }}>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Providing, maintaining, and improving our services." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Managing your account and authentication." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Personalizing user experiences." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Communicating updates, security alerts, or promotional messages." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Ensuring compliance with legal obligations and enforcing our terms." />
          </ListItem>
        </List>
      </Box>

      <Box mt={4}>
        <Typography fontFamily="PrimaryFont" variant="h6" gutterBottom>
          3. Cookies and Tracking
        </Typography>
        <List sx={{ pl: 4, listStyleType: 'disc' }}>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Essential Cookies: Required for authentication, security, and basic functionality." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Performance & Analytics Cookies: Help us understand how users interact with our services." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Functional Cookies: Remember user preferences and settings." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Advertising & Targeting Cookies: May serve personalized content and ads." />
          </ListItem>
        </List>
      </Box>

      <Box mt={4}>
        <Typography fontFamily="PrimaryFont" variant="h6" gutterBottom>
          4. Data Sharing and Disclosure
        </Typography>
        <List sx={{ pl: 4, listStyleType: 'disc' }}>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="With service providers performing services on our behalf (hosting, analytics, marketing)." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="To comply with legal obligations, court orders, or regulatory requests." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="To protect rights, property, safety, or security of users or others." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="In connection with mergers, acquisitions, or corporate transactions." />
          </ListItem>
        </List>
      </Box>

      <Box mt={4}>
        <Typography fontFamily="PrimaryFont" variant="h6" gutterBottom>
          5. Data Security
        </Typography>
        <Typography variant="body1" mb={2}>
          We implement reasonable safeguards to protect your information. However, no method of transmission over the Internet or electronic storage is completely secure.
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography fontFamily="PrimaryFont" variant="h6" gutterBottom>
          6. Your Choices
        </Typography>
        <List sx={{ pl: 4, listStyleType: 'disc' }}>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Account Information: Access, update, or delete your account info through settings." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Cookies: Manage through your browser or device settings." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <ListItemText primary="Communications: Opt out of promotional emails via unsubscribe instructions." />
          </ListItem>
        </List>
      </Box>

      <Box mt={4}>
        <Typography fontFamily="PrimaryFont" variant="h6" gutterBottom>
          7. Children’s Privacy
        </Typography>
        <Typography variant="body1" mb={2}>
          Our services are not directed to individuals under 13 (or applicable age). We do not knowingly collect information from children.
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography fontFamily="PrimaryFont" variant="h6" gutterBottom>
          8. Changes to This Privacy Policy
        </Typography>
        <Typography variant="body1" mb={2}>
          We may update this Privacy Policy periodically. Updated versions will be posted on our website with the 'Effective Date' updated.
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography fontFamily="PrimaryFont" variant="h6" gutterBottom>
          9. Contact Us
        </Typography>
        <Typography variant="body1" mb={2}>
          If you have questions about this Privacy Policy or how we handle your data, please contact us.
        </Typography>
      </Box>
    </Box>
  );
};

export default PrivacyPolicy;

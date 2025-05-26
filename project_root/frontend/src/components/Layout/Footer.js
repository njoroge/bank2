import React from 'react';

const Footer = () => {
  return (
    <footer style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderTop: '1px solid #ccc', textAlign: 'center', marginTop: '2rem' }}>
      <p>&copy; {new Date().getFullYear()} Banking Application. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

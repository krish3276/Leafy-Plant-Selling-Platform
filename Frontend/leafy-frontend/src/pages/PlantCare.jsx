import React from 'react';

function PlantCare() {
  return (
    <div style={{ padding: '4rem 2rem', minHeight: '60vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Plant Care Guide</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
          Learn how to take care of your plants with our comprehensive guides and AI assistant.
        </p>
        <div style={{ 
          padding: '2rem', 
          backgroundColor: '#f8f7f4', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h2>🤖 AI Plant Care Assistant Coming Soon</h2>
          <p>Get personalized plant care advice, diagnose problems, and learn best practices.</p>
        </div>
      </div>
    </div>
  );
}

export default PlantCare;

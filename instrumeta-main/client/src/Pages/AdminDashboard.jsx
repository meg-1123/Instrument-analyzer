import React from 'react';

const AdminDashboard = () => {
  // Static data for now
  const stats = {
    totalUsers: 7,
    songsAnalysed: 15,
    quizAttempts: 5,
  };

  // Most used instruments (static example data)
  const mostUsedInstruments = [
    { name: 'Guitar', usage: 5 },
    { name: 'Piano', usage: 3 },
    { name: 'Xylophone', usage: 2 },
    { name: 'Drums', usage: 5 },
    
  ];

  // Recent quizzes (static example data)
  const recentQuizzes = [
    { id: 1, title: 'Basic Music Theory' },
    { id: 2, title: 'Identify the Instrument' },
    { id: 3, title: 'Rhythm Patterns Quiz' },
    { id: 4, title: 'Advanced Chords' },
    { id: 5, title: 'Music History Basics' },
  ];

  return (
    <div style={{
      padding: '40px 60px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f4f7fb',
      minHeight: '100vh',
      color: '#333',
    }}>
      <h1 style={{ fontWeight: '700', fontSize: '2.8rem', marginBottom: '10px' }}>
        Welcome back, Admin!
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '40px' }}>
        Here’s a quick overview of your platform statistics.
      </p>

      <div style={{
        display: 'flex',
        gap: '30px',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}>
        
        {/* Stat Cards */}
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          bgColor="#4A90E2"
        />

        <StatCard
          title="Songs Analysed"
          value={stats.songsAnalysed}
          icon="🎵"
          bgColor="#7ED321"
        />

        <StatCard
          title="Quiz Attempts"
          value={stats.quizAttempts}
          icon="📝"
          bgColor="#F5A623"
        />
      </div>

      {/* Most Used Instruments Section */}
      <section style={{ marginTop: '50px' }}>
        <h2 style={{ fontWeight: '700', fontSize: '2rem', marginBottom: '20px' }}>
          Most Used Instruments
        </h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
        }}>
          {mostUsedInstruments.map((inst, idx) => (
            <div key={idx} style={{
              backgroundColor: '#fff',
              padding: '15px 20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              flex: '1 1 150px',
              textAlign: 'center',
            }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.4rem', color: '#4A90E2' }}>
                {inst.name}
              </h3>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '1.2rem' }}>
                {inst.usage} uses
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Quizzes Section */}
      <section style={{ marginTop: '50px' }}>
        <h2 style={{ fontWeight: '700', fontSize: '2rem', marginBottom: '20px' }}>
          Recent Quizzes
        </h2>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          maxWidth: '600px',
        }}>
          {recentQuizzes.map((quiz) => (
            <li key={quiz.id} style={{
              backgroundColor: '#fff',
              marginBottom: '12px',
              padding: '12px 20px',
              borderRadius: '10px',
              boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
              fontSize: '1.1rem',
              color: '#333',
            }}>
              🏆 {quiz.title}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

const StatCard = ({ title, value, icon, bgColor }) => {
  return (
    <div style={{
      flex: '1 1 250px',
      backgroundColor: bgColor,
      color: 'white',
      borderRadius: '12px',
      padding: '30px 25px',
      boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      transition: 'transform 0.3s ease',
      cursor: 'default',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        fontSize: '3.5rem',
        lineHeight: '1',
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px', fontWeight: '700', fontSize: '1.6rem' }}>
          {value}
        </h3>
        <p style={{ margin: 0, fontWeight: '500', fontSize: '1.1rem', opacity: 0.85 }}>
          {title}
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;

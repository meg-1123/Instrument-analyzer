import React from 'react';

const Home = () => {
  return (
    <main className="container-fluid py-5" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      <div className="row align-items-center text-white">
        {/* Left Content */}
        <div className="col-lg-6 mb-4 mb-lg-0 px-5">
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#d0a9f5' }}>
            Welcome to Instrumeta 🎶
          </h1>
          <p className="lead" style={{ color: '#cccccc' }}>
            Dive into a musical world where AI meets art! Instrumeta identifies musical instruments from your audio,
            connects it with movie trivia, offers quizzes, and helps you learn virtually with fun and ease.
          </p>
          <a href='/login' className="btn mt-4 btn-lg shadow" style={{ backgroundColor: '#d0a9f5', color: '#121212' }}>
            Login & Get Started
          </a>
        </div>

        {/* Right Image */}
        <div className="col-lg-6 text-center px-5">
          <img
            src="https://www.craftedny.com/wp-content/uploads/2018/09/how-to-design-your-music-website.jpg"
            alt="Artistic representation of musical instruments for the Instrumeta app"
            className="img-fluid rounded-4 shadow-lg"
            style={{ maxHeight: '400px', border: '4px solid #d0a9f5' }}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;

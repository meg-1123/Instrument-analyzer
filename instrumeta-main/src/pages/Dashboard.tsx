
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AudioWaveform, Music2, Guitar, Piano, Drum, FileUp, School, Library, HeadphonesIcon } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user || !JSON.parse(user).isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name || 'Musician'}</h1>
        <p className="text-muted-foreground mb-8">Explore music analysis, learn instruments, and test your knowledge</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-all hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <FileUp className="mr-2 h-5 w-5 text-music-purple" />
                Upload & Analyze
              </CardTitle>
              <CardDescription>
                Upload your music files for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <p>Upload audio files to identify instruments and extract detailed metadata.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/analyze')} className="w-full">
                Analyze Music
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-all hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <School className="mr-2 h-5 w-5 text-music-accent" />
                Learn Instruments
              </CardTitle>
              <CardDescription>
                Interactive instrument lessons
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <p>Learn to play piano, guitar with interactive virtual instruments.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/learn')} className="w-full">
                Start Learning
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-all hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <HeadphonesIcon className="mr-2 h-5 w-5 text-music-light-blue" />
                Music Quizzes
              </CardTitle>
              <CardDescription>
                Test your knowledge
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <p>Challenge yourself with quizzes about different musical instruments and theory.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/quiz')} className="w-full">
                Take a Quiz
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-all hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Library className="mr-2 h-5 w-5 text-green-500" />
                Your Library
              </CardTitle>
              <CardDescription>
                Your saved music and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <p>Access your uploaded songs, favorite lessons, and completed quizzes.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/library')} className="w-full">
                Open Library
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mt-12 mb-6">Available Instruments</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center justify-center gap-2"
            onClick={() => navigate('/learn/piano')}
          >
            <Piano className="h-12 w-12 text-music-purple" />
            <span>Piano</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center justify-center gap-2"
            onClick={() => navigate('/learn/guitar')}
          >
            <Guitar className="h-12 w-12 text-music-accent" />
            <span>Guitar</span>
          </Button>
          
          
          
          
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

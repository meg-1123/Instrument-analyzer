
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Guitar, Piano, Drum, Music2, BookOpen } from 'lucide-react';

const Learn = () => {
  const navigate = useNavigate();
  
  const instruments = [
    {
      icon: Piano,
      name: 'Piano',
      description: 'Learn piano basics, notes, scales, and playing techniques',
      path: '/learn/piano',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: Guitar,
      name: 'Guitar',
      description: 'Learn guitar chords, strumming patterns, and basic songs',
      path: '/learn/guitar',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      icon: Music2,
      name: 'Xylophone',
      description: 'Learn xylophone notes, techniques, and simple melodies',
      path: '/learn/xylophone',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: Drum,
      name: 'Drums',
      description: 'Learn drum basics, rhythms, and coordination exercises',
      path: '/learn/drums',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Learn Musical Instruments</h1>
            <p className="text-muted-foreground">Interactive lessons and virtual instruments to practice with</p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0 flex items-center"
            onClick={() => navigate('/dashboard')}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Learning Resources
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {instruments.map((instrument, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-md transition-all hover:-translate-y-1 border-2 ${instrument.borderColor}`}
            >
              <CardHeader className={`${instrument.bgColor} rounded-t-lg`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-xl">
                    <instrument.icon className={`mr-2 h-6 w-6 ${instrument.color}`} />
                    {instrument.name}
                  </CardTitle>
                </div>
                <CardDescription>
                  {instrument.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">1</div>
                    <span>Introduction to {instrument.name}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">2</div>
                    <span>Basic Notes and Techniques</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">3</div>
                    <span>Interactive Practice</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mr-3">4</div>
                    <span>Advanced Techniques</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate(instrument.path)}
                >
                  Start Learning
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Learn;

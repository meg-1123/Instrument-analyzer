
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Guitar, Piano, Drum, Music2, Award, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizCategory {
  icon: React.ElementType;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  id: string;
}

const QuizPage = () => {
  const navigate = useNavigate();
  
  const quizCategories: QuizCategory[] = [
    {
      icon: Guitar,
      name: 'Guitar Quiz',
      description: 'Test your knowledge of guitar parts, techniques, and music theory',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      id: 'guitar'
    },
    {
      icon: Piano,
      name: 'Piano Quiz',
      description: 'Challenge yourself with questions about piano keys, notes, and playing techniques',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      id: 'piano'
    },
    {
      icon: Music2,
      name: 'Xylophone Quiz',
      description: 'Test your knowledge of the xylophone, its history, and playing techniques',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      id: 'xylophone'
    },
    {
      icon: Drum,
      name: 'Drums Quiz',
      description: 'Quiz yourself on drum kit parts, rhythm patterns, and drumming styles',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      id: 'drums'
    }
  ];

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center space-x-2 mb-6">
          <Award className="h-6 w-6 text-yellow-500" />
          <h1 className="text-3xl font-bold">Music Quizzes</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Test your knowledge about different musical instruments and theory. Complete quizzes to track your progress!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-md transition-all hover:-translate-y-1">
              <CardHeader className={`${category.bgColor} rounded-t-lg`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <category.icon className={`mr-2 h-5 w-5 ${category.color}`} />
                    {category.name}
                  </CardTitle>
                  <span className="bg-white text-sm px-3 py-1 rounded-full font-medium text-gray-700">10 Questions</span>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span className="font-medium">Beginner</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Estimated time:</span>
                  <span className="font-medium">5 minutes</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/quiz/${category.id}`)}
                >
                  Start Quiz
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Your Quiz History</h2>
          
          <div className="rounded-lg overflow-hidden border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Guitar className="h-5 w-5 text-amber-500 mr-2" />
                      <div>Guitar Basics</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    April 4, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="font-medium">8/10</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      <Check className="h-4 w-4 mr-1" /> Passed
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Piano className="h-5 w-5 text-blue-500 mr-2" />
                      <div>Piano Keys</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    April 2, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="font-medium">5/10</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      <X className="h-4 w-4 mr-1" /> Failed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizPage;

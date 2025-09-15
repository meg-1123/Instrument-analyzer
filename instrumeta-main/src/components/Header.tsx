
import React from 'react';
import { Headphones, Music, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return user && JSON.parse(user).isLoggedIn;
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    });
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-background/90 border-b border-border px-6 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Headphones className="h-8 w-8 text-music-purple" />
            <div className="absolute -right-1 -bottom-1">
              <Music className="h-4 w-4 text-music-accent" />
            </div>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-music-purple to-music-accent bg-clip-text text-transparent">
            InstruMeta
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated() ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/learn')}
              >
                Learn
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/quiz')}
              >
                Quiz
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                How It Works
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                About
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                size="sm"
                onClick={() => navigate('/login')}
              >
                <Headphones className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

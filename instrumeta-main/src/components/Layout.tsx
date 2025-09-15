
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FileUp, Home, Menu, User, LogOut, 
  Music2, School, HeadphonesIcon, Library, Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    });
    navigate('/login');
  };
  
  const closeSheet = () => {
    setIsSheetOpen(false);
  };
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: FileUp, label: 'Upload & Analyze', path: '/analyze' },
    { icon: School, label: 'Learn', path: '/learn' },
    { icon: HeadphonesIcon, label: 'Quiz', path: '/quiz' },
    { icon: Library, label: 'Library', path: '/library' },
    { icon: User, label: 'Your Account', path: '/account' },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/90 border-b border-border px-6 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="relative">
                <Headphones className="h-8 w-8 text-music-purple" />
                <div className="absolute -right-1 -bottom-1">
                  <Music2 className="h-4 w-4 text-music-accent" />
                </div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-music-purple to-music-accent bg-clip-text text-transparent">
                SoundScape<span className="text-sm ml-1">Analyzer</span>
              </h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {menuItems.map((item, index) => (
                <Button 
                  key={index} 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(item.path)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col mt-8 space-y-4">
                  {menuItems.map((item, index) => (
                    <Button 
                      key={index} 
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => {
                        navigate(item.path);
                        closeSheet();
                      }}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Button>
                  ))}
                  
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      handleLogout();
                      closeSheet();
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 SoundScape Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

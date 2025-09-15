
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Headphones, Lock, Mail, Music, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('login');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Registration state
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, this would validate against a database
    if (email && password) {
      // Store user info in localStorage for this demo
      localStorage.setItem('user', JSON.stringify({
        email,
        name: email.split('@')[0],
        isLoggedIn: true
      }));
      
      toast({
        title: "Login successful!",
        description: "Welcome back to SoundScape Analyzer.",
      });
      
      navigate('/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (regEmail && regPassword && firstName && lastName) {
      // Store user info in localStorage for this demo
      localStorage.setItem('user', JSON.stringify({
        email: regEmail,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        isLoggedIn: true
      }));
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created. Welcome to SoundScape Analyzer!",
      });
      
      navigate('/dashboard');
    } else {
      toast({
        title: "Registration failed",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background/90 backdrop-blur-md border-b px-6 py-3">
        <div className="container mx-auto flex items-center gap-2">
          <div className="relative">
            <Headphones className="h-8 w-8 text-music-purple" />
            <div className="absolute -right-1 -bottom-1">
              <Music className="h-4 w-4 text-music-accent" />
            </div>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-music-purple to-music-accent bg-clip-text text-transparent">
            SoundScape<span className="text-sm ml-1">Analyzer</span>
          </h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-12 px-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to SoundScape</CardTitle>
            <CardDescription>
              Learn, analyze, and explore the world of music
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="you@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full" size="lg">
                    Login
                  </Button>
                  <p className="mt-4 text-sm text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <Button variant="link" className="p-0" onClick={() => setActiveTab('register')}>
                      Register
                    </Button>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="firstName" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="regEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="regEmail" 
                        type="email" 
                        placeholder="you@example.com" 
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="regPassword">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="regPassword" 
                        type="password" 
                        placeholder="••••••••" 
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full" size="lg">
                    Create Account
                  </Button>
                  <p className="mt-4 text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Button variant="link" className="p-0" onClick={() => setActiveTab('login')}>
                      Login
                    </Button>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 SoundScape Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;

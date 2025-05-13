
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, LogIn, FileText, Home, PenSquare } from 'lucide-react';

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="border-b shadow-sm py-4 bg-gradient-to-r from-background to-muted/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <FileText className="mr-2 text-blue-600" />
            <span className="gradient-text">SimpleBlog</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-primary flex items-center gap-1 transition-colors">
            <Home size={18} /> 
            <span>Home</span>
          </Link>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/new" className="text-foreground hover:text-primary flex items-center gap-1 transition-colors">
                    <PenSquare size={18} />
                    <span>Write</span>
                  </Link>
                  <div className="hidden md:block text-sm text-muted-foreground px-3 py-1.5 bg-muted/40 rounded-full">
                    {user.email}
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="flex items-center gap-1 hover:bg-red-100 hover:text-red-600"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="outline" className="flex items-center gap-1 border-blue-300 hover:border-blue-400 hover:bg-blue-50">
                    <LogIn size={18} />
                    Login
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPosts, Post } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Calendar, User } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { posts, error } = await getPosts();
        
        if (error) {
          setError(error.message);
        } else {
          setPosts(posts || []);
        }
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  if (error) {
    return (
      <div className="page-container">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error: {error}. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold"><span className="gradient-text">Blog Posts</span></h1>
        {user && (
          <Link to="/new">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus size={18} />
              New Post
            </Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden border border-border/50">
              <CardHeader className="pb-4">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="pb-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="border-t bg-muted/20 pt-4">
                <Skeleton className="h-4 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-b from-background to-muted/20 rounded-lg border border-border/50">
          <h2 className="text-2xl font-medium mb-4">No posts yet</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Be the first to share your thoughts with the world!
          </p>
          {user ? (
            <Link to="/new">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Create your first post
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Sign in to start posting
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post, index) => (
            <Card 
              key={post.id} 
              className={`post-card overflow-hidden border border-border/50 fade-in`} 
              style={{animationDelay: `${index * 100}ms`}}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-sm">
                  <Calendar size={14} className="text-muted-foreground" />
                  {formatDate(post.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-base text-foreground/90">
                  {truncateContent(post.content)}
                </div>
              </CardContent>
              {post.author_email && (
                <CardFooter className="border-t bg-muted/20 pt-4 flex items-center gap-2">
                  <User size={14} className="text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {post.author_email}
                  </p>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;

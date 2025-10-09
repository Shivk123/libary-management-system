import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, MessageSquare } from 'lucide-react';
import { mockFeedback } from '@/data/feedback';
import { mockUsers } from '@/data/groups';
import type { Feedback } from '@/types/feedback';

interface FeedbackFormData {
  title: string;
  comment: string;
  review: number;
  image: string;
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState(mockFeedback);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm<FeedbackFormData>();
  const [selectedRating, setSelectedRating] = useState(0);

  const onSubmit = (data: FeedbackFormData) => {
    const newFeedback: Feedback = {
      id: Date.now().toString(),
      userId: '1',
      bookId: '1',
      title: data.title,
      comment: data.comment,
      review: selectedRating,
      image: data.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
      createdAt: new Date()
    };
    
    setFeedback([newFeedback, ...feedback]);
    setIsCreateOpen(false);
    reset();
    setSelectedRating(0);
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={() => interactive && onRate && onRate(i + 1)}
      />
    ));
  };

  const getUserName = (userId: string) => {
    return mockUsers.find(u => u.id === userId)?.name || 'Anonymous';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">
            Book Feedback
          </h1>
          <p className="text-xl font-sans text-muted-foreground">
            Share your thoughts and reviews about books
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">Share Your Feedback</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image" className="text-base font-sans">Book Cover Image URL</Label>
                  <Input
                    id="image"
                    {...register('image')}
                    placeholder="https://example.com/book-cover.jpg"
                    className="text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="title" className="text-base font-sans">Feedback Title</Label>
                  <Input
                    id="title"
                    {...register('title', { required: true })}
                    placeholder="Enter a title for your feedback"
                    className="text-base"
                  />
                </div>
                <div>
                  <Label className="text-base font-sans">Rating</Label>
                  <div className="flex gap-1 mt-2">
                    {renderStars(selectedRating, true, setSelectedRating)}
                  </div>
                </div>
                <div>
                  <Label htmlFor="comment" className="text-base font-sans">Your Review</Label>
                  <Textarea
                    id="comment"
                    {...register('comment', { required: true })}
                    placeholder="Share your thoughts about this book..."
                    className="text-base min-h-32"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={selectedRating === 0}
                >
                  Submit Feedback
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedback.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  by {getUserName(item.userId)}
                </span>
              </div>
              
              <CardTitle className="text-lg font-serif mb-2 line-clamp-2">
                {item.title}
              </CardTitle>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">{renderStars(item.review)}</div>
                <Badge variant="secondary">{item.review}/5</Badge>
              </div>
              
              <p className="text-sm font-sans text-muted-foreground leading-relaxed line-clamp-3">
                {item.comment}
              </p>
              
              <div className="mt-3 text-xs text-muted-foreground">
                {item.createdAt.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {feedback.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2">No Feedback Yet</h3>
            <p className="text-muted-foreground">
              Be the first to share your thoughts about a book!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
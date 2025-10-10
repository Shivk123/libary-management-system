import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, IndianRupee, Clock } from 'lucide-react';
import { borrowingService } from '@/services/borrowingService';

interface ReturnRequest {
  id: string;
  book: { title: string; author: string; price: number };
  borrower: { name: string; email: string };
  borrowedAt: string;
  dueDate: string;
  returnRequestedAt: string;
  status: string;
}

export default function ReturnRequests() {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(null);
  const [damageType, setDamageType] = useState<string>('none');
  const [borrowDate, setBorrowDate] = useState<string>('');

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  const fetchReturnRequests = async () => {
    try {
      setLoading(true);
      const data = await borrowingService.getReturnRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch return requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateFine = (request: ReturnRequest, damage: string, customBorrowDate?: string) => {
    const borrowedDate = new Date(customBorrowDate || request.borrowedAt);
    const dueDate = new Date(borrowedDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from borrow date
    const now = new Date();
    const daysLate = Math.max(0, Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    let fine = 0;
    
    // Lost book: charge lost book fee + late fees (exclude small/large damage)
    if (damage === 'lost') {
      fine += request.book.price * 2; // Lost book: 200% of book price
      if (daysLate > 0) {
        fine += daysLate * 50; // Late fee: ₹50 per day
      }
    } else {
      // If returned after deadline: Missing book fee (200%) + Late fee (₹50/day)
      if (daysLate > 0) {
        fine += request.book.price * 2; // Missing book fee: 200% of book price
        fine += daysLate * 50; // Late fee: ₹50 per day
      }
      
      // Additional damage fees
      if (damage === 'small') {
        fine += request.book.price * 0.1;
      } else if (damage === 'large') {
        fine += request.book.price * 0.5;
      }
    }
    
    return fine;
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    try {
      setProcessingId(selectedRequest.id);
      const fine = calculateFine(selectedRequest, damageType, borrowDate);
      
      await borrowingService.approveReturn(selectedRequest.id, {
        damageType,
        fine
      });
      
      await fetchReturnRequests();
      setSelectedRequest(null);
      setDamageType('none');
      setBorrowDate('');
    } catch (err) {
      console.error('Failed to approve return:', err);
      alert('Failed to approve return. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      await borrowingService.rejectReturn(requestId);
      await fetchReturnRequests();
    } catch (err) {
      console.error('Failed to reject return:', err);
      alert('Failed to reject return. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const getDaysLate = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    return Math.max(0, Math.ceil((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return <div className="p-6">Loading return requests...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">
          Return Requests
        </h1>
        <p className="text-xl font-sans text-muted-foreground">
          Review and process book return requests from users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Return Requests ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days Late</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => {
                const daysLate = getDaysLate(request.dueDate);
                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.book.title}</p>
                        <p className="text-sm text-muted-foreground">by {request.book.author}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <IndianRupee className="h-3 w-3" />
                          {request.book.price}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.borrower.name}</p>
                        <p className="text-sm text-muted-foreground">{request.borrower.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={daysLate > 0 ? 'text-red-600' : 'text-green-600'}>
                        {new Date(request.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {daysLate > 0 ? (
                        <Badge variant="destructive">{daysLate} days</Badge>
                      ) : (
                        <Badge variant="default">On time</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(request.returnRequestedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              onClick={() => setSelectedRequest(request)}
                              disabled={processingId === request.id}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Process Payment Request</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Book: {selectedRequest?.book.title}</Label>
                                <p className="text-sm text-muted-foreground">
                                  Borrower: {selectedRequest?.borrower.name}
                                </p>
                              </div>

                              <div>
                                <Label htmlFor="borrowDate">Borrow Date</Label>
                                <Input
                                  id="borrowDate"
                                  type="date"
                                  value={borrowDate || (selectedRequest ? new Date(selectedRequest.borrowedAt).toISOString().split('T')[0] : '')}
                                  onChange={(e) => setBorrowDate(e.target.value)}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="damage">Damage Assessment</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <Button
                                    type="button"
                                    variant={damageType === 'none' ? 'default' : 'outline'}
                                    onClick={() => setDamageType('none')}
                                    className="h-auto p-3 text-left"
                                  >
                                    <div>
                                      <div className="font-medium">No Damage</div>
                                      <div className="text-xs text-muted-foreground">Book in good condition</div>
                                    </div>
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={damageType === 'small' ? 'default' : 'outline'}
                                    onClick={() => setDamageType('small')}
                                    className="h-auto p-3 text-left"
                                  >
                                    <div>
                                      <div className="font-medium">Small Damage</div>
                                      <div className="text-xs text-muted-foreground">10% of book price</div>
                                    </div>
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={damageType === 'large' ? 'default' : 'outline'}
                                    onClick={() => setDamageType('large')}
                                    className="h-auto p-3 text-left"
                                  >
                                    <div>
                                      <div className="font-medium">Large Damage</div>
                                      <div className="text-xs text-muted-foreground">50% of book price</div>
                                    </div>
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={damageType === 'lost' ? 'default' : 'outline'}
                                    onClick={() => setDamageType('lost')}
                                    className="h-auto p-3 text-left"
                                  >
                                    <div>
                                      <div className="font-medium">Lost/Missing</div>
                                      <div className="text-xs text-muted-foreground">200% of book price</div>
                                    </div>
                                  </Button>
                                </div>
                              </div>

                              <div>
                                <Label>Total Fine to be Paid</Label>
                                <div className="p-4 bg-muted rounded border">
                                  <div className="text-sm space-y-2">
                                    {selectedRequest && (() => {
                                      const borrowedDate = new Date(borrowDate || selectedRequest.borrowedAt);
                                      const dueDate = new Date(borrowedDate.getTime() + (30 * 24 * 60 * 60 * 1000));
                                      const now = new Date();
                                      const daysLate = Math.max(0, Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
                                      return daysLate > 0 && damageType !== 'lost' && (
                                        <>
                                          <div className="flex justify-between">
                                            <span>Missing book fee (200%):</span>
                                            <span>₹{selectedRequest.book.price * 2}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Late fee ({daysLate} days × ₹50):</span>
                                            <span>₹{daysLate * 50}</span>
                                          </div>
                                        </>
                                      );
                                    })()}
                                    {damageType === 'lost' && selectedRequest && (() => {
                                      const borrowedDate = new Date(borrowDate || selectedRequest.borrowedAt);
                                      const dueDate = new Date(borrowedDate.getTime() + (30 * 24 * 60 * 60 * 1000));
                                      const now = new Date();
                                      const daysLate = Math.max(0, Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
                                      return (
                                        <>
                                          <div className="flex justify-between">
                                            <span>Lost/Missing book (200%):</span>
                                            <span>₹{selectedRequest.book.price * 2}</span>
                                          </div>
                                          {daysLate > 0 && (
                                            <div className="flex justify-between">
                                              <span>Late fee ({daysLate} days × ₹50):</span>
                                              <span>₹{daysLate * 50}</span>
                                            </div>
                                          )}
                                        </>
                                      );
                                    })()}
                                    {damageType === 'small' && selectedRequest && (
                                      <div className="flex justify-between">
                                        <span>Small damage (10%):</span>
                                        <span>₹{selectedRequest.book.price * 0.1}</span>
                                      </div>
                                    )}
                                    {damageType === 'large' && selectedRequest && (
                                      <div className="flex justify-between">
                                        <span>Large damage (50%):</span>
                                        <span>₹{selectedRequest.book.price * 0.5}</span>
                                      </div>
                                    )}
                                    <div className="border-t pt-2 mt-2">
                                      <div className="flex justify-between font-bold text-lg">
                                        <span>Total Fine:</span>
                                        <span className="text-red-600">₹{selectedRequest ? calculateFine(selectedRequest, damageType, borrowDate) : 0}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button onClick={handleApprove} className="flex-1">
                                  Send Payment Request
                                </Button>
                                <Button variant="outline" onClick={() => {
                                  setSelectedRequest(null);
                                  setDamageType('none');
                                  setBorrowDate('');
                                }} className="flex-1">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          disabled={processingId === request.id}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {requests.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-semibold mb-2">No Pending Requests</h3>
              <p className="text-muted-foreground">
                All return requests have been processed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
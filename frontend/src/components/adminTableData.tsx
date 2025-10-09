import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Trash2, BookOpen, XCircle } from "lucide-react";

type DamageStatus = "None" | "10%" | "50%" | "Lost";

interface Book {
    id: number;
    title: string;
    author: string;
}

interface BorrowRecord {
    id: number;
    name: string;
    bookTitle: string;
    date: string; // ISO date (yyyy-mm-dd)
    dueOn: string; // ISO date
    fine: number;
    damage: DamageStatus;
}

export default function LibraryPage(): JSX.Element {
    const [books, setBooks] = useState<Book[]>(() => sampleBooks());
    const [borrowed, setBorrowed] = useState<BorrowRecord[]>(() => sampleBorrowed());
    const [query, setQuery] = useState<string>("");
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [borrowerName, setBorrowerName] = useState<string>("");

    useEffect(() => {
        try {
            localStorage.setItem("borrowed_books", JSON.stringify(borrowed));
        } catch (e) {
            // ignore localStorage errors in environments where it's not available
            // console.warn("Could not persist to localStorage", e);
        }
    }, [borrowed]);

    function sampleBooks(): Book[] {
        return [
            { id: 1, title: "Data Structures in Java", author: "Narasimha Karumanchi" },
            { id: 2, title: "Introduction to Algorithms", author: "Cormen et al." },
            { id: 3, title: "Modern Architecture", author: "Le Corbusier" },
            { id: 4, title: "World History", author: "Norman Davies" },
            { id: 5, title: "Clean Code", author: "Robert C. Martin" },
        ];
    }

    function sampleBorrowed(): BorrowRecord[] {
        // initial dummy data
        return [
            {
                id: 1001,
                name: "Alice Johnson",
                bookTitle: "Data Structures in Java",
                date: "2025-09-25",
                dueOn: "2025-10-09",
                fine: 50,
                damage: "10%",
            },
            {
                id: 1002,
                name: "Ravi Sharma",
                bookTitle: "Introduction to Algorithms",
                date: "2025-09-28",
                dueOn: "2025-10-12",
                fine: 0,
                damage: "None",
            },
            {
                id: 1003,
                name: "Priya Mehta",
                bookTitle: "Clean Code",
                date: "2025-09-20",
                dueOn: "2025-10-04",
                fine: 30,
                damage: "50%",
            },
            {
                id: 1004,
                name: "Rahul Das",
                bookTitle: "World History",
                date: "2025-09-29",
                dueOn: "2025-10-13",
                fine: 0,
                damage: "Lost",
            },
        ];
    }

    function handleBorrow(book: Book): void {
        if (!borrowerName.trim()) {
            void window.alert("Enter borrower name first.");
            return;
        }

        const today = new Date();
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + 14);

        const record: BorrowRecord = {
            id: Date.now(),
            name: borrowerName.trim(),
            bookTitle: book.title,
            date: today.toISOString().slice(0, 10),
            dueOn: dueDate.toISOString().slice(0, 10),
            fine: 0,
            damage: "None",
        };
        setBorrowed((prev) => [...prev, record]);
        setBorrowerName("");
        setSelectedBook(null);
    }

    function handleReturn(id: number): void {
        if (!window.confirm("Mark as returned?")) return;
        setBorrowed((prev) => prev.filter((b) => b.id !== id));
    }

    function handleRemoveFine(id: number): void {
        setBorrowed((prev) => prev.map((b) => (b.id === id ? { ...b, fine: 0 } : b)));
    }

    function handleDamageChange(id: number, value: DamageStatus): void {
        setBorrowed((prev) => prev.map((b) => (b.id === id ? { ...b, damage: value } : b)));
    }

    // calculate fines once on mount based on dueOn (keeps demo simple)
    useEffect(() => {
        const updated = borrowed.map((b) => {
            const today = new Date();
            const due = new Date(b.dueOn);
            const diffDays = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays > 0 ? { ...b, fine: diffDays * 10 } : b;
        });
        setBorrowed(updated);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredBooks = books.filter((b) => b.title.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <Card className="shadow-lg">
                <CardHeader className="flex justify-between items-center">
                    <div>
                        <CardTitle>Library Books</CardTitle>
                        <p className="text-sm text-muted-foreground">List of available books</p>
                    </div>
                    <Input
                        placeholder="Search books..."
                        className="w-60"
                        value={query}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBooks.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" onClick={() => setSelectedBook(book)}>
                                                    <BookOpen className="h-4 w-4 mr-2" /> Borrow
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Borrow Book</DialogTitle>
                                                    <DialogDescription>
                                                        Enter the borrower name for <strong>{book.title}</strong>
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <Input
                                                    placeholder="Borrower name"
                                                    value={borrowerName}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBorrowerName(e.target.value)}
                                                />
                                                <DialogFooter>
                                                    <Button onClick={() => handleBorrow(book)}>Confirm Borrow</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Borrowed Records</CardTitle>
                    <p className="text-sm text-muted-foreground">Books currently borrowed by users</p>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Borrower</TableHead>
                                <TableHead>Book Title</TableHead>
                                <TableHead>Borrowed On</TableHead>
                                <TableHead>Due On</TableHead>
                                <TableHead>Fine (₹)</TableHead>
                                <TableHead>Damage %</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {borrowed.length ? (
                                borrowed.map((b) => (
                                    <TableRow key={b.id}>
                                        <TableCell>{b.name}</TableCell>
                                        <TableCell>{b.bookTitle}</TableCell>
                                        <TableCell>{b.date}</TableCell>
                                        <TableCell>{b.dueOn}</TableCell>
                                        <TableCell>{b.fine}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={b.damage}
                                                onValueChange={(v: string) => handleDamageChange(b.id, v as DamageStatus)}
                                            >
                                                <SelectTrigger className="w-[120px]">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="None">None</SelectItem>
                                                    <SelectItem value="10%">10%</SelectItem>
                                                    <SelectItem value="50%">50%</SelectItem>
                                                    <SelectItem value="Lost">Lost</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="text-right flex justify-end gap-2">
                                            {b.fine > 0 && (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleRemoveFine(b.id)}
                                                    title="Remove Fine"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm" onClick={() => handleReturn(b.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        No borrowed books found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

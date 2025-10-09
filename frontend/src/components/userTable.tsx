import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2, Edit } from "lucide-react";

export default function BorrowersTable() {
    const [borrowers, setBorrowers] = useState(() => {
        try {
            const raw = localStorage.getItem("borrowers_list");
            return raw ? JSON.parse(raw) : sampleData();
        } catch {
            return sampleData();
        }
    });

    const [query, setQuery] = useState("");
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({
        name: "",
        book: "",
        borrowedOn: "",
        dueOn: "",
    });

    useEffect(() => {
        localStorage.setItem("borrowers_list", JSON.stringify(borrowers));
    }, [borrowers]);

    function sampleData() {
        return [
            {
                id: 1,
                name: "Aisha Rao",
                book: "Civic Architecture",
                borrowedOn: "2025-09-24",
                dueOn: "2025-10-08",
            },
            {
                id: 2,
                name: "Rahul Singh",
                book: "Advanced Java",
                borrowedOn: "2025-09-30",
                dueOn: "2025-10-14",
            },
            {
                id: 3,
                name: "Meera Patel",
                book: "World History",
                borrowedOn: "2025-10-01",
                dueOn: "2025-10-15",
            },
        ];
    }

    function resetForm() {
        setForm({ name: "", book: "", borrowedOn: "", dueOn: "" });
        setEditing(null);
    }

    function handleAdd() {
        if (!form.name.trim() || !form.book.trim()) return;
        const nextId = borrowers.length
            ? Math.max(...borrowers.map((b: any) => b.id)) + 1
            : 1;
        setBorrowers((s: any) => [
            ...s,
            {
                id: nextId,
                name: form.name.trim(),
                book: form.book.trim(),
                borrowedOn: form.borrowedOn || getToday(),
                dueOn: form.dueOn || "",
            },
        ]);
        resetForm();
    }

    function handleEditSave() {
        if (!editing) return;
        setBorrowers((s: any) =>
            s.map((b: any) => (b.id === editing.id ? { ...b, ...form } : b))
        );
        resetForm();
    }

    function handleDelete(id: number) {
        if (!confirm("Delete this record?")) return;
        setBorrowers((s: any) => s.filter((b: any) => b.id !== id));
    }

    function openEdit(b: any) {
        setDialogMode("edit");
        setEditing(b);
        setForm({
            name: b.name,
            book: b.book,
            borrowedOn: b.borrowedOn,
            dueOn: b.dueOn,
        });
    }

    function getToday() {
        const d = new Date();
        return d.toISOString().slice(0, 10);
    }

    const filtered = borrowers.filter((b: any) => {
        const q = query.toLowerCase();
        return (
            b.name.toLowerCase().includes(q) ||
            b.book.toLowerCase().includes(q) ||
            b.borrowedOn.includes(q) ||
            (b.dueOn || "").includes(q)
        );
    });

    return (
        <Card className="max-w-6xl mx-auto mt-8 shadow-lg border border-gray-200">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <CardTitle className="text-lg font-semibold">
                        Borrowers
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                        List of users who borrowed books
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search by name, book or date..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-56"
                    />

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                    setDialogMode("add");
                                    resetForm();
                                }}
                            >
                                Add borrower
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>
                                    {dialogMode === "add"
                                        ? "Add borrower"
                                        : "Edit borrower"}
                                </DialogTitle>
                                <DialogDescription>
                                    {dialogMode === "add"
                                        ? "Enter the borrower's details below."
                                        : "Update borrower details and click Save."}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-3 py-4">
                                <label className="grid gap-1">
                                    <span className="text-sm font-medium text-gray-700">
                                        Name
                                    </span>
                                    <Input
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, name: e.target.value }))
                                        }
                                    />
                                </label>

                                <label className="grid gap-1">
                                    <span className="text-sm font-medium text-gray-700">
                                        Book Title
                                    </span>
                                    <Input
                                        value={form.book}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, book: e.target.value }))
                                        }
                                    />
                                </label>

                                <div className="grid grid-cols-2 gap-3">
                                    <label className="grid gap-1">
                                        <span className="text-sm font-medium text-gray-700">
                                            Borrowed On
                                        </span>
                                        <Input
                                            type="date"
                                            value={form.borrowedOn}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    borrowedOn: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>

                                    <label className="grid gap-1">
                                        <span className="text-sm font-medium text-gray-700">
                                            Due On
                                        </span>
                                        <Input
                                            type="date"
                                            value={form.dueOn}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, dueOn: e.target.value }))
                                            }
                                        />
                                    </label>
                                </div>
                            </div>

                            <DialogFooter>
                                {dialogMode === "add" ? (
                                    <Button onClick={handleAdd}>Add</Button>
                                ) : (
                                    <Button onClick={handleEditSave}>Save</Button>
                                )}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>

            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Book</TableHead>
                                <TableHead>Borrowed On</TableHead>
                                <TableHead>Due On</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filtered.length ? (
                                filtered.map((b: any) => (
                                    <TableRow key={b.id}>
                                        <TableCell>{b.name}</TableCell>
                                        <TableCell>{b.book}</TableCell>
                                        <TableCell>{b.borrowedOn}</TableCell>
                                        <TableCell>{b.dueOn || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEdit(b)}
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4 text-blue-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(b.id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No borrowers found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

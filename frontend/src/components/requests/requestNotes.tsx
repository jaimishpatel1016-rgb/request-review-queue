"use client";

import { useState } from "react";
import { useAddNote } from "@/hooks/use-request-mutations";
import { formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Note } from "@/types/request";

export default function RequestNotes({ id, notes }: { id: string; notes: Note[] }) {
  const [noteText, setNoteText] = useState("");
  const addNoteMutation = useAddNote(id, () => setNoteText(""));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (noteText.trim()) addNoteMutation.mutate(noteText.trim());
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Add a note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!noteText.trim() || addNoteMutation.isPending}
          >
            {addNoteMutation.isPending ? "Adding..." : "Add"}
          </Button>
        </form>
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {notes.map((note) => (
              <div key={note._id} className="flex flex-col gap-1">
                <p className="text-sm">{note.note}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(note.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  noteCount?: number;
}

export interface NoteTag {
  tagId: number;
  tag: Tag;
}

export interface Reminder {
  id: number;
  noteId: number;
  remindAt: string;
  message: string;
  fired: boolean;
  createdAt: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  noteDate: string;
  tags: NoteTag[];
  reminders: Reminder[];
}

export interface CreateNoteRequest {
  title: string;
  content?: string;
  noteDate?: string;
  tagIds?: number[];
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  noteDate?: string;
  tagIds?: number[];
}

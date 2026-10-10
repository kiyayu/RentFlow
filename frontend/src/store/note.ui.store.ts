//src/store/note.ui.store.ts
import { create } from "zustand";

type NoteUiStore = {
    isCreateModalOpen:boolean
    isEditModalOpen:boolean
    activeNoteId:string | null
    
    setCreateModalOpen: (open:boolean) => void
    setEditModalOpen: (open:boolean, noteId:string |null) => void
}

export const  useNoteUiStore = create<NoteUiStore>((set) => ({
    isCreateModalOpen:false,
    isEditModalOpen:false,
    activeNoteId:null,
    setCreateModalOpen:(open) => set({isCreateModalOpen:open}),
    setEditModalOpen:(open, noteId=null) => set({isEditModalOpen:open, activeNoteId:noteId})
}))
import { create } from "zustand";

type TaskNoteUi = {
isCeateModalopen:boolean;
isEditModalOpen:boolean;
activeId:string | null;
setCreateModal:(open:boolean) => void;
setEditModal:(open:boolean, taskId:string | null) => void
}

export const useTaskUiStore = create<TaskNoteUi>((set) => ({
    isCeateModalopen:false,
    isEditModalOpen:false,
    activeId:null,
    //action
    setCreateModal:(open) => set({isCeateModalopen:open}),
    setEditModal:(open, taskId=null) => set({isEditModalOpen:open, activeId:taskId})
}))
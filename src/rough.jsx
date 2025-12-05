import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import {
  createModel,
  updateModel,
  deleteModel,
  getDeletedModel,
  restoreDeletedModel,
  getModel,
} from "@/apis/manageuser/manageuser"; // adjust path
import UniversalButton from "@/components/common/UniversalButton";
import InputField from "@/components/common/InputField";
import UniversalSkeleton from "@/components/common/UniversalSkeleton";
import { Edit2 } from "react-feather";
import { MdOutlineDeleteForever } from "react-icons/md";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { HiDevicePhoneMobile } from "react-icons/hi2";
import { FiSearch } from "react-icons/fi";

export default function ManageModels() {
  const [models, setModels] = useState([]);
  const [deletedModels, setDeletedModels] = useState([]);
  const [search, setSearch] = useState("");

  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modelName, setModelName] = useState("");
  const [editId, setEditId] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [showDeletedDrawer, setShowDeletedDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const toast = useRef(null);

  const safeToast = (severity, summary, detail, life = 4000) => {
    toast.current?.show({ severity, summary, detail, life });
  };

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await getModel();
      setModels(res?.data || []);
    } catch (err) {
      console.error("fetchModels", err);
      safeToast("error", "Failed to load models", err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedModels = async () => {
    try {
      const res = await getDeletedModel();
      setDeletedModels(res?.data || []);
    } catch (err) {
      console.error("fetchDeletedModels", err);
      safeToast("error", "Failed to load deleted models", err?.message || "Unexpected error");
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const openAddDialog = () => {
    setModelName("");
    setEditMode(false);
    setEditId(null);
    setShowDialog(true);
  };

  const openEditDialog = (item) => {
    setEditMode(true);
    setModelName(item.model || "");
    setEditId(item.id);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!modelName?.trim()) {
      safeToast("warn", "Validation", "Model name cannot be empty");
      return;
    }
    setActionLoading(true);
    try {
      if (editMode) {
        await updateModel({ id: editId, model: modelName });
        safeToast("success", "Updated", "Model updated successfully");
      } else {
        await createModel({ model: modelName });
        safeToast("success", "Created", "Model created successfully");
      }
      setShowDialog(false);
      fetchModels();
    } catch (err) {
      console.error("handleSave", err);
      safeToast("error", "Save failed", err?.message || "Unexpected error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  const confirmDeleteAction = async () => {
    setActionLoading(true);
    try {
      await deleteModel(deleteId);
      safeToast("success", "Deleted", "Model deleted");
      setConfirmDelete(false);
      fetchModels();
      // refresh deleted list if drawer open
      if (showDeletedDrawer) fetchDeletedModels();
    } catch (err) {
      console.error("confirmDeleteAction", err);
      safeToast("error", "Delete failed", err?.message || "Unexpected error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async (id) => {
    setActionLoading(true);
    try {
      await restoreDeletedModel(id);
      safeToast("success", "Restored", "Model restored successfully");
      fetchDeletedModels();
      fetchModels();
    } catch (err) {
      console.error("handleRestore", err);
      safeToast("error", "Restore failed", err?.message || "Unexpected error");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredModels = models.filter((m) =>
    (m.model || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Toast ref={toast} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Models Management</h1>
          <p className="text-sm text-slate-500 mt-1">Create, edit and restore models.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <InputField
              placeholder="Search models..."
              className="w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              rightIcon={<FiSearch className="text-slate-400" />}
            />
          </div>

          <div className="flex gap-2">
            <UniversalButton
              label="Deleted Models"
              onClick={() => {
                fetchDeletedModels();
                setShowDeletedDrawer(true);
              }}
            />
            <UniversalButton label="Add Model" onClick={openAddDialog} />
          </div>
        </div>
      </div>

      {/* Content area */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 gap-5 col-span-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 col-span-full">
              {[...Array(8)].map((_, i) => (
                <UniversalSkeleton key={i} height="7rem" width="100%" className="rounded-2xl" />
              ))}
            </div>
          </div>
        ) : filteredModels.length === 0 ? (
          <div className="col-span-full text-center flex items-center justify-center text-slate-500 py-6 md:h-115 lg:h-120 xl:h-130 2xl:h-150 overflow-auto">
            <div className="flex flex-col items-center justify-center w-full py-10 text-center text-slate-500">
              <div className="flex items-center justify-center w-16 h-16 mb-3 rounded-2xl bg-slate-100 shadow-sm">
                {/* search off icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-slate-600">No models Found</h2>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or adding a new model.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredModels.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="p-4 rounded-2xl shadow-lg bg-white flex justify-between items-center"
              >
                <div>
                  <div className="text-sm text-slate-400">Model</div>
                  <div className="text-lg font-medium text-slate-800">{item.model}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditDialog(item)}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 transition border border-slate-100"
                    aria-label="edit"
                    title="Edit"
                  >
                    <Edit2 size={18} className="text-slate-600" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition border border-red-100"
                    aria-label="delete"
                    title="Delete"
                  >
                    <MdOutlineDeleteForever size={18} className="text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog
        header={editMode ? "Edit Model" : "Add Model"}
        visible={showDialog}
        style={{ width: "30rem" }}
        onHide={() => setShowDialog(false)}
        draggable={false}
      >
        <div className="flex flex-col gap-3">
          <InputField
            label={editMode ? "Update Model Name" : "Enter Model Name"}
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="Enter model name"
          />

          <div className="flex justify-end gap-3 mt-2">
            <UniversalButton label="Cancel" onClick={() => setShowDialog(false)} />
            <UniversalButton
              label={editMode ? "Update" : "Save"}
              onClick={handleSave}
            // disable while action running
            />
          </div>
        </div>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        header="Confirm Delete"
        visible={confirmDelete}
        style={{ width: "28rem" }}
        onHide={() => setConfirmDelete(false)}
        draggable={false}
      >
        <div className="flex flex-col items-center justify-center text-center px-4 py-3">
          <CancelOutlinedIcon sx={{ fontSize: 64, color: "#f44336", mb: 1 }} />

          <h2 className="text-[1.15rem] font-semibold text-gray-700 mb-2 flex gap-2 items-center">
            Delete Model <HiDevicePhoneMobile />
          </h2>

          <p className="text-gray-600 text-sm mb-4">You are about to delete this model.</p>

          <div className="bg-gray-100 text-gray-800 font-medium rounded-md px-3 py-2 mb-4 w-full text-center break-words">
            {models.find((m) => m.id === deleteId)?.model || "Unnamed Model"}
          </div>

          <p className="text-gray-500 text-sm">
            This action is <span className="font-semibold text-red-600">recoverable</span> (it will be moved to Deleted
            Models).
          </p>

          <div className="flex justify-center gap-4 mt-5">
            <UniversalButton label="Cancel" onClick={() => setConfirmDelete(false)} />
            <UniversalButton
              label="Delete"
              onClick={confirmDeleteAction}
              style={{ backgroundColor: "#dc2626" }}
            />
          </div>
        </div>
      </Dialog>

      {/* Deleted Drawer */}
      <Sidebar visible={showDeletedDrawer} position="right" onHide={() => setShowDeletedDrawer(false)}>
        <div className="w-[420px] max-w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Deleted Models</h2>
            <div className="text-sm text-slate-500">{deletedModels.length} items</div>
          </div>

          <div className="space-y-3">
            {deletedModels.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m2 0a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3l-1-2H8L7 5H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16z" />
                  </svg>
                </div>
                <div className="text-sm">No deleted models</div>
              </div>
            ) : (
              deletedModels.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  className="p-3 rounded-xl shadow-sm bg-white flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm text-slate-400">{new Date(item.deletedAt || Date.now()).toLocaleString()}</div>
                    <div className="font-medium text-slate-800 break-words">{item.model}</div>
                  </div>

                  <div className="flex gap-2">
                    <UniversalButton label="Restore" onClick={() => handleRestore(item.id)} />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
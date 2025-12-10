import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { FileSpreadsheet, RefreshCw } from "lucide-react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { IconButton } from "@mui/material";
import { Dialog } from "primereact/dialog";
import LoopIcon from "@mui/icons-material/Loop";
import Chip from "@mui/material/Chip";
import { motion } from "framer-motion";
import {
  FileText,
  FilePlus,
  CheckCircle,
  Calendar,
  Smartphone,
  Hash,
  CheckSquare,
  PlusCircle,
  X,
  MessageSquare,
  Check,
  AlertCircle
} from "lucide-react";


import {
  getLeadData,
  createLead,
  getLeadDataLoginUser,
} from "@/apis/manageuser/manageuser";

import { exportToExcel } from "@/utils/exportToExcel";
import UniversalButton from "@/components/common/UniversalButton";
import Capsule from "@/components/common/Capsule";
import DataTable from "@/components/common/DataTable";
import CustomTooltip from "@/components/common/CustomTooltip";
import InputField from "@/components/common/InputField";
import UniversalTextArea from "@/components/common/UniversalTextArea";
import UniversalRadioButton from "@/components/common/UniversalRadioButton";
import UniversalSkeleton from "@/components/ui/UniversalSkeleton";
import { exportSurveyReport, exportSurveyReportUser, trackData } from "../apis/manageuser/manageuser";
import toast from "react-hot-toast";

const SurveyFormUser = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddLeadDialog, setOpenAddLeadDialog] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChip, setSelectedChip] = useState("");
  const [metaData, setMetaData] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  const issues = [
    "Affordability issue",
    "Product variant issue",
    "Geographical Location issue",
    "Other",
  ];

  const fetchLoginDataLogInUser = async () => {
    setIsLoading(true);
    try {
      const data = {
        page: page,
      }
      const res = await getLeadDataLoginUser(data);
      setUserData(res?.data);
      setMetaData(res?.meta);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginDataLogInUser();
  }, [page]);

  const [createLeadForm, setCreateLeadForm] = useState({
    remarks: "",
    imei: "",
    is_converted: false,
  });

  const handleAddLead = async (row) => {
    setRowData(row);
  };

  const handleSaveLead = async () => {

    if (createLeadForm.is_converted) {
      // Converted → IMEI required
      if (!createLeadForm.imei) {
        toast.error("IMEI number is required.");
        return;
      }

      if (!/^\d{15}$/.test(createLeadForm.imei)) {
        toast.error("IMEI must be a 15-digit numeric value.");
        return;
      }
    } else {
      // Not Converted → Reason required
      if (!selectedChip) {
        toast.error("Please select a reason for non-conversion.");
        return;
      }

      if (selectedChip === "Other" && !createLeadForm.remarks.trim()) {
        toast.error("Please enter remarks for 'Other' reason.");
        return;
      }
    }
    const data = {
      // remarks: createLeadForm?.remarks ? createLeadForm?.remarks : selectedChip,
      remarks:
        createLeadForm.is_converted
          ? createLeadForm.remarks
          : selectedChip === "Other"
            ? createLeadForm.remarks
            : selectedChip,
      // imei: createLeadForm?.imei,
      imei: createLeadForm.is_converted ? createLeadForm.imei : "",
      is_converted: createLeadForm?.is_converted,
      token_id: rowData?.id,
    };

    try {
      const res = await createLead(data);
      if (res.status === true) {
        setOpenAddLeadDialog(false);
        toast.success("Lead updated successfully!");
        fetchLoginDataLogInUser()
        setCreateLeadForm({
          remarks: "",
          imei: "",
          is_converted: false,
        });
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setSelectedChip("");
    }
  };

  const columns = [
    { Header: "Sr No", accessor: "srno", width: 80 },
    { Header: "Created At", accessor: "created_at", minWidth: 180, flex: 1 },
    {
      Header: "Consumer Name",
      accessor: "consumer_name",
      minWidth: 150,
      flex: 1,
    },
    {
      Header: "Contact Number",
      accessor: "contact_number",
      minWidth: 150,
      flex: 1,
    },
    { Header: "Email", accessor: "email", minWidth: 200, flex: 1 },
    { Header: "Model", accessor: "model", minWidth: 180, flex: 1 },
    { Header: "Source", accessor: "query", minWidth: 180, flex: 1 },
    { Header: "Query Type", accessor: "type", minWidth: 180, flex: 1 },
    // { Header: "Feedback", accessor: "message", minWidth: 180, flex: 1 },
    {
      Header: "Feedback",
      accessor: "message",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            style={{
              maxHeight: "100px",
              overflowY: "auto",
              padding: "2px",
              whiteSpace: "normal",
              wordBreak: "break-word",
              border: "1px solid #c3c3c3",
              borderRadius: "5px"
            }}
          >
            {params.row.message || "---"}
          </div>
        );
      },
    },

    { Header: "Status", accessor: "isCreated", minWidth: 180, flex: 1 },
    {
      Header: "Action",
      accessor: "action",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div>
          <CustomTooltip title="View Lead" placement="top" arrow>
            <IconButton
              className="text-xs"
              onClick={() => {
                // handleView(params.row);
                setRowData(params.row);
                setOpenDialog(true);
              }}
            >
              <InfoOutlinedIcon sx={{ fontSize: "1.2rem", color: "green" }} />
            </IconButton>
          </CustomTooltip>
          {params.row.isCreated === "Not Updated" && (
            <CustomTooltip title="Add Lead" placement="top" arrow>
              <IconButton
                className="text-xs"
                onClick={() => {
                  handleAddLead(params.row);
                  setOpenAddLeadDialog(true);
                }}
              >
                <FilePlus
                  className="w-4.5 h-4.5 text-blue-600"
                />
              </IconButton>
            </CustomTooltip>
          )}
        </div>
      ),
    },
  ];

  const exportOnlyColumns = [
    { Header: "Sr No", accessor: "srno" },
    { Header: "Submitted On", accessor: "created_at" },
    { Header: "Consumer Name", accessor: "consumer_name" },
    { Header: "Contact Number", accessor: "contact_number" },
    { Header: "Email", accessor: "email" },
    { Header: "Model", accessor: "model" },
    { Header: "Query", accessor: "query" },
    { Header: "Type", accessor: "type" },
    { Header: "Response Status", accessor: "isCreated" },

    // These are EXPORT-ONLY → never shown in table
    { Header: "Lead Status", accessor: "lead_status" },
    { Header: "Lead Created On", accessor: "lead_created_on" },
    { Header: "IMEI", accessor: "imei" },
    { Header: "Remarks", accessor: "remarks" },
  ];

  const tableData = userData.map((item, index) => ({
    // srno: index + 1,
    srno: ((metaData.current_page - 1) * metaData.per_page) + index + 1,
    created_at: moment(item.created_at).format("DD-MM-YYYY HH:mm A"),
    consumer_name: item.consumer_name || "-",
    contact_number: item.contact_number || "-",
    email: item.email || "-",
    model: item.model?.model || "-",
    query: item.query || "-",
    type: item.type || "-",
    isCreated: item.isCreated ? "Updated" : "Not Updated",
    lead_status: item.leads?.is_converted ? "Converted" : "Not Converted",
    lead_created_on: item.leads?.created_at
      ? moment(item.leads.created_at).format("DD-MM-YYYY HH:mm A")
      : "-",
    imei: item.leads?.imei || "-",
    remarks: item.leads?.remarks || "-",
    id: item.id,
    leads: item.leads,
    message: item.message,
  }));

  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const token = ""
      const res = await exportSurveyReportUser();

      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/octet-stream"
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Survey_Report_${moment().format("DD-MM-YYYY_HHmm")}.xlsx`;
      link.click();

      window.URL.revokeObjectURL(url);
      toast.success("Export completed!");
    } catch (err) {
      console.error(err)
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="">
      <div className="flex items-center lg:justify-between mb-5 lg:flex-nowrap flex-wrap justify-center gap-5">
        <h2 className="text-xl font-semibold ml-10">
          Survey Data{" "}
        </h2>

        <div className="flex items-center gap-5 flex-wrap justify-center">
          <UniversalButton
            icon={<RefreshCw className={isLoading ? "animate-spin scale-x-[-1]" : ""} size="18px" />}
            variant="secondary"
            onClick={fetchLoginDataLogInUser}
            label="Refresh"
          />
          {/* <UniversalButton
            icon={<FileSpreadsheet className="text-xs" size="18px" />}
            variant="secondary"
            onClick={() =>
              exportToExcel(exportOnlyColumns, tableData, `Survey_Data`)
            }
            label="Export Data"
          /> */}
          <UniversalButton
            icon={<FileSpreadsheet className="text-xs" size="18px" />}
            variant="secondary"
            onClick={handleExport}
            label="Export Data"
            isLoading={exporting}
            disabled={exporting}
          />
          <Capsule
            icon={FileSpreadsheet}
            label="Total Forms"
            value={metaData?.total || ""}
            variant="secondary"
            className="text-nowrap"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="">
          <UniversalSkeleton
            width="100%"
            height="80vh"
            className="rounded-2xl"
          />
        </div>
      ) : (
        <DataTable
          data={tableData}
          columns={columns}
          showCheckbox={false}
          height="718px"
          loading={isLoading}
          totalRecords={metaData?.total || 0}
          pageSize={pageSize}
          currentPage={page}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          onSort={(key, direction) => {
            // Add sorting if needed
          }}
          sortConfig={null}
          showPageSizeDropdown={false}
        />
      )}

      <Dialog
        header={
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-800">
              Lead Details
            </span>
          </div>
        }
        visible={openDialog}
        onHide={() => setOpenDialog(false)}
        draggable={false}
        resizable={false}
        style={{ width: "38rem", maxWidth: "95vw" }}
        className="rounded-2xl shadow-2xl overflow-hidden"
        footer={null} // We'll handle actions inside content for cleaner UX
      >
        <div className="">
          {/* No Lead Added */}
          {!rowData?.leads ? (
            <div className="text-center py-8 px-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-5">
                <FilePlus className="w-8 h-8 text-blue-600" />
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                No Lead Created Yet
              </h3>

              <p className="text-gray-600 text-sm max-w-sm mx-auto leading-relaxed mb-8">
                This response has not been converted into a lead. Click below to
                add lead details.
              </p>

              <UniversalButton
                label="Add Lead"
                icon={<PlusCircle className="w-5 h-5" />}
                onClick={() => {
                  setOpenDialog(false);
                  handleAddLead(rowData);
                  setOpenAddLeadDialog(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition-all"
              />
            </div>
          ) : (
            /* Lead Exists – Clean & Minimal Details */
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Lead Created
                </h3>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-medium ${rowData.leads.is_converted
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-amber-800"
                    }`}
                >
                  {rowData.leads.is_converted ? "Converted" : "Not Converted"}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="text-gray-600 text-xs font-medium mb-1">
                    Created On
                  </div>
                  <div className="font-semibold text-gray-900">
                    {moment(rowData.leads.created_at).format(
                      "DD MMM YYYY, hh:mm A"
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="text-gray-600 text-xs font-medium mb-1">
                    Model
                  </div>
                  <div className="font-semibold text-gray-900">
                    {rowData.model}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="text-gray-600 text-xs font-medium mb-1">
                    IMEI Number
                  </div>
                  <div className="font-mono font-bold text-gray-900">
                    {rowData.leads.imei || "—"}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="text-gray-600 text-xs font-medium mb-1">
                    Converted
                  </div>
                  <div
                    className={`font-bold ${rowData.leads.is_converted
                      ? "text-green-600"
                      : "text-orange-600"
                      }`}
                  >
                    {rowData.leads.is_converted ? "Yes" : "No"}
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="text-gray-600 text-xs font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Remarks
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {rowData.leads.remarks || "No remarks provided."}
                </p>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <UniversalButton
                  label="Close"
                  icon={<X className="w-5 h-5" />}
                  onClick={() => setOpenDialog(false)}
                  variant="secondary"
                  className="px-5 py-2.5 font-medium rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </Dialog>

      {/* <Dialog
        header="Add Lead"
        visible={openAddLeadDialog}
        style={{ width: "32rem" }}
        onHide={() => setOpenAddLeadDialog(false)}
        draggable={false}
      >
        <div className="flex flex-col gap-5 py-2">
          <label className="text-md font-semibold">Is Converted</label>
          <div className="flex items-center gap-4">
            <UniversalRadioButton
              name="is_converted"
              label="Yes"
              value="yes"
              checked={createLeadForm.is_converted === true}
              onChange={() =>
                setCreateLeadForm((prev) => ({
                  ...prev,
                  is_converted: true,
                }))
              }
            />

            <UniversalRadioButton
              name="is_converted"
              label="No"
              value="no"
              checked={createLeadForm.is_converted === false}
              onChange={() =>
                setCreateLeadForm((prev) => ({
                  ...prev,
                  is_converted: false,
                }))
              }
            />
          </div>

          {createLeadForm.is_converted ? (
            <div className="flex flex-col gap-2">
              <InputField
                name="imei"
                label="Enter IMEI No."
                value={createLeadForm.imei}
                onChange={(e) =>
                  setCreateLeadForm((prev) => ({
                    ...prev,
                    imei: e.target.value,
                  }))
                }
                type="text"
                placeholder="Enter IMEI No"
                tooltipContent="Enter IMEI No of the modal"
                tooltipPlacement="top"
                className="w-full"
              />
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap gap-2 my-6">
                {issues.map((item) => {
                  const isActive = selectedChip === item;

                  return (
                    <button
                      key={item}
                      onClick={() => setSelectedChip(item)}
                      className={`
              px-3 py-1 text-sm rounded-full border transition
              ${isActive
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                        }
            `}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              {selectedChip === "Other" && (
                <UniversalTextArea
                  label="Enter Specific Reason"
                  name="remarks"
                  value={createLeadForm.remarks}
                  placeholder="Add Remarks"
                  onChange={(e) =>
                    setCreateLeadForm((prev) => ({
                      ...prev,
                      remarks: e.target.value,
                    }))
                  }
                  className="w-full"
                  tooltipContent="Remarks"
                  tooltipPlacement="top"
                />
              )}
            </div>
          )}
          <div className="flex justify-center mt-4">
            <UniversalButton label="Save" onClick={handleSaveLead} />
          </div>
        </div>
      </Dialog> */}

      <Dialog
        header={
          <div className="flex items-center gap-3">
            <FilePlus className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-800">Add Lead</span>
          </div>
        }
        visible={openAddLeadDialog}
        onHide={() => setOpenAddLeadDialog(false)}
        draggable={false}
        resizable={false}
        style={{ width: "38rem", maxWidth: "95vw" }}
        className="rounded-2xl overflow-hidden shadow-2xl"
        footer={null}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className=""
        >
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Lead Conversion Status
            </h3>
            <p className="text-sm text-gray-600">
              Please specify whether this feedback has been converted into a lead.
            </p>
          </div>

          {/* Toggle Switch - Replaces Radio Buttons */}
          <div className="mb-6">
            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2 shadow-inner relative">
              <motion.div
                animate={{
                  x: createLeadForm.is_converted ? "100%" : "0%",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute w-1/2 h-12 bg-blue-600 rounded-xl shadow-lg"
                style={{ x: "-100%" }}
              />

              <button
                onClick={() => {
                  setCreateLeadForm(prev => ({
                    ...prev,
                    is_converted: false,
                    imei: "",           // Clear IMEI when not converted
                    remarks: "",        // Will be filled via chips/Other
                  }));
                  setSelectedChip(null); // Reset chip selection
                }}
                className={`relative z-10 flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center text-nowrap gap-2 ${!createLeadForm.is_converted
                  ? "text-white"
                  : "text-gray-700"
                  }`}
              >
                <X className="w-5 h-5" />
                Not Converted
              </button>

              <button
                onClick={() => {
                  setCreateLeadForm(prev => ({
                    ...prev,
                    is_converted: true,
                    imei: "",           // Keep IMEI if converted
                    remarks: "",        // Clear remarks when switching to Converted
                  }));
                  setSelectedChip(null); // Optional: reset chip selection
                }}
                className={`relative z-10 flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${createLeadForm.is_converted
                  ? "text-white"
                  : "text-gray-700"
                  }`}
              >
                <Check className="w-5 h-5" />
                Converted
              </button>
            </div>
          </div>

          {/* Conditional Fields */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {createLeadForm.is_converted ? (
              /* Converted = Yes → Show IMEI */
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
                  <div className="flex items-center gap-3 text-emerald-800 mb-4">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold text-sm">Lead Successfully Converted!</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    Please enter the device IMEI number below.
                  </p>
                </div>

                <InputField
                  label="IMEI Number"
                  name="imei"
                  value={createLeadForm.imei}
                  // onChange={(e) =>
                  //   setCreateLeadForm(prev => ({ ...prev, imei: e.target.value }))
                  // }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setCreateLeadForm(prev => ({ ...prev, imei: value }));
                    }
                  }}
                  placeholder="Enter 15-digit IMEI"
                  maxLength={15}
                  tooltipContent="IMEI No. must be 15 digit"
                  // icon={<Hash className="w-5 h-5 text-gray-500" />}
                  className="w-full"
                />
              </div>
            ) : (
              /* Not Converted → Show Reason Chips */
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
                  <div className="flex items-center gap-3 text-amber-800 mb-4">
                    <AlertCircle className="w-6 h-6" />
                    <span className="font-semibold text-md">Reason for Non-Conversion</span>
                  </div>
                  <p className="text-xs text-amber-700">
                    Please select the primary reason this lead was not converted.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {issues.map((item) => {
                    const isActive = selectedChip === item;
                    return (
                      <motion.button
                        key={item}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedChip(item);
                          if (item !== "Other") {
                            setCreateLeadForm(prev => ({ ...prev, remarks: item })); // Auto-fill remark
                          } else {
                            setCreateLeadForm(prev => ({ ...prev, remarks: "" }));   // Let user type
                          }
                        }}
                        className={`px-3 py-3 rounded-full font-medium text-sm transition-all shadow-sm border-2 ${isActive
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                          }`}
                      >
                        {item}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Other → Textarea */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: selectedChip === "Other" ? 1 : 0, y: selectedChip === "Other" ? 0 : -10 }}
                  className={selectedChip === "Other" ? "block" : "hidden"}
                >
                  <UniversalTextArea
                    label="Specify Reason"
                    name="remarks"
                    value={createLeadForm.remarks}
                    onChange={(e) =>
                      setCreateLeadForm(prev => ({ ...prev, remarks: e.target.value }))
                    }
                    placeholder="Please explain why this lead was not converted..."
                    icon={<MessageSquare className="w-5 h-5 text-gray-500" />}
                    rows={3}
                  />
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-200">
            <UniversalButton
              label="Cancel"
              variant="secondary"
              icon={<X className="w-5 h-5" />}
              onClick={() => setOpenAddLeadDialog(false)}
              className="px-6 py-3 font-medium rounded-xl"
            />

            <UniversalButton
              label="Save Lead"
              icon={<Check className="w-5 h-5" />}
              onClick={handleSaveLead}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all"
            />
          </div>
        </motion.div>
      </Dialog>
    </div>
  );
};

export default SurveyFormUser;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { FileSpreadsheet, RefreshCw } from "lucide-react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { IconButton } from "@mui/material";
import { Dialog } from "primereact/dialog";

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
} from "lucide-react";
import LoopIcon from "@mui/icons-material/Loop";

import {
  getLeadData,
  createLead,
  trackData,
} from "@/apis/manageuser/manageuser";

import InputField from "@/components/common/InputField";
import UniversalTextArea from "@/components/common/UniversalTextArea";
import UniversalRadioButton from "@/components/common/UniversalRadioButton";
import { useRoleContext } from "@/context/currentRoleContext";
import UniversalButton from "@/components/common/UniversalButton";
import CustomTooltip from "@/components/common/CustomTooltip";
import { exportToExcel } from "@/utils/exportToExcel";
import Capsule from "@/components/common/Capsule";
import DataTable from "@/components/common/DataTable";
import {
  exportSurveyReport,
  getUserFilledSurveyForms,
} from "../apis/manageuser/manageuser";
import UniversalSkeleton from "../components/ui/UniversalSkeleton";
import toast from "react-hot-toast";

const SurveyFormReport = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [openAddLeadDialog, setOpenAddLeadDialog] = useState(false);
  const [rowData, setRowData] = useState(null);

  const [forms, setForms] = useState(state?.forms || []);
  const [meta, setMeta] = useState(
    state?.meta || { current_page: 1, last_page: 1, per_page: 10, total: 0 }
  );
  const token = state?.token;
  const [page, setPage] = useState(meta.current_page);
  const [pageSize, setPageSize] = useState(meta.per_page);
  const [loading, setLoading] = useState(false);

  const [createLeadForm, setCreateLeadForm] = useState({
    remarks: "",
    imei: "",
    is_converted: false,
  });

  const handleAddLead = async (row) => {
    setRowData(row);
  };

  const handleSaveLead = async () => {
    const data = {
      remarks: createLeadForm?.remarks,
      imei: createLeadForm?.imei,
      is_converted: createLeadForm?.is_converted,
      token_id: rowData?.id,
    };
    try {
      const res = await createLead(data);
      setOpenAddLeadDialog(false);
      setCreateLeadForm({
        remarks: "",
        imei: "",
      });
      fetchForms(page, pageSize);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchForms = async (p = 1, ps = 10) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getUserFilledSurveyForms(token, {
        page: p,
        per_page: ps,
      });
      setForms(res.tokenResponse || []);
      setMeta(res.meta || { current_page: p, per_page: ps, total: 0 });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchForms(page, pageSize);
    }
  }, [page, pageSize, token]);

  if (!token || !state?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] p-10">
        <div className="bg-blue-50 p-8 rounded-2xl shadow-sm border border-blue-200 max-w-md text-center">
          <div className="flex justify-center mb-4">
            <FileSpreadsheet className="w-14 h-14 text-blue-500" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Survey Data Found
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            It seems there are no survey responses available for this user.
            <br />
            You can view survey details by navigating to the user profile.
          </p>

          <p className="text-gray-500 text-sm mb-6">
            Go to{" "}
            <span className="font-medium text-gray-700">User Management</span>→
            Click the{" "}
            <span className="font-medium text-blue-600">
              Survey Form Report &nbsp;
            </span>
            icon to view available user surveys.
          </p>
          <button
            onClick={() => navigate("/manageuser")}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow"
          >
            Go to User Management
          </button>
        </div>
      </div>
    );
  }

  // const forms = state.forms;

  const columns = [
    { Header: "Sr No", accessor: "srno", width: 80, flex: 0 },
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
    { Header: "Feedback", accessor: "type", minWidth: 180, flex: 1 },
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
          {/* <CustomTooltip title="Add Lead" placement="top" arrow>
            <IconButton
              className="text-xs"
              onClick={() => {
                handleAddLead(params.row);
                setOpenAddLeadDialog(true);
              }}
            >
              <InsertDriveFileIcon sx={{ fontSize: "1.2rem", color: "blue" }} />
            </IconButton>
          </CustomTooltip> */}
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
  const tableData = forms.map((item, index) => ({
    // srno: index + 1,
    srno: (meta.current_page - 1) * meta.per_page + index + 1,
    created_at: moment(item.created_at).format("DD-MM-YYYY HH:mm A"),
    consumer_name: item.consumer_name || "-",
    contact_number: item.contact_number || "-",
    email: item.email || "-",
    model: item.model?.model || "-",
    query: item.query || "-",
    type: item.type || "-",
    isCreated: item.isCreated ? "Updated" : "Not Updated",

    // These fields exist in data but NOT shown in UI
    lead_status: item.leads?.is_converted ? "Converted" : "Not Converted",
    lead_created_on: item.leads?.created_at
      ? moment(item.leads.created_at).format("DD-MM-YYYY HH:mm A")
      : "-",
    imei: item.leads?.imei || "-",
    remarks: item.leads?.remarks || "-",

    // Keep original for actions
    id: item.id,
    leads: item.leads,
  }));

  // const handleExport = async () => {
  //   try {
  //     const res = await exportSurveyReport(token);
  //     toast.success("File Downloaded Successfully");
  //   } catch (e) {
  //     toast.error("Error downloading file");
  //   }
  // };

  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await exportSurveyReport(token);

      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Survey_Report_${moment().format(
        "DD-MM-YYYY_HHmm"
      )}.xlsx`;
      link.click();

      window.URL.revokeObjectURL(url);
      toast.success("Export completed!");
    } catch (err) {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="">
      <div className="flex items-center lg:justify-between mb-5 lg:flex-nowrap flex-wrap justify-center gap-5">
        <h2 className="text-xl font-semibold ml-10">
          Survey Responses of - {state?.user?.name}
        </h2>
        <div className="flex items-center gap-5 flex-wrap justify-center">
          <UniversalButton
            icon={
              <RefreshCw
                className={loading ? "animate-spin scale-x-[-1]" : ""}
                size="18px"
              />
            }
            variant="secondary"
            onClick={() => fetchForms(page, pageSize)}
            label="Refresh"
          />
          {/* <UniversalButton
            icon={<FileSpreadsheet className="text-xs" size="18px" />}
            variant="secondary"
            onClick={() =>
              exportToExcel(
                exportOnlyColumns,
                tableData,
                `Survey_Responses_${state?.user?.name || "Export"}`
              )}
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
            value={meta.total}
            variant="secondary"
            className="text-nowrap"
          />
        </div>
      </div>

      {loading ? (
        <div className="">
          <UniversalSkeleton
            width="100%"
            height="644px"
            className="rounded-2xl"
          />
        </div>
      ) : (
        <DataTable
          data={tableData}
          columns={columns}
          showCheckbox={false}
          height="644px"
          loading={loading}
          totalRecords={meta.total}
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
                This response has not been converted into a lead.
              </p>

              {/* <UniversalButton
                label="Add Lead"
                icon={<PlusCircle className="w-5 h-5" />}
                onClick={() => {
                  setOpenDialog(false);
                  handleAddLead(rowData);
                  setOpenAddLeadDialog(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition-all"
              /> */}
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

      <Dialog
        header="Add Lead"
        visible={openAddLeadDialog}
        style={{ width: "32rem" }}
        onHide={() => setOpenAddLeadDialog(false)}
        draggable={false}
      >
        <div className="flex flex-col gap-5 py-2">
          <label className="text-md font-semibold">Is Converted</label>
          {/* Toggle */}
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
              {/* IMEI */}
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
              {/* Affordability issue,Product variant issue,Geographical Location issue,  */}
              {/* Remarks */}
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
            </div>
          ) : (
            <div>
              {/* Remarks */}
              <UniversalTextArea
                label="Remarks"
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
            </div>
          )}
          <div className="flex justify-center mt-4">
            <UniversalButton label="Save" onClick={handleSaveLead} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SurveyFormReport;

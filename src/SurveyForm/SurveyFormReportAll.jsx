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
import toast from "react-hot-toast";
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



import { allUsersList, allUserSurveyData, exportSurveyReport, exportSurveyReportUser, trackData } from "@/apis/manageuser/manageuser";

import { exportToExcel } from "@/utils/exportToExcel";
import UniversalButton from "@/components/common/UniversalButton";
import Capsule from "@/components/common/Capsule";
import DataTable from "@/components/common/DataTable";
import CustomTooltip from "@/components/common/CustomTooltip";
import InputField from "@/components/common/InputField";
import UniversalTextArea from "@/components/common/UniversalTextArea";
import UniversalRadioButton from "@/components/common/UniversalRadioButton";
import UniversalSkeleton from "@/components/ui/UniversalSkeleton";
import UniversalDatePicker from "@/components/common/UniversalDatePicker";
import DropdownWithSearch from "@/components/common/DropdownWithSearch";

const SurveyFormReportAll = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [openAddLeadDialog, setOpenAddLeadDialog] = useState(false);
    const [rowData, setRowData] = useState(null);
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [metaData, setMetaData] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

    const [filterData, setFilterData] = useState({
        vbaId: "",
        toDate: "",
        fromDate: "",
    });


    const fetchAllUsersDetails = async () => {
        try {
            setIsLoading(true);
            const res = await allUsersList();
            setAllUsers(res.data);
        } catch (e) {
            toast.error("Something went wrong! Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllUserSurveyForm = async () => {
        setIsLoading(true);
        try {
            const data = {
                page: page,
                ...filterData,
                fromDate: filterData.fromDate ? moment(filterData.fromDate).format("DD-MM-YYYY") : "",
                toDate: filterData.toDate ? moment(filterData.toDate).format("DD-MM-YYYY") : "",
                vbaId: selectedUser || "",
                // fromDate: "10-12-2025",
                // toDate: "10-12-2025",
            }
            const res = await allUserSurveyData(data);
            setUserData(res?.data || []);
            setMetaData(res.meta || {});
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsersDetails();
    }, []);
    useEffect(() => {
        fetchAllUserSurveyForm(page);
    }, [page]);

    const columns = [
        { Header: "Sr No", accessor: "srno", width: 80 },
        { Header: "Created At", accessor: "created_at", minWidth: 180, flex: 1 },
        {
            Header: "VBA Name",
            accessor: "name",
            minWidth: 150,
            flex: 1,
        },
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
                </div>
            ),
        },
    ];


    const tableData = userData.map((item, index) => ({
        // srno: index + 1,
        srno: ((metaData.current_page - 1) * metaData.per_page) + index + 1,
        created_at: moment(item.created_at).format("DD-MM-YYYY HH:mm A"),
        name: item.token?.user?.name || "-",
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
        <>
            <div className="border-b border-gray-200 pb-3 mb-4 flex items-center justify-center text-center flex-wrap gap-4 md:flex-nowrap">
                <div
                    className="mainlabel"
                    style={{ width: "max-content !important" }}
                >
                    Survey Forms
                </div>
            </div>
            <div className="flex items-end lg:justify-between mb-5 lg:flex-nowrap flex-wrap justify-center gap-5">
                <div className="flex items-end gap-5 flex-wrap justify-center pl-8" >

                    <div className="w-full sm:w-56">
                        <DropdownWithSearch
                            id="manageuser"
                            name="manageuser"
                            label="Select User"
                            tooltipContent="Select user you want to recharge"
                            tooltipPlacement="right"
                            options={allUsers
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((user) => ({
                                    label: user.name,
                                    value: user.id,
                                }))}
                            value={selectedUser}
                            onChange={setSelectedUser}
                            placeholder="Select User"
                        />
                    </div>
                    <div className="w-full sm:w-56">
                        <UniversalDatePicker
                            id="fromDate"
                            name="fromDate"
                            label="From Date"
                            // defaultValue={new Date()}
                            // placeholder="Pick a start date"
                            tooltipContent="Select the starting date for your report"
                            tooltipPlacement="right"
                            errorText="Please select a valid date"
                            value={setFilterData.fromDate}
                            onChange={(newValue) => {
                                setFilterData({
                                    ...filterData,
                                    fromDate: newValue,
                                });
                            }}
                        />
                    </div>
                    <div className="w-full sm:w-56">
                        <UniversalDatePicker
                            id="toDate"
                            name="toDate"
                            label="To Date"
                            tooltipContent="Select the starting date for your report"
                            tooltipPlacement="right"
                            errorText="Please select a valid date"
                            value={setFilterData.toDate}
                            // defaultValue={new Date()}
                            onChange={(newValue) => {
                                setFilterData({
                                    ...filterData,
                                    toDate: newValue,
                                });
                            }}
                        />
                    </div>
                    <UniversalButton
                        icon={
                            <RefreshCw
                                className={isLoading ? "animate-spin scale-x-[-1]" : ""}
                                size="18px"
                            />
                        }
                        variant="secondary"
                        onClick={() => fetchAllUserSurveyForm(page)}
                        label={isLoading ? "Searching..." : "Search"}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex items-end gap-5 flex-wrap justify-center">
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
                        value={metaData.total}
                        variant="secondary"
                        className="text-nowrap"
                    />
                </div>

            </div>

            {isLoading ? (
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
                    loading={isLoading}
                    totalRecords={metaData.total || 0}
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
        </>
    );
};

export default SurveyFormReportAll;

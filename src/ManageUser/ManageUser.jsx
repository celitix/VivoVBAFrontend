import React, { useEffect, useState } from "react";
import DataTable from "../components/common/DataTable";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { MdOutlineDeleteForever } from "react-icons/md";
import UniversalButton from "../components/common/UniversalButton";
import { useNavigate } from "react-router-dom";
import CustomTooltip from "../components/common/CustomTooltip";
import { IconButton } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  getUserList,
  deleteUser,
  createUser,
} from "@/apis/manageuser/manageuser";
import toast from "react-hot-toast";
import { Dialog } from "primereact/dialog";
import InputField from "@/components/common/InputField";
import DropdownWithSearch from "@/components/common/DropdownWithSearch";
import { FiSearch } from "react-icons/fi";
import { User } from "lucide-react";
import Capsule from "@/components/common/Capsule";
import UniversalSkeleton from "../components/ui/UniversalSkeleton";
import moment from "moment";
import { FaLink } from "react-icons/fa6";
import {
  getUserUniqueTokenLink,
  getUserFilledSurveyForms,
} from "@/apis/manageuser/manageuser";
import {
  FileSpreadsheet,
} from "lucide-react";


const ManageUser = () => {
  const [usersListData, setUsersListData] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [deleteIsVisible, setDeleteIsVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [mobileNumber, setMobileNumber] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [addUser, setAddUser] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [userToken, setUserToken] = useState("");

  const handleAdd = () => {
    setEditMode(false);
    setEditData(null);
    setAddUser({ name: "", mobile: "", email: "", password: "" });
    setAddUserDialog(true);
  };

  const handleSaveUser = async () => {
    const { name, email, mobile, password } = addUser;

    if (!name) return toast.error("username is required!");

    if (!mobile.trim()) return toast.error("Please enter Mobile No!");
    if (!email.trim()) return toast.error("Please enter email address!");
    if (!password.trim()) return toast.error("Please enter user password!");

    try {
      setLoadingAdd(true);
      let response;

      if (editMode) {
        const payload = {
          id: editData.id,
          name: name,
          email: email,
          password: password,
          mobile: mobile,
        };
        response = await createUser(payload);
      } else {
        const payload = {
          name: name,
          email: email,
          mobile: mobile,
          password: password,
        };
        response = await createUser(payload);
      }

      if (response?.status) {
        toast.success(
          response?.message ||
          (editMode
            ? "User updated successfully!"
            : "User added successfully!")
        );
        fetchUserList();
        setAddUserDialog(false);
      } else {
        toast.error(response?.message || "Failed to save user!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while saving user.");
    } finally {
      setLoadingAdd(false);
    }
  };


  const handleDelete = (row) => {
    setDeleteIsVisible(true);
    setSelectedUser(row);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const response = await deleteUser(selectedUser.id);

      if (response?.status) {
        toast.success(response?.message || "User deleted successfully!");
      } else {
        toast.error(response?.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong while deleting user.");
    } finally {
      setDeleteIsVisible(false);
      fetchUserList();
      setSelectedUser(null);
    }
  };

  const handleEdit = (row) => {
    console.log(row);
    setEditMode(true);
    setEditData(row);

    setAddUser({
      name: row.name || "",
      mobile: row.mobile || "",
      email: row.email || "",
      password: row.password || "",
    });
    setAddUserDialog(true);
  };

  const handleGenerateLink = async (row) => {
    try {
      const res = await getUserUniqueTokenLink(row.id);

      if (res?.token) {
        const baseUrl = import.meta.env.VITE_API_BASE_URL_FRONTEND;
        const encodedName = encodeURIComponent(row.name);
        const shareableLink = `${baseUrl}/surveyform?token=${res.token}&name=${encodedName}`;

        setUserToken(res.token);

        // Safely attempt to copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(shareableLink);
            toast.success("Link copied to clipboard!");
          } catch (clipErr) {
            console.warn("Clipboard copy failed:", clipErr);
            toast.error(`Link generated: ${shareableLink}`);
            fallbackCopyTextToClipboard(shareableLink);
          }
        } else {
          // Fallback for older browsers or non-secure contexts
          // toast.success(`Link generated: ${shareableLink}`);
          // toast.success(`Link copied to clipboard`);
          fallbackCopyTextToClipboard(shareableLink);
        }
      } else {
        toast.error("Failed to generate token.");
      }
    } catch (error) {
      console.error("Error generating link:", error);
      toast.error("Something went wrong.");
    }
  };

  // Fallback using execCommand (works in most browsers even without clipboard API)
  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast.success("Link copied to clipboard!");
      } else {
        toast.warn("Copy failed. Please copy manually.");
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
      toast.error("Failed to copy link. Please copy manually.");
    }

    document.body.removeChild(textArea);
  }

  // const handleGenerateLink = async (row) => {
  //   try {
  //     const res = await getUserUniqueTokenLink(row.id);

  //     if (!res?.token) {
  //       toast.error("Failed to generate token.");
  //       return;
  //     }

  //     const baseUrl = import.meta.env.VITE_API_BASE_URL_FRONTEND;
  //     const encodedName = encodeURIComponent(row.name);
  //     const shareableLink = `${baseUrl}/surveyform?token=${res.token}&name=${encodedName}`;

  //     setUserToken(res.token);

  //     // Try writing to clipboard safely
  //     try {
  //       await navigator?.clipboard?.writeText(shareableLink);
  //       toast.success("Link copied to clipboard!");
  //     } catch (clipboardErr) {
  //       console.warn("Clipboard permission error:", clipboardErr);

  //       // Fallback for browsers that block clipboard API
  //       fallbackCopyText(shareableLink);
  //     }

  //   } catch (err) {
  //     console.error("Error generating link:", err);
  //     toast.error("Something went wrong.");
  //   }
  // };

  const getSurveyFilledForms = async (row) => {
    try {
      const resToken = await getUserUniqueTokenLink(row.id);

      if (!resToken?.token) {
        toast.error("No token found");
        return;
      }
      const token = resToken.token;
      const res = await getUserFilledSurveyForms(token);

      if (res?.tokenResponse) {
        navigate("/surveyformreport", {
          state: {
            forms: res.tokenResponse,
            user: row,
          },
        });
      } else {
        toast.error("No responses found");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };


  const manageUsersColumns = [
    { Header: "Sr No", accessor: "srno", width: 50, flex: 0 },
    { Header: "Name", accessor: "name", minWidth: 150, flex: 1 },
    { Header: "Created At", accessor: "created_at", minWidth: 180, flex: 1 },
    { Header: "Mobile No", accessor: "mobile", minWidth: 180, flex: 1 },
    { Header: "Email", accessor: "email", minWidth: 200, flex: 1 },
    // { Header: "Password", accessor: "password", minWidth: 200, flex: 1 },
    {
      Header: "Action",
      accessor: "action",
      width: 200,
      renderCell: ({ row }) => (
        <div className="flex gap-2 justify-start">
          <>
            {/* <CustomTooltip arrow title="Edit User Details" placement="top">
              <IconButton onClick={() => handleEdit(row)}>
                <EditNoteIcon sx={{ fontSize: "1.2rem", color: "gray" }} />
              </IconButton>
            </CustomTooltip> */}

            <CustomTooltip arrow title="Delete User" placement="top">
              <IconButton onClick={() => handleDelete(row)}>
                <MdOutlineDeleteForever
                  className="text-red-500 cursor-pointer hover:text-red-600"
                  size={20}
                />
              </IconButton>
            </CustomTooltip>
            <CustomTooltip arrow title="User Unique Link" placement="top">
              <IconButton onClick={() => handleGenerateLink(row)}>
                <FaLink
                  className="text-blue-500 cursor-pointer hover:text-blue-600"
                  size={20}
                />
              </IconButton>
            </CustomTooltip>
            <CustomTooltip arrow title="User Survey Forms" placement="top">
              <IconButton onClick={() => getSurveyFilledForms(row)}>
                <FileSpreadsheet
                  className="text-blue-500 cursor-pointer hover:text-blue-600"
                  size={20}
                />
              </IconButton>
            </CustomTooltip>
          </>
        </div>
      ),
    },
  ];

  const fetchUserList = async () => {
    setSearchData(true);
    const data = {
      limit: "",
      page: "",
      orderBy: "",
    };
    try {
      const res = await getUserList(data);
      setUsersListData(res?.users);
      setMetaData(res.meta);
    } catch (error) {
      console.log("error", error);
    } finally {
      setSearchData(false);
    }
  };

  // useEffect(() => {
  //   fetchUserList();
  // }, []);

  useEffect(() => {
    fetchUserList();
  }, []);

  const manageUsersData = usersListData?.map((user, index) => ({
    srno: index + 1,
    id: user.id,
    // id: index + 1,
    created_at: moment(user?.created_at).format("DD-MM-YYYY HH:mm A") || "-",
    mobile: user.mobile,
    name: user.name,
    email: user.email,
    password: user.password,
  }));


  return (
    <>
      <div className="">
        {/* Header Section */}
        <div className="border-b border-gray-200 pb-3 mb-4 flex items-center justify-center text-center flex-wrap gap-4 md:flex-nowrap">
          <div
            className="mainlabel"
            style={{ width: "max-content !important" }}
          >
            Manage User
          </div>
        </div>
        <div className="flex flex-wrap  gap-4 w-full items-end md:justify-between justify-center mb-3">
          <div className="flex gap-4">
            <Capsule
              icon={User}
              label="Total Users"
              value={usersListData.length || 0}
              variant="secondary"
              className="text-nowrap"
            />
            <div className="w-max">
              <UniversalButton
                label={searchData ? "Refreshing..." : "Refresh"}
                disabled={searchData}
                icon={<FiSearch className="text-sm" />}
                onClick={() => fetchUserList()}
              />
            </div>
          </div>
          <div className="w-max">
            <UniversalButton
              label="Create User"
              onClick={handleAdd}
              className="text-nowrap"
            />
          </div>
        </div>

        {/* Table Section */}
        {searchData ? (
          <UniversalSkeleton height="45rem" className="rounded-xl" />
        ) : (
          <div className="relative">
            <DataTable
              columns={manageUsersColumns}
              data={manageUsersData}
              loading={searchData}
              pageSize={15}
              showCheckbox={false}
              height="680px"
            />
          </div>
        )}
      </div >

      <Dialog
        header={editMode ? "Edit User" : "Add User"}
        visible={addUserDialog}
        className="w-full md:w-200"
        onHide={() => {
          setAddUserDialog(false);
          setEditMode(false);
          setAddUser({ name: "", mobile: "", email: "", password: "" });
        }}
        draggable={false}
      >
        <div className="space-y-4 w-full">
          {/* Conditional display */}
          <div className="">
            <div className="space-y-4">
              <div className="flex flex-col flex-wrap gap-3">
                <div className="flex flex-col items-center gap-3">
                  <InputField
                    label="UserName"
                    placeholder="Enter User Name"
                    value={addUser.name}
                    onChange={(e) =>
                      setAddUser((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                  <InputField
                    label="Mobile No"
                    placeholder="Enter MobileNo"
                    value={addUser.mobile}
                    onChange={(e) =>
                      setAddUser((prev) => ({
                        ...prev,
                        mobile: e.target.value,
                      }))
                    }
                  />
                  <InputField
                    label="Email"
                    placeholder="Enter Email"
                    value={addUser.email}
                    onChange={(e) =>
                      setAddUser((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  <InputField
                    label="Password"
                    placeholder="Enter Password"
                    value={addUser.password}
                    onChange={(e) =>
                      setAddUser((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <UniversalButton
                  label={
                    loadingAdd
                      ? editMode
                        ? "Updating..."
                        : "Saving..."
                      : editMode
                        ? "Update User"
                        : "Save User"
                  }
                  onClick={handleSaveUser}
                  disabled={loadingAdd}
                />
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Delete User Start */}
      <Dialog
        header="Confirm Delete"
        visible={deleteIsVisible}
        onHide={() => setDeleteIsVisible(false)}
        className="w-full md:w-120"
        draggable={false}
      >
        <div className="flex flex-col items-center justify-center text-center px-4 py-3">
          <CancelOutlinedIcon sx={{ fontSize: 64, color: "#f44336", mb: 1 }} />

          <h2 className="text-[1.15rem] font-semibold text-gray-700 mb-2">
            Delete User
          </h2>

          <p className="text-gray-600 text-sm mb-4">
            You are about to delete the user:
          </p>

          <div className="bg-gray-100 text-gray-800 font-medium rounded-md px-3 py-2 mb-4 w-full text-center break-words">
            {selectedUser?.name || "Unnamed User"}
          </div>

          <p className="text-gray-500 text-sm">
            This action is{" "}
            <span className="font-semibold text-red-600">permanent</span> and
            cannot be undone.
          </p>

          <div className="flex justify-center gap-4 mt-5">
            <UniversalButton
              label="Cancel"
              style={{
                backgroundColor: "#4b5563",
              }}
              onClick={() => setDeleteIsVisible(false)}
            />
            <UniversalButton
              label="Delete"
              style={{
                backgroundColor: "#dc2626",
              }}
              onClick={() => {
                handleConfirmDelete();
                setDeleteIsVisible(false);
              }}
            />
          </div>
        </div>
      </Dialog>
      {/* Delete User End */}
    </>
  );
};

export default ManageUser;

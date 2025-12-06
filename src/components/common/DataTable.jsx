// import React, { useState, useMemo } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ArrowUpDown,
//   CheckSquare,
//   Square,
//   Inbox,
// } from "lucide-react";

// const DataTable = ({
//   columns,
//   data,
//   pageSize = "1000000000",
//   height = "750px",
//   showCheckbox = true,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [selectedRows, setSelectedRows] = useState([]);

//   // ---- Sorting ----
//   const sortedData = useMemo(() => {
//     let sortable = [...data];
//     if (sortConfig.key) {
//       sortable.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key])
//           return sortConfig.direction === "asc" ? -1 : 1;
//         if (a[sortConfig.key] > b[sortConfig.key])
//           return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }
//     return sortable;
//   }, [data, sortConfig]);

//   // ---- Pagination ----
//   const startIndex = (currentPage - 1) * pageSize;
//   const currentData = sortedData.slice(startIndex, startIndex + pageSize);
//   const totalPages = Math.ceil(data.length / pageSize);

//   // ---- Sorting Handler ----
//   const requestSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   // ---- Checkbox Logic ----
//   // ---- Checkbox Logic (supports full data selection) ----
//   const toggleSelect = (row) => {
//     setSelectedRows((prev) =>
//       prev.includes(row) ? prev.filter((r) => r !== row) : [...prev, row]
//     );
//   };

//   // Select all rows across all pages
//   const toggleSelectAll = () => {
//     if (selectedRows.length === data.length) {
//       setSelectedRows([]); // unselect all
//     } else {
//       setSelectedRows([...data]); // select all rows globally
//     }
//   };

//   // const rowHeight = 45; // row height in px
//   // const headerHeight = 52; // header height
//   // const footerHeight = 60; // pagination height

//   // const tableHeight =
//   //   Math.min(data.length, pageSize) * rowHeight +
//   //   headerHeight +
//   //   footerHeight +
//   //   10;

//   return (
//     <div
//       className="w-full bg-white shadow-md rounded-xl border border-gray-200 flex flex-col overflow-auto  transition-all duration-200"
//       style={{ minHeight: height }}
//     // style={{ height: `${tableHeight}px` }}
//     >
//       {/* ===== Table Section ===== */}
//       <div className="overflow-x-auto flex-1">
//         <table className="w-full border-separate border-spacing-0 text-left table-auto">
//           <thead className="bg-blue-100 border-b border-gray-300">
//             <tr>
//               {showCheckbox && (
//                 <th
//                   className="p-2 w-15 text-gray-800 font-semibold border-r border-gray-300 text-center align-bottom rounded-tl-xl"
//                   style={{ minWidth: "60px", maxWidth: "60px" }}
//                 >
//                   <button onClick={toggleSelectAll}>
//                     {selectedRows.length === data.length && data.length > 0 ? (
//                       <CheckSquare className="w-5 h-5 text-blue-600" />
//                     ) : (
//                       <Square className="w-5 h-5 text-gray-600" />
//                     )}
//                   </button>
//                 </th>
//               )}

//               {columns.map((col, index) => (
//                 <th
//                   key={col.accessor}
//                   onClick={() => requestSort(col.accessor)}
//                   className={`px-2 text-blue-800 font-[500] tracking-wide border-r border-gray-300 cursor-pointer select-none text-[14.5px] h-[52px] 
//           ${index === 0 && !showCheckbox ? "rounded-tl-xl" : ""} 
//           ${index === columns.length - 1 ? "rounded-tr-xl border-r-0" : ""}`}
//                   style={{
//                     minWidth: col.minWidth || "120px",
//                     maxWidth: col.maxWidth || "300px",
//                     width: col.width || "auto",
//                     whiteSpace: "normal",
//                     wordBreak: "break-word",
//                     overflowWrap: "break-word",
//                   }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span
//                       className={`${col.align === "center"
//                         ? "text-center"
//                         : col.align === "right"
//                           ? "text-right"
//                           : "text-left"
//                         } w-full text-nowrap`}
//                     >
//                       {col.Header}
//                     </span>
//                     <div>
//                       <ArrowUpDown
//                         className={`w-4 h-4 ${sortConfig.key === col.accessor
//                           ? "text-blue-600"
//                           : "text-gray-400"
//                           }`}
//                       />
//                     </div>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           {/* ===== Table Head ===== */}

//           {/* ===== Table Body ===== */}
//           <tbody className="align-middle">
//             {currentData.length > 0 ? (
//               currentData.map((row, idx) => (
//                 <tr
//                   key={idx}
//                   className={`border-b border-gray-200 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"
//                     } hover:bg-blue-50 transition`}
//                   style={{ height: "45px !important" }}
//                 >
//                   {showCheckbox && (
//                     <td className="px-2 py-2.5 border-b border-gray-200 text-center align-middle">
//                       <button onClick={() => toggleSelect(row)}>
//                         {selectedRows.includes(row) ? (
//                           <CheckSquare className="w-5 h-5 text-blue-600" />
//                         ) : (
//                           <Square className="w-5 h-5 text-gray-500" />
//                         )}
//                       </button>
//                     </td>
//                   )}

//                   {columns.map((col) => (
//                     <td
//                       key={col.accessor}
//                       className={`px-2 py-2.5 text-sm border-b border-gray-200 text-gray-700 align-middle text-wrap break-words ${col.align === "center"
//                         ? "text-center"
//                         : col.align === "right"
//                           ? "text-right"
//                           : "text-left"
//                         }`}
//                       style={{
//                         minWidth: col.minWidth || "120px",
//                         maxWidth: col.maxWidth || "300px",
//                         width: col.width || "auto",
//                         whiteSpace: "normal",
//                         wordBreak: "break-word",
//                         overflowWrap: "break-word",
//                       }}
//                     >
//                       {/* {row[col.accessor]} */}
//                       {col.renderCell
//                         ? col.renderCell({
//                           row,
//                           value: row[col.accessor],
//                           index: idx,
//                         })
//                         : row[col.accessor]}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr className="border" >
//                 <td
//                   colSpan={columns.length + (showCheckbox ? 1 : 0)}
//                   className="text-center text-blue-500 py-16"
//                 >
//                   <div className="flex flex-col items-center justify-center">
//                     <Inbox className="w-10 h-10 text-blue-400 mb-2" />
//                     <p className="text-blue-500 text-sm">No data available</p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ===== Pagination Section ===== */}
//       <div className="flex flex-col lg:flex-row sm:items-center sm:justify-between px-6 border-t border-gray-300 bg-gray-100 gap-2 sm:gap-0 rounded-b-xl">
//         {/* ---- Page Info & Total Records ---- */}
//         <div className="text-[13px] text-gray-600 font-medium flex flex-col sm:flex-row sm:items-center sm:gap-2">
//           <span>
//             Page {currentPage} of {totalPages || 1}
//           </span>
//           {data.length > 0 && (
//             <span>
//               | Showing {startIndex + 1}–
//               {Math.min(startIndex + pageSize, data.length)} of {data.length}{" "}
//               records
//             </span>
//           )}
//         </div>

//         {/* ---- Pagination Controls ---- */}
//         <div className="flex items-center justify-center gap-2 py-2 bg-gray-100">
//           {/* Prev Button */}
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className={`px-4 py-1.5 rounded-md border text-[13px] tracking-wide font-medium transition ${currentPage === 1
//               ? "text-gray-400 border-gray-300 cursor-not-allowed bg-white"
//               : "text-blue-600 border-blue-300 hover:bg-blue-100"
//               }`}
//           >
//             Previous
//           </button>

//           {/* Smart Pagination with Ellipsis */}
//           {(() => {
//             const pages = [];
//             const maxVisible = 3; // 👈 Show only 3 visible pages
//             let start = Math.max(1, currentPage - 1);
//             let end = Math.min(totalPages, start + maxVisible - 1);

//             if (end - start < maxVisible - 1) {
//               start = Math.max(1, end - maxVisible + 1);
//             }

//             if (start > 1) {
//               pages.push(1);
//               if (start > 2) pages.push("...");
//             }

//             for (let i = start; i <= end; i++) {
//               pages.push(i);
//             }

//             if (end < totalPages) {
//               if (end < totalPages - 1) pages.push("...");
//               pages.push(totalPages);
//             }

//             return pages.map((page, index) =>
//               page === "..." ? (
//                 <span
//                   key={`dots-${index}`}
//                   className="px-3 py-1.5 text-gray-400 font-medium"
//                 >
//                   ...
//                 </span>
//               ) : (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`px-3 py-1.5 rounded-md border text-[13px] font-medium transition ${currentPage === page
//                     ? "bg-blue-500 text-white border-blue-600"
//                     : "text-blue-600 border-blue-300 hover:bg-blue-100"
//                     }`}
//                 >
//                   {page}
//                 </button>
//               )
//             );
//           })()}

//           {/* Next Button */}
//           <button
//             disabled={currentPage === totalPages || totalPages === 0}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className={`px-4 py-1.5 rounded-md border text-[13px] tracking-wide font-medium transition ${currentPage === totalPages || totalPages === 0
//               ? "text-gray-400 border-gray-300 cursor-not-allowed bg-white"
//               : "text-blue-600 border-blue-300 hover:bg-blue-100"
//               }`}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;



// import React, { useState, useMemo } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ArrowUpDown,
//   CheckSquare,
//   Square,
//   Inbox,
// } from "lucide-react";

// const DataTable = ({
//   columns,
//   data,
//   pageSize = "1000000000",
//   height = "750px",
//   showCheckbox = true,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [selectedRows, setSelectedRows] = useState([]);

//   // ---- Sorting ----
//   const sortedData = useMemo(() => {
//     let sortable = [...data];
//     if (sortConfig.key) {
//       sortable.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key])
//           return sortConfig.direction === "asc" ? -1 : 1;
//         if (a[sortConfig.key] > b[sortConfig.key])
//           return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }
//     return sortable;
//   }, [data, sortConfig]);

//   // ---- Pagination ----
//   const startIndex = (currentPage - 1) * pageSize;
//   const currentData = sortedData.slice(startIndex, startIndex + pageSize);
//   const totalPages = Math.ceil(data.length / pageSize);

//   // ---- Sorting Handler ----
//   const requestSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   // ---- Checkbox Logic ----
//   // ---- Checkbox Logic (supports full data selection) ----
//   const toggleSelect = (row) => {
//     setSelectedRows((prev) =>
//       prev.includes(row) ? prev.filter((r) => r !== row) : [...prev, row]
//     );
//   };

//   // Select all rows across all pages
//   const toggleSelectAll = () => {
//     if (selectedRows.length === data.length) {
//       setSelectedRows([]); // unselect all
//     } else {
//       setSelectedRows([...data]); // select all rows globally
//     }
//   };

//   // const rowHeight = 45; // row height in px
//   // const headerHeight = 52; // header height
//   // const footerHeight = 60; // pagination height

//   // const tableHeight =
//   //   Math.min(data.length, pageSize) * rowHeight +
//   //   headerHeight +
//   //   footerHeight +
//   //   10;

//   return (
//     <div
//       className="w-full bg-white shadow-md rounded-xl border border-gray-200 flex flex-col overflow-auto  transition-all duration-200"
//       style={{ minHeight: height }}
//     // style={{ height: `${tableHeight}px` }}
//     >
//       {/* ===== Table Section ===== */}
//       <div className="overflow-x-auto flex-1">
//         <table className="w-full border-separate border-spacing-0 text-left table-auto">
//           <thead className="bg-blue-100 border-b border-gray-300">
//             <tr>
//               {showCheckbox && (
//                 <th
//                   className="p-2 w-15 text-gray-800 font-semibold border-r border-gray-300 text-center align-bottom rounded-tl-xl"
//                   style={{ minWidth: "60px", maxWidth: "60px" }}
//                 >
//                   <button onClick={toggleSelectAll}>
//                     {selectedRows.length === data.length && data.length > 0 ? (
//                       <CheckSquare className="w-5 h-5 text-blue-600" />
//                     ) : (
//                       <Square className="w-5 h-5 text-gray-600" />
//                     )}
//                   </button>
//                 </th>
//               )}

//               {columns.map((col, index) => (
//                 <th
//                   key={col.accessor}
//                   onClick={() => requestSort(col.accessor)}
//                   className={`px-2 text-blue-800 font-[500] tracking-wide border-r border-gray-300 cursor-pointer select-none text-[14.5px] h-[52px] 
//           ${index === 0 && !showCheckbox ? "rounded-tl-xl" : ""} 
//           ${index === columns.length - 1 ? "rounded-tr-xl border-r-0" : ""}`}
//                   style={{
//                     minWidth: col.minWidth || "120px",
//                     maxWidth: col.maxWidth || "300px",
//                     width: col.width || "auto",
//                     whiteSpace: "normal",
//                     wordBreak: "break-word",
//                     overflowWrap: "break-word",
//                   }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span
//                       className={`${col.align === "center"
//                         ? "text-center"
//                         : col.align === "right"
//                           ? "text-right"
//                           : "text-left"
//                         } w-full text-nowrap`}
//                     >
//                       {col.Header}
//                     </span>
//                     <div>
//                       <ArrowUpDown
//                         className={`w-4 h-4 ${sortConfig.key === col.accessor
//                           ? "text-blue-600"
//                           : "text-gray-400"
//                           }`}
//                       />
//                     </div>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           {/* ===== Table Head ===== */}

//           {/* ===== Table Body ===== */}
//           <tbody className="align-middle">
//             {currentData.length > 0 ? (
//               currentData.map((row, idx) => (
//                 <tr
//                   key={idx}
//                   className={`border-b border-gray-200 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"
//                     } hover:bg-blue-50 transition`}
//                   style={{ height: "45px !important" }}
//                 >
//                   {showCheckbox && (
//                     <td className="px-2 py-2.5 border-b border-gray-200 text-center align-middle">
//                       <button onClick={() => toggleSelect(row)}>
//                         {selectedRows.includes(row) ? (
//                           <CheckSquare className="w-5 h-5 text-blue-600" />
//                         ) : (
//                           <Square className="w-5 h-5 text-gray-500" />
//                         )}
//                       </button>
//                     </td>
//                   )}

//                   {columns.map((col) => (
//                     <td
//                       key={col.accessor}
//                       className={`px-2 py-2.5 text-sm border-b border-gray-200 text-gray-700 align-middle text-wrap break-words ${col.align === "center"
//                         ? "text-center"
//                         : col.align === "right"
//                           ? "text-right"
//                           : "text-left"
//                         }`}
//                       style={{
//                         minWidth: col.minWidth || "120px",
//                         maxWidth: col.maxWidth || "300px",
//                         width: col.width || "auto",
//                         whiteSpace: "normal",
//                         wordBreak: "break-word",
//                         overflowWrap: "break-word",
//                       }}
//                     >
//                       {/* {row[col.accessor]} */}
//                       {col.renderCell
//                         ? col.renderCell({
//                           row,
//                           value: row[col.accessor],
//                           index: idx,
//                         })
//                         : row[col.accessor]}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr className="border" >
//                 <td
//                   colSpan={columns.length + (showCheckbox ? 1 : 0)}
//                   className="text-center text-blue-500 py-16"
//                 >
//                   <div className="flex flex-col items-center justify-center">
//                     <Inbox className="w-10 h-10 text-blue-400 mb-2" />
//                     <p className="text-blue-500 text-sm">No data available</p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ===== Pagination Section ===== */}
//       <div className="flex flex-col lg:flex-row sm:items-center sm:justify-between px-6 border-t border-gray-300 bg-gray-100 gap-2 sm:gap-0 rounded-b-xl">
//         {/* ---- Page Info & Total Records ---- */}
//         <div className="text-[13px] text-gray-600 font-medium flex flex-col sm:flex-row sm:items-center sm:gap-2">
//           <span>
//             Page {currentPage} of {totalPages || 1}
//           </span>
//           {data.length > 0 && (
//             <span>
//               | Showing {startIndex + 1}–
//               {Math.min(startIndex + pageSize, data.length)} of {data.length}{" "}
//               records
//             </span>
//           )}
//         </div>

//         {/* ---- Pagination Controls ---- */}
//         <div className="flex items-center justify-center gap-2 py-2 bg-gray-100">
//           {/* Prev Button */}
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className={`px-4 py-1.5 rounded-md border text-[13px] tracking-wide font-medium transition ${currentPage === 1
//               ? "text-gray-400 border-gray-300 cursor-not-allowed bg-white"
//               : "text-blue-600 border-blue-300 hover:bg-blue-100"
//               }`}
//           >
//             Previous
//           </button>

//           {/* Smart Pagination with Ellipsis */}
//           {(() => {
//             const pages = [];
//             const maxVisible = 3; // 👈 Show only 3 visible pages
//             let start = Math.max(1, currentPage - 1);
//             let end = Math.min(totalPages, start + maxVisible - 1);

//             if (end - start < maxVisible - 1) {
//               start = Math.max(1, end - maxVisible + 1);
//             }

//             if (start > 1) {
//               pages.push(1);
//               if (start > 2) pages.push("...");
//             }

//             for (let i = start; i <= end; i++) {
//               pages.push(i);
//             }

//             if (end < totalPages) {
//               if (end < totalPages - 1) pages.push("...");
//               pages.push(totalPages);
//             }

//             return pages.map((page, index) =>
//               page === "..." ? (
//                 <span
//                   key={`dots-${index}`}
//                   className="px-3 py-1.5 text-gray-400 font-medium"
//                 >
//                   ...
//                 </span>
//               ) : (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`px-3 py-1.5 rounded-md border text-[13px] font-medium transition ${currentPage === page
//                     ? "bg-blue-500 text-white border-blue-600"
//                     : "text-blue-600 border-blue-300 hover:bg-blue-100"
//                     }`}
//                 >
//                   {page}
//                 </button>
//               )
//             );
//           })()}

//           {/* Next Button */}
//           <button
//             disabled={currentPage === totalPages || totalPages === 0}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className={`px-4 py-1.5 rounded-md border text-[13px] tracking-wide font-medium transition ${currentPage === totalPages || totalPages === 0
//               ? "text-gray-400 border-gray-300 cursor-not-allowed bg-white"
//               : "text-blue-600 border-blue-300 hover:bg-blue-100"
//               }`}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;






















// Second version of datatable with pagination


import React, { useState, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckSquare,
  Square,
  Inbox,
} from "lucide-react";

const pageSizeOptions = [10, 20, 30, 50, 100];

const DataTable = ({
  columns,
  data = [],
  loading = false,
  totalRecords = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  onPageSizeChange,
  onSort,
  sortConfig = null,
  showCheckbox = false,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  showPageSizeDropdown = true,
  height = "680px",
  onClearSelection,
}) => {
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  const handleSort = useCallback(
    (key) => {
      if (!onSort) return;
      const direction =
        sortConfig?.key === key && sortConfig?.direction === "asc"
          ? "desc"
          : "asc";
      onSort(key, direction);
    },
    [sortConfig, onSort]
  );

  return (
    <div
      className="w-full bg-white shadow-md rounded-xl border border-gray-200 flex flex-col overflow-auto  transition-all duration-200"
      style={{ minHeight: height }}
    >

      {showPageSizeDropdown && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-1.5 border-b border-gray-200 bg-gray-50">
          <div></div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {/* Only show when at least one row is selected */}
      {selectedRows.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 text-sm text-blue-800 font-medium rounded-t-xl">
          Selected: <strong>{selectedRows.length}</strong> row{selectedRows.length !== 1 ? 's' : ''}
          {selectedRows.length > 0 && (
            <button
              onClick={onClearSelection}// Optional: clear selection
              className="ml-4 underline hover:no-underline"
            >
              Clear selection
            </button>
          )}
        </div>
      )}
      {/* ===== Table Section ===== */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full border-separate border-spacing-0 text-left table-auto">
          <thead className="bg-blue-100 border-b border-gray-300">
            <tr>
              {showCheckbox && (
                <th
                  className="p-2 w-15 text-gray-800 font-semibold border-r border-gray-300 text-center align-bottom rounded-tl-xl"
                  style={{ minWidth: "60px", maxWidth: "60px" }}
                >
                  <button onClick={onSelectAll}>
                    {data.length > 0 && data.every(row => selectedRows.includes(row.id)) ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </th>
              )}


              {columns.map((col, idx) => (
                <th
                  key={col.accessor}
                  onClick={() => handleSort(col.accessor)}
                  className={`px-2 text-blue-800 font-medium tracking-wide border-r border-gray-300 cursor-pointer select-none text-[14.5px] h-[52px] 
          ${idx === 0 && !showCheckbox ? "rounded-tl-xl" : ""} 
          ${idx === columns.length - 1 ? "rounded-tr-xl border-r-0" : ""}`}
                  style={{
                    minWidth: col.minWidth || "120px",
                    maxWidth: col.maxWidth || "300px",
                    width: col.width || "auto",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`${col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                          ? "text-right"
                          : "text-left"
                        } w-full text-nowrap`}
                    >
                      {col.Header}
                    </span>
                    {/* <div>
                      <ArrowUpDown
                        className={`w-4 h-4 ${sortConfig?.key === col.accessor
                          ? "text-blue-600"
                          : "text-gray-400"
                          }`}
                      />
                    </div> */}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {/* ===== Table Head ===== */}

          {/* ===== Table Body ===== */}
          <tbody className="align-middle">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (showCheckbox ? 1 : 0)}
                  className="text-center py-24"
                >
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-500">Loading data...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showCheckbox ? 1 : 0)}
                  className="text-center py-24"
                >
                  <div className="flex flex-col items-center">
                    <Inbox className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 text-lg">No data available</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`border-b border-gray-200 h-13 ${rowIdx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition`}
                  style={{ height: "45px !important" }}
                >
                  {showCheckbox && (
                    <td className="px-2 py-2.5 border-b border-gray-200 text-center align-middle">
                      <button onClick={() => onRowSelect?.(row)}>
                        {selectedRows.includes(row.id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                    </td>
                  )}

                  {columns.map((col) => {
                    const value = row[col.accessor];
                    return (

                      <td
                        key={col.accessor}
                        className={`px-2 py-2 text-[13.5px] border-b border-gray-200 text-gray-700 align-middle text-wrap break-words ${col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                            ? "text-right"
                            : "text-left"
                          }`}
                        style={{
                          minWidth: col.minWidth || "120px",
                          maxWidth: col.maxWidth || "300px",
                          width: col.width || "auto",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {/* {row[col.accessor]} */}
                        {col.renderCell ? (
                          col.renderCell({ row, value })
                        ) : (
                          <span className="break-words">{value ?? "-"}</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Pagination Section ===== */}
      <div className="flex flex-col lg:flex-row sm:items-center sm:justify-between px-6 border-t border-gray-300 bg-gray-100 gap-2 sm:gap-0 rounded-b-xl">
        {/* ---- Page Info & Total Records ---- */}
        <div className="text-[13px] text-gray-600 font-medium flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <div className="text-sm text-gray-600 font-medium">
            Showing {startRecord}–{endRecord} of {totalRecords.toLocaleString()}{" "}
            records
          </div>
        </div>

        {/* ---- Pagination Controls ---- */}
        <div className="flex items-center justify-center gap-2 py-2 bg-gray-100">
          {/* Prev Button */}
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`px-4 py-1.5 rounded-md border text-[13px] tracking-wide font-medium transition ${currentPage === 1
              ? "text-gray-400 border-gray-300 cursor-not-allowed bg-white"
              : "text-blue-600 border-blue-300 hover:bg-blue-100"
              }`}
          >
            Previous
          </button>

          {/* Smart Pagination with Ellipsis */}
          {(() => {
            const pages = [];
            const max = 5;
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + max - 1);
            if (end - start < max - 1) start = Math.max(1, end - max + 1);

            if (start > 1) {
              pages.push(1);
              if (start > 2) pages.push("...");
            }
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages) {
              if (end < totalPages - 1) pages.push("...");
              pages.push(totalPages);
            }

            return pages.map((p, i) =>
              p === "..." ? (
                <span key={i} className="px-3 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`px-3 py-1.5 rounded border text-sm font-medium transition ${currentPage === p
                    ? "bg-blue-600 text-white border-blue-700"
                    : "text-blue-600 border-blue-300 hover:bg-blue-100"
                    }`}
                >
                  {p}
                </button>
              )
            );
          })()}
          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-1.5 rounded-md border text-[13px] tracking-wide font-medium transition ${currentPage === totalPages || totalPages === 0
              ? "text-gray-400 border-gray-300 cursor-not-allowed bg-white"
              : "text-blue-600 border-blue-300 hover:bg-blue-100"
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;




// import React, { useState, useMemo, useCallback } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ArrowUpDown,
//   CheckSquare,
//   Square,
//   Inbox,
// } from "lucide-react";

// const pageSizeOptions = [10, 20, 30, 50, 100];

// const DataTable = ({
//   columns,
//   data = [],
//   loading = false,
//   totalRecords = 0,
//   pageSize = 10,
//   currentPage = 1,
//   onPageChange,
//   onPageSizeChange,
//   onSort,
//   sortConfig = null,
//   showCheckbox = false,
//   selectedRows = [],
//   onRowSelect,
//   onSelectAll,
//   showPageSizeDropdown = true,
//   height = "680px",
//   onClearSelection,
// }) => {
//   const totalPages = Math.ceil(totalRecords / pageSize) || 1;
//   const startRecord = (currentPage - 1) * pageSize + 1;
//   const endRecord = Math.min(currentPage * pageSize, totalRecords);

//   const handleSort = useCallback(
//     (key) => {
//       if (!onSort) return;
//       const direction =
//         sortConfig?.key === key && sortConfig?.direction === "asc"
//           ? "desc"
//           : "asc";
//       onSort(key, direction);
//     },
//     [sortConfig, onSort]
//   );

//   return (
//     <div
//       className="w-full bg-white shadow-md rounded-xl border border-gray-200 flex flex-col overflow-auto  transition-all duration-200"
//       style={{ minHeight: height }}
//     >

//       {showPageSizeDropdown && (
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-1.5 border-b border-gray-200 bg-gray-50">
//           <div></div>
//           <div className="flex items-center gap-3">
//             <span className="text-xs text-gray-600">Rows per page:</span>
//             <select
//               value={pageSize}
//               onChange={(e) => onPageSizeChange(Number(e.target.value))}
//               className="px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
//             >
//               {pageSizeOptions.map((size) => (
//                 <option key={size} value={size}>
//                   {size}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       )}
//       {/* Only show when at least one row is selected */}
//       {selectedRows.length > 0 && (
//         <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 text-sm text-blue-800 font-medium rounded-t-xl">
//           Selected: <strong>{selectedRows.length}</strong> row{selectedRows.length !== 1 ? 's' : ''}
//           {selectedRows.length > 0 && (
//             <button
//               onClick={onClearSelection}// Optional: clear selection
//               className="ml-4 underline hover:no-underline"
//             >
//               Clear selection
//             </button>
//           )}
//         </div>
//       )}
//       {/* ===== Table Section ===== */}
//       <div className="overflow-x-auto flex-1">
//         <table className="w-full border-separate border-spacing-0 text-left table-auto">
//           <thead className="bg-blue-100 border-b border-gray-300" style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
//             <tr>
//               {showCheckbox && (
//                 <th
//                   className="p-2 w-15 text-gray-800 font-semibold border-r border-gray-300 text-center align-bottom rounded-tl-xl"
//                   style={{ minWidth: "60px", maxWidth: "60px" }}
//                 >
//                   <button onClick={onSelectAll}>
//                     {data.length > 0 && data.every(row => selectedRows.includes(row.id)) ? (
//                       <CheckSquare className="w-5 h-5 text-blue-600" />
//                     ) : (
//                       <Square className="w-5 h-5 text-gray-600" />
//                     )}
//                   </button>
//                 </th>
//               )}


//               {columns.map((col, idx) => (
//                 <th
//                   key={col.accessor}
//                   onClick={() => handleSort(col.accessor)}
//                   className={`px-2 text-blue-800 font-medium tracking-wide border-r border-gray-300 cursor-pointer select-none text-[14.5px] h-[52px]
//           ${idx === 0 && !showCheckbox ? "rounded-tl-xl" : ""}
//           ${idx === columns.length - 1 ? "rounded-tr-xl border-r-0" : ""}`}
//                   style={{
//                     minWidth: col.minWidth || "120px",
//                     maxWidth: col.maxWidth || "300px",
//                     width: col.width || "auto",
//                     whiteSpace: "normal",
//                     wordBreak: "break-word",
//                     overflowWrap: "break-word",
//                   }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span
//                       className={`${col.align === "center"
//                         ? "text-center"
//                         : col.align === "right"
//                           ? "text-right"
//                           : "text-left"
//                         } w-full text-nowrap`}
//                     >
//                       {col.Header}
//                     </span>
//                     {/* <div>
//                       <ArrowUpDown
//                         className={`w-4 h-4 ${sortConfig?.key === col.accessor
//                           ? "text-blue-600"
//                           : "text-gray-400"
//                           }`}
//                       />
//                     </div> */}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           {/* ===== Table Head ===== */}

//           {/* ===== Table Body ===== */}
//           <tbody className="align-middle"
//             style={{
//               display: "block",
//               maxHeight: "530px",
//               overflowY: "auto",
//               width: "100%"
//             }}
//           >
//             {loading ? (
//               <tr style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
//                 <td
//                   colSpan={columns.length + (showCheckbox ? 1 : 0)}
//                   className="text-center py-24"
//                 >
//                   <div className="flex flex-col items-center">
//                     <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//                     <p className="mt-4 text-gray-500">Loading data...</p>
//                   </div>
//                 </td>
//               </tr>
//             ) : data.length === 0 ? (
//               <tr style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
//                 <td
//                   colSpan={columns.length + (showCheckbox ? 1 : 0)}
//                   className="text-center py-24"
//                 >
//                   <div className="flex flex-col items-center">
//                     <Inbox className="w-12 h-12 text-gray-400 mb-3" />
//                     <p className="text-gray-500 text-lg">No data available</p>
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               data.map((row, rowIdx) => (
//                 <tr
//                   key={rowIdx}
//                   className={`border-b border-gray-200 h-13 ${rowIdx % 2 === 0 ? "bg-gray-50" : "bg-white"
//                     } hover:bg-blue-50 transition`}
//                   style={{ display: "table", width: "100%", tableLayout: "fixed" }}
//                 >
//                   {showCheckbox && (
//                     <td className="px-2 py-2.5 border-b border-gray-200 text-center align-middle">
//                       <button onClick={() => onRowSelect?.(row)}>
//                         {selectedRows.includes(row.id) ? (
//                           <CheckSquare className="w-5 h-5 text-blue-600" />
//                         ) : (
//                           <Square className="w-5 h-5 text-gray-500" />
//                         )}
//                       </button>
//                     </td>
//                   )}

//                   {columns.map((col) => {
//                     const value = row[col.accessor];
//                     return (

//                       <td
//                         key={col.accessor}
//                         className={`px-2 py-2 text-[13.5px] border-b border-gray-200 text-gray-700 align-middle text-wrap break-words ${col.align === "center"
//                           ? "text-center"
//                           : col.align === "right"
//                             ? "text-right"
//                             : "text-left"
//                           }`}
//                         style={{
//                           minWidth: col.minWidth || "120px",
//                           maxWidth: col.maxWidth || "300px",
//                           width: col.width || "auto",
//                           whiteSpace: "normal",
//                           wordBreak: "break-word",
//                           overflowWrap: "break-word",
//                         }}
//                       >
//                         {/* {row[col.accessor]} */}
//                         {col.renderCell ? (
//                           col.renderCell({ row, value })
//                         ) : (
//                           <span className="break-words">{value ?? "-"}</span>
//                         )}
//                       </td>
//                     )
//                   })}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ===== Pagination Section ===== */}
//       <div className="flex flex-col lg:flex-row sm:items-center sm:justify-between px-6 border-t border-gray-300 bg-gray-100 gap-2 sm:gap-0 rounded-b-xl">
//         {/* ---- Page Info & Total Records ---- */}
//         <div className="text-[13px] text-gray-600 font-medium flex flex-col sm:flex-row sm:items-center sm:gap-2">
//           <span>
//             Page {currentPage} of {totalPages || 1}
//           </span>
//           <div className="text-sm text-gray-600 font-medium">
//             Showing {startRecord}–{endRecord} of {totalRecords.toLocaleString()}{" "}
//             records
//           </div>
//         </div>

//         {/* ---- Pagination Controls ---- */}
//         <div className="flex items-center justify-center gap-2 py-2 bg-gray-100">
//           {/* Prev Button */}
//           <button
//             disabled={currentPage === 1}
//             onClick={() => onPageChange(currentPage - 1)}
//             className={`px-4 py-1.5 rounded-md border text-[13px] tracking-wide font-medium transition ${currentPage === 1
//               ? "text-gray-400 border-gray-300 cursor-not-allowed bg-white"
//               : "text-blue-600 border-blue-300 hover:bg-blue-100"
//               }`}
//           >
//             Previous
//           </button>

//           {/* Smart Pagination with Ellipsis */}
//           {(() => {
//             const pages = [];
//             const max = 5;
//             let start = Math.max(1, currentPage - 2);
//             let end = Math.min(totalPages, start + max - 1);
//             if (end - start < max - 1) start = Math.max(1, end - max + 1);

//             if (start > 1) {
//               pages.push(1);
//               if (start > 2) pages.push("...");
//             }
//             for (let i = start; i <= end; i++) pages.push(i);
//             if (end < totalPages) {
//               if (end < totalPages - 1) pages.push("...");
//               pages.push(totalPages);
//             }

//             return pages.map((p, i) =>
//               p === "..." ? (
//                 <span key={i} className="px-3 text-gray-400">
//                   ...
//                 </span>
//               ) : (
//                 <button
//                   key={p}
//                   onClick={() => onPageChange(p)}
//                   className={`px-3 py-1.5 rounded border text-sm font-medium transition ${currentPage === p
//                     ? "bg-blue-600 text-white border-blue-700"
//                     : "text-blue-600 border-blue-300 hover:bg-blue-100"
//                     }`}
//                 >
//                   {p}
//                 </button>
//               )
//             );
//           })()}

//           {/* Next Button */}
//           <button
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={`px-4 py-1.5 rounded-md border text-[13px] tracking-wide font-medium transition ${currentPage === totalPages || totalPages === 0
//               ? "text-gray-400 border-gray-300 cursor-not-allowed bg-white"
//               : "text-blue-600 border-blue-300 hover:bg-blue-100"
//               }`}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;



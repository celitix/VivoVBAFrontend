// import React, { useEffect, useRef, useState } from "react";
// import { format } from "date-fns";
// import { AiOutlineInfoCircle } from "react-icons/ai";
// import CustomTooltip from "./CustomTooltip";

// const UniversalDatePicker = ({
//   label = "Select Date",
//   defaultDate = new Date(),
//   onChange,
//   error = false,
//   errorText = "",
//   tooltipContent = "",
//   tooltipPlacement = "top",
//   value,
// }) => {
//   const initializedRef = useRef(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState(defaultDate);
//   const [manualInput, setManualInput] = useState("");
//   const calendarRef = useRef(null);

//   useEffect(() => {
//     if (initializedRef.current) return;
//     initializedRef.current = true;

//     if (defaultDate instanceof Date && !isNaN(defaultDate)) {
//       setSelectedDate(defaultDate);
//       setCurrentMonth(defaultDate);
//       setManualInput(format(defaultDate, "dd/MM/yyyy"));
//     } else {
//       setSelectedDate(null);
//       setCurrentMonth(new Date());
//       setManualInput("");
//     }
//   }, []);

//   /* ---------- Sync with external value ---------- */
//   useEffect(() => {
//     if (value instanceof Date && !isNaN(value)) {
//       setSelectedDate(value);
//       setCurrentMonth(value);
//       setManualInput(format(value, "dd/MM/yyyy"));
//     } else if (value === null) {
//       setSelectedDate(null);
//       setManualInput("");
//     }
//   }, [value]);

//   // Close calendar on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (calendarRef.current && !calendarRef.current.contains(e.target)) {
//         setShowCalendar(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Helper to parse dd/mm/yyyy string to Date (returns null if invalid)
//   const parseDMY = (str) => {
//     const parts = str.split("/");
//     if (parts.length !== 3) return null;
//     const [dStr, mStr, yStr] = parts;
//     if (dStr.length !== 2 || mStr.length !== 2 || yStr.length !== 4)
//       return null;
//     const day = parseInt(dStr, 10);
//     const month = parseInt(mStr, 10);
//     const year = parseInt(yStr, 10);
//     const dt = new Date(year, month - 1, day);
//     if (isNaN(dt)) return null;
//     // cross-check components to avoid month overflow (e.g., 31 Feb -> JS rolls over)
//     if (
//       dt.getDate() !== day ||
//       dt.getMonth() !== month - 1 ||
//       dt.getFullYear() !== year
//     )
//       return null;
//     return dt;
//   };

//   const handleInput = (e) => {
//     let raw = e.target.value;

//     // Remove any non-digit and non-slash characters, then remove extra slashes
//     raw = raw.replace(/[^0-9/]/g, "");

//     // Remove existing slashes to handle typing/deleting consistently
//     let digits = raw.replace(/\//g, "");
//     if (digits.length > 8) digits = digits.slice(0, 8);

//     // Build formatted with slashes as user types: dd / mm / yyyy
//     const dd = digits.slice(0, 2);
//     const mm = digits.slice(2, 4);
//     const yyyy = digits.slice(4, 8);
//     let formatted = "";
//     if (dd) formatted += dd;
//     if (mm) formatted += "/" + mm;
//     if (yyyy) formatted += "/" + yyyy;

//     // If user cleared everything
//     if (formatted === "") {
//       setManualInput("");
//       setSelectedDate(null);
//       // Keep currentMonth as-is so calendar doesn't jump unnecessarily
//       if (onChange) onChange(null);
//       return;
//     }

//     // Validate only when length for that segment reached
//     // Day: validate only when dd length === 2
//     let validatedDd = dd;
//     if (dd.length === 2) {
//       const dayNum = parseInt(dd, 10);
//       if (isNaN(dayNum) || dayNum < 1) validatedDd = "01";
//       else if (dayNum > 31) validatedDd = "31";
//     }

//     // Month: validate only when mm length === 2
//     let validatedMm = mm;
//     if (mm.length === 2) {
//       const monthNum = parseInt(mm, 10);
//       if (isNaN(monthNum) || monthNum < 1) validatedMm = "01";
//       else if (monthNum > 12) validatedMm = "12";
//     }

//     // Year: validate only when yyyy length === 4
//     let validatedYyyy = yyyy;
//     if (yyyy.length === 4) {
//       const yearNum = parseInt(yyyy, 10);
//       // only clamp when full year provided
//       if (isNaN(yearNum)) validatedYyyy = "";
//       else if (yearNum < 2015) validatedYyyy = "2015";
//       else if (yearNum > 2030) validatedYyyy = "2030";
//     }

//     // Reconstruct formatted from validated segments but keep partial user input for incomplete segments
//     let newFormatted = "";
//     if (validatedDd) newFormatted += validatedDd;
//     if (mm) newFormatted += "/" + (validatedMm || mm);
//     if (yyyy) newFormatted += "/" + (validatedYyyy || yyyy);

//     setManualInput(newFormatted);

//     // Only attempt to parse & set date when we have a full dd/mm/yyyy (length 10)
//     if (newFormatted.length === 10) {
//       const parsed = parseDMY(newFormatted);
//       if (parsed) {
//         setSelectedDate(parsed);
//         setCurrentMonth(parsed);
//         if (onChange) onChange(parsed);
//       } else {
//         // Invalid full date -> do not set selected date
//         // Keep manualInput so user can correct
//       }
//     } else {
//       // for partial input do not change selectedDate (except clearing handled above)
//     }
//   };

//   const handleDateClick = (date) => {
//     if (!date) return;
//     setSelectedDate(date);
//     setManualInput(format(date, "dd/MM/yyyy"));
//     setCurrentMonth(date);
//     setShowCalendar(false);
//     if (onChange) onChange(date);
//   };

//   const generateCalendar = () => {
//     const startOfMonth = new Date(
//       currentMonth.getFullYear(),
//       currentMonth.getMonth(),
//       1
//     );
//     const endOfMonth = new Date(
//       currentMonth.getFullYear(),
//       currentMonth.getMonth() + 1,
//       0
//     );
//     const startDay = startOfMonth.getDay(); // 0..6
//     const totalDays = endOfMonth.getDate();
//     const days = [];
//     for (let i = 0; i < startDay; i++) days.push(null);
//     for (let d = 1; d <= totalDays; d++)
//       days.push(
//         new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d)
//       );
//     return days;
//   };

//   const prevMonth = () =>
//     setCurrentMonth(
//       new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
//     );
//   const nextMonth = () =>
//     setCurrentMonth(
//       new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
//     );

//   const handleMonthYearChange = (type, value) => {
//     if (type === "month") {
//       setCurrentMonth(new Date(currentMonth.getFullYear(), value, 1));
//     } else {
//       setCurrentMonth(new Date(value, currentMonth.getMonth(), 1));
//     }
//   };

//   return (
//     <div className="relative w-full font-[Poppins]" ref={calendarRef}>
//       {label && (
//         <div className="flex items-center gap-1 mb-0.5">
//           <label className="text-sm font-medium text-gray-700 items-center mb-1 block">
//             {label}
//           </label>
//           {tooltipContent && (
//             <CustomTooltip title={tooltipContent} placement={tooltipPlacement} arrow>
//               <span>
//                 <AiOutlineInfoCircle className="text-gray-500 text-sm cursor-pointer hover:text-gray-700 transition-colors" />
//               </span>
//             </CustomTooltip>
//           )}
//         </div>
//       )}

//       <div className="relative">
//         <input
//           type="text"
//           value={manualInput}
//           onChange={handleInput}
//           placeholder="DD-MM-YYYY"
//           maxLength={10}
//           inputMode="numeric"
//           onClick={() => setShowCalendar((s) => !s)}
//           className={`w-full px-3 py-2 text-sm rounded-md border outline-none transition-all duration-300
//             ${error
//               ? "border-red-400 focus:ring-2 focus:ring-red-300"
//               : "border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-indigo-200"
//             } `}
//         />

//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-5 h-5 text-gray-500 absolute right-3 top-2.5 pointer-events-none"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth="2"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//           />
//         </svg>

//         {error && (
//           <p className="mt-1 text-xs text-red-500 font-medium animate-fadeIn">
//             {errorText}
//           </p>
//         )}
//       </div>

//       {showCalendar && (
//         <div className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-xl border border-gray-200 p-4 animate-fade-in">
//           <div className="flex justify-between items-center mb-3">
//             <button
//               onClick={prevMonth}
//               className="text-gray-600 hover:text-blue-600 font-bold text-lg"
//             >
//               ‹
//             </button>

//             <div className="flex items-center gap-2">
//               <select
//                 value={currentMonth.getMonth()}
//                 onChange={(e) =>
//                   handleMonthYearChange("month", parseInt(e.target.value, 10))
//                 }
//                 className="bg-gray-100 text-gray-700 text-sm rounded-md px-2 py-1 focus:outline-none"
//               >
//                 {Array.from({ length: 12 }).map((_, i) => (
//                   <option key={i} value={i}>
//                     {new Date(0, i).toLocaleString("default", {
//                       month: "short",
//                     })}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={currentMonth.getFullYear()}
//                 onChange={(e) =>
//                   handleMonthYearChange("year", parseInt(e.target.value, 10))
//                 }
//                 className="bg-gray-100 text-gray-700 text-sm rounded-md px-2 py-1 focus:outline-none"
//               >
//                 {Array.from({ length: 16 }).map((_, i) => {
//                   const year = 2015 + i;
//                   return (
//                     <option key={year} value={year}>
//                       {year}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>

//             <button
//               onClick={nextMonth}
//               className="text-gray-600 hover:text-blue-600 font-bold text-lg"
//             >
//               ›
//             </button>
//           </div>

//           <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 mb-1">
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//               <div key={d}>{d}</div>
//             ))}
//           </div>

//           <div className="grid grid-cols-7 text-center gap-1">
//             {generateCalendar().map((date, i) => (
//               <div
//                 key={i}
//                 onClick={() => date && handleDateClick(date)}
//                 className={`cursor-pointer py-2 rounded-full transition-all duration-200 ${!date
//                   ? "invisible"
//                   : selectedDate &&
//                     date.toDateString() === selectedDate.toDateString()
//                     ? "bg-blue-600 text-white"
//                     : "hover:bg-blue-100 text-gray-700"
//                   }`}
//               >
//                 {date ? date.getDate() : ""}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UniversalDatePicker;


import { AiOutlineInfoCircle } from "react-icons/ai";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CustomTooltip from "./CustomTooltip";
import { useEffect, useState } from "react";
import Alert from '@mui/material/Alert';

const UniversalDatePicker = ({
  id,
  name,
  label,
  value,
  onChange,
  // placeholder = '',
  tooltipContent = '',
  tooltipPlacement = 'top',
  // error = false,
  // errorText = '',
  minDate,
  maxDate,
  defaultValue,
  views
}) => {
  const [cleared, setCleared] = useState(false);
  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => { };
  }, [cleared]);
  return (
    <div className='w-full'>
      <div className='flex items-center gap-2 mb-2'>
        {label && (
          <label className='text-sm font-medium text-gray-800'>{label}</label>
        )}
        {tooltipContent && (
          <CustomTooltip
            title={tooltipContent}
            placement={tooltipPlacement}
            arrow
          >
            <span>
              <AiOutlineInfoCircle className='text-gray-500 cursor-pointer hover:text-gray-700' />
            </span>
          </CustomTooltip>
        )}
      </div>

      <LocalizationProvider dateAdapter={AdapterDateFns} className="h-5 bg-slate-500" >
        {/* <DatePicker
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    minDate={minDate}
                    maxDate={maxDate}
                    views={views}
                    defaultValue={defaultValue || null}
                    format='dd/MM/yyyy'
                    renderInput={(params) => (
                        <div >
                            <input
                                {...params.inputProps}
                                placeholder={placeholder}
                                className={`block w-full p-2 h-5 bg-slate-800 border rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm ${error ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {error && (
                                <p className="mt-1 text-sm text-red-500">{errorText}</p>
                            )}
                        </div>
                    )}
                    sx={{
                        '& .MuiInputBase-root': {
                            borderRadius: "6px",
                            fontSize: "0.95rem",
                            height: '38px',
                            backgroundColor: '#fff',
                            boxShadow: "0px 0px 1px rgba(0, 0, 0, 0.5)",
                            color: '',
                        },
                    }}
                /> */}
        <DatePicker
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          views={views}
          defaultValue={defaultValue || null}
          format="dd/MM/yyyy"
          slotProps={{
            textField: {
              fullWidth: true,
              // placeholder,
              // error: false,
              // helperText: errorText || null,
              variant: "outlined",
              InputProps: {
                style: {
                  backgroundColor: "#fff",
                  borderRadius: 6,
                  fontSize: "0.95rem",
                  height: "38px",
                  boxShadow: "0px 0px 1px rgba(0, 0, 0, 0.3)",
                },
              },
              InputLabelProps: {
                shrink: true,
              },
            },
            field: { clearable: true, onClear: () => setCleared(true) },
          }}
        />
      </LocalizationProvider>
      {/* {cleared && (
                <Alert
                    sx={{ position: 'absolute', bottom: 0, right: 0 }}
                    severity="success"
                >
                    Field cleared!
                </Alert>
            )} */}
    </div>
  );
};

export default UniversalDatePicker;

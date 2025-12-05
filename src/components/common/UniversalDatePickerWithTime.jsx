import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";

const UniversalDatePickerWithTime = ({
    label = "Select Date & Time",
    defaultDate = new Date(),
    onChange,
    showTimePicker = true,
    is24Hour = false,
    error = false,
    errorText = "",
    tooltipContent = "",
    tooltipPlacement = "top",
    value, // ✅ Controlled prop
}) => {
    const initializedRef = useRef(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(defaultDate);
    const [manualInput, setManualInput] = useState("");
    const [time, setTime] = useState({
        hours: defaultDate.getHours(),
        minutes: defaultDate.getMinutes(),
        seconds: defaultDate.getSeconds(),
    });
    const calendarRef = useRef(null);

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;
        if (defaultDate instanceof Date && !isNaN(defaultDate)) {
            setSelectedDate(defaultDate);
            setCurrentMonth(defaultDate);
            setManualInput(format(defaultDate, "dd/MM/yyyy HH:mm:ss"));
        }
    }, []);

    /* ------------------ Sync with external `value` ------------------ */
    useEffect(() => {
        if (value instanceof Date && !isNaN(value)) {
            setSelectedDate(value);
            setCurrentMonth(value);
            updateInputDisplay(value);
            setTime({
                hours: value.getHours(),
                minutes: value.getMinutes(),
                seconds: value.getSeconds(),
            });
        } else if (value === null) {
            setSelectedDate(null);
            setManualInput("");
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const parseDMY = (str) => {
        const parts = str.split("/");
        if (parts.length !== 3) return null;
        const [d, m, y] = parts.map((x) => parseInt(x, 10));
        const dt = new Date(y, m - 1, d);
        if (dt.getDate() !== d || dt.getMonth() !== m - 1 || dt.getFullYear() !== y)
            return null;
        return dt;
    };

    const updateInputDisplay = (dateObj) => {
        if (!dateObj) return setManualInput("");
        const pattern = is24Hour ? "dd/MM/yyyy HH:mm:ss" : "dd/MM/yyyy hh:mm:ss a";
        setManualInput(format(dateObj, pattern));
    };

    const handleInput = (e) => {
        const value = e.target.value;
        setManualInput(value);
        const parts = value.split(" ");
        const datePart = parts[0];
        const parsed = parseDMY(datePart);
        if (parsed) {
            parsed.setHours(time.hours, time.minutes, time.seconds);
            setSelectedDate(parsed);
            onChange?.(parsed);
        }
    };

    const handleDateClick = (date) => {
        if (!date) return;
        date.setHours(time.hours, time.minutes, time.seconds);
        setSelectedDate(date);
        setCurrentMonth(date);
        updateInputDisplay(date);
        setShowCalendar(false);
        onChange?.(date);
    };

    const handleTimeChange = (type, value) => {
        const num = parseInt(value, 10) || 0;
        setTime((prev) => {
            const updated = { ...prev, [type]: num };
            if (selectedDate) {
                const newDate = new Date(selectedDate);
                newDate.setHours(updated.hours, updated.minutes, updated.seconds);
                setSelectedDate(newDate);
                updateInputDisplay(newDate);
                onChange?.(newDate);
            }
            return updated;
        });
    };

    const generateCalendar = () => {
        const start = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
        );
        const end = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1,
            0
        );
        const startDay = start.getDay();
        const totalDays = end.getDate();
        const days = [];
        for (let i = 0; i < startDay; i++) days.push(null);
        for (let d = 1; d <= totalDays; d++)
            days.push(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d)
            );
        return days;
    };

    const prevMonth = () =>
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
    const nextMonth = () =>
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );

    return (
        <div className="relative w-full max-w-xs font-[Poppins]" ref={calendarRef}>
            {label && (
                <div className="flex items-center gap-1 mb-0.5">
                    <label className="text-sm font-medium text-gray-700 items-center mb-1 block">
                        {label}
                    </label>
                    {tooltipContent && (
                        <CustomTooltip title={tooltipContent} placement={tooltipPlacement} arrow>
                            <span>
                                <AiOutlineInfoCircle className="text-gray-500 text-sm cursor-pointer hover:text-gray-700 transition-colors" />
                            </span>
                        </CustomTooltip>
                    )}
                </div>
            )}

            <div className="relative">
                <input
                    type="text"
                    value={manualInput}
                    onChange={handleInput}
                    placeholder="dd/mm/yyyy hh:mm:ss"
                    onClick={() => setShowCalendar((s) => !s)}
                    readOnly
                    className={`w-full px-3 py-2 text-sm rounded-md border outline-none transition-all duration-300
            ${error
                            ? "border-red-400 focus:ring-2 focus:ring-red-300"
                            : "border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-indigo-200"
                        } `}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500 absolute right-3 top-2.5 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>

                {error && (
                    <p className="mt-1 text-xs text-red-500 font-medium animate-fadeIn">
                        {errorText}
                    </p>
                )}
            </div>

            {showCalendar && (
                <div className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-xl border border-gray-200 p-4">
                    {/* Month Year Controls */}
                    <div className="flex justify-between items-center mb-3">
                        <button
                            onClick={prevMonth}
                            className="text-gray-600 hover:text-blue-600 font-bold text-lg"
                        >
                            ‹
                        </button>

                        <div className="flex items-center gap-2">
                            <select
                                value={currentMonth.getMonth()}
                                onChange={(e) =>
                                    setCurrentMonth(
                                        new Date(
                                            currentMonth.getFullYear(),
                                            parseInt(e.target.value, 10),
                                            1
                                        )
                                    )
                                }
                                className="bg-gray-100 text-gray-700 text-sm rounded-md px-2 py-1"
                            >
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <option key={i} value={i}>
                                        {new Date(0, i).toLocaleString("default", {
                                            month: "short",
                                        })}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={currentMonth.getFullYear()}
                                onChange={(e) =>
                                    setCurrentMonth(
                                        new Date(
                                            parseInt(e.target.value, 10),
                                            currentMonth.getMonth(),
                                            1
                                        )
                                    )
                                }
                                className="bg-gray-100 text-gray-700 text-sm rounded-md px-2 py-1"
                            >
                                {Array.from({ length: 16 }).map((_, i) => {
                                    const year = 2015 + i;
                                    return (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <button
                            onClick={nextMonth}
                            className="text-gray-600 hover:text-blue-600 font-bold text-lg"
                        >
                            ›
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 mb-1">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <div key={d}>{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 text-center gap-1">
                        {generateCalendar().map((date, i) => (
                            <div
                                key={i}
                                onClick={() => date && handleDateClick(date)}
                                className={`cursor-pointer py-2 rounded-full transition-all duration-200 ${!date
                                    ? "invisible"
                                    : selectedDate &&
                                        date.toDateString() === selectedDate.toDateString()
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-blue-100 text-gray-700"
                                    }`}
                            >
                                {date ? date.getDate() : ""}
                            </div>
                        ))}
                    </div>

                    {/* Time Picker */}
                    {/* Time Picker */}
                    {showTimePicker && (
                        <div className="mt-4 flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2 text-sm">
                                {/* Hours */}
                                <input
                                    type="number"
                                    value={
                                        is24Hour
                                            ? String(time.hours).padStart(2, "0")
                                            : String(((time.hours + 11) % 12) + 1).padStart(2, "0")
                                    }
                                    onChange={(e) => {
                                        let v = e.target.value.replace(/\D/g, "").slice(0, 2); // Only digits, max 2 chars
                                        let num = parseInt(v || "0", 10);
                                        const limit = is24Hour ? 23 : 12;
                                        if (num > limit) num = limit;
                                        handleTimeChange("hours", num);
                                    }}
                                    inputMode="numeric"
                                    className="w-14 text-center border rounded-md p-1"
                                    maxLength={2}
                                />

                                <span>:</span>

                                {/* Minutes */}
                                <input
                                    type="number"
                                    value={String(time.minutes).padStart(2, "0")}
                                    onChange={(e) => {
                                        let v = e.target.value.replace(/\D/g, "").slice(0, 2);
                                        let num = parseInt(v || "0", 10);
                                        if (num > 59) num = 59;
                                        handleTimeChange("minutes", num);
                                    }}
                                    inputMode="numeric"
                                    className="w-14 text-center border rounded-md p-1"
                                    maxLength={2}
                                />

                                <span>:</span>

                                {/* Seconds */}
                                <input
                                    type="number"
                                    value={String(time.seconds).padStart(2, "0")}
                                    onChange={(e) => {
                                        let v = e.target.value.replace(/\D/g, "").slice(0, 2);
                                        let num = parseInt(v || "0", 10);
                                        if (num > 59) num = 59;
                                        handleTimeChange("seconds", num);
                                    }}
                                    inputMode="numeric"
                                    className="w-14 text-center border rounded-md p-1"
                                    maxLength={2}
                                />

                                {!is24Hour && (
                                    <select
                                        value={time.hours >= 12 ? "PM" : "AM"}
                                        onChange={(e) => {
                                            const newHours =
                                                e.target.value === "PM"
                                                    ? (time.hours % 12) + 12
                                                    : time.hours % 12;
                                            handleTimeChange("hours", newHours);
                                        }}
                                        className="border rounded-md px-2 py-1 text-sm"
                                    >
                                        <option>AM</option>
                                        <option>PM</option>
                                    </select>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UniversalDatePickerWithTime;

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

/* ---------- Custom Dropdown ---------- */
const CustomDropdown = ({ value, options, onChange, width = "w-20" }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const close = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    return (
        <div className={`relative w-full`} ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center px-2 py-1 text-sm rounded-md border outline-none transition-all duration-300 border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-indigo-200"
            >
                <span>{String(value).padStart(2, "0")}</span>
                <ChevronDown
                    size={14}
                    className={`ml-1 transition-transform duration-200 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {open && (
                <ul className="absolute z-50 mt-1 max-h-40 overflow-y-auto w-full bg-white border border-gray-200 rounded-md shadow-lg text-sm">
                    {options.map((opt) => (
                        <li
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                            className={`px-3 py-1 cursor-pointer hover:bg-blue-100 ${value === opt ? "bg-blue-500 text-white" : "text-gray-700"
                                }`}
                        >
                            {String(opt).padStart(2, "0")}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

/* ---------- UniversalTimePicker ---------- */
const UniversalTimePicker = ({
    label = "Select Time",
    is24Hour = true,
    showSeconds = true,
    value,
    defaultTime = new Date(),
    onChange,
    error = false,
    errorText = "",
    tooltipContent = "",
    tooltipPlacement = "top",
}) => {
    // Initialize with value or defaultTime
    const [time, setTime] = useState(() =>
        value
            ? { ...value }
            : {
                hours: defaultTime.getHours(),
                minutes: defaultTime.getMinutes(),
                seconds: defaultTime.getSeconds(),
            }
    );

    // Keep in sync with parent (controlled mode)
    useEffect(() => {
        if (value) setTime(value);
    }, [value]);

    // Emit changes to parent
    const updateTime = (updated) => {
        setTime(updated);
        if (onChange) onChange(updated);
    };

    const handleChange = (field, newValue) => {
        const updated = { ...time, [field]: parseInt(newValue, 10) };
        updateTime(updated);
    };

    const handleAmPmChange = (val) => {
        let updated = { ...time };
        const isPM = val === "PM";
        if (isPM && updated.hours < 12) updated.hours += 12;
        if (!isPM && updated.hours >= 12) updated.hours -= 12;
        updateTime(updated);
    };

    const hoursOptions = is24Hour
        ? Array.from({ length: 24 }, (_, i) => i)
        : Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
    const minutesSecondsOptions = Array.from({ length: 60 }, (_, i) => i);

    return (
        <div className="inline-flex flex-col gap-1">
            {label && (
                <div className="flex items-center gap-1 mb-0.5">
                    <label className="text-sm font-medium text-gray-700 items-center mb-0.5 block">
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

            <div
                className={`flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm
            ${error
                        ? "border-red-400 focus:ring-2 focus:ring-red-300"
                        : "border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-indigo-200"
                    } `}>
                {/* Hours */}
                <CustomDropdown
                    value={is24Hour ? time.hours : ((time.hours + 11) % 12) + 1}
                    options={hoursOptions}
                    onChange={(v) => handleChange("hours", v)}
                />

                <span>:</span>

                {/* Minutes */}
                <CustomDropdown
                    value={time.minutes}
                    options={minutesSecondsOptions}
                    onChange={(v) => handleChange("minutes", v)}
                />

                {showSeconds && (
                    <>
                        <span>:</span>
                        <CustomDropdown
                            value={time.seconds}
                            options={minutesSecondsOptions}
                            onChange={(v) => handleChange("seconds", v)}
                        />
                    </>
                )}

                {!is24Hour && (
                    <CustomDropdown
                        value={time.hours >= 12 ? "PM" : "AM"}
                        options={["AM", "PM"]}
                        onChange={(v) => handleAmPmChange(v)}
                        width="w-16"
                    />
                )}
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-500 font-medium animate-fadeIn">
                    {errorText}
                </p>
            )}
        </div>
    );
};

export default UniversalTimePicker;

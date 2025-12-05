// import { AiOutlineInfoCircle } from "react-icons/ai";
// import CustomTooltip from "./CustomTooltip";


// const InputField = ({
//   id,
//   name,
//   label,
//   tooltipContent = "",
//   value,
//   onChange,
//   type = "text",
//   placeholder = "",
//   error = false,
//   errorText = "",
//   // noSpaces = false,
//   tooltipPlacement = "top",
//   readOnly = false,
//   style = {},
//   maxLength = "",
//   accept = "",
//   required = false,
//   // max = { maxLength },
//   className = "",
//   ref = null,
//   divClassName = "",
//   disabled = false
// }) => {
//   // const handleChange = (e) => {
//   //     let inputValue = e.target.value;
//   //     if (noSpaces) {
//   //         inputValue = inputValue.replace(/\s/g, "");
//   //     }
//   //     onChange(inputValue);
//   // };

//   return (
//     <div className={`w-full ${divClassName}`}>
//       {label && (
//         <div className="flex items-center gap-2 mb-2">
//           <label htmlFor={id} className="text-sm font-medium text-gray-700">
//             {label}
//           </label>
//           {tooltipContent && (
//             <CustomTooltip
//               title={tooltipContent}
//               placement={tooltipPlacement}
//               arrow
//             >
//               <span>
//                 <AiOutlineInfoCircle className="text-gray-500 cursor-pointer hover:text-gray-700" />
//               </span>
//             </CustomTooltip>
//           )}
//         </div>
//       )}

//       <input
//         id={id}
//         name={name}
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         readOnly={readOnly}
//         style={style}
//         disabled={disabled}
//         maxLength={maxLength}
//         className={`block w-full text-sm p-1.5 h-[2.275rem] border bg-white rounded-md shadow-sm focus:ring-0 focus:shadow focus:ring-gray-300 focus:outline-none sm:text-sm ${className} ${error ? "border-red-500" : "border-gray-300"
//           }`}
//         accept={accept}
//         ref={ref}
//         inputMode={type === "number" ? "numeric" : "text"}
//       />

//       {error && <p className="mt-1 text-sm text-red-500">{errorText}</p>}
//     </div>
//   );
// };

// export default InputField;







import { AiOutlineInfoCircle } from "react-icons/ai";
import CustomTooltip from "./CustomTooltip";

const InputField = ({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error = false,
  errorText = "",
  tooltipContent = "",
  tooltipPlacement = "top",
  readOnly = false,
  style = {},
  maxLength = "",
  accept = "",
  required = false,
  className = "",
  divClassName = "",
  disabled = false,
  icon = null,
}) => {
  return (
    <div className={`w-full ${divClassName}`}>
      {label && (
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            {icon && <span className="text-sm">{icon}</span>}
            <label
              htmlFor={id}
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          </div>
          {tooltipContent && (
            <CustomTooltip title={tooltipContent} placement={tooltipPlacement} arrow>
              <span>
                <AiOutlineInfoCircle className="text-gray-500 text-sm cursor-pointer hover:text-gray-700 transition-colors" />
              </span>
            </CustomTooltip>
          )}
        </div>
      )}

      <div className="relative group">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          maxLength={maxLength}
          accept={accept}
          required={required}
          style={style}
          className={`w-full px-3 py-2 text-sm rounded-md border outline-none transition-all duration-300
            ${error
              ? "border-red-400 focus:ring-2 focus:ring-red-300"
              : "border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-indigo-200"
            }
            ${readOnly || disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"}
            shadow-sm hover:shadow-md focus:shadow-lg placeholder-gray-400 ${className}`}
        />

        {/* Glow underline animation on focus */}
        {/* <span
          className={`absolute bottom-0 left-0 w-0 h-1 bg-indigo-500 rounded-full transition-all duration-300 group-focus-within:w-full ${error ? "bg-red-400" : ""
            }`}
        ></span> */}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium animate-fadeIn">
          {errorText}
        </p>
      )}
    </div>
  );
};

export default InputField;

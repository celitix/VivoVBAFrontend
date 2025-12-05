import toast from "react-hot-toast";
import { FileCheck2 } from "lucide-react";

export const CustomToast = (importedCount, totalCount) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } w-80 backdrop-blur-md bg-white/80 border border-gray-200 shadow-md rounded-2xl p-4 flex gap-4 items-center`}
      >
        {/* Icon container */}
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <FileCheck2 size={22} className="text-green-600" />
        </div>

        <div className="flex flex-col">
          <p className="text-gray-900 text-sm font-semibold">
            Import Completed
          </p>
          <p className="text-gray-600 text-xs mt-1">
            <span className="font-semibold text-gray-800">
              {importedCount}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {totalCount}
            </span>{" "}
            items imported
          </p>
        </div>
      </div>
    ),
    {
      duration: 5000,
      position: "top-center",
    }
  );
};

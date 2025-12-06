import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// CATEGORY BUTTONS (Top Capsule Filters)
const UNIT_CATEGORIES = [
    { label: "All", value: "all" },
    { label: "Packaging / Count", value: "packaging" },
    { label: "Area Units", value: "area" },
    { label: "Length Units", value: "length" },
    { label: "Volume Units", value: "volume" },
    { label: "Weight Units", value: "weight" },
    { label: "Construction", value: "construction" },
];

// GROUPED DATA
const MeasuringUnitsGrouped = {
    packaging: [
        { label: "Bag", value: "BAG" },
        { label: "Box", value: "BOX" },
        { label: "Bundle", value: "BUNDLE" },
        { label: "Packet", value: "PACKET" },
        { label: "Roll", value: "ROLL" },
        { label: "Bottle", value: "BOTTLE" },
        { label: "Can", value: "CAN" },
        { label: "Case", value: "CASE" },
        { label: "Carton", value: "CARTON" },
        { label: "Drum", value: "DRUM" },
        { label: "Sack", value: "SACK" },
        { label: "Pallet", value: "PALLET" },
        { label: "Piece", value: "PIECE" },
        { label: "Pair", value: "PAIR" },
        { label: "Set", value: "SET" },
        { label: "Unit", value: "UNIT" },
    ],

    area: [
        { label: "Square Feet (sqft)", value: "SQFT" },
        { label: "Square Meter (sqm)", value: "SQM" },
        { label: "Square Yard (sqyd)", value: "SQYD" },
        { label: "Acre", value: "ACRE" },
        { label: "Hectare", value: "HECTARE" },
        { label: "Cent", value: "CENT" },
        { label: "Ground", value: "GROUND" },
        { label: "Bigha", value: "BIGHAA" },
        { label: "Katha", value: "KATHA" },
    ],

    length: [
        { label: "Millimeter (mm)", value: "MM" },
        { label: "Centimeter (cm)", value: "CM" },
        { label: "Meter (m)", value: "M" },
        { label: "Feet (ft)", value: "FT" },
        { label: "Inch (in)", value: "IN" },
        { label: "Kilometer (km)", value: "KM" },
        { label: "Running Meter (RM)", value: "RM" },
        { label: "Running Feet (RFT)", value: "RFT" },
    ],

    volume: [
        { label: "Cubic Feet (cft)", value: "CFT" },
        { label: "Cubic Meter (cum)", value: "CUM" },
        { label: "Litre (ltr)", value: "LTR" },
        { label: "Millilitre (ml)", value: "ML" },
        { label: "Gallon", value: "GALLON" },
    ],

    weight: [
        { label: "Gram (gm)", value: "GM" },
        { label: "Kilogram (kg)", value: "KG" },
        { label: "Quintal", value: "QTL" },
        { label: "Ton", value: "TON" },
        { label: "Metric Ton (mt)", value: "MT" },
    ],

    construction: [
        { label: "Number (Nos)", value: "NOS" },
        { label: "Bag (Cement)", value: "BAG_CEMENT" },
        { label: "Load", value: "LOAD" },
        { label: "Truck Load", value: "TRUCK_LOAD" },
        { label: "Tractor Load", value: "TRACTOR_LOAD" },
        { label: "Tin", value: "TIN" },
        { label: "Barrel", value: "BARREL" },
    ],
};

const ALL_UNITS = Object.values(MeasuringUnitsGrouped).flat();

export default function AdvancedUnitDropdown({ onChange }) {
    const [selectedUnits, setSelectedUnits] = useState([]);
    const [open, setOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("all");
    const [search, setSearch] = useState("");

    const filteredUnits = useMemo(() => {
        let list = activeCategory === "all" ? ALL_UNITS : MeasuringUnitsGrouped[activeCategory];
        return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
    }, [activeCategory, search]);

    const toggleSelection = (unit) => {
        const exists = selectedUnits.some((u) => u.value === unit.value);
        const updated = exists
            ? selectedUnits.filter((u) => u.value !== unit.value)
            : [...selectedUnits, unit];
        setSelectedUnits(updated);
        onChange && onChange(updated);
    };

    return (
        <div className="w-full max-w-xl mx-auto relative font-inter">
            {/* Dropdown Trigger */}
            <div
                className="border p-3 rounded-xl bg-white shadow-sm flex justify-between items-center cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <div className="flex flex-wrap gap-2">
                    {selectedUnits.length === 0 ? (
                        <span className="text-gray-500">Select Units</span>
                    ) : (
                        selectedUnits.map((u) => (
                            // <span key={u.value} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                            //     {u.label}
                            // </span>
                            <div
                                key={u.value}
                                className="px-2 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-1"
                            >
                                <span>{u.label}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedUnits(selectedUnits.filter((x) => x.value !== u.value));
                                    }}
                                    className="text-gray-600 hover:text-black"
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <ChevronDown size={20} />
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-white shadow-xl rounded-2xl p-4 max-h-96 overflow-y-auto border"
                    >
                        {/* Category Pills */}
                        <div className="flex gap-2 flex-wrap mb-3">
                            {UNIT_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setActiveCategory(cat.value)}
                                    className={`px-3 py-1 rounded-full text-sm border transition ${activeCategory === cat.value
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-gray-700 border-gray-200"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full p-2 rounded-lg border mb-4"
                        />

                        {/* Options List */}
                        <div className="space-y-2">
                            {filteredUnits.map((unit) => {
                                const checked = selectedUnits.some((u) => u.value === unit.value);
                                return (
                                    <div
                                        key={unit.value}
                                        onClick={() => toggleSelection(unit)}
                                        className="flex items-center justify-between p-2 border rounded-xl cursor-pointer hover:bg-gray-100"
                                    >
                                        <span>{unit.label}</span>
                                        <input type="checkbox" checked={checked} readOnly />
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

import React, { useMemo, useState } from "react";

/** Usage:
 * <TransferList
 *   initialLeft={[{id:1,label:"Apple"},{id:2,label:"Banana"},{id:3,label:"Cherry"}]}
 *   titleLeft="Available"
 *   titleRight="Selected"
 *   onChange={(left,right)=>console.log({left,right})}
 * />
 */
export default function ShiftPanel({
  initialLeft = [],
  initialRight = [],
  titleLeft = "Source",
  titleRight = "Destination",
  onChange,
}) {
  const [left, setLeft] = useState(initialLeft);
  const [right, setRight] = useState(initialRight);

  const [leftSel, setLeftSel] = useState(new Set());
  const [rightSel, setRightSel] = useState(new Set());

  const [qLeft, setQLeft] = useState("");
  const [qRight, setQRight] = useState("");

  const filteredLeft = useMemo(
    () => left.filter(i => i.label.toLowerCase().includes(qLeft.toLowerCase())),
    [left, qLeft]
  );
  const filteredRight = useMemo(
    () => right.filter(i => i.label.toLowerCase().includes(qRight.toLowerCase())),
    [right, qRight]
  );

  const notify = (l, r) => onChange?.(l, r);

  const toggle = (set, setter, id) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setter(next);
  };

  const moveSelected = (from) => {
    if (from === "left") {
      const moving = left.filter(i => leftSel.has(i.id));
      if (!moving.length) return;
      const newLeft = left.filter(i => !leftSel.has(i.id));
      const newRight = [...right, ...moving];
      setLeft(newLeft); setRight(newRight); setLeftSel(new Set());
      notify(newLeft, newRight);
    } else {
      const moving = right.filter(i => rightSel.has(i.id));
      if (!moving.length) return;
      const newRight = right.filter(i => !rightSel.has(i.id));
      const newLeft = [...left, ...moving];
      setRight(newRight); setLeft(newLeft); setRightSel(new Set());
      notify(newLeft, newRight);
    }
  };

  const moveAll = (from) => {
    if (from === "left" && left.length) {
      const nl = []; const nr = [...right, ...left];
      setLeft(nl); setRight(nr); setLeftSel(new Set()); notify(nl, nr);
    }
    if (from === "right" && right.length) {
      const nl = [...left, ...right]; const nr = [];
      setLeft(nl); setRight(nr); setRightSel(new Set()); notify(nl, nr);
    }
  };

  const Panel = ({
    title, items, selected, setSelected, query, setQuery, visible
  }) => {
    const allVisibleSelected = visible.length && visible.every(i => selected.has(i.id));
    return (
      <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-2 p-3 sm:p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">{title}</span>
            <span className="text-xs text-gray-500">{items.length} item{items.length !== 1 ? "s" : ""}</span>
          </div>
          <button
            className="text-xs rounded-md px-2 py-1 border border-gray-200 bg-white hover:bg-gray-100"
            onClick={() => {
              const ids = visible.map(i => i.id);
              const next = new Set(selected);
              const all = ids.every(id => next.has(id));
              ids.forEach(id => (all ? next.delete(id) : next.add(id)));
              setSelected(next);
            }}
          >
            {allVisibleSelected ? "Unselect all visible" : "Select all visible"}
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <div className="h-64 sm:h-80 overflow-auto px-2 pb-2">
            {visible.length === 0 ? (
              <div className="flex h-24 items-center justify-center text-sm text-gray-500">No items</div>
            ) : (
              <ul className="space-y-1">
                {visible.map(item => (
                  <li key={item.id}>
                    <label className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer border border-transparent hover:border-gray-200 hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-blue-600"
                        checked={selected.has(item.id)}
                        onChange={() => toggle(selected, setSelected, item.id)}
                      />
                      <span className="text-sm text-gray-800">{item.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 px-3 sm:px-4 py-2">
          <span>Selected: {selected.size}/{items.length}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch">
        {/* Left */}
        <Panel
          title={titleLeft}
          items={left}
          selected={leftSel}
          setSelected={setLeftSel}
          query={qLeft}
          setQuery={setQLeft}
          visible={filteredLeft}
        />

        {/* Controls */}
        <div className="flex md:flex-col gap-2 md:gap-3 justify-center items-center">
          <div className="flex gap-2">
            <button
              onClick={() => moveSelected("left")}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm shadow-sm"
              title="Move selected →"
            >
              &gt;
            </button>
            <button
              onClick={() => moveSelected("right")}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm shadow-sm"
              title="Move selected ←"
            >
              &lt;
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => moveAll("left")}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm shadow-sm"
              title="Move all →"
            >
              &gt;&gt;
            </button>
            <button
              onClick={() => moveAll("right")}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm shadow-sm"
              title="Move all ←"
            >
              &lt;&lt;
            </button>
          </div>
        </div>

        {/* Right */}
        <Panel
          title={titleRight}
          items={right}
          selected={rightSel}
          setSelected={setRightSel}
          query={qRight}
          setQuery={setQRight}
          visible={filteredRight}
        />
      </div>
    </div>
  );
}

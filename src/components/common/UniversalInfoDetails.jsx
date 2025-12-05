import React, { useState } from "react";
import { useMeasure } from "@react-hookz/web";
import {
  useDragControls,
  useMotionValue,
  useAnimate,
  motion,
} from "framer-motion";

const UniversalInfoDetails = ({
  trigger,
  children,
  position = "bottom",
  size = "75vh",
  rounded = true,
  backdrop = true,
}) => {
  const [open, setOpen] = useState(false);

  const [scope, animate] = useAnimate();
  const [drawerRef, { height, width }] = useMeasure();

  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const controls = useDragControls();

  // ✅ FIX: Define transitionConfig
  const transitionConfig = { ease: "easeOut", duration: 0.35 };

  const handleClose = async () => {
    // Fade out backdrop
    animate(scope.current, { opacity: 0 }, transitionConfig);

    // Slide close
    if (position === "bottom") {
      await animate("#drawer", { y: "100%" }, transitionConfig);
    }

    if (position === "right") {
      await animate("#drawer", { x: "100%" }, transitionConfig);
    }

    setOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <div
        onClick={() => setOpen(true)}
        className="inline-block cursor-pointer"
      >
        {trigger}
      </div>

      {/* Drawer */}
      {open && (
        <motion.div
          ref={scope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transitionConfig}
          onClick={handleClose}
          className={`fixed inset-0 z-50 h-full ${
            backdrop ? "bg-black/60" : ""
          }`}
        >
          <motion.div
            id="drawer"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            initial={position === "bottom" ? { y: "100%" } : { x: "100%" }}
            animate={position === "bottom" ? { y: 0 } : { x: 0 }}
            transition={transitionConfig}
            className={`absolute ${
              position === "bottom" ? "bottom-0 w-full" : "right-0 h-full"
            } overflow-hidden bg-white shadow-xl ${
              rounded && position === "bottom" ? "rounded-t-3xl" : ""
            }`}
            style={position === "bottom" ? { height: size } : { width: size }}
            drag={position === "bottom" ? "y" : "x"}
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            onDragEnd={() => {
              if (position === "bottom" && y.get() >= 100) handleClose();
              if (position === "right" && x.get() >= 100) handleClose();
            }}
          >
            {/* Drag handle */}
            {position === "bottom" && (
              <div className="absolute left-0 right-0 top-0 flex justify-center p-4 z-99">
                <button
                  onClick={(e) => {
                    // prevent accidental click during drag
                    if (e.detail === 0) return;
                    handleClose();
                  }}
                  onPointerDown={(e) => controls.start(e)}
                  className="h-2 w-14 bg-neutral-600 rounded-full cursor-grab active:cursor-grabbing"
                />
              </div>
            )}

            {/* Drawer Content */}
            <div className="relative h-full overflow-y-auto p-4 pt-8">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default UniversalInfoDetails;

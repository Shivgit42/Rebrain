import { motion } from "framer-motion";
import type { ReactElement } from "react";

export const SidebarItem = ({
  text,
  icon,
  onClick,
  isActive,
}: {
  text: string;
  icon: ReactElement;
  onClick: () => void;
  isActive?: boolean;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`flex items-center py-2 cursor-pointer rounded-lg max-w-52 pl-4 pr-3 transition-colors ${
        isActive
          ? "bg-indigo-100 dark:bg-amber-400 text-indigo-700 font-semibold"
          : "text-[#374151] hover:bg-gray-100 dark:hover:bg-amber-400/85"
      }`}
      onClick={onClick}
    >
      <motion.div
        whileHover={{ rotate: -5 }}
        className="pr-4 text-[#6b7280] dark:text-white"
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <div className="font-medium tracking-wide dark:text-white">{text}</div>
    </motion.div>
  );
};

import { Logo } from "../icons/Logo";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Sheet, SheetTrigger, SheetContent } from "../components/ui/sheet";
import { SidebarMenu } from "./SidebarMenu";
import { Signout } from "../pages/Signout";

export const Sidebar = ({
  onSelectType,
  selectedType,
}: {
  onSelectType: (
    type: "twitter" | "youtube" | "document" | "link" | "tag" | null
  ) => void;
  selectedType: "twitter" | "youtube" | "document" | "link" | "tag" | null;
}) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isOpen ? "hidden" : "auto";
    }
  }, [isOpen, isMobile]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu */}
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="fixed top-4 left-4 z-[9999] bg-white dark:bg-gray-800 rounded-md shadow-md p-2">
              <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="p-0 w-72">
            <div className="h-full bg-white dark:bg-gray-900 w-full border-r border-gray-200 shadow-md pl-6 flex flex-col justify-between">
              <div>
                <div className="flex text-2xl pt-6 items-center gap-2">
                  <Logo />
                  <span className="text-[#1f2937] font-semibold tracking-tight dark:text-white">
                    ReBrain
                  </span>
                </div>

                <SidebarMenu
                  selectedType={selectedType}
                  onSelectType={onSelectType}
                  closeMenu={() => setIsOpen(false)}
                />
              </div>

              <Signout />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed top-0 left-0 h-screen z-40"
        >
          <div className="h-full bg-white dark:bg-gray-900 w-72 border-r border-gray-200 shadow-md pl-6 flex flex-col justify-between">
            <div>
              <div className="flex text-2xl pt-6 items-center gap-2">
                <Logo />
                <span className="text-[#1f2937] font-semibold tracking-tight dark:text-white">
                  ReBrain
                </span>
              </div>

              <SidebarMenu
                selectedType={selectedType}
                onSelectType={onSelectType}
              />
            </div>

            <Signout />
          </div>
        </motion.div>
      )}
    </>
  );
};

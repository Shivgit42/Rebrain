import { SidebarItem } from "./SidebarItem";
import { SidebarItems } from "../lib/SidebarItem";

type SidebarType = "twitter" | "youtube" | "document" | "link" | "tag" | null;

export const SidebarMenu = ({
  selectedType,
  onSelectType,
  closeMenu,
}: {
  selectedType: SidebarType;
  onSelectType: (type: SidebarType) => void;
  closeMenu?: () => void;
}) => {
  return (
    <div className="pt-10 space-y-2">
      {SidebarItems.map((item) => (
        <SidebarItem
          key={item.text}
          text={item.text}
          icon={item.icon}
          isActive={selectedType === item.type}
          onClick={() => {
            onSelectType(item.type as SidebarType);
            closeMenu?.();
          }}
        />
      ))}
    </div>
  );
};

import { LayersIcon } from "../icons/LayersIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { LinkIcon } from "../icons/LinkIcon";

export const SidebarItems = [
  { text: "All Notes", icon: <LayersIcon className="w-6 h-6" />, type: null },
  {
    text: "Twitter",
    icon: <TwitterIcon className="w-6 h-6" />,
    type: "twitter",
  },
  {
    text: "Youtube",
    icon: <YoutubeIcon className="w-6 h-6" />,
    type: "youtube",
  },
  {
    text: "Documents",
    icon: <DocumentIcon className="w-6 h-6" />,
    type: "document",
  },
  { text: "Links", icon: <LinkIcon className="w-6 h-6" />, type: "link" },
  { text: "Tags", icon: <DocumentIcon className="w-6 h-6" />, type: "tag" },
];

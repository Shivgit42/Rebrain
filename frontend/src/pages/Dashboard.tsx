/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CreateContentModel } from "../components/CreateContentModal";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Sidebar } from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { motion } from "framer-motion";
import { MenuIcon, Moon, Sun } from "lucide-react";
import toast from "react-hot-toast";
import { Sheet, SheetTrigger, SheetContent } from "../components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Tag {
  _id: string;
  title: string;
}

interface Content {
  _id: string;
  title: string;
  link: string;
  type: "twitter" | "youtube" | "document" | "link" | "tag";
  tags: Tag[];
}

export const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { contents, refresh } = useContent();
  const [localContents, setLocalContents] = useState<Content[]>(contents);
  const [filterType, setFilterType] = useState<
    "twitter" | "youtube" | "document" | "link" | "tag" | null
  >(null);
  const [theme, setTheme] = useState("light");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const navigate = useNavigate();

  // determine auth (simple): token presence
  const { isAuthenticated } = useAuth();

  const allTags = useMemo(() => {
    return [
      ...new Set(
        localContents.flatMap((item) => item.tags.map((tag) => tag.title))
      ),
    ];
  }, [localContents]);

  useEffect(() => {
    if (filterType === "tag" && allTags.length > 0 && !selectedTag) {
      setSelectedTag(allTags[0]);
    }
  }, [filterType, allTags, selectedTag]);

  useEffect(() => {
    // sync from hook
    setLocalContents(contents);
  }, [contents]);

  useEffect(() => {
    if (!modalOpen) {
      refresh();
    }
  }, [modalOpen]);

  useEffect(() => {
    const fresh = localStorage.getItem("freshSignup");
    if (fresh === "true") {
      localStorage.removeItem("freshSignup");
      setLocalContents([]);
    }
  }, []);

  const handleDeleteCard = (id: string) => {
    setLocalContents((prev) => prev.filter((item) => item._id !== id));
  };

  const filteredContents = localContents.filter((item) => {
    if (filterType === "tag" && selectedTag) {
      return item.tags.some((tag) => tag.title === selectedTag);
    } else if (filterType) {
      return item.type === filterType;
    }
    return true;
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  // handle share (only for auth users)
  const handleShare = async () => {
    if (!isAuthenticated) {
      navigate("/signup");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        {
          share: true,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const shareUrl = `${window.location.origin}/share/${response.data.hash}`;

      await navigator.clipboard.writeText(shareUrl);
      toast(
        <div className="text-white bg-indigo-600 rounded-xl px-4 py-3 shadow-md">
          Your second brain is live! 🔗 Link copied - share your ideas with the
          world.
        </div>,
        {
          duration: 5000,
          style: {
            background: "transparent",
            boxShadow: "none",
          },
        }
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Unable to create share link"
      );
    }
  };

  // demo sample content (optional) — displayed if an unauthenticated user clicks "Preview sample"
  const sampleContents: Content[] = [
    {
      _id: "demo-1",
      title: "How to learn React fast",
      link: "https://reactjs.org",
      type: "link",
      tags: [
        { _id: "t1", title: "react" },
        { _id: "t2", title: "frontend" },
      ],
    },
    {
      _id: "demo-2",
      title: "Top JS Tips",
      link: "https://developer.mozilla.org",
      type: "link",
      tags: [{ _id: "t3", title: "javascript" }],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <Sidebar onSelectType={setFilterType} selectedType={filterType} />
      </div>

      {/* Main Content */}
      <div className="p-4 md:pl-9 md:ml-72 min-h-screen bg-[#f9fafb] dark:bg-gray-900 dark:text-white w-full overflow-x-hidden">
        <CreateContentModel
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        {/* Mobile Sidebar using Sheet (for mobile) */}
        <div className="md:hidden mb-2">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <MenuIcon className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-4">
              <Sidebar onSelectType={setFilterType} selectedType={filterType} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Header / Title row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sticky top-0 bg-[#f9fafb] dark:bg-gray-900 dark:shadow-white/25 z-10 py-4 px-3 shadow-lg">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent bg-clip-text">
            {filterType
              ? `${
                  filterType.charAt(0).toUpperCase() + filterType.slice(1)
                } Notes`
              : "All Notes"}
          </h1>

          <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:gap-4 flex-wrap">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 shadow-md shadow-purple-400 cursor-pointer text-gray-600 hover:text-purple-400 transition-all ease-in-out dark:bg-white dark:shadow-amber-400 dark:hover:text-amber-400"
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </button>

            <Button
              onClick={handleShare}
              variant="secondary"
              text="Share Brain"
              startIcon={<ShareIcon />}
            />
            <Button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/signup");
                  return;
                }
                setModalOpen(true);
              }}
              variant="primary"
              text="Add Content"
              startIcon={<PlusIcon />}
            />
          </div>
        </div>

        {/* If not authenticated: show overview / hero */}
        {!isAuthenticated && (
          <div className="rounded-lg bg-white p-8 shadow-md mb-6 max-w-4xl">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">
                  Welcome to ReBrain — your second brain
                </h2>
                <p className="text-gray-600 mb-4">
                  Capture links, videos, documents and tags in one place.
                  Organize ideas with tags, filter by content types, and share
                  your curated "second brain" with one click.
                </p>

                <ul className="list-disc ml-5 text-gray-600 space-y-2">
                  <li>Save content from YouTube, Twitter, docs and links</li>
                  <li>Tag items and filter your notes easily</li>
                  <li>Share your curated collections with a public link</li>
                </ul>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => navigate("/signup")}
                    variant="primary"
                    text="Get Started — Sign up"
                  />
                  <Button
                    onClick={() => setLocalContents(sampleContents)}
                    variant="secondary"
                    text="Preview sample"
                  />
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center">
                {/* lightweight illustration */}
                <div className="w-48 h-48 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-center p-6 shadow-lg">
                  <div>
                    <strong className="text-lg block">ReBrain</strong>
                    <span className="text-xs block mt-1">
                      Save • Tag • Share
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tag Filters */}
        {filterType === "tag" && (
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              ...new Set(
                localContents.flatMap((item) =>
                  item.tags.map((tag) => tag.title)
                )
              ),
            ].map((tagTitle) => (
              <button
                key={tagTitle}
                onClick={() => setSelectedTag(tagTitle)}
                className={`px-3 py-1 rounded-full cursor-pointer hover:bg-slate-300 border text-sm transition-all ${
                  selectedTag === tagTitle
                    ? "bg-purple-500 text-white dark:hover:bg-fuchsia-950"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-indigo-500"
                }`}
              >
                #{tagTitle}
              </button>
            ))}
          </div>
        )}

        {/* Content Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredContents.map(({ _id, title, link, tags, type }) => (
            <motion.div
              key={_id}
              className="break-inside-avoid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                id={_id}
                title={title}
                link={link}
                tags={tags}
                type={type}
                onDelete={handleDeleteCard}
              />
            </motion.div>
          ))}

          {/* empty state when there are no contents (and user is authenticated) */}
          {isAuthenticated && filteredContents.length === 0 && (
            <div className="col-span-full p-8 bg-white rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold mb-2">
                Your dashboard is empty
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Add Content</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

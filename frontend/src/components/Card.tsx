/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { ShareIcon } from "../icons/ShareIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { DocumentIcon } from "../icons/DocumentIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { HashTagIcon } from "../icons/TagIcon";

type CardType = "twitter" | "youtube" | "document" | "link" | "tag";

interface Tag {
  _id: string;
  title: string;
}

interface CardProps {
  id: string;
  title: string;
  link: string;
  type: CardType;
  tags: Tag[];
  onDelete?: (id: string) => void;
  hideActions?: boolean;
}

export const Card = ({
  id,
  title,
  link,
  tags,
  type,
  onDelete,
  hideActions,
}: CardProps) => {
  useEffect(() => {
    if (type === "twitter") {
      (window as any).twttr?.widgets?.load();
    }
  }, [type, link]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      onDelete?.(id);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete the content");
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 md:p-4 border border-gray-200 rounded-xl shadow-sm w-full transition-transform hover:scale-[1.01] hover:shadow-md">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="text-gray-500 flex flex-shrink-0">
              {type === "twitter" ? (
                <TwitterIcon className="w-5 h-5 text-gray-500" />
              ) : type === "youtube" ? (
                <YoutubeIcon className="w-5 h-5 text-gray-500" />
              ) : type === "document" ? (
                <DocumentIcon className="w-5 h-5 text-gray-500" />
              ) : type === "link" ? (
                <LinkIcon className="w-5 h-5 text-gray-500" />
              ) : type === "tag" ? (
                <HashTagIcon className="w-5 h-5 text-gray-500" />
              ) : null}
            </div>
            <span className="text-md font-medium break-words">{title}</span>
          </div>
          {!hideActions && (
            <div className="flex items-center text-gray-500 cursor-pointer">
              <div className="pr-4 dark:text-white">
                <a className="break-all" href={link} target="_blank">
                  <ShareIcon />
                </a>
              </div>
              <div className="dark:text-white" onClick={handleDelete}>
                <DeleteIcon />
              </div>
            </div>
          )}
        </div>
        <div className="pt-4">
          {type === "youtube" && (
            <div className="aspect-w-16 aspect-h-9 w-full mb-2">
              <iframe
                className="w-full h-full"
                src={link.replace("watch", "embed").replace("?v=", "/")}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {type === "twitter" && (
            <blockquote className="twitter-tweet">
              <a href={link.replace("x.com", "twitter.com")}></a>
            </blockquote>
          )}

          {type === "document" && (
            <div className="text-sm text-gray-600 line-clamp-3">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                View Document
              </a>
            </div>
          )}

          {type === "link" && (
            <div className="text-sm text-gray-600 line-clamp-3">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                {link}
              </a>
            </div>
          )}

          {tags && tags.length > 0 && type !== "tag" && (
            <div className="pt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag._id}
                  className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded"
                >
                  #{tag.title}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

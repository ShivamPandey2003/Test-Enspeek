import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import {
  FaCopy,
  FaShareAlt,
  FaCogs,
  FaTable,
  FaChartArea,
} from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { useEffect, useState } from "react";
import DropDown from "../../global/DropDown";

import ShareModal from "../../global/ShareModal";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import ListingCopyModal from "../../global/ListingCopyModal";
import { useNavigate } from "react-router";
import { resetStudyInfo } from "../../../store/CrosstabStudySlice";
import Checkbox from "../../ui/Checkbox";

const columnHelper = createColumnHelper<Study>();

const useColumns = ({
  selectedStudies,
  setSelectedStudies,
}: {
  selectedStudies: string[];
  setSelectedStudies: React.Dispatch<React.SetStateAction<string[]>>;
  onStudyClick: (studyId: string) => void;
}) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const [modalRowIndex, setModalRowIndex] = useState<number | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareModalRowIndex, setShareModalRowIndex] = useState<number | null>(
    null
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const onStudyClick = (studyID: string) => {
    dispatch(resetStudyInfo());
    navigate("/create", { state: { studyID } });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-wrapper")) {
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {} = useMutation({
    mutationKey: ["share"],
    mutationFn: async () => {
      const resp = await apiRequest("post", "study/share", {});
      return resp.response;
    },
  });
  const columns: ColumnDef<Study, any>[] = [
    {
      id: "select",
      cell: ({ row }) => {
        const canSelect: boolean =
          Boolean(row.original.isOwner);

        return canSelect ? (
          <Checkbox
            checked={selectedStudies.includes(row.original.studyID)}
            onChange={(e) => {
              const id = row.original.studyID;
              const isChecked = e.target.checked;
              setSelectedStudies((prev) =>
                isChecked ? [...prev, id] : prev.filter((sid) => sid !== id)
              );
            }}
          />
        ) : null;
      },
    },
    columnHelper.accessor("studyName", {
      header: "Name of Study",
      cell: ({ row, getValue }) => {
        const studyId = row.original.studyID;
        return (
          <div
            onClick={() => onStudyClick(studyId)}
            className="w-full cursor-pointer px-2 py-1"
          >
            {getValue()}
          </div>
        );
      },
    }),

    columnHelper.accessor("createdOn", {
      header: "Created On",
      cell: (info) => {
        const rawDate = info.getValue();
        if (!rawDate) return "";
        const dateObj = new Date(rawDate);
        return dateObj.toISOString().slice(0, 10);
      },
    }),

    columnHelper.accessor("name", {
      header: "Project Owner",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("studyState", {
      header: "Current State",
      cell: (info) => {
        const value = info.getValue();
        const color =
          value === "Activated"
            ? "text-action"
            : value === "In-Progress"
            ? "text-gray-800"
            : "text-action";
        return <span className={`${color} font-normal`}>{value}</span>;
      },
    }),
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const rowIndex = row.index;
        const isOpen = openDropdownIndex === rowIndex;
        const { studyID, studyName, hasQuestionnaire, launch } = row.original;

        let DropdownData = [
          {
            Title: "Copy Study",
            Icon: FaCopy,
            onClick: () => {
              setOpenDropdownIndex(null);
              setModalRowIndex(rowIndex);
            },
          },
          {
            Title: "Share Study",
            Icon: FaShareAlt,
            onClick: () => {
              setOpenDropdownIndex(null);
              setShareModalRowIndex(rowIndex);
              setIsShareOpen(true);
            },
          },
        ];

        if (Number(hasQuestionnaire) === 1) {
          DropdownData.push({
            Title: "Settings",
            Icon: FaCogs,
            onClick: () => navigate("/publish-survey", { state: { studyID } }),
          });
        } else if (Number(launch) === 1) {
          DropdownData.push(
            {
              Title: "Output",
              Icon: FaChartArea,
              onClick: () => navigate("/report", { state: { studyID } }),
            },
            {
              Title: "Crosstab",
              Icon: FaTable,
              onClick: () => navigate("/crosstab", { state: { studyID } }),
            }
          );
        }

        return (
          <div className="relative dropdown-wrapper">
            <FiMoreVertical
              className="text-xl cursor-pointer"
              onClick={() =>
                setOpenDropdownIndex((prev) =>
                  prev === rowIndex ? null : rowIndex
                )
              }
            />
            {isOpen && <DropDown Data={DropdownData} />}
            {modalRowIndex === rowIndex && (
              <ListingCopyModal
              />
            )}
            {shareModalRowIndex === rowIndex && (
              <ShareModal
                isOpen={isShareOpen}
                onClose={() => {
                  setIsShareOpen(false);
                  setShareModalRowIndex(null);
                }}
                onClick={() => {
                  setIsShareOpen(false);
                  setShareModalRowIndex(null);
                }}
                studyName={studyName}
              />
            )}
          </div>
        );
      },
    },
  ];

  return columns;
};

export default useColumns;

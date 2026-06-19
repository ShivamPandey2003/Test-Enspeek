import { LuDownload, LuPlus, LuSearch } from "react-icons/lu";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { setIsAddBannerModalOpen } from "../../../store/CrosstabSlice";
import { useState } from "react";
import Input from "../../ui/Input";
import HistoryModal from "../Report/HistoryModal";
import PageSubheader from "../../ui/PageSubheader";

interface CrosstabHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function CrosstabHeader({
  searchTerm,
  setSearchTerm,
}: CrosstabHeaderProps) {
  const dispatch = useDispatch();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  return (
    <PageSubheader
      left={
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="questionnaire-heading text-[16px] font-semibold leading-none">
            Banner List
          </h1>
        </div>
      }
      right={
        <>
          <Button
            data-test-id="CREATE_BANNER"
            variant="theme"
            size="default"
            onClick={() => dispatch(setIsAddBannerModalOpen(true))}
          >
            <LuPlus />
            Banner
          </Button>
          <div className="crosstab-soft-panel flex h-8 min-w-[220px] items-center rounded-full px-2.5">
            <LuSearch className="crosstab-muted h-4 w-4" />
            <Input
              placeholder="Search banner..."
              className="home-text h-full border-0 bg-transparent px-2 py-0 text-sm focus:outline-none focus-visible:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) =>
                setSearchTerm((e.target as HTMLInputElement).value)
              }
            />
          </div>
          <Button
            variant="secondary"
            size="default"
            className="report-toolbar-btn home-border-soft text-[var(--color-brand-info)] hover:bg-[var(--color-brand-primary-softest)]"
            onClick={() => setIsDownloadModalOpen(true)}
          >
            <LuDownload />
          </Button>
          <HistoryModal
            open={isDownloadModalOpen}
            onOpenChange={setIsDownloadModalOpen}
          />
        </>
      }
    />
  );
}

import { LuCircle, LuPlus } from "react-icons/lu";
import type { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { setBannerPointer } from "../../../store/CrossTabDataSlice";
import Button from "../../ui/Button";

interface TabButtonsProps {
  activeTab: number;
  isBannerPointerListPending: boolean;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

const TabButtons: React.FC<TabButtonsProps> = ({
  activeTab,
  isBannerPointerListPending,
  setActiveTab,
}) => {
  const { BannerPointer } = useSelector(
    (state: RootState) => state.crossTabData
  );
  const dispatch = useDispatch<AppDispatch>();

  const addBannerPoint = () => {
    const last = BannerPointer[BannerPointer.length - 1];
    const nextTitle =
      last?.title.replace(/(\d+)$/, (m) => String(Number(m) + 1)) ||
      "Banner point 1";

    const newPoint: BannerPoint = {
      active: 1,
      statLevel: null,
      bannerGroup: "",
      logic: [],
      pointID: "",
      seq: 1,
      title: nextTitle,
      alpha: "A",
    };
    dispatch(setBannerPointer([...BannerPointer, newPoint]));
    setActiveTab(BannerPointer.length);
  };

  return (
    <div className="crosstab-surface mt-4 flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        {BannerPointer.map((point, index) => (
          <Button
            key={point.title}
            type="button"
            varinat={activeTab === index ? "theme" : "secondary"}
            onClick={() => setActiveTab(index)}
            className={`report-toolbar-btn px-4 ${
              activeTab === index
                ? "bg-[var(--color-brand-primary-softest)] text-login-primary hover:bg-[var(--color-brand-primary-softest)]"
                : "text-[var(--color-text-supporting)] hover:bg-[var(--color-home-panel-soft)]"
            }`}
            disabled={isBannerPointerListPending}
          >
            <LuCircle className="h-3 w-3 fill-current" />
            {point.title}
          </Button>
        ))}
      </div>
      <Button
        type="button"
        varinat="theme"
        onClick={addBannerPoint}
        className="report-toolbar-btn px-4"
        disabled={isBannerPointerListPending}
      >
        <LuPlus className="h-4 w-4" />
        Add point
      </Button>
    </div>
  );
};

export default TabButtons;

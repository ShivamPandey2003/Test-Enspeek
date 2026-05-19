import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { setBannerPointer } from "../../../store/CrossTabDataSlice";
import BannerLogic from "../../global/BannerLogic";
import { LuTrash2 } from "react-icons/lu";
import { Skeleton } from "../../global/skeleton";
import Button from "../../ui/Button";
import IconActionButton from "../../ui/IconActionButton";
import Input from "../../ui/Input";

interface pointDetailsProps {
  activeTab: number;
  isBannerPointerListPending: boolean;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  bannerPointerListData: any[];
}

const PointDetails: React.FC<pointDetailsProps> = ({
  activeTab,
  isBannerPointerListPending,
  setActiveTab,
  bannerPointerListData,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [lastAddedLogic, setLastAddedLogic] = React.useState<
    { pointLogic: string }[]
  >([]);
  const { BannerPointer } = useSelector(
    (state: RootState) => state.crossTabData
  );
  const { groups } = useSelector((state: RootState) => state.crosstab);

  const updateBannerPoint = (
    id: number,
    field: keyof BannerPoint,
    value: string | any
  ) => {
    dispatch(
      setBannerPointer(
        BannerPointer.map((p, index) => {
          if (index !== id) return p;

          if (field === "logic") {
            const currentLogic = p.logic || [];

            if (!Array.isArray(value)) return p;
            if (value.length === 0 && lastAddedLogic.length > 0) {
              const updatedLogic = currentLogic.filter(
                (item) =>
                  !lastAddedLogic.some(
                    (added) => added.pointLogic === item.pointLogic
                  )
              );

              setLastAddedLogic([]);

              return {
                ...p,
                logic: updatedLogic,
              };
            }
            const filtered = currentLogic.filter(
              (item) =>
                !value.some(
                  (added: any) => added.pointLogic === item.pointLogic
                )
            );

            const updatedLogic = [...filtered, ...value];

            setLastAddedLogic(value);

            return {
              ...p,
              logic: updatedLogic,
            };
          }

          return { ...p, [field]: value };
        })
      )
    );
  };

  const deleteBannerPoint = (id: number) => {
    if (BannerPointer.length > 1) {
      const updated = BannerPointer.filter((_, index) => index !== id);
      dispatch(setBannerPointer(updated));
      if (activeTab === id) {
        setActiveTab(updated.indexOf(updated[0]) || 0);
      }
    }
  };

  const handleDeleteLogic = (e: string) => {
    if (!activePoint) return;
    const update = activePoint.logic.filter((prev) => prev.pointLogic !== e);
    dispatch(
      setBannerPointer(
        BannerPointer.map((p, index) =>
          index === activeTab ? { ...p, logic: update } : p
        )
      )
    );
  };

  const activePoint = BannerPointer.find((_, index) => index === activeTab);
  const currentServerPoint =
    Array.isArray(bannerPointerListData) &&
    bannerPointerListData.find((_, index) => index === activeTab)
      ? bannerPointerListData.find((_, index) => index === activeTab)
      : {
          active: 1,
          statLevel: null,
          bannerGroup: "",
          logic: [],
          pointID: "",
          seq: 1,
          title: "",
          alpha: "A",
        };

  return (
    <div>
      {isBannerPointerListPending ? (
        <Skeleton className="w-full h-[30vh] space-y-4" />
      ) : (
        activePoint && (
          <div className="crosstab-surface space-y-5 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-4 md:flex-row md:space-x-8">
                <div>
                  <label className="crosstab-title mb-2 block text-sm font-semibold">
                    Banner Point Name
                  </label>
                  <Input
                    data-test-id="POINTER_NAME"
                    type="text"
                    value={activePoint.title}
                    onChange={(e) =>
                      updateBannerPoint(activeTab!, "title", e.target.value)
                    }
                    className="questionnaire-input questionnaire-heading w-fit rounded-[16px] border questionnaire-border px-4 py-3 focus:outline-none"
                  />
                </div>

                {groups.length > 0 && (
                  <div>
                    <label className="crosstab-title mb-2 block text-sm font-semibold">Group Name</label>
                    <select
                      className="questionnaire-input questionnaire-heading w-48 rounded-[16px] border questionnaire-border px-4 py-3 focus:outline-none"
                      value={activePoint.bannerGroup}
                      onChange={(e) =>
                        updateBannerPoint(
                          activeTab!,
                          "bannerGroup",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select group</option>
                      {groups.map((group, index) => (
                        <option key={index} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {BannerPointer.length > 1 && (
                <Button
                  type="button"
                  varinat="danger"
                  onClick={() => deleteBannerPoint(activeTab!)}
                  className="report-toolbar-btn px-4"
                >
                  <LuTrash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>

            <div>
              <label className="crosstab-title mb-3 block text-sm font-semibold">
                Banner Point Logic
              </label>
              {currentServerPoint?.logic?.length > 0 &&
                currentServerPoint.logic.map((item: any, index: number) => {
                  const isInBannerPointer = BannerPointer.some((point) =>
                    point.logic?.some(
                      (logic: any) => logic.pointLogic === item.pointLogic
                    )
                  );

                  if (!isInBannerPointer) return null;

                  return (
                    <div
                      key={index}
                      className="my-3 flex items-center gap-4 rounded-[16px] bg-white px-4 py-3 text-[var(--color-questionnaire-stop)] shadow-sm"
                    >
                      <span>
                        <span className="crosstab-title">{index + 1}.</span>{" "}
                        {item.pointLogic}
                      </span>
                      <IconActionButton
                        tone="danger"
                        onClick={() => handleDeleteLogic(item.pointLogic)}
                      >
                        <LuTrash2 className="h-4 w-4" />
                      </IconActionButton>
                    </div>
                  );
                })}

              <BannerLogic
                activeTab={activeTab!}
                storeComponent={String(activeTab)}
                key={activeTab}
                setLogicFunc={(logic) =>
                  updateBannerPoint(activeTab!, "logic", [...logic])
                }
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PointDetails;

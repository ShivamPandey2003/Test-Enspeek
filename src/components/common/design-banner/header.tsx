import { useLocation } from "react-router";
import type { RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../ui/Button";
import { toast } from "sonner";
import { resetLogicData } from "../../../store/CrossTabDataSlice";
import { LuSendHorizontal } from "react-icons/lu";
import { useAddBannerPointer } from "../../../api-network/crosstab/designbanner/mutation";
import PageBreadcrumbs from "../../ui/PageBreadcrumbs";
import PageSubheader from "../../ui/PageSubheader";

const DesignBanner_Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { bannerName, validateLogic } = useSelector(
    (state: RootState) => state.crosstab
  );
  const { BannerPointer } = useSelector(
    (state: RootState) => state.crossTabData
  );
  const { addBannerPointerMutate, isAddBannerPointerPending } =
    useAddBannerPointer(location.state.studyID);

  const allseg = BannerPointer.map((pointer) => ({
    pointID: pointer.pointID,
    segTitle: pointer.title,
    groupName: "",
    logic: pointer.logic,
  }));

  const onSubmitHandle = () => {
    const hasInvalid = Object.values(validateLogic).some((logicList: any[]) =>
      logicList.some(
        (val: any) =>
          val.variable.trim() === "" ||
          val.option.trim() === "" ||
          val.value.trim() === ""
      )
    );

    if (hasInvalid) {
      toast.error(
        "Please define valid logic for at least one banner point before submitting."
      );
      return;
    }
    const isLogicApplied = BannerPointer.every(
      (item) => item.title.trim() !== "" && item.logic.length > 0
    );

    if (!isLogicApplied) {
      toast.error(
        "Please define valid logic for at least one banner point before submitting."
      );
      return;
    }
    dispatch(resetLogicData());
    addBannerPointerMutate({
      bannerID: location?.state?.bannerID as string,
      allSegment: allseg,
    });
  };

  return (
    <PageSubheader
      left={
        <PageBreadcrumbs
          prefix={`${bannerName} :`}
          items={[
            {
              label: "Banner List",
              to: "/crosstab",
              state: { studyID: location.state.studyID },
            },
            {
              label: "Design Banner",
              to: "/crosstab/edit-banner",
              state: {
                studyID: location.state.studyID,
                bannerID: location.state?.bannerID,
              },
              active: location.pathname === "/crosstab/edit-banner",
            },
          ]}
        />
      }
      right={
        <Button
          data-test-id="SUBMIT"
          varinat="theme"
          className="report-toolbar-btn px-5"
          onClick={onSubmitHandle}
          disabled={isAddBannerPointerPending}
        >
          {isAddBannerPointerPending ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
              <span>
                Submitting
                <span className="copying-dots ml-0.5 inline-flex w-[1.5em] justify-start">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </span>
            </>
          ) : (
            <>
              <LuSendHorizontal className="h-4 w-4" />
              Submit
            </>
          )}
        </Button>
      }
      rightClassName="justify-end"
    />
  );
};

export default DesignBanner_Header;

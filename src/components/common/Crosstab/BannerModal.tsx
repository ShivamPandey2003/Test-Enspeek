import React, { useState } from "react";
import DynamicModel from "../../global/DynamicModel";
import { useDispatch, useSelector } from "react-redux";
import { setBannerName } from "../../../store/CrosstabSlice";
import BannerLogic from "../../global/BannerLogic";
import type { RootState } from "../../../store/store";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Checkbox from "../../ui/Checkbox";
import { LuCirclePlus, LuPanelsTopLeft } from "react-icons/lu";
import { modalDefinitions } from "../../../config/modalDefinitions";

const AddBannerModal: React.FC<AddBannerModalProps> = ({
  isOpen,
  onClose,
  onBannerDesignClick,
  isPending,
}) => {
  const definition = modalDefinitions.addBanner;
  const {name} = useSelector((state:RootState)=>state.study)
  const [bannerName, setBannerNameInput] = useState<string>("");
  const [bannerDescription, setBannerDescription] = useState<string>("");
  const [counts, setCounts] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<{
    bannerName?: string;
    bannerDescription?: string;
  }>({});

  const handleClose = ()=>{
    if (isPending || isCreating) return;
    setBannerNameInput("")
    setBannerDescription("")
    setCounts(false);
    setPercentage(true);
    setErrors({});
    setIsCreating(false);
    onClose()
  }

  const dispatch = useDispatch();

  const logic = useSelector((state: RootState) => state.crosstab.logic);

  const HandleClick = () => {
    const newErrors: { bannerName?: string; bannerDescription?: string } = {};

    if (!bannerName.trim()) {
      newErrors.bannerName = "Banner name is required";
    }
    if (!bannerDescription.trim()) {
      newErrors.bannerDescription = "Banner description is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsCreating(true);
      dispatch(setBannerName(bannerName));
      onBannerDesignClick({
        title: bannerName,
        description: bannerDescription,
        logic:logic["NewBanner"], 
        count: counts ? 1 : 0,
        percent: percentage ? 1 : 0,
      });
      setBannerName("");
      setBannerDescription("");
      setCounts(false);
      setPercentage(true);
    }
  };

  React.useEffect(() => {
    if (!isOpen) {
      setIsCreating(false);
      return;
    }

    if (!isPending) {
      setIsCreating(false);
    }
  }, [isPending, isOpen]);

  if (!isOpen) return null;

  return (
    <DynamicModel
      Title={`${definition.title}: ${name}`}
      headerIcon={
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-login-primary">
          <LuPanelsTopLeft className="h-5 w-5" />
        </span>
      }
      description="Add the banner details and optional overall filter, then continue to banner design."
      descriptionClassName="theme-text-default"
      ButtonText={
        isPending || isCreating
          ? definition.submittingLabel!
          : definition.submitLabel!
      }
      buttonIcon={
        isPending || isCreating ? (
          <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
        ) : (
          <LuCirclePlus className="h-4 w-4" />
        )
      }
      isOpen={isOpen}
      onClose={handleClose}
      onClick={HandleClick}
      disable={isPending || isCreating}
      secondaryAction={
        <Button
          type="button"
          varinat="cancel"
          onClick={handleClose}
          disabled={isPending || isCreating}
        >
          {definition.cancelLabel}
        </Button>
      }
      className="max-w-5xl"
      >
      <div className="space-y-4">
        <div>
          <label className="questionnaire-label text-base font-medium text-login-primary">
            Banner Name <span className="text-[var(--color-core-danger)]">*</span>
          </label>
          <Input
            variant="crosstab"
            className="mt-2"
            data-test-id="BANNER_NAME"
            placeholder="Enter Banner Title"
            value={bannerName}
            onChange={(e) => setBannerNameInput(e.target.value)}
          />
          {errors.bannerName && (
            <p className="mt-1 text-sm text-[var(--color-questionnaire-stop)]">{errors.bannerName}</p>
          )}
        </div>
        <div>
          <label className="questionnaire-label text-base font-medium text-login-primary">
            Banner Description <span className="text-[var(--color-core-danger)]">*</span>
          </label>
          <Input
            variant="crosstab"
            className="mt-2"
            data-test-id="BANNER_DESCRIPTION"
            placeholder="Enter banner description ..."
            value={bannerDescription}
            onChange={(e) => setBannerDescription(e.target.value)}
          />
          {errors.bannerDescription && (
            <p className="mt-1 text-sm text-[var(--color-questionnaire-stop)]">
              {errors.bannerDescription}
            </p>
          )}
        </div>
        <div>
          <p className="questionnaire-label mb-2 text-base font-medium text-login-primary">
            Select View Type
          </p>
          <div className="flex space-x-8">
            <label className="home-text flex items-center space-x-2">
              <Checkbox
                checked={percentage}
                onChange={(e) => setPercentage(e.target.checked)}
              />
              <span>Percentage</span>
            </label>
          </div>
        </div>

        <div>
          <p className="questionnaire-label mb-3 text-base font-medium text-login-primary">
            Overall Banner Filter <span className="crosstab-muted">(optional)</span>
          </p>
          <div className="flex items-center space-x-8">
            <BannerLogic storeComponent="NewBanner"/>
          </div>
        </div>
      </div>
    </DynamicModel>
  );
};

export default AddBannerModal;

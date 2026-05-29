import { useDispatch, useSelector } from "react-redux";
import { setIsOpenGroup, setGroupInput, addGroup } from "../../../store/CrosstabSlice";
import type { RootState } from "../../../store/store";
import DynamicModel from "../../global/DynamicModel";
import Input from "../../ui/Input";
import ModalInstruction from "../../ui/ModalInstruction";
import { modalDefinitions } from "../../../config/modalDefinitions";

export default function AddGroupModal() {
  const definition = modalDefinitions.addGroup;
  const dispatch = useDispatch();
  const { isOpenGroup, groupInput } = useSelector((state: RootState) => state.crosstab);

  const handleSetGroup = () => {
    dispatch(addGroup(groupInput));
    dispatch(setGroupInput(""));
    dispatch(setIsOpenGroup(false));
  };

  return (
    <DynamicModel
      Title={definition.title}
      ButtonText={definition.submitLabel!}
      isOpen={isOpenGroup}
      onClose={() => dispatch(setIsOpenGroup(false))}
      onClick={handleSetGroup}
      className="max-w-lg"
    >
      <ModalInstruction>
        Create a group name to organize related banner points more clearly.
      </ModalInstruction>
      <Input
        className="questionnaire-input questionnaire-heading border questionnaire-border"
        placeholder="Enter group name"
        value={groupInput}
        onChange={(e) => dispatch(setGroupInput(e.target.value))}
      />
    </DynamicModel>
  );
}

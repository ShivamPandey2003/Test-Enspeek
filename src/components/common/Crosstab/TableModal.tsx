import React from "react";
import DynamicModel from "../../global/DynamicModel";
import TableList from "../table-List/TableList";
import ModalInstruction from "../../ui/ModalInstruction";
import { modalDefinitions } from "../../../config/modalDefinitions";

const TableModal: React.FC<CrosstabTableModalProps> = ({ isOpen, onClose, message }) => {
  const definition = modalDefinitions.crosstabTable;
  if (!message?.sdata?.tableID) return null;

  return (
    <DynamicModel
      isOpen={isOpen}
      onClose={onClose}
      Title={definition.title}
      ButtonText={definition.submitLabel!}
      onClick={onClose}
      className="max-w-5xl"
    >
      <ModalInstruction>
        Review the full crosstab table view for the selected message result.
      </ModalInstruction>
      <TableList
        Id={"CROSSTAB"}
        qID={message.sdata.tableID}
        Title={"Crosstab Table"}
        Description={"This is a crosstab analysis of responses"}
        tableIDList={[message.sdata.tableID]}
        tableID={message.sdata.tableID}
        sdata={message.sdata}
      />
    </DynamicModel>
  );
};

export default TableModal;

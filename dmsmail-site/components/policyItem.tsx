import React from "react";
import Policy from "./policy";

interface PolicyItemInterface extends Policy {
  onDelete: (id?: number) => void;
  onUpdate: (policy: Policy) => void;
}

const PolicyItem: React.FC<PolicyItemInterface> = (props) => {
  const [isActive, setIsActive] = React.useState(props.is_active);

  const handlePolicyUpdate = async () => {
    const newIsActiveValue = !isActive;
    setIsActive(!isActive);
    const updatedPolicy = {
      id: props.id,
      sender_id: props.sender_id,
      recipients: props.recipients,
      subject: props.subject,
      body: props.body,
      expiration_date: props.expiration_date,
      is_active: newIsActiveValue,
    };
    props.onUpdate(updatedPolicy);
  };

  const policyStyle: string = isActive ? "text-gray-400 line-through" : "";

  // Create a polioy item with a check box.
  const policyItem = (
    <div className="border border-gray-300 rounded-md p-3 mb-2 flex">
      <input type="checkbox" checked={isActive} onChange={handlePolicyUpdate} />
      <div className={"ml-4 " + policyStyle}>{props.subject}</div>
      <div className="grow" />
      <button
        className="text-red-500 ml-4"
        onClick={() => {
          props.onDelete(props.id);
        }}
      >
        delete
      </button>
    </div>
  );
  return policyItem;
};
export default PolicyItem;
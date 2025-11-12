import Select, { ActionMeta, SingleValue } from "react-select";

interface CQSelectProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  placeholder?: string;
  options: SelectOption[];
  defaultValue?: SelectOption;
  onChange: (
    newValue: SingleValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => void;
}

const CQSelect: React.FC<CQSelectProps> = ({
  isDisabled = false,
  isLoading = false,
  isClearable = true,
  isSearchable = true,
  placeholder = "",
  defaultValue,
  options,
  onChange,
  ...props
}) => {
  return (
    <Select
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isSearchable={isSearchable}
      defaultValue={defaultValue}
      options={options}
      onChange={onChange}
    />
  );
};

export default CQSelect;

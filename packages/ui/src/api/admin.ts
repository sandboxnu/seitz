import axiosInstance from "@/util/axios";

interface IGenericOption<T> {
  name: string;
  default: T;
}

interface INumberOption extends IGenericOption<number> {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

interface ITextOption extends IGenericOption<string> {
  type: "text";
  maxLength?: number;
}

interface IDropdownOption extends IGenericOption<number> {
  type: "dropdown";
  options: string[];
}

interface ICheckboxOption extends IGenericOption<boolean> {
  type: "checkbox";
}

type IOption = INumberOption | ITextOption | IDropdownOption | ICheckboxOption;

interface GetStageResponse {
  _id: string;
  type: string;
  stageLabel: string;
  options: IOption[];
}

async function getStages() {
  const result = await axiosInstance.get<GetStageResponse[]>("admin/stages");
  return result.data;
}

export default { getStages };

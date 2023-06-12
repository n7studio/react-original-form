import { FieldValues } from "react-hook-form";

export type FormRef = {
  submit: () => void;
  reset: (resetData?: FieldValues) => void;
};

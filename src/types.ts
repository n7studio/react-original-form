import { FieldValues } from "react-hook-form";

export type FormRef = {
  submit: () => void;
  reset: (resetData?: FieldValues, options?: Record<string, boolean>) => void;
  resetField: (name: string, options?: Record<string, boolean | any>) => void;
  setValue: (name: string, value: any, config?: object) => void;
};

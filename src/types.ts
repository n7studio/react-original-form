import {
    FieldValues,
  } from "react-hook-form";
  
export type FormElement = {
    submit: () => void;
    reset: (resetData?: FieldValues) => void;
};
import { FieldErrors } from "react-hook-form";

const isErrorObject = (obj: object) => {
  return Object.keys(obj).includes("message");
};

export function hasNestedErrors(errors: object) {
  const fields = Object.values(errors);
  return fields.length && fields.every((field) => !isErrorObject(field));
}

export function flattenFormErrors(errors: FieldErrors) {
  const parentKeys = Object.keys(errors);
  const parentErrorName = parentKeys[0];
  const childErrors = errors[parentErrorName] as Record<string, object>;

  const flattenErrors: Record<string, object> = {};

  childErrors &&
    Object.keys(childErrors).forEach((key) => {
      flattenErrors[`${parentErrorName}[${key}]`] = childErrors[key];
    });

  return flattenErrors;
}

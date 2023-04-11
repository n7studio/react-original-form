import type { ReactElement, ReactNode } from "react";
import React from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormHandleSubmit,
} from "react-hook-form";
import { flattenFormErrors, hasNestedErrors } from "./flattenFormErrors";

function isInputElement(reactNode: ReactNode): reactNode is ReactElement {
  const props = (reactNode as ReactElement)?.props;
  return props?.name !== undefined;
}

function isSubmitButton(reactNode: ReactNode): reactNode is ReactElement {
  const props = (reactNode as ReactElement)?.props;
  return props?.submit === true;
}

interface RenderFormChildParams<T> {
  child: ReactNode;
  control: Control<FieldValues, any>;
  onSubmit?: (values: T) => void;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  errors: FieldErrors;
  parent?: ReactNode;
}

function renderFormChild<T>({
  child,
  control,
  onSubmit,
  handleSubmit,
  errors,
  parent,
}: RenderFormChildParams<T>): ReactNode | ReactNode[] {
  const nestedChildren =
    React.isValidElement(child) &&
    React.Children.toArray(child?.props.children);

  if (nestedChildren && nestedChildren.length) {
    const parent = child;

    const { ...parentProps } = parent?.props as {
      children?: ReactNode;
    };

    return React.createElement(
      parent.type,
      parentProps,
      React.Children.map(nestedChildren, (child: ReactNode) => {
        return renderFormChild({
          child,
          control,
          onSubmit,
          handleSubmit,
          errors,
          parent,
        });
      }),
    );
  }

  if (isInputElement(child)) {
    const { name, ...rest } = child.props;

    errors = hasNestedErrors(errors) ? flattenFormErrors(errors) : errors;

    return (
      <Controller
        key={name}
        control={control}
        name={name}
        render={({ field }) =>
          React.createElement(child.type, {
            ...rest,
            ...field,
            onChange: (e: CustomEvent) => {
              rest?.onChange?.(e);
              field.onChange(e);
            },
            error: errors[name],
            ref: undefined,
          })
        }
      />
    );
  }

  if (isSubmitButton(child)) {
    return React.createElement(child.type, {
      ...child.props,
      onPress: handleSubmit((values) => onSubmit?.(values as T)),
      ref: undefined,
    });
  }

  if (typeof child === "string" && React.isValidElement(parent)) {
    return React.createElement(parent.type, {
      ...parent.props,
      ref: undefined,
    });
  }

  return child;
}
export default renderFormChild;

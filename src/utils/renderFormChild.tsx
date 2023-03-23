import React, { ReactElement, ReactNode } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";

interface RenderChildParams<T extends FieldValues> {
  child: ReactNode | ReactElement | undefined;
  control: Control<T>;
}

function isInputElement(reactNode: ReactNode): reactNode is ReactElement {
  const element = reactNode as ReactElement;
  return (
    element &&
    element.props &&
    element.props.name !== undefined &&
    element.props.type !== "submit"
  );
}

function isReactElementWithChildren(
  reactNode: ReactNode,
): reactNode is ReactElement {
  const element = reactNode as ReactElement;
  return (
    element &&
    element.props !== undefined &&
    element.props.name === undefined &&
    React.Children.toArray(element.props.children).length >= 1
  );
}

function renderFormChild<T extends FieldValues>({
  child,
  control,
}: RenderChildParams<T>): React.ReactNode {
  if (isReactElementWithChildren(child)) {
    const nestedChildren = React.Children.toArray(child.props.children);
    const children = React.Children.map(nestedChildren, (child: ReactNode) => {
      return renderFormChild({ child, control });
    });

    return React.createElement(
      child.type,
      {
        ...child.props,
      },
      children,
    );
  } else if (isInputElement(child)) {
    const { name, ...rest } = child.props;
    return (
      <Controller
        key={name}
        control={control}
        name={name}
        defaultValue={rest?.value}
        render={({ field }) => {
          return React.createElement(child.type, {
            ...rest,
            ...field,
            onChange: (e: CustomEvent) => {
              rest?.onChange?.(e);
              field.onChange(e);
            },
            ref: undefined,
          });
        }}
      />
    );
  }

  return child;
}

export default renderFormChild;

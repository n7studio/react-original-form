import React, { ReactElement, ReactNode } from "react";
import { renderFormChild } from "../../utils";
import { useFormContext } from "react-hook-form";

interface FormPartialProps {
  children: ReactElement | ReactElement[] | ReactNode | ReactNode[];
}

function FormPartial({ children }: FormPartialProps): JSX.Element {
  const { control } = useFormContext();

  return (
    <>
      {React.Children.map(children, (child: ReactNode) => {
        return renderFormChild({ child, control });
      })}
    </>
  );
}

export default FormPartial;

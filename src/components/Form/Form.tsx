import React, {
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
  useImperativeHandle,
  useRef,
} from "react";
import { renderFormChild } from "../../utils";
import {
  DeepPartial,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";

type FormProps<T extends FieldValues> = {
  children: ReactElement | ReactElement[] | ReactNode | ReactNode[];
  onSubmit: (data: T) => void;
  defaultValues?: DeepPartial<T>;
};

type FormRef = {
  submit: () => void;
};

function FormInner<T extends FieldValues>(
  { children, onSubmit, defaultValues }: FormProps<T>,
  ref?: Ref<FormRef>,
) {
  const { handleSubmit, control, ...rest } = useForm({
    defaultValues,
  });

  const formRef = useRef<HTMLFormElement>(null);

  useImperativeHandle(ref, () => ({
    submit: () => {
      formRef?.current?.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    },
  }));

  return (
    <FormProvider
      {...{
        handleSubmit,
        control,
        ...rest,
      }}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit((data) => onSubmit(data as T))}
      >
        {React.Children.map(children, (child: ReactNode) => {
          return renderFormChild<T>({ child, control });
        })}
      </form>
    </FormProvider>
  );
}

const Form = forwardRef(FormInner) as <T extends FieldValues>(
  props: FormProps<T> & { ref?: Ref<FormRef> },
) => ReturnType<typeof FormInner>;

export default Form;

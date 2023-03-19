import React, {
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
  useImperativeHandle,
  useRef,
} from "react";
import renderFormChild from "../../utils";
import { DeepPartial, FormProvider, useForm } from "react-hook-form";

interface FormProps<T> {
  children: ReactElement | ReactElement[] | ReactNode | ReactNode[];
  onSubmit: (data: T) => void;
  defaultValues?: DeepPartial<T>;
}

function FormInner<T>(
  { children, onSubmit, defaultValues }: FormProps<T>,
  ref?: Ref<ReactNode>,
): JSX.Element {
  const { handleSubmit, control, ...rest } = useForm({
    defaultValues,
  });

  const formRef = useRef<HTMLFormElement>(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        submit: () => {
          formRef?.current?.dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true }),
          );
        },
      };
    },
    [],
  );

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

const Form = forwardRef(FormInner) as <T>(
  props: FormProps<T> & { ref?: Ref<ReactNode> },
) => ReturnType<typeof FormInner>;

export default Form;

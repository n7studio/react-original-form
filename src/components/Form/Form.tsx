import React, {
  forwardRef,
  ReactNode,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { renderFormChild } from "../../utils";
import {
  FieldErrors,
  FieldValues,
  FormProvider,
  Resolver,
  useForm,
} from "react-hook-form";
import { useOnWatchForm } from "../../hooks";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type FormProps<T extends FieldValues> = {
  children: ReactNode | ReactNode[];
  onSubmit?: (values: T) => void;
  defaultValues?: T;
  resolver?: Resolver<FieldValues, any> | undefined;
  validationSchema?: yup.AnyObjectSchema;
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
  onWatch?: (values: T) => void;
  watch?: {
    fields?: string[];
    onChange: (value: Array<any> | T) => void;
  };
  onInvalid?: (errors: FieldErrors<FieldValues>) => void;
};

type FormRef = {
  submit: () => void;
  reset: (resetData: FieldValues) => void;
};

function FormInner<T extends FieldValues>(
  {
    children,
    onSubmit,
    defaultValues,
    resolver,
    mode,
    watch,
    validationSchema,
    onInvalid,
  }: FormProps<T>,
  ref?: Ref<FormRef>,
) {
  const {
    control,
    handleSubmit,
    formState,
    watch: baseWatch,
    reset,
    ...rest
  } = useForm({
    mode: mode,
    defaultValues: defaultValues as FieldValues,
    resolver: resolver ?? (validationSchema && yupResolver(validationSchema)),
  });

  useOnWatchForm(
    baseWatch,
    (values) => {
      watch?.onChange(values as Array<any> | T);
    },
    watch?.fields,
  );

  const formRef = useRef<HTMLFormElement>(null);

  useImperativeHandle(ref, () => ({
    submit: () => {
      formRef?.current?.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    },
    reset: (resetData: FieldValues) => reset(resetData),
  }));

  useEffect(() => {
    if (!Object.keys(formState.errors).length) return;

    onInvalid?.(formState.errors);
  }, [JSON.stringify(formState.errors)]);

  return (
    <FormProvider
      {...{
        handleSubmit,
        control,
        watch: baseWatch,
        formState,
        reset,
        ...rest,
      }}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit((values) => onSubmit?.(values as T))}
      >
        {React.Children.map(children, (child: ReactNode) => {
          return renderFormChild({
            child,
            control,
            onSubmit,
            handleSubmit,
            errors: formState.errors,
          });
        })}
      </form>
    </FormProvider>
  );
}

const Form = forwardRef(FormInner) as <T extends FieldValues>(
  props: FormProps<T> & { ref?: Ref<FormRef> },
) => ReturnType<typeof FormInner>;

export default Form;

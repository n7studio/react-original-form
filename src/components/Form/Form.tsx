import React, {
  forwardRef,
  ReactNode,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { isBrowser, renderFormChild } from "../../utils";
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
import { FormRef } from "../../types";

interface htmlFormProps extends React.HTMLProps<HTMLFormElement> {
  action?: string | undefined;
  method?: string | undefined;
  id?: string | undefined;
}

type FormProps<T extends FieldValues> = {
  children: ReactNode | ReactNode[];
  onSubmit?: (values: T, e?: React.BaseSyntheticEvent) => void;
  defaultValues?: T;
  resolver?: Resolver<FieldValues, any> | undefined;
  validationSchema?: yup.AnyObjectSchema;
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
  onWatch?: (values: T) => void;
  watch?: {
    fields?: string[];
    onChange: (value: Array<any> | T) => void;
  };
  onErrorsUpdate?: (errors: FieldErrors<FieldValues>) => void;
  onDirtyFields?: (dirtyFields: object) => void;
  onValidate?: (isValid: boolean) => void;
  htmlFormProps?: htmlFormProps;
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
    htmlFormProps,
    onErrorsUpdate,
    onDirtyFields,
    onValidate,
  }: FormProps<T>,
  ref?: Ref<FormRef>,
) {
  const {
    control,
    handleSubmit,
    formState,
    getValues,
    watch: baseWatch,
    reset,
    setValue,
    resetField,
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

  const handleOnSubmit = (event?: any) => {
    event?.preventDefault();
    handleSubmit((values, e) => onSubmit?.(values as T, e))();
  };

  const handleRenderFormChild = () => {
    return React.Children.map(children, (child: ReactNode) =>
      renderFormChild({
        child,
        control,
        onSubmit,
        handleSubmit,
        errors: formState.errors,
      }),
    );
  };

  useImperativeHandle(ref, () => ({
    submit: () =>
      isBrowser()
        ? formRef?.current?.dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true }),
          )
        : handleOnSubmit(),
    reset: (resetData?: FieldValues, options?: Record<string, boolean>) =>
      reset(resetData, options),
    resetField: (name: string, options?: Record<string, boolean | any>) =>
      resetField(name, options),
    setValue: (name: string, value: any, config?: object) =>
      setValue(name, value, config),
  }));

  useEffect(() => {
    onErrorsUpdate?.(formState.errors);
  }, [JSON.stringify(formState.errors)]);

  useEffect(() => {
    onDirtyFields?.(formState.dirtyFields);
  }, [JSON.stringify(formState.dirtyFields)]);

  useEffect(() => {
    onValidate?.(formState.isValid);
  }, [formState.isValid]);

  return (
    <FormProvider
      {...{
        handleSubmit,
        control,
        watch: baseWatch,
        formState,
        getValues,
        setValue,
        resetField,
        reset,
        ...rest,
      }}
    >
      {isBrowser() ? (
        <form ref={formRef} onSubmit={handleOnSubmit} {...htmlFormProps}>
          {handleRenderFormChild()}
        </form>
      ) : (
        handleRenderFormChild()
      )}
    </FormProvider>
  );
}

const Form = forwardRef(FormInner) as <T extends FieldValues>(
  props: FormProps<T> & { ref?: Ref<FormRef> },
) => ReturnType<typeof FormInner>;

export default Form;

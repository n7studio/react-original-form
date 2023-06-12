# react-original-form

React Form Original is a wrapper around [React Hook Form](https://react-hook-form.com/) aimed for facilitate and automate the most common use cases with forms.

## 1. Installation

NPM:

```
npm install @n7studio/react-original-form
```

Yarn:

```
yarn add @n7studio/react-original-form
```

## 2 Basic usage

The most basic usage would look something like this:

```tsx
import { Form } from "@n7studio/react-original-form";

function App() {
  function handleSubmit(values: any) {
    // callback for `onSubmit` will be called with the latest input values.
    // `values` is of the same format as `defaulValues`
    console.log(values);
  }

  return (
    <Form
      onSubmit={handleSubmit}
      defaultValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      }}
    >
      <input type="text" name="firstName" />

      <input type="text" name="lastName" />

      <input type="email" name="email" />

      <input type="password" name="password" />

      <input type="submit" value="submit" />
    </Form>
  );
}
```

What is happenning under the hood is `<Form>` is scanning through all of its children to detect elements that are form inputs, and assign them their respective values from `defaultValues` prop. The `onSubmit` callback will be called with the values of the inputs, which are already listened to. No need to add your own event listeners.

## 3 Working with custom inputs

### 3.1 Working with a components library

Chances are, you are not working with basic `<input />` elements, but rather some components comming from a library such as [Material UI](https://mui.com/), or maybe even your own custom-made ones. As long as that component can accept `name`, `value` and `onChange` props, it will work with `<Form />`.

```tsx
import TextField as MuiTextField from '@mui/material/TextField';
import { Form } from "@n7studio/react-original-form";

function App() {
  return (
    <Form
      onSubmit={(values) => {}}
      defaultValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      }}
    >
      <input name="fishName" placeholder="Fish name" />
      <MuiTextField type="text" name="firstName" />
      <MuiTextField type="text" name="lastName" />
      <MuiTextField type="email" name="email" />
      <MuiTextField type="password" name="password" />
      <input type="submit" value="submit" />
    </Form>
  );
}
```

### 3.2 Custom-build components

As mentionned above, as long as a custom component can accept `name`, `value` and `onChange` props, `<Form />` will handle it as an input component and will listen to it automatically. This means that you can define your own custom-made input components.

```tsx
import { Form } from "@n7studio/react-original-form";

function CustomTextInput({ name, value, onChange }) {
  return <input type="text" name={name} value={value} onChange={onChange} />;
}

function App() {
  return (
    <Form
      onSubmit={(values) => {}}
      defaultValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      }}
    >
      <CustomTextInput type="text" name="firstName" />

      <CustomTextInput type="text" name="lastName" />

      <CustomTextInput type="email" name="email" />

      <CustomTextInput type="password" name="password" />

      <input type="submit" value="submit" />
    </Form>
  );
}
```

## 4 Validation

### 4.1 Validation Schema

React Form Original has built-in validation directly based on [Yup](https://github.com/jquense/yup). For it to work you need to do 2 things. In a first time, define a validation schema in the same way as you would with Yup.

```tsx
import * as yup from "yup";

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("Field is required.")
    .min(2, "Must have at least 2 characters."),
  lastName: yup
    .string()
    .required("Field is required.")
    .min(2, "Must have at least 2 characters."),
  email: yup
    .string()
    .required("Field is required.")
    .email("Must be a valid email."),
  password: yup
    .string()
    .required("Field is required")
    .min(8, "Must have at least 8 characters"),
});
```

In a second time, add an `error` props to your component, so `<Form />` will pass it for you anytime a validation fails.

```tsx
function CustomTextInput({ name, value, onChange, error }) {
  return (
    <>
      <div>
        <input type="text" name={name} value={value} onChange={onChange} />
      </div>

      {error && <span class="error">{error.message}</span>}
    </>
  );
}
```

Finally, pass your yup validation schema as a `validationSchema` prop in the `<Form />` component.

```tsx
import { Form } from "@n7studio/react-original-form";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("Field is required.")
    .min(2, "Must have at least 2 characters."),
  lastName: yup
    .string()
    .required("Field is required.")
    .min(2, "Must have at least 2 characters."),
  email: yup
    .string()
    .required("Field is required.")
    .email("Must be a valid email."),
  password: yup
    .string()
    .required("Field is required")
    .min(8, "Must have at least 8 characters"),

function CustomTextInput({ name, value, onChange, error }) {
  return (
    <>
      <div>
        <input type="text" name={name} value={value} onChange={onChange} />
      </div>

      {error && <span class="error">{error.message}</span>}
    </>
  );
}

function App() {
  return (
    <Form
      onSubmit={(values) => {}}
      defaultValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      }}
      validationSchema={validationSchema}
    >
      <CustomTextInput type="text" name="firstName" />

      <CustomTextInput type="text" name="lastName" />

      <CustomTextInput type="email" name="email" />

      <CustomTextInput type="password" name="password" />

      <input type="submit" value="submit" />
    </Form>
  );
}
```

### 4.2 Validation mode

You can configure a validation mode (strategy) by passing a `mode` props to `<Form />` that will dictate when a validation should happen. The available values are `"onChange" | "onBlur" | "onSubmit" | "onTouched"`. More details on validation modes can be found (here)[https://react-hook-form.com/api/useform/#props].

In this example below, the validation will only be triggered when a submit is attempted.

```tsx
function App() {
  return (
    <Form
      mode="onSubmit"
      validationSchema={validationSchema}
      onSubmit={(values) => {}}
    >
      <CustomTextInput name="firstName" />

      <input type="submit" value="submit" />
    </Form>
  );
}
```

### 4.2 On Invalid callback

There may be situations where you need to listen to the event of a falied validation; for instance if you want to add an Alert or a Toast. In those cases you can add a `onInvalid` props to `<Form />` with a callback. In the example below, an alert will show at any submit attempt that failed the validations.

```tsx
function App() {
  return (
    <Form
      mode="onSubmit"
      validationSchema={validationSchema}
      onSubmit={(values) => {}}
      onInvalid={(errors) => {
        alert("Some fields in the form are invalid.");
      }}
    >
      <CustomTextInput name="firstName" />

      <input type="submit" value="submit" />
    </Form>
  );
}
```

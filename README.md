# react-original-form

The form based on react hook form

### Install

    yarn add @n7studio/react-original-form react-hook-form yup @hookform/resolvers

### Quickstart

```jsx
import { Form } from "@n7studio/react-original-form";

function App() {
  return (
    <Form onSubmit={(values) => console.log(JSON.stringify(value, null, 2))}>
      <input name="fishName" placeholder="Fish name" />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

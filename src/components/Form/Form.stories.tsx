import type { ComponentMeta, ComponentStory } from "@storybook/react";
import Form from "./Form";
import TextInput from "../TextInput";
import Button from "../Button";
import { useState } from "react";

const argTypes = {
  defaultValues: {
    description: "Provide default values for the form",
  },
  onSubmit: {
    description: "A function which submits the form",
  },
};

const FormMeta: ComponentMeta<typeof Form> = {
  title: "Components/Forms/Form",
  component: Form,
  argTypes: argTypes,
};
export default FormMeta;

type FormStory = ComponentStory<typeof Form>;

export const SimpleForm: FormStory = () => {
  const [formValues, setFormValues] = useState<unknown>();

  return (
    <div>
      <Form onSubmit={(values) => setFormValues(values)}>
        <TextInput name="fishName" placeholder="Fish name" />
        <Button type="submit" label="Sign in" />
      </Form>
      <div>
        <p>
          <pre>
            {!formValues
              ? "Submit form to see values"
              : JSON.stringify(formValues, null, 2)}
          </pre>
        </p>
      </div>
    </div>
  );
};

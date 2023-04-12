import * as React from "react";
import "jest-canvas-mock";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { Form } from "../../../src/components/Form";

interface ILoginFormValues {
  username: string;
  password: string;
}

describe("Form", () => {
  it("should render correctly", () => {
    const tree = render(
      <Form>
        <div></div>
      </Form>,
    );
    expect(tree).toBeTruthy();
  });

  it("should render input field", () => {
    const { queryByTestId } = render(
      <Form>
        <input data-testid="username" />
      </Form>,
    );
    const input = queryByTestId("username");
    expect(input).toBeTruthy();
  });

  it("should return form values when form is submitted", async () => {
    const onChangeMock = jest.fn();
    const onPressMock = jest.fn();
    const onSubmitMock = jest.fn();
    const user = {
      username: "n7studio",
      password: "react_original_form",
    };
    const { getByPlaceholderText, getByRole } = render(
      <Form
        defaultValues={{
          username: "username",
          password: "password",
        }}
        onSubmit={(values: ILoginFormValues) => {
          onSubmitMock.mockReturnValue(values);
        }}
      >
        <input placeholder="username" name="username" onChange={onChangeMock} />
        <input placeholder="password" name="password" onChange={onChangeMock} />
        <button type="submit" title="Log In" onClick={onPressMock} />
      </Form>,
    );
    const usernameInput = getByPlaceholderText("username");
    const passwordInput = getByPlaceholderText("password");
    const button = getByRole("button", { name: "Log In" });
    fireEvent.change(usernameInput, { target: { value: "n7studio" } });
    fireEvent.change(passwordInput, {
      target: { value: "react_original_form" },
    });
    await waitFor(() => {
      fireEvent.click(button);
      expect(onSubmitMock()).toStrictEqual(user);
    });
  });
});

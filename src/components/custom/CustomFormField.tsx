import {
  Control,
  FieldValues,
  Controller,
  ControllerRenderProps,
} from "react-hook-form";
import { Input, InputProps } from "../ui/input";
import { Textarea } from "../ui/textarea";

import Field from "./form";
import { FormFieldProps } from "@/lib/types";

type ControllerType = ControllerRenderProps<FieldValues, string>;
type RenderCustomFieldParams = {
  field: ControllerType; // Assuming ControllerType is already defined
  additionalParam?: number; // Replace with actual parameter names and types
};

const RenderInput = ({
  field,
  props,
}: {
  field: ControllerType;
  props: FormFieldProps;
}) => {
  switch (props.type) {
    case "text":
      return <Field.Text field={field} props={props} />;

    case "textarea":
      return <Field.Textarea field={field} props={props} />;

    case "select":
      return <Field.SelectMenu field={field} children={props.children} />;

    case "customField":
      return props.renderCustomField
        ? props.renderCustomField({ field, additionalParam: 1 })
        : null;
    default:
      return null;
  }
};

export default function CustomFormField(props: FormFieldProps) {
  const { control, name } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <div>
            <RenderInput field={field} props={props} />
          </div>
        );
      }}
    />
  );
}

import {
  FieldValues,
  Controller,
  ControllerRenderProps,
} from "react-hook-form";

import Field from "./form";
import { FormFieldProps } from "@/lib/types";

type ControllerType = ControllerRenderProps<FieldValues, string>;

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
            {field.value}
          </div>
        );
      }}
    />
  );
}

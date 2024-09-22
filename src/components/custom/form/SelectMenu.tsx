import { ControllerType } from "@/lib/types";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  field: ControllerType;
  children: React.ReactNode;
};

export default function SelectMenu({ field, children }: Props) {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

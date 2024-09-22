import { Input } from "@/components/ui/input";
import { RenderInputType } from "@/lib/types";

export default function Text({ field, props }: RenderInputType) {
  return (
    <div>
      <Input {...field} {...props} />
    </div>
  );
}

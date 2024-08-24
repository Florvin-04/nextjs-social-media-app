import TrendSidebar from "@/components/custom/TrendSidebar";
import Notifications from "./NotificationsRender";

export default function NotificationsPage() {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex gap-2">
        <div className="min-w-0 flex-1">
          <Notifications />
        </div>

        <TrendSidebar />
      </div>
    </div>
  );
}

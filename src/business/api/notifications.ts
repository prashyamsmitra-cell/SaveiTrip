// API client — notifications.
import { authenticatedRequest } from "./client";
import type { NotificationDelivery } from "../endorsementTypes";

export async function listNotifications() {
  return authenticatedRequest<{ notifications: NotificationDelivery[] }>(
    "/api/endorsements/notifications"
  );
}

export async function markNotificationRead(notificationId: string) {
  return authenticatedRequest<{ notification: NotificationDelivery }>(
    `/api/endorsements/notifications/${notificationId}/read`,
    { method: "POST", body: JSON.stringify({}) }
  );
}

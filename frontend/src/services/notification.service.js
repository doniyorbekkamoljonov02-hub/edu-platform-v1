import { createCrudService } from "./crudFactory"

// Thin wrapper over /api/notifications — see backend/src/notifications for the real contract.
export const notificationService = createCrudService("notifications")

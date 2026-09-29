import { createCrudService } from "./crudFactory"

// Thin wrapper over /api/schedule — see backend/src/schedule for the real contract.
export const scheduleService = createCrudService("schedule")

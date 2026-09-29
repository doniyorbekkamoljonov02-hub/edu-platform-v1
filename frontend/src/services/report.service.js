import { createCrudService } from "./crudFactory"

// Thin wrapper over /api/reports — see backend/src/reports for the real contract.
export const reportService = createCrudService("reports")

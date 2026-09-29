import { createCrudService } from "./crudFactory"

// Thin wrapper over /api/attendance — see backend/src/attendance for the real contract.
export const attendanceService = createCrudService("attendance")

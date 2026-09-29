import { createCrudService } from "./crudFactory"

// Thin wrapper over /api/grades — see backend/src/grades for the real contract.
export const gradeService = createCrudService("grades")

import { createCrudService } from "./crudFactory"

// Thin wrapper over /api/subjects — see backend/src/subjects for the real contract.
export const subjectService = createCrudService("subjects")

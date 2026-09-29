import { createCrudService } from "./crudFactory"

// Thin wrapper over /api/directors — see backend/src/directors for the real contract.
export const directorService = createCrudService("directors")

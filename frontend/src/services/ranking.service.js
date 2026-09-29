import { createCrudService } from "./crudFactory"

// Thin wrapper over /api/ranking — see backend/src/ranking for the real contract.
export const rankingService = createCrudService("ranking")

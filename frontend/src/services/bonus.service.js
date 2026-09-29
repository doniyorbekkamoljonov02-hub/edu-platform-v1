import { createCrudService } from "./crudFactory"

// Thin wrapper over /api/bonuses — see backend/src/bonuses for the real contract.
export const bonusService = createCrudService("bonuses")

import { createCrudService } from "./crudFactory"

// Thin wrapper over /api/groups — see backend/src/groups for the real contract.
export const groupService = createCrudService("groups")

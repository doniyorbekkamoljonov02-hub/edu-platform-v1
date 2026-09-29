import { createCrudService } from "./crudFactory"

// Thin wrapper over /api/admins — see backend/src/admins for the real contract.
export const adminService = createCrudService("admins")

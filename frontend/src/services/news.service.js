import { createCrudService } from "./crudFactory"

// Thin wrapper over /api/news — see backend/src/news for the real contract.
export const newsService = createCrudService("news")

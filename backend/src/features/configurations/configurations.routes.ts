import { Router } from "express";
import { ConfigController } from "./configurations.controller";

const router = Router();
const configController = new ConfigController();

router.get("/", configController.read.bind(configController));
router.post("/", configController.create.bind(configController));
router.put("/:id", configController.update.bind(configController));
router.delete("/:id", configController.delete.bind(configController));

export default router;

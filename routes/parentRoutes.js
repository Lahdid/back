import express from "express";
import { linkChild, getChildrenByParent, unlinkChild, setChildSafeZone, getChildSafeZone } from "../controllers/parentController.js";
import { checkCurrentUser } from "../middlewares/verifyToken.js";

const router = express.Router();

router.route("/").post(checkCurrentUser,linkChild).get(checkCurrentUser,getChildrenByParent).delete(checkCurrentUser,unlinkChild);
router.route("/SetSafeZone").put(checkCurrentUser,setChildSafeZone).get(checkCurrentUser,getChildSafeZone);
export default router;

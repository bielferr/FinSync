import { Router } from "express";
import { getUserProfile } from "../controllers/user.controller";

const router = Router();

router.get("/", (req, res) => {
  try {
    const profile = getUserProfile();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});

export default router;
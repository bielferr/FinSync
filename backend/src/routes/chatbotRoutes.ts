import { Router } from 'express';
import { ChatbotController } from '../controllers/chatbotController';

const router = Router();
const chatbotController = new ChatbotController();

router.post('/message', chatbotController.processMessage);
router.post('/train', chatbotController.trainModel);
router.get('/health', chatbotController.getHealth);

export default router;
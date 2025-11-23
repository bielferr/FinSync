import { Router } from 'express';
import { ChatbotController } from '../controllers/chatbotController';

const router = Router();
const chatbotController = new ChatbotController();

router.post('/message', chatbotController.processMessage);
router.post('/train', chatbotController.trainModel);
router.get('/health', chatbotController.getHealth);

router.get('/history', chatbotController.getChatHistory);
router.get('/history/:userId', chatbotController.getChatHistory);

export default router;
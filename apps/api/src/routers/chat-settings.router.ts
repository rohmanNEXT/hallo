import { ChatSettingsController } from '@/controllers/chat-settings.controller';
import { Router } from 'express';

export class ChatSettingsRouter {
  private router: Router;
  private chatSettingsController: ChatSettingsController;

  constructor() {
    this.chatSettingsController = new ChatSettingsController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.chatSettingsController.getSettings);
    this.router.post('/', this.chatSettingsController.updateSettings);
  }

  getRouter(): Router {
    return this.router;
  }
}

import { AiConfigController } from '@/controllers/ai-config.controller';
import { Router } from 'express';

export class AiConfigRouter {
  private router: Router;
  private aiConfigController: AiConfigController;

  constructor() {
    this.aiConfigController = new AiConfigController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.aiConfigController.getSettings);
    this.router.post('/', this.aiConfigController.updateSettings);
  }

  getRouter(): Router {
    return this.router;
  }
}

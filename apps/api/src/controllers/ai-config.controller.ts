import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(__dirname, '..', '..', '..', 'web', 'src', 'lib', 'data', 'ai-config.json');

export class AiConfigController {
  async getSettings(req: Request, res: Response) {
    try {
      const fileContents = await fs.readFile(dataFilePath, 'utf8');
      const data = JSON.parse(fileContents);
      return res.status(200).send(data);
    } catch (error) {
      console.error('Error reading ai-config.json:', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async updateSettings(req: Request, res: Response) {
    try {
      const payload = req.body;
      await fs.writeFile(dataFilePath, JSON.stringify(payload, null, 2), 'utf8');
      return res.status(200).send({ message: 'AI configuration updated successfully', data: payload });
    } catch (error) {
      console.error('Error writing ai-config.json:', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
}

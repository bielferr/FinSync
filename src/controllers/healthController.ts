import { Request, Response } from 'express';
import sequelize from '../config/database';
import User from '../models/user.model';

export class HealthController {
  public getHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const dbStatus = await this.checkDatabase();
      
      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        status: 'OK',
        database: dbStatus,
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      res.status(500).json({
        success: false,
        timestamp: new Date().toISOString(),
        status: 'ERROR',
        error: errorMessage
      });
    }
  };

  public getDetailedHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const dbStatus = await this.checkDatabase();
      
      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        status: 'OK',
        database: dbStatus,
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      res.status(500).json({
        success: false,
        timestamp: new Date().toISOString(),
        status: 'ERROR',
        error: errorMessage
      });
    }
  };

  private async checkDatabase() {
    try {
      await sequelize.authenticate();
      
      const userCount = await User.count();
      const tables = await this.getTableInfo();
      
      return {
        status: 'CONNECTED',
        connection: 'PostgreSQL',
        userCount: userCount,
        tables: tables,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      return {
        status: 'DISCONNECTED',
        error: errorMessage,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async getTableInfo() {
    try {
      const [results] = await sequelize.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      
      return (results as any[]).map(row => row.table_name);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return [`Erro ao buscar tabelas: ${errorMessage}`];
    }
  }
}
/**
 * Tipos TypeScript para integração com MongoDB
 */

import type { ObjectId } from "mongodb";

/**
 * Documento de waitlist armazenado no MongoDB
 */
export interface WaitlistDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  company: string;
  position: string;
  tags?: string[];
  source: string;
  status: "pending" | "contacted" | "converted" | "declined";
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
    language?: string;
  };
}

/**
 * Resposta da criação de entrada na waitlist
 */
export interface WaitlistCreationResponse {
  success: boolean;
  message: string;
  id?: string;
  error?: string;
}

/**
 * Configuração do MongoDB
 */
export interface MongoDBConfig {
  uri: string;
  databaseName: string;
  collectionName: string;
}

/**
 * Estatísticas da waitlist
 */
export interface WaitlistStats {
  total: number;
  pending: number;
  contacted: number;
  converted: number;
  declined: number;
  byDate: {
    date: string;
    count: number;
  }[];
}

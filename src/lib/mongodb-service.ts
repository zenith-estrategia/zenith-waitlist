import type { Collection, Db, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import type { WaitlistDocument } from "@/types/mongodb";

/**
 * Configuração do banco de dados
 */
const DB_NAME = process.env.MONGODB_DB_NAME || "zenith_waitlist";
const COLLECTION_NAME = "waitlist_entries";

/**
 * Serviço para gerenciar operações da waitlist no MongoDB
 */
export class MongoDBWaitlistService {
  private db: Db | null = null;
  private collection: Collection<WaitlistDocument> | null = null;

  /**
   * Inicializa a conexão com o banco de dados
   */
  private async initialize(): Promise<void> {
    if (this.db && this.collection) {
      return;
    }

    const client = await clientPromise;
    this.db = client.db(DB_NAME);
    this.collection = this.db.collection<WaitlistDocument>(COLLECTION_NAME);

    // Garante que os índices necessários existam
    await this.ensureIndexes();
  }

  /**
   * Cria índices para otimização de queries
   */
  private async ensureIndexes(): Promise<void> {
    if (!this.collection) return;

    try {
      // Índice único no email para evitar duplicatas
      await this.collection.createIndex({ email: 1 }, { unique: true });

      // Índice para buscar por status
      await this.collection.createIndex({ status: 1 });

      // Índice para ordenação por data de criação
      await this.collection.createIndex({ createdAt: -1 });

      // Índice composto para analytics
      await this.collection.createIndex({ status: 1, createdAt: -1 });
    } catch (error) {
      console.warn("Aviso: Não foi possível criar índices:", error);
      // Não falha a aplicação se não conseguir criar índices
    }
  }

  /**
   * Cria uma nova entrada na waitlist
   */
  async createEntry(data: {
    name: string;
    email: string;
    company: string;
    position: string;
    metadata?: {
      ip?: string;
      userAgent?: string;
      referrer?: string;
      language?: string;
    };
  }): Promise<ObjectId> {
    await this.initialize();

    if (!this.collection) {
      throw new Error("Falha ao conectar ao banco de dados");
    }

    const now = new Date();
    const document: WaitlistDocument = {
      name: data.name,
      email: data.email.toLowerCase(),
      company: data.company,
      position: data.position,
      tags: ["Waitlist", "Zenith Votuporanga", "Cliente Fundador"],
      source: "website",
      status: "pending",
      createdAt: now,
      updatedAt: now,
      metadata: data.metadata,
    };

    try {
      const result = await this.collection.insertOne(document);
      return result.insertedId;
    } catch (error: unknown) {
      // Verifica se é erro de duplicata (código 11000)
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === 11000
      ) {
        throw new Error("Este email já está cadastrado na lista de espera");
      }
      throw error;
    }
  }

  /**
   * Busca uma entrada por email
   */
  async findByEmail(email: string): Promise<WaitlistDocument | null> {
    await this.initialize();

    if (!this.collection) {
      throw new Error("Falha ao conectar ao banco de dados");
    }

    return this.collection.findOne({ email: email.toLowerCase() });
  }

  /**
   * Atualiza o status de uma entrada
   */
  async updateStatus(
    id: ObjectId,
    status: WaitlistDocument["status"]
  ): Promise<boolean> {
    await this.initialize();

    if (!this.collection) {
      throw new Error("Falha ao conectar ao banco de dados");
    }

    const result = await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    return result.modifiedCount > 0;
  }

  /**
   * Lista todas as entradas com paginação
   */
  async listEntries(options?: {
    page?: number;
    limit?: number;
    status?: WaitlistDocument["status"];
  }): Promise<{
    entries: WaitlistDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    await this.initialize();

    if (!this.collection) {
      throw new Error("Falha ao conectar ao banco de dados");
    }

    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const skip = (page - 1) * limit;

    const filter = options?.status ? { status: options.status } : {};

    const [entries, total] = await Promise.all([
      this.collection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      this.collection.countDocuments(filter),
    ]);

    return {
      entries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtém estatísticas da waitlist
   */
  async getStats(): Promise<{
    total: number;
    pending: number;
    contacted: number;
    converted: number;
    declined: number;
  }> {
    await this.initialize();

    if (!this.collection) {
      throw new Error("Falha ao conectar ao banco de dados");
    }

    const stats = await this.collection
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const result = {
      total: 0,
      pending: 0,
      contacted: 0,
      converted: 0,
      declined: 0,
    };

    for (const stat of stats) {
      result.total += stat.count;
      if (stat._id === "pending") result.pending = stat.count;
      if (stat._id === "contacted") result.contacted = stat.count;
      if (stat._id === "converted") result.converted = stat.count;
      if (stat._id === "declined") result.declined = stat.count;
    }

    return result;
  }

  /**
   * Deleta uma entrada (soft delete - marca como declined)
   */
  async deleteEntry(id: ObjectId): Promise<boolean> {
    return this.updateStatus(id, "declined");
  }

  /**
   * Verifica se o email já existe
   */
  async emailExists(email: string): Promise<boolean> {
    const entry = await this.findByEmail(email);
    return entry !== null;
  }
}

/**
 * Instância singleton do serviço
 */
export const waitlistService = new MongoDBWaitlistService();

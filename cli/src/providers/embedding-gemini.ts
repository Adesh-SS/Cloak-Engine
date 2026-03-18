/**
 * embedding-gemini.ts - Google Gemini Embedding Provider
 *
 * Uses Google's gemini-embedding-001 model (768 dimensions)
 * Calls the v1beta REST API directly to avoid SDK version issues.
 * Includes rate limiting for free tier (100 req/min).
 * Cost: Free tier available
 */

import { BaseEmbeddingProvider } from '../core/embeddings';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MAX_REQUESTS_PER_MINUTE = 80; // Stay under the 100/min free tier limit
const BATCH_PARALLEL_SIZE = 10;     // Max concurrent requests in a batch
const RETRY_DELAYS = [5000, 15000, 30000]; // Retry delays for 429 errors (ms)

export class GeminiEmbeddingProvider extends BaseEmbeddingProvider {
  private apiKey: string;
  private requestTimestamps: number[] = [];

  constructor(apiKey: string) {
    super('gemini', 'gemini-embedding-001', 768);
    
    const key = apiKey || process.env.GOOGLE_API_KEY;
    if (!key) {
      throw new Error('Google API key is required for Gemini embeddings');
    }
    
    this.apiKey = key;
  }

  /**
   * Wait if we're approaching the rate limit
   */
  private async throttle(): Promise<void> {
    const now = Date.now();
    // Remove timestamps older than 60 seconds
    this.requestTimestamps = this.requestTimestamps.filter(t => now - t < 60000);
    
    if (this.requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
      // Wait until the oldest request in our window expires
      const oldestInWindow = this.requestTimestamps[0];
      const waitMs = 60000 - (now - oldestInWindow) + 1000; // +1s buffer
      if (waitMs > 0) {
        await new Promise(resolve => setTimeout(resolve, waitMs));
      }
      // Clean again after waiting
      this.requestTimestamps = this.requestTimestamps.filter(t => Date.now() - t < 60000);
    }
    
    this.requestTimestamps.push(Date.now());
  }

  /**
   * Make a single embedding request with retry logic for 429 errors
   */
  private async embedWithRetry(text: string, retryCount = 0): Promise<number[]> {
    await this.throttle();

    const url = `${GEMINI_API_BASE}/models/${this.model}:embedContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${this.model}`,
        content: {
          parts: [{ text }]
        },
        outputDimensionality: 768
      })
    });

    if (response.status === 429 && retryCount < RETRY_DELAYS.length) {
      const delay = RETRY_DELAYS[retryCount];
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.embedWithRetry(text, retryCount + 1);
    }

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`${response.status} ${response.statusText}: ${errorBody}`);
    }

    const data: any = await response.json();
    
    if (!data.embedding || !data.embedding.values) {
      throw new Error('No embedding returned from Gemini');
    }

    return data.embedding.values;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      return await this.embedWithRetry(text);
    } catch (error: any) {
      if (error.message?.includes('API_KEY') || error.message?.includes('401')) {
        throw new Error('Invalid Google API key. Check your API key in cloakscan config.');
      }
      throw new Error(`Gemini embedding generation failed: ${error.message}`);
    }
  }

  async generateBulkEmbeddings(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];

    const allEmbeddings: number[][] = [];

    // Process in small sequential batches with limited parallelism
    for (let i = 0; i < texts.length; i += BATCH_PARALLEL_SIZE) {
      const batch = texts.slice(i, i + BATCH_PARALLEL_SIZE);
      
      try {
        const batchPromises = batch.map(text => this.embedWithRetry(text));
        const batchEmbeddings = await Promise.all(batchPromises);
        allEmbeddings.push(...batchEmbeddings);
      } catch (error: any) {
        throw new Error(`Gemini bulk embedding generation failed: ${error.message}`);
      }
    }

    return allEmbeddings;
  }

  estimateCost(tokenCount: number): number {
    const characterCount = tokenCount * 4;
    return (characterCount / 1000) * 0.0001;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.generateEmbedding('test');
      return true;
    } catch (error) {
      return false;
    }
  }
}

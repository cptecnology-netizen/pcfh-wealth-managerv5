
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { Asset, Transaction, AccountPlan } from "../types";

export class WealthAnalyst {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getWealthInsights(assets: Asset[], transactions: Transaction[]) {
    const prompt = `
      Você é um Consultor Financeiro Sênior da Primo Couto Family Holdings (SFO em Angola).
      Analise o portfólio de ativos e o histórico de transações abaixo e forneça uma síntese executiva estratégica.
      
      CONTEXTO DO CLIENTE:
      Ativos: ${JSON.stringify(assets)}
      Transações Recentes: ${JSON.stringify(transactions)}
      
      REQUISITOS DA ANÁLISE:
      1. Saúde Patrimonial: Avalie a liquidez e solvência.
      2. Gestão de Risco: Identifique riscos de exposição cambial e concentração.
      3. Recomendações: Sugira 2 ações baseadas no PGC Angolano.
      
      ESTILO: Responda em Português de Angola, conciso (máx 3 parágrafos), use HTML com classes Tailwind.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "Análise indisponível.";
    } catch (error) {
      console.error("Gemini AI Analysis Error:", error);
      return `<div class="p-4 bg-red-500/10 rounded-lg text-xs italic text-red-400">Erro na análise de IA.</div>`;
    }
  }

  async getStrategicPortfolioReview(assets: Asset[]) {
    const prompt = `
      Faça uma revisão estratégica profunda do portfólio da Primo Couto Family Holdings.
      Ativos: ${JSON.stringify(assets)}
      
      Aborde:
      - Diversificação de classes de ativos.
      - Alocação geográfica e cambial (Angola/Internacional).
      - Recomendações de rebalanceamento.
      - Oportunidades fiscais ou de sucessão (baseado no contexto angolano).
      
      Use formatação HTML rica com Tailwind CSS. Use cartões, cores e ícones (material-icons-outlined).
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });
      return response.text || "Não foi possível gerar a revisão estratégica.";
    } catch (error) {
      console.error("Strategic Review Error:", error);
      return "Erro ao gerar revisão estratégica.";
    }
  }

  async analyzeReceipt(base64Image: string, mimeType: string) {
    const prompt = `
      Analise esta imagem de um recibo ou fatura e extraia os seguintes dados em formato JSON:
      - description (breve descrição do que foi comprado)
      - amount (valor total como número)
      - currency (AOA, USD ou EUR)
      - date (formato YYYY-MM-DD)
      - suggestedPGCAccount (sugira o código de conta de despesa PGC mais provável, ex: 6211 para supermercado, 6212 para telecomunicações, 6214 para veículos)
      
      Responda APENAS o JSON.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: mimeType } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              currency: { type: Type.STRING },
              date: { type: Type.STRING },
              suggestedPGCAccount: { type: Type.STRING }
            },
            required: ['description', 'amount', 'currency', 'date', 'suggestedPGCAccount']
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Receipt Analysis Error:", error);
      throw error;
    }
  }

  async suggestCategory(description: string, pgc: AccountPlan[]) {
    const prompt = `
      Dada a descrição de uma transação financeira: "${description}"
      E as contas do Plano Geral de Contabilidade (PGC) Angolano: ${JSON.stringify(pgc)}
      
      Qual é o código PGC (6XXX para despesas ou 7XXX para receitas) mais adequado para esta transação?
      Responda APENAS com o código de 4 dígitos. Se não souber, responda "6999".
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text?.trim() || "6999";
    } catch (error) {
      return "6999";
    }
  }

  createChatSession(assets: Asset[], transactions: Transaction[]): Chat {
    return this.ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `
          Você é o "Wealth Advisor" da Primo Couto Family Holdings (PCFH).
          Seu objetivo é ajudar a família e seus gestores com dúvidas sobre o patrimônio.
          
          CONTEXTO ATUAL:
          Ativos: ${JSON.stringify(assets)}
          Transações: ${JSON.stringify(transactions)}
          
          Regras:
          - Seja extremamente profissional e cortês.
          - Responda dúvidas sobre gastos, alocação de ativos e performance.
          - Use o Kwanza (AOA) como moeda principal, mas considere USD e EUR se perguntado.
          - Seus conselhos devem estar alinhados com o Plano Geral de Contabilidade Angolano (PGC).
          - Nunca compartilhe dados sensíveis de forma insegura (embora este chat seja interno).
          - Use Markdown para formatar tabelas e listas.
        `,
      },
    });
  }
}

export const wealthAnalyst = new WealthAnalyst();

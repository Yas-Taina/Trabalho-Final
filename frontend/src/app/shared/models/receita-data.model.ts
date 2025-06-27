// src/app/shared/models/receita-data.model.ts
export interface ReceitaData {
  /**
   * Data no formato ISO yyyy-MM-dd (ex: "2025-06-27")
   */
  data: string;

  /**
   * Valor total de receitas naquele dia
   */
  total: number;
}

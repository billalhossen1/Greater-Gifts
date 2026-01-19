
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const getFinancialAdvice = async (transactions: Transaction[], userName: string) => {
  // Use strictly process.env.API_KEY as per @google/genai coding guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;
  
  const categories = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  const prompt = `
    Act as a professional financial advisor.
    User Name: ${userName}
    Financial Summary:
    - Total Income: $${income}
    - Total Expenses: $${expense}
    - Current Balance: $${balance}
    - Top Spending Category: ${topCategory}
    
    Provide exactly 3 short, personalized, and actionable financial tips (max 20 words each). 
    Base them on the income-to-expense ratio and the top spending category.
    Return only the tips as a bulleted list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Keep tracking your expenses to see insights here!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ensure you have a balanced budget and minimize unnecessary spending.";
  }
};
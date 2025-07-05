import { Response } from 'express';
import ollama from 'ollama';
import Transaction from '../models/transactionModel';
import { IRequest } from '../types/requestTypes';

const extractFilterParameters = async (message: string): Promise<any> => {
  console.log('[AI Chat] Extracting filter parameters from query:', message);
  const currentYear = new Date().getFullYear();
    // chat prompt
  const prompt = `
    You are a data extraction expert. Your task is to extract filter parameters from a user's natural language question and return them as a single JSON object.

    **RULES:**
    1.  Your output MUST be a single JSON object.
    2.  Extract values for the following keys if they are present in the question. If a value is not present, do not include its key in the JSON object.
        - "category": String (must be either 'Revenue' or 'Expense')
        - "status": String (must be either 'Paid' or 'Pending')
        - "amount_gte": Number (for "over", "more than", "at least", ">=", ">")
        - "amount_lte": Number (for "under", "less than", "at most", "<=", "<")
        - "date_gte": String (in YYYY-MM-DD format)
        - "date_lte": String (in YYYY-MM-DD format)
        - "description_regex": String (a regex pattern for searching the description field)
    3.  **Date Extraction:**
        - Convert relative dates like "last month", "this year", or a specific month like "March" into a specific \`date_gte\` and \`date_lte\` range in "YYYY-MM-DD" format.
        - Assume the current year is ${currentYear} if the user does not specify one.
    4.  If the question is general and contains no filterable parameters (e.g., "how are we doing?"), return an empty JSON object \`{}\`.
    5.  **VERY IMPORTANT:** Only return the raw JSON object, with no other text, explanations, or markdown.

    **Examples:**
    - User Question: "show me paid revenue transactions over $500 from March"
    - Correct JSON Output: \`{ "status": "Paid", "category": "Revenue", "amount_gte": 500, "date_gte": "${currentYear}-03-01", "date_lte": "${currentYear}-03-31" }\`
    
    - User Question: "what were our expenses last month?" (Assume today is July 15, 2024)
    - Correct JSON Output: \`{ "category": "Expense", "date_gte": "2024-06-01", "date_lte": "2024-06-30" }\`
  `;

   try {
    const response = await ollama.chat({
      model: 'llama3',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: `Here is the user's question: "${message}"` },
      ],
      format: 'json',
    });

    const params = JSON.parse(response.message.content);
    console.log('[AI Chat] Extracted parameters:', params);
    return params;
  } catch (error) {
    console.error('[AI Chat] Error extracting parameters:', error);
    return {}; // Return empty object on failure
  }
};

const buildMongoFilter = (params: any): object => {
    const filter: any = {};
    if (params.category) filter.category = params.category;
    if (params.status) filter.status = params.status;
    if (params.description_regex) filter.description = { $regex: params.description_regex, $options: 'i' };

    if (params.amount_gte || params.amount_lte) {
        filter.amount = {};
        if (params.amount_gte) filter.amount.$gte = params.amount_gte;
        if (params.amount_lte) filter.amount.$lte = params.amount_lte;
    }
    
    if (params.date_gte || params.date_lte) {
        filter.date = {};
        if (params.date_gte) filter.date.$gte = new Date(params.date_gte + "T00:00:00.000Z"); 
        if (params.date_lte) {
            filter.date.$lte = new Date(params.date_lte + "T23:59:59.999Z");
        }
    }
    console.log('[AI Chat] Built MongoDB filter:', JSON.stringify(filter));
    return filter;
}

export const chatWithAI = async (req: IRequest, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    console.log('[AI Chat] Received request with message:', message);

    if (!message) {
      res.status(400).json({ message: 'Message is required' });
      return;
    }

    const filterParams = await extractFilterParameters(message);
    const specificFilter = buildMongoFilter(filterParams);
    
    let specificTransactions: any[] = [];
    if (Object.keys(specificFilter).length > 0) {
      console.log('[AI Chat] Executing specific query with filter:', specificFilter);
      specificTransactions = await Transaction.find(specificFilter).limit(50);
      console.log(`[AI Chat] Found ${specificTransactions.length} specific transactions.`);
    }
    
    if (specificTransactions.length > 0) {
      console.log('[AI Chat] Using specific transaction data for the prompt.');

      const count = specificTransactions.length;
      const totalAmount = specificTransactions.reduce((acc, t) => acc + t.amount, 0);
      const averageAmount = count > 0 ? totalAmount / count : 0;
      const sampleTransactions = specificTransactions.slice(0, 5);

      const metrics = { count, totalAmount, averageAmount };

      const narrativePrompt = `
        Based on the user's question and the following calculated metrics, provide a very short, one-sentence narrative summary.
        Example: "Based on your query, I found X transactions totaling Y." Do not add any extra pleasantries.
        
        METRICS:
        - Number of matching transactions: ${count}
        - Total amount of these transactions: $${totalAmount.toFixed(2)}
        - Average amount of these transactions: $${averageAmount.toFixed(2)}

        USER QUESTION:
        ${message}
      `;

      const narrativeResponse = await ollama.chat({
          model: 'llama3',
          messages: [{ role: 'user', content: narrativePrompt }]
      });
      const narrative = narrativeResponse.message.content;

      res.json({
        type: 'data',
        data: {
          narrative,
          metrics,
          sample: sampleTransactions
        }
      });
      return;

    } else {
      console.log('[AI Chat] No specific data found. Using general summary for the prompt.');
      
      const generalStatsPromise = Transaction.aggregate([
        { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } },
      ]);
      const overviewStatsPromise = Transaction.aggregate([
        { $group: { _id: { year: { $year: "$date" }, month: { $month: "$date" }, category: "$category" }, totalAmount: { $sum: "$amount" } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
      const expenseByCategoryPromise = Transaction.aggregate([
        { $match: { category: 'Expense' } },
        { $group: { _id: '$description', totalAmount: { $sum: '$amount' } } },
        { $sort: { totalAmount: -1 } }
      ]);

      const [generalStats, overviewStats, expenseByCategory] = await Promise.all([
          generalStatsPromise,
          overviewStatsPromise,
          expenseByCategoryPromise
      ]);

      const summaryContext = `
        1. General Statistics:
        ${JSON.stringify(generalStats, null, 2)}
        2. Monthly Overview:
        ${JSON.stringify(overviewStats, null, 2)}
        3. Top Expense Categories:
        ${JSON.stringify(expenseByCategory, null, 2)}
      `;

      const finalPrompt = `
        You are a financial analyst AI.
        Your task is to answer the user's question based on the provided financial summary.
        If you cannot answer the question with the given data, say so clearly. Do not make up information.
        
        ---
        **FINANCIAL SUMMARY:**
        ${summaryContext}
        ---
        **USER QUESTION:**
        ${message}
      `;
    
      const response = await ollama.chat({
        model: 'llama3',
        messages: [{ role: 'user', content: finalPrompt }],
      });
      
      res.json({ type: 'text', data: { reply: response.message.content } });
    }

  } catch (error) {
    console.error('Error chatting with AI:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error while chatting with AI' });
    }
  }
}; 
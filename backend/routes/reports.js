
import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/trial-balance', async (req, res) => {
  try {
    const query = `
      SELECT 
        ap.code, 
        ap.description, 
        ap.category,
        COALESCE(SUM(CASE WHEN ap.category IN ('asset', 'expense') THEN t.amount ELSE 0 END), 0) as debit,
        COALESCE(SUM(CASE WHEN ap.category IN ('liability', 'revenue', 'equity') THEN t.amount ELSE 0 END), 0) as credit
      FROM account_plans ap
      LEFT JOIN transactions t ON ap.code = t.account_code
      GROUP BY ap.code, ap.description, ap.category
      ORDER BY ap.code ASC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar balancete.' });
  }
});

router.get('/balance-sheet', async (req, res) => {
  try {
    const query = `
      SELECT ap.category, ap.code, ap.description, COALESCE(SUM(t.amount), 0) as amount
      FROM account_plans ap
      LEFT JOIN transactions t ON ap.code = t.account_code
      WHERE ap.category IN ('asset', 'liability', 'equity')
      GROUP BY ap.category, ap.code, ap.description
      ORDER BY ap.code;
    `;
    const result = await pool.query(query);
    const categoryMap = { 'asset': 'Activo', 'liability': 'Liability', 'equity': 'Equity' };
    const grouped = result.rows.reduce((acc, row) => {
      const catKey = categoryMap[row.category] || 'Outros';
      if (!acc[catKey]) acc[catKey] = [];
      acc[catKey].push({ code: row.code, description: row.description, amount: parseFloat(row.amount) });
      return acc;
    }, {});
    res.json({ data: grouped });
  } catch (err) {
    res.status(500).json({ error: 'Falha no balanço' });
  }
});

router.get('/income-statement', async (req, res) => {
  const { start, end } = req.query;
  try {
    const query = `
      SELECT 
        ap.code, 
        ap.description, 
        ap.category as type,
        t.is_fixed,
        COALESCE(SUM(t.amount), 0) as amount
      FROM account_plans ap
      LEFT JOIN transactions t ON ap.code = t.account_code AND t.date BETWEEN $1 AND $2
      WHERE ap.category IN ('revenue', 'expense')
      GROUP BY ap.code, ap.description, ap.category, t.is_fixed
      HAVING SUM(t.amount) > 0
      ORDER BY ap.code;
    `;
    const result = await pool.query(query, [start || '2025-01-01', end || '2025-12-31']);
    
    const revenues = result.rows.filter(r => r.type === 'revenue').map(r => ({ ...r, amount: parseFloat(r.amount) }));
    const expenses = result.rows.filter(e => e.type === 'expense').map(e => ({ ...e, amount: parseFloat(e.amount) }));
    
    const totalRev = revenues.reduce((s, r) => s + r.amount, 0);
    const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
    const fixedExp = expenses.filter(e => e.is_fixed).reduce((s, e) => s + e.amount, 0);

    res.json({
      revenues,
      expenses,
      summary: {
        total_revenue: totalRev,
        total_expense: totalExp,
        fixed_expense: fixedExp,
        net_income: totalRev - totalExp
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro na DRE' });
  }
});

export default router;

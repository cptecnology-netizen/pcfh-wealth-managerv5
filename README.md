# 🏦 PCFH Wealth Manager v3.0

**Sistema de Gestão Patrimonial para Single Family Office**  
Desenvolvido exclusivamente para **Primo Couto Family Holdings (PCFH)** — Luanda, Angola.

---

## ✨ Funcionalidades

- ✅ **Gestão de Ativos**: imóveis, veículos, ETFs (SCHD, BIDD), depósitos a prazo (BAI)
- ✅ **Folha de Pagamento Automática**: IRT + Segurança Social (8% + 3%)
- ✅ **Impostos Angolanos**: IRT, IPU, IAC, SS — cálculo automático
- ✅ **Upload Inteligente de PDFs**: BAI, Interactive Brokers, Standard Bank
- ✅ **Despesas Pessoais**: supermercado, TV, ginásio, mesadas
- ✅ **Relatórios**: Balanço, DRE, Fiscal, Performance de Investimentos
- ✅ **Conformidade**: Plano Contabilístico Angolano + Lei 22/11 (Proteção de Dados)

---

## 🚀 Instalação Rápida

```bash
git clone https://github.com/pcfh/wealth-manager.git
cd wealth-manager
cp .env.example .env
# Edite .env com suas credenciais seguras
docker-compose up -d
```

- **Frontend**: http://localhost:3000  
- **API Docs**: http://localhost:8000/docs  
- **Usuário inicial**: `joao@pcfh.ao` / `DefinaSuaSenha123!`

---

## 🔐 Segurança

- Criptografia de dados sensíveis
- Autenticação JWT + MFA (próxima versão)
- Conformidade com **Lei n.º 22/11 de 17 de Junho** (Angola)
- Backup automático diário

---

## 📂 Estrutura

```
/backend      → Node.js + Express + TypeScript
/frontend     → React + Tailwind CSS
/sql          → Plano contabilístico + dados PCFH
```

---

## 📞 Suporte

- **Desenvolvedor**: João Caitica Primo Couto  
- **Email**: joao@pcfh.ao  
- **Data de Criação**: Dezembro 2024  
- **Versão**: 3.0.0 – Produção

> ⚠️ **Este sistema é de uso exclusivo do PCFH. Proibida a distribuição.**

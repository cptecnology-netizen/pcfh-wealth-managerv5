import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AssetList } from './components/AssetList';
import { Accounting } from './components/Accounting';
import { ExpenseReport } from './components/ExpenseReport';
import { TransactionsPage } from './components/TransactionsPage';
import { InflowManager } from './components/InflowManager';
import { OutflowManager } from './components/OutflowManager';
import { SponsorshipList } from './components/SponsorshipList';
import { YieldMap } from './components/YieldMap';
import { EntitiesOverview } from './components/EntitiesOverview';
import { LegalCompliance } from './components/LegalCompliance';
import { PayrollManager } from './components/PayrollManager';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assets" element={<AssetList />} />
          <Route path="/entities-overview" element={<EntitiesOverview />} />
          <Route path="/yield-map" element={<YieldMap />} />
          <Route path="/bodiva" element={<SponsorshipList />} />
          <Route path="/inflows" element={<InflowManager />} />
          <Route path="/outflows" element={<OutflowManager />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/payroll" element={<PayrollManager />} />
          <Route path="/reports" element={<ExpenseReport />} />
          <Route path="/legal" element={<LegalCompliance />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;

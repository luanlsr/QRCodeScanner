import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Participants } from './pages/Participants';
import { SettingsPage } from './pages/SettingsPage';
import { Header } from './components/Header';
import { GeneratePage } from './pages/GeneratePage';
import { ReadPage } from './pages/ReadPage';
import { Home } from './pages/Home';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gerar" element={<GeneratePage />} />
        <Route path="/leitor" element={<ReadPage />} />
        <Route path="/participantes" element={<Participants />} />
        <Route path="/configuracoes" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

# 🏗️ ObraPCI — Construction Management System

<div align="center">

![ObraPCI Banner](https://img.shields.io/badge/ObraPCI-Construction%20Management-185FA5?style=for-the-badge&logo=react)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**A full-stack web application for real-time construction project cost control, aligned with Brazil's Caixa Econômica Federal (CEF) PCI financing standards.**

[🚀 Live Demo](https://projeto-obra.vercel.app) · [📄 Report Bug](https://github.com/carbonellrec/obra-pci/issues) · [✨ Request Feature](https://github.com/carbonellrec/obra-pci/issues)

</div>

---

## 📸 Screenshots

| Dashboard | By Stage | Statistics |
|-----------|----------|------------|
| Real-time cost tracking | 20 PCI stages with progress | IDC, Pareto, Burn-down |

---

## 🎯 Problem Statement

In Brazil, construction financed by Caixa Econômica Federal requires strict cost tracking across **20 predefined construction stages** (PCI — Planilha de Custo Individual). Builders traditionally use spreadsheets that:

- ❌ Don't sync between devices
- ❌ Have no invoice photo storage
- ❌ Lack real-time financial metrics
- ❌ Can't be accessed on mobile

**ObraPCI solves all of this** with a modern, cloud-synced web application.

---

## ✨ Features

### 📊 Dashboard
- Real-time cost overview vs. CEF's approved budget per stage
- Color-coded progress bars (🟢 under budget / 🔴 over budget)
- KPI cards: total spent, difference, % executed, active stages

### 🏗️ Stage Control (20 PCI Stages)
- Expandable cards for each construction stage
- Add expenses with date, supplier, value, and invoice photo
- Edit CEF's reference values per stage
- Automatic incidence % calculation

### 🧾 Invoice Management
- Attach photos directly from mobile camera
- Track documented vs. undocumented expenses
- Quick "add photo" for missing invoices

### 📈 Statistics & Analytics
- **Cost Performance Index (CPI)** — budget efficiency metric
- **Final Cost Projection** — based on current spending rate
- **Pareto Chart** — Top 5 highest impact stages
- **Burn-down Chart** — monthly spending velocity
- **Invoice Coverage** — documentation compliance rate

### 📋 CNO (Tax Declaration)
- Summary ready for Brazil's Federal Revenue (Receita Federal)
- Status per stage: ✅ ready / ⚠️ partial / ❌ missing docs
- Direct guidance for e-CAC declaration

### 📄 PDF Report Generator
- Select specific stages to include
- Professional layout with project identification
- Auto-generated financial summary table
- Detailed expense breakdown per stage

### 🔐 Authentication & Multi-user
- Email/password authentication via Supabase Auth
- Row Level Security (RLS) — each user sees only their own data
- Persistent sessions across devices

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18 | UI framework |
| **Vite** | 4 | Build tool & dev server |
| **JavaScript (ES6+)** | — | Programming language |
| **jsPDF + AutoTable** | — | PDF generation |

### Backend & Infrastructure
| Technology | Purpose |
|---|---|
| **Supabase** | PostgreSQL database + Auth + RLS |
| **Vercel** | Hosting & CI/CD |
| **GitHub** | Version control |

### Architecture
```
Frontend (React/Vite)
    ↕ REST API
Supabase (PostgreSQL + Auth)
    ↕ Row Level Security
Each user's isolated data
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- Supabase account (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/carbonellrec/obra-pci.git
cd obra-pci

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ Never commit `.env.local` to version control. It's already in `.gitignore`.

### Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Expenses table
CREATE TABLE lancamentos (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  etapa_id INTEGER NOT NULL,
  data DATE,
  descricao TEXT NOT NULL,
  forn TEXT,
  valor NUMERIC(12,2) NOT NULL DEFAULT 0,
  nfnum TEXT,
  obs TEXT,
  img TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE lancamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_lancamentos" ON lancamentos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_lancamentos" ON lancamentos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_lancamentos" ON lancamentos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_lancamentos" ON lancamentos FOR DELETE USING (auth.uid() = user_id);
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
obra-pci/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx        # Main overview with KPIs
│   │   ├── Etapas.jsx           # 20 PCI stages management
│   │   ├── NotasFiscais.jsx     # Invoice tracking
│   │   ├── CNO.jsx              # Tax declaration helper
│   │   ├── Estatisticas.jsx     # Analytics & charts
│   │   ├── Login.jsx            # Authentication screen
│   │   ├── Modal.jsx            # Expense entry form
│   │   ├── ModalEditarPCI.jsx   # Edit PCI reference values
│   │   └── ModalPDF.jsx         # PDF report generator
│   ├── hooks/
│   │   └── useObraData.js       # Supabase data management
│   ├── data/
│   │   └── pci.js               # 20 CEF PCI stages config
│   ├── lib/
│   │   └── supabase.js          # Supabase client
│   └── utils/
│       └── format.js            # Currency, date, % formatters
├── .env.local                   # 🔒 Not committed (gitignored)
├── .gitignore
├── package.json
└── vite.config.js
```

---

## 🔒 Security

- **Row Level Security (RLS)** enforced at database level
- **Environment variables** for all sensitive keys
- **No API keys** in source code
- Each user's data is completely isolated

---

## 📊 Key Metrics Explained

### Cost Performance Index (CPI)
```
CPI = Budgeted Cost of Work Performed / Actual Cost
CPI > 1.0 = Under budget ✅
CPI < 1.0 = Over budget 🔴
```

### Final Cost Projection
```
Projected Final Cost = Actual Cost / % Executed
```

---

## 🌍 Deployment

This project is deployed on **Vercel** with automatic deployments on every push to `main`.

```bash
# Deploy to production
vercel --prod
```

### Vercel Environment Variables
Add these in your Vercel project settings:
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'feat: add AmazingFeature'

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

---

## 📋 Roadmap

- [ ] Excel export for all data
- [ ] Multi-user shared project (team access)
- [ ] Push notifications when stage exceeds budget
- [ ] Progress photo gallery per stage
- [ ] PWA support (install as mobile app)
- [ ] Dark/light theme toggle
- [ ] Portuguese/English language toggle

---

## 👤 Author

**Fabiano Carbonell da Silva**

- GitHub: [@carbonellrec](https://github.com/carbonellrec)
- LinkedIn: [Add your LinkedIn]
- Email: fabianocarbonell@gmail.com

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Caixa Econômica Federal](https://www.caixa.gov.br) — PCI standard reference
- [Supabase](https://supabase.com) — Amazing open-source Firebase alternative
- [Vercel](https://vercel.com) — Seamless deployment platform
- [jsPDF](https://github.com/parallax/jsPDF) — PDF generation library

---

<div align="center">

**Built with ❤️ in Brazil 🇧🇷**

⭐ If this project helped you, please give it a star!

</div>

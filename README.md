# 🏗️ ObraPCI | Construction & Financial Management System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)](https://ubuntu.com/)

A mission-critical management dashboard designed to track construction costs, fiscal compliance, and technical progress for the **PCI (Proposta de Construção Individual)** financing model. This application bridges the gap between software engineering and civil engineering by providing real-time financial health monitoring.

## 🎯 Business Problem
Managing residential construction financing in Brazil (via Caixa Econômica Federal) requires strict adherence to planned stages. Small deviations in cost can lead to significant financial gaps. **ObraPCI** solves this by providing a "Planned vs. Actual" analysis engine, ensuring transparency and fiscal control.

## 🌟 Key Features

- **Dynamic Financial Engine:** Real-time editing of PCI stage values with instant global state synchronization.
- **Advanced Analytics:** Automated calculation of cost variance, execution percentages, and project health indicators.
- **State Persistence:** Implemented local storage synchronization to ensure data integrity across browser sessions without needing a backend.
- **Modular Dashboard:** High-density UI for monitoring 20+ construction stages simultaneously with visual alerts (Red/Green variance).
- **Compliance Tracking:** Management of Tax Invoices (NF), CNO (National Works Registry), and Professional Responsibility (RT).

## 🛠️ Technical Stack & Engineering Skills

- **Frontend:** **React.js** using Functional Components and Modern Hooks strategy (`useState`, `useEffect`, `useMemo`).
- **State Management:** Complex local state handling for multi-tab navigation and nested data structures.
- **Architecture:** Modular design pattern (Separation of Concerns) with dedicated folders for Components, Hooks, Data, and Utils.
- **Environment:** Developed in a professional **Linux (Ubuntu/WSL2)** environment, leveraging Git for granular version control.

## 📐 Architecture & Modularization

The project is structured to be scalable and maintainable:
- `src/components`: UI Atomic units and complex layouts (Dashboard, Statistics, Modals).
- `src/hooks`: Custom business logic (e.g., `useObraData.js`) separating state management from UI.
- `src/utils`: Data formatting and mathematical helpers.
- `src/data`: Schema definitions for the PCI financing model.

## 🚀 Future Roadmap

- [ ] **PDF Reporting:** Automated generation of progress reports for banks/clients.
- [ ] **Cloud Sync:** Migration from LocalStorage to a cloud-based NoSQL database.
- [ ] **Visual Analytics:** Integration of Chart.js for burn-down and spending projection charts.

---

## 👩‍💻 About the Developer

I am a **Software Engineer** specializing in creating reactive, data-driven applications that solve real-world problems. With a background in **Software Engineering** and a focus on high-performance web tools, I build software that is both technically robust and user-centric.

---
*Developed with focus on Engineering Excellence by Priscila Goulart Carbonell*

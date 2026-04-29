# 🏗️ ObraPCI | Construction & Financial Management System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)](https://ubuntu.com/)

Um dashboard de gestão de missão crítica concebido para acompanhar custos de construção, conformidade fiscal e progresso técnico para o modelo de financiamento **PCI (Proposta de Construção Individual)** da Caixa Económica Federal. Esta aplicação une a engenharia de software à engenharia civil, fornecendo monitorização da saúde financeira em tempo real com uma infraestrutura robusta na nuvem.

## 🎯 Problema de Negócio
A gestão do financiamento de construção residencial no Brasil exige uma adesão estrita às etapas planeadas. Pequenos desvios de custos podem levar a lacunas financeiras significativas. O **ObraPCI** resolve isto fornecendo um motor de análise "Planeado vs. Real", garantindo transparência e controlo fiscal através de um ambiente multi-utilizador seguro.

## 🌟 Funcionalidades Principais

- **🔐 Autenticação Segura:** Integração com **Supabase Auth** para acesso privado, incluindo login por e-mail/senha e persistência de sessão.
- **📝 Lançamento e Edição Dinâmica (CRUD):** Motor de alta precisão para lançar e editar despesas, com cálculo automático de saldo remanescente por etapa.
- **☁️ Sincronização em Nuvem:** Migração completa de local storage para uma base de dados **PostgreSQL** em tempo real, garantindo a integridade dos dados em qualquer dispositivo.
- **📊 Análise Avançada:** Cálculo automatizado de variância de custos, IDC (Índice de Desempenho de Custos) e indicadores de saúde do projeto.
- **🛡️ Segurança ao Nível da Linha (RLS):** Segurança de nível empresarial onde os dados de cada utilizador são isolados ao nível da base de dados via políticas SQL.
- **📄 Relatórios Profissionais:** Geração automatizada de relatórios de progresso em PDF para bancos/clientes utilizando **jsPDF**.

## 🛠️ Stack Técnica e Competências de Engenharia

- **Frontend:** **React.js** utilizando Componentes Funcionais e estratégia moderna de Hooks (`useState`, `useEffect`, `useCallback`).
- **Backend-as-a-Service (BaaS):** **Supabase** (PostgreSQL, Auth e gestão de API).
- **Deployment & CI/CD:** Alojado na **Vercel** com integração de pipeline automatizada e variáveis de ambiente encriptadas.
- **Arquitetura:** Padrão de design modular (**Separação de Conceitos**) com pastas dedicadas para lógica, UI e dados.
- **Ambiente:** Desenvolvido num ambiente profissional **Linux (Ubuntu/WSL2)**, utilizando Git para controlo de versões granular.

## 📐 Arquitetura e Modularização

O projeto está estruturado para ser escalável e de fácil manutenção:
- `src/lib`: Configuração centralizada do cliente Supabase e inicialização da API.
- `src/components`: Unidades atómicas de UI e layouts complexos (Dashboard, Login, Modais de Edição).
- `src/hooks`: Lógica de negócio personalizada (ex: `useObraData.js`) separando a manipulação de dados da renderização da UI.
- `src/utils`: Auxiliares matemáticos de alta precisão e formatadores de dados.
- `src/data`: Definições de esquema para as 20+ etapas de construção do PCI.

## 🚀 Conquistas e Roadmap

- [x] **Migração para Nuvem:** Transição bem-sucedida de LocalStorage para PostgreSQL em tempo real.
- [x] **Lógica de Edição:** Implementação total de mutação de dados (Update/Delete) para lançamentos de obra.
- [x] **Autenticação:** Fluxo completo de Login/Registo implementado.
- [ ] **Análise Visual:** Integração de Chart.js para gráficos de projeção de gastos e burn-down.
- [ ] **Suporte PWA:** Acesso offline para estaleiros de obra com baixa conectividade.

---

## 👩‍💻 Sobre o Desenvolvedor

Sou um **Engenheiro de Software** especializado na criação de aplicações reativas e orientadas a dados que resolvem problemas do mundo real. Com foco em ferramentas web de alto desempenho, construo software que é tecnicamente robusto e centrado no utilizador.

---
*Desenvolvido com foco na Excelência em Engenharia por **Fabiano Carbonell da Silva***

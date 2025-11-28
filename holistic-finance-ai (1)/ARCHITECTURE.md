# Holistic Finance AI - Technical Architecture

This comprehensive technical architecture for the "Holistic Finance AI" application leverages the Next.js App Router and Supabase to deliver a secure, scalable, and high-performance financial co-pilot. The design emphasizes server-side security, a hybrid compute model, and a robust data pipeline to support the three core AI differentiation features.

## I. Foundational Architecture: Next.js, Supabase, and Security

The core stack is designed around the principle of isolating sensitive logic and data access to the server environment, using Row-Level Security (RLS) as the primary defense mechanism.

### A. Core Stack Components

| Layer | Technology | Primary Role | Security Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend/App Layer** | **Next.js App Router (Vercel)** | UI rendering, routing, and server-side orchestration. | **Server Components** fetch all sensitive data securely on the server; **Client Components** handle only interactivity. |
| **Backend/Database** | **Supabase (PostgreSQL)** | Persistent storage, user authentication, and real-time triggers. | **Row-Level Security (RLS)** is mandatory on all financial tables (`transactions`, `accounts`, `goals`), ensuring users can only access their own data via `auth.uid()`. |
| **Compute/Logic** | **Supabase Edge Functions (Deno)** | Scheduled jobs, database triggers, and high-performance, low-latency processing (e.g., Tax Optimization). | Secure execution environment independent of the Next.js server, with direct, authorized database access. |
| **Specialized AI** | **Vertex AI / FastAPI** | Scalable hosting for heavy Machine Learning models (Predictive Forecasting). | External, dedicated microservice for complex, resource-intensive computations, accessed via a secure, tokenized API gateway. |

### B. Authentication and Data Isolation

1.  **Authentication Flow:** Supabase Auth is integrated via Next.js Middleware. The middleware verifies the Supabase JWT on every request, ensuring all Server Components and Route Handlers run within an authenticated user context.
2.  **Plaid Integration Security:**
    *   **Token Exchange:** The sensitive Plaid `access_token` is exchanged and received exclusively within a secure Next.js Route Handler.
    *   **Storage:** The `access_token` is stored **encrypted at rest** in the Supabase `accounts` table using the `pgcrypto` extension.
    *   **Webhooks:** Plaid webhooks are received by a dedicated Next.js Route Handler, which uses the **Supabase Service Role Key** to bypass RLS and write new transactions directly to the database, ensuring real-time updates.

## II. Core Financial Engine & Data Flow

The core robo-advisor functions are split between Next.js for real-time display and Supabase for background processing.

### A. Data Model Highlights (Supabase Schema)

The database schema includes critical tables for user isolation and financial tracking:
*   `users`: Stores `premium_status` (for access control) and `risk_profile`.
*   `accounts`: Stores encrypted Plaid tokens and institution metadata, linked by `user_id`.
*   `transactions`: Normalized, categorized transaction history, linked by `user_id`.
*   `investments`: Tracks holdings, cost basis, and asset allocation, crucial for rebalancing and tax optimization.
*   `tax_tracker`: Stores calculated YTD capital gains/losses and deduction summaries.
*   `document_embeddings`: Stores vectorized chunks of user documents (e.g., 401k policies) for the Generative AI RAG system (`pgvector` extension).

### B. Calculation Engine Execution

| Function | Execution Environment | Trigger Mechanism | Output & Purpose |
| :--- | :--- | :--- | :--- |
| **Net Worth Calculation** | Next.js Server Action | User Request (Dashboard Load) | Real-time aggregation of assets and liabilities, leveraging RLS-filtered data. |
| **Automated Rebalancing** | Supabase Edge Function | `pg_cron` (Scheduled Daily/Weekly) | Checks portfolio drift against `user_target_allocation` and generates trade instructions for managed accounts or user notifications for external accounts. |
| **Dividend Reinvestment (DRIP)** | Supabase Edge Function | Database Trigger (`AFTER INSERT` on `transactions`) | Reactive processing of income events, immediately identifying and queuing a purchase for the most underweight asset class. |
| **Behavioral Risk Profiling** | Supabase Edge Function | `pg_cron` (Scheduled Weekly) | Analyzes user transaction history during market volatility to adjust the `risk_profile` based on observed panic-selling behavior. |

## III. Killer Differentiation Features (The AI Stack)

The three advanced features are implemented as specialized, interconnected services that securely consume and generate data within the Supabase ecosystem.

### A. Predictive Cash Flow & Goal Forecasting (Predictive ML)

This feature utilizes an external, dedicated ML microservice for complex time-series analysis.

1.  **Data Pipeline:** A Supabase Edge Function, triggered by `pg_cron`, securely extracts anonymized and aggregated user data (transactions, goals, recurring payments) from Postgres. This data is uploaded to a secure staging bucket (Supabase Storage).
2.  **Model Training:** A Multivariate LSTM Neural Network is trained on the curated data using a managed MLOps platform (e.g., Vertex AI).
3.  **Scenario Modeling (Real-Time Inference):**
    *   The user inputs a "what-if" scenario in the Next.js Client Component.
    *   A Next.js Server Action bundles the user's current state and the hypothetical changes.
    *   The Server Action calls the low-latency **FastAPI Inference API** (hosted on Vertex AI).
    *   The API runs the forecast, incorporating the scenario changes, and calculates the **Goal Probability** (e.g., retirement probability).
    *   The predictive trajectory data is returned to the Server Component for visualization.

### B. Proactive Tax Optimization Engine (Rule-Based System)

This engine is a high-value, rule-based system executed close to the data.

1.  **Real-Time Deduction Maximizer:** New transactions received via Plaid webhooks trigger a Supabase Edge Function. This function runs a rule-set (e.g., "If Category = Travel and Description contains 'Uber' or 'Hotel', flag as potential business deduction") and updates the `tax_tracker` table immediately.
2.  **Tax-Loss Harvesting (TLH):** A scheduled Supabase Edge Function (`pg_cron`, daily) scans the `investments` table. It compares the current market price to the cost basis for all taxable accounts, identifying assets with unrealized losses that meet the TLH criteria (e.g., loss threshold, avoiding wash sales).
3.  **Output:** The engine generates actionable recommendations (e.g., "Sell 100 shares of X to offset Y capital gain") and updates the user's "Tax Health Score" in the `users` table.

### C. Generative AI Financial Coach (NLP)

The conversational interface relies on a secure **Retrieval-Augmented Generation (RAG)** architecture.

1.  **Secure Proxy:** A Next.js Route Handler (`/api/ai/coach`) acts as the secure API gateway. It authenticates the user's JWT and manages the LLM API key (never exposed to the client).
2.  **RAG Orchestration:** Before calling the LLM (e.g., Google Gemini), the Route Handler performs two crucial steps:
    *   **Structured Data Retrieval:** Fetches real-time, personalized data (balances, goals, tax status) from Supabase Postgres, strictly filtered by `auth.uid()`.
    *   **Unstructured Data Retrieval:** Performs a vector similarity search against the `document_embeddings` table (`pgvector`) to retrieve relevant policy or market summary documents.
3.  **Context Injection:** The curated data is injected into a strict **System Prompt** template, defining the AI's expert persona and constraints (e.g., "You are not a licensed tax advisor").
4.  **Streaming:** The LLM response is streamed back through the Route Handler to the Client Component for low-latency chat experience.

## IV. Security, Access Control, and Monetization

The hybrid monetization model requires granular access control enforced at the database layer.

### A. Access Control Matrix

Premium features are gated using the `premium_status` column in the `users` table.

| Feature | Access Level | Enforcement Mechanism |
| :--- | :--- | :--- |
| **Net Worth/Basic Robo** | All Users | RLS Policy: `auth.uid() = user_id` |
| **Predictive ML/Scenario Modeling** | Premium Only | Next.js Server Component Logic: Check `user.premium_status` before calling the external ML API. |
| **Proactive Tax Optimization** | Premium Only | Supabase Edge Function Logic: Filter execution to only run for users where `users.premium_status = 'active'`. |
| **Generative AI Coach** | Premium Only | Next.js Route Handler Logic: Reject request if `user.premium_status != 'active'` before initiating the LLM call. |

### B. Billing System Integration (Stripe)

1.  **Subscription Management:** Stripe is used for handling the flat monthly Premium Planning Fee.
2.  **Webhook Handling:** Stripe webhooks (e.g., `checkout.session.completed`, `customer.subscription.updated`) are sent to a dedicated **Supabase Edge Function**.
3.  **Status Update:** The Edge Function securely updates the `premium_status` field in the Supabase `users` table, ensuring real-time access revocation or granting.
4.  **AUM Fee Tracking:** For assets managed directly by the app, the AUM fee calculation is integrated into the scheduled Rebalancing Edge Function, calculating the fee based on the daily average portfolio value and logging it to a `billing_history` table.

## V. Key Findings and Recommendations

1.  **Security is Server-Side:** The architecture successfully isolates all sensitive operations to the backend, minimizing the attack surface.
2.  **Hybrid Compute Model is Essential:** The three-tiered compute strategy (Next.js, Edge Functions, ML Services) handles the variable complexity of financial tasks effectively.
3.  **RLS is the Foundation:** Supabase Row-Level Security is the non-negotiable layer for data isolation and access control.
4.  **RAG is the AI Bridge:** The Generative AI Coach derives its value from the tight coupling with real-time financial data via RAG.
5.  **Recommendation:** Prioritize implementing and testing RLS policies before adding further features, and establish the MLOps pipeline early to ensure model reliability.

# Enterprise k6 Performance Testing Framework (Restful-Booker API)

This repository showcases a production-grade, decoupled, and highly optimized API Performance Testing Framework built using Grafana k6 in vanilla JavaScript (ES6). Designed around enterprise-tier software engineering principles, this framework completely isolates execution configurations, dynamic data generation, environmental boundaries, and protocol helper layers to ensure frictionless scaling and zero architectural technical debt.

---

## 🏛️ Architectural Highlights

*   **Decoupled Layered Architecture:** Strict separation of concerns between test execution (`src/tests`), dynamic data fabrication (`src/data`), infrastructure routing (`src/config`), performance thresholds (`src/utils`), and endpoint string interpolators (`src/helpers`).
*   **Environment-Agnostic Matrix (`src/config/env.js`):** Completely eliminates hardcoded URLs by dynamically mapping target endpoints (`staging`, `uat`, `production`) at runtime via command-line injection (`__ENV.TARGET_ENV`).
*   **Anti-Caching Dynamic Data Engine (`src/data/booking.payload.js`):** A zero-dependency payload factory that programmatically randomizes names, mathematical prices, and timeline check-in dates on every distinct loop iteration. This prevents downstream database proxy or memory caching from skewing telemetry accuracy.
*   **State-Locked End-to-End CRUD Chaining:** Simulates authentic user lifecycles by chaining related transactions sequentially: `POST (Create Booking)` ➔ `GET (Read Verification)` ➔ `PUT (Update via Auth Cookie)` ➔ `DELETE (Data Teardown)`. This tests complex state persistence under high stress while maintaining automated data cleanup.
*   **High-Cardinality Metrics Management:** Employs explicit k6 URL name tagging (`tags: { name: '/booking/:id' }`) across dynamic lifecycle endpoints. This prevents memory blooms and guarantees lightweight execution profiles on resource-constrained CI agents.
*   **Open-Loop Traffic Injection:** Utilizes the modern k6 `ramping-arrival-rate` executor with an expanded thread pool (`maxVUs: 300`) to guarantee exact, predictable real-world request volume injection (RPS) independent of target system degradation, completely eliminating Coordinated Omission.
*   **Dual-Stream End-of-Test Telemetry (`src/utils/reporter.js`):** Leverages the native `handleSummary` lifecycle hook to dynamically bifurcate metrics. It preserves clean text logging for standard output (`stdout`) inside pipelines while simultaneously compiling responsive, browser-ready local HTML visual dashboards via a fully offline, vendored reporting core.
*   **Automated CI/CD Quality Gate:** Pre-configured with GitHub Actions to execute smoke regressions on every code check-in, automatically failing pipeline builds if strict performance SLAs are breached and archiving visual HTML reports as downloadable build artifacts.

---

## 📂 Directory Structure

├── .github/workflows/
│   └── perf-test.yml          # CI/CD Automation Pipeline (Quality Gate)
├── reports/                   # Dynamic Local HTML Visual Telemetry (Git Ignored)
│   ├── crud-local.html
│   ├── load-local.html
│   └── smoke-local.html
├── src/
│   ├── config/
│   │   ├── config.js          # Standard scenario options & execution profiles [Modified]
│   │   └── env.js             # Runtime environment boundary target matrix [Untracked]
│   ├── data/
│   │   ├── booking.payload.js # Dynamic payload fabrication layers (Anti-Caching) [Untracked]
│   │   └── payloads.js        # Static backup payload schemas (DRY-compliant)
│   ├── helpers/
│   │   ├── bookingClient.js   # Protocol interaction abstractions
│   │   └── urlHelper.js       # Dynamic URL string interpolators
│   ├── tests/
│   │   ├── booking.test.js    # End-to-end dynamic CRUD transaction suite [Untracked]
│   │   ├── load.test.js       # High-stress open-loop performance suite [Modified]
│   │   └── smoke.test.js      # Baseline microservice stability regression script [Modified]
│   └── utils/
│       ├── bundle.js          # Vendored HTML Reporting Engine [Untracked]
│       ├── reporter.js        # Dual-stream k6 HTML reporting abstractor [Untracked]
│       └── thresholds.js      # Pure performance SLA guardrails
├── .gitignore                 # Git ignore mapping (Isolates local report files) [Modified]
├── package.json               # Project descriptive metadata and script runner shortcuts [Modified]
└── README.md                  # Elite engineering overview documentation [Modified]

---

## 📊 Verified Test Performance Results

The framework was executed against an optimized open-loop load profile to analyze system concurrency limits under stress.

### Execution Summary
*   **Target Volume:** Up to 30.00 iterations/sec over 60 seconds.
*   **Total Operations Injected:** **3,915 HTTP requests** processed with **0.00% network errors**.
*   **Assertion Density:** **14,355 validation checks** passed successfully (100% data integrity).
*   **Response Time SLAs:** 95% of all transactions resolved in under **242.91ms** (`p(95) < 500ms` threshold satisfied).

### Dynamic Resource Scaling & Pacing Control
By extending the runtime allocation pool (`maxVUs: 300`), the framework successfully demonstrated elastic scaling:
*   The k6 engine dynamically scaled its internal thread pool to a peak of **54 concurrent Virtual Users** to offset the 1.73s backend transaction processing latency.
*   Dropped iterations during the early aggressive ramp-up stages were slashed by **over 52%** compared to restricted closed-loop constraints.
*   The system successfully hit a sustained processing speed of **64.29 requests per second** while maintaining strict schema validations with zero resource warnings.

---

## 🚀 Getting Started

### 1. Prerequisites
Install the native k6 binary on your local machine:
```bash
# Windows (via Chocolatey)
choco install k6

# macOS (via Homebrew)
brew install k6
```

### 2. Workspace Initialization
Clone the repository and initialize the required telemetry directories before executing your first test run:
```bash
npm run setup
```

### 3. Execute Performance Suites Locally
Leverage the standardized npm automation shortcuts to target specific execution scripts:
```bash
# Run baseline microservice stability regressions
npm run test:smoke

# Stress the API using the enterprise open-loop arrival rate model
npm run test:load

# Execute the complete dynamic CRUD transactional lifecycle sequence
npm run test:crud
```

### 4. Review Telemetry Outputs
*   **Terminal Logs:** Standard structured JSON telemetry prints to the console at the end of execution.
*   **Visual Reports:** Open the newly generated local HTML dashboard at `reports/{TEST_NAME}.html` in any browser to view interactive latency percentiles (p90, p95, p99), success trends, and throughput charts.

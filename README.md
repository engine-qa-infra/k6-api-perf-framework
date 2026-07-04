📄 Enterprise k6 Performance Testing Framework (Restful-Booker API)
This repository showcases a production-grade, decoupled, and highly optimized API Performance Testing Framework built using Grafana k6 in vanilla JavaScript (ES6).
Designed around enterprise-tier software engineering principles, this framework completely isolates execution configurations, dynamic data generation, and protocol helper layers to ensure frictionless scaling and zero architectural technical debt.

🏛️ Architectural Highlights
    • Decoupled Layered Architecture: Strict separation of concerns between test execution (src/tests), dynamic data fabrication (src/data), infrastructure configuration (src/config), and protocol string helpers (src/helpers).
    • Zero-Auth Frictionless Evaluation: Built against the public Restful-Booker microservices ecosystem. This enables prospective clients, engineering managers, and CI/CD runners to clone and execute the entire performance suite instantly without configuring static API tokens or cloud credentials.
    • Advanced Transaction Chaining: Demonstrates advanced multi-threaded state management by sequentially chaining mutations (Auth Token Generation ➔ Create Booking ➔ Update Booking) across high-concurrency Virtual User (VU) cycles without race conditions or data collisions.
    • Open-Loop Traffic Injection: Utilizes the modern k6 ramping-arrival-rate executor to guarantee exact, predictable real-world request volume injection (RPS) independent of target system degradation or backend response latency.
    • Automated CI/CD Quality Gate: Pre-configured with GitHub Actions to execute smoke regressions on every code check-in, automatically failing pipeline builds if strict performance SLAs are breached.

📂 Directory Structure
├── .github/workflows/   # CI/CD Automation Pipelines (GitHub Actions Quality Gates)
└── src/
    ├── config/          # Execution profiles (Smoke, Open-Loop Load, Stress configurations)
    ├── data/            # Dynamic payload fabrication layers (DRY-compliant generation)
    ├── helpers/         # Protocol and endpoint URL string interpolators
    ├── utils/           # Pure, decoupled performance thresholds (SLA guardrails)
    └── tests/           # Clean, declarative, high-throughput test scripts

### 📈 Verified Test Performance Results

The framework was executed against an optimized open-loop load profile to analyze system concurrency limits under stress.

#### Execution Summary
*   **Target Target Volume**: Up to 30.00 iterations/sec over 60 seconds.
*   **Total Operations Injected**: **3,915 HTTP requests** processed with **0.00% network errors**.
*   **Assertion Density**: **14,355 validation checks** passed successfully (100% data integrity).
*   **Response Time SLAs**: 95% of all transactions resolved in under **242.91ms** (`p(95) < 500ms` threshold satisfied).

#### Dynamic Resource Scaling & Pacing Control
By extending the runtime allocation pool (`maxVUs: 150`), the framework successfully demonstrated elastic scaling:
*   The k6 engine dynamically scaled its internal thread pool to a peak of **54 concurrent Virtual Users** to offset the 1.73s backend transaction processing latency.
*   Dropped iterations during the early aggressive ramp-up stages were slashed by **over 52%** compared to restricted closed-loop constraints.
*   The system successfully hit a sustained processing speed of **64.29 requests per second** while maintaining strict schema validations.


🚀 Getting Started
1. Prerequisites
Install the native k6 binary on your local machine:
# Windows (via Chocolatey)
choco install k6

# macOS (via Homebrew)
brew install k6
2. Execute Performance Suites
Run these terminal commands from the root directory of the repository:
# Verify baseline API stability and functional accuracy (1 VU)
k6 run src/tests/smoke.test.js

# Stress the API using the enterprise open-loop arrival rate model
k6 run src/tests/load.test.js

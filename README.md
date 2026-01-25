# zpi2025-zaoczni-orange

## 🚀 Project Overview

This project is a modern web application built with **React 19** and **TypeScript**, using **Vite** as the build tool. It focuses on high performance, type safety, and a robust testing environment.

---

## 🛠 Technology Stack

### Core Technologies

- **Framework:** React 19.2.0
- **Language:** TypeScript 5.9.3
- **Build Tool:** Vite 7.2.4
- **Styling:** Tailwind CSS 3.4.1 (with PostCSS & Autoprefixer)
- **Icons:** Lucide React

### Key Dependencies

- `react-csv`: Exporting data to CSV files.
- `prop-types`: Runtime type validation.

### Development & Quality Assurance

- **Unit Testing:** Jest & React Testing Library
- **E2E Testing:** Playwright
- **Linting & Formatting:** ESLint 9 & Prettier
- **Automation:** Husky & lint-staged (Git hooks for code quality)

---

## 📦 Getting Started & Deployment

### Local Development

To run the project locally, ensure you have **Node.js** installed:

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the development server:**
    ```bash
    npm run dev
    ```
3.  **Build the project:**
    ```bash
    npm run build
    ```

### Production & Deployment

The application is **containerized** (Docker) and deployed on an external **OVH VPS server**.

- **Deployment Method:** Container-based deployment.
- **Infrastructure:** OVH VPS.

---

## 📂 Project Structure & Documentation

- **Project Documentation:** All technical documents are located in the `📂 /docs` folder.
- **Test & Acceptance Reports:** Detailed reports regarding software testing and bug fixing procedures are located in:
  `📂 /docs/test-reports/`

---

## 📋 Backlog & Task Management

We utilize a comprehensive approach to project tracking:

- **Issues & Backlog:** [GitHub Issues](https://github.com/IIS-ZPI/ZPI2025_zaoczni_Orange/issues)
- **Project Board:** [Project Management Dashboard](https://github.com/orgs/IIS-ZPI/projects/29/views/1)
- **Planning:** All project management including Roadmap (Gantt charts) and Backlog (Kanban) is managed through the GitHub Project Board above.

---

## ⚙️ CI/CD Pipeline

The project utilizes **GitHub Actions** for continuous integration and continuous delivery.

### Pull Request Validation (`Pull Request Check`)

Triggered on pull requests to `main`, `develop`, and `release` branches.

- **Linting:** ESLint code quality checks
- **Unit Testing:** Jest tests with coverage reports
- **E2E Testing:** Playwright tests with artifact upload (30-day retention)
- **Build:** Production build verification

### Release and Deployment (`Release - Build & Push`)

Triggered automatically upon pushing to the `release` branch.

- **Quality Gate:** Full linting, unit tests, and E2E tests
- **Automated Versioning:** Version calculation and Git tag creation
- **GitHub Release:** Automated release notes generation
- **Dockerization:** Production Docker image build and push to GHCR
- **Deployment:** SSH-based deployment to OVH VPS

---

## 🧪 Test Automation

### Testing Framework

- **Unit Testing:** Jest with ts-jest preset
    - **Environment:** jsdom for DOM testing
    - **Coverage:** Built-in coverage reporting
    - **Configuration:** `jest.config.js`
    - **Setup:** Testing Library React with custom setup file

- **E2E Testing:** Playwright
    - **Browser Support:** Chromium, Firefox, WebKit
    - **Configuration:** `playwright.config.ts`
    - **Reports:** HTML reports with screenshots
    - **Test Directory:** `tests/e2e/`

### Test Structure

- **Unit Tests:** Located in `tests/` directory
    - `App.test.tsx` - Application component tests
    - `changeDistribution.test.ts` - Distribution analysis tests
    - `statisticalMeasures.test.ts` - Statistical calculations tests
    - `utils.test.ts` - Utility functions tests

- **E2E Tests:** Located in `tests/e2e/`
    - Cross-browser compatibility

### Pre-commit Quality Gates

- **Husky:** Git hooks for automated checks
- **lint-staged:** Staged files linting and formatting
- **ESLint:** TypeScript/JavaScript code quality
- **Prettier:** Code formatting consistency

### Running Tests

```bash
# Unit tests
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage

# E2E tests
npm run test:e2e          # Headless mode
npm run test:e2e:ui       # Interactive UI
npm run test:e2e:debug    # Debug mode
npm run test:e2e:report   # View last report

# Code quality
npm run lint              # Check linting
npm run lint:fix          # Auto-fix issues
npm run format            # Format code
npm run typecheck         # TypeScript check
```

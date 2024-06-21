# Quotus Technical Test

Welcome to the Quotus Technical Test! This project is designed to assess your creativity and ability to create a visually appealing and user-friendly interface using React. Your task is to transform the existing unstyled landing page into a modern, aesthetically pleasing UI that demonstrates your design skills and attention to UX. You do not have to connect to an API or implement any backend functionality. The focus is on the frontend design and implementation.

## Getting Started

### Prerequisites

- **Yarn**: Please use Yarn as the package manager for this project. If you don't have Yarn installed, you can install it from [Yarn Installation](https://classic.yarnpkg.com/en/docs/install).

### Installation

1. **Fork the repository**:

   - Fork this repository to your own GitHub account by clicking the "Fork" button at the top right of this page.

2. **Clone the repository**:

   ```bash
   git clone <your-forked-repository-url>
   cd <repository-directory>
   ```

3. **Install dependencies**:

   ```bash
   yarn install
   ```

4. **Create a new branch**:

   ```bash
   git checkout -b <branch-name>
   ```

5. **Start the development server**:
   ```bash
    yarn dev
   ```

<!-- Dependencies -->

This project uses the following dependencies:

```json
{
  "@chakra-ui/icons": "^2.1.1",
  "@chakra-ui/next-js": "^2.2.0",
  "@chakra-ui/react": "^2.8.2",
  "@emotion/react": "^11.11.4",
  "@emotion/styled": "^11.11.5",
  "@next/font": "14.2.4",
  "@types/node": "20.14.6",
  "@types/react": "18.3.3",
  "@types/react-dom": "18.3.0",
  "@types/react-no-ssr": "^1.1.7",
  "@types/react-table": "^7.7.20",
  "@typescript-eslint/parser": "^5.0.1",
  "chart.js": "^4.4.3",
  "eslint": "^8.52.0",
  "eslint-config-next": "14.2.4",
  "framer-motion": "^11.2.11",
  "next": "14.2.4",
  "prettier": "^3.1.0",
  "prettier-eslint": "^16.1.2",
  "react": "18.3.1",
  "react-chartjs-2": "^5.2.0",
  "react-dom": "18.3.1",
  "react-no-ssr": "^1.1.0",
  "react-select": "^5.8.0",
  "react-table": "^7.8.0",
  "typescript": "^4.4.4"
}
```

## Introduction

You will find an unstyled landing page in the `index.tsx` file. The current setup includes a table, selectors, and charts as examples. These are implemented using `react-select`, `react-table`, and `chart.js` (with `react-chartjs-2`). The goal is to style this page and make it visually appealing.

## Creativity

You have full freedom over the design and implementation. Feel free to use the existing libraries or any other library or dependency you prefer. The key is to demonstrate your ability to create a modern and beautiful UI.

## Functionality

The data provided in the application is mock data that replicates real data. You are not required to connect to any API.

## Code Organization

While creativity is the main focus, the organization of your code will also be considered. Make sure your code is clean and maintainable.

## Graph, Table, and Selects

The existing components (graphs, tables, selects) are there as examples. You can choose to use them or replace them with your own implementations.


## Git Workflow

### Branching

Create a new branch for your work. This helps in keeping the main branch clean and allows for easier code reviews.

```bash
git checkout -b <your-branch-name>
```

### Commits
Make sure to commit your changes regularly with meaningful commit messages.
```bash
git add .
git commit -m "meaningful commit message"
```

### Pushing
Push your branch to the remote repository.
```bash
git push origin <your-branch-name>
```

### Pull Requests
Once you are done with your work, create a pull request to merge your branch into the dev branch. You can provide a description of the changes you made in the pull request and of your creative choices and porcess.
1. Go to the repository on GitHub.
2. Click on the "Pull Requests" tab.
3. Click on the "New Pull Request" button.
4. Select the base branch as `dev` and the compare branch as your branch.
5. Click on the "Create Pull Request" button.

### Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Chakra UI Documentation](https://chakra-ui.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [React Chart.js 2 Documentation](https://react-chartjs-2.js.org/)
- [React Select Documentation](https://react-select.com/home)
- [React Table Documentation](https://react-table.tanstack.com/docs/overview)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)
- [ESLint Documentation](https://eslint.org/docs/user-guide)



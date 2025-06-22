# React TypeScript CRUD Application

A modern, responsive product management application built with React, TypeScript, Vite, Redux Toolkit, and Tailwind CSS.

## ✨ Features

### CRUD Operations
- **Create**: Add new products with comprehensive form validation
- **Read**: View products in a responsive grid layout with detailed view modal
- **Update**: Edit existing products with pre-populated forms
- **Delete**: Remove products with confirmation dialogs

### Advanced Functionality
- 🔍 **Search & Filter**: Filter products by category, stock status, and search terms
- 📊 **Sorting**: Sort products by name, price, category, creation date, or stock status
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ⚡ **Loading States**: Visual feedback during API operations
- 🔔 **Notifications**: Success and error notifications for user actions
- ✅ **Form Validation**: Comprehensive input validation with error messages

### Data Management
- Mock API service that simulates backend interactions
- Local state management with Redux Toolkit
- TypeScript interfaces for type safety
- Mock data with 5+ fields per product

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 6.3.5
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with PostCSS
- **Testing**: Jest with React Testing Library
- **Linting**: ESLint with TypeScript rules
- **Type Safety**: TypeScript with strict configuration

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Tayanchonk/reactjs-coding-agent-demo.git
cd reactjs-coding-agent-demo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Product/        # Product-related components
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProductForm.tsx
│   │   ├── ProductDetails.tsx
│   │   └── ProductFilters.tsx
│   ├── UI/             # Reusable UI components
│   │   ├── Notification.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ConfirmationModal.tsx
│   └── Layout/         # Layout components
├── store/              # Redux store and slices
│   ├── index.ts
│   └── productsSlice.ts
├── services/           # API services
│   └── productApi.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── helpers.ts
├── hooks/              # Custom React hooks
│   └── redux.ts
├── __tests__/          # Unit tests
│   ├── ProductCard.test.tsx
│   ├── productApi.test.ts
│   └── helpers.test.ts
└── test/               # Test configuration
    └── setup.ts
```

## 🧪 Testing

The application includes comprehensive unit tests for:

- **API Service**: Tests for all CRUD operations
- **Utility Functions**: Tests for helper functions
- **React Components**: Tests for component rendering and behavior

Run tests with:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🔧 Configuration

### TypeScript
- Strict mode enabled
- Module verbatim syntax for better imports
- Bundler module resolution

### Tailwind CSS
- Configured with PostCSS
- Tailwind Forms plugin for better form styling
- Responsive design utilities

### Redux Toolkit
- Async thunks for API operations
- Immutable state updates
- TypeScript integration

## 📱 Usage

### Adding a Product
1. Click the "Add New Product" button
2. Fill in the product information
3. Click "Create Product" to save

### Editing a Product
1. Click the "Edit" button on any product card
2. Modify the product information
3. Click "Update Product" to save changes

### Deleting a Product
1. Click the "Delete" button on any product card
2. Confirm the deletion in the dialog

### Filtering and Searching
1. Use the search bar to find products by name or description
2. Filter by category using the dropdown
3. Filter by stock status
4. Sort products by various criteria

## 🎨 Design Features

- **Clean Interface**: Modern, minimalist design
- **Consistent Colors**: Blue accent color throughout
- **Responsive Grid**: Adapts to different screen sizes
- **Visual Feedback**: Loading states and hover effects
- **Accessibility**: ARIA labels and semantic HTML

## 🔒 Type Safety

The application is built with TypeScript and includes:
- Strong typing for all data structures
- Type-safe Redux store
- Validated form inputs
- API response typing

## 📊 Performance

- **Code Splitting**: Vite-powered bundling
- **Tree Shaking**: Unused code elimination
- **CSS Optimization**: Tailwind CSS purging
- **Development Speed**: Hot module replacement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the linter and tests
6. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

# College Application Portal

A comprehensive React-based college application portal that helps students submit and track their applications with an integrated AI assistant.

## 🚀 Features

### Core Features
- **Multi-step Application Form** with progress tracking
- **Document Upload** for transcripts/certificates (PDF only)
- **AI Chatbot Assistant** with markdown support
- **Video Tutorial Component** with progress tracking and note-taking
- **Application Preview Mode** for reviewing submissions
- **Search Functionality** across applications and content
- **Draft Saving** with localStorage persistence

### Extra Features
- **Dark/Light Mode Toggle** with system preference detection
- **Accessibility Implementation** with ARIA labels and keyboard navigation
- **Responsive Design** for mobile and desktop
- **TypeScript** for type safety
- **Unit Tests** with Vitest

## 🛠 Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Markdown** for chat message rendering
- **Lucide React** for icons
- **Vitest** for testing
- **Custom Hooks** for state management

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── ApplicationForm.tsx
│   ├── Chatbot.tsx
│   ├── VideoTutorial.tsx
│   ├── ApplicationPreview.tsx
│   ├── SearchComponent.tsx
│   └── Header.tsx
├── hooks/               # Custom React hooks
│   ├── useTheme.ts
│   ├── useApplicationDraft.ts
│   └── useChat.ts
├── pages/               # Page components
│   ├── Dashboard.tsx
│   ├── ApplicationsPage.tsx
│   └── TutorialsPage.tsx
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── test/                # Unit tests
└── styles/              # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd college-application-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

## 🎯 Key Components

### Application Form
- Multi-step form with validation
- Progress tracking and completion percentage
- Document upload with file type validation
- Draft saving functionality
- Responsive design

### AI Chatbot
- Contextual help for college applications
- Markdown support for rich responses
- Typing indicator and message history
- Minimizable chat window
- Accessibility features

### Video Tutorial System
- Custom video player with controls
- Interactive transcript with clickable segments
- Note-taking functionality with timestamps
- Progress tracking
- Full-screen support

### Application Preview
- Read-only view of completed applications
- Section-based navigation
- Download and sharing capabilities
- Status indicators
- Responsive layout

### Search Component
- Global search across applications and content
- Filter by type and status
- Sort by relevance, date, or name
- Keyboard shortcuts
- Search result highlighting

## 🎨 Design System

### Theme Support
- Light and dark mode
- System preference detection
- Persistent user preference
- Smooth transitions

### Color Palette
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)
- Neutral: Gray scale

### Responsive Breakpoints
- Mobile: 640px and below
- Tablet: 768px - 1023px
- Desktop: 1024px and above

## ♿ Accessibility Features

- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators
- Semantic HTML structure

## 🧪 Testing

The project includes comprehensive unit tests for:
- Custom hooks (`useTheme`, `useApplicationDraft`, `useChat`)
- Component functionality
- State management
- Error handling

Run tests with:
```bash
npm run test
```

## 📱 Mobile Features

- Touch-friendly interface
- Responsive navigation
- Optimized form layouts
- Mobile-specific interactions
- Progressive Web App capabilities

## 🔮 Future Enhancements

- Real AI integration (OpenAI/Claude API)
- Email notifications
- Calendar integration
- Document scanning with OCR
- Multi-language support
- Advanced analytics dashboard
- Integration with Common App
- Push notifications

## 🐛 Known Issues

- Video player requires actual video files
- Chat responses are mock data
- File uploads are simulated (no backend)
- No real authentication system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed description

---

Built with ❤️ for students pursuing higher education.
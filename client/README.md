# AI-Powered Developer Portfolio

A modern, conversational AI portfolio built with React, TypeScript, and Tailwind CSS. Features a beautiful landing page and an interactive chatbot interface that can answer questions about the developer's experience, projects, and skills.

## 🚀 Features

- **Interactive Chat Interface**: Real-time conversation with AI assistant
- **Dark/Light Theme**: Toggle between themes with persistent preferences
- **Responsive Design**: Mobile-first approach with modern UI
- **Smooth Animations**: Framer Motion powered transitions
- **Typewriter Effect**: Animated text for engaging user experience
- **Message History**: Persistent chat history with timestamps
- **Typing Indicators**: Visual feedback during AI responses

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Build Tool**: Vite
- **Typewriter**: react-simple-typewriter

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ChatInterface.tsx    # Main chatbot component
│   │   ├── LandingPage.tsx      # Landing page with hero section
│   │   ├── HeaderWidget.tsx     # Social media links
│   │   └── EmojiGrid.tsx        # Navigation grid
│   ├── contexts/
│   │   └── ThemeContext.tsx     # Theme management
│   ├── services/
│   │   └── portfolioData.ts     # Portfolio data and AI responses
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Entry point
```

## 🎨 Design Features

- **Glassmorphism**: Beautiful backdrop blur effects
- **Gradient Design**: Purple to pink gradients for modern look
- **Smooth Transitions**: Animated component transitions
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Mobile Responsive**: Optimized for all screen sizes

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   cd client
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 🤖 AI Integration

The chatbot currently uses a mock response system based on structured portfolio data. The AI can answer questions about:

- **Projects**: Recent work and technologies used
- **Skills**: Technical expertise and proficiency levels
- **Experience**: Career background and achievements
- **Contact**: How to reach out and connect

## 🎯 Key Components

### ChatInterface
- Real-time message handling
- Typing indicators
- Message history with timestamps
- Theme-aware styling
- Responsive design

### LandingPage
- Hero section with typewriter effect
- Call-to-action for chatbot
- Social media integration
- Smooth animations

### ThemeContext
- Dark/light theme management
- Persistent theme preferences
- System theme detection

## 🔧 Customization

### Update Portfolio Data
Edit `src/services/portfolioData.ts` to customize:
- Personal information
- Project details
- Skills and experience
- Contact information

### Modify AI Responses
Update the `generateResponse` function to customize how the AI responds to different types of questions.

### Styling
All styling is done with Tailwind CSS classes. Modify the classes in components to change the appearance.

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Flexible layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🔮 Future Enhancements

- [ ] Real AI integration (Mistral-7B-Instruct)
- [ ] Message persistence
- [ ] File upload capabilities
- [ ] Voice interaction
- [ ] Multi-language support
- [ ] Advanced analytics

## 📄 License

MIT License - feel free to use this project as a template for your own AI portfolio!

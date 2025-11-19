export const QUICK_ACTIONS = [
  {
    icon: "user",
    label: "Me",
    question: "Tell me about yourself",
  },
  {
    icon: "briefcase",
    label: "Projects",
    question: "What projects have you worked on?",
  },
  {
    icon: "star",
    label: "Skills",
    question: "What are your technical skills and expertise?",
  },
  {
    icon: "layers",
    label: "Experience",
    question: "What's your work experience?",
  },
  {
    icon: "sparkles",
    label: "Fun",
    question: "What do you do for fun and hobbies?",
  },
  {
    icon: "message-circle",
    label: "Contact",
    question: "How can I contact you?",
  },
] as const;

export const HOME_ANIMATIONS = {
  header: {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
  main: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.1 },
  },
  title: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.2 },
  },
  avatar: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 1, delay: 0.4 },
  },
  input: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.6 },
  },
  bottomNav: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
} as const;

export const HOME_CONFIG = {
  headerDelay: 1000,
  bottomNavDelay: 1500,
  placeholder: "Ask me anything — projects, skills, or AI insights!",
} as const;

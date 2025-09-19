export interface ChatInteraction {
  id: string;
  question: string;
  response: string;
  timestamp: Date;
  isLoading?: boolean;
  structured?: any;
}

export interface ChatProps {
  onBackToHome: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  initialQuery?: string;
}

export interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

export interface ResponseRendererProps {
  interaction: ChatInteraction;
}

export interface ChatHeaderProps {
  onBackToHome: () => void;
}

export interface HomeProps {
  onSwitchToChat: (query?: string) => void;
}

export interface HomeHeaderProps {
  showHeader: boolean;
  onModalStateChange: (isOpen: boolean) => void;
}

export interface HomeInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export interface HomeBottomNavProps {
  showBottomNav: boolean;
  isModalOpen: boolean;
  onActionClick: (question: string) => void;
}

export interface QuickAction {
  icon: string | React.ReactNode;
  label: string;
  question: string;
}

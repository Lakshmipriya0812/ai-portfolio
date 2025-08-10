interface EmojiGridProps {
  onChatClick?: () => void;
}

const emojis = [
  { label: "Me", emoji: "👩‍💻", action: "about" },
  { label: "Projects", emoji: "📁", action: "projects" },
  { label: "Skills", emoji: "🛠️", action: "skills" },
  { label: "Experience", emoji: "📈", action: "experience" },
  { label: "Chat", emoji: "🤖", action: "chat" },
  { label: "Contact", emoji: "📬", action: "contact" },
];

const EmojiGrid = ({ onChatClick }: EmojiGridProps) => {
  const handleClick = (action: string) => {
    if (action === 'chat' && onChatClick) {
      onChatClick();
    }
    // For other actions, you can add more functionality later
  };

  return (
    <>
      {emojis.map((item, idx) => (
        <div
          key={idx}
          className="bg-gray-200/20 backdrop-blur-sm text-black rounded-xl px-4 py-6 text-center shadow-md hover:scale-105 transition border border-gray-300/30 cursor-pointer"
          onClick={() => handleClick(item.action)}
        >
          <div className="text-3xl">{item.emoji}</div>
          <div className="mt-2 text-sm">{item.label}</div>
        </div>
      ))}
    </>
  );
};

export default EmojiGrid;

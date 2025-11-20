import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m here to help you with your college application. What questions do you have?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([{
      id: '1',
      content: 'Hello! I\'m here to help you with your college application. What questions do you have?',
      isUser: false,
      timestamp: new Date(),
    }]);
  }, []);

  return {
    messages,
    sendMessage,
    clearChat,
    isTyping,
  };
};

// Simple AI response generator (replace with actual AI integration)
function generateAIResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes('essay') || message.includes('personal statement')) {
    return `Great question about essays! Here are some tips for writing compelling personal statements:

**Structure your essay:**
- Start with a compelling hook
- Tell a specific story that shows growth
- Connect your experiences to your goals
- End with what you'll contribute to the college

**Key tips:**
- Be authentic and personal
- Show, don't just tell
- Proofread carefully
- Stay within word limits

Would you like help with any specific part of your essay?`;
  }
  
  if (message.includes('gpa') || message.includes('grades')) {
    return `GPA is important, but it's not everything! Here's what you should know:

**If your GPA is strong:**
- Highlight it prominently in your application
- Include relevant coursework and honors

**If your GPA needs context:**
- Explain any circumstances that affected your grades
- Show improvement over time
- Emphasize other strengths like extracurriculars or test scores

Remember, colleges look at the whole picture, not just numbers!`;
  }
  
  if (message.includes('deadline') || message.includes('when')) {
    return `Application deadlines are crucial! Here's what you need to know:

**Common deadline types:**
- **Early Decision/Action:** Usually November 1-15
- **Regular Decision:** Usually January 1-15
- **Rolling Admissions:** Varies by school

**Tips:**
- Submit at least a week before the deadline
- Check each school's specific requirements
- Don't wait until the last minute
- Consider time zones if submitting online

Would you like help creating a deadline calendar?`;
  }
  
  return `I understand you're asking about "${userMessage}". Here are some general tips for college applications:

- **Start early** - Give yourself plenty of time
- **Be authentic** - Show who you really are
- **Proofread everything** - Small errors can make a big impact
- **Follow instructions carefully** - Each school has specific requirements
- **Ask for help** - Teachers, counselors, and family can provide valuable feedback

Is there a specific aspect of your application you'd like to focus on?`;
}
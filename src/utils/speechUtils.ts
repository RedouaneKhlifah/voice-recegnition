export const speak = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US"; // Set language to English
    window.speechSynthesis.speak(speech);
  };
  
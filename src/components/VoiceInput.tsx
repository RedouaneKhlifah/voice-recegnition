import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

interface VoiceInputProps {
  onVoiceDetected: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceDetected }) => {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);

  // Check if the SpeechRecognition API is available
  useEffect(() => {
    if (window.SpeechRecognition || (window as any).webkitSpeechRecognition) {
      console.log("SpeechRecognition API is available!");
    } else {
      console.error("SpeechRecognition API is not supported in this browser.");
    }
  }, []);



  // Log transcript
  useEffect(() => {
    console.log("Current Transcript:", transcript);
  }, [transcript]);

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      console.log("Stopped listening...");
    } else {
      SpeechRecognition.startListening({ continuous: true });
      console.log("Started listening...");
    }
    setIsListening(!isListening);
  };

  // Trigger the voice detection callback when transcript changes
  useEffect(() => {
    if (transcript) {
      console.log("Voice Detected:", transcript);
      onVoiceDetected(transcript);
      resetTranscript();
    }
  }, [transcript, onVoiceDetected, resetTranscript]);

  return (
    <div>
      <button onClick={toggleListening}>
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>
      <p>{transcript}</p> {/* Display transcript */}
    </div>
  );
};

export default VoiceInput;

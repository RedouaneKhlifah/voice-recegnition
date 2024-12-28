import React, { useState, useEffect, useCallback } from 'react';

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ar-MA'; // Set the default language (change to 'ar-MA' or 'fr-FR' as needed)

      recognition.onstart = () => {
        setListening(true);
        setError('');
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.onerror = (event) => {
        setError(`Error: ${event.error}`);
        setListening(false);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
      
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
      
        setTranscript(finalTranscript); // Set final transcript
      };

      setRecognition(recognition);
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
      } catch (err) {
        console.error('Recognition error:', err);
        setError('Failed to start recognition');
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (err) {
        console.error('Stop error:', err);
      }
    }
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError('');
  }, []);

  const browserSupportsSpeechRecognition = typeof window !== 'undefined' && 
    'webkitSpeechRecognition' in window;

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    error
  };
};

// Function to read the transcript aloud using SpeechSynthesis API
const speakText = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-MA'; // Set language for the speech
  window.speechSynthesis.speak(utterance);
};

const SpeechRecognitionComponent = () => {
  const {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    error
  } = useSpeechRecognition();

  // Speak the transcript aloud whenever it updates
  useEffect(() => {
    if (transcript) {
      speakText(transcript); // Read the transcript aloud
    }
  }, [transcript]); // Trigger whenever transcript updates

  if (!browserSupportsSpeechRecognition) {
    return <div className="p-4 text-red-500">Browser doesn't support speech recognition.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <p className="text-lg">
        Microphone: <span className={listening ? "text-green-500" : "text-red-500"}>
          {listening ? "on" : "off"}
        </span>
      </p>
      
      {error && (
        <p className="text-red-500">{error}</p>
      )}

      <div className="space-x-2">
        <button
          onClick={startListening}
          disabled={listening}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          Start
        </button>
        
        <button
          onClick={stopListening}
          disabled={!listening}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:bg-gray-400"
        >
          Stop
        </button>
        
        <button
          onClick={resetTranscript}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded min-h-24">
        <p className="whitespace-pre-wrap">{transcript || 'Waiting for speech...'}</p>
      </div>

      <div className="text-sm text-gray-600">
        <p>Tips:</p>
        <ul className="list-disc pl-5">
          <li>Make sure your microphone is properly connected and allowed in browser permissions</li>
          <li>Speak clearly and at a normal pace</li>
          <li>Try speaking in English as that's the default language setting</li>
        </ul>
      </div>
    </div>
  );
};

export default SpeechRecognitionComponent;

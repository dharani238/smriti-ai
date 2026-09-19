import { useState } from "react";
import {
  Mic,
  MicOff,
} from "lucide-react";

interface VoiceButtonProps {
  onText: (text: string) => void;
  languageCode?: string;
}

function VoiceButton({
  onText,
  languageCode = "en-IN",
}: VoiceButtonProps) {
  const [
    listening,
    setListening,
  ] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      (window as any)
        .SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Chrome or type your question."
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    /*
     * IMPORTANT:
     * Use the language selected
     * in the SMRITI Companion.
     *
     * Examples:
     * English   -> en-IN
     * Assamese  -> as-IN
     * Hindi     -> hi-IN
     * Bengali   -> bn-IN
     */
    recognition.lang =
      languageCode;

    recognition.continuous =
      false;

    recognition.interimResults =
      false;

    recognition.maxAlternatives =
      1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (
      event: any
    ) => {
      const transcript =
        event?.results?.[0]?.[0]
          ?.transcript;

      if (
        transcript &&
        transcript.trim()
      ) {
        onText(
          transcript.trim()
        );
      }

      setListening(false);
    };

    recognition.onerror = (
      event: any
    ) => {
      console.error(
        "Speech recognition error:",
        event?.error
      );

      setListening(false);

      if (
        event?.error ===
        "not-allowed"
      ) {
        alert(
          "Microphone permission is blocked. Please allow microphone access in your browser."
        );

        return;
      }

      if (
        event?.error ===
        "no-speech"
      ) {
        alert(
          "I could not hear any speech. Please try again."
        );

        return;
      }

      if (
        event?.error ===
        "language-not-supported"
      ) {
        alert(
          "Speech recognition for this language is not supported by this browser. You can still type your question."
        );

        return;
      }

      alert(
        "I could not understand your voice. Please try again or type your question."
      );
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Could not start speech recognition:",
        error
      );

      setListening(false);
    }
  };

  return (
    <button
      type="button"
      className="voice-button"
      onClick={
        startListening
      }
      disabled={listening}
      aria-label={
        listening
          ? "Listening"
          : "Speak"
      }
      title={
        listening
          ? "Listening..."
          : "Speak"
      }
    >
      {listening ? (
        <>
          <MicOff
            size={18}
          />
          Listening...
        </>
      ) : (
        <>
          <Mic
            size={18}
          />
          Speak
        </>
      )}
    </button>
  );
}

export default VoiceButton;
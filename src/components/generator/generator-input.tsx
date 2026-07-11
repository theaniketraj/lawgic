import { useEffect, useRef, useState } from "react";

type PropsType = {
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  value?: string;
  disabled?: boolean;
};

export default function GeneratorInput({
  onChange,
  value,
  disabled,
}: Readonly<PropsType>) {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const initialValueRef = useRef<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (onChange) {
            const finalVal =
              initialValueRef.current +
              (initialValueRef.current && currentTranscript ? " " : "") +
              currentTranscript;
            onChange({ target: { value: finalVal } } as any);
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, [onChange]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      initialValueRef.current = value || "";
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Could not start speech recognition", err);
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="sticky bottom-0 inset-x-0 z-30 mt-auto">
      <div className="h-4" />

      <div
        className="bg-white/15 dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-3xl backdrop-blur-[10px] shadow-theme-md overflow-hidden aria-disabled:opacity-70 aria-disabled:pointer-events-none"
        aria-disabled={disabled}
      >
        <div className="p-5 pb-0 pr-2.5">
          <textarea
            ref={textareaRef}
            placeholder="Type your message"
            value={value}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitButtonRef.current?.click();
              }
            }}
            className="dark:text-white/90 focus:outline-0 placeholder:text-sm dark:placeholder:text-white/50 resize-none max-h-44 leading-5 w-full custom-scrollbar pb-8"
            required
            rows={1}
          />
        </div>
        <div className="flex justify-end items-center gap-2 p-3 pt-0">
          {/* Attach Button */}
          <label
            htmlFor="attach-file"
            className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition cursor-pointer"
            title="Attach file"
          >
            <input
              type="file"
              accept=".pdf, .doc, .docx, .txt"
              name="attachFile"
              id="attach-file"
              className="sr-only"
            />
            <i className="fas fa-paperclip text-lg"></i>
          </label>

          {/* Microphone Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`size-10 flex transition items-center justify-center rounded-full ${
              isListening
                ? "bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
            }`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            <i
              className={`fas fa-microphone text-lg ${isListening ? "animate-bounce" : ""}`}
            ></i>
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            ref={submitButtonRef}
            className="size-10 flex bg-[#1D2939] dark:bg-primary-500 hover:bg-black dark:hover:bg-primary-600 dark:disabled:bg-white/20 disabled:bg-gray-200 transition items-center justify-center rounded-full text-white disabled:text-gray-400"
            disabled={!value?.trim()}
            title="Send Message"
          >
            <span className="sr-only">Submit</span>
            <i className="fas fa-paper-plane text-sm -ml-0.5"></i>
          </button>
        </div>
      </div>

      <div className="h-5" />
    </div>
  );
}

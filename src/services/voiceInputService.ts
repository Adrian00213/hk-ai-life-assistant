// Voice Input Service using Web Speech API
export interface VoiceInputConfig {
  lang: string; // 'zh-HK' | 'en-US'
  continuous: boolean;
  interimResults: boolean;
}

const DEFAULT_CONFIG: VoiceInputConfig = {
  lang: 'zh-HK',
  continuous: false,
  interimResults: true,
};

export class VoiceInputService {
  private recognition: any = null;
  private config: VoiceInputConfig;
  private isListening: boolean = false;
  private onResultCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onStartCallback: (() => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor(config: Partial<VoiceInputConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initRecognition();
  }

  private initRecognition(): void {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.config.lang;
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;
      
      if (this.onResultCallback) {
        this.onResultCallback(transcript, isFinal);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
      this.isListening = false;
    };

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStartCallback) {
        this.onStartCallback();
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };
  }

  // Start listening
  start(): boolean {
    if (!this.recognition) {
      console.warn('Speech recognition not available');
      return false;
    }

    if (this.isListening) {
      return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }

  // Stop listening
  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Toggle listening
  toggle(): boolean {
    if (this.isListening) {
      this.stop();
      return false;
    } else {
      return this.start();
    }
  }

  // Check if currently listening
  getIsListening(): boolean {
    return this.isListening;
  }

  // Check if voice input is available
  isAvailable(): boolean {
    return this.recognition !== null;
  }

  // Set callback for results
  onResult(callback: (transcript: string, isFinal: boolean) => void): void {
    this.onResultCallback = callback;
  }

  // Set callback for errors
  onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  // Set callback for start
  onStart(callback: () => void): void {
    this.onStartCallback = callback;
  }

  // Set callback for end
  onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  // Update config
  setConfig(config: Partial<VoiceInputConfig>): void {
    this.config = { ...this.config, ...config };
    if (this.recognition) {
      this.recognition.lang = this.config.lang;
      this.recognition.continuous = this.config.continuous;
      this.recognition.interimResults = this.config.interimResults;
    }
  }
}

// Singleton instance
export const voiceInputService = new VoiceInputService();

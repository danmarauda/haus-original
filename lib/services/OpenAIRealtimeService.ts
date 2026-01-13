/**
 * OpenAI Realtime API Service
 * Handles WebSocket communication with OpenAI's Realtime API for voice interactions
 */

export interface RealtimeConfig {
  apiKey: string;
  model?: 'gpt-realtime' | 'gpt-4o-realtime-preview';
  voice?: 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse' | 'cedar' | 'marin';
  language?: string;
  temperature?: number;
  instructions?: string;
}

export interface PropertySearchParams {
  location?: string;
  propertyType?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  amenities?: string[];
}

export interface RealtimeMessage {
  type: string;
  event_id?: string;
  [key: string]: any;
}

export type RealtimeEventHandler = (event: RealtimeMessage) => void;

export class OpenAIRealtimeService {
  private ws: WebSocket | null = null;
  private config: RealtimeConfig;
  private eventHandlers: Map<string, Set<RealtimeEventHandler>> = new Map();
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private isRecording = false;
  private isConnected = false;
  private currentSessionId: string | null = null;
  private audioChunks: string[] = [];
  private eventIdCounter = 0;

  constructor(config: RealtimeConfig) {
    this.config = {
      model: 'gpt-4o-realtime-preview',
      voice: 'cedar',
      temperature: 0.8,
      instructions: `You are HAUS, an enthusiastic Australian real estate voice assistant. Help users find their perfect property in Australia using natural conversation.

CRITICAL: You MUST respond in the language the user speaks.

Australian Context:
- Focus on Australian locations: Sydney, Melbourne, Brisbane, Perth, Adelaide, Canberra, Darwin, Hobart
- Popular suburbs: Bondi, South Yarra, Surfers Paradise, Paddington, Fitzroy, Newtown, St Kilda, Manly
- Use Australian property terminology: apartment/unit (not condo), house, townhouse, villa, terrace
- Prices in Australian Dollars (AUD): $500K = $500,000, $1.5M = $1,500,000
- Australian features: pool, garage, garden, balcony, air conditioning, solar panels

When users describe what they want, extract these parameters:
- Location (suburb, city, state, postcode)
- Property type (house, apartment, unit, townhouse, villa, terrace, penthouse)
- Price range (minimum and maximum in AUD)
- Bedrooms and bathrooms
- Amenities (pool, garage, garden, balcony, parking, etc.)

Always:
1. Be conversational and helpful
2. Ask clarifying questions if needed
3. Call search_properties with extracted parameters
4. Explain the search results enthusiastically
5. Suggest alternatives if no results found

Remember: Respond naturally in the user's language and focus on Australian real estate!`,
      ...config
    };
  }

  async initialize(): Promise<boolean> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.audioContext.resume();
      await this.connect();
      return true;
    } catch (error) {
      console.error('Failed to initialize OpenAI Realtime Service:', error);
      return false;
    }
  }

  private async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `wss://api.openai.com/v1/realtime?model=${this.config.model}`;
        this.ws = new WebSocket(wsUrl, ['realtime']);

        const originalSend = this.ws.send.bind(this.ws);
        this.ws.send = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
          if (typeof data === 'string') {
            const event = JSON.parse(data);
            if (event.type === 'session.update') {
              event.authorization = `Bearer ${this.config.apiKey}`;
              data = JSON.stringify(event);
            }
          }
          originalSend(data);
        };

        this.ws.onopen = () => {
          console.log('Connected to OpenAI Realtime API');
          this.isConnected = true;
          this.sendSessionUpdate();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: RealtimeMessage = JSON.parse(event.data);
            this.handleRealtimeMessage(message);
          } catch (error) {
            console.error('Error parsing realtime message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnected = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('Disconnected from OpenAI Realtime API');
          this.isConnected = false;
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private sendSessionUpdate(): void {
    const sessionConfig = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: this.config.instructions,
        voice: this.config.voice,
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 800
        },
        tools: [
          {
            type: 'function',
            name: 'search_properties',
            description: 'Search for properties based on user criteria',
            parameters: {
              type: 'object',
              properties: {
                location: {
                  type: 'string',
                  description: 'City, state, neighborhood, or area to search in'
                },
                propertyType: {
                  type: 'string',
                  description: 'Type of property: house, apartment, condo, loft, penthouse, townhouse, studio, etc.'
                },
                priceMin: {
                  type: 'number',
                  description: 'Minimum price in USD'
                },
                priceMax: {
                  type: 'number',
                  description: 'Maximum price in USD'
                },
                bedrooms: {
                  type: 'number',
                  description: 'Minimum number of bedrooms'
                },
                amenities: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of desired amenities like pool, garage, garden, gym, balcony, etc.'
                }
              }
            }
          }
        ],
        tool_choice: 'auto',
        temperature: this.config.temperature
      }
    };

    this.sendMessage(sessionConfig);
  }

  private handleRealtimeMessage(message: RealtimeMessage): void {
    console.log('Received realtime message:', message.type, message);

    const handlers = this.eventHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message));
    }

    const generalHandlers = this.eventHandlers.get('*');
    if (generalHandlers) {
      generalHandlers.forEach(handler => handler(message));
    }

    switch (message.type) {
      case 'session.created':
        this.currentSessionId = message.session.id;
        this.emit('session_ready', message);
        break;

      case 'input_audio_buffer.speech_started':
        this.emit('speech_started', message);
        break;

      case 'input_audio_buffer.speech_stopped':
        this.emit('speech_stopped', message);
        break;

      case 'response.created':
        this.emit('response_started', message);
        break;

      case 'response.audio_transcript.delta':
        this.emit('transcript_delta', message);
        break;

      case 'response.function_call_arguments.done':
        this.handleFunctionCall(message);
        break;

      case 'response.done':
        this.emit('response_complete', message);
        break;

      case 'error':
        console.error('Realtime API error:', message);
        this.emit('error', message);
        break;
    }
  }

  private handleFunctionCall(message: any): void {
    if (message.name === 'search_properties') {
      try {
        const args: PropertySearchParams = JSON.parse(message.arguments);
        this.emit('property_search_requested', {
          searchParams: args,
          callId: message.call_id
        });
      } catch (error) {
        console.error('Error parsing function call arguments:', error);
        this.sendFunctionResult(message.call_id, {
          error: 'Invalid search parameters',
          message: 'Could not parse search criteria'
        });
      }
    }
  }

  async startRecording(): Promise<boolean> {
    if (this.isRecording || !this.audioContext) return false;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      const mediaRecorder = new MediaRecorder(this.mediaStream, {
        mimeType: 'audio/webm;codecs=pcm'
      });

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          await this.sendAudioChunk(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        this.sendMessage({
          type: 'input_audio_buffer.commit'
        });
      };

      mediaRecorder.start(100);
      this.isRecording = true;

      this.emit('recording_started');
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      this.emit('recording_error', { error });
      return false;
    }
  }

  stopRecording(): void {
    if (!this.isRecording || !this.mediaStream) return;

    this.mediaStream.getTracks().forEach(track => track.stop());
    this.mediaStream = null;
    this.isRecording = false;

    this.emit('recording_stopped');
  }

  private async sendAudioChunk(audioBlob: Blob): Promise<void> {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = this.arrayBufferToBase64(arrayBuffer);

      this.sendMessage({
        type: 'input_audio_buffer.append',
        audio: base64Audio
      });
    } catch (error) {
      console.error('Error sending audio chunk:', error);
    }
  }

  sendTextMessage(text: string, language?: string): void {
    const eventId = this.generateEventId();
    const message = {
      event_id: eventId,
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{
          type: 'input_text',
          text: language ? `[Language: ${language}] ${text}` : text
        }]
      }
    };

    this.sendMessage(message);

    this.sendMessage({
      event_id: this.generateEventId(),
      type: 'response.create'
    });
  }

  sendFunctionResult(callId: string, result: any): void {
    const eventId = this.generateEventId();
    const message = {
      event_id: eventId,
      type: 'conversation.item.create',
      item: {
        type: 'function_call_output',
        call_id: callId,
        output: JSON.stringify(result)
      }
    };

    this.sendMessage(message);

    this.sendMessage({
      event_id: this.generateEventId(),
      type: 'response.create'
    });
  }

  changeVoice(voice: RealtimeConfig['voice']): void {
    this.config.voice = voice;
    if (this.isConnected) {
      this.sendSessionUpdate();
    }
  }

  changeLanguage(language: string): void {
    this.config.language = language;
    const updatedInstructions = `${this.config.instructions}\n\nIMPORTANT: Always respond in ${language} language.`;

    if (this.isConnected) {
      this.sendMessage({
        type: 'session.update',
        session: {
          instructions: updatedInstructions
        }
      });
    }
  }

  interrupt(): void {
    if (this.isConnected) {
      this.sendMessage({
        type: 'response.cancel'
      });
    }
  }

  private sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message:', message.type);
    }
  }

  on(eventType: string, handler: RealtimeEventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)!.add(handler);
  }

  off(eventType: string, handler: RealtimeEventHandler): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private emit(eventType: string, data?: any): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => handler({ type: eventType, ...data }));
    }

    const allHandlers = this.eventHandlers.get('*');
    if (allHandlers) {
      allHandlers.forEach(handler => handler({ type: eventType, ...data }));
    }
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${++this.eventIdCounter}`;
  }

  disconnect(): void {
    if (this.isRecording) {
      this.stopRecording();
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    this.isConnected = false;
    this.currentSessionId = null;
    this.audioChunks = [];
  }

  get connected(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  get sessionId(): string | null {
    return this.currentSessionId;
  }

  get recording(): boolean {
    return this.isRecording;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    return btoa(binary);
  }
}

export default OpenAIRealtimeService;

// Navrit MVP - Voice Service
// Source: MASTER_BUILD_CONTEXT.md Section 2.4 (Component Topology)
// Stubs for Deepgram (STT) and ElevenLabs (TTS) integration
// Latency SLA: <600ms p95 (Section 1.2)

/**
 * Voice call metadata structure
 */
export interface VoiceCallMetadata {
    callId: string;
    leadId: string;
    phone: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    transcript?: string;
    channel: 'EXOTEL' | 'TWILIO';
}

/**
 * Speech-to-Text result from Deepgram
 */
export interface STTResult {
    transcript: string;
    confidence: number;
    duration: number;
    language: string;
}

/**
 * Text-to-Speech options for ElevenLabs
 */
export interface TTSOptions {
    voiceId: string;
    text: string;
    language: string;
    speed?: number;
}

/**
 * Voice Service class
 * Implements Deepgram (STT) and ElevenLabs (TTS) stubs
 * Per Section 2.4 Component Topology:
 * - Deepgram: <200ms p95
 * - ElevenLabs: <150ms p95
 */
export class VoiceService {
    private deepgramApiKey: string;
    private elevenLabsApiKey: string;

    constructor() {
        this.deepgramApiKey = process.env.DEEPGRAM_API_KEY || '';
        this.elevenLabsApiKey = process.env.ELEVENLABS_API_KEY || '';
    }

    /**
     * Speech-to-Text using Deepgram
     * STUB: Would call Deepgram API in production
     */
    async transcribe(audioBuffer: Buffer): Promise<STTResult> {
        // Log warning if no API key
        if (!this.deepgramApiKey) {
            console.warn('[Voice] No DEEPGRAM_API_KEY set - using stub response');
        }

        // STUB: Return mock transcription
        // In production, this would call Deepgram's real-time streaming API
        console.log(`[Voice] Transcribing audio buffer of ${audioBuffer.length} bytes`);

        return {
            transcript: 'Hello, I am interested in the Toyota Fortuner',
            confidence: 0.92,
            duration: 3.5,
            language: 'en'
        };
    }

    /**
     * Text-to-Speech using ElevenLabs
     * STUB: Would call ElevenLabs API in production
     */
    async synthesize(options: TTSOptions): Promise<Buffer> {
        // Log warning if no API key
        if (!this.elevenLabsApiKey) {
            console.warn('[Voice] No ELEVENLABS_API_KEY set - using stub response');
        }

        // STUB: Return empty buffer
        // In production, this would call ElevenLabs API and return audio data
        console.log(`[Voice] Synthesizing: "${options.text}" in ${options.language}`);

        return Buffer.from([]);
    }

    /**
     * Start a voice call session
     * STUB: Would integrate with Exotel in production
     */
    async startCall(phone: string, leadId: string): Promise<VoiceCallMetadata> {
        const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        console.log(`[Voice] Starting call to ${phone} for lead ${leadId}`);

        return {
            callId,
            leadId,
            phone,
            startTime: new Date(),
            channel: 'EXOTEL'
        };
    }

    /**
     * End a voice call session
     * STUB: Would store call metadata and transcript
     */
    async endCall(metadata: VoiceCallMetadata): Promise<VoiceCallMetadata> {
        const endTime = new Date();
        const duration = (endTime.getTime() - metadata.startTime.getTime()) / 1000;

        console.log(`[Voice] Ending call ${metadata.callId}, duration: ${duration}s`);

        return {
            ...metadata,
            endTime,
            duration
        };
    }

    /**
     * Get voice settings per market
     * Per Section GEO_CONFIG - different voice models per region
     */
    getVoiceSettings(market: string): { voiceId: string; language: string } {
        const settings: Record<string, { voiceId: string; language: string }> = {
            'ID': { voiceId: 'indonesian-female-1', language: 'id' },
            'IN': { voiceId: 'indian-english-female-1', language: 'en-IN' },
            'SG': { voiceId: 'singaporean-english-female-1', language: 'en-SG' },
            'AE': { voiceId: 'arabic-female-1', language: 'ar' }
        };

        return settings[market] || settings['ID'];
    }
}

export default new VoiceService();

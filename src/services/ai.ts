// src/services/ai.ts
// AI Service - Claude Integration
// Stanford Architecture: Full implementation with fallback

import axios from 'axios';
import env from '../config/env';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface AIAnalysisResult {
    intent: string;
    confidence: number;
    reply: string;
    entities: Record<string, string>;
    sentiment: 'positive' | 'neutral' | 'negative';
    nextAction: 'RESPOND' | 'HUMAN_IN_THE_LOOP' | 'ESCALATE';
}

export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER SYSTEM PROMPT
// This is the "Soul" of the AI - defines behavior
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Navrit, an AI-powered Sales Assistant for automotive dealerships.

## YOUR ROLE
- Qualify leads by understanding their intent and needs
- Schedule test drives and appointments
- Answer product questions accurately
- Escalate to human DSE when confidence is low

## RESPONSE FORMAT (JSON)
Always respond with valid JSON:
{
  "intent": "book_test_drive|product_inquiry|negotiate_price|show_interest|general_inquiry|confirm_appointment|decline",
  "confidence": 0.0-1.0,
  "reply": "Your natural language response to the customer",
  "entities": {
    "model": "extracted car model if mentioned",
    "date": "extracted date if mentioned",
    "budget": "extracted budget if mentioned",
    "location": "extracted location if mentioned"
  },
  "sentiment": "positive|neutral|negative"
}

## GUARDRAILS (NEVER VIOLATE)
G1: Never commit to specific prices or discounts
G2: Never promise loan approval or finance terms
G3: Never share internal processes or competitor info
G4: If unsure, ask clarifying questions
G5: Always be respectful and professional

## MARKET CONTEXT
You serve dealerships in: Indonesia (ID), India (IN), Singapore (SG), UAE (AE)
Adjust communication style based on market:
- ID/IN: Warm, relationship-focused
- SG/AE: Professional, direct

## EXAMPLE INTERACTIONS
User: "I want to test drive the Fortuner this Saturday"
Response: {"intent": "book_test_drive", "confidence": 0.92, "reply": "Excellent choice! I'd be happy to arrange a Fortuner test drive for Saturday. What time works best for you - morning or afternoon?", "entities": {"model": "Fortuner", "date": "Saturday"}, "sentiment": "positive"}

User: "What's the best price you can give me?"
Response: {"intent": "negotiate_price", "confidence": 0.75, "reply": "I understand you're looking for the best value. Our current offers include complimentary accessories and extended warranty. May I know which model you're interested in so I can share specific pricing details?", "entities": {}, "sentiment": "neutral"}`;

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyze a customer message using Claude AI
 * Falls back to rule-based analysis if API unavailable
 */
export async function analyzeMessage(
    userMessage: string,
    conversationHistory: ConversationMessage[] = [],
    market: string = 'ID'
): Promise<AIAnalysisResult> {
    // If no API key, use fallback
    if (!env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY === 'sk-ant-your-key-here') {
        console.warn('⚠️ No Claude API key. Using rule-based fallback.');
        return ruleBasedAnalysis(userMessage);
    }

    try {
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-haiku-20240307',
                max_tokens: 1024,
                system: SYSTEM_PROMPT + `\n\nCurrent market: ${market}`,
                messages: [
                    ...conversationHistory.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    })),
                    { role: 'user', content: userMessage }
                ]
            },
            {
                headers: {
                    'x-api-key': env.ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                },
                timeout: 30000
            }
        );

        // Parse Claude's response
        const aiText = response.data.content[0].text;
        const parsed = JSON.parse(aiText);

        return {
            intent: parsed.intent || 'general_inquiry',
            confidence: parsed.confidence || 0.5,
            reply: parsed.reply || 'Thank you for your message.',
            entities: parsed.entities || {},
            sentiment: parsed.sentiment || 'neutral',
            nextAction: determineNextAction(parsed.confidence || 0.5)
        };
    } catch (error) {
        console.error('Claude API error:', error);
        console.warn('Falling back to rule-based analysis');
        return ruleBasedAnalysis(userMessage);
    }
}

/**
 * Determine next action based on confidence
 */
function determineNextAction(confidence: number): AIAnalysisResult['nextAction'] {
    if (confidence >= 0.85) return 'RESPOND';
    if (confidence >= 0.60) return 'HUMAN_IN_THE_LOOP';
    return 'ESCALATE';
}

// ─────────────────────────────────────────────────────────────────────────────
// RULE-BASED FALLBACK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rule-based analysis when Claude is unavailable
 * Uses keyword matching for basic intent detection
 */
function ruleBasedAnalysis(message: string): AIAnalysisResult {
    const lowerMessage = message.toLowerCase();
    const entities: Record<string, string> = {};

    // Extract entities
    const carModels = ['fortuner', 'innova', 'city', 'vios', 'camry', 'rush', 'avanza'];
    for (const model of carModels) {
        if (lowerMessage.includes(model)) {
            entities['model'] = model.charAt(0).toUpperCase() + model.slice(1);
            break;
        }
    }

    // Extract date mentions
    const datePatterns = ['tomorrow', 'today', 'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    for (const date of datePatterns) {
        if (lowerMessage.includes(date)) {
            entities['date'] = date.charAt(0).toUpperCase() + date.slice(1);
            break;
        }
    }

    // Intent detection
    let intent = 'general_inquiry';
    let confidence = 0.7;
    let reply = 'Thank you for reaching out! How can I help you today?';

    if (lowerMessage.includes('test drive') || lowerMessage.includes('testdrive')) {
        intent = 'book_test_drive';
        confidence = 0.88;
        reply = `I'd be happy to arrange a test drive${entities['model'] ? ` for the ${entities['model']}` : ''}! When would be convenient for you?`;
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('discount')) {
        intent = 'negotiate_price';
        confidence = 0.72;
        reply = 'I understand you\'re interested in pricing. Let me connect you with our sales team who can provide detailed information.';
    } else if (lowerMessage.includes('interested') || lowerMessage.includes('want') || lowerMessage.includes('like to')) {
        intent = 'show_interest';
        confidence = 0.82;
        reply = 'That\'s wonderful! I\'d love to help you learn more. What specific features are you looking for?';
    } else if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
        intent = 'confirm_appointment';
        confidence = 0.85;
        reply = 'I\'ll help you schedule that right away. What date and time work best?';
    } else if (lowerMessage.includes('cancel') || lowerMessage.includes('not interested') || lowerMessage.includes('no thanks')) {
        intent = 'decline';
        confidence = 0.9;
        reply = 'I understand. If you change your mind or have questions in the future, feel free to reach out!';
    }

    // Sentiment detection
    let sentiment: AIAnalysisResult['sentiment'] = 'neutral';
    const positiveWords = ['great', 'excited', 'love', 'perfect', 'wonderful', 'thanks', 'awesome'];
    const negativeWords = ['angry', 'frustrated', 'terrible', 'worst', 'hate', 'annoyed', 'disappointed'];

    if (positiveWords.some(word => lowerMessage.includes(word))) {
        sentiment = 'positive';
    } else if (negativeWords.some(word => lowerMessage.includes(word))) {
        sentiment = 'negative';
        confidence = Math.max(confidence - 0.2, 0.4); // Lower confidence on negative sentiment
    }

    return {
        intent,
        confidence,
        reply,
        entities,
        sentiment,
        nextAction: determineNextAction(confidence)
    };
}

export default { analyzeMessage };

// All Anthropic Claude API calls for the Sweet Deal Decision Engine
// NEVER call fetch directly in components — always use these functions
// API key is read from localStorage (lpg_settings) first, then VITE_ANTHROPIC_API_KEY env var

import { PROPERTY_TYPES } from '../constants/filterOptions';
import { loadSettings } from './storage';

// The Claude model used for all AI calls
const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

// API endpoint — uses Anthropic's Messages API
const API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Get the Claude API key — checks Settings (localStorage) first, then env var
 * Settings key takes priority so users can configure via UI without a .env file
 * Returns null if no key is configured anywhere
 */
function getApiKey() {
  // Check Settings (UI-configured) first — this is the primary path for demo users
  const settings = loadSettings();
  if (settings?.claude_api_key && settings.claude_api_key.trim() !== '') {
    console.log('🔑 Using API key from Settings');
    return settings.claude_api_key.trim();
  }
  // Fall back to Vite env var — developer and self-hosted deployment path
  const envKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (envKey && envKey !== 'your_api_key_here') {
    console.log('🔑 Using API key from .env');
    return envKey;
  }
  return null;
}

/**
 * Send a message to the Claude API and return the response text
 * This is the core function all other API calls use
 * @param {string} systemPrompt - The system message setting Claude's role
 * @param {string} userPrompt - The user's message/request
 * @returns {Promise<string>} - Claude's response text
 */
async function callClaude(systemPrompt, userPrompt) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      'Claude API key not configured. Go to Settings and add your Claude API key to enable AI features.'
    );
  }

  console.log('🤖 Calling Claude API...');
  console.log('📝 System prompt length:', systemPrompt.length);
  console.log('📝 User prompt length:', userPrompt.length);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  // Handle HTTP errors with actionable messages
  if (!response.ok) {
    const status = response.status;
    if (status === 401) {
      throw new Error('Invalid API key. Please check your Claude API key in Settings — it may be invalid or expired.');
    } else if (status === 429) {
      throw new Error('API rate limit reached. Please wait a moment and try again.');
    } else if (status === 500 || status === 503) {
      throw new Error('Anthropic API is temporarily unavailable. Please try again in a few minutes.');
    }
    const errorBody = await response.text();
    console.error('❌ API error:', status, errorBody);
    throw new Error(`API request failed (${status}). Check your internet connection and try again.`);
  }

  const data = await response.json();
  const responseText = data.content?.[0]?.text || '';
  console.log('✅ Claude response received:', responseText.substring(0, 100) + '...');
  return responseText;
}

/**
 * Parse a JSON response from Claude, handling markdown code fences
 * Claude sometimes wraps JSON in ```json ... ``` blocks
 * @param {string} text - Raw response text from Claude
 * @returns {object} - Parsed JSON object
 */
function parseJsonResponse(text) {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('❌ Failed to parse JSON response:', cleaned.substring(0, 200));
    throw new Error('AI returned an unexpected format. Please try again.');
  }
}

// --- PUBLIC API FUNCTIONS ---

/**
 * Module 1 — Research target markets for land flipping
 * Returns county recommendations with growth scores
 * @param {string} state - US state name (e.g. "Texas")
 * @param {string} propertyType - One of: infill_lots, outskirts_1_10_ac, rural_10_100_ac
 * @returns {Promise<object>} - { target_counties: [...], market_summary: "..." }
 */
export async function researchTargetMarket(state, propertyType) {
  console.log('🔍 Researching target market:', state, propertyType);

  // Look up the property type description
  const typeInfo = PROPERTY_TYPES.find((t) => t.value === propertyType);
  const typeDescription = typeInfo ? typeInfo.label : propertyType;

  const systemPrompt = `You are a real estate data analyst specializing in land investment. You help investors find undervalued land markets using the Land Profit Generator method by Jack Bosch: buying land at 5-25% of market value in growing US markets.`;

  const userPrompt = `Research the best target counties for land flipping in ${state}. The investor is looking for ${propertyType}: ${typeDescription}.

Respond ONLY with valid JSON in this exact format:
{
  "target_counties": [
    {
      "county_name": "...",
      "state_abbr": "...",
      "growth_score": 8.5,
      "why_recommended": "2-3 sentences explaining why this county is good",
      "property_types_best_for": ["${propertyType}"],
      "assessor_website": "URL if known, or empty string",
      "typical_price_range": "$5,000 - $30,000"
    }
  ],
  "market_summary": "2-3 sentences about this state's overall land market"
}
Return 3-5 counties maximum. Only JSON, no other text.`;

  const response = await callClaude(systemPrompt, userPrompt);
  const parsed = parseJsonResponse(response);

  console.log('✅ Market research complete:', parsed.target_counties?.length, 'counties returned');
  return parsed;
}

/**
 * Module 5 — Generate a letter to a property owner
 * Returns plain text letter (not JSON)
 * @param {string} letterType - "neutral" or "blind_offer"
 * @param {object} dealData - Deal object with property and owner info
 * @param {object} userProfile - User's business profile
 * @returns {Promise<string>} - Complete letter text
 */
export async function generateLetter(letterType, dealData, userProfile) {
  console.log('✉️ Generating', letterType, 'letter for', dealData.owner?.name);

  const systemPrompt = `You are a professional letter writer for a land investment company. Write letters that are warm, personal, and professional — never robotic or salesy. Jack Bosch's system recommends contacting property owners who may no longer want their land.`;

  // Build the from/to details
  const fromAddress = [userProfile.mailing_address, userProfile.city, userProfile.state, userProfile.zip]
    .filter(Boolean).join(', ');
  const ownerAddress = [dealData.owner?.mailing_address, dealData.owner?.city, dealData.owner?.state, dealData.owner?.zip]
    .filter(Boolean).join(', ');

  let userPrompt = `Write a ${letterType} letter for:
- From: ${userProfile.your_name}, ${userProfile.company_name || 'N/A'}, ${fromAddress}, ${userProfile.phone}
- To: ${dealData.owner?.name || 'Property Owner'}, ${ownerAddress || 'Address on file'}
- Property: ${dealData.property?.address || 'Property on file'}, ${dealData.property?.county || ''}, ${dealData.property?.state || ''}, ${dealData.property?.acres || 'N/A'} acres`;

  // Add offer price for blind offer letters
  if (letterType === 'blind_offer' && dealData.offer?.locked_offer) {
    userPrompt += `\n- Offer Price: $${dealData.offer.locked_offer.toLocaleString()}`;
  }

  userPrompt += `

Letter type guide:
- "neutral": Do NOT mention a price. Just express interest in buying and ask them to call.
- "blind_offer": Include the specific offer price. Be direct but kind.

The letter should:
1. Address the owner by first name (or "Dear Property Owner" if name seems like a company)
2. Mention the specific property address so they know exactly which one
3. Be 200-300 words
4. Sound like it was written specifically for them, not mass-mailed
5. Include a clear call to action (call the phone number)

Return ONLY the complete letter text, starting with the date line. No JSON wrapping.`;

  const response = await callClaude(systemPrompt, userPrompt);
  console.log('✅ Letter generated:', response.length, 'characters');
  return response.trim();
}

/**
 * Module 8 — Generate a buyer profile for a property
 * Returns JSON with buyer type, pricing, platforms, and listing description
 * @param {object} propertyData - Property details (location, acres, zoning, features)
 * @returns {Promise<object>} - Buyer profile JSON
 */
export async function generateBuyerProfile(propertyData) {
  console.log('👤 Generating buyer profile for:', propertyData.county, propertyData.state);

  const systemPrompt = `You are a land marketing expert who helps investors sell vacant land quickly.`;

  const userPrompt = `Generate a buyer profile and listing description for this property:
- Location: ${propertyData.county || 'Unknown County'}, ${propertyData.state || 'Unknown State'}
- Size: ${propertyData.acres || 'Unknown'} acres
- Distance from nearest city: approximately ${propertyData.distance || 'unknown'} miles from ${propertyData.nearestCity || 'nearest city'}
- Zoning: ${propertyData.zoning || 'Unknown'}
- Known features: ${propertyData.features || 'unknown'}

Respond ONLY with valid JSON:
{
  "buyer_type": "Builder | Investor | Recreational",
  "buyer_description": "2 sentences describing who this typical buyer is",
  "recommended_wholesale_price": 15000,
  "recommended_retail_price": 25000,
  "best_selling_platforms": ["Facebook Marketplace", "LandWatch.com", "Craigslist"],
  "listing_description": "3-4 sentence property listing ready to post online",
  "marketing_tips": ["tip 1", "tip 2", "tip 3"]
}
Only JSON, no other text.`;

  const response = await callClaude(systemPrompt, userPrompt);
  const parsed = parseJsonResponse(response);

  console.log('✅ Buyer profile generated:', parsed.buyer_type);
  return parsed;
}

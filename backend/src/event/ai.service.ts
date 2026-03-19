import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface VenueProposal {
  venueName: string;
  location: string;
  estimatedCost: string;
  whyItFits: string;
  amenities: string[];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('GROQ_API_KEY');
  }

  async generateVenueProposal(userQuery: string): Promise<VenueProposal> {
    const systemPrompt = `You are an expert corporate event planning concierge with 20+ years of experience curating premium venues for executive retreats, leadership offsites, and corporate gatherings worldwide.

Your role is to analyse the user's event description and recommend the single BEST venue that matches their needs.

STRICT OUTPUT FORMAT — respond ONLY with a valid JSON object, no markdown, no explanation, no preamble, no backticks:
{
  "venueName": "Full official name of the venue",
  "location": "City, State/Region, Country",
  "estimatedCost": "Realistic total cost range for the entire event (e.g., '$3,200 - $4,800')",
  "whyItFits": "2-3 sentence personalised justification that directly references the user's requirements (group size, duration, budget, environment preferences). Make it compelling and specific.",
  "amenities": ["amenity1", "amenity2", "amenity3", "amenity4", "amenity5"]
}

GUIDELINES:
- Recommend real, bookable venues (hotels, resorts, retreat centres, conference estates).
- Align location with any geographic preferences mentioned (mountains, beach, city, etc.).
- Keep estimatedCost within 20% of any stated budget.
- List exactly 5 relevant amenities.
- Ensure the JSON is valid and parseable. No trailing commas.`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuery },
          ],
          temperature: 0.7,
          max_tokens: 600,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      let raw: string = data?.choices?.[0]?.message?.content;

      if (!raw) throw new Error('Empty response from Groq');

      // Strip markdown fences just in case
      raw = raw.replace(/```json|```/g, '').trim();

      const parsed: VenueProposal = JSON.parse(raw);

      // Validate required fields
      const required: (keyof VenueProposal)[] = [
        'venueName', 'location', 'estimatedCost', 'whyItFits', 'amenities',
      ];
      for (const field of required) {
        if (!parsed[field]) throw new Error(`Missing field: ${field}`);
      }

      return parsed;
    } catch (err) {
      this.logger.error('Groq call failed', err);
      throw new InternalServerErrorException(
        'AI service is unavailable. Please try again shortly.',
      );
    }
  }
}
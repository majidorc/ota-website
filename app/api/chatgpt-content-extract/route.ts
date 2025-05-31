import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { content } = await req.json();
  if (!content) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
  }

  // Prompt for OpenAI
  const prompt = `Extract the following from the provided activity description:
- Title (max 60 chars)
- Description (max 160 chars)
- Keywords (max 5, comma-separated)
- Category (one of: Adventure, Cultural, Nature, Urban, Relaxation)
- Difficulty (one of: Easy, Moderate, Challenging)
- Duration (in hours, number only)
- Price Range (one of: Budget, Moderate, Luxury)
- Location (city or region name)
- Best Time to Visit (season or month)
- Required Items (comma-separated list)
- Safety Tips (max 3, bullet points)
- Accessibility (one of: Family-Friendly, Solo Traveler, Group Activity)
- Environmental Impact (one of: Low, Moderate, High)
- Local Customs (max 2, bullet points)
- Photography Tips (max 2, bullet points)
- Transportation (one of: Public Transport, Private Vehicle, Walking)
- Booking Requirements (one of: None, Reservation Recommended, Reservation Required)
- Group Size (one of: Solo, Small Group, Large Group)
- Language (one of: English, Local Language, Bilingual)
- Weather Considerations (max 2, bullet points)
- Return the data in JSON format.
- Do not include any explanations or additional text.
- Ensure the JSON is valid and properly formatted.
- Example format:
{
  "title": "Hiking Mount Fuji",
  "description": "A challenging hike to Japan's highest peak, offering stunning views and a sense of accomplishment.",
  "keywords": "hiking, mountain, sunrise, nature, challenge",
  "category": "Adventure",
  "difficulty": "Challenging",
  "duration": 8,
  "priceRange": "Moderate",
  "location": "Mount Fuji, Japan",
  "bestTimeToVisit": "July to September",
  "requiredItems": "hiking boots, water, snacks, warm clothing",
  "safetyTips": [
    "Check weather conditions before starting",
    "Start early to avoid afternoon storms",
    "Stay on marked trails"
  ],
  "accessibility": "Group Activity",
  "environmentalImpact": "Low",
  "localCustoms": [
    "Respect the mountain as a sacred site",
    "Follow local hiking etiquette"
  ],
  "photographyTips": [
    "Capture the sunrise from the summit",
    "Use a wide-angle lens for landscape shots"
  ],
  "transportation": "Private Vehicle",
  "bookingRequirements": "Reservation Recommended",
  "groupSize": "Small Group",
  "language": "Bilingual",
  "weatherConsiderations": [
    "Avoid hiking during typhoon season",
    "Check for sudden weather changes"
  ]
}
Activity Description:
"""${content}"""`;

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    }
  );

  let data;
  try {
    data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Failed to generate content" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Failed to parse OpenAI response:", error);
    return NextResponse.json(
      { error: "Failed to parse OpenAI API response" },
      { status: 500 }
    );
  }

  const generatedText = data.choices?.[0]?.message?.content || "";

  let suggestions = {};
  try {
    suggestions = JSON.parse(generatedText);
  } catch (e) {
    console.error("Failed to parse generated content:", e);
    return NextResponse.json(
      { error: "Failed to parse generated content", raw: generatedText },
      { status: 500 }
    );
  }

  // Map the response to match the form fields exactly
  const mappedResponse = {
    title: suggestions.title || "",
    shortDescription: suggestions.description || "",
    fullDescription: `${suggestions.description}\n\n${suggestions.safetyTips?.join("\n") || ""}\n\n${suggestions.localCustoms?.join("\n") || ""}\n\n${suggestions.photographyTips?.join("\n") || ""}\n\n${suggestions.weatherConsiderations?.join("\n") || ""}`,
    highlights: [
      suggestions.category,
      suggestions.difficulty,
      suggestions.priceRange,
      suggestions.accessibility,
      suggestions.groupSize
    ].filter(Boolean),
    inclusions: suggestions.requiredItems?.split(",").map((item: string) => item.trim()) || [],
    exclusions: [],
    locations: [suggestions.location].filter(Boolean),
    keywords: suggestions.keywords?.split(",").map((kw: string) => kw.trim()) || [],
  };

  return NextResponse.json(mappedResponse);
} 
export async function analyzeMedicineImage(apiKey: string, base64Image: string): Promise<MedicineInfo> {
  const base64Data = base64Image.split(",")[1]

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are an AI pharmacist assistant. Analyze the medicine image and provide the following information:
                1. Name of the medicine
                2. Type of medicine (e.g., antibiotic, painkiller, etc.)
                3. Brief description of what it is
                4. Typical dosage information
                5. What diseases or conditions it's commonly used to treat
                
                Format your response as a JSON object with the following structure:
                {
                  "name": "Medicine Name",
                  "type": "Medicine Type",
                  "description": "Brief description",
                  "dosage": "Typical dosage information",
                  "disease": "Diseases or conditions treated"
                }
                
                Only respond with the JSON object, no additional text.`,
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 2048,
        },
      }),
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`)
  }

  const data = await response.json()

  // Extract JSON from text response safely
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
  const jsonMatch = textContent.match(/\{[\s\S]*\}/)

  if (!jsonMatch) {
    console.error("Failed to extract JSON from Gemini response:", textContent)
    throw new Error("Failed to parse medicine information")
  }

  try {
    return JSON.parse(jsonMatch[0]) // Parse only the extracted JSON
  } catch (error) {
    console.error("Failed to parse JSON:", jsonMatch[0])
    throw new Error("Failed to parse medicine information")
  }
}

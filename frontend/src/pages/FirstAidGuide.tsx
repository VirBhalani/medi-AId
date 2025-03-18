import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Search } from "lucide-react";
import "./FirstAidGuide.css";

const genAI = new GoogleGenerativeAI("AIzaSyCWiXTEKkEj99kP6CYUqFM6GzuWRWqobVw");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const commonSymptoms = ["Headache", "Fever", "Cough", "Nausea", "Dizziness", "Stomach pain"];

function FirstAidGuide() {
  const [symptoms, setSymptoms] = useState("");
  const [guidance, setGuidance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getMedicalGuidance = async () => {
    if (!symptoms) return;
    setIsLoading(true);
    setGuidance(null);

    try {
        const prompt = `Analyze the following symptom(s): '${symptoms}' and provide a structured first-aid guide in strict JSON format with the following keys:
        {
          "disease": ["Possible disease names based on symptoms"],
          "medicines": ["List of commonly suggested medicines for this condition"],
          "steps": ["Step-by-step first aid instructions"],
          "disclaimer": "A standard medical disclaimer"
        }
        Ensure that the response is in valid JSON format without any extra text.`;
        

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      let responseText = await result.response.text();

      // Remove potential markdown formatting for JSON
      responseText = responseText.replace(/```json|```/g, "").trim();

      const jsonResponse = JSON.parse(responseText);

      // Ensure all expected properties exist
      setGuidance({
        disease: jsonResponse.disease || ["Not identified"],
        medicines: jsonResponse.medicines || ["No specific medicines recommended."],
        steps: jsonResponse.steps || ["No first aid steps available."],
        disclaimer: jsonResponse.disclaimer || "This information is not medical advice.",
      });
      

    } catch (error) {
      console.error("Error fetching medical guidance:", error);
      setGuidance({
        disease: ["Error fetching data"],
        medicines: ["Error fetching data"],
        steps: ["Unable to fetch guidance."],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="first-aid-container">
      <header className="first-aid-header">
        <h1>🚑 First Aid Guide</h1>
        <p>Enter symptoms or select a common one to get first aid advice.</p>
      </header>

      <div className="common-symptoms">
        {commonSymptoms.map((symptom) => (
          <button key={symptom} onClick={() => setSymptoms(symptom)} className="symptom-btn">
            {symptom}
          </button>
        ))}
      </div>

      <div className="search-section">
        <input
          type="text"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Enter symptoms (e.g., headache, nausea)..."
          className="search-input"
        />
        <button
          onClick={getMedicalGuidance}
          disabled={!symptoms || isLoading}
          className="search-btn"
        >
          {isLoading ? "Fetching..." : <><Search className="search-icon" /> Search</>}
        </button>
      </div>

      {guidance && (
        <div className="response-container">
          <div className="response-card">
            <h3>🏥 Possible Diseases</h3>
            <p>{Array.isArray(guidance.disease) ? guidance.disease.join(", ") : guidance.disease}</p>
          </div>

          <div className="response-card">
            <h3>💊 Suggested Medicines</h3>
            <p>{Array.isArray(guidance.medicines) ? guidance.medicines.join(", ") : guidance.medicines}</p>
          </div>

          <div className="response-card">
            <h3>📖 First Aid Steps</h3>
            {Array.isArray(guidance.steps) && guidance.steps.length > 0 ? (
              <ol className="steps-list">
                {guidance.steps.map((step, index) => (
                  <li key={index} className="step-item">
                    {step.replace(/\*\*/g, "").replace(/^\d+\.\s*/, "")} {/* Removes bold formatting and extra numbering */}
                  </li>
                ))}
              </ol>
            ) : (
              <p>Follow general first aid precautions.</p>
            )}
          </div>

          <div className="disclaimer">
            ⚠️ <strong>Disclaimer:</strong> {guidance.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
}

export default FirstAidGuide;

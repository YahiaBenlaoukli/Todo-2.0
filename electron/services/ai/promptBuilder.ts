export const ROADMAP_SCHEMA = {
    example: {
        roadmap: { name: "...", created_at: "..." },
        nodes: [
            {
                id: 1,
                type_id: 4,
                title: "Start Here",
                content: "...",
                position_x: 300,
                position_y: 100,
                created_at: "..."
            }
        ],
        edges: [
            { source: 1, target: 2, type_id: 3, created_at: "..." }
        ]
    }
};

export const NODE_TYPES = `
- type_id 1 = Regular topic/step node
- type_id 2 = Important note/warning node  
- type_id 3 = Resource/link node
- type_id 4 = Milestone node (start, checkpoint, or end)
`;

export const EDGE_TYPES = `
- type_id 3 = Standard directional connection
`;

export const LAYOUT_RULES = `
- Position nodes top-to-bottom (y increases downward, ~150px vertical spacing)
- Branch nodes horizontally (~200px apart on x axis)
- Start node: position_x ~300, position_y ~100
- All coordinates must be positive integers
`;

export const STRUCTURE_RULES = `
- Every roadmap MUST start with a type_id 4 "Start Here" milestone node
- Every roadmap MUST end with a type_id 4 milestone node
- Add type_id 2 warning nodes near relevant topics for important caveats
- Add type_id 3 resource nodes with real documentation URLs
- All edges must reference valid node id values
- Node ids must be sequential integers starting from 1
- Aim for 10-15 nodes for a comprehensive roadmap
`;

/**
 * Generates a prompt for creating a learning roadmap
 * @param {string} topic - The subject to build a roadmap for
 * @param {string} [difficulty="beginner"] - Target difficulty level
 * @param {string} [focus=""] - Optional specific focus area
 * @returns {string} Complete prompt string
 */
export function buildRoadmapPrompt(topic: string, difficulty: string = "beginner", focus: string = "") {
    const timestamp = new Date().toISOString();
    const focusInstruction = focus
        ? `Focus especially on: ${focus}.`
        : "";

    return `You are a roadmap generator. Generate a structured learning roadmap as JSON.

TOPIC: ${topic}
DIFFICULTY: ${difficulty}
${focusInstruction}

NODE TYPES:
${NODE_TYPES}

EDGE TYPES:
${EDGE_TYPES}

LAYOUT RULES:
${LAYOUT_RULES}

STRUCTURE RULES:
${STRUCTURE_RULES}

TIMESTAMP: Use exactly "${timestamp}" for all created_at fields.

OUTPUT FORMAT (return ONLY this JSON, no markdown, no explanation):
{
  "roadmap": {
    "name": "${topic}",
    "created_at": "${timestamp}"
  },
  "nodes": [
    {
      "id": 1,
      "type_id": 4,
      "title": "Start Here",
      "content": "Begin your ${topic} journey!",
      "position_x": 300,
      "position_y": 100,
      "created_at": "${timestamp}"
    }
  ],
  "edges": [
    { "source": 1, "target": 2, "type_id": 3, "created_at": "${timestamp}" }
  ]
}

Return ONLY raw JSON. No \`\`\`json fences. No preamble. No explanation.`;
}

/**
 * Generates a repair prompt when the first response fails validation
 * @param {string} originalPrompt - The original prompt that was sent
 * @param {string} badOutput - The invalid JSON returned by the model
 * @param {string[]} errors - List of validation error messages
 * @returns {string} Repair prompt
 */
export function buildRepairPrompt(originalPrompt: string, badOutput: string, errors: string[]) {
    return `Your previous response had the following validation errors:

ERRORS:
${errors.map((e, i) => `${i + 1}. ${e}`).join("\n")}

YOUR PREVIOUS (INVALID) RESPONSE:
${badOutput}

ORIGINAL INSTRUCTIONS:
${originalPrompt}

Fix ALL errors and return ONLY the corrected raw JSON. No markdown. No explanation.`;
}
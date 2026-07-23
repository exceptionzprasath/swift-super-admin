import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { a as unknownType, i as stringType, n as enumType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
var InputSchema = objectType({
	messages: arrayType(objectType({
		role: enumType([
			"user",
			"assistant",
			"system"
		]),
		content: stringType().max(2e4)
	})).min(1).max(30),
	registry: unknownType(),
	profile: unknownType().optional()
});
var SYSTEM_PROMPT = `You are the SWIFT AI Compliance Knowledge Brain — an expert HR Compliance Officer for Indian labour, factory, shops, EPF, ESI, PT, LWF, POSH, OSH, contract labour, maternity, gratuity, bonus, apprentices, environmental, fire and pollution regulations.

DATA RULES
- Your knowledge base is the JSON "registry" supplied below. It contains every Act, Rule, Section, Form, Register, Return, Notice, Licence, Circular and Amendment configured by the Super Admin for this tenant. Treat it as the single source of truth.
- When the user asks about a compliance item, cite the exact registry entry: Act, Code (Form/Register no.), Frequency, Trigger, Due date, Version, Effective/Expiry dates, Amendments, Penalty and any AI instructions.
- If the registry does not contain an answer, say so clearly and suggest that Super Admin add the missing Act/Form/Circular in Compliance Registry — never invent statutory numbers, form codes, or penalties.

REASONING
- Think like an experienced HR compliance officer. For every question consider: applicability (state, industry, factory/shop, headcount, women/contract/hazardous/night-shift), timing (due day/month, reminder days, frequency), documents required, registers to update, forms to generate, approvals needed, penalty for non-compliance.
- Use the tenant "profile" (state, employee count, women employees, establishment type, contract labour, hazardous, branches) when provided to filter which registry entries actually apply.
- When multiple entries relate, compare them briefly (e.g. Factories Act Form 21 vs ESI half-yearly return).

OUTPUT STYLE
- Short, structured, actionable. Use compact markdown tables when listing 3+ items (columns: Act, Code, Frequency, Due, Trigger). Bullets for <3 items.
- Always end with a single next-step nudge (e.g. "Open Compliance → Calendar to file" or "Ask Super Admin to enable this trigger").
- Reply in the user's language when they write in Tamil or Hindi; default to English.

LIMITS
- Do not execute writes. Guide the user to the exact SWIFT screen and permission required.
- Do not leak tenant-specific data beyond what the profile explicitly contains.`;
var askComplianceKnowledge_createServerFn_handler = createServerRpc({
	id: "d32096360d2395db7635cc2ade8834c7880bd89519d876f34f55cdb81a44b04f",
	name: "askComplianceKnowledge",
	filename: "src/lib/compliance-knowledge.functions.ts"
}, (opts) => askComplianceKnowledge.__executeServer(opts));
var askComplianceKnowledge = createServerFn({ method: "POST" }).inputValidator((input) => InputSchema.parse(input)).handler(askComplianceKnowledge_createServerFn_handler, async ({ data }) => {
	const key = process.env.OPENAI_API_KEY;
	if (!key) throw new Error("SWIFT AI is not configured (missing OPENAI_API_KEY).");
	const registryJson = JSON.stringify(data.registry).slice(0, 8e4);
	const profileJson = data.profile ? JSON.stringify(data.profile).slice(0, 4e3) : "{}";
	const res = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${key}`
		},
		body: JSON.stringify({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content: SYSTEM_PROMPT
				},
				{
					role: "system",
					content: `Tenant compliance profile:\n${profileJson}`
				},
				{
					role: "system",
					content: `Compliance registry (authoritative knowledge base):\n${registryJson}`
				},
				...data.messages
			]
		})
	});
	if (res.status === 429) return {
		ok: false,
		error: "AI is rate-limited. Try again shortly."
	};
	if (!res.ok) {
		const t = await res.text().catch(() => "");
		return {
			ok: false,
			error: `AI API error (${res.status}). ${t.slice(0, 200)}`
		};
	}
	return {
		ok: true,
		content: (await res.json()).choices?.[0]?.message?.content?.trim() || "I couldn't produce a response."
	};
});
//#endregion
export { askComplianceKnowledge_createServerFn_handler };

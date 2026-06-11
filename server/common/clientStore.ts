import { db } from "../db/db-pgp";

/** Client profile fields are stored in intake_responses for this form. */
export const CLIENT_FORM_ID = 5;

const API_FIELD_ALIASES: Record<string, string> = {
  date_of_birth: "date_of_birth_1",
  age: "age_1",
  phone_number: "phone_number_1",
  email: "email_1",
};

type QuestionRow = { id: number; field_key: string; question_type: string };
type QuestionInfo = { id: number; type: string };

const CLIENT_FIELD_KEYS = [
  "created_by",
  "unit_name",
  "grant",
  "status",
  "first_name",
  "last_name",
  "date_of_birth",
  "age",
  "phone_number",
  "email",
  "emergency_contact_name",
  "emergency_contact_phone_number",
  "medical",
  "entrance_date",
  "estimated_exit_date",
  "exit_date",
  "bed_nights",
  "bed_nights_children",
  "pregnant_upon_entry",
  "disabled_children",
  "ethnicity",
  "race",
  "city_of_last_permanent_residence",
  "prior_living",
  "prior_living_city",
  "shelter_in_last_five_years",
  "homelessness_length",
  "chronically_homeless",
  "attending_school_upon_entry",
  "employement_gained",
  "reason_for_leaving",
  "specific_reason_for_leaving",
  "specific_destination",
  "savings_amount",
  "attending_school_upon_exit",
  "reunified",
  "successful_completion",
  "destination_city",
  "comments",
] as const;

export type ClientFieldKey = (typeof CLIENT_FIELD_KEYS)[number];
export type ClientFields = Partial<Record<ClientFieldKey, unknown>>;

let questionMapCache: Map<string, QuestionInfo> | null = null;

async function getQuestionMap(): Promise<Map<string, QuestionInfo>> {
  if (questionMapCache) {
    return questionMapCache;
  }

  const questions = await db.query<QuestionRow>(
    `SELECT id, field_key, question_type FROM form_questions WHERE form_id = $1`,
    [CLIENT_FORM_ID]
  );

  const map = new Map<string, QuestionInfo>();
  for (const q of questions) {
    map.set(q.field_key, { id: q.id, type: q.question_type });
  }
  questionMapCache = map;
  return map;
}

function resolveFormFieldKey(apiField: string, questionMap: Map<string, QuestionInfo>): string | null {
  if (questionMap.has(apiField)) {
    return apiField;
  }

  const alias = API_FIELD_ALIASES[apiField];
  if (alias && questionMap.has(alias)) {
    return alias;
  }

  const suffixed = `${apiField}_1`;
  if (questionMap.has(suffixed)) {
    return suffixed;
  }

  return null;
}

function normalizeDateString(raw: string): string | null {
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  // ISO timestamp: 2026-02-23T00:00:00.000Z → 2026-02-23
  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) return raw.slice(0, 10);
  // M/D/YYYY or M-D-YYYY
  const mdy = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (mdy) return `${mdy[3]}-${mdy[1].padStart(2, "0")}-${mdy[2].padStart(2, "0")}`;
  // Full JS Date string: "Mon Feb 23 2026 00:00:00 GMT-0800 (...)"
  const jsDateMatch = raw.match(/^(\w{3} \w{3} \d{1,2} \d{4})/);
  if (jsDateMatch) {
    const d = new Date(jsDateMatch[1]);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  return null;
}

function valueToString(value: unknown, questionType: string): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "boolean") {
    return value ? "yes" : "no";
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (questionType === "boolean" && (value === "true" || value === "false")) {
    return value === "true" ? "yes" : "no";
  }

  const str = String(value);

  if (questionType === "date") {
    return normalizeDateString(str.trim());
  }

  return str;
}

async function newSessionId(): Promise<string> {
  const rows = await db.query<{ session_id: string }>(
    "SELECT uuid_generate_v4()::text AS session_id"
  );
  return rows[0].session_id;
}

async function upsertClientField(
  clientId: number,
  apiField: string,
  value: unknown,
  questionMap: Map<string, QuestionInfo>,
  sessionId: string,
  onlyIfProvided = false
): Promise<void> {
  if (onlyIfProvided && value === undefined) {
    return;
  }

  const formFieldKey = resolveFormFieldKey(apiField, questionMap);
  if (!formFieldKey) {
    return;
  }

  const question = questionMap.get(formFieldKey);
  if (!question) {
    return;
  }

  const stringValue = valueToString(value, question.type);
  const existing = await db.query<{ id: number; response_value: string | null }>(
    `SELECT id, response_value
     FROM intake_responses
     WHERE client_id = $1 AND question_id = $2 AND form_id = $3
     LIMIT 1`,
    [clientId, question.id, CLIENT_FORM_ID]
  );

  if (existing.length > 0) {
    const nextValue =
      onlyIfProvided && value === null ? existing[0].response_value : stringValue;
    await db.query(
      `UPDATE intake_responses
       SET response_value = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [nextValue, existing[0].id]
    );
    return;
  }

  if (stringValue === null) {
    return;
  }

  await db.query(
    `INSERT INTO intake_responses (client_id, question_id, response_value, form_id, session_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [clientId, question.id, stringValue, CLIENT_FORM_ID, sessionId]
  );
}

async function writeClientFields(
  clientId: number,
  fields: ClientFields,
  options: { onlyIfProvided?: boolean } = {}
): Promise<void> {
  const questionMap = await getQuestionMap();
  const sessionId = await newSessionId();

  for (const apiField of CLIENT_FIELD_KEYS) {
    const value = fields[apiField];
    if (options.onlyIfProvided && value === undefined) {
      continue;
    }
    await upsertClientField(clientId, apiField, value, questionMap, sessionId, options.onlyIfProvided);
  }
}

export async function createClient(fields: ClientFields): Promise<number> {
  const rows = await db.query<{ id: number }>(
    "INSERT INTO clients_base DEFAULT VALUES RETURNING id"
  );
  const clientId = rows[0].id;
  await writeClientFields(clientId, fields);
  return clientId;
}

export async function updateClient(clientId: number, fields: ClientFields): Promise<void> {
  await writeClientFields(clientId, fields, { onlyIfProvided: true });
}

export async function deleteClient(clientId: number): Promise<void> {
  await db.query("DELETE FROM intake_responses WHERE client_id = $1", [clientId]);
  await db.query("DELETE FROM clients_base WHERE id = $1", [clientId]);
}

export async function clearClientsCreatedBy(caseManagerId: number): Promise<void> {
  const questionMap = await getQuestionMap();
  const formFieldKey = resolveFormFieldKey("created_by", questionMap);
  if (!formFieldKey) {
    return;
  }

  const question = questionMap.get(formFieldKey);
  if (!question) {
    return;
  }

  await db.query(
    `UPDATE intake_responses
     SET response_value = NULL, updated_at = CURRENT_TIMESTAMP
     WHERE form_id = $1
       AND question_id = $2
       AND response_value = $3`,
    [CLIENT_FORM_ID, question.id, String(caseManagerId)]
  );
}

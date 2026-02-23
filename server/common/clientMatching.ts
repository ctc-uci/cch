import { db } from "../db/db-pgp";

/**
 * Normalizes phone numbers by removing all non-digit characters
 */
function normalizePhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

/**
 * Normalizes names by trimming and converting to lowercase
 */
function normalizeName(name: string | null | undefined): string {
  if (!name) return "";
  return name.trim().toLowerCase();
}

/**
 * Normalizes date of birth for comparison
 * Handles both date objects and string dates
 * Returns date in YYYY-MM-DD format or empty string if invalid
 */
function normalizeDateOfBirth(dob: string | Date | null | undefined): string {
  if (!dob) return "";
  
  // If it's already a date string, try to parse and normalize
  if (typeof dob === "string") {
    const trimmed = dob.trim();
    
    // If it's already in YYYY-MM-DD format, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    
    // Try to parse as date and format as YYYY-MM-DD
    try {
      const date = new Date(trimmed);
      if (!isNaN(date.getTime())) {
        const isoString = date.toISOString().split("T")[0];
        return isoString || "";
      }
    } catch {
      // If parsing fails, return empty string (invalid date)
      return "";
    }
  }
  
  // If it's a Date object
  if (dob instanceof Date) {
    if (!isNaN(dob.getTime())) {
      const isoString = dob.toISOString().split("T")[0];
      return isoString || "";
    }
    return "";
  }
  
  // For other types, try to convert
  try {
    const date = new Date(String(dob));
    if (!isNaN(date.getTime())) {
      const isoString = date.toISOString().split("T")[0];
      return isoString || "";
    }
  } catch {
    // Invalid date
  }
  
  return "";
}

/**
 * Matches a client in the clients table based on first_name, last_name, phone_number, and date_of_birth
 * Returns the client ID if a match is found, null otherwise
 * 
 * @param firstName - First name from form submission
 * @param lastName - Last name from form submission
 * @param phoneNumber - Phone number from form submission
 * @param dateOfBirth - Date of birth from form submission
 * @returns Promise<number | null> - The matched client ID or null if no match
 */
export async function matchClient(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  phoneNumber: string | null | undefined,
  dateOfBirth: string | Date | null | undefined
): Promise<number | null> {
  // If any required field is missing, cannot match
  if (!firstName || !lastName || !phoneNumber || !dateOfBirth) {
    return null;
  }

  const normalizedFirstName = normalizeName(firstName);
  const normalizedLastName = normalizeName(lastName);
  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  const normalizedDob = normalizeDateOfBirth(dateOfBirth);

  // If normalization resulted in empty strings, cannot match
  if (!normalizedFirstName || !normalizedLastName || !normalizedPhone || !normalizedDob) {
    return null;
  }

  try {
    // Query to find matching client
    // We normalize both sides for comparison
    // For date comparison, try both text and date casting to handle various formats
    const result = await db.query(
      `SELECT id FROM clients
       WHERE LOWER(TRIM(first_name)) = $1
         AND LOWER(TRIM(last_name)) = $2
         AND REGEXP_REPLACE(phone_number, '[^0-9]', '', 'g') = $3
         AND (
           date_of_birth::date = $4::date
           OR date_of_birth::text = $4
         )
       LIMIT 1`,
      [normalizedFirstName, normalizedLastName, normalizedPhone, normalizedDob]
    );

    if (result.length > 0) {
      return result[0].id;
    }

    // Log for debugging if no match found
    console.error("No client match found for:", {
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      phoneNumber: normalizedPhone,
      dateOfBirth: normalizedDob
    });

    return null;
  } catch (error) {
    console.error("Error matching client:", error);
    console.error("Matching parameters:", {
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      phoneNumber: normalizedPhone,
      dateOfBirth: normalizedDob
    });
    return null;
  }
}

/**
 * Extracts client matching fields from form data
 * Handles various field key formats (camelCase, snake_case, etc.)
 */
export function extractClientFields(formData: Record<string, unknown>): {
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | Date | null;
} {
  // Try various field key formats using "contains" matching
  // This allows matching field keys like "what_is_your_first_name" by searching for keys containing "first" and "name"
  // Excludes secondary person fields (child, father, mother, spouse, etc.) to only match the primary person
  const getValueByContains = (searchTerms: string[][], excludeTerms: string[] = []): string | null => {
    // searchTerms is an array of arrays, where each inner array contains terms that must all be present
    // e.g., [['first', 'name']] means the key must contain both "first" AND "name"
    // excludeTerms are terms that, if present, should exclude this field (e.g., "child", "father", "mother")
    
    // Default exclusion terms for secondary person fields
    const defaultExcludeTerms = ['child', 'children', 'father', 'mother', 'parent', 'spouse', 'partner', 'guardian', 'emergency'];
    const allExcludeTerms = [...defaultExcludeTerms, ...excludeTerms.map(t => t.toLowerCase())];
    
    for (const termGroup of searchTerms) {
      for (const [key, value] of Object.entries(formData)) {
        const lowerKey = key.toLowerCase();
        
        // Check if all terms in this group are present in the key
        const allTermsMatch = termGroup.every(term => lowerKey.includes(term.toLowerCase()));
        
        // Exclude if key contains any exclusion terms (indicating it's not the primary person)
        const containsExcludedTerm = allExcludeTerms.some(excludeTerm => lowerKey.includes(excludeTerm));
        
        if (allTermsMatch && !containsExcludedTerm && value !== undefined && value !== null && value !== "") {
          const strValue = String(value).trim();
          if (strValue !== "") {
            // Return the first valid match found
            return strValue;
          }
        }
      }
    }
    return null;
  };

  // Try to find firstName - keys containing "first" and "name"
  const firstName = getValueByContains([
    ['first', 'name'],  // Matches: firstName, first_name, what_is_your_first_name, etc.
  ]);

  // Try to find lastName - keys containing "last" and "name"
  // Exclude keys that also contain "first" to avoid matching firstName fields
  const lastName = getValueByContains([
    ['last', 'name'],  // Matches: lastName, last_name, what_is_your_last_name, what_is_your_last_name_1, etc.
  ]);

  // Try to find phoneNumber - keys containing "phone"
  const phoneNumber = getValueByContains([
    ['phone'],  // Matches: phoneNumber, phone_number, what_is_your_phone_number, etc.
  ]);

  // Try to find dateOfBirth - keys containing "birth" or "dob"
  const dateOfBirth = getValueByContains([
    ['date', 'birth'],  // Matches: dateOfBirth, date_of_birth, what_is_your_date_of_birth, etc.
    ['dob'],            // Matches: dob, clientDob, etc.
  ]) as string | Date | null;
  
  return {
    firstName,
    lastName,
    phoneNumber,
    dateOfBirth,
  };
}

/** Same four fields used by matchClient and extractClientFields for client matching */
export type ClientMatchingFields = {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  phoneNumber: string | null | undefined;
  dateOfBirth: string | Date | null | undefined;
};

/**
 * Finds unassigned intake_responses session_ids whose stored responses match the given client.
 * Uses the same parameters as matchClient: first name, last name, phone number, date of birth.
 * Used when creating a new client to link previously submitted forms that had no matching client.
 */
export async function findUnassignedSessionIdsMatchingClient(
  fields: ClientMatchingFields
): Promise<string[]> {
  const { firstName, lastName, phoneNumber, dateOfBirth } = fields;
  const nFirst = normalizeName(firstName);
  const nLast = normalizeName(lastName);
  const nPhone = normalizePhoneNumber(phoneNumber);
  const nDob = normalizeDateOfBirth(dateOfBirth);
  if (!nFirst || !nLast || !nPhone || !nDob) return [];

  try {
    const rows = await db.query(
      `SELECT ir.session_id, fq.field_key, ir.response_value
       FROM intake_responses ir
       JOIN form_questions fq ON fq.id = ir.question_id
       WHERE ir.client_id IS NULL AND ir.session_id IS NOT NULL`
    );

    const bySession = new Map<string, Record<string, string>>();
    for (const r of rows as { session_id: string; field_key: string; response_value: string | null }[]) {
      const sid = r.session_id;
      if (!bySession.has(sid)) bySession.set(sid, {});
      const val = r.response_value !== null && r.response_value !== undefined ? String(r.response_value).trim() : "";
      if (val !== "") bySession.get(sid)![r.field_key] = val;
    }

    const matchingSessions: string[] = [];
    for (const [sessionId, formData] of bySession) {
      const extracted = extractClientFields(formData);
      if (
        normalizeName(extracted.firstName) === nFirst &&
        normalizeName(extracted.lastName) === nLast &&
        normalizePhoneNumber(extracted.phoneNumber) === nPhone &&
        normalizeDateOfBirth(extracted.dateOfBirth) === nDob
      ) {
        matchingSessions.push(sessionId);
      }
    }
    return matchingSessions;
  } catch (err) {
    console.error("findUnassignedSessionIdsMatchingClient error:", err);
    return [];
  }
}


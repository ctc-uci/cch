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
    console.log("No client match found for:", {
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
  // Try various field key formats (check both camelCase and snake_case)
  // Also handle empty strings as null
  const getValue = (keys: string[]): string | null => {
    for (const key of keys) {
      const value = formData[key];
      if (value !== undefined && value !== null && value !== "") {
        const strValue = String(value).trim();
        if (strValue !== "") {
          return strValue;
        }
      }
    }
    return null;
  };

  const firstName = getValue([
    'firstName', 'first_name', 'firstname', 'first name'
  ]);

  // Check multiple variations including the snake_case question format
  const lastName = getValue([
    'lastName', 
    'last_name', 
    'lastname', 
    'last name',
    'what_is_your_last_name',  // Add the actual field key from the form
    'whatIsYourLastName'        // camelCase version
  ]);

  const phoneNumber = getValue([
    'phoneNumber', 
    'phone_number', 
    'phone'
  ]);

  const dateOfBirth = getValue([
    'dateOfBirth', 
    'date_of_birth', 
    'dob', 
    'birthDate', 
    'birth_date'
  ]) as string | Date | null;

  // Log extracted fields for debugging (only if fields are missing)
  if (!firstName || !lastName || !phoneNumber || !dateOfBirth) {
    // Check actual values for debugging
    const lastNameValues = {
      lastName: formData.lastName,
      last_name: formData.last_name,
      what_is_your_last_name: formData.what_is_your_last_name,
    };
    
    console.log("Missing client fields - extracted:", {
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      lastNameValues, // Show actual values
      availableKeys: Object.keys(formData).filter(k => 
        k.toLowerCase().includes('name') || 
        k.toLowerCase().includes('phone') || 
        k.toLowerCase().includes('birth') ||
        k.toLowerCase().includes('dob')
      ),
    });
  }

  return {
    firstName,
    lastName,
    phoneNumber,
    dateOfBirth,
  };
}


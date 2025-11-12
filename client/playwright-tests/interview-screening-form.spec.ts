import { test, expect } from '@playwright/test';

// Configure test to run in headed mode (visible browser window)
test.use({ 
  headless: false,
  // Set viewport size
  viewport: { width: 1280, height: 720 },
});


test.describe('Interview Screening Form Flow', () => {
  test('should fill out entire form flow from personal to additional', async ({ page }) => {
    // Listen to console messages (client-side logs)
    page.on('console', msg => {
      console.log(`[Browser Console ${msg.type()}]:`, msg.text());
    });

    // Listen to page errors
    page.on('pageerror', error => {
      console.error(`[Page Error]:`, error.message);
    });

    // Listen to network requests
    page.on('request', request => {
      console.log(`[Request] ${request.method()} ${request.url()}`);
    });

    // Listen to network responses
    page.on('response', response => {
      const status = response.status();
      const url = response.url();
      const statusEmoji = status >= 200 && status < 300 ? '✅' : status >= 400 ? '❌' : '⚠️';
      console.log(`${statusEmoji} [Response] ${status} ${response.request().method()} ${url}`);
    });

    // Navigate to the personal information page
    await page.goto('http://localhost:3000/personal');

    // Wait for the form to be visible
    await expect(page.locator('h1:has-text("Personal Information")')).toBeVisible({ timeout: 10000 });

    // Wait for the form container to be ready
    await page.waitForSelector('.personal-information-form', { state: 'visible' });

    // Fill out Personal Information form
    // Since labels are not properly associated with inputs, we'll find inputs by their position
    // or by finding them near their labels
    
    // First Name - find input that comes after label with "first name"
    const firstNameInput = page.locator('label:has-text("first name"), label:has-text("nombre")').locator('..').locator('input').first();
    await firstNameInput.waitFor({ state: 'visible' });
    await firstNameInput.fill('John');
    
    // Last Name
    const lastNameInput = page.locator('label:has-text("last name"), label:has-text("apellido")').locator('..').locator('input').first();
    await lastNameInput.fill('Doe');
    
    // Date of Birth
    const dobInput = page.locator('label:has-text("Date of birth"), label:has-text("Fecha de nacimiento")').locator('..').locator('input[type="date"]').first();
    await dobInput.fill('1990-01-15');
    
    // Age - find the age input (not the children age field)
    // Use the full question text to uniquely identify the adult age field
    const ageInput = page.locator('label:has-text("What is your age"), label:has-text("¿Cuál es tu edad")').first().locator('..').locator('input[type="number"]').first();
    await ageInput.fill('34');
    
    // Ethnicity
    const ethnicityInput = page.locator('label:has-text("ethnicity"), label:has-text("etnia")').locator('..').locator('input').first();
    await ethnicityInput.fill('Hispanic');
    
    // Phone Number
    const phoneInput = page.locator('label:has-text("Phone number"), label:has-text("Número de teléfono")').locator('..').locator('input[type="tel"]').first();
    await phoneInput.fill('7145551234');
    
    // Email
    const emailInput = page.locator('label:has-text("Email"), label:has-text("^Correo electrónico$")').locator('..').locator('input[type="email"]').first();
    await emailInput.fill('john.doe@example.com');
    
    // SSN Last Four
    const ssnInput = page.locator('label:has-text("last four digits"), label:has-text("últimos cuatro dígitos")').locator('..').locator('input[type="number"]').first();
    await ssnInput.fill('1234');
    
    // City
    const cityInput = page.locator('label:has-text("city do you live"), label:has-text("ciudad vives")').locator('..').locator('input').first();
    await cityInput.fill('Irvine');
    
    // Veteran - select "No" radio button
    // The radio input is visually hidden, so we need to click the label that wraps it
    const veteranStack = page.locator('label:has-text("Are you a U.S. Veteran?"), label:has-text("veterano")').first().locator('..');
    const noRadioLabel = veteranStack.locator('label.chakra-radio').filter({ hasText: /^No$/ }).first();
    await noRadioLabel.click();
    
    // // Disabled - select "No" radio button
    const disabledStack = page.locator('label:has-text("Do you have any disabilities?"), label:has-text("discapacidad")').first().locator('..');
    const disabledNoRadioLabel = disabledStack.locator('label.chakra-radio').filter({ hasText: /^No$/ }).first();
    await disabledNoRadioLabel.click();
    
    // Current Address
    const currentAddressInput = page.locator('label:has-text("What is your current address?"), label:has-text("dirección actual")').locator('..').locator('input').first();
    await currentAddressInput.fill('123 Main St, Irvine, CA 92602');
    
    // Last Permanent Address
    const lastAddressInput = page.locator('label:has-text("What was your previous address?"), label:has-text("dirección anterior")').locator('..').locator('input').first();
    await lastAddressInput.fill('456 Oak Ave, Los Angeles, CA 90001');
    
    // Reason for Leaving
    const reasonInput = page.locator('label:has-text("What was the reason for leaving prior address?"), label:has-text("razón para dejar")').locator('..').locator('input').first();
    await reasonInput.fill('Job relocation');
    
    // Where Reside Last Night
    const whereResideInput = page.locator('label:has-text("Where did you reside last night?"), label:has-text("residiste anoche")').locator('..').locator('input').first();
    await whereResideInput.fill('Emergency shelter');
    
    // Currently Homeless - select "Yes"
    // Find the Stack containing the label, then find the radio button by value
    const homelessStack = page.locator('label:has-text("Are you currently homeless?"), label:has-text("sin hogar")').first().locator('..');
    const homelessYesRadioLabel = homelessStack.locator('label.chakra-radio').filter({ hasText: /^Yes$/ }).first();
    await homelessYesRadioLabel.click();
    
    // Previous Application to CCH - select "No"
    const prevAppliedStack = page.locator('label:has-text("Have you applied to Colette\'s Children\'s Home before?"), label:has-text("solicitado a Colette")').first().locator('..');
    const prevAppliedNoRadioLabel = prevAppliedStack.locator('label.chakra-radio').filter({ hasText: /^No$/ }).first();
    await prevAppliedNoRadioLabel.click();
    
    // Previous Stay at CCH - select "No"
    const prevInCchStack = page.locator('label:has-text("Have you been in Colette\'s Children\'s Home shelter before?"), label:has-text("estado en el refugio")').first().locator('..');
    const prevInCchNoRadioLabel = prevInCchStack.locator('label.chakra-radio').filter({ hasText: /^No$/ }).first();
    await prevInCchNoRadioLabel.click();

    // Family Information Section
    // Father's Name
    const fatherNameInput = page.locator('label:has-text("What is your father\'s name?"), label:has-text("nombre de tu padre")').locator('..').locator('input').first();
    await fatherNameInput.fill('Robert Doe');
    
    // Number of Children - select "1"
    const childrenStack = page.locator('label:has-text("How many children do you have?"), label:has-text("Cuántos hijos")').first().locator('..');
    const childrenOneRadioLabel = childrenStack.locator('label.chakra-radio').filter({ hasText: /^1$/ }).first();
    await childrenOneRadioLabel.click();
    
    // Child Name
    const childNameInput = page.locator('label:has-text("What is your child\'s name?"), label:has-text("nombre de tu hijo")').locator('..').locator('input').first();
    await childNameInput.fill('Jane Doe');
    
    // Child DOB
    const childDobInput = page.locator('label:has-text("Child\'s date of birth"), label:has-text("Fecha de nacimiento del niño")').locator('..').locator('input[type="date"]').first();
    await childDobInput.fill('2015-06-20');
    
    // Children Age - get the second instance of "Age" (the children's age field)
    const childrenAgeInput = page.locator('label:has-text("Age"), label:has-text("^Edad$")').nth(1).locator('..').locator('input[type="number"]').first();
    await childrenAgeInput.fill('9');
    
    // Custody of Child - select "Yes"
    const custodySelect = page.locator('label:has-text("Custody of Child"), label:has-text("Custodia del niño")').first().locator('..').locator('select').first();
    await custodySelect.selectOption('yes');

    // Click Next button to go to Financial Information
    await page.getByRole('button', { name: /Next|Siguiente/i }).click();
    
    // Wait for Financial Information page
    await expect(page).toHaveURL(/.*\/financial/);
    await expect(page.locator('h1:has-text("Financial Information")')).toBeVisible();

    // Fill out Financial Information form
    await page.waitForSelector('.financial-information-form', { state: 'visible' });
    
    // Monthly Income
    const monthlyIncomeInput = page.locator('label:has-text("monthly income"), label:has-text("ingreso mensual")').locator('..').locator('input').first();
    await monthlyIncomeInput.fill('2500');
    
    // Sources of Income
    const sourcesInput = page.locator('label:has-text("sources of income"), label:has-text("fuentes de ingresos")').locator('..').locator('input').first();
    await sourcesInput.fill('Part-time job, food stamps');
    
    // Monthly Bills
    const monthlyBillsInput = page.locator('label:has-text("monthly bills"), label:has-text("facturas mensuales")').locator('..').locator('input').first();
    await monthlyBillsInput.fill('Rent, utilities, phone');
    
    // Estimated Amount of Bills
    const estimateInput = page.locator('label:has-text("Estimated amount"), label:has-text("Monto estimado")').locator('..').locator('input[type="number"]').first();
    await estimateInput.fill('1200');
    
    // Currently Employed - select "Yes" from dropdown
    const employedLabel = page.locator('label:has-text("currently employed"), label:has-text("actualmente empleado")').first();
    await employedLabel.locator('..').locator('select').first().selectOption('yes');
    
    // Last Employer
    const lastEmployerInput = page.locator('label:has-text("Last employer"), label:has-text("Último empleador")').locator('..').locator('input').first();
    await lastEmployerInput.fill('ABC Restaurant');
    
    // Education History
    const educationInput = page.locator('label:has-text("Education History"), label:has-text("Historial educativo")').locator('..').locator('input').first();
    await educationInput.fill('High School Diploma');
    
    // Date of Education
    const educationDateInput = page.locator('label:has-text("Date of Education"), label:has-text("Fecha de educación")').locator('..').locator('input[type="date"]').first();
    await educationDateInput.fill('2008-06-15');
    
    // Legal Resident - select "Yes" radio button
    const legalResidentStack = page.locator('label:has-text("legal U.S. resident"), label:has-text("residente legal")').first().locator('..');
    const legalResidentYesRadioLabel = legalResidentStack.locator('label.chakra-radio').filter({ hasText: /^Yes$/ }).first();
    await legalResidentYesRadioLabel.click();

    // Click Next button to go to Health and Social Information
    await page.getByRole('button', { name: /Next|Siguiente/i }).click();
    
    // Wait for Health and Social Information page
    await expect(page).toHaveURL(/.*\/health/);
    await expect(page.locator('h1:has-text("Health and Social Information")')).toBeVisible();

    // Fill out Health and Social Information form
    await page.waitForSelector('.healthSocial-information-form', { state: 'visible' });
    
    // Medical Conditions - select "No"
    const medicalStack = page.locator('label:has-text("medical conditions"), label:has-text("condición médica")').first().locator('..');
    const medicalNoRadioLabel = medicalStack.locator('label.chakra-radio').filter({ hasText: /^No$/ }).first();
    await medicalNoRadioLabel.click();
    
    // Medical Insurance - select "Yes"
    const insuranceStack = page.locator('label:has-text("insurance"), label:has-text("seguro médico")').first().locator('..');
    const insuranceYesRadioLabel = insuranceStack.locator('label.chakra-radio').filter({ hasText: /^Yes$/ }).first();
    await insuranceYesRadioLabel.click();
    
    // Domestic Violence History - select "No"
    const dvStack = page.locator('label:has-text("domestic violence"), label:has-text("violencia doméstica")').first().locator('..');
    const dvNoRadioLabel = dvStack.locator('label.chakra-radio').filter({ hasText: /^No$/ }).first();
    await dvNoRadioLabel.click();
    
    // Medical Conditions (text field)
    const medicalConditionsInput = page.locator('label:has-text("List your medical conditions"), label:has-text("Enumere sus condiciones médicas")').locator('..').locator('input').first();
    await medicalConditionsInput.fill('None');
    
    // Medications
    const medicationsInput = page.locator('label:has-text("take any medications"), label:has-text("toma algún medicamento")').locator('..').locator('input').first();
    await medicationsInput.fill('None');
    
    // Social Worker Name
    const socialWorkerInput = page.locator('label:has-text("social worker\'s name"), label:has-text("nombre de su trabajador social")').locator('..').locator('input').first();
    await socialWorkerInput.fill('Sarah Johnson');
    
    // Social Worker Telephone
    const socialWorkerPhoneInput = page.locator('label:has-text("Contact information of social worker"), label:has-text("Información de contacto del trabajador social")').locator('..').locator('input[type="tel"]').first();
    await socialWorkerPhoneInput.fill('7145555678');
    
    // Social Worker Office Location
    const socialWorkerOfficeInput = page.locator('label:has-text("Office location of social worker"), label:has-text("oficina del trabajador social")').locator('..').locator('input').first();
    await socialWorkerOfficeInput.fill('123 Social Services Blvd, Irvine, CA');

    // Click Next button to go to Additional Information
    await page.getByRole('button', { name: /Next|Siguiente/i }).click();
    
    // Wait for Additional Information page
    await expect(page).toHaveURL(/.*\/additional/);
    await expect(page.locator('h1:has-text("Additional Information")')).toBeVisible();

    // Fill out Additional Information form
    await page.waitForSelector('.additional-information-form', { state: 'visible' });
    
    // Future Plans and Goals
    const futurePlansTextarea = page.locator('label:has-text("future plans and goals"), label:has-text("planes y objetivos futuros")').locator('..').locator('textarea').first();
    await futurePlansTextarea.fill('I plan to find stable housing and continue my education to improve my job prospects.');
    
    // Last Permanent Resident Household Composition
    const householdTextarea = page.locator('label:has-text("Last permanent resident household composition"), label:has-text("Composición del hogar residente permanente anterior")').locator('..').locator('textarea').first();
    await householdTextarea.fill('Lived with spouse and one child in a two-bedroom apartment.');
    
    // Why No Longer at Last Residence
    const whyNotThereTextarea = page.locator('label:has-text("Reason why you\'re not there"), label:has-text("Razón por la que ya no está allí")').locator('..').locator('textarea').first();
    await whyNotThereTextarea.fill('Lost job and could not afford rent, leading to eviction.');
    
    // What Could Prevent Homeless
    const preventHomelessTextarea = page.locator('label:has-text("What could\'ve prevented you from being homeless"), label:has-text("Qué podría haber evitado que estuviera sin hogar")').locator('..').locator('textarea').first();
    await preventHomelessTextarea.fill('Having a stable job with higher income, emergency savings fund, and access to rental assistance programs.');

    // Verify we're on the additional information page
    await expect(page.locator('h1:has-text("Additional Information")')).toBeVisible();
    
    // Click Next button to go to Review page
    await page.getByRole('button', { name: /Next|Siguiente/i }).click();
    
    // Wait for Review page
    await expect(page).toHaveURL(/.*\/review/);
    
    // Keep the browser open for inspection
    await page.pause();
  });
});


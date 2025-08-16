// validationSchemas.ts
import { z } from "zod";

export const fieldSchemas: Record<string, z.ZodTypeAny> = {
    "repeatId": z.string().min(1, "Please select a repeat mode"),
    "duration": z.enum(["30mins", "1hour", "2hours"], {
        message: "Please select a valid duration",
    }),
    "timeSlot": z.string().min(1, "Please select a time slot"),
    "startDate": z.string().min(1, "Start date is required"),
    "endDate": z.string().min(1, "End date is required"),
    "customSlotArray": z
        .array(z.string().min(1))
        .min(1, "At least one custom slot is required"),

    // --- Medical Info ---
    "medicalInfo.diagnoses": z.string().min(1, "Diagnoses is required"),
    "medicalInfo.allergies": z.array(z.string().min(1)).min(1, "At least one allergy is required"),
    "medicalInfo.medications": z.array(z.string().min(1)).min(1, "At least one medication is required"),
    "medicalInfo.mobilityNotes": z.string().min(1,"Mobility Note is required"),
    "medicalInfo.emergencyPlan": z.string().min(1,"Emergency Plan is required"),

    // --- Carer ---
    "carrierId": z.string().min(1, "Please select a carer"),

    "personalInfo.dob": z.string().min(1, "Date of birth is required"),
    "personalInfo.name": z.string().min(2, "Name must be at least 2 characters"),
    "personalInfo.email": z.string().email("Invalid email"),
    "personalInfo.mobileNumber": z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
    "personalInfo.gender": z.enum(["Male", "Female", "Other"], {
        message: "Please select a gender",
    }),
    "personalInfo.typeOfCare": z.string().min(1, "Type of care is required"),
    "relationInfo.relativeName": z.string().min(2, "Family member name is required"),
    "relationInfo.relativeRelation": z.string().min(2, "Relation is required"),
    "relationInfo.relativeNumber": z.string().regex(/^[0-9]{10}$/, "Contact number must be 10 digits"),
    "address.street": z.string().min(3, "Street is required"),
    "address.suburb": z.string().min(2, "Suburb is required"),
    "address.state": z.string().min(2, "State is required"),
    "address.postCode": z.string().regex(/^[0-9]{4,6}$/, "Postcode must be 4–6 digits"),
    "ndis.ndisNumber": z.string().min(5, "NDIS number is required"),
    "ndis.ndisType": z.string().min(1, "NDIS type is required"),
};

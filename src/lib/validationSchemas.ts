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
    "medicalInfo.mobilityNotes": z.string().min(1, "Mobility Note is required"),
    "medicalInfo.emergencyPlan": z.string().min(1, "Emergency Plan is required"),

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
    "ndis.ndisType": z.string().min(1, "Scheme type is required"),









    "carer.shiftTiming": z.string().min(1, "Shift timing is required"),
    "carer.employementType": z.string().min(1, "Employement Type is required"),
    "additionalDetails.taxFileNumber": z.string().min(1, "Tax File no. is required"),
    "additionalDetails.AbnNumber": z.string().min(1, "ABN no. is required"),
    "additionalDetails.workersScreeningCheck": z.string().min(1, "Worker Screening Check is required"),
    "additionalDetails.workingWithChildernCheck": z.string().min(1, "Select Worker Childern Check"),
    "additionalDetails.policeCheck": z.string().min(1, "Select Policy check"),
    "additionalDetails.firstAid": z.string().min(1, "Select First Aid"),
    "vehicle": z.string().min(1, "Select Vehicle"),
    "createEmail": z.string().email("Invalid email"),
    "receiverEmail": z.string().email("Invalid email"),
    "password": z.string().min(6, "Password is required"),
    "confirmPass": z.string().min(6, "Confirm Password is required"),



    "shiftName": z.string().min(1, "Shift Name is Required"),
    "carerName": z.string().min(1, "Carer Name is Required"),
    "shiftId": z.string().min(1, "Select Shift"),




    "modelName": z.string().min(1, "Model Name is Required"),
    "registrationNo": z.string().min(1, "Registration No is Required"),
    "modelNumber": z.string().min(1, "Model Number No is Required"),
    "assigneeMobile": z.string().min(1, "Assignee Mobile Number No is Required"),
    "status": z.string().min(1, "Status is Required"),
};

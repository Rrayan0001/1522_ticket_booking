import { Router } from 'express';
import multer from 'multer';
import Groq from 'groq-sdk';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Verify Student ID Card - STRICT verification
router.post('/verify-student-id', upload.single('id_card'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                error: 'Student ID card image is required'
            });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const base64Image = file.buffer.toString('base64');
        const dataUrl = `data:${file.mimetype};base64,${base64Image}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `You are a document verification system. Analyze this image and determine if it is a GENUINE COLLEGE/UNIVERSITY STUDENT ID CARD.

STRICT VERIFICATION RULES:
1. This MUST be a student ID card from a recognized educational institution (college, university, school)
2. Look for these student-specific markers:
   - Words like "Student", "ID Card", "Identity Card", "College", "University", "Institute", "School"
   - Enrollment/Registration/Roll number
   - Course name (B.Tech, MBA, B.Sc, etc.)
   - Department name
   - Academic year or semester
   
3. REJECT if you detect ANY of these non-student documents:
   - Aadhaar Card (has 12-digit UID, UIDAI logo)
   - PAN Card (has 10-character alphanumeric PAN)
   - Driving License (has DL number, RTO details)
   - Passport
   - Voter ID
   - Employee ID (company names without educational context)
   - Any government ID that is not from an educational institution

4. For validity, look for: "Valid Till", "Valid Through", "Valid Upto", "Expiry", or date ranges like "2024-2025", "2024-2027"

Return ONLY a JSON object with these exact fields:
{
  "document_type": "student_id" | "aadhaar" | "pan_card" | "driving_license" | "employee_id" | "other",
  "is_valid_student_id": boolean (true ONLY if this is genuinely a college/university student ID),
  "college_name": string or null (name of educational institution),
  "student_name": string or null,
  "course": string or null (e.g., "B.Tech", "MBA"),
  "enrollment_number": string or null,
  "valid_till_year": number or null (extract year like 2025, 2026, 2027),
  "rejection_reason": string or null (explain why this is NOT a valid student ID if rejected)
}

Be VERY STRICT. Only approve genuine educational institution student ID cards.`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: dataUrl
                            }
                        }
                    ]
                }
            ],
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const content = chatCompletion.choices[0]?.message?.content;

        if (content) {
            const extracted = JSON.parse(content);
            console.log('Student ID Verification:', extracted);

            // STRICT CHECK 1: Must be document_type = "student_id"
            if (extracted.document_type !== 'student_id') {
                const documentNames: { [key: string]: string } = {
                    'aadhaar': 'Aadhaar Card',
                    'pan_card': 'PAN Card',
                    'driving_license': 'Driving License',
                    'employee_id': 'Employee ID',
                    'other': 'Unknown document'
                };
                const detectedDoc = documentNames[extracted.document_type] || extracted.document_type;

                return res.json({
                    success: true,
                    is_eligible: false,
                    document_type: extracted.document_type,
                    message: `This appears to be a ${detectedDoc}, not a student ID card. Only college/university student IDs are accepted.`,
                    rejection_reason: extracted.rejection_reason
                });
            }

            // STRICT CHECK 2: Must be is_valid_student_id = true
            if (!extracted.is_valid_student_id) {
                return res.json({
                    success: true,
                    is_eligible: false,
                    document_type: extracted.document_type,
                    message: extracted.rejection_reason || 'Could not verify as a valid student ID card',
                    rejection_reason: extracted.rejection_reason
                });
            }

            // STRICT CHECK 3: Must have validity year
            const validTillYear = extracted.valid_till_year;

            if (!validTillYear) {
                return res.json({
                    success: true,
                    is_eligible: false,
                    document_type: 'student_id',
                    college_name: extracted.college_name,
                    message: 'Could not find validity year on the student ID. Please upload an ID with visible validity date.',
                });
            }

            // STRICT CHECK 4: Valid year must be >= 2025
            const isEligible = validTillYear >= 2025;

            res.json({
                success: true,
                is_eligible: isEligible,
                document_type: 'student_id',
                valid_till_year: validTillYear,
                student_name: extracted.student_name || null,
                college_name: extracted.college_name || null,
                course: extracted.course || null,
                message: isEligible
                    ? `✓ Student discount applied! Valid till ${validTillYear}`
                    : `Student ID expired (valid till ${validTillYear}). Must be valid through 2025 or later.`
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Could not analyze the image',
                details: 'Please upload a clear, well-lit photo of your student ID'
            });
        }
    } catch (err) {
        console.error('Student ID Verification Error:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to verify student ID'
        });
    }
});

export default router;

import { MedicalTerm } from "@/types/medical";

export const medicalTerms: MedicalTerm[] = [
  {
    id: "1",
    term: "Myocardial Infarction",
    definition: "Irreversible necrosis of heart muscle due to prolonged ischemia, typically from coronary artery occlusion.",
    key_points: [
      "ST-elevation indicates transmural infarction",
      "Troponin I/T are the most specific cardiac biomarkers",
      "Peak CK-MB at 24 hours, Troponin at 12 hours",
      "Complications include arrhythmia, heart failure, and rupture",
      "Door-to-balloon time should be <90 minutes for PCI"
    ],
    exam_traps: [
      "CK-MB can be elevated in skeletal muscle injury — always check Troponin",
      "Right ventricular MI presents with hypotension and clear lungs — avoid nitrates"
    ],
    mnemonic: "TIME = Troponin, Ischemic pain, Monitor ECG, Emergency PCI",
    category: "Cardiology",
    related_terms: ["Angina Pectoris", "Atherosclerosis", "Troponin"]
  },
  {
    id: "2",
    term: "Angina Pectoris",
    definition: "Chest pain caused by reduced blood flow to the heart muscle, usually due to coronary artery disease.",
    key_points: [
      "Stable angina: predictable, exertion-related, relieved by rest/nitrates",
      "Unstable angina: unpredictable, at rest, crescendo pattern",
      "Prinzmetal angina: vasospasm, ST elevation, occurs at rest",
      "Diagnosis via stress testing and coronary angiography"
    ],
    exam_traps: [
      "Prinzmetal angina shows ST elevation like MI but is vasospastic — treat with CCBs not beta-blockers",
      "Unstable angina has no troponin elevation — differentiates from NSTEMI"
    ],
    category: "Cardiology",
    related_terms: ["Myocardial Infarction", "Atherosclerosis"]
  },
  {
    id: "3",
    term: "Stroke (CVA)",
    definition: "Sudden loss of brain function due to interruption of blood supply (ischemic) or rupture of blood vessels (hemorrhagic).",
    key_points: [
      "Ischemic stroke (85%): thrombus or embolus occlusion",
      "Hemorrhagic stroke (15%): intracerebral or subarachnoid",
      "tPA window: within 4.5 hours of symptom onset",
      "CT without contrast first to rule out hemorrhage",
      "NIHSS score guides treatment decisions"
    ],
    exam_traps: [
      "Never give tPA without ruling out hemorrhagic stroke with CT first",
      "Lacunar infarcts are often CT-negative early — use MRI DWI"
    ],
    mnemonic: "FAST = Face drooping, Arm weakness, Speech difficulty, Time to call",
    category: "Neurology",
    related_terms: ["TIA", "Atrial Fibrillation"]
  },
  {
    id: "4",
    term: "TIA (Transient Ischemic Attack)",
    definition: "Brief episode of neurological dysfunction from focal cerebral ischemia without permanent infarction.",
    key_points: [
      "Symptoms resolve within 24 hours (usually <1 hour)",
      "No evidence of infarction on imaging",
      "ABCD2 score predicts subsequent stroke risk",
      "Requires urgent workup: carotid imaging, echo, ECG"
    ],
    exam_traps: [
      "TIA with DWI-positive MRI is now classified as stroke, not TIA",
      "High ABCD2 score (≥4) requires hospitalization"
    ],
    category: "Neurology",
    related_terms: ["Stroke (CVA)", "Atrial Fibrillation"]
  },
  {
    id: "5",
    term: "Diabetic Ketoacidosis (DKA)",
    definition: "Life-threatening complication of diabetes with hyperglycemia, metabolic acidosis, and ketonemia.",
    key_points: [
      "Primarily Type 1 diabetes, can occur in Type 2",
      "Triad: hyperglycemia (>250), acidosis (pH <7.3), ketosis",
      "Treatment: IV fluids, insulin drip, potassium replacement",
      "Monitor potassium before giving insulin",
      "Kussmaul breathing is compensatory for metabolic acidosis"
    ],
    exam_traps: [
      "Always check potassium BEFORE starting insulin — hypokalemia kills",
      "Cerebral edema risk in children if glucose corrected too rapidly"
    ],
    mnemonic: "DKA FIG = Fluids, Insulin, Glucose monitoring, K+ replacement",
    category: "Endocrinology",
    related_terms: ["HHS", "Type 1 Diabetes"]
  },
  {
    id: "6",
    term: "Pneumothorax",
    definition: "Accumulation of air in the pleural space causing partial or complete lung collapse.",
    key_points: [
      "Spontaneous: tall, thin young males; rupture of apical blebs",
      "Tension pneumothorax: medical emergency, tracheal deviation away",
      "Diagnosis: absent breath sounds, hyperresonance",
      "Tension: needle decompression at 2nd ICS midclavicular line",
      "Small (<2cm): observation; Large: chest tube"
    ],
    exam_traps: [
      "Tension pneumothorax is a CLINICAL diagnosis — do NOT wait for X-ray",
      "Hamman's crunch (crunching sound with heartbeat) suggests pneumomediastinum"
    ],
    category: "Pulmonology",
    related_terms: ["Pleural Effusion", "COPD"]
  },
  {
    id: "7",
    term: "Peptic Ulcer Disease",
    definition: "Mucosal erosion of the stomach or duodenum, most commonly caused by H. pylori or NSAIDs.",
    key_points: [
      "Gastric ulcer: pain worse with eating",
      "Duodenal ulcer: pain better with eating, worse at night",
      "H. pylori: urease breath test, stool antigen, or biopsy",
      "Triple therapy: PPI + clarithromycin + amoxicillin",
      "Complications: perforation, bleeding, obstruction"
    ],
    exam_traps: [
      "Gastric ulcers need biopsy to rule out malignancy — duodenal ulcers do not",
      "Zollinger-Ellison syndrome: refractory ulcers + elevated gastrin"
    ],
    mnemonic: "Gastric = Greater pain with food; Duodenal = Decreases with food",
    category: "Gastroenterology",
    related_terms: ["GERD", "H. pylori"]
  },
  {
    id: "8",
    term: "Nephrotic Syndrome",
    definition: "Kidney disorder with massive proteinuria (>3.5g/day), hypoalbuminemia, edema, and hyperlipidemia.",
    key_points: [
      "Most common in children: Minimal Change Disease",
      "Most common in adults: Membranous Nephropathy",
      "Oval fat bodies ('Maltese cross') in urine",
      "Increased risk of thromboembolism (loss of antithrombin III)",
      "Treatment depends on underlying cause; steroids for MCD"
    ],
    exam_traps: [
      "Nephrotic = proteinuria; Nephritic = hematuria with RBC casts",
      "Minimal Change Disease: normal light microscopy, foot process effacement on EM"
    ],
    category: "Nephrology",
    related_terms: ["Nephritic Syndrome", "Glomerulonephritis"]
  },
  {
    id: "9",
    term: "Iron Deficiency Anemia",
    definition: "Most common anemia worldwide, caused by insufficient iron for hemoglobin synthesis.",
    key_points: [
      "Microcytic, hypochromic anemia (low MCV)",
      "Low serum iron, low ferritin, high TIBC",
      "Causes: blood loss (#1 in adults), poor intake, malabsorption",
      "Peripheral smear: target cells, pencil cells",
      "Plummer-Vinson syndrome: dysphagia + iron deficiency"
    ],
    exam_traps: [
      "Ferritin is an acute phase reactant — can be falsely normal in inflammation",
      "Always investigate cause in adult males and postmenopausal women (GI malignancy)"
    ],
    mnemonic: "Iron LOW = Low ferritin, O (elevated TIBC), Worn-out RBCs (microcytic)",
    category: "Hematology",
    related_terms: ["Thalassemia", "Anemia of Chronic Disease"]
  },
  {
    id: "10",
    term: "Compartment Syndrome",
    definition: "Increased pressure within a closed muscle compartment compromising blood flow and tissue perfusion.",
    key_points: [
      "Most common in tibial fractures",
      "6 P's: Pain, Pressure, Paralysis, Paresthesia, Pulselessness, Pallor",
      "Pain out of proportion to injury is earliest sign",
      "Pain with passive stretch of involved muscles",
      "Treatment: emergent fasciotomy"
    ],
    exam_traps: [
      "Presence of distal pulses does NOT rule out compartment syndrome",
      "Compartment pressure >30 mmHg or within 30 mmHg of diastolic = fasciotomy"
    ],
    mnemonic: "6 P's of Compartment Syndrome — Pain is #1",
    category: "Orthopedics",
    related_terms: ["Fractures", "Rhabdomyolysis"]
  },
  {
    id: "11",
    term: "Atrial Fibrillation",
    definition: "Irregularly irregular supraventricular tachyarrhythmia with uncoordinated atrial activation.",
    key_points: [
      "Most common sustained cardiac arrhythmia",
      "Absent P waves, irregularly irregular R-R intervals on ECG",
      "CHA₂DS₂-VASc score guides anticoagulation decision",
      "Rate control: beta-blockers, CCBs, digoxin",
      "Rhythm control: amiodarone, flecainide, cardioversion"
    ],
    exam_traps: [
      "New-onset AF: always check thyroid function (hyperthyroidism)",
      "Anticoagulate ≥48h before cardioversion or rule out LAA thrombus with TEE"
    ],
    category: "Cardiology",
    related_terms: ["Stroke (CVA)", "TIA (Transient Ischemic Attack)"]
  },
  {
    id: "12",
    term: "Atherosclerosis",
    definition: "Chronic inflammatory disease of arteries with lipid plaque buildup in the intimal layer.",
    key_points: [
      "Major risk factors: HTN, diabetes, smoking, hyperlipidemia",
      "Pathogenesis: endothelial injury → foam cells → fibrous plaque",
      "Most dangerous plaques are thin-cap, lipid-rich (vulnerable)",
      "Complications: MI, stroke, peripheral artery disease, aneurysm"
    ],
    exam_traps: [
      "Stable plaques cause chronic ischemia; unstable plaques cause acute events",
      "Statins reduce CV events even with normal cholesterol (pleiotropic effects)"
    ],
    category: "Cardiology",
    related_terms: ["Myocardial Infarction", "Angina Pectoris"]
  },
  {
    id: "13",
    term: "Troponin",
    definition: "Cardiac regulatory protein complex released into blood during myocardial injury; gold standard biomarker for MI.",
    key_points: [
      "Troponin I and T are cardiac-specific isoforms",
      "Rises 3-6 hours after injury, peaks 12-24 hours",
      "Remains elevated for 7-14 days",
      "High-sensitivity troponin detects smaller amounts of injury",
      "Serial measurements (0h, 3h, 6h) for rule-in/rule-out"
    ],
    exam_traps: [
      "Troponin can be elevated in renal failure, PE, myocarditis — not only MI",
      "A rising/falling pattern is more specific for acute MI than a single value"
    ],
    category: "Cardiology",
    related_terms: ["Myocardial Infarction", "CK-MB"]
  },
  {
    id: "14",
    term: "Psoriasis",
    definition: "Chronic autoimmune skin disorder with hyperproliferation of keratinocytes causing scaly plaques.",
    key_points: [
      "Well-demarcated, salmon-pink plaques with silvery scales",
      "Auspitz sign: pinpoint bleeding when scales removed",
      "Koebner phenomenon: lesions at sites of trauma",
      "Nail changes: pitting, oil spots, onycholysis",
      "Associated with psoriatic arthritis (DIP joints)"
    ],
    exam_traps: [
      "Psoriatic arthritis is seronegative (RF negative) — differentiate from RA",
      "Lithium, beta-blockers, and withdrawal of steroids can trigger flares"
    ],
    mnemonic: "Psoriasis Presents with Plaques, Pitting, and Psoriatic arthritis",
    category: "Dermatology",
    related_terms: ["Eczema", "Psoriatic Arthritis"]
  },
  {
    id: "15",
    term: "Metformin",
    definition: "First-line oral antidiabetic for Type 2 DM; decreases hepatic glucose production and improves insulin sensitivity.",
    key_points: [
      "Does not cause hypoglycemia or weight gain",
      "Contraindicated in renal insufficiency (eGFR <30)",
      "GI side effects most common (diarrhea, nausea)",
      "Hold 48 hours before/after iodinated contrast",
      "Reduces HbA1c by 1-1.5%"
    ],
    exam_traps: [
      "Lactic acidosis is rare but life-threatening — suspect in renal failure patients",
      "Vitamin B12 deficiency with long-term use — check levels annually"
    ],
    category: "Pharmacology",
    related_terms: ["Diabetic Ketoacidosis (DKA)", "Type 2 Diabetes"]
  }
];

export const categories = [
  { name: "Cardiology", icon: "❤️", color: "var(--category-cardio)" },
  { name: "Neurology", icon: "🧠", color: "var(--category-neuro)" },
  { name: "Pharmacology", icon: "💊", color: "var(--category-pharma)" },
  { name: "Gastroenterology", icon: "🫁", color: "var(--category-gastro)" },
  { name: "Pulmonology", icon: "🌬️", color: "var(--category-pulmo)" },
  { name: "Nephrology", icon: "🫘", color: "var(--category-nephro)" },
  { name: "Hematology", icon: "🩸", color: "var(--category-hema)" },
  { name: "Endocrinology", icon: "⚡", color: "var(--category-endo)" },
  { name: "Orthopedics", icon: "🦴", color: "var(--category-ortho)" },
  { name: "Dermatology", icon: "🧴", color: "var(--category-derm)" },
];

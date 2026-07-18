<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MediSyncController extends Controller
{
    /**
     * Dashboard Overview
     */
    public function dashboard()
    {
        return Inertia::render('Dashboard', [
            'user' => [
                'name' => 'Hajah Fatimah binti Ahmad',
                'role' => 'Patient',
                'age' => 64,
                'blood_type' => 'O+',
                'ice_code' => 'ICE-9821-MY',
            ],
            'upcomingMeds' => [
                [
                    'id' => 1,
                    'name' => 'Amlodipine (Blood Pressure)',
                    'dosage' => '10mg - 1 Tablet',
                    'timing' => 'Pagi (8:00 AM)',
                    'taken' => true,
                    'icon' => 'Pill',
                    'color' => 'teal',
                ],
                [
                    'id' => 2,
                    'name' => 'Metformin (Diabetes)',
                    'dosage' => '500mg - 1 Tablet after meal',
                    'timing' => 'Tengahari (1:30 PM)',
                    'taken' => false,
                    'icon' => 'Activity',
                    'color' => 'emerald',
                ],
                [
                    'id' => 3,
                    'name' => 'Atorvastatin (Cholesterol)',
                    'dosage' => '20mg - 1 Tablet',
                    'timing' => 'Malam (9:00 PM)',
                    'taken' => false,
                    'icon' => 'Moon',
                    'color' => 'indigo',
                ],
            ],
            'upcomingAppointments' => [
                [
                    'id' => 1,
                    'doctor' => 'Dr. Arisya Zakaria (Pakar Kardiologi)',
                    'hospital' => 'Hospital Kuala Lumpur (HKL)',
                    'department' => 'Klinik Pakar Kardiologi Level 3',
                    'date' => '2026-07-24',
                    'time' => '10:30 AM',
                    'daysLeft' => 6,
                    'status' => 'Confirmed',
                ],
                [
                    'id' => 2,
                    'doctor' => 'Dr. Ramesh Kumar (Endokrinologi)',
                    'hospital' => 'Pusat Perubatan Universiti Malaya (PPUM)',
                    'department' => 'Klinik Diabetes Block B',
                    'date' => '2026-08-05',
                    'time' => '02:15 PM',
                    'daysLeft' => 18,
                    'status' => 'Scheduled',
                ],
            ],
            'caregiverSync' => [
                'status' => 'Active Sync',
                'familyCount' => 2,
                'members' => [
                    ['name' => 'Ahmad Azman (Anak Sulung)', 'relation' => 'Son', 'phone' => '+6012-3456789', 'lastSeen' => '10 mins ago', 'status' => 'Online'],
                    ['name' => 'Siti Nurhaliza (Anak Bongsu)', 'relation' => 'Daughter', 'phone' => '+6019-8765432', 'lastSeen' => '2 hours ago', 'status' => 'Synced'],
                ],
            ],
            'emergencySummary' => [
                'allergies' => ['Penicillin', 'Peanuts'],
                'conditions' => ['Hypertension', 'Type 2 Diabetes', 'Previous Mild Stroke (2023)'],
                'primaryICE' => 'Ahmad Azman (+6012-3456789)',
            ],
            'dashboardSummary' => [
                'metrics' => [
                    ['key' => 'medicationAdherence', 'label' => 'Medication adherence', 'malayLabel' => 'Pematuhan ubat', 'value' => 92, 'suffix' => '%', 'tone' => 'charcoal'],
                    ['key' => 'appointments', 'label' => 'Upcoming appointments', 'malayLabel' => 'Temujanji akan datang', 'value' => 2, 'suffix' => '', 'tone' => 'saffron'],
                    ['key' => 'caregiverSync', 'label' => 'Caregiver sync', 'malayLabel' => 'Sync penjaga', 'value' => 100, 'suffix' => '%', 'tone' => 'striped'],
                    ['key' => 'emergencyReadiness', 'label' => 'Emergency readiness', 'malayLabel' => 'Kesediaan kecemasan', 'value' => 100, 'suffix' => '%', 'tone' => 'outline'],
                ],
                'weeklyActivity' => [
                    ['day' => 'Mon', 'value' => 42, 'label' => '2h 48m'],
                    ['day' => 'Tue', 'value' => 56, 'label' => '3h 44m'],
                    ['day' => 'Wed', 'value' => 34, 'label' => '2h 16m'],
                    ['day' => 'Thu', 'value' => 64, 'label' => '4h 16m'],
                    ['day' => 'Fri', 'value' => 82, 'label' => '5h 23m'],
                    ['day' => 'Sat', 'value' => 26, 'label' => '1h 44m'],
                    ['day' => 'Sun', 'value' => 38, 'label' => '2h 32m'],
                ],
                'calendar' => [
                    ['id' => 'appointment-1', 'date' => '2026-07-24', 'time' => '10:30 AM', 'title' => 'Cardiology follow-up', 'malayTitle' => 'Susulan kardiologi', 'detail' => 'Hospital Kuala Lumpur (HKL)', 'tone' => 'charcoal'],
                    ['id' => 'appointment-2', 'date' => '2026-08-05', 'time' => '2:15 PM', 'title' => 'Endocrinology review', 'malayTitle' => 'Semakan endokrinologi', 'detail' => 'Pusat Perubatan Universiti Malaya (PPUM)', 'tone' => 'saffron'],
                ],
                'checklist' => [
                    ['id' => 'medication-plan', 'title' => 'Review medication plan', 'malayTitle' => 'Semak pelan ubat', 'completed' => true],
                    ['id' => 'caregiver-sync', 'title' => 'Caregiver sync review', 'malayTitle' => 'Semak sync penjaga', 'completed' => true],
                    ['id' => 'next-appointment', 'title' => 'Confirm next appointment', 'malayTitle' => 'Sahkan temujanji seterusnya', 'completed' => false],
                    ['id' => 'emergency-contacts', 'title' => 'Update emergency contacts', 'malayTitle' => 'Kemas kini kontak kecemasan', 'completed' => false],
                    ['id' => 'doctor-questions', 'title' => 'Prepare doctor questions', 'malayTitle' => 'Sediakan soalan doktor', 'completed' => false],
                ],
            ],
        ]);
    }

    /**
     * Medication Manager Page
     */
    public function medications()
    {
        return Inertia::render('Medications', [
            'medications' => [
                [
                    'id' => 1,
                    'name' => 'Amlodipine Besylate',
                    'category' => 'Blood Pressure',
                    'dosage' => '10mg',
                    'instructions' => 'Take 1 tablet every morning with warm water',
                    'frequency' => 'Daily',
                    'timeOfDay' => 'Morning',
                    'time' => '08:00 AM',
                    'pillsLeft' => 24,
                    'refillThreshold' => 7,
                    'takenToday' => true,
                    'doctor' => 'Dr. Arisya Zakaria',
                ],
                [
                    'id' => 2,
                    'name' => 'Metformin HCl',
                    'category' => 'Diabetes Control',
                    'dosage' => '500mg',
                    'instructions' => 'Take 1 tablet immediately after lunch',
                    'frequency' => 'Daily',
                    'timeOfDay' => 'Afternoon',
                    'time' => '01:30 PM',
                    'pillsLeft' => 45,
                    'refillThreshold' => 10,
                    'takenToday' => false,
                    'doctor' => 'Dr. Ramesh Kumar',
                ],
                [
                    'id' => 3,
                    'name' => 'Atorvastatin Calcium',
                    'category' => 'Cholesterol',
                    'dosage' => '20mg',
                    'instructions' => 'Take 1 tablet at night before sleep',
                    'frequency' => 'Daily',
                    'timeOfDay' => 'Night',
                    'time' => '09:00 PM',
                    'pillsLeft' => 12,
                    'refillThreshold' => 5,
                    'takenToday' => false,
                    'doctor' => 'Dr. Arisya Zakaria',
                ],
                [
                    'id' => 4,
                    'name' => 'Aspirin Low Dose',
                    'category' => 'Blood Thinner',
                    'dosage' => '100mg',
                    'instructions' => 'Take 1 tablet after breakfast',
                    'frequency' => 'Daily',
                    'timeOfDay' => 'Morning',
                    'time' => '08:30 AM',
                    'pillsLeft' => 30,
                    'refillThreshold' => 7,
                    'takenToday' => true,
                    'doctor' => 'Dr. Arisya Zakaria',
                ]
            ],
            'adherenceRate' => 92,
            'streakDays' => 14
        ]);
    }

    /**
     * Hospital Appointment Reminders
     */
    public function appointments()
    {
        return Inertia::render('Appointments', [
            'appointments' => [
                [
                    'id' => 1,
                    'title' => 'Temujanji Susulan Pakar Kardiologi',
                    'doctor' => 'Dr. Arisya Zakaria',
                    'hospital' => 'Hospital Kuala Lumpur (HKL)',
                    'address' => 'Jalan Pahang, 50586 Kuala Lumpur',
                    'department' => 'Klinik Pakar Kardiologi, Tingkat 3',
                    'date' => '2026-07-24',
                    'time' => '10:30 AM',
                    'notes' => 'Sila puasa 8 jam sebelum ujian darah (lipid profile & HbA1c)',
                    'documentsNeeded' => ['Buku Rekod Tekanan Darah', 'Surat Rujukan HKL', 'Kad Pengenalan'],
                    'status' => 'Confirmed',
                    'distanceKm' => 4.2
                ],
                [
                    'id' => 2,
                    'title' => 'Pemeriksaan Semula Gula & Endokrin',
                    'doctor' => 'Dr. Ramesh Kumar',
                    'hospital' => 'Pusat Perubatan Universiti Malaya (PPUM)',
                    'address' => 'Jalan Professor Diraja Ungku Abdul Aziz, 59100 Petaling Jaya',
                    'department' => 'Klinik Endokrinologi & Diabetes, Blok B',
                    'date' => '2026-08-05',
                    'time' => '02:15 PM',
                    'notes' => 'Bawa log keputusan ujian ujian gula darah rumah (glucometer)',
                    'documentsNeeded' => ['Log Buku Diabetik', 'Kad Temujanji PPUM'],
                    'status' => 'Scheduled',
                    'distanceKm' => 8.7
                ],
                [
                    'id' => 3,
                    'title' => 'Pemeriksaan Mata Diabetik (Retinopathy Screening)',
                    'doctor' => 'Dr. Nurul Huda',
                    'hospital' => 'Hospital Selayang',
                    'address' => 'Lebuhraya Selayang-Kepong, 68100 Batu Caves',
                    'department' => 'Klinik Oftalmologi (Mata)',
                    'date' => '2026-09-12',
                    'time' => '09:00 AM',
                    'notes' => 'Mata akan dititik ubat penitis anak mata, elakkan memandu selepas ujian',
                    'documentsNeeded' => ['Cermin mata sedia ada', 'Kad Pesakit'],
                    'status' => 'Pending Confirmation',
                    'distanceKm' => 12.4
                ]
            ]
        ]);
    }

    /**
     * Medical Term Simplifier Page
     */
    public function termSimplifier()
    {
        return Inertia::render('TermSimplifier', [
            'sampleSearches' => [
                [
                    'term' => 'Myocardial Infarction',
                    'category' => 'Heart / Kardiologi',
                    'simpleExplanation' => 'Serangan Jantung. Ia berlaku apabila salur darah yang membekalkan oksigen ke otot jantung tersumbat, menyebabkan sebahagian otot jantung rosak.',
                    'analogy' => 'Umpama paip air di rumah tersumbat teruk, jadi kawasan bilik tertentu tak dapat bekalan air.',
                    'keyTakeaways' => [
                        'Memerlukan rawatan kecemasan serta merta.',
                        'Simptom utama: Sakit dada mencucuk, sesak nafas, berpeluh dingin.',
                        'Boleh dicegah dengan mengawal kolesterol dan tekanan darah.'
                    ],
                    'questionsForDoctor' => [
                        'Berapa peratus salur darah saya yang tersumbat?',
                        'Adakah saya perlu menjalani rawatan angioplasti (balon/stent)?',
                        'Apakah aktiviti fizikal yang selamat untuk saya lakukan sekarang?'
                    ]
                ],
                [
                    'term' => 'Hyperlipidemia',
                    'category' => 'Metabolik',
                    'simpleExplanation' => 'Paras Kolesterol atau Lemak Tinggi Dalam Darah.',
                    'analogy' => 'Umpama minyak pekat mendap dalam paip air, membuatkan laluan darah menjadi makin sempit.',
                    'keyTakeaways' => [
                        'Biasanya tiada simptom awal tetapi meningkatkan risiko serangan jantung & strok.',
                        'Boleh dikawal dengan pemakanan rendah lemak tepu dan ubat statin.'
                    ],
                    'questionsForDoctor' => [
                        'Berapakah bacaan LDL (kolesterol jahat) saya sekarang?',
                        'Apakah sasaran bacaan kolesterol yang selamat untuk usia saya?'
                    ]
                ],
                [
                    'term' => 'Idiopathic Hypertension',
                    'category' => 'Tekanan Darah',
                    'simpleExplanation' => 'Tekanan Darah Tinggi Tanpa Punca Khusus yang Jelas (Essential Hypertension).',
                    'analogy' => 'Pam air berfungsi terlalu kuat melebihi tekanan biasa pada dinding paip.',
                    'keyTakeaways' => [
                        'Punca utama biasanya gabungan faktor genetik, usia, dan gaya hidup.',
                        'Memerlukan pengambilan ubat darah tinggi secara konsisten setiap hari.'
                    ],
                    'questionsForDoctor' => [
                        'Adakah ubat ini perlu diambil seumur hidup?',
                        'Bila masa terbaik untuk saya mengambil ubat darah tinggi saya?'
                    ]
                ]
            ],
            'dictionary' => [
                ['term' => 'Benign', 'malay' => 'Bukan Kanser / Tidak Berbahaya', 'desc' => 'Ketumbuhan atau bengkak yang selamat dan tidak merebak.'],
                ['term' => 'Malignant', 'malay' => 'Kanser / Berbahaya', 'desc' => 'Ketumbuhan sel tidak normal yang boleh merosakkan tisu sekeliling.'],
                ['term' => 'EDTA / CBC Test', 'malay' => 'Ujian Ujian Darah Penuh', 'desc' => 'Ujian untuk mengira sel darah merah, sel darah putih, dan platelet.'],
                ['term' => 'HbA1c', 'malay' => 'Purata Bacaan Gula 3 Bulan', 'desc' => 'Ujian darah menunjukkan kawalan gula purata bagi pesakit kencing manis.'],
                ['term' => 'Arrhythmia', 'malay' => 'Denyutan Jantung Tidak Sekata', 'desc' => 'Jantung berdegup terlalu laju, terlalu lambat, atau kencang secara tidak teratur.'],
                ['term' => 'Edema', 'malay' => 'Bengkak Air', 'desc' => 'Pengumpulan cecair berlebihan pada tisu badan terutamanya kaki atau buku lali.'],
            ]
        ]);
    }

    /**
     * Insurance & Medical Document Storage
     */
    public function documents()
    {
        return Inertia::render('DocumentVault', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Polisi Insurans Hayat & Perubatan AIA Takaful',
                    'category' => 'Insurance',
                    'type' => 'PDF Document',
                    'policyNo' => 'POL-882910-MY',
                    'coverageAmount' => 'RM 250,000',
                    'uploadedDate' => '12 Jan 2026',
                    'size' => '2.4 MB',
                    'tags' => ['Insurance', 'Medical Card', 'AIA'],
                    'notes' => 'Kad Perubatan Utama. Hubungi talian kecemasan AIA 1-300-88-1899.',
                ],
                [
                    'id' => 2,
                    'title' => 'Keputusan Ujian Lab Darah & HbA1c (HKL)',
                    'category' => 'Lab Results',
                    'type' => 'PDF Report',
                    'uploadedDate' => '15 Jun 2026',
                    'size' => '1.1 MB',
                    'tags' => ['Blood Test', 'HKL', 'Diabetes', 'Lipid'],
                    'notes' => 'HbA1c: 6.8%. Kolesterol LDL: 2.3 mmol/L.',
                ],
                [
                    'id' => 3,
                    'title' => 'Surat Pelepasan Wad & Ringkasan Discas (Discharge Summary)',
                    'category' => 'Discharge Summary',
                    'type' => 'PDF Document',
                    'uploadedDate' => '04 Feb 2025',
                    'size' => '3.8 MB',
                    'tags' => ['Hospital Admission', 'PPUM', 'Heart Check'],
                    'notes' => 'Discas dari wad kardiologi PPUM selepas pemantauan 3 hari.',
                ],
                [
                    'id' => 4,
                    'title' => 'Preskripsi Ubat Pakar Kardiologi 2026',
                    'category' => 'Prescription',
                    'type' => 'Image / Scan',
                    'uploadedDate' => '20 Mei 2026',
                    'size' => '850 KB',
                    'tags' => ['Prescription', 'Amlodipine', 'HKL'],
                    'notes' => 'Preskripsi bekalan ubat untuk 3 bulan di Farmasi HKL.',
                ],
            ]
        ]);
    }

    /**
     * Caregiver & Family Synchronization
     */
    public function caregiverSync()
    {
        return Inertia::render('CaregiverSync', [
            'patient' => [
                'name' => 'Hajah Fatimah binti Ahmad',
                'age' => 64,
                'syncCode' => 'MS-FATIMAH-2026',
                'overallStatus' => 'Stable & Synced',
                'lastActivity' => 'Ubat Pagi (Amlodipine) dimakan jam 8:05 AM hari ini'
            ],
            'connectedCaregivers' => [
                [
                    'id' => 1,
                    'name' => 'Ahmad Azman',
                    'relation' => 'Anak Sulung (Son)',
                    'phone' => '+6012-3456789',
                    'accessLevel' => 'Full Access & Managing',
                    'joinedDate' => 'Feb 2025',
                    'avatar' => 'AA',
                    'isPrimary' => true
                ],
                [
                    'id' => 2,
                    'name' => 'Siti Nurhaliza',
                    'relation' => 'Anak Bongsu (Daughter)',
                    'phone' => '+6019-8765432',
                    'accessLevel' => 'View Medications & Appointments',
                    'joinedDate' => 'May 2025',
                    'avatar' => 'SN',
                    'isPrimary' => false
                ]
            ],
            'sharedLog' => [
                [
                    'id' => 1,
                    'time' => 'Hari Ini, 08:05 AM',
                    'actor' => 'Hajah Fatimah',
                    'action' => 'Mengambil Ubat Pagi: Amlodipine 10mg',
                    'type' => 'Medication',
                    'status' => 'Success'
                ],
                [
                    'id' => 2,
                    'time' => 'Kelmarin, 09:30 PM',
                    'actor' => 'Ahmad Azman (Anak)',
                    'action' => 'Mengemas kini peringatan temujanji HKL pada 24 Julai 2026',
                    'type' => 'Appointment',
                    'status' => 'Updated'
                ],
                [
                    'id' => 3,
                    'time' => '16 Julai 2026, 02:00 PM',
                    'actor' => 'Ahmad Azman (Anak)',
                    'action' => 'Memuat naik dokumen Insurans AIA Takaful',
                    'type' => 'Document',
                    'status' => 'Uploaded'
                ]
            ]
        ]);
    }

    /**
     * Symptom Summariser for Doctor Consultations
     */
    public function symptomSummariser()
    {
        return Inertia::render('SymptomSummariser', [
            'commonSymptoms' => [
                'Sakit Dada / Dada Rasa Senak',
                'Sesak Nafas / Kesukaran Bernafas',
                'Pening Kepala / Rasa Melayang',
                'Sakit Sendi / Lutut Bengkak',
                'Batuk Berpanjangan',
                'Keletihan Luar Biasa',
                'Gula Darah Rendah / Menggeletar'
            ]
        ]);
    }

    /**
     * SOS Emergency & Hospital Locator
     */
    public function emergencySOS()
    {
        return Inertia::render('EmergencySOS', [
            'emergencyContacts' => [
                [
                    'name' => 'Ahmad Azman (Anak Sulung)',
                    'relation' => 'Primary ICE Contact',
                    'phone' => '+6012-3456789',
                    'isPrimary' => true
                ],
                [
                    'name' => 'Siti Nurhaliza (Anak Bongsu)',
                    'relation' => 'Secondary ICE Contact',
                    'phone' => '+6019-8765432',
                    'isPrimary' => false
                ],
                [
                    'name' => 'Talian Kecemasan Malaysia (MERS 999)',
                    'relation' => 'Ambulan / Polis / Bomba',
                    'phone' => '999',
                    'isPrimary' => false
                ]
            ],
            'nearbyHospitals' => [
                [
                    'id' => 1,
                    'name' => 'Hospital Kuala Lumpur (HKL)',
                    'type' => 'Hospital Kerajaan (Awam)',
                    'address' => 'Jalan Pahang, 50586 Kuala Lumpur',
                    'distanceKm' => 3.8,
                    'driveTime' => '9 min',
                    'erPhone' => '+603-26155555',
                    'hasEmergency24h' => true,
                    'googleMapUrl' => 'https://maps.google.com/?q=Hospital+Kuala+Lumpur'
                ],
                [
                    'id' => 2,
                    'name' => 'KPJ Tawakkal KL Specialist Hospital',
                    'type' => 'Hospital Pakar Swasta',
                    'address' => '1 Jalan Pahang Barat, 53000 Kuala Lumpur',
                    'distanceKm' => 4.5,
                    'driveTime' => '11 min',
                    'erPhone' => '+603-40267777',
                    'hasEmergency24h' => true,
                    'googleMapUrl' => 'https://maps.google.com/?q=KPJ+Tawakkal+KL'
                ],
                [
                    'id' => 3,
                    'name' => 'Pusat Perubatan Universiti Malaya (PPUM)',
                    'type' => 'Hospital Universiti / Awam',
                    'address' => 'Jalan Professor Diraja Ungku Abdul Aziz, PJ',
                    'distanceKm' => 8.2,
                    'driveTime' => '16 min',
                    'erPhone' => '+603-79494422',
                    'hasEmergency24h' => true,
                    'googleMapUrl' => 'https://maps.google.com/?q=PPUM'
                ],
                [
                    'id' => 4,
                    'name' => 'Klinik Kesihatan Kuala Lumpur (KKKL)',
                    'type' => 'Klinik Kesihatan Awam',
                    'address' => 'Jalan Fletcher, Off Jalan Tun Razak, KL',
                    'distanceKm' => 2.9,
                    'driveTime' => '7 min',
                    'erPhone' => '+603-26983333',
                    'hasEmergency24h' => false,
                    'googleMapUrl' => 'https://maps.google.com/?q=Klinik+Kesihatan+Kuala+Lumpur'
                ]
            ]
        ]);
    }

    /**
     * Emergency ICE Profile Editor
     */
    public function emergencyICE()
    {
        return Inertia::render('EmergencyICE', [
            'patientICE' => [
                'name' => 'Hajah Fatimah binti Ahmad',
                'ic_number' => '620814-10-5432',
                'blood_type' => 'O+',
                'organ_donor' => true,
                'weight_kg' => 62,
                'height_cm' => 158,
                'chronic_conditions' => [
                    'Hypertension (Tekanan Darah Tinggi)',
                    'Type 2 Diabetes Mellitus',
                    'Sejarah Mild Ischemic Stroke (2023)'
                ],
                'allergies' => [
                    ['allergen' => 'Penicillin', 'reaction' => 'Anaphylaxis / Kesukaran Bernafas', 'severity' => 'Severe'],
                    ['allergen' => 'Peanuts (Kacang tanah)', 'reaction' => 'Ruam kulit & bengkak muka', 'severity' => 'Moderate']
                ],
                'vitalMedications' => [
                    ['name' => 'Amlodipine Besylate', 'dose' => '10mg Daily', 'purpose' => 'High Blood Pressure'],
                    ['name' => 'Metformin HCl', 'dose' => '500mg Daily', 'purpose' => 'Diabetes Control'],
                    ['name' => 'Aspirin Low Dose', 'dose' => '100mg Daily', 'purpose' => 'Blood Thinner / Antiplatelet']
                ],
                'iceContacts' => [
                    ['name' => 'Ahmad Azman', 'relation' => 'Anak Sulung (Son)', 'phone' => '+6012-3456789'],
                    ['name' => 'Siti Nurhaliza', 'relation' => 'Anak Bongsu (Daughter)', 'phone' => '+6019-8765432']
                ],
                'publicAccessCode' => 'ICE-9821-MY',
                'publicUrl' => url('/ice/public/ICE-9821-MY')
            ]
        ]);
    }

    /**
     * Public Limited-Access Lockscreen ICE View for Emergency First Responders
     */
    public function publicICE($code)
    {
        return Inertia::render('PublicICE', [
            'code' => $code,
            'emergencyData' => [
                'name' => 'Hajah Fatimah binti Ahmad',
                'age' => 64,
                'blood_type' => 'O+',
                'organ_donor' => true,
                'criticalConditions' => [
                    'Hypertension',
                    'Type 2 Diabetes',
                    'History of Mild Stroke'
                ],
                'severeAllergies' => [
                    'PENICILLIN (SEVERE - ANAPHYLAXIS RISK)',
                    'Peanuts'
                ],
                'activeMedications' => [
                    'Amlodipine 10mg (Blood Pressure)',
                    'Metformin 500mg (Diabetes)',
                    'Aspirin 100mg (Blood Thinner)'
                ],
                'emergencyContactPhone' => '+6012-3456789',
                'emergencyContactName' => 'Ahmad Azman (Son)',
                'secondaryContactPhone' => '+6019-8765432',
                'secondaryContactName' => 'Siti Nurhaliza (Daughter)'
            ]
        ]);
    }
}

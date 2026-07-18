<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\DashboardChecklistItem;
use App\Models\EmergencyFacility;
use App\Models\MedicalDocument;
use App\Models\MedicalProfile;
use App\Models\MedicalTerm;
use App\Models\Medication;
use App\Models\MedicationLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $patient = User::query()->updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Hajah Fatimah binti Ahmad',
                'password' => Hash::make('password'),
                'phone' => '+6011-3456789',
                'role' => 'patient',
                'blood_type' => 'O+',
                'organ_donor' => true,
                'ice_code' => 'ICE-9821-MY',
                'date_of_birth' => '1962-08-14',
                'caregiver_sync_code' => 'MS-FATIMAH-2026',
            ],
        );

        $ahmad = User::query()->updateOrCreate(
            ['email' => 'ahmad.azman@example.com'],
            ['name' => 'Ahmad Azman', 'password' => Hash::make('password'), 'phone' => '+6012-3456789', 'role' => 'caregiver'],
        );
        $siti = User::query()->updateOrCreate(
            ['email' => 'siti.nurhaliza@example.com'],
            ['name' => 'Siti Nurhaliza', 'password' => Hash::make('password'), 'phone' => '+6019-8765432', 'role' => 'caregiver'],
        );

        MedicalProfile::query()->updateOrCreate(
            ['user_id' => $patient->id],
            [
                'ic_number' => '620814-10-5432',
                'weight_kg' => 62,
                'height_cm' => 158,
                'conditions' => ['Hypertension (Tekanan Darah Tinggi)', 'Type 2 Diabetes Mellitus', 'Sejarah Mild Ischemic Stroke (2023)'],
                'allergies' => [
                    ['allergen' => 'Penicillin', 'reaction' => 'Anaphylaxis / Kesukaran Bernafas', 'severity' => 'Severe'],
                    ['allergen' => 'Peanuts (Kacang tanah)', 'reaction' => 'Ruam kulit & bengkak muka', 'severity' => 'Moderate'],
                ],
                'emergency_contacts' => [
                    ['name' => 'Ahmad Azman (Anak Sulung)', 'relation' => 'Primary ICE Contact', 'phone' => '+6012-3456789', 'isPrimary' => true],
                    ['name' => 'Siti Nurhaliza (Anak Bongsu)', 'relation' => 'Secondary ICE Contact', 'phone' => '+6019-8765432', 'isPrimary' => false],
                    ['name' => 'Talian Kecemasan Malaysia (MERS 999)', 'relation' => 'Ambulan / Polis / Bomba', 'phone' => '999', 'isPrimary' => false],
                ],
            ],
        );

        DB::table('caregiver_links')->updateOrInsert(
            ['patient_id' => $patient->id, 'caregiver_id' => $ahmad->id],
            ['status' => 'accepted', 'relationship' => 'Anak Sulung (Son)', 'is_primary' => true, 'updated_at' => now(), 'created_at' => now()],
        );
        DB::table('caregiver_links')->updateOrInsert(
            ['patient_id' => $patient->id, 'caregiver_id' => $siti->id],
            ['status' => 'accepted', 'relationship' => 'Anak Bongsu (Daughter)', 'is_primary' => false, 'updated_at' => now(), 'created_at' => now()],
        );

        $medications = [
            ['name' => 'Amlodipine Besylate', 'category' => 'Blood Pressure', 'dosage' => '10mg', 'purpose' => 'High Blood Pressure', 'instructions' => 'Take 1 tablet every morning with warm water', 'time' => '08:00', 'pills_left' => 24, 'refill_threshold' => 7, 'doctor' => 'Dr. Arisya Zakaria'],
            ['name' => 'Metformin HCl', 'category' => 'Diabetes Control', 'dosage' => '500mg', 'purpose' => 'Diabetes Control', 'instructions' => 'Take 1 tablet immediately after lunch', 'time' => '13:30', 'pills_left' => 45, 'refill_threshold' => 10, 'doctor' => 'Dr. Ramesh Kumar'],
            ['name' => 'Atorvastatin Calcium', 'category' => 'Cholesterol', 'dosage' => '20mg', 'purpose' => 'Cholesterol Control', 'instructions' => 'Take 1 tablet at night before sleep', 'time' => '21:00', 'pills_left' => 12, 'refill_threshold' => 5, 'doctor' => 'Dr. Arisya Zakaria'],
            ['name' => 'Aspirin Low Dose', 'category' => 'Blood Thinner', 'dosage' => '100mg', 'purpose' => 'Blood Thinner / Antiplatelet', 'instructions' => 'Take 1 tablet after breakfast', 'time' => '08:30', 'pills_left' => 30, 'refill_threshold' => 7, 'doctor' => 'Dr. Arisya Zakaria'],
        ];

        $medicationModels = collect($medications)->map(fn (array $medication) => Medication::query()->updateOrCreate(
            ['user_id' => $patient->id, 'name' => $medication['name']],
            $medication + ['frequency' => 'Daily', 'active' => true],
        ));

        foreach (range(0, 29) as $daysAgo) {
            $date = Carbon::today()->subDays($daysAgo);
            foreach ($medicationModels as $index => $medication) {
                if (($daysAgo === 7 && $index === 1) || ($daysAgo === 16 && $index === 2) || ($daysAgo === 24 && $index === 3)) {
                    continue;
                }

                MedicationLog::query()->updateOrCreate(
                    ['medication_id' => $medication->id, 'taken_on' => $date->toDateString()],
                    ['taken_at' => Carbon::parse($date->toDateString().' '.$medication->time), 'recorded_by' => $patient->id],
                );
            }
        }

        $appointments = [
            ['title' => 'Temujanji Susulan Pakar Kardiologi', 'doctor' => 'Dr. Arisya Zakaria', 'hospital' => 'Hospital Kuala Lumpur (HKL)', 'address' => 'Jalan Pahang, 50586 Kuala Lumpur', 'department' => 'Klinik Pakar Kardiologi, Tingkat 3', 'starts_at' => '2026-07-24 10:30:00', 'notes' => 'Sila puasa 8 jam sebelum ujian darah (lipid profile & HbA1c)', 'documents_needed' => ['Buku Rekod Tekanan Darah', 'Surat Rujukan HKL', 'Kad Pengenalan'], 'status' => 'Confirmed', 'distance_km' => 4.2],
            ['title' => 'Pemeriksaan Semula Gula & Endokrin', 'doctor' => 'Dr. Ramesh Kumar', 'hospital' => 'Pusat Perubatan Universiti Malaya (PPUM)', 'address' => 'Jalan Professor Diraja Ungku Abdul Aziz, 59100 Petaling Jaya', 'department' => 'Klinik Endokrinologi & Diabetes, Blok B', 'starts_at' => '2026-08-05 14:15:00', 'notes' => 'Bawa log keputusan ujian gula darah rumah (glucometer)', 'documents_needed' => ['Log Buku Diabetik', 'Kad Temujanji PPUM'], 'status' => 'Scheduled', 'distance_km' => 8.7],
            ['title' => 'Pemeriksaan Mata Diabetik (Retinopathy Screening)', 'doctor' => 'Dr. Nurul Huda', 'hospital' => 'Hospital Selayang', 'address' => 'Lebuh raya Selayang-Kepong, 68100 Batu Caves', 'department' => 'Klinik Oftalmologi (Mata)', 'starts_at' => '2026-09-12 09:00:00', 'notes' => 'Mata akan dititik ubat penitis anak mata, elakkan memandu selepas ujian', 'documents_needed' => ['Cermin mata sedia ada', 'Kad Pesakit'], 'status' => 'Pending Confirmation', 'distance_km' => 12.4],
        ];
        foreach ($appointments as $appointment) {
            Appointment::query()->updateOrCreate(['user_id' => $patient->id, 'title' => $appointment['title']], $appointment);
        }

        $documents = [
            ['title' => 'Polisi Insurans Hayat & Perubatan AIA Takaful', 'category' => 'Insurance', 'path' => 'seed/insurance-aia.pdf', 'size' => 2400000, 'metadata' => ['type' => 'PDF Document', 'policyNo' => 'POL-882910-MY', 'coverageAmount' => 'RM 250,000', 'tags' => ['Insurance', 'Medical Card', 'AIA'], 'notes' => 'Kad Perubatan Utama. Hubungi talian kecemasan AIA 1-300-88-1899.']],
            ['title' => 'Keputusan Ujian Lab Darah & HbA1c (HKL)', 'category' => 'Lab Results', 'path' => 'seed/hkl-lab-results.pdf', 'size' => 1100000, 'metadata' => ['type' => 'PDF Report', 'tags' => ['Blood Test', 'HKL', 'Diabetes', 'Lipid'], 'notes' => 'HbA1c: 6.8%. Kolesterol LDL: 2.3 mmol/L.']],
            ['title' => 'Surat Pelepasan Wad & Ringkasan Discas (Discharge Summary)', 'category' => 'Discharge Summary', 'path' => 'seed/ppum-discharge.pdf', 'size' => 3800000, 'metadata' => ['type' => 'PDF Document', 'tags' => ['Hospital Admission', 'PPUM', 'Heart Check'], 'notes' => 'Discas dari wad kardiologi PPUM selepas pemantauan 3 hari.']],
            ['title' => 'Preskripsi Ubat Pakar Kardiologi 2026', 'category' => 'Prescription', 'path' => 'seed/cardiology-prescription.png', 'size' => 850000, 'metadata' => ['type' => 'Image / Scan', 'tags' => ['Prescription', 'Amlodipine', 'HKL'], 'notes' => 'Preskripsi bekalan ubat untuk 3 bulan di Farmasi HKL.']],
        ];
        foreach ($documents as $document) {
            MedicalDocument::query()->updateOrCreate(['user_id' => $patient->id, 'title' => $document['title']], $document + ['disk' => 'local', 'mime_type' => 'application/octet-stream']);
        }

        $checklist = [
            ['item_key' => 'medication-plan', 'title' => 'Review medication plan', 'malay_title' => 'Semak pelan ubat', 'position' => 1],
            ['item_key' => 'caregiver-sync', 'title' => 'Caregiver sync review', 'malay_title' => 'Semak sync penjaga', 'position' => 2],
            ['item_key' => 'next-appointment', 'title' => 'Confirm next appointment', 'malay_title' => 'Sahkan temujanji seterusnya', 'position' => 3],
            ['item_key' => 'emergency-contacts', 'title' => 'Update emergency contacts', 'malay_title' => 'Kemas kini kontak kecemasan', 'position' => 4],
            ['item_key' => 'doctor-questions', 'title' => 'Prepare doctor questions', 'malay_title' => 'Sediakan soalan doktor', 'position' => 5],
        ];
        foreach ($checklist as $index => $item) {
            DashboardChecklistItem::query()->updateOrCreate(
                ['user_id' => $patient->id, 'item_key' => $item['item_key']],
                $item + ['completed_at' => $index < 2 ? now() : null],
            );
        }

        $terms = [
            ['term' => 'Myocardial Infarction', 'category' => 'Heart / Kardiologi', 'simple_explanation' => 'Serangan Jantung. Ia berlaku apabila salur darah yang membekalkan oksigen ke otot jantung tersumbat, menyebabkan sebahagian otot jantung rosak.', 'analogy' => 'Umpama paip air di rumah tersumbat teruk, jadi kawasan bilik tertentu tak dapat bekalan air.', 'key_takeaways' => ['Memerlukan rawatan kecemasan serta merta.', 'Simptom utama: sakit dada, sesak nafas, berpeluh dingin.', 'Boleh dicegah dengan mengawal kolesterol dan tekanan darah.'], 'questions_for_doctor' => ['Berapa peratus salur darah saya yang tersumbat?', 'Adakah saya perlu menjalani rawatan angioplasti?', 'Apakah aktiviti fizikal yang selamat sekarang?'], 'featured' => true],
            ['term' => 'Hyperlipidemia', 'category' => 'Metabolik', 'simple_explanation' => 'Paras kolesterol atau lemak tinggi dalam darah.', 'analogy' => 'Umpama minyak pekat mendap dalam paip air, membuatkan laluan darah menjadi makin sempit.', 'key_takeaways' => ['Biasanya tiada simptom awal tetapi meningkatkan risiko serangan jantung dan strok.', 'Boleh dikawal dengan pemakanan rendah lemak tepu dan ubat statin.'], 'questions_for_doctor' => ['Berapakah bacaan LDL saya sekarang?', 'Apakah sasaran bacaan kolesterol yang selamat?'], 'featured' => true],
            ['term' => 'Idiopathic Hypertension', 'category' => 'Tekanan Darah', 'simple_explanation' => 'Tekanan darah tinggi tanpa punca khusus yang jelas.', 'analogy' => 'Pam air berfungsi terlalu kuat melebihi tekanan biasa pada dinding paip.', 'key_takeaways' => ['Punca utama biasanya gabungan faktor genetik, usia, dan gaya hidup.', 'Memerlukan pengambilan ubat secara konsisten.'], 'questions_for_doctor' => ['Adakah ubat ini perlu diambil seumur hidup?', 'Bila masa terbaik mengambil ubat darah tinggi?'], 'featured' => true],
        ];
        foreach ($terms as $term) {
            MedicalTerm::query()->updateOrCreate(['term' => $term['term']], $term);
        }
        foreach ([
            ['term' => 'Benign', 'malay' => 'Bukan Kanser / Tidak Berbahaya', 'description' => 'Ketumbuhan atau bengkak yang selamat dan tidak merebak.'],
            ['term' => 'Malignant', 'malay' => 'Kanser / Berbahaya', 'description' => 'Ketumbuhan sel tidak normal yang boleh merosakkan tisu sekeliling.'],
            ['term' => 'EDTA / CBC Test', 'malay' => 'Ujian Darah Penuh', 'description' => 'Ujian untuk mengira sel darah merah, sel darah putih, dan platelet.'],
            ['term' => 'HbA1c', 'malay' => 'Purata Bacaan Gula 3 Bulan', 'description' => 'Ujian darah menunjukkan kawalan gula purata bagi pesakit kencing manis.'],
            ['term' => 'Arrhythmia', 'malay' => 'Denyutan Jantung Tidak Sekata', 'description' => 'Jantung berdegup terlalu laju, terlalu lambat, atau tidak teratur.'],
            ['term' => 'Edema', 'malay' => 'Bengkak Air', 'description' => 'Pengumpulan cecair berlebihan pada tisu badan terutama kaki atau buku lali.'],
        ] as $term) {
            MedicalTerm::query()->updateOrCreate(['term' => $term['term']], $term + ['is_symptom' => false, 'featured' => false]);
        }
        foreach (['Sakit Dada / Dada Rasa Senak', 'Sesak Nafas / Kesukaran Bernafas', 'Pening Kepala / Rasa Melayang', 'Sakit Sendi / Lutut Bengkak', 'Batuk Berpanjangan', 'Keletihan Luar Biasa', 'Gula Darah Rendah / Menggeletar'] as $symptom) {
            MedicalTerm::query()->updateOrCreate(['term' => $symptom], ['is_symptom' => true, 'featured' => false]);
        }

        foreach ([
            ['name' => 'Hospital Kuala Lumpur (HKL)', 'type' => 'Hospital Kerajaan (Awam)', 'address' => 'Jalan Pahang, 50586 Kuala Lumpur', 'distance_km' => 3.8, 'drive_time' => '9 min', 'er_phone' => '+603-26155555', 'has_emergency_24h' => true, 'google_map_url' => 'https://maps.google.com/?q=Hospital+Kuala+Lumpur'],
            ['name' => 'KPJ Tawakkal KL Specialist Hospital', 'type' => 'Hospital Pakar Swasta', 'address' => '1 Jalan Pahang Barat, 53000 Kuala Lumpur', 'distance_km' => 4.5, 'drive_time' => '11 min', 'er_phone' => '+603-40267777', 'has_emergency_24h' => true, 'google_map_url' => 'https://maps.google.com/?q=KPJ+Tawakkal+KL'],
            ['name' => 'Pusat Perubatan Universiti Malaya (PPUM)', 'type' => 'Hospital Universiti / Awam', 'address' => 'Jalan Professor Diraja Ungku Abdul Aziz, PJ', 'distance_km' => 8.2, 'drive_time' => '16 min', 'er_phone' => '+603-79494422', 'has_emergency_24h' => true, 'google_map_url' => 'https://maps.google.com/?q=PPUM'],
            ['name' => 'Klinik Kesihatan Kuala Lumpur (KKKL)', 'type' => 'Klinik Kesihatan Awam', 'address' => 'Jalan Fletcher, Off Jalan Tun Razak, KL', 'distance_km' => 2.9, 'drive_time' => '7 min', 'er_phone' => '+603-26983333', 'has_emergency_24h' => false, 'google_map_url' => 'https://maps.google.com/?q=Klinik+Kesihatan+Kuala+Lumpur'],
        ] as $facility) {
            EmergencyFacility::query()->updateOrCreate(['name' => $facility['name']], $facility);
        }
    }
}

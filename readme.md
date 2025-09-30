# Backend Mini AI

Proyek ini menerima upload file (CV dan report), lalu menggunakan AI untuk melakukan analisis CV, perbandingan dengan job vacancy, serta evaluasi project.

## 🚀 Fitur
- Upload CV dan report (menggunakan `multer`).
- Simpan file sementara di memori.
- Analisis CV untuk mengekstrak skill.
- Bandingkan CV dengan job vacancy.
- Evaluasi report project.
- Endpoint untuk mengecek hasil analisis.

## 🛠️ Tech Stack
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer) – upload file
- [uuid](https://www.npmjs.com/package/uuid) – generate ID unik
- Google Generative AI API (Gemini)
- ES Modules

## 📂 Struktur Project
```
backend-mini-ai/
├── routes/
│   ├── upload.js       # handle upload CV & report
│   ├── evaluate.js     # evaluasi menggunakan AI
│   ├── search.js       # search kandidat
│   ├── result.js       # ambil hasil evaluasi
├── services/
│   ├── ai.js           # konfigurasi model AI
│   ├── candidate.js    # simpan kandidat (sementara)
├── utils/
│   ├── safeGenerate.js # helper wrapper untuk AI
├── data/
│   ├── jobVacancy.js   # data lowongan kerja
├── app.js              # entrypoint express
```

## ⚙️ Setup & Jalankan
1. Clone repo
   ```bash
   git clone https://github.com/yusrondev/backend-mini-ai.git
   cd backend-mini-ai
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Buat file `.env` dan isi dengan API Key Gemini:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Jalankan server
   ```bash
   npm start
   ```
   Default berjalan di: [http://localhost:3000](http://localhost:3000)

5. Anda hanya perlu membuat database kosong sesuai konfigurasi pada `.env`, karena sistem sudah dilengkapi dengan auto migrate. Migrasi tabel akan dijalankan otomatis ketika aplikasi dijalankan pertama kali.

## 📌 API Endpoint

### 1. Upload File
**POST** `/upload`  

Form-data (file):  
- `cv` : file CV (text/pdf yang di-convert ke string)  
- `report` : file report  

Atau bisa gunakan file sample di dalam `sample-file/cv.text`, `sample-file/report.text`

Contoh cURL:
```bash
curl -X POST http://localhost:3000/upload   -F "cv=@./sample_cv.txt"   -F "report=@./sample_report.txt"
```

Response:
```json
{
  "id": "uuid-generated",
  "status": "uploaded"
}
```

### 2. Evaluasi CV & Report
**POST** `/evaluate`  

Body (JSON):
```json
{
  "id": "uuid-generated"
}
```

Contoh cURL:
```bash
curl -X POST http://localhost:3000/evaluate   -H "Content-Type: application/json"   -d '{"id":"uuid-generated"}'
```

Response langsung (queued):
```json
{
  "id": "uuid-generated",
  "status": "queued"
}
```

Setelah beberapa detik, hasil evaluasi akan menjadi:
```json
{
  "status": "completed",
  "result": {
    "cv_feedback": "...",
    "job_comparison": "...",
    "project_feedback": "..."
  }
}
```

### 3. Search Candidate
**POST** `/search`  

Body (JSON):
```json
{
  "jobDesc": "backend"
}
```

Contoh cURL:
```bash
curl --location 'http://localhost:3000/search' --header 'Content-Type: application/json' --data '{
  "jobDesc": "backend"
}'
```

Response (contoh):
```json
[
  {
    "id": "uuid-123",
    "cv": "CV content ...",
    "report": "Report content ..."
  }
]
```

### 4. Get Evaluation Result
**GET** `/result/:id`  

Mengambil hasil evaluasi berdasarkan `id`.  

Contoh cURL:
```bash
curl http://localhost:3000/result/uuid-generated
```

Response (jika sudah selesai):
```json
{
  "status": "completed",
  "result": {
    "cv_feedback": "...",
    "job_comparison": "...",
    "project_feedback": "..."
  }
}
```

Response (jika belum selesai):
```json
{
  "status": "queued"
}
```

## 👨‍💻 Author
- [Yusron Dev](https://github.com/yusrondev)

# AsyncView - AI-Powered Asynchronous Video Interview Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black" />
  <img src="https://img.shields.io/badge/NestJS-10-red" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4-green" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue" />
</div>

## 🎯 Proje Hakkında

AsyncView, yüksek hacimli işe alım süreçleri için tasarlanmış, AI destekli asenkron video mülakat platformudur. Türkiye pazarının "yüksek hacim, düşük maliyet" beklentisine uygun olarak optimize edilmiştir.

### ✨ Temel Özellikler

- **🎥 Asenkron Video Mülakat**: Adaylar istedikleri zaman, istedikleri yerde mülakat yapabilir
- **🤖 AI Destekli Analiz**: OpenAI Whisper + GPT-4 ile otomatik transkripsiyon ve değerlendirme
- **⏱️ Akıllı Video Oynatıcı**: Önemli anları işaretli timeline ile hızlı inceleme
- **📊 STAR Metodu Analizi**: Durum-Görev-Eylem-Sonuç metoduyla yapılandırılmış değerlendirme
- **🛡️ Güvenlik**: Tab-switching tespiti, şüpheli davranış raporlama
- **🌐 Düşük Bant Genişliği Modu**: Kötü internet bağlantılarında audio-only seçeneği

## 🏗️ Mimari

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│   NestJS API    │────▶│   PostgreSQL    │
│   (Frontend)    │     │   (Backend)     │     │   (Database)    │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │  Redis   │ │ OpenAI   │ │ Cloudflare│
              │ (Queue)  │ │ (AI)     │ │ R2 (CDN)  │
              └──────────┘ └──────────┘ └──────────┘
```

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- OpenAI API Key

### 1. Projeyi Klonla

```bash
git clone <repo-url>
cd asyncview
```

### 2. Bağımlılıkları Yükle

```bash
npm install
```

### 3. Environment Variables

Kök dizinde `.env` dosyası oluşturun:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/asyncview"

# Redis
REDIS_URL="redis://localhost:6379"

# OpenAI
OPENAI_API_KEY="sk-..."

# Cloudflare R2 (veya S3)
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME="asyncview-videos"
R2_PUBLIC_URL=""

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# App URLs
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3000"
```

### 4. Veritabanını Hazırla

```bash
cd apps/api
npx prisma generate
npx prisma db push
```

### 5. Projeyi Başlat

```bash
# Root dizinde
npm run dev
```

Bu komut hem frontend (port 3000) hem de backend (port 3001) sunucularını başlatır.

## 📁 Proje Yapısı

```
asyncview/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/           # Kimlik doğrulama
│   │   │   ├── interviews/     # Mülakat yönetimi
│   │   │   ├── candidates/     # Aday yönetimi
│   │   │   ├── responses/      # Video yanıtları
│   │   │   ├── upload/         # Dosya yükleme (R2/S3)
│   │   │   ├── queue/          # BullMQ işleri
│   │   │   └── ai/             # Whisper & GPT entegrasyonu
│   │   └── prisma/
│   │       └── schema.prisma   # Veritabanı şeması
│   │
│   └── web/                    # Next.js Frontend
│       └── src/
│           ├── app/
│           │   ├── auth/       # Giriş/Kayıt sayfaları
│           │   ├── dashboard/  # HR Dashboard
│           │   └── interview/  # Aday mülakat arayüzü
│           └── lib/
│               ├── api.ts      # API client
│               ├── store.ts    # Zustand state
│               └── utils.ts    # Yardımcı fonksiyonlar
│
├── package.json
├── turbo.json
└── README.md
```

## 🔄 İş Akışı

### 1. HR Tarafı

1. Hesap oluştur / Giriş yap
2. Yeni mülakat oluştur (sorular + zaman limitleri)
3. Adayları davet et (benzersiz link gönderilir)
4. Dashboard'dan sonuçları takip et
5. AI analizlerini incele, karar ver

### 2. Aday Tarafı

1. Davet linkine tıkla
2. Kamera/mikrofon ayarlarını test et
3. Her soru için:
   - Düşünme süresi (kayıt başlamaz)
   - Cevap kaydet
   - İsterse tekrar çek
4. Tüm sorular bitince gönder

### 3. AI İşleme (Arka Plan)

1. Video yüklendikten sonra Redis kuyruğuna eklenir
2. Whisper API ile transkripsiyon
3. GPT-4 ile analiz:
   - Yetkinlik puanlaması
   - STAR metodu değerlendirmesi
   - Önemli anların işaretlenmesi
   - Red flag tespiti
4. Sonuçlar veritabanına kaydedilir

## 💰 Maliyet Optimizasyonu

- **Cloudflare R2**: Egress ücreti yok (video izleme maliyeti ~$0)
- **Serverless-ready**: İşler sadece dosya geldiğinde çalışır
- **BullMQ**: Binlerce adayı sıraya alır, sunucu çökmez
- **GPT-4o-mini**: Maliyet/performans dengesi optimal

## 🔐 Güvenlik

- JWT tabanlı kimlik doğrulama
- Şüpheli davranış tespiti (tab switching)
- KVKK uyumlu veri işleme
- Yüz bulanıklaştırma seçeneği (roadmap)

## 📊 API Endpoints

### Auth
- `POST /api/auth/register` - Kayıt
- `POST /api/auth/login` - Giriş
- `GET /api/auth/me` - Kullanıcı bilgisi

### Interviews
- `GET /api/interviews` - Mülakatları listele
- `POST /api/interviews` - Mülakat oluştur
- `GET /api/interviews/:id` - Mülakat detayı
- `PUT /api/interviews/:id` - Güncelle
- `DELETE /api/interviews/:id` - Sil

### Candidates
- `POST /api/candidates/invite/:interviewId` - Aday davet et
- `GET /api/candidates/interview/:interviewId` - Adayları listele
- `GET /api/candidates/:id` - Aday detayı
- `PUT /api/candidates/:id/evaluation` - Değerlendirme güncelle

### Public (Aday Arayüzü)
- `GET /api/public/interview/:token` - Mülakat bilgisi
- `POST /api/public/interview/:token/start` - Mülakatı başlat
- `POST /api/public/responses/:token/:questionId` - Yanıt gönder
- `POST /api/public/interview/:token/complete` - Mülakatı tamamla

## 🛠️ Geliştirme

```bash
# Backend geliştirme
npm run dev:api

# Frontend geliştirme
npm run dev:web

# Prisma Studio (veritabanı görüntüleme)
npm run db:studio

# Lint
npm run lint
```

## 📝 Lisans

MIT

---

<div align="center">
  <p>Made with ❤️ in Turkey</p>
</div>


# BackSec — Discord Auto-mod Bot (tiếng Việt)

Bot tự động kiểm duyệt Discord với AI:
- Phát hiện **13 dạng scam** bằng Gemini AI (phishing, fake nitro, crypto scam, malware, mạo danh staff, fake support, sextortion, …)
- Quét **ảnh & video 18+ / máu me / bạo lực** (OpenAI omni-moderation + Gemini video)
- Chống **phân biệt vùng miền & chủng tộc** (danh sách tiếng Việt + AI)
- Chặn **link mã độc / phishing** (heuristic + AI)
- Tự động **xoá tin → tag user → tự xoá thông báo sau 10s** (Components V2)
- Hệ thống phạt theo mức: 5 phút → 28 ngày → BAN
- Lệnh `/violations` xem log vi phạm
- Lệnh `/setlog` tự tạo webhook gửi log vi phạm về kênh chỉ định (giống Dyno)

---

## 1. Cài đặt local

```bash
# Yêu cầu Node.js >= 20
npm install
cp .env.example .env
# Sửa .env, điền 3 key: DISCORD_BOT_TOKEN, OPENAI_API_KEY, GEMINI_API_KEY
npm start
```

---

## 2. Lấy các key cần thiết

### a) Discord Bot Token
1. Vào https://discord.com/developers/applications → **New Application**
2. Tab **Bot** → **Reset Token** → copy
3. Bật các **Privileged Gateway Intents**:
   - ✅ `MESSAGE CONTENT INTENT`
   - ✅ `SERVER MEMBERS INTENT`
4. Tab **OAuth2** → **URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Permissions: `View Channels`, `Send Messages`, `Manage Messages`, `Manage Webhooks`, `Moderate Members`, `Ban Members`, `Read Message History`
5. Mở URL → mời bot vào server.

### b) OpenAI API Key (free credit khi đăng ký mới)
- https://platform.openai.com/api-keys
- Dùng `omni-moderation-latest` — **moderation API miễn phí 100%**, không tính tiền.

### c) Gemini API Key (free tier rộng rãi)
- https://aistudio.google.com/apikey
- Free tier: ~1500 request/ngày với `gemini-2.5-flash` — đủ cho 1 server vừa.

---

## 3. Slash commands

| Lệnh | Quyền yêu cầu | Mô tả |
|------|---------------|-------|
| `/violations [user] [limit]` | Moderate Members | Xem log vi phạm gần đây |
| `/setlog channel:#log` | Manage Server | Đặt kênh nhận log (bot tự tạo webhook) |
| `/unsetlog` | Manage Server | Tắt log + xoá webhook |

---

## 4. Gợi ý host miễn phí

> ⚠️ Bot Discord cần chạy **24/7 long-running process**. Các free tier serverless (Vercel, Netlify, Cloudflare Workers) **KHÔNG** chạy được.

### 🏆 Khuyên dùng

| Nền tảng | Ưu điểm | Nhược điểm | Link |
|----------|---------|------------|------|
| **Replit** (Reserved VM nếu có gói, hoặc Always-On) | Deploy 1 click từ GitHub, secrets UI sẵn | Miễn phí có sleep, cần Hacker plan để always-on | https://replit.com |
| **Bot-Hosting.net** | Chuyên Discord bot, free tier 24/7 | Cần đăng ký, RAM giới hạn (~256MB) | https://bot-hosting.net |
| **Sparked Host (Free)** | Free Discord bot host, control panel | Phải vote duy trì | https://sparkedhost.com/free |
| **Discloud** | Chuyên Discord bot, free 100MB RAM | Tiếng BĐN, dùng quen được | https://discloud.com |
| **Oracle Cloud Free Tier** | VPS Always Free thực sự (4 core ARM, 24GB RAM) | Setup VPS thủ công, đăng ký khó | https://www.oracle.com/cloud/free/ |
| **Google Cloud e2-micro Free** | VPS 1GB miễn phí vĩnh viễn (chỉ region us-west1/central1/east1) | Cần thẻ tín dụng verify | https://cloud.google.com/free |
| **Fly.io** | $5 credit/tháng, đủ chạy 1 bot nhẹ | Cần thẻ tín dụng | https://fly.io |
| **Koyeb** | 1 web service free 24/7 | Phải workaround vì là service web | https://www.koyeb.com |

### Cách deploy nhanh

#### Option A — Bot-Hosting.net (đơn giản nhất)
1. Đăng ký, tạo bot mới, chọn **Node.js**
2. Upload toàn bộ thư mục này (zip)
3. Vào tab **Environment** → thêm 3 biến: `DISCORD_BOT_TOKEN`, `OPENAI_API_KEY`, `GEMINI_API_KEY`
4. **Start Command**: `npm install && npm start`
5. Bấm **Start**.

#### Option B — Oracle Cloud Always Free (mạnh nhất, tốn công)
```bash
# SSH vào VPS Ubuntu
sudo apt update && sudo apt install -y git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

git clone <your-repo> backsec-bot && cd backsec-bot
npm install
nano .env   # điền 3 key

# Chạy nền với pm2
sudo npm i -g pm2
pm2 start "npm start" --name backsec
pm2 save && pm2 startup    # để auto-start khi reboot
```

#### Option C — Fly.io
1. Cài CLI: `curl -L https://fly.io/install.sh | sh`
2. `fly launch` (chọn No cho database/Postgres)
3. Sửa `fly.toml`, đổi `processes` thành: `app = "npm start"`
4. `fly secrets set DISCORD_BOT_TOKEN=... OPENAI_API_KEY=... GEMINI_API_KEY=...`
5. `fly deploy`

---

## 5. Persistence

- Webhook log channel lưu vào `data/logChannels.json` (tự tạo khi dùng `/setlog`)
- Lịch sử vi phạm hiện lưu **in-memory** (1000 entries / server) → reset khi restart
- Nếu host có persistent disk thì `data/` được giữ lại, nếu không thì cấu hình `/setlog` cũng mất → set lại sau mỗi lần redeploy.

---

## 6. Quyền bot trong server (BẮT BUỘC)

| Quyền | Để làm gì |
|-------|-----------|
| View Channels | Đọc tin nhắn |
| Send Messages | Gửi cảnh báo |
| Manage Messages | Xoá tin vi phạm |
| Manage Webhooks | Tự tạo webhook log channel |
| Moderate Members | Khoá miệng (timeout) |
| Ban Members | Ban cho vi phạm cực nặng (sexual + minors, …) |

Role bot phải **cao hơn** role thành viên cần xử lý.

---

## 7. Cấu trúc

```
src/
  index.ts             # Entry — Discord client + xử lý message
  moderation.ts        # OpenAI moderation + tổng hợp tất cả check
  aiScam.ts            # Gemini-based scam classifier (13 loại)
  videoModeration.ts   # Gemini quét video
  vnHate.ts            # Phát hiện hate/regional/racial tiếng Việt
  maliciousLinks.ts    # Heuristic link mã độc / phishing
  messages.ts          # Pool câu cảnh báo tự nhiên (ngẫu nhiên)
  types.ts             # Action enum + label
  violationLog.ts      # In-memory violation log per guild
  logChannel.ts        # Webhook log channel (file-backed)
  commands.ts          # Slash commands (/violations, /setlog, /unsetlog)
```

---

Made with ❤️ — Support For safety

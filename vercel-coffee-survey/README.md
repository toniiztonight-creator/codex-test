# Coffee Field — ระบบสำรวจข้อมูลกาแฟต้นน้ำ–กลางน้ำ

แพ็กเกจพร้อม deploy บน Vercel โดยใช้ Google Sheet ชื่อ `coffee test` เป็นฐานข้อมูล และ Google Apps Script เป็น API

## ความสามารถ

- หน้าเดียวสำหรับ Dashboard, แบบสำรวจ, รายการข้อมูล และจัดการผู้ใช้
- `admin`: ดู/เพิ่ม/แก้ไข/ลบแบบสำรวจทั้งหมด และจัดการบัญชีผู้ใช้
- `user`: เพิ่มแบบสำรวจและดูรายการที่ตนบันทึก
- Dashboard อ่านข้อมูลล่าสุดจาก Google Sheet ทุก 15 วินาที
- แผนที่พื้นที่สำรวจจาก latitude/longitude ด้วย Leaflet และ OpenStreetMap
- ชุดข้อมูลจำลอง 12 พื้นที่สำหรับสาธิต Dashboard และแผนที่ (ผู้ดูแลเพิ่มได้ครั้งเดียวโดยไม่เกิดรายการซ้ำ)
- เก็บข้อมูลพื้นที่เพาะปลูก/เก็บเกี่ยว ผลผลิต แหล่งรับซื้อ ราคา มาตรฐาน และปัญหา
- รหัสผ่านเก็บเป็น SHA-256 พร้อม salt และ session หมดอายุภายใน 12 ชั่วโมง
- ป้องกันค่าในชีตที่อาจถูกตีความเป็นสูตร และมี audit log

## 1. สร้าง Google Sheet และ Apps Script

### วิธีอัตโนมัติ (แนะนำเมื่อ Google Drive connector ใช้งานไม่ได้)

1. เปิด [script.google.com](https://script.google.com) แล้วสร้าง **New project**
2. วางไฟล์ `apps-script/Code.gs` ในไฟล์ Code และแทน manifest ด้วย `apps-script/appsscript.json`
3. เลือกฟังก์ชัน `createCoffeeSheet` แล้วกด Run และอนุญาตสิทธิ์
4. เปิด Execution log ระบบจะแสดง URL ของ Google Sheet `coffee test`, username `admin` และ temporary password
5. ทำขั้นตอน Deploy ตั้งแต่ข้อ 6 ด้านล่าง

### วิธีผูกกับ Google Sheet ที่สร้างไว้แล้ว

1. สร้าง Google Sheet เปล่า ตั้งชื่อ `coffee test`
2. เปิด **ส่วนขยาย → Apps Script**
3. วางไฟล์ `apps-script/Code.gs` ในไฟล์ Code และแทน manifest ด้วย `apps-script/appsscript.json`
4. เลือกฟังก์ชัน `setupCoffeeSheet` แล้วกด Run และอนุญาตสิทธิ์ ระบบจะสร้างชีต `users`, `sessions`, `surveys`, `audit`
5. เปิด Execution log แล้วจด username `admin` และ temporary password ไว้ในที่ปลอดภัย
6. เลือก **Deploy → New deployment → Web app** ตั้ง Execute as เป็น **Me** และ Who has access เป็น **Anyone** จากนั้น Deploy
7. คัดลอก URL ที่ลงท้ายด้วย `/exec` เก็บไว้สำหรับตั้งค่า Vercel

Apps Script endpoint เปิดรับคำขอได้สาธารณะ แต่ทุกคำสั่งที่อ่านหรือแก้ข้อมูลต้องมี session token ที่ได้จากการ login ยกเว้นคำสั่ง login เอง

## 2. Deploy บน Vercel

จากโฟลเดอร์นี้ สามารถ import repository เข้า Vercel หรือใช้ Vercel CLI:

```bash
npx vercel
```

ใน Project Settings → Environment Variables เพิ่ม:

```text
GAS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

ตั้งค่าให้ครบทั้ง Production, Preview และ Development ตามที่ต้องการ แล้ว Redeploy

## 3. ทดสอบ

```bash
npm test
```

หลัง deploy ให้ทดสอบ login ด้วยบัญชี admin, สร้าง user หนึ่งบัญชี, บันทึกแบบสำรวจหนึ่งรายการ และตรวจว่าตัวเลข Dashboard อัปเดตภายใน 15 วินาที

## อัปเดตระบบเดิมเพื่อใช้พิกัดและแผนที่

1. นำ `apps-script/Code.gs` เวอร์ชันล่าสุดไปแทนไฟล์เดิมใน Apps Script แล้วบันทึก
2. เลือกฟังก์ชัน `migrateCoffeeSheet` แล้วกด Run เพื่อเพิ่มคอลัมน์ `latitude` และ `longitude` ต่อท้ายชีต `surveys` โดยรักษาข้อมูลเดิม
3. Deploy → Manage deployments → Edit → New version แล้วกด Deploy โดยใช้ URL `/exec` เดิม
4. หลัง Vercel deploy เวอร์ชันล่าสุด ให้เข้าสู่ระบบด้วย admin และกด **เพิ่มข้อมูลตัวอย่าง** บน Dashboard

ตัวเลขพื้นที่ ผลผลิต ราคา ชื่อผู้ให้ข้อมูล และรายละเอียดในชุดตัวอย่างเป็นข้อมูลจำลองเพื่อทดสอบระบบ ไม่ใช่สถิติทางการ พิกัดเป็นจุดอ้างอิงระดับตำบล ดัดแปลงจากชุดข้อมูลสาธารณะ [Thailand province/district/subdistrict/latitude/longitude](https://github.com/spicydog/thailand-province-district-subdistrict-zipcode-latitude-longitude) (MIT License, © 2018 spicydog) ซึ่งระบุแหล่งต้นทางเป็นรหัสพื้นที่ของธนาคารแห่งประเทศไทยและข้อมูลพิกัดจาก data.go.th จึงไม่ใช่ขอบเขตหรือพิกัดแปลงจริงและควรตรวจสอบภาคสนามก่อนใช้งาน แผนที่ใช้ข้อมูลจาก [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

## การดูแล

- เปลี่ยนโค้ด Apps Script แล้วให้ Deploy → Manage deployments → Edit → New version โดยใช้ deployment เดิม
- อย่าแก้ชื่อหัวคอลัมน์ในชีตโดยตรง
- จำกัดสิทธิ์เข้าถึงไฟล์ Google Sheet ให้เฉพาะผู้ดูแลข้อมูล
- ปิดบัญชีแทนการลบ เพื่อรักษาความเชื่อมโยงกับข้อมูลเดิม
- การลบแบบสำรวจของ admin เป็นการลบแถวจริง โดยบันทึกรายละเอียดไว้ใน `audit`

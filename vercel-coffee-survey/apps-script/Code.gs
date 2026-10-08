const SHEETS = {
  users: ['username','displayName','role','passwordHash','passwordSalt','active','createdAt','updatedAt'],
  sessions: ['tokenHash','username','expiresAt','createdAt'],
  surveys: ['id','respondentName','respondentType','phone','reportYear','province','district','subdistrict','siteName','stage','coffeeType','plantedAreaRai','harvestedAreaRai','productionKg','productForm','buyerSource','averagePrice','productionStandard','certificateNo','challenges','notes','createdBy','createdByName','createdAt','updatedAt','latitude','longitude'],
  audit: ['timestamp','username','action','resourceId','details']
};
const SESSION_HOURS = 12;
const MOCK_SURVEYS = [
  ['doi-chang','กลุ่มตัวอย่างดอยช้าง','เชียงราย','แม่สรวย','วาวี','พื้นที่ตัวอย่างดอยช้าง','ต้นน้ำ','อะราบิกา',42,36,16200,'ผลสด (เชอร์รี)','สหกรณ์/กลุ่มเกษตรกร',28,'GI',19.848,99.497],
  ['doi-tung','กลุ่มตัวอย่างดอยตุง','เชียงราย','แม่ฟ้าหลวง','แม่ฟ้าหลวง','พื้นที่ตัวอย่างดอยตุง','กลางน้ำ','อะราบิกา',26,24,9800,'สารกาแฟ','โรงคั่ว/ผู้แปรรูป',185,'มาตรฐานอื่น ๆ',20.288,99.783],
  ['mae-kampong','กลุ่มตัวอย่างแม่กำปอง','เชียงใหม่','แม่ออน','ห้วยแก้ว','พื้นที่ตัวอย่างแม่กำปอง','ต้นน้ำ','อะราบิกา',18,15,6400,'กาแฟกะลา','ขายตรงผู้บริโภค',135,'Organic',18.884,99.327],
  ['khun-wang','กลุ่มตัวอย่างขุนวาง','เชียงใหม่','แม่วาง','แม่วิน','พื้นที่ตัวอย่างขุนวาง','ต้นน้ำ','อะราบิกา',35,31,12400,'ผลสด (เชอร์รี)','สหกรณ์/กลุ่มเกษตรกร',31,'GAP',18.683,98.674],
  ['bo-kluea','กลุ่มตัวอย่างบ่อเกลือ','น่าน','บ่อเกลือ','บ่อเกลือใต้','พื้นที่ตัวอย่างบ่อเกลือ','ต้นน้ำ','อะราบิกา',21,17,7100,'กาแฟกะลา','ผู้รวบรวมท้องถิ่น',118,'ไม่ได้รับการรับรอง',19.127,101.13],
  ['pua','กลุ่มตัวอย่างปัว','น่าน','ปัว','ศิลาแลง','พื้นที่ตัวอย่างปัว','กลางน้ำ','อะราบิกา',14,13,5200,'เมล็ดคั่ว','ขายตรงผู้บริโภค',320,'มาตรฐานอื่น ๆ',19.148,100.967],
  ['khao-kho','กลุ่มตัวอย่างเขาค้อ','เพชรบูรณ์','เขาค้อ','เขาค้อ','พื้นที่ตัวอย่างเขาค้อ','ต้นน้ำ','อะราบิกา',28,24,8900,'กาแฟกะลา','โรงคั่ว/ผู้แปรรูป',142,'GAP',16.631,100.999],
  ['khao-thalu','กลุ่มตัวอย่างเขาทะลุ','ชุมพร','สวี','เขาทะลุ','พื้นที่ตัวอย่างเขาทะลุ','ต้นน้ำ','โรบัสต้า',55,49,29400,'ผลสด (เชอร์รี)','สหกรณ์/กลุ่มเกษตรกร',24,'GI',10.197,98.915],
  ['tha-sae','กลุ่มตัวอย่างท่าแซะ','ชุมพร','ท่าแซะ','ท่าข้าม','พื้นที่ตัวอย่างท่าแซะ','กลางน้ำ','โรบัสต้า',62,58,34800,'สารกาแฟ','บริษัทเอกชน',82,'GAP',10.66,99.105],
  ['kra-buri','กลุ่มตัวอย่างกระบุรี','ระนอง','กระบุรี','น้ำจืด','พื้นที่ตัวอย่างกระบุรี','ต้นน้ำ','โรบัสต้า',37,33,18100,'กาแฟกะลา','ผู้รวบรวมท้องถิ่น',76,'ไม่ได้รับการรับรอง',10.394,98.842],
  ['ban-na-san','กลุ่มตัวอย่างบ้านนาสาร','สุราษฎร์ธานี','บ้านนาสาร','นาสาร','พื้นที่ตัวอย่างบ้านนาสาร','กลางน้ำ','โรบัสต้า',44,40,22600,'สารกาแฟ','บริษัทเอกชน',86,'GAP',8.812,99.359],
  ['betong','กลุ่มตัวอย่างเบตง','ยะลา','เบตง','เบตง','พื้นที่ตัวอย่างเบตง','กลางน้ำ','โรบัสต้า',16,14,5900,'เมล็ดคั่ว','ขายตรงผู้บริโภค',285,'มาตรฐานอื่น ๆ',5.803,101.009]
];

function setupCoffeeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('ไม่พบ Google Sheet ที่ผูกกับโปรเจกต์ ให้ใช้ createCoffeeSheet แทน');
  PropertiesService.getScriptProperties().setProperty('COFFEE_SHEET_ID',ss.getId());
  return setupCoffeeSheet_(ss);
}

/** Run this from a standalone project at script.google.com to create the Sheet automatically. */
function createCoffeeSheet() {
  const ss = SpreadsheetApp.create('coffee test');
  PropertiesService.getScriptProperties().setProperty('COFFEE_SHEET_ID',ss.getId());
  setupCoffeeSheet_(ss);
  console.log('Created coffee test: '+ss.getUrl());
  return ss.getUrl();
}

function setupCoffeeSheet_(ss) {
  ss.rename('coffee test');
  Object.entries(SHEETS).forEach(([name, headers]) => {
    const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1,1,1,headers.length).setValues([headers]);
    } else {
      const columns = sheet.getLastColumn();
      const actual = sheet.getRange(1,1,1,columns).getValues()[0];
      if (columns > headers.length || JSON.stringify(actual) !== JSON.stringify(headers.slice(0,columns))) throw new Error('หัวตารางชีต '+name+' ไม่ตรงกับระบบ');
      if (columns < headers.length) sheet.getRange(1,columns+1,1,headers.length-columns).setValues([headers.slice(columns)]);
    }
    sheet.setFrozenRows(1);
    sheet.getRange(1,1,1,headers.length).setFontWeight('bold').setBackground('#173d2b').setFontColor('#ffffff');
  });
  const users = rows_('users');
  if (!users.length) {
    const password = random_(16);
    const salt = random_(24);
    append_('users', {username:'admin',displayName:'ผู้ดูแลระบบ',role:'admin',passwordHash:hash_(password,salt),passwordSalt:salt,active:true,createdAt:now_(),updatedAt:now_()});
    console.log('Temporary admin username: admin');
    console.log('Temporary admin password: '+password);
    console.log('กรุณาจดรหัสผ่านจาก Execution log และลบ log หลังนำไปเก็บในที่ปลอดภัย');
  }
  console.log('Spreadsheet ready: '+ss.getUrl());
}

/** Run after updating Code.gs to add new columns to an existing coffee test sheet. */
function migrateCoffeeSheet() {
  setupCoffeeSheet_(db_());
  console.log('Schema migration completed.');
}

/** Optional: run from the editor to add the idempotent demonstration dataset. */
function seedMockData() {
  return seedMockSurveys_({username:'system'});
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = text_(body.action,'action',true,40);
    const publicActions = {login: login_};
    if (publicActions[action]) return json_({ok:true,data:publicActions[action](body)});
    const actor = authenticate_(body.token);
    const actions = {
      me: () => ({user:publicUser_(actor)}),
      logout: () => logout_(body.token,actor),
      dashboard: () => dashboard_(body,actor),
      createSurvey: () => createSurvey_(body.survey,actor),
      listSurveys: () => listSurveys_(actor),
      updateSurvey: () => updateSurvey_(body.survey,actor),
      deleteSurvey: () => deleteSurvey_(body.id,actor),
      seedMockSurveys: () => seedMockSurveys_(actor),
      listUsers: () => listUsers_(actor),
      createUser: () => createUser_(body.user,actor),
      setUserActive: () => setUserActive_(body,actor)
    };
    if (!actions[action]) throw new Error('ไม่รู้จักคำสั่งนี้');
    return json_({ok:true,data:actions[action]()});
  } catch (error) {
    return json_({ok:false,error:error.message || 'เกิดข้อผิดพลาด'});
  }
}

function login_(body) {
  cleanupSessions_();
  const username = text_(body.username,'ชื่อผู้ใช้',true,40).toLowerCase();
  const password = text_(body.password,'รหัสผ่าน',true,200);
  const user = rows_('users').find(x => String(x.username).toLowerCase() === username);
  if (!user || !truthy_(user.active) || hash_(password,user.passwordSalt) !== user.passwordHash) throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  const token = random_(48), created = new Date(), expires = new Date(created.getTime()+SESSION_HOURS*3600000);
  append_('sessions',{tokenHash:hash_(token,''),username:user.username,expiresAt:expires.toISOString(),createdAt:created.toISOString()});
  audit_(user.username,'LOGIN','',{});
  return {token,user:publicUser_(user),expiresAt:expires.toISOString()};
}
function logout_(token,actor) {
  const hash = hash_(text_(token,'token',true,200),'');
  const found = findRow_('sessions',x=>x.tokenHash===hash);
  if (found) db_().getSheetByName('sessions').deleteRow(found.row);
  audit_(actor.username,'LOGOUT','',{});
  return {success:true};
}
function authenticate_(token) {
  const hash = hash_(text_(token,'token',true,200),'');
  const session = rows_('sessions').find(x=>x.tokenHash===hash && new Date(x.expiresAt).getTime()>Date.now());
  if (!session) throw new Error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
  const user = rows_('users').find(x=>x.username===session.username && truthy_(x.active));
  if (!user) throw new Error('บัญชีนี้ถูกปิดใช้งาน');
  return user;
}
function requireAdmin_(actor) { if (actor.role !== 'admin') throw new Error('รายการนี้สำหรับผู้ดูแลระบบเท่านั้น'); }

function createSurvey_(input,actor) {
  const record = validateSurvey_(input);
  return locked_(()=>{
    record.id = Utilities.getUuid(); record.createdBy=actor.username; record.createdByName=actor.displayName; record.createdAt=now_(); record.updatedAt=record.createdAt;
    append_('surveys',record); audit_(actor.username,'CREATE_SURVEY',record.id,{province:record.province}); return {survey:record};
  });
}
function listSurveys_(actor) {
  const records = rows_('surveys').filter(x=>actor.role==='admin'||x.createdBy===actor.username).sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));
  return {records};
}
function updateSurvey_(input,actor) {
  requireAdmin_(actor); const id=text_(input && input.id,'รหัสรายการ',true,80), record=validateSurvey_(input);
  return locked_(()=>{const found=findRow_('surveys',x=>x.id===id);if(!found)throw new Error('ไม่พบแบบสำรวจ');record.id=id;record.createdBy=found.value.createdBy;record.createdByName=found.value.createdByName;record.createdAt=found.value.createdAt;record.updatedAt=now_();writeRow_('surveys',found.row,record);audit_(actor.username,'UPDATE_SURVEY',id,{});return {survey:record}});
}
function deleteSurvey_(id,actor) {
  requireAdmin_(actor); id=text_(id,'รหัสรายการ',true,80);
  return locked_(()=>{const found=findRow_('surveys',x=>x.id===id);if(!found)throw new Error('ไม่พบแบบสำรวจ');db_().getSheetByName('surveys').deleteRow(found.row);audit_(actor.username,'DELETE_SURVEY',id,{respondentName:found.value.respondentName});return {success:true}});
}
function seedMockSurveys_(actor) {
  if (actor.username !== 'system') requireAdmin_(actor);
  setupCoffeeSheet_(db_());
  return locked_(()=>{
    const existing=new Set(rows_('surveys').map(x=>String(x.id))), now=now_();
    let inserted=0,skipped=0;
    MOCK_SURVEYS.forEach(x=>{
      const id='mock-'+x[0];
      if(existing.has(id)){skipped++;return}
      append_('surveys',{id,respondentName:x[1],respondentType:'กลุ่มเกษตรกร/สหกรณ์',phone:'',reportYear:2569,province:x[2],district:x[3],subdistrict:x[4],siteName:x[5],stage:x[6],coffeeType:x[7],plantedAreaRai:x[8],harvestedAreaRai:x[9],productionKg:x[10],productForm:x[11],buyerSource:x[12],averagePrice:x[13],productionStandard:x[14],certificateNo:'',challenges:'ข้อมูลตัวอย่างสำหรับทดสอบระบบ',notes:'ข้อมูลจำลอง ไม่ใช่สถิติทางการ; พิกัดเป็นตำแหน่งอ้างอิงระดับพื้นที่',createdBy:'demo',createdByName:'ชุดข้อมูลตัวอย่าง',createdAt:now,updatedAt:now,latitude:x[15],longitude:x[16]});
      existing.add(id);inserted++;
    });
    if(actor.username!=='system')audit_(actor.username,'SEED_MOCK_SURVEYS','',{inserted,skipped});
    return {inserted,skipped,total:MOCK_SURVEYS.length};
  });
}
function validateSurvey_(v) {
  if(!v||typeof v!=='object')throw new Error('ข้อมูลแบบสำรวจไม่ถูกต้อง');
  const planted=number_(v.plantedAreaRai,'พื้นที่เพาะปลูก',true), harvested=number_(v.harvestedAreaRai,'พื้นที่เก็บเกี่ยว',false);
  if(harvested!==''&&harvested>planted)throw new Error('พื้นที่เก็บเกี่ยวต้องไม่มากกว่าพื้นที่เพาะปลูก');
  const year=number_(v.reportYear,'ปีข้อมูล',true);if(!Number.isInteger(year)||year<2500||year>2700)throw new Error('ปีข้อมูลต้องเป็น พ.ศ. 2500–2700');
  return {
    respondentName:text_(v.respondentName,'ชื่อผู้ให้ข้อมูล',true,120),respondentType:choice_(v.respondentType,['เกษตรกร','กลุ่มเกษตรกร/สหกรณ์','ผู้รวบรวม','ผู้แปรรูป','หน่วยงาน'],'ประเภทผู้ให้ข้อมูล'),phone:text_(v.phone,'เบอร์โทรศัพท์',false,30),reportYear:year,
    province:text_(v.province,'จังหวัด',true,80),district:text_(v.district,'อำเภอ',true,80),subdistrict:text_(v.subdistrict,'ตำบล',false,80),siteName:text_(v.siteName,'ชื่อแปลง/กลุ่ม/กิจการ',true,160),stage:choice_(v.stage,['ต้นน้ำ','กลางน้ำ'],'ช่วงห่วงโซ่'),coffeeType:choice_(v.coffeeType,['อะราบิกา','โรบัสต้า','อื่น ๆ'],'ชนิดกาแฟ'),
    plantedAreaRai:planted,harvestedAreaRai:harvested,productionKg:number_(v.productionKg,'ปริมาณผลผลิต',true),productForm:choice_(v.productForm,['ผลสด (เชอร์รี)','กาแฟกะลา','สารกาแฟ','เมล็ดคั่ว','กาแฟบด'],'รูปแบบผลผลิต'),buyerSource:choice_(v.buyerSource,['สหกรณ์/กลุ่มเกษตรกร','ผู้รวบรวมท้องถิ่น','โรงคั่ว/ผู้แปรรูป','บริษัทเอกชน','ขายตรงผู้บริโภค','อื่น ๆ'],'แหล่งรับซื้อ'),averagePrice:number_(v.averagePrice,'ราคาขายเฉลี่ย',false),productionStandard:choice_(v.productionStandard,['ไม่ได้รับการรับรอง','GAP','Organic','GI','Fairtrade','มาตรฐานอื่น ๆ'],'มาตรฐานการผลิต'),certificateNo:text_(v.certificateNo,'เลขที่ใบรับรอง',false,100),challenges:text_(v.challenges,'ปัญหา/ความต้องการ',false,1000),notes:text_(v.notes,'หมายเหตุ',false,1000),latitude:coordinate_(v.latitude,'Latitude',-90,90),longitude:coordinate_(v.longitude,'Longitude',-180,180)
  };
}

function dashboard_(body,actor) {
  let records=rows_('surveys');
  const year=String(body.year||''),province=String(body.province||'');
  const all=records.slice(); if(year)records=records.filter(x=>String(x.reportYear)===year);if(province)records=records.filter(x=>x.province===province);
  const totals={records:records.length,plantedAreaRai:sum_(records,'plantedAreaRai'),harvestedAreaRai:sum_(records,'harvestedAreaRai'),productionKg:sum_(records,'productionKg')};
  const locations=records.filter(x=>x.latitude!==''&&x.longitude!==''&&Number.isFinite(Number(x.latitude))&&Number.isFinite(Number(x.longitude))).map(x=>({id:x.id,siteName:x.siteName,province:x.province,district:x.district,coffeeType:x.coffeeType,productionKg:Number(x.productionKg)||0,latitude:Number(x.latitude),longitude:Number(x.longitude),isMock:String(x.id).indexOf('mock-')===0}));
  return {totals,filters:{years:unique_(all.map(x=>x.reportYear)).sort().reverse(),provinces:unique_(all.map(x=>x.province)).sort()},provinces:group_(records,'province').map(g=>({province:g.key,plantedAreaRai:sum_(g.rows,'plantedAreaRai'),productionKg:sum_(g.rows,'productionKg')})).sort((a,b)=>b.productionKg-a.productionKg),standards:group_(records,'productionStandard').map(g=>({name:g.key,count:g.rows.length})).sort((a,b)=>b.count-a.count),buyers:group_(records,'buyerSource').map(g=>({name:g.key,productionKg:sum_(g.rows,'productionKg')})).sort((a,b)=>b.productionKg-a.productionKg),stages:Object.fromEntries(group_(records,'stage').map(g=>[g.key,g.rows.length])),locations};
}

function listUsers_(actor){requireAdmin_(actor);return {users:rows_('users').map(publicUser_)}}
function createUser_(v,actor){requireAdmin_(actor);if(!v)throw new Error('ข้อมูลผู้ใช้ไม่ถูกต้อง');const username=text_(v.username,'ชื่อผู้ใช้',true,40).toLowerCase();if(!/^[a-z0-9_.-]{3,40}$/.test(username))throw new Error('ชื่อผู้ใช้ใช้ได้เฉพาะ a-z, 0-9, จุด ขีด และขีดล่าง');const password=text_(v.password,'รหัสผ่าน',true,200);if(password.length<8)throw new Error('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');const role=choice_(v.role,['admin','user'],'สิทธิ์');return locked_(()=>{if(rows_('users').some(x=>String(x.username).toLowerCase()===username))throw new Error('ชื่อผู้ใช้นี้มีแล้ว');const salt=random_(24),user={username,displayName:text_(v.displayName,'ชื่อแสดง',true,100),role,passwordHash:hash_(password,salt),passwordSalt:salt,active:true,createdAt:now_(),updatedAt:now_()};append_('users',user);audit_(actor.username,'CREATE_USER',username,{role});return {user:publicUser_(user)}})}
function setUserActive_(body,actor){requireAdmin_(actor);const username=text_(body.username,'ชื่อผู้ใช้',true,40),active=body.active===true;if(username===actor.username&&!active)throw new Error('ไม่สามารถปิดบัญชีที่กำลังใช้งาน');return locked_(()=>{const found=findRow_('users',x=>x.username===username);if(!found)throw new Error('ไม่พบผู้ใช้');found.value.active=active;found.value.updatedAt=now_();writeRow_('users',found.row,found.value);audit_(actor.username,active?'ENABLE_USER':'DISABLE_USER',username,{});return {user:publicUser_(found.value)}})}

function db_(){const id=PropertiesService.getScriptProperties().getProperty('COFFEE_SHEET_ID');const active=SpreadsheetApp.getActiveSpreadsheet();if(id)return SpreadsheetApp.openById(id);if(active)return active;throw new Error('ยังไม่ได้สร้างฐานข้อมูล กรุณารัน createCoffeeSheet')}
function rows_(name){const sheet=db_().getSheetByName(name);if(!sheet)throw new Error('ยังไม่ได้ตั้งค่าระบบ กรุณารัน setupCoffeeSheet');const headers=SHEETS[name];if(sheet.getLastRow()<2)return [];return sheet.getRange(2,1,sheet.getLastRow()-1,headers.length).getValues().filter(r=>r[0]!==''&&r[0]!=null).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i] instanceof Date?r[i].toISOString():r[i]])))}
function append_(name,obj){const sheet=db_().getSheetByName(name);sheet.appendRow(SHEETS[name].map(h=>safe_(obj[h]==null?'':obj[h])));SpreadsheetApp.flush()}
function writeRow_(name,row,obj){const headers=SHEETS[name];db_().getSheetByName(name).getRange(row,1,1,headers.length).setValues([headers.map(h=>safe_(obj[h]==null?'':obj[h]))])}
function findRow_(name,predicate){const rows=rows_(name),i=rows.findIndex(predicate);return i<0?null:{row:i+2,value:rows[i]}}
function locked_(fn){const lock=LockService.getScriptLock();lock.waitLock(30000);try{return fn()}finally{lock.releaseLock()}}
function cleanupSessions_(){const sheet=db_().getSheetByName('sessions');if(!sheet)return;const expired=[];rows_('sessions').forEach((x,i)=>{if(new Date(x.expiresAt).getTime()<=Date.now())expired.push(i+2)});expired.reverse().forEach(r=>sheet.deleteRow(r))}
function audit_(username,action,resourceId,details){append_('audit',{timestamp:now_(),username,action,resourceId,details:JSON.stringify(details||{})})}
function publicUser_(u){return {username:u.username,displayName:u.displayName,role:u.role,active:truthy_(u.active),createdAt:u.createdAt,updatedAt:u.updatedAt}}
function hash_(value,salt){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(salt)+String(value)).map(b=>(b+256)%256).map(b=>('0'+b.toString(16)).slice(-2)).join('')}
function random_(length){return Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'').slice(0,Math.max(0,length-32))}
function now_(){return new Date().toISOString()}
function json_(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)}
function safe_(v){return typeof v==='string'&&/^[=+@\-\t\r\n]/.test(v)?"'"+v:v}
function truthy_(v){return v===true||String(v).toLowerCase()==='true'}
function text_(v,label,required,max){const s=String(v==null?'':v).trim();if(required&&!s)throw new Error('กรุณาระบุ '+label);if(s.length>(max||500))throw new Error(label+' ยาวเกินกำหนด');return s}
function choice_(v,options,label){const s=text_(v,label,true,200);if(!options.includes(s))throw new Error(label+' ไม่ถูกต้อง');return s}
function number_(v,label,required){if(v===''||v==null){if(required)throw new Error('กรุณาระบุ '+label);return ''}const n=Number(v);if(!Number.isFinite(n)||n<0)throw new Error(label+' ต้องเป็นเลขไม่ติดลบ');return n}
function coordinate_(v,label,min,max){if(v===''||v==null)throw new Error('กรุณาระบุ '+label);const n=Number(v);if(!Number.isFinite(n)||n<min||n>max)throw new Error(label+' ต้องอยู่ระหว่าง '+min+' ถึง '+max);return Math.round(n*1000000)/1000000}
function unique_(items){return [...new Set(items.filter(x=>x!==''&&x!=null))]}
function sum_(rows,key){return rows.reduce((n,x)=>n+(Number(x[key])||0),0)}
function group_(rows,key){const map={};rows.forEach(x=>{const k=String(x[key]||'ไม่ระบุ');(map[k]||(map[k]=[])).push(x)});return Object.entries(map).map(([key,rows])=>({key,rows}))}

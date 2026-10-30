import dotenv from 'dotenv';
import fs from 'fs/promises';
import { chromium } from 'playwright';

dotenv.config();

// Configuration: Use environment variables (for GitHub Actions) or fallback
const ERP_USERNAME = process.env.ERP_USERNAME || '24SE02ML253';
const ERP_PASSWORD = process.env.ERP_PASSWORD || '3@9%0B';

// Helper function to clean text artifacts from the ERP system
function cleanText(text) {
  return String(text || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Overwrites a static, viewable JSON file right in your project root folder
async function saveJSONToFile(filename, data) {
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8');
    console.log(`💾 Saved to disk: ./${filename}`);
  } catch (err) {
    console.error(`❌ Failed to write file ${filename}:`, err.message);
  }
}

// Core login layer
async function performERPLogin(page, username, password) {
  console.log(`🔄 Opening PPSU ERP for user: ${username}...`);
  await page.goto('https://erp.ppsu.ac.in/Login.aspx', { waitUntil: 'load' });

  // Select Student Role Radio Button
  await page.locator('input[type="radio"][name="rblRole"][value="Student"]').check();

  // Fill in credentials
  await page.locator('#txtUsername').fill(username);
  await page.locator('#txtPassword').fill(password);

  // Submit and wait for dashboard to load
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    page.locator('#btnLogin').click(),
  ]);

  console.log('✅ Login successful!');
}

// Attendance Scraping Logic
async function scrapeAttendance({ page }) {
  const attendanceUrl = 'https://erp.ppsu.ac.in/StudentPanel/TTM_Attendance/TTM_Attendance_StudentAttendance.aspx';
  console.log('\n📊 Opening Attendance page...');

  await page.goto(attendanceUrl, { waitUntil: 'load' });
  await page.waitForSelector('#tblAttendance', { timeout: 30000 });

  const attendanceData = await page.evaluate(() => {
    const clean = (text) => String(text || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

    const summary = {
      totalSlots: Number(clean(document.querySelector('#ctl00_cphPageContent_lblTotalLectureLabCount')?.textContent)),
      presentSlots: Number(clean(document.querySelector('#ctl00_cphPageContent_lblPresentLectureLabCount')?.textContent)),
      absentSlots: Number(clean(document.querySelector('#ctl00_cphPageContent_lblAbsentLectureLabCount')?.textContent)),
      attendancePercentage: Number(clean(document.querySelector('#ctl00_cphPageContent_lblPresentPCTCount')?.textContent)),
    };

    const subjects = Array.from(document.querySelectorAll('#tblAttendance tbody tr')).map((row) => {
      const td = row.querySelectorAll('td');
      return {
        sr: Number(clean(td[0]?.textContent)),
        slotType: clean(td[1]?.textContent),
        course: clean(td[2]?.textContent),
        conducted: Number(clean(td[3]?.textContent)),
        present: Number(clean(td[4]?.textContent)),
        absent: Number(clean(td[5]?.textContent)),
        attendancePercentage: Number(clean(td[6]?.textContent).replace('%', '')),
      };
    });

    const footer = {
      totalSlots: Number(clean(document.querySelector('#ctl00_cphPageContent_lblTotalSlots')?.textContent)),
      totalPresent: Number(clean(document.querySelector('#ctl00_cphPageContent_lblTotalPresent')?.textContent)),
      totalAbsent: Number(clean(document.querySelector('#ctl00_cphPageContent_lblTotalAbsent')?.textContent)),
      overallAttendancePercentage: Number(clean(document.querySelector('#ctl00_cphPageContent_lblPresentPercentage')?.textContent).replace('%', '')),
    };

    return { summary, footer, subjects };
  });

  return {
    fetchedAt: new Date().toISOString(),
    attendance: attendanceData,
  };
}

// Timetable Scraping Logic
async function scrapeTimetable({ page }) {
  const timetableUrl = 'https://erp.ppsu.ac.in/StudentPanel/TTM_TimeTable/TTM_TimeTable_StudentTimeTable.aspx';
  console.log('\n📅 Opening Timetable page...');

  await page.goto(timetableUrl, { waitUntil: 'load' });
  await page.waitForSelector('#ctl00_cphPageContent_divTimeTable', { timeout: 30000 });

  const timetableData = await page.evaluate(() => {
    const clean = (text) => String(text || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

    const metadata = {
      school: clean(document.querySelector('#lblTimeTable')?.textContent),
      details: clean(document.querySelectorAll('#lblTimeTable')[1]?.textContent),
      effectiveFrom: clean(document.querySelector('#lblDate')?.textContent).replace('w.e.f', '')
    };

    const headers = Array.from(document.querySelectorAll('#sample_1 thead th')).map(th => clean(th.textContent));
    const rows = Array.from(document.querySelectorAll('#sample_1 tbody tr'));
    const schedule = [];

    const skippedCells = new Set();

    rows.forEach((row, rowIndex) => {
      const cells = Array.from(row.querySelectorAll('td'));
      if (cells.length === 0) return;

      const timeSlotText = clean(cells[0].textContent);
      const timeParts = timeSlotText.split('to');
      const timeSlot = {
        raw: timeSlotText,
        start: clean(timeParts[0]),
        end: clean(timeParts[1])
      };

      let cellPointer = 1; 

      for (let dayIndex = 1; dayIndex < headers.length; dayIndex++) {
        if (skippedCells.has(`${dayIndex}-${rowIndex}`)) {
          continue;
        }

        const cell = cells[cellPointer];
        cellPointer++;

        if (!cell) continue;

        const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10);
        if (rowspan > 1) {
          for (let r = 1; r < rowspan; r++) {
            skippedCells.add(`${dayIndex}-${rowIndex + r}`);
          }
        }

        const spanText = cell.querySelector('span');
        if (spanText) {
          const boldText = cell.querySelector('b')?.textContent || '';

          let batch = null;
          if (spanText.textContent.includes('Batch-')) {
            const match = spanText.textContent.match(/(Batch-[A-Z])/);
            if (match) batch = match[0];
          }

          const facultyMatch = spanText.textContent.match(/\{([^}]+)\}/);
          const roomMatch = spanText.textContent.match(/\[([^\]]+)\]/);

          schedule.push({
            day: headers[dayIndex].split('\n')[0],
            date: headers[dayIndex].split('\n')[1] || '',
            time: timeSlot,
            durationSlots: rowspan, 
            courseCode: boldText.split(' - ')[0] || '',
            courseName: boldText.split(' - ')[1] || boldText,
            faculty: facultyMatch ? facultyMatch[1] : null,
            location: roomMatch ? roomMatch[1] : null,
            batch: batch,
            isLab: cell.classList.contains('LABColor')
          });
        }
      }
    });

    return { metadata, schedule };
  });

  return {
    fetchedAt: new Date().toISOString(),
    timetable: timetableData,
  };
}

// LMS Scraping Logic
async function scrapeLMS({ page }) {
  const lmsDashboardUrl = 'https://erp.ppsu.ac.in/StudentPanel/LMS/LMS_ContentStudentDashboard.aspx';
  console.log('\n📚 Opening LMS Dashboard page...');

  await page.goto(lmsDashboardUrl, { waitUntil: 'load' });
  await page.waitForSelector('.mt-card-item', { timeout: 30000 });

  const subjects = [];
  const subjectCards = await page.$$('.mt-card-item');
  
  for (const card of subjectCards) {
    const link = await card.$('a');
    const href = link ? await link.getAttribute('href') : '';
    const fullUrl = href ? `https://erp.ppsu.ac.in/StudentPanel/LMS/${href}` : '';
    
    const titleEl = await card.$('h3');
    const title = titleEl ? (await titleEl.textContent()).trim() : '';
    const code = title.split(' - ')[0] || '';
    const name = title.split(' - ')[1] || title;
    const contentCountSpan = await card.$('span[id*="lblCount"]');
    const contentCount = contentCountSpan ? (await contentCountSpan.textContent()).trim() : '';

    let subjectData = {
      courseCode: code,
      courseName: name,
      fullTitle: title,
      contentCount: contentCount,
      lmsUrl: fullUrl,
      content: [],
      assignments: [],
      tests: [],
      introduction: '',
    };

    if (fullUrl) {
      console.log(`    ├─ Scraping: ${name}`);
      try {
        await page.goto(fullUrl, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);

        const subjectPageData = await page.evaluate(() => {
          const clean = (text) => String(text || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
          const data = {
            introduction: '',
            content: [],
            assignments: [],
            tests: [],
          };

          const introTab = document.querySelector('#ctl00_cphPageContent_tab_SubjectDetails');
          if (introTab) data.introduction = clean(introTab.innerText);

          const contentTab = document.querySelector('#ctl00_cphPageContent_tab_ContentTypeWiseContentDetails');
          if (contentTab) {
            const contentItems = contentTab.querySelectorAll('a, h3, td');
            contentItems.forEach((item) => {
              const title = clean(item.textContent);
              const url = item.href || '';
              if (title && title.length > 5) {
                data.content.push({ title, url });
              }
            });
          }

          const assignmentsTab = document.querySelector('#ctl00_cphPageContent_tab_AssignmetDetails');
          if (assignmentsTab) {
            const items = assignmentsTab.querySelectorAll('a, h3, td');
            items.forEach((item) => {
              const title = clean(item.textContent);
              const url = item.href || '';
              if (title && title.length > 5) {
                data.assignments.push({ title, url });
              }
            });
          }

          const testsTab = document.querySelector('#ctl00_cphPageContent_tab_TestList');
          if (testsTab) {
            const items = testsTab.querySelectorAll('a, h3, td');
            items.forEach((item) => {
              const title = clean(item.textContent);
              const url = item.href || '';
              if (title && title.length > 5) {
                data.tests.push({ title, url });
              }
            });
          }
          return data;
        });

        subjectData = { ...subjectData, ...subjectPageData };
      } catch (err) {
        console.log('    └─ Error scraping subject page:', err.message);
      }
    }

    subjects.push(subjectData);
  }

  return {
    fetchedAt: new Date().toISOString(),
    lms: {
      subjects,
    },
  };
}

// -------------------------------------------------------------------------
//  MAIN EXECUTION FLOW
// -------------------------------------------------------------------------
(async () => {
  console.log('🚀 Starting Standalone ERP Scraper Module...');
  
  // Launching browser. Change headless to false if you want to watch it work.
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Authenticate
    await performERPLogin(page, ERP_USERNAME, ERP_PASSWORD);

    // 2. Scrape Attendance Data
    const attendanceResult = await scrapeAttendance({ page });
    console.log('\n--- 📚 ATTENDANCE RAW DATA RECIEVED ---');
    console.log(JSON.stringify(attendanceResult, null, 2));
    await saveJSONToFile('latest-attendance.json', attendanceResult);

    // 3. Scrape Timetable Schedule
    const timetableResult = await scrapeTimetable({ page });
    console.log('\n--- 📅 TIMETABLE RAW DATA RECIEVED ---');
    console.log(JSON.stringify(timetableResult, null, 2));
    await saveJSONToFile('latest-timetable.json', timetableResult);

    // 4. Scrape LMS Subjects
    const lmsResult = await scrapeLMS({ page });
    console.log('\n--- 📚 LMS RAW DATA RECIEVED ---');
    console.log(JSON.stringify(lmsResult, null, 2));
    await saveJSONToFile('latest-lms.json', lmsResult);

    console.log('\n✨ Execution fully completed. All data parsed and printed!');

  } catch (error) {
    console.error('\n❌ Critical Execution Error:', error.message);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
/* eslint-disable */
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generateCV() {
  const pdfDoc = await PDFDocument.create();
  
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const black = rgb(0.1, 0.1, 0.1);
  const darkGray = rgb(0.25, 0.25, 0.25);
  const lightGray = rgb(0.4, 0.4, 0.4);
  const lineGray = rgb(0.7, 0.7, 0.7);
  const linkBlue = rgb(0.1, 0.3, 0.7);

  // --- PAGE 1 ---
  const page1 = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width: p1W, height: p1H } = page1.getSize();

  let y = p1H - 45;
  const margin = 48;
  const contentWidth = p1W - margin * 2;

  // Header
  const name = "A.K. THARUSHA DENETH";
  const nameWidth = helveticaBold.widthOfTextAtSize(name, 20);
  page1.drawText(name, {
    x: (p1W - nameWidth) / 2,
    y: y,
    size: 20,
    font: helveticaBold,
    color: black,
  });
  y -= 18;

  const subtitle = "Full Stack Software Engineer - Undergraduate";
  const subWidth = helveticaBold.widthOfTextAtSize(subtitle, 11);
  page1.drawText(subtitle, {
    x: (p1W - subWidth) / 2,
    y: y,
    size: 11,
    font: helveticaBold,
    color: darkGray,
  });
  y -= 15;

  const contactLine = "Colombo, Sri Lanka  |  +94-714461982  |  tharushadeneth229@gmail.com";
  const contactWidth = helvetica.widthOfTextAtSize(contactLine, 9.5);
  page1.drawText(contactLine, {
    x: (p1W - contactWidth) / 2,
    y: y,
    size: 9.5,
    font: helvetica,
    color: lightGray,
  });
  y -= 14;

  const linksLine = "Portfolio: A.K Tharusha Deneth  |  LinkedIn: LinkedIn";
  const linksWidth = helvetica.widthOfTextAtSize(linksLine, 9.5);
  page1.drawText(linksLine, {
    x: (p1W - linksWidth) / 2,
    y: y,
    size: 9.5,
    font: helvetica,
    color: linkBlue,
  });
  y -= 22;

  // Helper for Section Titles
  function drawSectionTitle(page, title, currentY) {
    page.drawText(title, {
      x: margin,
      y: currentY,
      size: 11,
      font: helveticaBold,
      color: black,
    });
    const titleWidth = helveticaBold.widthOfTextAtSize(title, 11);
    page.drawLine({
      start: { x: margin, y: currentY - 4 },
      end: { x: p1W - margin, y: currentY - 4 },
      thickness: 0.75,
      color: lineGray,
    });
    return currentY - 18;
  }

  // Helper for multiline wrapped text
  function drawWrappedText(page, rawText, startX, startY, maxWidth, fontSize, font, color, lineHeight = 13) {
    const lines = rawText.split('\n');
    let currentY = startY;

    for (const lineText of lines) {
      const words = lineText.replace(/•/g, '-').split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && currentLine) {
          page.drawText(currentLine, { x: startX, y: currentY, size: fontSize, font, color });
          currentLine = word;
          currentY -= lineHeight;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        page.drawText(currentLine, { x: startX, y: currentY, size: fontSize, font, color });
        currentY -= lineHeight;
      }
    }
    return currentY;
  }

  // PROFESSIONAL SUMMARY
  y = drawSectionTitle(page1, "PROFESSIONAL SUMMARY", y);
  const summaryText = "Dedicated Software Engineering undergraduate with a strong foundation in full-stack development and UI/UX design. Proficient in modern front-end technologies, React Native, and Java-based backend systems. Passionate about building intuitive applications and solving complex technical challenges. Looking for an opportunity to apply my practical skills, contribute to dynamic projects, and grow as a professional software engineer.";
  y = drawWrappedText(page1, summaryText, margin, y, contentWidth, 9, helvetica, darkGray, 13);
  y -= 10;

  // EDUCATION
  y = drawSectionTitle(page1, "EDUCATION", y);
  page1.drawText("IIC University of Technology", { x: margin, y: y, size: 9.5, font: helveticaBold, color: black });
  page1.drawText("Expected 2027", { x: p1W - margin - 75, y: y, size: 9, font: helvetica, color: darkGray });
  y -= 13;
  page1.drawText("Bachelor of Software Engineering (Undergraduate)", { x: margin, y: y, size: 9, font: helveticaOblique, color: darkGray });
  y -= 13;
  y = drawWrappedText(page1, "Focus Areas: Advanced Software Engineering Concepts, Software Architecture, UI/UX Principles, & Future-Ready Full-Stack Development.", margin, y, contentWidth, 8.5, helvetica, darkGray, 12);
  y -= 8;

  page1.drawText("Java Institute for Advanced Technology", { x: margin, y: y, size: 9.5, font: helveticaBold, color: black });
  page1.drawText("Completed", { x: p1W - margin - 60, y: y, size: 9, font: helvetica, color: darkGray });
  y -= 13;
  page1.drawText("Higher Diploma in Software Engineering", { x: margin, y: y, size: 9, font: helveticaOblique, color: darkGray });
  y -= 13;
  y = drawWrappedText(page1, "Core Coursework & Technologies: Object-Oriented Programming (OOPC 1 & 2), Database Management Systems (DBMS & Workbench Tables), Java (EE), React Native, Cyber Security, Project Management, MCS 1 & 2, Generation 5.5 AI Engineering.", margin, y, contentWidth, 8.5, helvetica, darkGray, 12);
  y -= 10;

  // TECHNICAL SKILLS
  y = drawSectionTitle(page1, "TECHNICAL SKILLS", y);
  const skills = [
    "• Front-End & UI/UX: React Native, React.js, HTML5, CSS3, JavaScript, TypeScript, Figma (Wireframing & Prototyping).",
    "• Design Style: Retro/Vintage Aesthetics, 3D Web Animations, Responsive Layouts, Dark/Light Theme Logic.",
    "• Back-End & Tools: Java (Servlets, Hibernate), MySQL, Spring Boot, VS Code, NetBeans, GitHub, Netlify (Hosting)."
  ];
  for (const sk of skills) {
    y = drawWrappedText(page1, sk, margin, y, contentWidth, 8.5, helvetica, darkGray, 12);
  }
  y -= 10;

  // TECHNICAL & SOFTWARE DEVELOPMENT EXPERIENCE
  y = drawSectionTitle(page1, "TECHNICAL & SOFTWARE DEVELOPMENT EXPERIENCE", y);
  page1.drawText("Independent Software Projects", { x: margin, y: y, size: 9.5, font: helveticaBold, color: black });
  page1.drawText("Jan 2024 – Present", { x: p1W - margin - 90, y: y, size: 9, font: helvetica, color: darkGray });
  y -= 13;
  page1.drawText("Web Application Development & UI Design", { x: margin, y: y, size: 9, font: helveticaOblique, color: darkGray });
  y -= 13;
  const expBullets = [
    "• Front-End Engineering: Designed and coded responsive landing pages using modern CSS Framework and JavaScript, ensuring cross-browser compatibility.",
    "• UI/UX Design: Translated UI/UX concepts into fully responsive and interactive web interfaces using modern Front-End technologies including React, HTML5, CSS3, and JavaScript.",
    "• Open Projects: Developed 10+ custom skill-building web applications (e.g., AllFormatPro, Cineflix Movies) focusing on user-centric problem solving.",
    "• Mobile Development: Experimented with React Native to build APKs for mobile utility apps."
  ];
  for (const exp of expBullets) {
    y = drawWrappedText(page1, exp, margin, y, contentWidth, 8.5, helvetica, darkGray, 12);
  }
  y -= 10;

  // KEY PROJECTS (Page 1)
  y = drawSectionTitle(page1, "KEY PROJECTS", y);
  page1.drawText("Personal Developer Portfolio", { x: margin, y: y, size: 9.5, font: helveticaBold, color: black });
  page1.drawText("VISIT - Portfolio", { x: p1W - margin - 85, y: y, size: 9, font: helveticaOblique, color: linkBlue });
  y -= 13;
  y = drawWrappedText(page1, "• A centralized portfolio showcasing skills and projects.\n• Built with responsive front-end technologies to demonstrate clean coding practices and aesthetic design capabilities.", margin, y, contentWidth, 8.5, helvetica, darkGray, 12);

  // --- PAGE 2 ---
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  y = p1H - 55;

  // Cineflix Movies
  page2.drawText("Cineflix Movies  |  Web Application", { x: margin, y: y, size: 10, font: helveticaBold, color: black });
  page2.drawText("VISIT - Web Application", { x: p1W - margin - 120, y: y, size: 9, font: helveticaOblique, color: linkBlue });
  y -= 14;
  y = drawWrappedText(page2, "• Project Overview: Developed a user-friendly movie and TV series browsing platform featuring seamless search functionality for discovering new releases effortlessly.", margin, y, contentWidth, 8.5, helvetica, darkGray, 12);
  y = drawWrappedText(page2, "• Technologies Used: React.js, HTML5, CSS3, JavaScript.", margin, y, contentWidth, 8.5, helvetica, darkGray, 12);
  y -= 12;

  // Aurelia Hotel Site
  page2.drawText("Aurelia Hotel Site  |  Web Application", { x: margin, y: y, size: 10, font: helveticaBold, color: black });
  page2.drawText("VISIT - Web Application", { x: p1W - margin - 120, y: y, size: 9, font: helveticaOblique, color: linkBlue });
  y -= 14;
  y = drawWrappedText(page2, "• Project Overview: Developed a responsive and interactive hotel matching web application designed to streamline the accommodation search process with an intuitive user interface.", margin, y, contentWidth, 8.5, helvetica, darkGray, 12);
  y = drawWrappedText(page2, "• Technologies Used: HTML5, CSS3, JavaScript.", margin, y, contentWidth, 8.5, helvetica, darkGray, 12);
  y -= 12;

  // Lumina Salon Platform
  page2.drawText("Lumina Salon Platform  |  Web Application", { x: margin, y: y, size: 10, font: helveticaBold, color: black });
  page2.drawText("VISIT - Web Application", { x: p1W - margin - 120, y: y, size: 9, font: helveticaOblique, color: linkBlue });
  y -= 14;
  y = drawWrappedText(page2, "• Project Overview: Designed and developed an elegant, visually appealing web platform for a salon business, focusing on a user-centric design to showcase services and enhance customer engagement.", margin, y, contentWidth, 8.5, helvetica, darkGray, 12);
  y = drawWrappedText(page2, "• Technologies Used: HTML5, CSS3, JavaScript.", margin, y, contentWidth, 8.5, helvetica, darkGray, 12);
  y -= 12;

  // AllFormatPro
  page2.drawText("AllFormatPro (Universal File Converter)", { x: margin, y: y, size: 10, font: helveticaBold, color: black });
  page2.drawText("VISIT - Web Application", { x: p1W - margin - 120, y: y, size: 9, font: helveticaOblique, color: linkBlue });
  y -= 14;
  y = drawWrappedText(page2, "• Developed a functional file converter tool hosted on Netlify.", margin, y, contentWidth, 8.5, helvetica, darkGray, 12);
  y = drawWrappedText(page2, "• Focus: Simple, intuitive UI for non-technical users to convert files easily.", margin, y, contentWidth, 8.5, helvetica, darkGray, 12);
  y -= 18;

  // ADDITIONAL INFORMATION
  y = drawSectionTitle(page2, "ADDITIONAL INFORMATION", y);
  y = drawWrappedText(page2, "• Soft Skills: English Public Speaking, Creative Problem Solving, MS Word, MS Excel, Adaptability.", margin, y, contentWidth, 9, helvetica, darkGray, 13);
  y = drawWrappedText(page2, "• Content Creation: Experience managing using AI tools for content generation.", margin, y, contentWidth, 9, helvetica, darkGray, 13);

  const pdfBytes = await pdfDoc.save();
  const outPath = path.join(process.cwd(), 'public', 'AK_Tharusha_Deneth_CV.pdf');
  fs.writeFileSync(outPath, pdfBytes);
  console.log('PDF successfully created at:', outPath, 'Size:', pdfBytes.length);
}

generateCV().catch(err => {
  console.error('Error generating CV PDF:', err);
  process.exit(1);
});

const PDFDocument = require("pdfkit-table");
const Trainee = require("../modules/users.js"); // adjust path to your model

exports.downloadTraineesPdf = async (req, res) => {
  try {
    const trainees = await Trainee.find();

    if (!trainees || trainees.length === 0) {
      return res.status(404).json({ success: false, message: "No trainees found" });
    }

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });


    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Trainees.pdf");

    // Pipe the PDF into the response
    doc.pipe(res);

    // Title
    doc.fontSize(18).text("Registered Trainees", { align: "center" });
    doc.moveDown(2);

    // Build table data
    const table = {
        headers: ["#", "Name", "Email", "Phone", "Level", "Role", "Matric number", "Verification Code"],
        rows: trainees.map((t, i) => [
        String(i + 1),
        String(t.username || ""),
        String(t.email || ""),
        String(t.phonenumber || ""),
        String(t.level || ""),
        String(t.role || ""),
        String(t.matricnumber || ""),
        String(t.verificationCode || ""),   // ✅ use the correct field name
    ])
};


    // Draw the table
    await doc.table(table, {
        width: 1150,
        columnsSize: [30, 80, 120, 80, 60, 60, 120, 80],
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
        prepareRow: (row, i) => doc.font("Helvetica").fontSize(10)
    });


    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.downloadOneTraineePdf = async (req, res) => {
  const { traineeId } = req.params;

  try {
    const trainee = await Trainee.findById(traineeId);

    if (!trainee) {
      return res.status(404).json({ success: false, message: "Trainee not found" });
    }

    const doc = new PDFDocument({ margin: 30, size: "A4" });

    const safeName = trainee.username.replace(/\s+/g, "_"); 
    res.setHeader(
    "Content-Disposition",
    `attachment; filename=trainee-${safeName}.pdf`
);


    doc.pipe(res);

    doc.fontSize(18).text("Trainee Details", { align: "center" });
    doc.moveDown(2);

    const table = {
      headers: ["#", "Name", "Email", "Phone", "Level", "Role", "Matric number", "Verification Code"],
      rows: [[
        "1",
        String(trainee.username || ""),
        String(trainee.email || ""),
        String(trainee.phonenumber || ""),
        String(trainee.level || ""),
        String(trainee.role || ""),
        String(trainee.matricnumber || ""),
        String(trainee.verificationCode || "")
      ]]
    };

    await doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
      prepareRow: (row, i) => doc.font("Helvetica").fontSize(10)
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

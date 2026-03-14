const PDFDocument = require("pdfkit");
const fs = require("fs");

exports.generateInvoice = (userId,plan,amount,txnId)=>{

 const doc = new PDFDocument();

 const path = `invoices/${txnId}.pdf`;

 doc.pipe(fs.createWriteStream(path));

 doc.fontSize(20).text("Subscription Invoice");

 doc.moveDown();

 doc.text("User: "+userId);
 doc.text("Plan: "+plan);
 doc.text("Amount: ₹"+amount);
 doc.text("Transaction ID: "+txnId);

 doc.end();

 return path;
}
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";

// export const handleDownloadPDF = (columns, data) => {
//   const doc = new jsPDF("p", "pt", "a4");

//   doc.setFontSize(14);
//   doc.text("User Data Report", 220, 40);
//   doc.setFontSize(10);
//   doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 40, 60);

//   // Prepare table
//   const tableColumn = columns.map((col) => col.Header);
//   const tableRows = data.map((row) =>
//     columns.map((col) => row[col.accessor])
//   );

//   // Generate the table
//   autoTable(doc, {
//     startY: 80,
//     head: [tableColumn],
//     body: tableRows,
//     theme: "grid",
//     styles: { fontSize: 9, cellPadding: 4 },
//     headStyles: { fillColor: [41, 128, 185], textColor: 255 },
//   });

//   // Save file
//   doc.save("UserList.pdf");
// };

import React from "react";


const PurchaseOrder = () => {
  return (
    <div className="po-container">
      <h1 className="po-title">
        MANGLAM HOME CONSTRUCTION COMPANY LLP
      </h1>

      {/* Project / PO header */}
      <table className="po-table po-header-table">
        <tbody>
          <tr>
            <td className="po-project">
              <strong>Project :</strong> AADHAR, VAISHALI ESTATE
            </td>
            <td className="po-po-label">
              <strong>PURCHASE ORDER</strong>
            </td>
          </tr>
          <tr>
            {/* Supplier */}
            <td className="po-supplier">
              <strong>Supplier :</strong> <br />
              <strong>MANGLAM CEMENT LTD.</strong>
              <br />
              28, Shri Ram Pura Colony, Civil Line
              <br />
              Jaipur (RAJASTHAN)
              <br />
              <br />
              Contact Person : Mr. Vijay Jain
              <br />
              Mob : 9587886165
              <br />
              Email : vijayjain1987@rediffmail.com
              <br />
              <br />
              GST No :
              <span className="po-inline-space" />
              PAN No:
            </td>

            {/* Date / PO / Billing / Shipping */}
            <td className="po-meta-wrapper">
              <table className="po-inner-table">
                <tbody>
                  <tr>
                    <td className="po-label">Date</td>
                    <td>01/01/2020</td>
                  </tr>
                  <tr>
                    <td className="po-label">P.O. No.</td>
                    <td><strong>POGST-00131/19-20</strong></td>
                  </tr>
                  <tr>
                    <td className="po-label top-align">Billing Address :</td>
                    <td>
                      601 Apex Mall Lalkothi, Tonk Road JAIPUR - (RAJASTHAN)
                    </td>
                  </tr>
                  <tr>
                    <td className="po-label top-align">Shipping Address :</td>
                    <td>
                      AADHAR, VAISHALI ESTATE, GANDHI PATH, VAISHALI NAGAR,
                      JAIPUR
                      <br />
                      <br />
                      Contact Person : MR. MOHIT
                      <br />
                      Mob : 9010073350
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Reference / subject */}
      <div className="po-reference">
        <div>
          <strong>Reference:</strong> Your Quotation/ offer
        </div>
        <div>
          <strong>Subject :</strong> Purchase Order for supply of material as
          understated :-
        </div>
      </div>

      {/* Items table */}
      <table className="po-table po-items-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Item Name</th>
            <th>HSN Code</th>
            <th>Specification</th>
            <th>Unit</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Discou nt(%)</th>
            <th>CGST (%)</th>
            <th>SGST (%)</th>
            <th>IGST (%)</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>CEMENT-PPC</td>
            <td>25232930</td>
            <td>BIRLA UTTAM</td>
            <td>BAG</td>
            <td className="text-right">900</td>
            <td className="text-right">260.00</td>
            <td className="text-right">0.00</td>
            <td className="text-right">9.00</td>
            <td className="text-right">9.00</td>
            <td className="text-right">0.00</td>
            <td className="text-right">234000.00</td>
          </tr>

          {/* Quantity + Amount summary row */}
          <tr>
            <td colSpan={7} className="no-top-border">
              Total Quantity&nbsp;&nbsp;
              <strong>900</strong>
              <br />
              Rs.&nbsp;
              <strong>Two Lakhs Thirty Four Thousand Only</strong>
            </td>
            <td colSpan={5} className="no-top-border">
              <table className="po-inner-table po-amount-summary">
                <tbody>
                  <tr>
                    <td className="po-label">Amount</td>
                    <td className="text-right">234000.00</td>
                  </tr>
                  <tr>
                    <td className="po-label">Discount</td>
                    <td className="text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="po-label">CGST Value</td>
                    <td className="text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="po-label">SGST Value</td>
                    <td className="text-right">0.00</td>
                  </tr>
                  <tr>
                    <td className="po-label"><strong>Total</strong></td>
                    <td className="text-right"><strong>234000.00</strong></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Terms & Conditions */}
      <table className="po-table po-terms-table">
        <tbody>
          <tr>
            <td colSpan={3} className="po-terms-heading">
              <strong>TERMS &amp; CONDITIONS</strong>
            </td>
          </tr>
          <tr className="po-terms-header-row">
            <th style={{ width: "5%" }}>#</th>
            <th style={{ width: "45%" }}>Particulars</th>
            <th style={{ width: "50%" }}>Details</th>
          </tr>
          <tr>
            <td>1</td>
            <td>Date of Start of Delivery</td>
            <td>01/01/2020</td>
          </tr>
          <tr>
            <td>2</td>
            <td>P.O. Validity Date</td>
            <td>02/05/2020</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Advance Payment with P.O</td>
            <td>234000.00</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Balance Payment</td>
            <td>100% ADVANCE ALONGWITH THIS ORDER</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Taxes</td>
            <td>GST Paid</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Freight: FOR/ FOB</td>
            <td>F.O.R.</td>
          </tr>
          <tr>
            <td>7</td>
            <td>Unloading</td>
            <td>Supplier</td>
          </tr>
          <tr>
            <td>8</td>
            <td>TCS</td>
            <td>As per Govt Rules</td>
          </tr>
          <tr>
            <td>9</td>
            <td>Remarks</td>
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table>

      {/* Notes & signatures */}
      <p className="po-note">
        Subject to Jaipur jurisdiction only
      </p>

      <table className="po-sign-table">
        <tbody>
          <tr>
            <td>
              <strong>Ordered By</strong>
            </td>
            <td className="text-right">
              <strong>Accepted By Supplier</strong>
            </td>
          </tr>
          <tr>
            <td className="po-sign-block">
              For MANGLAM HOME CONSTRUCTION
              <br />
              COMPANY LLP
            </td>
            <td className="po-sign-block text-right">
              For MANGLAM CEMENT LTD.
            </td>
          </tr>
          <tr>
            <td className="po-authorized">
              Authorized Signatory
            </td>
            <td />
          </tr>
        </tbody>
      </table>

      <hr className="po-bottom-line" />

      <div className="po-gst">
        GST No : 08ABDFM5209R3ZP
      </div>

      <div className="po-footer-address">
        601 Apex Mall Lalkothi, Tonk Road JAIPUR - (RAJASTHAN)
        <br />
        AADHAR, VAISHALI ESTATE, GANDHI PATH, VAISHALI NAGAR, JAIPUR
      </div>
    </div>
  );
};

export default PurchaseOrder;







// use Case

// import React, { useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import UniversalButton from "../components/common/UniversalButton";
// import PurchaseOrder from "../components/common/PdfDownload";
// // import PurchaseOrder from "./pages/PurchaseOrder";

// export default function App() {
//   const poRef = useRef(null);

//   const handleDownloadPDF = async () => {
//     const element = poRef.current;

//     // ✅ check before using
//     if (!element) {
//       console.error("Purchase Order element not found!");
//       return;
//     }

//     try {
//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//       });

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgWidth = 210; // A4 width in mm
//       const pageHeight = 297;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 0;

//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft > 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save("purchase_order.pdf");
//     } catch (err) {
//       console.error("Error generating PDF:", err);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center mt-4">
//       <UniversalButton label="Download PDF" onClick={handleDownloadPDF} />

//       {/* 👇 VERY IMPORTANT: wrap PurchaseOrder in a real DOM element */}
//       <div
//         ref={poRef}
//         id="purchaseOrderSection"
//         style={{
//           backgroundColor: "#fff",
//           padding: "20px",
//           marginTop: "40px",
//           width: "850px",
//         }}
//       >
//         <PurchaseOrder />
//       </div>
//     </div>
//   );
// }


// use Case


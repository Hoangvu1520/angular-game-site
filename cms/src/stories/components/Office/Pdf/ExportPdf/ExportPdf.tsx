// import html2pdf from "html2pdf.js/dist/html2pdf.min";
import { JSXElementConstructor, ReactElement, ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
export type PDFExportProps = {
  template: ReactElement<any, string | JSXElementConstructor<any>>;
};
const exportPDF = (PDFProps: PDFExportProps) => {
  const printElement = ReactDOMServer.renderToString(PDFProps.template);
  var opt = {
    margin: 1,
    filename: "myfile.pdf",
    image: { type: "png", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };
  // html2pdf().set(opt).from(printElement).output("dataurlnewwindow");
};
export default exportPDF;

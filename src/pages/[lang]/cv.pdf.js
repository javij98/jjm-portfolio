import { readFile } from "node:fs/promises";

const pdfs = {
  es: "../../../public/files/JavierJimenezMolina_cv_es.pdf",
  en: "../../../public/files/JavierJimenezMolinaCV_en.pdf",
};

export function getStaticPaths() {
  return Object.entries(pdfs).map(([lang, path]) => ({ params: { lang }, props: { path } }));
}

export async function GET({ props }) {
  const pdf = await readFile(new URL(props.path, import.meta.url));
  return new Response(pdf, { headers: { "Content-Type": "application/pdf" } });
}

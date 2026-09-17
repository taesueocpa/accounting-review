/**
 * 계약서 파일(hwp·hwpx·pdf·docx)을 마크다운으로 바꾼다 — 스킬이 조항을 인용하려면 텍스트가 필요하다.
 *
 *   node to-markdown.mjs <계약서 파일> [출력.md]
 *
 * 출력 경로를 주지 않으면 입력과 같은 폴더에 `<이름>.md` 로 쓴다.
 *
 * 변환기: kordoc (hwp·hwpx·pdf). 설치돼 있지 않으면 설치 명령을 안내하고 exit 3 으로 끝낸다 —
 * 변환에 실패했는데 빈 파일을 남기면 스킬이 "조항 없음"으로 오판한다.
 */
import { writeFileSync, existsSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

const input = process.argv[2];
if (!input) {
  console.error("사용법: node to-markdown.mjs <계약서 파일> [출력.md]");
  process.exit(64);
}
if (!existsSync(input)) {
  console.error(`파일이 없다: ${input}`);
  process.exit(66);
}
const ext = extname(input).toLowerCase();
const out = process.argv[3] ?? join(dirname(input), basename(input, ext) + ".md");

if (![".hwp", ".hwpx", ".pdf", ".docx"].includes(ext)) {
  console.error(`지원하지 않는 형식: ${ext} — hwp·hwpx·pdf·docx 만 변환한다. txt·md 는 그대로 읽으면 된다.`);
  process.exit(65);
}

let parse, VERSION;
try {
  ({ parse, VERSION } = await import("kordoc"));
} catch {
  console.error(
    "kordoc 이 없다. 이 스킬 폴더에서 설치할 것:\n" +
      "  npm install kordoc\n" +
      "설치 없이 진행하려면 계약서 텍스트를 직접 붙여넣어 달라고 요청한다.",
  );
  process.exit(3);
}

const result = await parse(input);
const md = typeof result === "string" ? result : (result?.markdown ?? "");
if (!md.trim()) {
  console.error(`변환 결과가 비었다: ${input} (kordoc v${VERSION})\n  스캔 PDF 이거나 지원하지 않는 내부 형식일 수 있다 — 텍스트를 직접 받아야 한다.`);
  process.exit(4);
}
writeFileSync(out, md, "utf8");
console.log(`변환 완료: ${out} (${md.length.toLocaleString()}자, kordoc v${VERSION})`);

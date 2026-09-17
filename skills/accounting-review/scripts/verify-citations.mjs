/**
 * 검토의견서의 인용을 실재 검증한다 — 없는 문단·회신을 인용했으면 exit 1.
 *
 *   node verify-citations.mjs <검토의견서.md>
 *
 * 하네스는 보고서가 아니라 방어선이다. 모델이 기억으로 만든 문단 번호가 검토의견서에
 * 들어가는 것이 이 스킬의 가장 위험한 실패 모드이므로, 인용을 전부 원격 코퍼스에 대조한다.
 *
 * 토큰: 환경변수 EOCPA_TOKEN (https://eocpa.kr/token). 없으면 추출한 인용 목록만 출력하고
 * exit 2 로 끝낸다 — "검증하지 않았다"와 "검증해서 통과했다"를 구별하기 위해서다.
 *
 * 인식하는 인용 형식:
 *   [K-IFRS 1115 문단 35]      [K-IFRS 제1116호 문단 B34]
 *   [일반기업회계기준 16장 문단 16.10]
 *   [회계기준원 2020-I-KQA014]  [금융감독원 금감원2007-014]  [신속처리질의 SSI-35609]
 */
import { readFileSync } from "node:fs";

const MCP = process.env.MYKIFRS_URL ?? "https://mykifrs.eocpa.kr/mcp";
const TOKEN = process.env.EOCPA_TOKEN ?? "";
const file = process.argv[2];
if (!file) {
  console.error("사용법: node verify-citations.mjs <검토의견서.md>");
  process.exit(64);
}
const text = readFileSync(file, "utf8");

// ── 인용 추출 ────────────────────────────────────────────────────
/** 기준서 문단 → unique_key. 문단번호는 숫자만이 아니다(B34·IE325·6.1.1·한129.1·20A). */
const paraRe = /\[(?:K-IFRS|한국채택국제회계기준)\s*(?:제)?(\d{4})(?:호)?\s*문단\s*([A-Za-z가-힣]*[\d.]+[A-Za-z]?)\]/g;
const gaapRe = /\[일반기업회계기준\s*(?:제)?(\d{1,2})(?:장)?\s*문단\s*([\d.]+)\]/g;
const qnaRe = /\[(?:회계기준원|금융감독원|신속처리질의|IFRS 해석위원회[^\]]*)\s+([A-Za-z0-9가-힣\-.]+)\]/g;

const paragraphs = new Map(); // unique_key → 원문 인용 문자열
const qnas = new Map();
for (const m of text.matchAll(paraRe)) paragraphs.set(`${m[1]}-${m[2]}`, m[0]);
for (const m of text.matchAll(gaapRe)) paragraphs.set(`${m[1]}-${m[2]}`, m[0]);
for (const m of text.matchAll(qnaRe)) qnas.set(m[1], m[0]);

const total = paragraphs.size + qnas.size;
if (total === 0) {
  console.error(`인용을 하나도 찾지 못했다: ${file}\n  검토의견서라면 근거 표기가 없다는 뜻이다 — 형식을 확인할 것.`);
  process.exit(1);
}

if (!TOKEN) {
  console.log(`추출한 인용 ${total}건 (EOCPA_TOKEN 미설정 — 검증하지 않음)`);
  for (const k of paragraphs.keys()) console.log(`  문단 ${k}`);
  for (const k of qnas.keys()) console.log(`  회신 ${k}`);
  process.exit(2);
}

// ── 원격 조회 ────────────────────────────────────────────────────
let id = 0;
async function call(name, args) {
  const res = await fetch(MCP, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "x-eocpa-token": TOKEN,
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method: "tools/call", params: { name, arguments: args } }),
  });
  if (!res.ok) throw new Error(`${name} HTTP ${res.status}`);
  const body = await res.json();
  if (body.error) throw new Error(`${name}: ${body.error.message}`);
  return JSON.parse(body.result.content[0].text);
}

const bad = [];
const results = await Promise.allSettled([
  ...[...paragraphs.keys()].map(async (key) => {
    const r = await call("get_paragraph", { unique_key: key, context: 0 });
    if (r.error) bad.push(`문단 ${key} — ${r.error}  ← ${paragraphs.get(key)}`);
  }),
  ...[...qnas.keys()].map(async (num) => {
    const r = await call("get_qna", { doc_number: num });
    if (r.error) bad.push(`회신 ${num} — ${r.error}  ← ${qnas.get(num)}`);
  }),
]);
for (const r of results) if (r.status === "rejected") bad.push(`조회 실패 — ${r.reason?.message ?? r.reason}`);

// ── 판정 ─────────────────────────────────────────────────────────
// process.exit() 를 쓰지 않는다 — fetch 소켓이 닫히는 중에 즉시 종료하면 Windows 에서
// libuv 단언이 터지고 종료코드가 뒤집힌다. exitCode 만 세우고 이벤트 루프가 비워지기를
// 기다린다.
if (bad.length) {
  console.error(`인용 검증 실패 ${bad.length}/${total}건 — 검토의견서를 내보내지 말 것:`);
  for (const b of bad) console.error(`  ${b}`);
  process.exitCode = 1;
} else {
  console.log(`인용 검증 통과 — 문단 ${paragraphs.size}건, 회신 ${qnas.size}건 전부 실재`);
  process.exitCode = 0;
}

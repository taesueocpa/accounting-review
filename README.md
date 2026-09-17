# accounting-review

**회계검토 스킬** — 계약서를 주거나 거래 상황을 설명하면, K-IFRS·일반기업회계기준 본문과
질의회신·감독당국 자료를 실시간 조회해 **문단 번호가 붙은 회계검토의견서**를 작성함.

```
> /accounting-review 매출계약서.pdf
> /accounting-review memo 임대차계약.hwp 리스기간이 쟁점입니다
> /accounting-review 종속기업 지분 30%를 팔았는데 대표이사 선임권은 남았습니다
> /accounting-review memo 전환사채 조기상환 조건을 바꿨습니다. 실질적 조건변경인지 봐주세요
```

## 무엇이 다른가

- 회계 판단은 조문 하나로 갈림 — 문단 번호와 원문, 그 문단을 인용한 질의회신, 감독당국이
  같은 쟁점에서 지적한 사례가 검토조서에 들어가야 함
- 이 스킬은 그것을 **기억이 아니라 조회로** 채움

| 설계 | 내용 |
|---|---|
| **앵커 문단이 정본** | 체크리스트가 쟁점별 문단 키(`1115-35`, `1116-B34`)를 보유 → `get_paragraph`로 원문 직접 조회. 키워드 검색은 보조 — 검색만 쓰면 결론도출근거(BC)·적용사례(IE)가 본문보다 상위에 올라옴 |
| **회신은 문단이 물고 있음** | 기준서 문단이 자신을 인용한 질의회신 목록을 직접 반환 → 키워드 검색보다 정확 |
| **근거 위계 강제** | 본문 > 적용지침 > 적용사례·결론도출근거 > 질의회신 > 감독자료. IE·BC는 단독 결론 근거로 사용 금지 |
| **구 회신의 지위는 회계기준이 결정** | 2011년 이전 질의회신은 구 기업회계기준 시대의 것이고 그 계보가 일반기업회계기준으로 이어짐 → **K-IFRS 검토에서는 배경자료, 일반기업회계기준 검토에서는 현행 해석**. 일률적으로 낮추면 일반기업회계기준 검토에서 1차 근거를 버리게 됨 |
| **검토의견서 어투 고정** | 개조식(명사형 종결)에 회계기준원 질의회신의 어휘·논리 접속을 따름(`~하는 것이 타당함`·`~에 해당하지 않음`·`문단 68에서는 ~하도록 함`). 조서에 그대로 들어가는 문서이므로 구어체·비유·완곡어를 배제 |
| **인용 검증이 게이트** | `scripts/verify-citations.mjs`가 검토의견서의 모든 인용을 실재 조회로 대조 → 없는 문단이 하나라도 있으면 exit 1 |
| **계약 내용은 검색어에 미포함** | 당사자명·금액·조항 원문은 로컬 컨텍스트에만 보관, 검색어는 회계 용어로만 구성 |

## 모드와 경로

**모드** — 검토의 깊이

| | **scan** (기본) | **memo** |
|---|---|---|
| 파이프라인 | 사실 정리 → 쟁점 지도 | 사실 → 쟁점 → 근거 → 검증 → 검토의견서 (5단계) |
| 실행 방식 | 메인 컨텍스트 | 단계별 독립 서브에이전트 |
| 소요 시간 | 2~4분 | 10분 이상 |
| 산출물 | 쟁점 지도 + 관련 회신 + 되묻기 | 검토의견서 파일 |

**경로** — 사실의 출처. 모드와 독립이며 입력에 따라 자동 결정됨

| | **계약서 경로** | **사례 경로** |
|---|---|---|
| 입력 | 계약서 파일 또는 붙여넣은 원문 | 거래·사건에 대한 설명 |
| 사실의 앵커 | 조항 번호 (`제7조 제2항`) | 진술 번호 (`진술 S3`) |
| 추가 확정 사항 | — | **별도·개별 / 연결** (같은 거래가 다르게 처리됨) |
| 지침 | `references/intake.md` | `references/case-intake.md` |

- 판정 기준은 파일의 유무가 아니라 **조항 번호를 달아 인용할 원문의 존재 여부**
  - 계약이 배경에 있어도 원문이 없으면 사례 경로로 진행 → 계약서를 요구하지 않음
- 사례 경로의 추가 규율 — **사용자가 말한 회계결론은 사실로 받지 않음**
  - "리스라서", "감자차익이 생겨서", "지배력을 잃어서"는 전부 검증 대상
  - 해당 판단 자체가 쟁점 최상단으로 올라감
  - 전제로 수용 시 검토가 그 결론을 되풀이할 뿐임

## 체크리스트 모듈

- 계약 한 건이 여러 모듈을 동시에 호출하는 것이 통상
- 충당부채·손상·표시공시가 수익·리스만큼 빈번 → 필수 모듈을 연 뒤 **조건부 모듈의 트리거
  조항을 별도 확인**

| 모듈 | 파일 |
|---|---|
| 수익 (제1115호) | `1115-revenue.md` |
| 리스 (제1116호) | `1116-lease.md` |
| 충당부채·우발부채 (제1037호) | `1037-provisions.md` |
| 손상 (제1036호) | `1036-impairment.md` |
| 재고자산 (제1002호) | `1002-inventory.md` |
| 유형자산 (제1016호) | `1016-ppe.md` |
| 무형자산 (제1038호) | `1038-intangibles.md` |
| 표시·공시 (한129·제1118호·제1001호) | `disclosure.md` |
| 금융상품 (제1109호) | `1109-financial-instruments.md` |
| 사업결합 (제1103호) | `1103-business-combination.md` |
| 연결·공동약정 (제1110·1111·1028호) | `1110-consolidation.md` |
| 법인세 (제1012호) | `1012-income-tax.md` |
| 공통 (제1008·1021·1020·1023·1105·1102호) | `cross-cutting.md` |

- 라우팅 — `references/checklists/routing.md`
  - 계약 유형 10종(`supply`·`lease`·`ma` 등)과 사건 유형 10종(`capital`·`equity-change`·
    `impairment-event`·`financing`·`fx`·`grant`·`compensation`·`error-policy`·
    `restructuring`·`asset-event`)이 각각 모듈 세트로 연결됨
  - 계약과 사건이 함께 걸리면(임대차 설비의 손상 등) 두 세트의 합집합을 엶
- 체크리스트 미보유 영역도 routing.md에 명시 — 주당이익(제1033호), 공정가치 측정(제1113호),
  투자부동산(제1040호), 보험계약(제1117호), 특수관계자 공시(제1024호)
  - **모듈 부재를 이유로 쟁점을 버리지 않음** → 검색으로 문단을 찾되, 근거가 약하면 그
    확신도에 맞춰 서술

## 설치

### 방법 1 — Claude Code 플러그인 (권장)

```
/plugin marketplace add taesueocpa/accounting-review
/plugin install accounting-review@accounting-review
```

- 설치 시 eocpa 토큰 1회 입력 → mykifrs·myfss 두 서버가 함께 등록됨

### 방법 2 — 스킬 수동 설치

```bash
git clone https://github.com/taesueocpa/accounting-review.git
cp -r accounting-review/skills/accounting-review ~/.claude/skills/
```

- MCP 서버 직접 등록 필요

```bash
claude mcp add mykifrs --transport http "https://mykifrs.eocpa.kr/mcp?key=<토큰>"
claude mcp add myfss   --transport http "https://myfss.eocpa.kr/mcp?key=<토큰>"
```

- 토큰 발급 — [eocpa.kr/token](https://eocpa.kr/token) (MyDART·MyKIFRS·MyFSS 공용)

### 선택 — 계약서 변환기

- `.hwp`·`.hwpx`·`.pdf` 계약서 판독 시 스킬 폴더에서 설치

```bash
npm install kordoc
```

- 미설치 시 계약서 텍스트를 직접 붙여넣으면 됨

## 사용법

```
/accounting-review [scan|memo] <계약서 경로 또는 거래 상황 설명>
```

- 모드 생략 시 scan으로 동작하고, 말미에 memo 모드를 권함
- 관점(회사가 어느 당사자인지)·회계기준·보고기간이 미확정이면 선(先) 되묻기
  - 이 셋이 틀리면 검토 전체가 틀림
  - 사례 경로는 **별도·연결 구분**이 하나 더 붙음
- 쟁점 지도에는 그 쟁점을 이미 다룬 질의회신을 함께 표기
  - 본문을 읽은 것만 올리고, 그 회신이 쟁점을 정리하는지·판단 틀만 확인해 주는지·옛 기준
    하의 것이라 참고에 그치는지를 한 줄로 밝힘
- 사례 경로의 되묻기는 **최대 3개**, 결론을 뒤집는 질문에 한정
  - 계약서를 요구하지 않음
  - 다만 특정 조항의 문언이 결론을 가르면 해당 조항만 옮겨 달라고 요청

## 구조

```
accounting-review/
├── .claude-plugin/
│   ├── plugin.json           # 플러그인 매니페스트 (mykifrs + myfss)
│   └── marketplace.json
├── .mcp.json                 # 토큰 없는 등록(디스커버리용)
└── skills/accounting-review/
    ├── SKILL.md              # 오케스트레이터 — 모드·라우팅·실행 규칙
    ├── references/
    │   ├── intake.md             # [0] 계약 팩트시트 (계약서 경로)
    │   ├── case-intake.md        # [0] 사실시트 (사례 경로 — 진술이 앵커)
    │   ├── issue-mapping.md      # [1] 쟁점 도출 + 앵커 키
    │   ├── evidence-retrieval.md # [2] 근거 수집
    │   ├── evidence-check.md     # [3] 근거 검증
    │   ├── memo-generation.md    # [4] 검토의견서
    │   ├── scan-output.md        # scan 모드 쟁점 지도 형식
    │   └── checklists/           # 기준서별 쟁점 체크리스트 + routing.md
    └── scripts/
        ├── to-markdown.mjs       # 계약서 → 마크다운
        └── verify-citations.mjs  # 검토의견서 인용 실재 검증 (exit 1 게이트)
```

## 데이터 출처

| 서버 | 무엇 |
|---|---|
| [mykifrs](https://github.com/taesueocpa/mykifrs-mcp) | K-IFRS·일반기업회계기준·감사기준서·내부회계관리제도·KSSB 기준서 본문(문단 단위)과 회계기준원·금융감독원·신속처리질의·IFRS 해석위원회 질의회신 3,669건 |
| [myfss](https://github.com/taesueocpa/myfss-mcp) | 금융감독원·금융위원회 회계·공시 자료 11개 게시판(감독지침·심사감리 지적사례·주석공시 모범사례 등, 2010년 이후) |

## 라이선스

- MIT
- 기준서 원문과 질의회신의 저작권은 한국회계기준원·IFRS재단·금융감독원에 귀속
- 이 스킬은 그 원문을 재배포하지 않고 조회 결과를 인용할 뿐임

# 라우팅 — 계약 유형·사건 유형에서 모듈 세트로

계약 한 건도, 거래 한 건도 거의 언제나 **여러 모듈을 동시에** 부른다. 기준서별 체크리스트만
나열하면 검토자가 어느 것을 열어야 할지 모르므로, Intake가 정한 `contract_types`(계약서
경로)와 `event_types`(사례 경로)로 모듈 세트를 정한다. 둘이 함께 오면 두 세트를 합집합으로
연다.

**리스만큼이나 충당부채·손상·표시공시가 자주 걸린다.** 필수 모듈을 연 뒤에는 조건부 모듈의
트리거 조항이 팩트시트에 있는지 반드시 확인한다 — 빠뜨리기 쉬운 쪽은 언제나 조건부다.

## 계약 유형 라벨

Intake의 `contract_types`는 아래 라벨만 쓴다. 해당 없으면 빈 배열로 두고 §끝의 "유형 불명"
절차를 따른다.

| 라벨 | 대표 계약 |
|---|---|
| `supply` | 물품·부품 공급, 장기공급, 오프테이크, 위탁생산 |
| `construction` | 도급공사, EPC·턴키, 시스템 구축, 플랜트 |
| `lease` | 임대차, 설비·전산자원 사용, 상면·랙 임차 |
| `license` | 라이선스 제공·도입, 기술사용, 판권·중계권 |
| `development` | 외주개발, 위탁연구, 공동개발, 정부 R&D 과제 |
| `platform` | 플랫폼 입점, 결제대행, 광고, 포인트·쿠폰 |
| `ma` | 지분·영업 양수도, 합병, 주주간계약, JV |
| `guarantee` | PF 지급보증, 책임준공, 자금보충, 연대보증 |
| `ppa` | 전력구매계약(실물·가상), REC, 배출권 |
| `service` | 유지보수, 용역, 위탁운영, 아웃소싱 |

## 모듈 세트

**필수**는 반드시 연다. **조건부**는 그 트리거 조항이 팩트시트에 있을 때만 연다.

| 유형 | 필수 모듈 | 조건부 모듈 (트리거) |
|---|---|---|
| `supply` | `1115-revenue`, `1037-provisions` | `1002-inventory`(재고위험·반품), `1036-impairment`(전용설비·장기계약), `1109-financial-instruments`(가격연동·사후확정), `cross-cutting`(외화 결제) |
| `construction` | `1115-revenue`, `1037-provisions`, `disclosure` | `1016-ppe`(시운전·인수), `cross-cutting`(차입원가·선수금), `1002-inventory`(미설치자재) |
| `lease` | `1116-lease`, `1037-provisions`(원상복구) | `1016-ppe`(리스개량), `1036-impairment`(CGU 귀속), `1110-consolidation`(SPV) |
| `license` | `1115-revenue`(제공자) 또는 `1038-intangibles`(도입자) | `cross-cutting`(외화·원천), `1036-impairment`(선급 라이선스) |
| `development` | `1038-intangibles`, `1115-revenue`(수탁 시) | `1110-consolidation`(공동약정), `1036-impairment`(개발 중 자산), `cross-cutting`(정부보조금) |
| `platform` | `1115-revenue`(본인·대리인, 포인트) | `1109-financial-instruments`(정산채권), `1037-provisions`(쿠폰 손실부담), `disclosure` |
| `ma` | `1103-business-combination`, `1110-consolidation` | `1038-intangibles`(식별 무형자산), `1036-impairment`(영업권), `cross-cutting`(주식기준보상) |
| `guarantee` | `1037-provisions`(우발부채), `disclosure` | `1110-consolidation`(SPV 지배력), `1109-financial-instruments`(금융보증) |
| `ppa` | `1109-financial-instruments`(자가사용 예외·내재파생) | `1116-lease`(발전설비 사용통제), `1110-consolidation`, `cross-cutting`(배출권) |
| `service` | `1115-revenue` | `1037-provisions`(손실부담·보증), `1116-lease`(설비 포함), `1002-inventory`(부품) |

## 사건 유형 라벨

계약서가 없는 사례 경로(`case-intake.md`)의 `event_types`는 아래 라벨만 쓴다. 계약이 배경에
있으면 위의 계약 유형 라벨과 **함께** 걸린다(임대차계약을 맺었는데 그 설비가 손상됐다면
`lease` + `impairment-event`).

| 라벨 | 대표 사건 |
|---|---|
| `capital` | 유상·무상증자, 감자, 자기주식 취득·소각·처분, 주식배당, 자본 항목 간 대체 |
| `equity-change` | 지분 취득·처분, 지배력·유의적 영향력의 획득·상실, 단계적 취득, 희석 |
| `asset-event` | 자산 취득·처분·폐기·교환, 매각예정 분류, 수용·보험금 수령 |
| `impairment-event` | 손상징후 발생, 회수가능액 산정, 영업권 배분, 환입 |
| `financing` | 차입·사채 발행, 전환사채·신주인수권부사채, 차환, 조건변경, 채무면제 |
| `fx` | 외화거래, 기능통화 판단, 해외사업장 환산, 환위험회피 |
| `grant` | 정부보조금·출연금·정책자금·세액공제 |
| `compensation` | 주식기준보상 부여·조건변경·취소, 성과급, 퇴직급여 제도 변경 |
| `error-policy` | 오류수정, 회계정책 변경, 회계추정 변경, 기준서 최초적용 |
| `restructuring` | 합병·분할·영업양수도(동일지배 포함), 구조조정 계획 |

## 사건 유형 모듈 세트

| 유형 | 필수 모듈 | 조건부 모듈 (트리거) |
|---|---|---|
| `capital` | `1109-financial-instruments`(자본·부채 구분), `disclosure`, `1012-income-tax` | `cross-cutting`(1102 주식기준보상 연계), `1110-consolidation`(비지배지분 변동) |
| `equity-change` | `1110-consolidation`, `1103-business-combination` | `1036-impairment`(잔여 지분·영업권), `cross-cutting`(1105 매각예정), `1109-financial-instruments`(잔여 지분 분류) |
| `asset-event` | `1016-ppe`, `cross-cutting`(1105 매각예정) | `1002-inventory`, `1038-intangibles`, `1036-impairment`, `1115-revenue`(처분 대상이 통상활동 산출물이면) |
| `impairment-event` | `1036-impairment` | `1016-ppe`, `1038-intangibles`, `1103-business-combination`(영업권), `1002-inventory`(순실현가능가치), `1116-lease`(사용권자산) |
| `financing` | `1109-financial-instruments` | `cross-cutting`(1023 차입원가), `disclosure`, `1110-consolidation`(SPV) |
| `fx` | `cross-cutting`(1021 외화) | `1109-financial-instruments`(내재외화파생·위험회피), `disclosure`(1118 외환손익 귀속) |
| `grant` | `cross-cutting`(1020 정부보조금) | `1016-ppe`, `1038-intangibles`, `1002-inventory` |
| `compensation` | `cross-cutting`(1102 주식기준보상) | `1037-provisions`(성과급·해고급여), `1103-business-combination`(사업결합 대가와의 구분) |
| `error-policy` | `cross-cutting`(1008 정책·추정), `disclosure`, `1012-income-tax` | 오류가 난 그 거래의 모듈을 함께 연다 |
| `restructuring` | `1103-business-combination`, `1110-consolidation`, `1012-income-tax` | `1037-provisions`(구조조정충당부채), `cross-cutting`(1105 중단영업), `1036-impairment` |

## 체크리스트가 없는 영역

아래는 모듈이 없거나 일부만 덮인다. 쟁점으로는 올리되 `anchors`를 비우고 `anchor_gap: true`로
표시해 다음 단계가 검색으로 문단을 찾게 한다. **모듈이 없다는 이유로 쟁점을 버리지 않는다**
— 근거가 약하면 그 확신도에 맞춰 쓰는 것이 이 시스템의 방식이다.

| 영역 | 기준서 | 상태 |
|---|---|---|
| 자본·자기주식·복합금융상품 | 제1032호 | 부분 — `1103-business-combination`·`1109-financial-instruments`에 앵커 일부 |
| 동일지배거래 | (제1103호 밖) | 부분 — `1103-business-combination` §2에 정책 선택 쟁점 |
| 현금흐름표·중간재무보고 | 제1007·1034호 | 없음 |
| 퇴직급여·확정급여제도 | 제1019호 | 부분 — `1037-provisions`에 앵커 일부 |
| 특수관계자 공시 | 제1024호 | 없음 |
| 주당이익 | 제1033호 | 없음 |
| 공정가치 측정 | 제1113호 | 없음 |
| 투자부동산 | 제1040호 | 없음 |
| 보험계약 | 제1117호 | 없음 |

## 전 유형 공통

아래는 유형과 무관하게 팩트시트에 트리거가 있으면 연다.

| 트리거 조항 | 모듈 |
|---|---|
| 원상복구·철거·폐기 의무 | `1037-provisions` |
| 보증·하자·손해배상·지체상금 | `1037-provisions` (+ `1115-revenue` 보증 구분) |
| 조건부 대가·earn-out | `1103-business-combination` (+ `cross-cutting` 주식기준보상) |
| 외화 결제·가격 표시 | `cross-cutting` |
| 정부 보조·부담금·출연금 | `cross-cutting` |
| 비밀유지로 공시 제약 | `disclosure` |
| 자본·기타포괄손익에 직접 반영되는 항목, 세무상 결손금, 세율 변경 | `1012-income-tax` |
| 기준서에 지침이 없는 거래 | `cross-cutting`(1008 회계정책 개발) |

## 유형 불명일 때

계약서 경로:

1. 계약 대상이 **재화·용역의 이전**이면 `1115-revenue`부터 연다.
2. **식별되는 자산의 사용**이 대가와 교환되면 `1116-lease`의 진입 판정을 먼저 돌린다.
3. 둘 다 아니면 Intake로 되돌려 계약 성격을 되묻는다 — 억지로 유형을 배정하지 않는다.

사례 경로:

1. **무엇이 움직였는지**로 먼저 가른다 — 자산이면 `asset-event`, 지분이면 `equity-change`,
   자본이면 `capital`, 부채·자금이면 `financing`.
2. 움직인 것이 없고 **평가·판단만 바뀐 것**이면 `impairment-event` 또는 `error-policy`.
3. 그래도 못 가르면 `cross-cutting`의 1008 회계정책 개발 경로를 열고, 동시에 Case Intake로
   되돌려 거래의 성격을 되묻는다. **억지로 라벨을 붙이지 않는다.**

## 모듈 파일

| 모듈 | 파일 | 상태 |
|---|---|---|
| 수익 | `1115-revenue.md` | 작성 |
| 리스 | `1116-lease.md` | 작성 |
| 충당부채·우발부채 | `1037-provisions.md` | 작성 |
| 손상 | `1036-impairment.md` | 작성 |
| 재고자산 | `1002-inventory.md` | 작성 |
| 유형자산 | `1016-ppe.md` | 작성 |
| 무형자산 | `1038-intangibles.md` | 작성 |
| 표시·공시 | `disclosure.md` | 작성 |
| 금융상품 | `1109-financial-instruments.md` | 작성 |
| 사업결합 | `1103-business-combination.md` | 작성 |
| 연결·공동약정 | `1110-consolidation.md` | 작성 |
| 공통(정책개발·외화·정부보조금·차입원가·매각예정·주식기준보상) | `cross-cutting.md` | 작성 |
| 법인세 | `1012-income-tax.md` | 작성 |

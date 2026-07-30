# 18장: 우리가 배운 것

## 원저자가 정리한 다섯 가지 선택

### 1. Callback graph보다 generator loop

하나의 async generator가 model stream, tool execution, continuation과 terminal
상태를 연결한다. 중단 이유는 discriminated union으로 표현해 호출자가 빠짐없이
처리한다. 복잡성은 크지만 “왜 loop가 끝났는가”를 찾는 경로가 한곳에 남는다.

### 2. Database보다 파일 기반 memory

고급 query보다 사람이 직접 읽고 수정할 수 있는 투명성을 선택한다. LLM recall이
단순 storage의 검색 한계를 보완한다. 이 선택은 규모가 커질 때 다시 시험받지만,
agent가 무엇을 기억하는지 외부에서 확인할 수 있게 한다.

### 3. 중앙 orchestrator보다 self-describing tool

각 tool이 이름, schema, prompt contribution, concurrency 안전성과 실행을
자기 계약으로 제공한다. MCP tool도 같은 interface로 wrapping된 뒤 일반 tool
pipeline에서 permission과 result 처리를 받는다.

### 4. Fresh summary보다 fork와 cache 공유

부모의 byte-identical prefix를 공유하는 fork는 작은 검증 작업도 경제적으로
분리한다. 그 대신 fork lifecycle, 재귀 방지와 cache 안정성을 엄격히 관리해야
한다.

### 5. In-process plugin보다 hook process

외부 process의 시작 비용을 감수하고 crash, memory와 trust 경계를 분리한다.
stdin/stdout/exit code라는 단순 protocol은 host API보다 오래 유지될 수 있다.

## 무엇이 일반화되고 무엇이 규모 의존적인가

generator loop, 파일 memory와 provenance, 비대칭 remote channel, prompt cache
안정성, self-describing tool은 작은 agent에도 적용할 수 있다. 반면 fork한
terminal renderer, 수십 개 startup checkpoint, 여덟 종류 MCP transport는
Claude Code의 규모와 배포 환경 때문에 필요한 선택이다.

원저자는 파일 수 자체보다 복잡성이 모이는 boundary를 보라고 한다. raw keyboard
byte를 typed action으로, MCP JSON-RPC를 tool로, hook exit code를 permission
decision으로 바꾸는 경계가 외부의 혼란을 흡수한다.

## Book SDK 강좌가 가져갈 결론

강좌는 이 구현을 Claude SDK의 공식 계약으로 오해해서는 안 된다. 이 책은 특정
Claude Code source snapshot을 읽어 실행 구조를 해석한 저자의 관점이다. Book
SDK는 공식 SDK에서 실제로 관측한 event와 API 계약을 중심에 두고, 이 원저자의
분석을 “왜 이런 event와 경계가 필요한가”를 이해하는 외부 지도처럼 연결한다.

학생에게는 다음 세 층을 함께 보여 주는 것이 정직하다.

1. 공식 SDK와 문서가 보장하는 계약
2. 실제 Education Shell session에서 저장한 raw evidence
3. 원저자가 source를 읽고 제시한 실행 구조와 설계 해석

세 층이 일치할 때는 강한 설명이 되고, 다를 때는 그 차이 자체가 학습 자료다.

## 원문

[Chapter 18: What We Learned][source]

[source]: https://github.com/alejandrobalderas/claude-code-from-source/blob/a6d5e452a8e0dd925c22c407c84611b1994562eb/book/ch18-epilogue.md

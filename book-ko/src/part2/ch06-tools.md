# 6장: 도구 — 정의에서 실행까지

## 원저자의 관점

Tool은 모델이 세상에 행동하는 신경계다. 이름과 함수만 가진 callback이 아니라
입력 schema, 권한, 동시성, 실행, 결과와 UI를 함께 소유한다.

## 14단계 파이프라인

입력을 parse·validate한 뒤 context와 abort signal을 준비한다. tool별 검사,
rule, permission mode와 사용자 승인을 통과하면 실행한다. 결과를 예산에 맞게
정리하고 hook과 telemetry를 거쳐 message history로 돌려준다.

`isConcurrencySafe(input)`과 `isReadOnly(input)`은 tool type이 아니라 실제
입력을 받는다. 같은 Bash 도구도 조회 명령과 파일 변경 명령의 의미가 다르기
때문이다.

## 가져갈 패턴

- 새 도구의 기본값은 fail-closed다.
- 안전성은 도구 이름이 아니라 parsed input으로 평가한다.
- tool 검사, rule, mode, interactive prompt와 classifier를 계층화한다.
- 입력뿐 아니라 개별·누적 tool result에도 token budget을 둔다.
- minified build에서도 안정적인 오류 분류값만 telemetry에 보낸다.

## Book SDK에서 같이 보기

Book SDK 2장 tool contract, 4장 실행 orchestration, 8장 tool prompt, 16장
permission과 함께 읽는다.

## 원문

[Chapter 6: Tools — From Definition to Execution][source]

[source]: https://github.com/alejandrobalderas/claude-code-from-source/blob/a6d5e452a8e0dd925c22c407c84611b1994562eb/book/ch06-tools.md

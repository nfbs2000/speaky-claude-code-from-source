# 5장: 에이전트 루프

## 원저자의 관점

`query()`는 응답을 반환하는 함수가 아니라 메시지를 계속 yield하고, 종료 이유를
typed terminal state로 반환하는 async generator다. 모든 인터페이스와 하위
에이전트가 이 루프를 사용한다.

## 루프의 핵심

현재 상태에서 context를 조립하고 모델 stream을 읽는다. tool call이 있으면
실행 결과를 append하고 `continue`한다. tool call이 없으면 stop hook과 종료
조건을 확인한다. 상태 전환마다 전체 state를 다시 구성해 부분 update를 막는다.

## 압축과 복구

tool result budget, snip, microcompact, context collapse, auto-compact 순으로
가벼운 방법부터 사용한다. recoverable error는 즉시 UI에 terminal error로
보내지 않고 내부에 보류한 뒤 retry와 fallback이 모두 실패했을 때만 노출한다.
각 retry에는 반드시 상한이 있다.

## 가져갈 패턴

- callback 대신 generator로 backpressure, cancel과 종료 이유를 함께 표현한다.
- continue마다 명시적 state transition을 만든다.
- 복구 가능한 오류는 복구가 끝날 때까지 보류한다.
- 제거부터 요약까지 압축 비용을 계층화한다.
- 모든 retry와 자동 작업에 circuit breaker를 둔다.

## Book SDK에서 같이 보기

Book SDK 3장 에이전트 루프, 9~12장 compaction, 26장 메시지 관측과 대응한다.

## 원문

[Chapter 5: The Agent Loop][source]

[source]: https://github.com/alejandrobalderas/claude-code-from-source/blob/a6d5e452a8e0dd925c22c407c84611b1994562eb/book/ch05-agent-loop.md

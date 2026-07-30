# 7장: 동시 도구 실행

## 원저자의 관점

여러 tool call이 있다고 모두 `Promise.all`로 실행하거나 모두 직렬화하지 않는다.
입력의 의미에 따라 안전한 연속 구간을 batch로 묶고, 쓰기와 context modifier는
독점 구간으로 유지한다.

## StreamingToolExecutor

모델이 전체 응답을 끝내기 전에 완성된 read-only tool call을 시작한다. 새
call이 stream으로 들어올 때 admission rule을 평가하고, 안전한 작업은 병렬로
진행한다. 완료 시점이 달라도 결과는 모델이 요청한 원래 순서대로 전달한다.

한 concurrent sibling에서 치명적 오류가 나면 abort contract에 따라 다른
subprocess를 중단한다. speculative path를 사용할 수 없게 되면 `discard()`로
정상 non-streaming 실행에 되돌아간다.

## 가져갈 패턴

- operation type이 아니라 실제 argument로 병렬 안전성을 분류한다.
- 느린 producer가 뒤 항목을 만드는 동안 앞의 독립 작업을 시작한다.
- 완료 순서보다 소비자가 기대하는 제출 순서를 보존한다.
- speculation에는 명확한 폐기와 정상 경로 복귀가 필요하다.

## Book SDK에서 같이 보기

Book SDK 4장의 동시성·streaming·interrupt와 27장의 프로덕션 실행 패턴에
직접 대응한다.

## 원문

[Chapter 7: Concurrent Tool Execution][source]

[source]: https://github.com/alejandrobalderas/claude-code-from-source/blob/a6d5e452a8e0dd925c22c407c84611b1994562eb/book/ch07-concurrency.md

# 3장: 상태 — 2계층 아키텍처

## 원저자의 관점

모든 상태를 하나의 reactive store에 넣지 않는다. 읽고 쓰는 패턴이 다른 상태는
다른 계층에 둔다.

## 두 계층

`STATE` process singleton은 세션 ID, 모델 설정, 비용, telemetry와 startup
결과처럼 React보다 먼저 필요하고 자주 읽지만 드물게 바뀌는 필드를 가진다.
AppState는 메시지, 입력 모드, 승인 queue와 progress처럼 바뀔 때 UI가 다시
그려져야 하는 상태를 가진다.

sticky latch는 prompt cache key에 영향을 주는 feature가 한번 켜진 뒤 세션
중간에 꺼지지 않게 한다. `onChangeAppState`는 여러 mutation 경로에 side effect를
흩뿌리지 않고 상태 diff 한 곳에서 알림과 동기화를 실행한다.

## 가져갈 패턴

- 도메인이 아니라 접근 패턴으로 상태를 나눈다.
- cache key를 바꾸는 값에는 한번 활성화되면 유지되는 latch를 쓴다.
- side effect는 mutation 호출부가 아니라 중앙 diff에서 발생시킨다.
- `get/set/subscribe`면 충분할 때 작은 store를 직접 소유한다.
- 비정상 종료 시 잃어도 되는 진단 데이터만 process-exit에 저장한다.

두 계층에 같은 모델 정보가 존재하는 중복은 의도된 비용이다. 중앙 동기화 지점이
명확하다면 서로의 내부를 import하는 것보다 작은 중복이 낫다.

## Book SDK에서 같이 보기

Book SDK 3장의 메시지 상태, 10장의 파일 상태 보존, 24장의 세션 간 메모리와
비교한다.

## 원문

[Chapter 3: State — The Two-Tier Architecture][source]

[source]: https://github.com/alejandrobalderas/claude-code-from-source/blob/a6d5e452a8e0dd925c22c407c84611b1994562eb/book/ch03-state.md

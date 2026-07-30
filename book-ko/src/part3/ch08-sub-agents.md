# 8장: 서브에이전트 생성

## 원저자의 관점

서브에이전트는 단순히 같은 모델을 한 번 더 호출하는 기능이 아니다. 부모와
분리된 대화 루프, 도구 집합, 권한 경계, abort controller와 context budget을
가진 독립 실행 단위다. 부모는 자식의 내부 대화를 전부 소비하지 않고, 자식이
반환한 최종 결과를 받아 다음 판단을 이어간다.

이 구조는 검색 결과로 주 대화를 오염시키지 않거나, 독립 작업을 병렬화하거나,
별도의 검증 관점을 투입할 때 유효하다. 반대로 단순 작업까지 모두 위임하면
조정 비용과 token 비용만 늘어난다.

## `Agent` 도구에서 실행까지

모델은 `description`, `prompt`, `subagent_type`, `model`,
`run_in_background` 같은 입력으로 자식을 요청한다. Team이나 격리 기능이
활성화된 경우에는 이름, team, permission mode, worktree 같은 필드가 추가된다.
중요한 점은 사용할 수 없는 기능을 설명으로 금지하는 대신 schema에서 아예
제거한다는 것이다. 도구 schema 자체가 모델의 실행 설명서이기 때문이다.

호출 경로는 대략 다음 순서를 따른다.

1. teammate, fork, 일반 subagent 중 실행 형태를 결정한다.
2. agent definition과 필요한 MCP server를 해석한다.
3. model, permission, tool pool과 격리 경로를 확정한다.
4. 동기 실행인지 background 실행인지 결정한다.
5. `runAgent()`가 독립 query loop를 시작한다.
6. 수명주기가 끝나면 부모에게 요약 결과와 상태를 반환한다.

`runAgent()`는 새 agent뿐 아니라 fork, custom agent, coordinator worker를
같은 lifecycle로 처리한다. 차이는 별도 lifecycle을 복제해서 만들지 않고,
명시적인 override와 resolved definition으로 주입한다.

## Context와 권한

fresh agent는 필요한 사용자 prompt와 제한된 project context로 시작한다. fork
agent는 부모 대화와 file state cache를 복제하지만, 아직 결과가 없는 불완전한
tool call은 제거한다. 그렇지 않으면 API가 `tool_use`와 `tool_result`가 맞지
않는 대화를 거부할 수 있다.

읽기 전용 agent는 편집 규칙이나 오래된 git snapshot처럼 역할과 관계없는
context를 생략할 수 있다. 권한 역시 부모 권한을 무조건 복제하지 않는다.
각 자식이 실제로 필요한 tool과 permission만 받도록 하는 것이 실행 경계다.

## 가져갈 패턴

- 위임은 역할 이름이 아니라 별도 context와 권한을 제공할 가치가 있을 때 한다.
- 부모는 자식의 매 token을 사용자 대화로 투사하지 않고 결과와 필요한 상태를 받는다.
- 자식은 사용자에게 직접 질문하는 대신 부모 오케스트레이터에 결과를 보고한다.
- lifecycle cleanup은 호출자가 기억하게 하지 않고 agent runner가 소유한다.
- schema에서 감춘 기능을 prompt로 억지로 다시 설명하지 않는다.

## Book SDK에서 같이 보기

Book SDK의 서브에이전트, Team, 권한, 관측성 장을 읽을 때 이 장을 실행 구현의
지도처럼 사용할 수 있다. SDK event에서 보이는 것은 대개 agent/task/tool
실행의 결과이며, 원저자가 설명한 내부 orchestration 개념이 그대로 하나의
event 이름으로 노출된다고 가정해서는 안 된다.

## 원문

[Chapter 8: Spawning Sub-Agents][source]

[source]: https://github.com/alejandrobalderas/claude-code-from-source/blob/a6d5e452a8e0dd925c22c407c84611b1994562eb/book/ch08-sub-agents.md

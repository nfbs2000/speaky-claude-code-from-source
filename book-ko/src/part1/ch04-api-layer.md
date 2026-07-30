# 4장: Claude와 대화하기 — API 계층

## 원저자의 관점

API 계층은 SDK client를 한 번 호출하는 얇은 wrapper가 아니다. provider 선택,
system prompt 조립, raw SSE, watchdog, prompt cache와 오류 escalation이 만나는
경계다.

## 실행 경로

multi-provider factory가 인증과 endpoint를 선택하고, 안정적인 prompt prefix 뒤에
변하는 세션 정보를 둔다. raw SSE를 직접 읽어 tool input delta를 누적하고,
stream chunk가 끊기면 idle watchdog이 중단과 retry를 시작한다. proxy가 SSE를
깨뜨리면 제한된 non-streaming fallback을 사용한다.

## 캐시가 만드는 아키텍처

prompt cache는 옵션 하나가 아니다. prompt 섹션 순서, memoization, beta header
latch와 날짜 고정까지 좌우한다. 안정적인 prefix가 중간 턴에서 바뀌는 것은
성능상 버그다.

## 요청과 stream의 경계

```mermaid
sequenceDiagram
    participant Loop as queryLoop
    participant API as queryModelWithStreaming
    participant VCR as withStreamingVCR
    participant Claude

    Loop->>API: messages·systemPrompt·tools·signal
    API->>VCR: streaming 실행 위임
    VCR->>Claude: SSE request
    Claude-->>VCR: content block delta
    VCR-->>API: StreamEvent·AssistantMessage
    API-->>Loop: yield*
```

API layer는 tool을 실행하지 않는다. 인증·header·request·stream parsing을
책임지고, 실행 여부는 loop와 permission/tool layer로 넘긴다.

## 실제 source 핵심 코드

```typescript
export async function* queryModelWithStreaming({
  messages,
  systemPrompt,
  thinkingConfig,
  tools,
  signal,
  options,
}): AsyncGenerator<StreamEvent | AssistantMessage, void> {
  return yield* withStreamingVCR(messages, async function* () {
    yield* queryModel(messages, systemPrompt, thinkingConfig, tools, signal, options)
  })
}
```

실제 error union을 포함한 코드는 [`claude.ts` 752~775행][actual-api]에 있다.
`AbortSignal`이 API boundary까지 전달되는지, fallback이 같은 message를 어떻게
정규화하는지 함께 추적한다.

## 관측 지점

| 지점 | 학생이 확인할 정보 |
|---|---|
| request 시작 | provider, model, system/tool schema version |
| stream 시작 | first chunk 시간과 request ID |
| stream 진행 | assistant delta와 tool input delta |
| 종료 | usage, stop reason, error와 fallback 여부 |

## 가져갈 패턴

- cache를 나중에 켜는 최적화가 아니라 초기 설계 제약으로 본다.
- 비싼 invariant 우회 함수에는 `DANGEROUS`처럼 눈에 띄는 이름과 이유를 요구한다.
- request timeout 외에 chunk마다 갱신되는 stream watchdog을 둔다.
- retry 상태를 exception에 숨기지 않고 event stream으로 보낸다.
- compaction·분류처럼 단순한 내부 호출에는 별도 fast path를 둔다.

## Book SDK에서 같이 보기

Book SDK 6b장의 API 통신 계층, 13~15장의 prompt cache와 21장의 모델 effort를
함께 본다.

## 원문

[Chapter 4: Talking to Claude — The API Layer][source]

[source]: https://github.com/alejandrobalderas/claude-code-from-source/blob/a6d5e452a8e0dd925c22c407c84611b1994562eb/book/ch04-api-layer.md
[actual-api]: https://github.com/codeaashu/claude-code/blob/6a2590911df240ff5ea56aa355696cfb94d128cb/src/services/api/claude.ts#L752-L775

// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="preface.html"><strong aria-hidden="true">1.</strong> 한국어판을 읽는 법</a></li><li class="chapter-item expanded affix "><li class="part-title">제1부: 기초</li><li class="chapter-item expanded "><a href="part1/ch01-architecture.html"><strong aria-hidden="true">2.</strong> 1장: AI 에이전트의 아키텍처</a></li><li class="chapter-item expanded "><a href="part1/ch02-bootstrap.html"><strong aria-hidden="true">3.</strong> 2장: 빠르게 시작하기 — 부트스트랩 파이프라인</a></li><li class="chapter-item expanded "><a href="part1/ch03-state.html"><strong aria-hidden="true">4.</strong> 3장: 상태 — 2계층 아키텍처</a></li><li class="chapter-item expanded "><a href="part1/ch04-api-layer.html"><strong aria-hidden="true">5.</strong> 4장: Claude와 대화하기 — API 계층</a></li><li class="chapter-item expanded affix "><li class="part-title">제2부: 핵심 루프</li><li class="chapter-item expanded "><a href="part2/ch05-agent-loop.html"><strong aria-hidden="true">6.</strong> 5장: 에이전트 루프</a></li><li class="chapter-item expanded "><a href="part2/ch06-tools.html"><strong aria-hidden="true">7.</strong> 6장: 도구 — 정의에서 실행까지</a></li><li class="chapter-item expanded "><a href="part2/ch07-concurrency.html"><strong aria-hidden="true">8.</strong> 7장: 동시 도구 실행</a></li><li class="chapter-item expanded affix "><li class="part-title">제3부: 멀티에이전트 오케스트레이션</li><li class="chapter-item expanded "><a href="part3/ch08-sub-agents.html"><strong aria-hidden="true">9.</strong> 8장: 서브에이전트 생성</a></li><li class="chapter-item expanded "><a href="part3/ch09-fork-agents.html"><strong aria-hidden="true">10.</strong> 9장: Fork 에이전트와 프롬프트 캐시</a></li><li class="chapter-item expanded "><a href="part3/ch10-coordination.html"><strong aria-hidden="true">11.</strong> 10장: Task, 조정과 Swarm</a></li><li class="chapter-item expanded affix "><li class="part-title">제4부: 지속성과 지능</li><li class="chapter-item expanded "><a href="part4/ch11-memory.html"><strong aria-hidden="true">12.</strong> 11장: Memory — 대화를 넘어 학습하기</a></li><li class="chapter-item expanded "><a href="part4/ch12-extensibility.html"><strong aria-hidden="true">13.</strong> 12장: 확장 — Skill과 Hook</a></li><li class="chapter-item expanded affix "><li class="part-title">제5부: 인터페이스</li><li class="chapter-item expanded "><a href="part5/ch13-terminal-ui.html"><strong aria-hidden="true">14.</strong> 13장: 터미널 UI</a></li><li class="chapter-item expanded "><a href="part5/ch14-input-interaction.html"><strong aria-hidden="true">15.</strong> 14장: 입력과 상호작용</a></li><li class="chapter-item expanded affix "><li class="part-title">제6부: 연결</li><li class="chapter-item expanded "><a href="part6/ch15-mcp.html"><strong aria-hidden="true">16.</strong> 15장: MCP — 범용 도구 프로토콜</a></li><li class="chapter-item expanded "><a href="part6/ch16-remote.html"><strong aria-hidden="true">17.</strong> 16장: 원격 제어와 클라우드 실행</a></li><li class="chapter-item expanded affix "><li class="part-title">제7부: 성능 엔지니어링</li><li class="chapter-item expanded "><a href="part7/ch17-performance.html"><strong aria-hidden="true">18.</strong> 17장: 모든 밀리초와 토큰</a></li><li class="chapter-item expanded "><a href="part7/ch18-epilogue.html"><strong aria-hidden="true">19.</strong> 18장: 우리가 배운 것</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="attribution.html"><strong aria-hidden="true">20.</strong> 출처와 자료 성격</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);

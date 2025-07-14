document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  ScrollTrigger.defaults({});
  // footer에 관한 js

  function initCommonFooter() {
    // footer에 관한 javascript도 initCommonFooter() 라는 함수로 만들어서 관리하게 편하게 사용

    // DOM 요소 캐싱 및 유효성 검사 - 요소가 있는 지 확인, 없다면 실행 X
    const $footer = document.querySelector("#footer");
    if (!$footer) return;

    // footer에 있는 top버튼 - 상단으로 이동하는 top버튼
    // 1-1. 그에 관한 변수를 저장

    // 상단으로 이동시키는 버튼
    const $topButton = $footer.querySelector(".top-btn");
    console.log($topButton);

    // footer 내부 요소 - 이걸 왜 변수로 저장하는 지는 모르겠지만 일단 저장함.
    const $footerInner = $footer.querySelector(".footer-inner");
    console.log($footerInner);

    // [상단 스크롤 처리]  클릭 시 애니메이션

    // javascript에 "단락 평가" 라고 한다. -> $topButton &&
    // &&은 AND 연산자 -> 좌항이 false이면, 우항은 아예 실행하지 않고 무시 /  좌항이 true라면 실행.
    // 즉, 간단하게 이야기하자면 $topButton이 있다면 실행, 없다면 실행 X
    $topButton &&
      $topButton.addEventListener("click", (e) => {
        // a링크의 기본 링크 동작 제어
        // 자꾸 () 이거 잊지말자. -> 실행 안됌
        e.preventDefault();

        // 현재 스크롤 값을 구함.
        const scrollY = window.scrollY;
        console.log(scrollY);

        // gsap.killTweensOf() 함수는 특정 객체 또는 함수에 연결된 트원(Tween) 또는 지연호출(delayedCall)을 중단하고 제거하는 기능을 말한다.
        // 혹시 이미 실행중인 window에 대한 GSAP 애니메이션이 있다면 중단. (중복으로 애니메이션이 쌓이는 것을 방지하기 위해서)
        // gsap에 대한 애니메이션 전부를 멈춘 게 아니라 window에 관한 window가 타겟으로 되어있는 gsap효과를 멈추게 한 것이다.
        gsap.killTweensOf(window);

        // 스크롤 거리에 따라 duration 조절
        // duration 계산.
        // Math.min()는 입력으로 주어진 숫자들 중에서 가장 작은 값을 반환하는 역할을 한다.
        // Math.abs()는 입력받은 숫자의 절대값을 반환하는 함수이다. 즉, 양수 또는 0은 그대로 반환하고, 음수인 경우에는 부호를 제거한 양수 값을 반환.
        // ()안에 1,과 Math.abs(x)이 주어졌는데, Math.abs(x) 값을 구한 후, 1과 비교하여 더 작은 값을 반환한다.
        // Math.min(1, Math.abs(scrollY / 1000))
        const duration = Math.min(1, Math.abs(scrollY / 1000));
        gsap.to(window, {
          // scrollTo를 : 0으로 사용하기 위해서는 scrollToPlugin이 필요하다 cdn을 복사하여 HTML에 넣고, js에 register(ScrollToPlugin)을 기입해주면 된다.
          scrollTo: 0,
          duration: duration,
          ease: "Quad.easeInOut",
        });
      });
    // footer에 family-site 버튼
  }

  initCommonFooter();
});

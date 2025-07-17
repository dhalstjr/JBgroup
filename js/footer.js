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

        // Math.min(1, Math.abs(scrollY / 1000))은 스크롤 위치(scrollY)에 따라 특정 값(0에서 1 사이)을 반환한다. scrollY 값을 1000으로 나눈 절대값과 1 중 작은 값을 선택한다.
        // 즉, 스크롤 위치가 멀어질수록(절댓값이 클수록) 1에 가까워지고, 스크롤 위치가 가까울수록(절댓값이 작을수록) 0에 가까워진다.
        // 반환값은 0과 1 둘 중 하나이다.
        const duration = Math.min(1, Math.abs(scrollY / 1000));
        gsap.to(window, {
          // scrollTo를 : 0으로 사용하기 위해서는 scrollToPlugin이 필요하다 cdn을 복사하여 HTML에 넣고, js에 register(ScrollToPlugin)을 기입해주면 된다.
          scrollTo: 0,
          duration: duration,
          ease: "Quad.easeInOut",
        });
      });

    // footer에 family-site 버튼
    // 2-1 footer family-site 버튼에 관한 요소를 변수에 저장
    const $familySiteButton = $footer.querySelector(".family-site");
    // footer영역 밖에 있는데 왜 $footer로 찾았을까.. footer 영역 밖에 있으니 document로 해야 null이 반환되지 않는다.
    const $familySiteDropdown = $footer.querySelector(".family-site-dropdown");

    // dropdown 메뉴를 body로 옮김
    // 드롭다운 메뉴를 body의 맨 마지막으로 이동시킴 -> footer안에 두면, overflow , z-index , position 때문에 레이어가 잘려 보이거나 가려질 수도 있어서, body에 이동시키고, position : fixed나 absolute로 띄우려는 의도.
    $familySiteDropdown && document.body.append($familySiteDropdown);

    // 드롭다운 매뉴를 숨기기 위한 이벤트 핸들러 정의
    function hideFamilySitesDropdownEvent(e) {
      if (
        $familySiteButton &&
        $familySiteDropdown &&
        // 드롭다운 자체나 토글 버튼을 누른 경우에는 닫으면 안되니, 그 경우를 체크.
        // 클릭된 대상이 토글 버튼 또는 그 내부라면 true
        ($familySiteButton.contains(e.target) ||
          // || -> 논리 연산자로서, 주로 조건문에서 사용. 논리 연산과 단락 평가를 실행
          // 논리 연산 : 두 피연산자중 하나라도 참이라면 참을 반환
          // 단락 평가 : 왼쪽 피연산자가 참이면 오른쪽 피연산자는 평가하지 않고, 왼쪽 피연산자를 반환
          // 클릭된 대상이 드롭다운 내부라면  true  -> || 둘 중 하나라도 true라면 return해서 아무것도 실행 하지 않음.
          $familySiteDropdown.contains(e.target))
      ) {
        // || 연산자로 둘 중 하나라도 참이면 참을 반환했지만, return을 통해 둘 중 하나라도 참이라면 아무것도 실행하지 않게 했음.
        return;
      }

      // 드롭다운 닫기
      $familySiteButton && $familySiteButton.classList.remove("active");
      $familySiteDropdown && $familySiteDropdown.classList.remove("active");
      // 이벤트 핸들러 제거 -> 이벤트가 중복해서 쌓이지 않도록, 현재 이벤트 리스너를 제거
      window.removeEventListener("mouseup", hideFamilySitesDropdownEvent);
      window.removeEventListener("touchstart", hideFamilySitesDropdownEvent);
      window.removeEventListener("wheel", hideFamilySitesDropdownEvent);
    }

    console.log($familySiteButton, $familySiteDropdown);

    // 2-2. family-site toggle -> click 이벤트
    // $familySiteButton이 없다면 실행 X -> AND연산자 좌항이 참(true)이 아니라면, 우항은 실행 X
    $familySiteButton &&
      $familySiteButton.addEventListener("click", (e) => {
        //a링크의 기본 동작 제거
        e.preventDefault();

        // add보다 toggle를 사용하는 게 좋다 -> toggle()메서드는 클래스가 존재하면 삭제하고, 존재하지 않으면 추가한다.
        // family-site 버튼 클릭 시 active 클래스 toggle
        $familySiteButton.classList.toggle("active");

        // dropdown이 존재한다면 실행
        $familySiteDropdown &&
          // 드롭다운 메뉴에도 클래스를 toggle한다.
          $familySiteDropdown.classList.toggle(
            "active",
            // 두번쨰로 들어간 아래 문법은 class를 포함하고 있냐는 것인데, 조건이 들어간 것인데.
            // active라는 클래스를 포함하고 있다면, 드롭다운 메뉴의 class도 추가해라, 포함하고 있지 않다면 class를 제거하라.
            $familySiteButton.classList.contains("active")
          );

        // 패밀리 사이트 버튼에 active 클래스가 존재했을 떄.
        if ($familySiteButton.classList.contains("active")) {
          // 드롭다운 위치를 업데이트 실시 -> 클릭 했을 때 위치가 업데이트 될 수 있도록 실행.
          // 클릭 했을 때 위치가 업데이트 되어야하기 때문에 넣어준 것이다.
          checkFamilySitesDropdown();

          //드롭다운 외부 클릭, 터치, 휠 이벤트 발생 시 드롭다운 숨김처리
          // 이벤트 핸들러 뒤에 꼭 함수를 붙어야 한다. ()=> 이거와 같은 개념.
          window.addEventListener("mouseup", hideFamilySitesDropdownEvent, {
            //passive true 옵션은 addEventListener메서드에서 사용되며, 이벤트 리스너가 기본 동작을 막지 않음을 브라우저에게 알리는 역할을 한다. 이를 통해 스크롤 성능을 향상 시킬 수 있습니다.
            // 특히 touchstart, touchmove 에서 유용하게 사용된다.
            passive: true,
          });
          window.addEventListener("touchstart", hideFamilySitesDropdownEvent, {
            passive: true,
          });
          window.addEventListener("wheel", hideFamilySitesDropdownEvent, {
            passive: true,
          });
        }
      });

    // 2-3 family-site 토글의 위치/크기 정보를 CSS변수로 지속 업데이트(변경)
    // family-site 토글의 위치가 스크롤 위치에 드롭다운 메뉴가 나오는 곳이 달라져, 지속적으로 업데이트 해야함.
    // 스크롤 위치가 아니라 family-site 버튼의 크기와 위치에 맞게 바뀌는 것 같음.
    function checkFamilySitesDropdown() {
      // 불필요한 에러를 방지하기 위한 방어 코드이다.
      // 요소가 있는 지 없는 지 확인 ->  !는 부정 연산자 - 존재하지 않는다면 으로 바뀜
      // ||는 OR 연산자 - 둘 중 하나라도 true면 전체가 true라는 뜻,
      // 그러니 둘 중 하나라도 존재하지 않는다면 으로 바뀜 -> return를 통해 함수 실행을 중단.
      if (!$familySiteButton || !$familySiteDropdown) return;

      // family-site 버튼에 getBoundingClientRect()메서드를 이용하여 그 값을 변수로 저장\
      // family-site 버튼에 크기와 위치를 가져온다 -> 버튼의 화면 내 위치(top,left)와 크기(width, height) 정보를 가져온다
      const rect = $familySiteButton.getBoundingClientRect();

      // css변수에 값을 반영 -> var(--width,--top,--left)로 준 값을 말하는 것이다.
      // 드롭다운 메뉴에 스타일에 접근하여 setProperty메서드를 통해 CSS 속성을 설정하는데 사용한다. 이 메서드는 CSS 속성 이름과 값을 지정하여 요소의 스타일을 동적으로 변경할 수 있도록 합니다.
      // 이렇게 적용하면 family-site 토글 버튼 바로위에 위치하게 된다.
      $familySiteDropdown.style.setProperty("--top", rect.top + "px");
      $familySiteDropdown.style.setProperty("--left", rect.left + "px");
      $familySiteDropdown.style.setProperty("--width", rect.width + "px");

      // 지속적으로 업데이트
      // family-site 토글 버튼에 active 클래스가 포함되어있다면
      if ($familySiteButton.classList.contains("active")) {
        // requestAnimationFrame을 통해 부드러운 애니메이션 전환을 통해 함수를 실행시켜 지속적으로 업데이트 되게 한다.
        requestAnimationFrame(checkFamilySitesDropdown);
      }
      console.log(rect);
    }
  }

  initCommonFooter();
});

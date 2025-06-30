// Jquery없이 사용하는 $(function) -> document..
document.addEventListener("DOMContentLoaded", function () {
  // header javaScrip

  // 헤더 관련 스크립트를 안전하고 효율적으로 초기화하기 위헤 하나의 함수로 묶는다.
  function initCommonHeader() {
    // 하나의 함수로 묶어서 사용하는 이유는
    // 1. 함수화(모듈화) : 나중에 initCommonHeader()만 호출하면 관련된 모든 DOM 셀렉터와 이벤트 처리가 한번에 실행
    // 2. 관리 용이성 : 전체 코드를 체계적으로 관리하고, 다른 페이지에서도 사용 가능
    // 3. 전역 오염 방지 : 변수들이 전역 공간에 퍼지지 않고 함수 안에서만 사용되게 해 코드 충돌 방지
    // 이런 이유로 하나의 함수로 묶어 사용한다.

    // header에 관한 변수를 저장.
    const $header = document.querySelector("#header");
    // $header가 존재하지 않는다면 함수 실행 중단. -> $header가 존재하지 않는다면 이 아래 코드들은 실행되지 않음. - 안전장치
    // 여러 페이지에서 공통적으로 사용된다면, 헤더가 없는 페이지에서도 에러없이 실행된다.
    // null 체크
    if (!$header) return;

    const $nav = document.querySelector("#nav");

    // 나중에 패밀리 클릭 시 와 사이트맵 클릭 시 도 해야함

    console.log($header, $nav);

    // nav(네비게이션)영역에 마우스 진입/이탈 시 메뉴 표시 및 숨김 처리
    if ($nav) {
      $nav.addEventListener("mouseenter", function () {
        header.classList.add("show-menu");
      });

      $nav.addEventListener("mouseleave", function () {
        header.classList.remove("show-menu");
      });
    }
    // 이렇게 사용 시 nav에 마우스가 진입/이탈 시에 작동이 잘 일어난다. -> 고쳐야할 점은 show-menu의 클래스가 붙었을 때의 css가 문제이다. submenu의 글씨들이 같이 나오기 때문에 부자연스러워 보인다.
    // 그래서 submenu의 css에서 고쳐야할 게 보인다
    // css변경하니 확실히 애니메이션이 자연스럽게 적용됨

    // show-menu가 활성화 됐을 때 header말고 다 blur처리

    // 이 애니메이션 구현도 initCommonHeader에 함께 넣어 사용.
    // 2. family 버튼을 누르면 class를 부여해서 family 페이지 구현
    // 2-1 family 버튼을 변수에 저장.

    /* 안에 있는 a링크에 효과를 줘야함. */
    // 굳이 부모에게 안주고 a링크에 직접 줘야하는 이유는 정확한 타겟팅을 잡기 위해서이고, 부모에게 주지 않는 이유는 혹시 모를 불필요한 영역까지 반응할 수 있기 떄문에 의도치 않게 다르게 제어가 될 수 있음.
    // 또한 a 태그의 기본 동작을 막고자 해도 제대로 막히지 않는 경우가 많기 때문입니다.
    // a태그의 기본동작을 막는 이유가 제일 커보인다.
    const $familyButton = document.querySelector(".family a");

    const $jbFamily = document.querySelector("#jbFamily");

    // utils에 toggle버튼에 active를 주기 위해서 toggle 버튼을 변수로 저장
    /* site-tab a -> toggle인데 menu를 여는 버튼 */
    // 이 버튼은 단순히 active를 주기 위해서만이 아니라 siteMap의 디자인을 나오게 하는 버튼이 되기도 한다.
    const $btnSitemap = document.querySelector(".utils .site-tab a");

    // 이것은 toggle active가 됐을 때의 취소 아이콘 버튼
    // const $cancelBtn = document.querySelector(".utils .toggle");
    // 이 위에 처럼 변수를 저장하려고 한다면 header영역에 있는 utils에 toggle만을 먼저 찾을 것이다.
    // 하지만 정확하게 잡으려고 하는 것은 family디자인이 나왔을 때에 toggle인데, 그렇다면 정확하게 잡으려면
    // const $jbFamily = document.querySelector("#jbFamily"); 변수를 저장해줬는데, family디자인이 나왔을 때는 jbFamily라는 태그안에 있는 toggle을 잡아야하기 때문에
    // jbFamily.querySelector로 정확하게 탐색을 해야한다.

    // if ($familyButton && $jbFamily)을 사용한 이유는 안전 장치인 셈이다.
    // 무슨 이야기냐면 &&은 논리연산자로, 논리곱(AND) 연산을 수행한다. 두 값이 모두 참일 경우에만 참을 반환하며, 그렇지 않다면 거짓을 반환한다.
    // 즉, .family a와 #jbFamily가 두 요소가 전부 존재하면 실행하고, 하나라도 존재하지 않다면 실행하지마라. 라는 의미에 조건식을 준것이다.
    if ($familyButton && $jbFamily) {
      // family a에 click 이벤트를 걸고
      $familyButton.addEventListener("click", (e) => {
        // 클릭이 잘 작동하는 지 확인 완료

        // a링크의 기본동작을 막아준다 -> 이유는 기본 동작을 막지 않으면 애니메이션이 실행이 되지 않을 수 있다.(개발자가 원하는 동작을 실행할 수 있도록.)
        e.preventDefault();

        // 현재 창 높이 저장 -> #jbFamily을 전체 화면 높이만큼 펼치기 위해 사용.
        const windowHeight = window.innerHeight;

        // header에 show-family class를 추가함.
        $header.classList.add("show-family");

        // 그리고 나서 스크롤을 비활성화 해야하고

        // jbFamily 자체에 active클래스를 부여하여 디자인 변경
        $jbFamily.classList.add("active");
      });
    }

    /* 2-2. utils toggle에 있는 취소 버튼 활성화 및 취소하여 family페이지 사라지게 */
    // jbFamily에 나오는 버튼을 잡기 위해서는 document가 아니라 jbFamily안에 toggle 을 잡아야한다.
    // document를 사용하면 header에 있는 toggle을 먼저 탐색하기 때문에,
    // 정확하게 jbFamily디자인이 나왔을 때에 toggle을 잡으려면 #jbFamily에 존재하는(querySelector)toggle를 잡아야한다.
    const $jbFamilyToggleBtn = $jbFamily.querySelector(".toggle");

    // jbFamily안에 toggle버튼에게 click 이벤트 적용
    $jbFamilyToggleBtn.addEventListener("click", (e) => {
      // a링크에 기본 동작을 막는다.
      e.preventDefault();

      // 저 위와 다르게 class를 삭제시켜준다.
      $header.classList.remove("show-family");

      $jbFamily.classList.remove("active");
    });

    // --------------------------------------------
    // 여기까지 jbFamily toggle 상호 작용 완료, --> 부족한 점은 부드러운 느낌이 안나고 뚝뚝 나오는 느낌이라 css에서 건드려야 되겠음.
    // css modal-in-header에 transition을 적용하여 부드러운 느낌을 구현완료.

    // 3. sitemap 디자인 구현
  }

  //함수 밖에서 호출하면 바로 실행 가능
  initCommonHeader();

  // scroll값에 의해서 header의 색변화와 위치를 변경시켜 header가 보이지 않게
  // 스크롤 이벤트에 따라 헤더의 클래스를 추가/제거 하여 동작을 제어

  // opaque 클래스를 추가해서 색을 변경
  // opaque 클래스에 hide를 추가해서 opaque hide 하여 위치를 변경해서 header가 보이지 않게

  // 이 함수는 스크롤을 내릴 때 헤더를 숨겨 콘텐츠를 제대로 볼 수 있게 하고, 스크롤을 올릴 때는 다시 헤더를 노출시켜 네비게이션의 접근성을 높이려고 하는것이다.
  function initCommonScroll() {
    // header요소 가져오기
    const $header = document.querySelector("#header");
    console.log($header);

    // 이전 스크롤 위치
    let lastScrollY = 0;
    // 스크롤 방향 (예를 들어 : 1(아래로) , -1(위로) , 0(정지))
    let scrollDirection = 0;
    // requestAnimationFrame이 중복 호출되지 않도록 처리하는 플래그 -> 스크롤 이벤트가 너무 자주 실행되지 않게 막아주는 역할을 하는 플래그.
    // scroll이벤트는 이벤트가 너무 많이 발생하기 때문에 성능 저차가 될 수 있음 그러므로 ticking이라는 변수를 만들어 성능을 저하시키지 않도록 requestAnimationFrame를 이용해야하기 때문에 변수로 만듦.
    let ticking = false;

    const onScroll = () => {
      // 현재 스크롤 위치 구하기
      const scrollY = window.scrollY;

      if (window.lenis) {
        // lenis가 있다면  lenis.direction 값을 사용. -> lenis의 direction 옵션은 스크롤 방향을 설정하는 기능. vertical(수직), horizontal(수평), both(수평,수직)으로 설정하여 스크롤 동작을 제어할 수 있다. 기본값은 vertical(수직)이다.
        scrollDirection = lenis.direction;
      } else {
        // lenis가 없다면 일반적인 방식으로 스크롤 방향을 직접 계산
        scrollDirection =
          // javascript에서 ? 숫자 : 구문은 if-else문과 유사한 역할을 하는 삼향 연산자의 일부이다. 조건에 따라 다른 값을 반환하는 간단한 if-else문법과 유사하다
          // 삼향 연산자를 이용해 현재 스크롤 위치값(scrollY)과 이전 스크롤 값(lastScrollY)을 비교
          // scrollY값이 lastScrollY값보다 크다면 1을 반환, scrollY값이 lastScrollY보다 작다면 -1, 0을 반환
          scrollY > lastScrollY ? 1 : scrollY < lastScrollY ? -1 : 0;

        // 다음 스크롤 값을 위해서 현재 스크롤 값을 이전 스크롤 값으로 저장하는 단계 -> 즉, "다음 비교 기준"을 갱신하는 역할
        // 이 코드가 없다면, 매번 이전 값이 초기값(또는 고정값)으로 인식되기 때문에 항상 같은 방향만 계산하더거나 , 정확한 방향 판별이 불가능하다.
        lastScrollY = scrollY;
      }

      // 조건에 따른 class 제어
      // 스크롤 위치가 화면 높이 30% 이상 내려갔으면, opaque 클래스를 추가.
      $header.classList.toggle("opaque", scrollY > window.innerHeight * 0.3);

      // header에 show-sitemap 클래스가 없을 때
      // !는 "부정(NOT) 연산자" 이다. -> !가 없다면 header에 show-sitemap을 포함하고 있냐는 의미이고, !를 사용한다면 반대로 포함하고 있지 않다면으로 바뀌게 된다.

      if (!$header.classList.contains("show-sitemap")) {
        $header.classList.toggle(
          "hide",
          // 두 개의 조건이 모두 만족해야 실행되는 논리 (AND) 연산이다.
          // 여기에서 "===" 는 엄격한 일치 비교 연산자이다. -> 정수 1과 정확하게 같을 때만 true가 된다.
          // innerHeight는 브라우저의 뷰포트 높이이다.
          // 스크롤 방향이 아래 (scrollDirection === 1 )이고 , 60% 이상 스크롤 되면 hide클래스를 추가
          scrollDirection === 1 && scrollY > window.innerHeight * 0.6
        );
      }

      //requestAnimationFrame으로 성능 최적화
      // 그렇다면 onScroll()에 있는 ticking = false는?
      // requestAnimationFrame() 실행되어 onScroll() 함수가 한번 완전히 처리되고 나면, 다시 다음 프레임 요청을 받을 수 있도록 ticking을 초기화
      // 왜 onScroll() 끝에 선언되었을까? -> scroll이벤트에서 requestAnimationFrame(onScroll)요청을 하고, ticking = true로 다음 프레임 효과가 들어오지 못하도록 막고,
      // 이제 onScroll() 함수가 실행되고, 모든 계산이 끝나고 나서야 ticking = false를 넣어야 다음 스크롤 이벤트가 들어왔을 때 다시 처리할 수 잇다.
      // 그러니까 onScroll() 함수에서 if(!$header..) 조건을 처라한 후 작업이 다 마쳤으니, 다음 작업을 할 준비라고 생각하면 된다. 그래서 마지막에 초기화 해주는 것이다.
      // 이게 없다면? ticking은 걔속 true로 유지되고, 이후 모든 스크롤 이벤트는 무시하게 됨 -> 즉, 스크롤이 한 번만 실행되고 멈추게 됨.
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        // ticking이 false일 때만 requestAnimationFrame를 실행하겠다는 의미. 즉, 이전 애니메이션 프레임이 아직 처리되지 않았으면, 또 다른 요청을 하지 않겠다는 뜻
        // 이 조건이 없으면 onScroll()함수가 무한하게 계속 호출 될 수 있어 성능에 문제가 생길 수 있음.
        if (!ticking) {
          // requestAnimationFrame은 웹브라우저에서 애니메이션을 부드럽게 구현하기 위한 자바스크립트의 API이다.
          // 브라우저의 렌더링 과정에 맞춰 애니메이션을 실행하므로, 불필요한 렌더링을 줄여 성능을 향상.
          requestAnimationFrame(onScroll);
          // ticking = true는 왜 들어가는가. -> requestAnimationFrame가 실행되었다면 다음 프레임 요청이 들어오기 전에 또 요청하지 못하게 막는다.
          ticking = true;
        }
      },
      // scroll 이벤트에서 passive옵션은 스크롤 동작 시 이벤트 핸들러가 'preventDefault()'를 호출하여 스크롤을 막을 수 있는지 여부를 브라우저에 알려주는 기능을 한다.
      // passive : true 로 설정하면 , 브라우저는 스크롤 이벤트를 기다리지 않고, 즉시 스크롤을 처리할 수 있으며, 이로 인해 스크롤 성능을 향상시킬 수 있다.
      // preventDefault()는 이벤트의 기본 동작을 중단시키는 메서드이다. -> 특정 이벤트에 대한 브라우저의 기본 동작을 실행하지 않도록 할 수 있다.
      // 즉, passive : true는 스크롤 기능을 향상시킴에 있다.
      { passive: true }
    );

    console.log(scrollY);
  }

  // 함수를 실행해야 console.log도 보이고 실행되는 것을 확인할 수 있음.
  // 이렇게 하면 실행을 됨.
  initCommonScroll();
});

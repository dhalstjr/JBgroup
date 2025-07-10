// Jquery없이 사용하는 $(function) -> document..
document.addEventListener("DOMContentLoaded", function () {
  // GSAP ScrollTrigger 초기화
  gsap.registerPlugin(ScrollTrigger);

  // GSAP의 ScrollTrigger플러그인에서 사용되는 설정 함수로, 모든 ScrollTrigger 인스턴스에 적용될 기본 설정을 정의.
  // {}괄호안에 원하는 옵션들을 객체 형태로 넣어주면, 이후에 생성되는 모든 ScrollTrigger 인스턴스는 해당 기본 설정을 상속받아 사용하게 된다.
  ScrollTrigger.defaults({
    // {} 빈 객체를 전달하면 모든 기본 설정이 초기화가 된다. 즉 이후에 생성되는 ScrollTrigger 인스턴스는 기본 설정없이 각자의 개별 설정에 따라 동작.
    // 아래 설정은 리프레시 될 때마다 애니메이션값을 다시 계산하도록 지시한다.
    // 즉, 창 크기 변경이나 기타 요소 위치 변경과 같이 페이지 레이아웃이 변경될 때, 애니메이션이 정확하게 다시 계산되어 부드럽게 이어지도록 한다.
    // invalidateOnRefresh: true,
  });

  // lenis 관련 코드 : 이 코드는 스크롤을 잠그거나 다시 풀어주는 기능을 함
  // 즉, 이 코드를 사용한 것은 lenis 유무에 관계없이 공통적인 "스크롤 잠금/해제" 인터페이스를 제공하기 위함. -> 무슨 말이냐면 lenis가 사용되는 사이트인지. 아닌지 상관없이 스크롤 제어를 일관되게 할 수 있도록 하는 코드 -> 여러 사이트가 있는 회사 홈페이지나 그런 곳에 사용되겠지용
  // window.disableWindowScroll은 웹페이지에서 브라우저 창의 스크롤 기능을 비활성화하는 코드를 의미 (자바스크립트의 구문은 아니다.)
  window.disableWindowScroll = function () {
    // 페이지에 lenis가 초기화가 되어 있다면 lenis.stop() - lenis의 애니메이션 루프를 멈춰서 스크롤을 비활성화
    if (window.lenis) window.lenis.stop();
    // lenis가 없는 경우(예를 들어 lenis를 쓰지 않는 환경) <html>을 가리킨다. html에 prevent-scroll 클래스를 붙여서 CSS로 overflow : hidden을 하는 방식으로 스크롤을 막는다.
    else document.documentElement.classList.add("prevent-scroll");
  };

  // window.enableWindowScroll은 스크롤을 다시 허용하는 (자바스크립트 구문이 아님.)
  window.enableWindowScroll = function () {
    // 페이지에 lenis가 초기화가 되어 있다면 lenis.start() - 다시 애니메이션 시작해 스크롤 활성화
    if (window.lenis) window.lenis.start();
    // 다시 스크롤이 허용할 땐 prevent-scroll 클래스를 삭제.
    else document.documentElement.classList.remove("prevent-scroll");
  };

  // lenis 초기화 -> initLenis()는 초기화를 하고
  // 본페이지에 있는 코드를 가져오니 GSAP.ScrollTrigger와 연동하기 위한 코드라고 한다.
  function initLenis() {
    // 여기서 매개변수와 전역변수의 차이는 변수의 범위와 사용 목적에서 큰 차이점을 드러낸다.
    // 매개변수는 함수나 메서드 내에서 특정 작업을 위해 값을 전달받는 역할. () 괄호안에 들어간 것이 매개변수 예를 들면 index같은 느낌.
    // 전역변수는 프로그램 전체에서 접근 가능하며, 프로그램 실행 내내 메모리에 유지.
    // lenis 인스턴스를 만들어 window.lenis에 저장, 이렇게 하면 전역에서 window.lenis를 불러올 수 있게 된다.
    window.lenis = new Lenis();

    // on메서드는 특정 이벤트가 발생할 때 실행될 함수.
    // lenis가 스크롤 이벤트를 발생시킬 때마다 ScrollTrigger.update()를 호출한다. 즉, lenis의 부드러운 스크롤과 GSAP ScrollTrigger가 정확하게 맞춰지도록 동기화 해주는 것이다.
    lenis.on("scroll", () => {
      ScrollTrigger.update(); // ScrollTrigger.update()는 플러그인에서 제공하는 함수인데, 레이아웃 변경이나 높이 변경등으로 인해 기존 스크롤 위치가 부정확해졌을 때, 이를 갱신하여 스크롤 관련 애니메이션이 정상 작동하도록 하는 기능이다. 즉, 스크롤 위치를 다시 계산하여 조정하는 역할.
    });

    //gsap.ScrollTrigger와 연동.
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

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

    // submenu의 최대 높이를 구하기 위해서 header에 있는 .submenu를 변수로 저장. (onResize함수를 위해서)
    const $submenus = $header.querySelectorAll(".submenu");

    // 나중에 패밀리 클릭 시 와 사이트맵 클릭 시 도 해야함

    // nav(네비게이션)영역에 마우스 진입/이탈 시 메뉴 표시 및 숨김 처리
    if ($nav) {
      $nav.addEventListener("mouseenter", function () {
        // 그러니까 onResize()의 함수의 실행은 여기 코드에서 이벤트가 발생했을 때 실행된다. --submenu-height를 구한다.
        onResize();
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
    const $familyButton = $header.querySelector(".family a");

    const $jbFamily = $header.querySelector("#jbFamily");

    // 이것은 toggle active가 됐을 때의 취소 아이콘 버튼
    // const $cancelBtn = document.querySelector(".utils .toggle");
    // 이 위에 처럼 변수를 저장하려고 한다면 header영역에 있는 utils에 toggle만을 먼저 찾을 것이다.
    // 하지만 정확하게 잡으려고 하는 것은 family디자인이 나왔을 때에 toggle인데, 그렇다면 정확하게 잡으려면
    // const $jbFamily = document.querySelector("#jbFamily"); 변수를 저장해줬는데, family디자인이 나왔을 때는 jbFamily라는 태그안에 있는 toggle을 잡아야하기 때문에
    // jbFamily.querySelector로 정확하게 탐색을 해야한다.

    // if ($familyButton && $jbFamily)을 사용한 이유는 안전 장치인 셈이다.
    // 무슨 이야기냐면 &&은 논리연산자로, 논리곱(AND) 연산을 수행한다. 두 값이 모두 참일 경우에만 참을 반환하며, 그렇지 않다면 거짓을 반환한다.
    // 즉, .family a와 #jbFamily가 두 요소가 전부 존재하면 실행하고, 하나라도 존재하지 않다면 실행하지마라. 라는 의미에 조건식을 준것이다.
    // jbFamily 토글 처리 코드
    if ($familyButton && $jbFamily) {
      // family a에 click 이벤트를 걸고
      $familyButton.addEventListener("click", (e) => {
        // 클릭이 잘 작동하는 지 확인 완료 -> console.log(e)로 확인.

        // a링크의 기본동작을 막아준다 -> 이유는 기본 동작을 막지 않으면 애니메이션이 실행이 되지 않을 수 있다.(개발자가 원하는 동작을 실행할 수 있도록.)
        e.preventDefault();

        // 현재 창 높이 저장 -> #jbFamily을 전체 화면 높이만큼 펼치기 위해 사용.
        const windowHeight = window.innerHeight;

        // header에 show-family class를 추가함.
        $header.classList.add("show-family");

        // 그리고 나서 스크롤을 비활성화 해야하고
        // gsap.delayedCall()함수는 특정 시간을 지연 후에 함수를 실행시키는 기능을 한다. -> setTimeout과 유사.
        // delayedCall(숫자) 괄호 안에 숫자는 지연 시간을 말하고, ()=> {} 함수를 이용해 {}안에 들어간 코드를 실행시킨다.
        gsap.delayedCall(0.5, () => {
          // 스크롤 기능 차단(lenis)
          window.disableWindowScroll();

          // jbFamily 자체에 active클래스를 부여하여 디자인 변경
          $jbFamily.classList.add("active");

          //gsap.to를 이용해 family디자인이 열릴 때에 스타일을 지정.
          gsap.to(/* 대상 */ $jbFamily, {
            height: windowHeight, //변수로 지정해둔 windowHeight는 window.innerHeight이다. (화면 전체높이)
            duration: 0.5,
            // 그리고 ease는 ""사용하지 않으면 적용되지 않아 오류가 발생한다.
            ease: "power2.out",
          });
          // gsap.to를 이용해서 height의 자연스러운 애니메이션을 적용, 내가 만들었던 CSS에서의 transition을 사용하는 것도 방법이 있지만.
          //gsap.to를 이용해 script를 사용. 내려오는 것은 완료했고, x아이콘을 눌렀을 때 다시 올라는 것을 구현해야함.
        });
      });
    }

    /* 2-2. utils toggle에 있는 취소 버튼 활성화 및 취소하여 family페이지 사라지게 */
    // jbFamily에 나오는 버튼을 잡기 위해서는 document가 아니라 jbFamily안에 toggle 을 잡아야한다.
    // document를 사용하면 header에 있는 toggle을 먼저 탐색하기 때문에,
    // 정확하게 jbFamily디자인이 나왔을 때에 toggle을 잡으려면 #jbFamily에 존재하는(querySelector)toggle를 잡아야한다.

    // 그리고 toggle을 찾을 때도 다르다. 서로 다른 toggle을 핮기 위해서 $jbFamily.querySelector을 사용하여
    // #jbFamily일 때에 toggle을 찾고있다. 그렇다면 sitemap은 #sitemap에 있는 toggle을 찾아 적용해야겠지
    const $jbFamilyToggleBtn = $jbFamily.querySelector(".toggle");
    // $jbFamily에 toggle이 존재한다면
    if ($jbFamilyToggleBtn) {
      // jbFamily안에 toggle버튼에게 click 이벤트 적용
      $jbFamilyToggleBtn.addEventListener("click", (e) => {
        // a링크에 기본 동작을 막는다.
        e.preventDefault();

        // 저 위와 다르게 class를 삭제시켜준다. -> family 디자인이 사라져야하니까.
        $header.classList.remove("show-family");

        $jbFamily.classList.remove("active");

        // 여기는 왜 delayedCall()에 들어가지 않았냐면, 내가 생각하기엔. Family 다지안이 나왔을 때는 전체화면으로 창을 사용하고 있기때문에. 스크롤이 되지 않게 막아둔 것 같다. 그리고 스크롤이 필요없는 다자인이라서 그런것도 있다.
        window.disableWindowScroll();

        gsap.delayedCall(0.3, () => {
          gsap.to($jbFamily, {
            height: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      });
    }

    // --------------------------------------------
    // 여기까지 jbFamily toggle 상호 작용 완료, --> 부족한 점은 부드러운 느낌이 안나고 뚝뚝 나오는 느낌이라 css에서 건드려야 되겠음.
    // css modal-in-header에 transition을 적용하여 부드러운 느낌을 구현완료.

    // 3. sitemap 디자인 구현 , sitemap toggle 처리
    // sitemap에 관련된 변수를 저장
    const $sitemap = $header.querySelector("#sitemap");

    // utils에 toggle버튼에 active를 주기 위해서 toggle 버튼을 변수로 저장
    /* site-tab a -> toggle인데 menu를 여는 버튼 */
    // 이 버튼은 단순히 active를 주기 위해서만이 아니라 siteMap의 디자인을 나오게 하는 버튼이 되기도 한다.
    const $btnSitemap = $header.querySelector(".utils .site-tab a");

    // && (AND)논리 연산자 -> 두 값이 전부 참이여만 실행
    if ($btnSitemap && $sitemap) {
      /* menu 아이콘에 click 이벤트를 걸어줌. -> class를 추가하는 코드  */
      $btnSitemap.addEventListener("click", (e) => {
        // 클릭 되는 지 확인
        // console.log(e);

        /* a링크에 기본 동작 제어 */
        e.preventDefault();

        // sitemap의 다지인이 보이게
        $header.classList.add("show-sitemap");

        // 윈도우 전체 너비를 변수로 저장
        const windowHeight = window.innerHeight;

        gsap.delayedCall(0.5, () => {
          //지금 sitemap디자인 스크롤이 되어야하는 디자인인데, 왜 스크롤을 완전히 차단했는지에 대해서 알아보자.
          // sitemap의 내부 내용이 길어 스크롤이 되어야 보이는 디자인인데, 이렇게 disableWindowScroll로 막아버리고, prevent-scroll로 스크롤을 완전히 차단해버려서 sitemap 내부에서 스크롤이 안되는 현상
          // 배경은 스크롤이 되면 안된다. 스크롤 바로 인한 너비때문인 것 같다. 배경에는 스크롤이 되지않게 prevent-scroll로 sitemap밖에 있는 main이 스크롤 되지 않게 완전히 차단을 했고,
          // sitemap의 내부는 스크롤이 되어야한다.(scroll-area) 하지만, html/body가 막히면 sitemap도 막힐 수 있기 때문에, sitemap 내부의 스크롤이 독립적으로 작동할 수 있도록 overscroll-behavior : contain을 이용한다.
          //[data-lenis-prevent]라는 속성을 scroll-area에(HTML) 넣어주고, CSS에서 overscroll-behavior : contain을 사용하면 적용이 되는데,
          // overscroll-behavior : contain은 내부에서만 스크롤 이벤트가 처리되고, 부모로는 전파되지 않도록 하는 CSS이다.
          // 그래서 lenis를 이용해서 data-lenis-prevent로 lenis 영향에서 분리가 되고, 내부 스크롤을 허용해 sitemap의 내부에서 스크롤이 가능하게 한다.

          // sitemap다지인이 나왔을 때 스크롤을 제어.
          window.disableWindowScroll();

          //document.documentElement는 html태그, html에 태그에 class를 부여 (prevent-scroll은 CSS에서 스크롤 완전 차단)
          document.documentElement.classList.add("prevent-scroll");
          $sitemap.classList.add("active");
          gsap.to($sitemap, {
            height: windowHeight,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      });

      // toggle클릭 이벤트를 각각 다르게 줘야 하기에 sitemap은 $sitemap.querySelector로 적용했음
      const $sitemapToggle = $sitemap.querySelector(".toggle");

      // toggle 아이콘에 click 이벤트 -> class를 삭제
      $sitemapToggle.addEventListener("click", (e) => {
        e.preventDefault();

        $header.classList.remove("show-sitemap");
        $sitemap.classList.remove("active");
      });
      // console.log($sitemapToggle);

      // 지금 문제는 family버튼을 누르면 sitemap에 디자인이 보임 -> 내가 보기엔 이유는 height가 modal-in-header에 공통적으로 들어가버리니
      // 둘의 크기가 같이 늘어나서 sitemap이 먼저 보이는 것 같음. -> HTMl에 height를 지정해서 주는 본페이지처럼 해야할 것 같음.  아니라면 height를 각각 class가 부여됐을 때에 주는 게 좋을 것 같다.
      // 각각에게 height를 주니 원활하게 돌아감.
    }

    // ----------------------------------------------------------------

    // 본페이지에서 javascript에 대한 것 더 배우기

    // 1. 스크롤 위치에 따라 #header의 data-theme 속성을 자동으로 변경하는 javascript.  보통 다크/라이트 테마 변경이나 섹션별 컬러 테마 전환 등에 자주 사용되는 구조
    // 그 전에 CSS에서 data-theme라는 속성 값에 명령을 줘야 가져올 수 있다. 그럼 먼저 CSS에서 부터 명령을 줘보자
    // CSS도 아니고, JS도 아닌 HTML에 data-theme 라는 속성을 기입을 해야 querySelector에서 NodeList로 가져올 수 있다.
    // 1-1. data-theme 속성을 가진 모든 요소를 가져온다. (속성은 HTML)
    const themeElements = document.querySelectorAll("[data-theme]");

    // 1-2 각 요소마다 실행하기 위해서 forEach()문을 사용했다.
    themeElements.forEach(($el, index) => {
      // #header 자체에도 data-theme 속성이 있을 수 있기 때문에 #header는 제외시킴.
      // !== 연산자는 "엄격하게 일치하지 않음"을 비교하는 연산자. ==는 "엄격하게 일치함"을 비교하는 연산자.
      // !==는 엄격하게 일치하지 않으면 true를 반환한다. -> 그말은 값과 타입 둘 중 하나라고 다르면 true를 변환하고, 둘 다 맞으면 false를 변환한다.
      // 즉, $el에 #header가 들어가있기 때문에 #header를 제외시키기 위해서 전부 같아야 false가 나오는 !== 연산자를 사용한 것이다.
      if ($el !== $header) {
        // dataset을 사옹하니 HTML에 기입했던 data-theme의 속성이 나온다.  -> dark라고 나온다.
        // dataset은 HTML요소의 사용자 정의 데이터 속성, 즉 data-*** 속성에 접근하기 위한 객체. -> 이 객체를 통해 HTML요소에 저장된 데이터를 읽고 수정할 수 있음.
        const theme = $el.dataset.theme;

        // ScrollTrigger를 이용 (GSAP) -> 이용하기 위해서는 라이브러리 파일이 필요함.
        // HTML에 script 태그를 이용해 파일을 불러온다.
        // 1-3. ScrollTrigger로 스크롤 감지 설정.
        ScrollTrigger.create({
          // main의 section별로 trigger가 되는 곳을 설정.
          trigger: $el,
          // trigger 시작하는 곳
          start: "top top",
          // trigger 끝나는 곳
          end: "bottom top",

          // start와 end를 표시해주는 명령.
          // markers: true,

          // onEnter와 onEnterBack은 특정 트리거 요소가 뷰포트의 특정 지점에 도달했을 때 실행되는 콜백 함수들 그 중 두가지가 onEnter와 onEnterBack
          // 왜 두개가 다 필요할까? 스크롤 애니메이션을 만들 때는 방향에 따른 다른 행동을 해야할 때가 많기 때문에. 아래로 스크롤 할 시 (onEnter) 위로 스크롤 할 시 (onEnterBack)

          // 이 아래 코드의 내용은 스크롤을 하다가 해당 트리거 요소가 뷰포트 안으로 들어오면 header 요소의 data-theme 속성을 현재 트리거 요소의 테마값으로 바꾸는 것이다.
          // onEnter는 start 지점에 도달해서 뷰포트에 들어올 때 실행 (아래로 스크롤)
          onEnter: () => {
            // dataset은 DOM요소(data-**) 속성에 접근할 수 있는 표준 속성
            // theme는 data-theme = 'dark'이기 때문에 dark로 테마가 변환된다.
            $header.dataset.theme = theme;
          },

          // onEnterBack은 end지점을 지나 다시 돌아와서 뷰포트에 돌아올 때 실행. (위로 스크롤)
          onEnterBack: () => {
            $header.dataset.theme = theme;
          },

          // 즉, 이 코드는 스크롤 위치에 따라 자동으로 헤더 테마를 바꾸는 로직이다.
          // 이 코드를 쓰기 위해서는 CSS에서 [data-theme = "dark"]처럼 지정하여 스타일을 만들고,
          // 자바스크립트로 테마를 변환하고, onEnter와 onEnterBack을 사용해서.
          // 꼭 HTMl에 data-theme 속성을 넣어줘야 사용할 수 있다.

          // 비슷한 콜백 함수는 onLeave() -> 요소가 아래로 스크롤되어 벗어날 때, onLeaveBack()함수 -> 요소가 위로 스크롤되어 벗어날 때 가 있다.
        });

        //1-4 왜 index === 1의 테마를 기본값으로 설정할까?
        // 스크롤 이벤트가 발생하기 전, 페이지가 로드되었을 때는 아직 ScrollTrigger의 콜백이 실행되지 않기에, 즉 스크롤 하지 않으면 헤더의 초기 테마를 모른다.
        // 그래서, 페이지가 로드된 직후의 헤더 테마를 data-theme를 가진 요소 중 첫번째 (여기서는 index ===1 라고 표현)것으로 지정.
        // index === 0이 아닌 index === 1로 설정한 이유는 0은 $el !== $header로 첫번째 요소의 0($header)를 제외시켰기 떄문에 첫번쨰 요소인 index === 1을 설정한 것이다.
        // 그래서 기본값으로 설정하는 큰 이유는 처음에 data-theme가 없는 상태로 스타일 적용될 수 있기 때문에

        // 첫번째 테마 요소의 테마 설정
        if (index === 1) {
          // 첫번째 요소의 테마를 기본값으로 설정.
          $header.dataset.theme = theme;
        }
      }

      // ScrollTrigger는 정상동작.
      // 이 코드를 사용하면 $el(각 섹션들)에 data-theme 속성이 들어가 있는데, 첫번째 섹션은 dark고정이고, 두번째 섹션도 변동없이 dark로 고정이고, 그 다음 세번째 섹션부터 dark에서 light으로 변경되고, 그 다음 섹션은 dark, 또 그다음 섹션 light으로 변경되는
      // data-theme 속성이 왔다갔다 하는 코드이다.
      // -> 실행이 안되서 다시 보니까 section에 data-theme속성을 부여하는 코드인데, HTML에 속성해줄 light, dark 둘 중 하나를 적용시키고, 적용시킨걸 유동적으로 바꿔주는 코드인데,
      // 속성이 왔다갔다 하는 코드가 아닌 스크롤하면서 각 섹션의 data-theme 값에 따라 header에 테마가 변환하는 코드이다.
      // 즉, 섹션에 달린 data-theme 속성이 header에 적용되는 코드인 것이다.

      //$el은 각각의 section영역 , index는 각 섹션별 번호.
    });

    console.log($submenus);
    // 5개의 서브메뉴들이 나온다.

    // 본페이지에 있는 javascript코드 배우기 - onResize함수에 대해(function으로 만든 함수)
    // 이 함수 코드는 브라우저 크기 변경(또는 초기 로딩 시)에 호출.
    // 목적은  서브메뉴(ul)들의 최대 높이를 계산해서 CSS 변수 --submenu-height에 설정해주는 코드
    function onResize() {
      // 브라우저의 가로 크기가 1279px보다 클 때만 실행.
      // 이유는 태블릿 이하 해상도(즉, 모바일,태블릿)에 GNB(메뉴)의 구조가 달라지거나 숨겨지므로, 서브메뉴의 높이를 계산할 필요가 없기 때문에. -> PC 해상도일 때만 submenu를 실행.
      if (window.innerWidth > 1279) {
        // 변수를 초기화하고, 서브메뉴들 중 가장 큰 높이값을 담아 둘 변수.
        let submenuHeight = 0;

        // $submenus 5개의 NodeList안의 서브메뉴 DOM요소를 하나씩 검사 forEach문을 사용해서 각각
        $submenus.forEach(($submenu) => {
          // 각각의 submenu에 ul을 찾아 변수로 저장한다.
          const ul = $submenu.querySelector("ul");

          // 각 서브메뉴 안에 ul이 있는 지 확인하고 없으면 건너뛴다.
          if (!ul) return;

          //임시로 auto로 설정해 자연 높이를 구한 후 원래 값으로 되돌림.
          // ul에 style에 접근하여 height를 "auto" 로 설정
          ul.style.height = "auto";

          // Math 객체는 수학 관련 상수와 함수를 위한 속성과 메서드를 제공하는 내장 객체. 즉, Math 객체 자체는 함수가 아니며, 프로퍼티나 메서드를 사용하여 수학 연산을 실행하는 객체이다.
          // Math의 max 최댓값을 반환 -> max() ()에 들어간 숫자들 중 가장 큰 값을 반환하는 정적 메서드이다.
          // ul.clientHeight로 현재 메뉴의 실제 높이를 가져온다. -> clientHeight는 프로퍼티로, 요소의 내부 높이를 픽셀 단위로 반환.
          // 지금까지의 submenuHeight와 비교해서 더 큰 값을 선택해 저장.
          submenuHeight = Math.max(submenuHeight, ul.clientHeight);

          // 다시 style에 접근해서 "auto"로 설정한 것을 ""로 돌려놓아 스타일을 지워지게 한다.(원복)
          ul.style.height = "";
        });
        // header에 style에 접근해서 submenuHeight를 구했으니 이것을 CSS 변수 --submenu-height로 저장한다.
        // 이렇게 하면 CSS 쪽에서 var(--submenu-height)를 써서 쉽게 사용할 수 있고, Js가 CSS에 영향을 주는 구조가 된다.
        $header.style.setProperty("--submenu-height", submenuHeight + "px");
      }

      // onResize() 함수가 필요한 이유는 서브메뉴 중 어떤 메뉴는 100px이고, 어떤 메뉴는 200px 일 때, 이 때 가장 큰 값을 가진 메뉴를 기준으로 삼아야한다면, 이 코드를 시용하면 가장 큰 높이를 자동으로 계산해 CSS에 적용한다.
      // 장점은 유지보수하기도 편하고, 반응형에서도 유연하게 대처 가능하다.

      // 그렇다면 이 onResize()를 사용하기 위해서는 무엇이 필요할까?
      // CSS에서 --submenu-height가 사용된 코드가 있어야한다. --submenu-height는 변수에 값을 할당한 것 뿐이라, 어디선가 이 변수를 활용한 CSS가 있어야한다.
      // 예를 들어 height에 calc(var (--submenu-height,0px) + 50px) 처럼
    }

    // 본페이지에서 사용된 코드 배우기 - resize이벤트 발생 시 onResize 호출

    // resize이벤트는 브라우저 창의 크기가 바뀔 때 이벤트 발생. resize 이벤트가 발생할 때마다 onResize를 실행.
    //resize앞에 onResize를 사용한 이유는 초기 호출이라는 것이다. 초기 호출은 이벤트를 기다리지 않고 페이지 로드 시 한 번 실행한다는 이야기다. 초기 호출한 이유는 처음 로드된 상태에서도 메뉴 높이 계산, 반응형 설정 등이 필요하기 때문이다.
    window.addEventListener("resize", onResize);
    onResize();

    // 저 위 이벤트를 실행한다면, 페이지를 로드할 때 바로 --submenu-height의 값이 나온다
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

    // lenis을 사용할 곳을 지정. -scroll에 관련된
    // 이걸 적용하면 확실히 부드러워지는 느낌을 줌.
    initLenis();

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
  }

  initCommonScroll();
});

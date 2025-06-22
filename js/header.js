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

    // show-menu가 됐을 때 header말고 main 블러 처리
  }

  //함수 밖에서 호출하면 바로 실행 가능
  initCommonHeader();

  // scroll값에 의해서 header의 색변화와 위치를 변경시켜 header가 보이지 않게
  // opaque 클래스를 추가해서 색을 변경
  // opaque 클래스에 hide를 추가해서 opaque hide 하여 위치를 변경해서
});

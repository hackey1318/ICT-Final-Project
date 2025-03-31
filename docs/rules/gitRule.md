## Git Branch 규칙

### 1. develop에서 자신이 개발할 Main Branch 생성(ex. 회원 관련 기능을 개발하는 사람이다. develop에서 user Branch 생성)
### 2. 작업 단위는 API 하나 당 하나의 Branch로 생성 (ex. 사용자 로그인을 만든다. user Branch에서 user/login Branch 생성)

   * Branch 명은기능에 맞춰서 짧게 작성하고 하위에 하위에 하위 이렇게 복잡하게 만들지 않는다. 
   * 자신이 한번에 여러 API를 개발할 자신이 없다면 하나의 개발이 끝내고 빠르게 Pull Requests를 올려서 다음 개발을 진행하도록 한다.
   * Commit 메시지는 누구나 메시지를 보고 무엇을 개발하고자 하는지 대략적으로 알 수 있게 작성한다. (ex. 사용자 로그인 기능 구현 O / oo X)
### 3. 개발 후, 문제 없이 동작을 한다면 자신의 Main Branch에 Pull Requests(이후, PR로 줄여서 이야기 한다.)를 올린다.
### 4. 절대 단독으로 해당 PR은 Merge하지 않는다.
### 5. PR을 올린 후, 카톡방에 코드 리뷰를 요청한다고 글을 올린다.
### 6. PR이 끝나고 만약 해당 내용이 develop Branch에 반영을 해야하는 상황이면 미리 이야기를 해준다.
### 7. develop에 반영을 해야하는 Branch 반영 후, 팀원 전체적으로 develop 최신화 밑 자신의 Branch로 정보 동기화를 한다. (잘 모를 시엔 주변 팀원, 팀장에게 문의)
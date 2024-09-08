# o-ey-editor-extension
<div align="center">

  ![](/docs/128.png)

</div>

BOJ에서 바로 [o-ey](https://github.com/kiwiyou/o-ey) 번역을 할 수 있게 하는 확장입니다.

## 설치
[Releases](https://github.com/iamgamja/o-ey-editor-extension/releases)에서 브라우즈에 맞는 zip 파일을 다운받아 설치해주세요.

## 사용법
'질문 게시판' 옆의 '번역하기' 버튼을 누르면 제목, 문단 아래에 미리보기와 입력창이 생성됩니다.

번역이 끝나고 '번역 html 복사' 버튼을 누르면 번역된 html이 클립보드에 복사됩니다.

### 자동 커밋
먼저 [kiwiyou/boj-user-translation](https://github.com/kiwiyou/boj-user-translation)을 포크해주세요.

또 https://github.com/settings/tokens 에서 Github Token을 생성해주세요. 이때 repo 권한을 체크해야 합니다.

팝업창에서 생성한 Token, 포크한 Github 계정의 Handle, Repository 이름, Branch 이름을 입력하고 'save' 버튼을 눌러주세요.

이제 번역이 끝난 후 (필요한 경우) 언어 코드를 수정하고 'commit' 버튼을 누르면 자동 커밋이 됩니다.

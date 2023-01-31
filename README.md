# @octodev/octodrive-sdk
OctoDrive - Security-first fully encrypted file storage service some basic features for OctoDrive.

> under construction
> some documentations are only in Korean yet.

## 목표
비밀번호든 키든 백엔드로 넘어가지 않는 완벽한 종단간 암호화 파일 스토리지 서비스를 만들자\
사실 종단간 암호화도 아닌게 종단간 암호화는 보내는 사람이랑 받는 사람이 있어야 되는데 그냥 혼자 받고 혼자 보내는거라... (중간에 서버는 암꺼도 모르고) 

## 왜 만들어?
대부분 파일 스토리지 서비스들은 파일을 암호화를 아예 안하거나 파일 암호화 키를 서버에서 받아서 하는데 (뭐 비번으로 대칭키 암호화 해놨겠지만) 중앙에 키 스토어가 있다는 말이니까 맘에 안듬 ㅇㅇ

## 원리
### 1. 파일 저장 구조
모든건 fs로 (속도는 나중에 생각하자)
```
스토리지
ㄴ 메타데이터들
  ㄴ <sha3(유저명+비밀번호)>
ㄴ 파일들
  ㄴ <랜덤16진수>
  ㄴ <랜덤16진수>
  ㄴ <랜덤16진수>
  ㄴ <랜덤16진수>
```

이걸 그냥 nginx 같은걸로 파일 리스팅 없이 정적 호스팅

### 2. 메타데이터 구조
`src/Metadata/Metadata.ts` 참고

### 3. 파일들 구조
`src/EncryptedData/EncryptedData.ts` 참고

### 요약
프론트엔드가 유저명과 비밀번호를 받으면

`/스토리지/메타데이터들/<sha3(유저명+비밀번호)>` 를 받아서 비밀번호로 aes를 풀고 (404가 뜨면 아이디 혹은 비번이 틀린거)

논리적 path 들을 읽어서 리스트 형태로 보여주고\
다운로드 누르면 매핑된 물리적 path에서 파일 받아서 비밀번호로 aes풀기

그러면 백엔드는 메타데이터를 볼수도 없고 암호화 키도 모르고 파일 내용도 못봄

ARP 스푸핑을 하든 SSL 위변조를 하든 상관없는게 비번은 네트워크에 안흐르고 모두 e2e 암호화 됨

### 고려사항
- 파일명에 = 안들어가도록 프론트엔드에서 막아야 함 (메타데이터에 injection될지도, 백엔드가 아니라 프론트엔드에서 하는 이유는 백엔드가 메타데이터를 볼수도 없고 injection한다 해도 메타데이터 깨지면 서버는 문제 없고 지가 손해임 ㅇㅇ)
- 비밀번호를 너무 짧게 하면 털리니까 프론트엔드에서 잘 막어야됨
- 자원봉사자는 아니니까 트레픽 쓰로틀링 빡세게 걸어야 됨

### 더 생각해 봐야할거
- 모든 파일을 같은 키로 암호화 하면 위험하지 않을까?

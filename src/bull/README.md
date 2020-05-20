# bull task queue

-   Email: 이메일 발송
-   SMS: 문자메시지 발송
-   RankManager: 랭크 업데이트 관리, subject x tutor 개수 만큼 하위 Rank 태스크를 생성, 매일 새벽 1시에 배치 작업
-   Rank: 랭크 업데이트를 위한 하위 태스크, subject x tutor 단위로 랭크를 업데이트하는 태스크

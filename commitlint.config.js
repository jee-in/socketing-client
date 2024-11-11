export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // 새로운 기능 추가
        "fix", // 버그 수정
        "docs", // 문서 변경 (README.md 수정 등)
        "style", // 코드 스타일 변경 (세미콜론 추가/삭제 등, 기능 변경 없음)
        "refactor", // 코드 리팩터링 (기능 변경 없음, 성능 개선 등)
        "test", // 테스트 추가/수정
        "chore", // 빌드 설정 변경, 의존성 업데이트 등 기타 작업
      ],
    ],
    "subject-case": [2, "always", "sentence-case"], // 첫 글자는 대문자
  },
};

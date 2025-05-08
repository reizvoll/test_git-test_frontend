# Git Test Frontend

[English](#english) | [한국어](#korean)

<a id="english"></a>
# Git Test Frontend

A frontend application for tracking GitHub activities.

## Tech Stack

- Next.js 14
- TypeScript
- React 18
- React Query
- Zustand
- Handsontable
- Axios
- SASS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the project root and set the following variables:
```
NEXT_PUBLIC_API_URL=your_backend_api_url
```

### Running the Application

Development mode:
```bash
npm run dev
# or
yarn dev
```

Production build:
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build the application for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint

## Project Structure

```
src/
├── app/          # Next.js app directory
├── components/   # React components
├── hooks/        # Custom React hooks
├── lib/          # Utility functions and configurations
├── store/        # Zustand store
└── styles/       # Global styles and SASS files
```

## License

MIT

---

<a id="korean"></a>
# Git Test Frontend

GitHub 활동 추적을 위한 프론트엔드 애플리케이션입니다.

## 기술 스택

- Next.js 14
- TypeScript
- React 18
- React Query
- Zustand
- Handsontable
- Axios
- SASS

## 시작하기

### 필수 조건

- Node.js (v18 이상)
- npm 또는 yarn

### 설치

1. 저장소 클론
```bash
git clone [repository-url]
```

2. 의존성 설치
```bash
npm install
# 또는
yarn install
```

3. 환경 변수 설정
`.env.local` 파일을 프로젝트 루트에 생성하고 다음 변수를 설정합니다:
```
NEXT_PUBLIC_API_URL=your_backend_api_url
```

### 실행

개발 모드:
```bash
npm run dev
# 또는
yarn dev
```

프로덕션 빌드:
```bash
npm run build
npm start
# 또는
yarn build
yarn start
```

## 사용 가능한 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션용 빌드
- `npm start`: 프로덕션 서버 실행
- `npm run lint`: ESLint 실행

## 프로젝트 구조

```
src/
├── app/          # Next.js app 디렉토리
├── components/   # React 컴포넌트
├── hooks/        # 커스텀 React 훅
├── lib/          # 유틸리티 함수 및 설정
├── store/        # Zustand 스토어
└── styles/       # 전역 스타일 및 SASS 파일
```

## 라이선스

MIT
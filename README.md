[English](#english) | [한국어](#korean)

<a id="english"></a>
# Git Test Frontend

GitHub Activity Tracker is a modern web application that helps developers monitor and analyze their GitHub contributions.

## Provides

- 📊 Detailed contribution analytics and statistics
- 🔄 Real-time updates of GitHub activities
- 📈 Historical contribution tracking
- 📱 Responsive design for all devices
- 🔐 Secure GitHub authentication

Visit the live demo: [GitHub Activity Tracker](https://test-git-test-frontend.vercel.app/)

## GitHub OAuth Setup

1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the application details:
- Application name: Your app name
- Homepage URL: `http://localhost:3000` (for development)
- Authorization callback URL: `http://localhost:8080/api/auth/callback/github` (follows backend development server)
4. After registration, you'll get:
- Client ID
- Client Secret
5. Add these credentials to your `.env.local` file

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
NEXT_PUBLIC_API_URL=your_backend_url

# GitHub OAuth
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_clientID
GITHUB_CLIENT_SECRET=your_github_clientSecret
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
├── src/
│ ├── app/ # Next.js app directory
│ ├── api/ # API related files
│ ├── assets/ # Font files
│ ├── components/ # React components
│ ├── lib/ # Utility functions and configurations
│ │   ├── hooks/ # Custom React hooks
│ │   ├── providers/ # React Context Provider
│ │   ├── store/ # Zustand store
│ │   └── types/ # TypeScript type definitions
│ └── styles/ # Global styles
├── public/ # Icon files (favicon.ico)
└── [config files] # Configuration files (next.config.mjs, tsconfig.json, etc.)
```

## License

MIT

---

<a id="korean"></a>
# Git Test Frontend

GitHub Activity Tracker는 GitHub 기여도를 모니터링하고 분석할 수 있도록 도와주는 웹 애플리케이션입니다.

## 주요 기능

- 📊 상세한 기여도 분석 및 통계
- 🔄 GitHub 활동 실시간 업데이트
- 📈 기여도 히스토리 추적
- 📱 모든 디바이스에 최적화된 반응형 디자인
- 🔐 안전한 GitHub 인증

실제 데모 확인하기: [GitHub Activity Tracker](https://test-git-test-frontend.vercel.app/)

## GitHub OAuth 설정

1. GitHub 설정 > 개발자 설정 > OAuth Apps로 이동
2. "New OAuth App" 클릭
3. 애플리케이션 정보 입력:
- 애플리케이션 이름: 앱 이름
- 홈페이지 URL: `http://localhost:3000` (개발 환경)
- 인증 콜백 URL: `http://localhost:8080/api/auth/callback/github` (백엔드 개발 서버를 따름)
4. 등록 후 다음 정보를 받게 됩니다:
- Client ID
- Client Secret
5. 이 정보들을 `.env.local` 파일에 추가

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

# GitHub OAuth
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_clientID
GITHUB_CLIENT_SECRET=your_github_clientSecret
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
├── src/
│ ├── app/         # Next.js app 디렉토리
│ ├── api/         # API 관련 파일
│ ├── assets/      # 폰트 파일 내장
│ ├── components/  # React 컴포넌트
│ ├── lib/         # 유틸리티 함수 및 설정
│ │   ├── hooks/   # 커스텀 React 훅
│ │   ├── providers/ # React Context Provider
│ │   ├── store/   # Zustand 스토어
│ │   └── types/   # TypeScript 타입 정의
│ └── styles/      # 전역 스타일
├── public/        # 아이콘 파일 (favicon.ico)
└── [config files] # 설정 파일들 (next.config.mjs, tsconfig.json 등)
```

## 라이선스

MIT
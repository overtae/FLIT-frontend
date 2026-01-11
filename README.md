# 프로젝트 구성 문서

FLIT Admin 프로젝트의 전반적인 구성, 기술 스택, 폴더 구조, 환경 변수 등에 대한 문서입니다.

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [주요 기능](#주요-기능)
5. [환경 변수](#환경-변수)
6. [설정 파일](#설정-파일)
7. [주요 의존성](#주요-의존성)

---

## 프로젝트 개요

- **프로젝트명**: FLIT Admin
- **버전**: 2.0.0
- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4

---

## 기술 스택

### Core Framework

- **Next.js**: 16.0.10 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.9.3

### UI & Styling

- **Tailwind CSS**: 4.1.5
- **Shadcn UI**: Radix UI 기반 컴포넌트 라이브러리
- **Lucide React**: 아이콘 라이브러리
- **next-themes**: 다크 모드 지원

### 상태 관리 & 데이터 페칭

- **Zustand**: 5.0.8 (클라이언트 상태 관리)
- **TanStack Query**: 5.90.8 (서버 상태 관리 및 데이터 페칭)
- **Axios**: 1.13.2 (HTTP 클라이언트)

### 폼 & 검증

- **React Hook Form**: 7.66.0
- **Zod**: 3.25.76 (스키마 검증)
- **@hookform/resolvers**: 3.10.0

### 테이블 & 데이터 시각화

- **TanStack Table**: 8.21.3 (데이터 테이블)
- **Recharts**: 2.15.4 (차트 라이브러리)
- **@dnd-kit**: 드래그 앤 드롭 (테이블 컬럼 정렬)

### 유틸리티

- **date-fns**: 3.6.0 (날짜 처리)
- **clsx**: 2.1.1 (클래스명 유틸리티)
- **tailwind-merge**: 3.4.0

### 문서 생성

- **jspdf**: 4.0.0 (PDF 생성)
- **html2canvas**: 1.4.1 (HTML to Canvas)
- **@e965/xlsx**: 0.20.3 (Excel 파일 처리)

### 개발 도구

- **ESLint**: 9.39.1
- **Prettier**: 3.6.2
- **Husky**: 9.1.7 (Git hooks)
- **lint-staged**: 15.5.2

---

## 프로젝트 구조

```
FLIT-frontend/
├── public/                    # 정적 파일
│   ├── assets/               # 로고, 아이콘 등
│   └── avatars/              # 아바타 이미지
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (external)/       # 외부 페이지 (인증 전)
│   │   ├── (main)/           # 메인 애플리케이션
│   │   │   ├── auth/         # 인증 관련 페이지
│   │   │   │   ├── login/    # 로그인 페이지
│   │   │   │   └── callback/ # 소셜 로그인 콜백
│   │   │   └── dashboard/    # 대시보드 페이지
│   │   │       ├── default/  # 기본 대시보드
│   │   │       ├── users/    # 유저 관리
│   │   │       ├── sales/    # 매출 관리
│   │   │       ├── transactions/ # 거래 관리
│   │   │       ├── settlements/  # 정산 관리
│   │   │       └── profile/    # 프로필
│   │   └── api/              # API Routes
│   │       └── v1/           # API v1 엔드포인트
│   │           ├── auth/     # 인증 API
│   │           ├── user/     # 유저 API
│   │           ├── sales/    # 매출 API
│   │           ├── transaction/ # 거래 API
│   │           └── settlement/  # 정산 API
│   │
│   ├── components/           # 공통 컴포넌트
│   │   ├── data-table/       # 데이터 테이블 컴포넌트
│   │   ├── providers/        # Context Providers
│   │   └── ui/               # Shadcn UI 컴포넌트
│   │
│   ├── config/               # 설정 파일
│   │   ├── app-config.ts     # 애플리케이션 설정
│   │   └── service-config.ts # 서비스 설정 (상수값)
│   │
│   ├── data/                 # Mock 데이터 (개발용)
│   │   ├── auth.ts
│   │   ├── sales.ts
│   │   ├── user.ts
│   │   └── ...
│   │
│   ├── hooks/                # 커스텀 훅
│   │   ├── use-data-table-instance.ts
│   │   ├── use-filtered-pagination.ts
│   │   └── use-mobile.ts
│   │
│   ├── lib/                  # 유틸리티 라이브러리
│   │   ├── api/              # API 클라이언트
│   │   │   ├── client.ts     # 인증 포함 HTTP 클라이언트
│   │   │   ├── client-fetch.ts
│   │   │   └── config.ts     # API 설정 및 환경 변수
│   │   ├── chart-utils.ts    # 차트 유틸리티
│   │   ├── format-date.ts    # 날짜 포맷팅
│   │   ├── format-number.ts  # 숫자 포맷팅
│   │   └── utils.ts          # 공통 유틸리티
│   │
│   ├── navigation/           # 네비게이션 설정
│   │   └── sidebar/          # 사이드바 메뉴 아이템
│   │
│   ├── scripts/              # 스크립트 파일
│   │   └── generate-theme-presets.ts
│   │
│   ├── server/               # Server Actions
│   │   └── server-actions.ts
│   │
│   ├── service/              # 비즈니스 로직 레이어
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── sales.service.ts
│   │   └── ...
│   │
│   ├── stores/               # Zustand 스토어
│   │   └── preferences/      # 사용자 선호도 설정
│   │
│   ├── styles/               # 스타일 파일
│   │   ├── presets/          # 테마 프리셋
│   │   │   ├── flit.css
│   │   │   ├── tangerine.css
│   │   │   ├── brutalist.css
│   │   │   └── soft-pop.css
│   │   └── globals.css       # 전역 스타일
│   │
│   └── types/                # TypeScript 타입 정의
│       ├── auth.type.ts
│       ├── user.type.ts
│       ├── sales.type.ts
│       └── ...
│
├── .env.example              # 환경 변수 예시 파일
├── next.config.mjs           # Next.js 설정
├── tsconfig.json             # TypeScript 설정
├── package.json              # 프로젝트 의존성
└── README.md                 # 프로젝트 README
```

### 아키텍처 특징

- **Colocation 기반 구조**: 각 기능(feature)이 자신의 페이지, 컴포넌트, 로직을 함께 보관
- **레이어 분리**:
    - `app/`: 라우팅 및 페이지 컴포넌트
    - `components/`: 재사용 가능한 UI 컴포넌트
    - `service/`: 비즈니스 로직
    - `lib/api/`: API 통신 로직
- **타입 안정성**: 모든 모듈에 TypeScript 타입 정의

---

## 주요 기능

### 1. 인증 시스템

- 이메일/비밀번호 로그인
- 소셜 로그인 (네이버, 카카오, 구글)
- JWT 기반 인증 (Access Token, Refresh Token)
- 비밀번호 검증 (민감한 작업 전)

### 2. 대시보드

- **Home**: 기본 대시보드
- **유저 관리**: 전체 유저, 고객, 샵, 플로리스트, 탈퇴자 관리
- **매출 관리**: 매출 분석, 상품 분석, 고객 분석, 주문 분석
- **거래 관리**: 주문, 수발주, 취소 거래 관리
- **정산 관리**: 정산 내역 조회 및 상세 정보

### 3. 데이터 테이블

- 정렬, 필터링, 페이지네이션
- 컬럼 드래그 앤 드롭 (컬럼 순서 변경)
- 엑셀/PDF 내보내기
- 다중 선택

### 4. 차트 및 시각화

- 매출 추이 차트
- 상품별 매출 분석
- 고객 분석 차트
- 기간별 통계

### 5. 테마 시스템

- 라이트/다크 모드
- 커스텀 테마 프리셋 (Flit, Tangerine, Brutalist, Soft Pop)
- 사용자 선호도 저장 (Zustand)

---

## 환경 변수

### 필수 환경 변수

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수를 설정하세요.

```env
# API 설정 (필수)
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_CLIENT_BASE_URL=https://admin.yourdomain.com

# 네이버 로그인
NEXT_PUBLIC_NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret

# 카카오 로그인
NEXT_PUBLIC_KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret

# 구글 로그인
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Mock 데이터 모드 (개발용)

백엔드 API가 없는 경우 Mock 데이터로 테스트할 수 있습니다.

```env
# NEXT_PUBLIC_API_BASE_URL을 설정하지 않으면 자동으로 Mock 모드로 동작
LOGIN_ID=admin
PASSWORD=password123
```

### 환경 변수 설명

| 변수명                            | 설명                   | 필수 | 비고                                                      |
|--------------------------------|----------------------|----|---------------------------------------------------------|
| `NEXT_PUBLIC_API_BASE_URL`     | 백엔드 API 서버의 기본 URL   | ✅  | 설정하지 않으면 Mock 모드로 동작                                    |
| `NEXT_PUBLIC_CLIENT_BASE_URL`  | 프론트엔드 애플리케이션의 공개 URL | ✅  | **프로덕션: 실제 도메인 필수** (예: `https://admin.yourdomain.com`) |
| `NEXT_PUBLIC_NAVER_CLIENT_ID`  | 네이버 OAuth 클라이언트 ID   | ✅  | 네이버 로그인                                                 |
| `NAVER_CLIENT_SECRET`          | 네이버 OAuth 클라이언트 시크릿  | ✅  | 서버 사이드에서만 사용                                            |
| `NEXT_PUBLIC_KAKAO_CLIENT_ID`  | 카카오 OAuth 클라이언트 ID   | ✅  | 카카오 로그인                                                 |
| `KAKAO_CLIENT_SECRET`          | 카카오 OAuth 클라이언트 시크릿  | ✅  | 서버 사이드에서만 사용                                            |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | 구글 OAuth 클라이언트 ID    | ✅  | 구글 로그인                                                  |
| `GOOGLE_CLIENT_SECRET`         | 구글 OAuth 클라이언트 시크릿   | ✅  | 서버 사이드에서만 사용                                            |
| `LOGIN_ID`                     | Mock 모드 로그인 ID       | ⚪  | 개발/테스트용                                                 |
| `PASSWORD`                     | Mock 모드 로그인 비밀번호     | ⚪  | 개발/테스트용                                                 |

---

## 설정 파일

### next.config.mjs

Next.js 설정 파일입니다.

```javascript
const nextConfig = {
    reactCompiler: true,  // React Compiler 활성화
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",  // 프로덕션에서 console 제거
    },
    redirects: [
        {
            source: "/dashboard",
            destination: "/dashboard/default",
            permanent: false,
        },
    ],
}
```

### tsconfig.json

TypeScript 컴파일러 설정입니다.

- **경로 별칭**: `@/*` → `./src/*`
- **Strict 모드**: 활성화
- **JSX**: `react-jsx` 모드

### src/config/app-config.ts

애플리케이션 기본 설정입니다.

```typescript
const APP_CONFIG = {
    name: "Flit Admin",
    version: "2.0.0",
    copyright: "© 2025, Flit Admin.",
    meta: {
        title: "Flit Admin",
        description: "웹사이트 설명",
    },
}
```

### src/config/service-config.ts

서비스에서 사용하는 상수값들을 정의합니다.

- 사용자 역할 (Master, User)
- 사용자 타입 (개인, 기업, Shop, Florist)
- 고객 등급 (Green, Yellow, Orange, Red, Silver, Gold)
- 결제 방법 (카드, POS, 계좌이체, 플릿결제 등)
- 거래 타입 (바로고, 픽업, 환불, 수발주 등)
- 배송 상태, 주문 상태, 정산 상태 등

---

## 주요 의존성

### 핵심 라이브러리

| 패키지         | 버전       | 용도              |
|-------------|----------|-----------------|
| next        | ^16.0.10 | Next.js 프레임워크   |
| react       | ^19.2.3  | React 라이브러리     |
| typescript  | ^5.9.3   | TypeScript 컴파일러 |
| tailwindcss | ^4.1.5   | CSS 프레임워크       |

### 상태 관리 & 데이터

| 패키지                   | 버전      | 용도          |
|-----------------------|---------|-------------|
| zustand               | ^5.0.8  | 클라이언트 상태 관리 |
| @tanstack/react-query | ^5.90.8 | 서버 상태 관리    |
| axios                 | ^1.13.2 | HTTP 클라이언트  |

### UI 컴포넌트

| 패키지                   | 버전       | 용도       |
|-----------------------|----------|----------|
| @tanstack/react-table | ^8.21.3  | 데이터 테이블  |
| recharts              | ^2.15.4  | 차트 라이브러리 |
| react-hook-form       | ^7.66.0  | 폼 관리     |
| zod                   | ^3.25.76 | 스키마 검증   |

### 유틸리티

| 패키지        | 버전      | 용도          |
|------------|---------|-------------|
| date-fns   | ^3.6.0  | 날짜 처리       |
| jspdf      | ^4.0.0  | PDF 생성      |
| @e965/xlsx | ^0.20.3 | Excel 파일 처리 |

---

## API 구조

### API 엔드포인트

프로젝트는 Next.js API Routes를 사용하여 백엔드 API와 통신합니다.

#### 인증 API (`/api/v1/auth`)

- `POST /api/v1/auth/login` - 로그인
- `POST /api/v1/auth/logout` - 로그아웃
- `POST /api/v1/auth/refresh` - 토큰 갱신
- `GET /api/v1/auth/me` - 현재 사용자 정보
- `POST /api/v1/auth/password-verification` - 비밀번호 검증
- `POST /api/v1/auth/{provider}/callback` - 소셜 로그인 콜백

#### 유저 API (`/api/v1/user`)

- `GET /api/v1/user` - 유저 목록 조회
- `GET /api/v1/user/{id}` - 유저 상세 조회

#### 매출 API (`/api/v1/sales`)

- `GET /api/v1/sales/revenue/*` - 매출 데이터
- `GET /api/v1/sales/product/*` - 상품 데이터
- `GET /api/v1/sales/customer/*` - 고객 데이터
- `GET /api/v1/sales/order/*` - 주문 데이터

#### 거래 API (`/api/v1/transaction`)

- `GET /api/v1/transaction` - 거래 목록
- `GET /api/v1/transaction/{id}` - 거래 상세

#### 정산 API (`/api/v1/settlement`)

- `GET /api/v1/settlement` - 정산 목록
- `GET /api/v1/settlement/{id}` - 정산 상세

### API 클라이언트

`src/lib/api/client.ts`에서 인증 토큰을 자동으로 포함하여 API를 호출합니다.

- Access Token 자동 포함
- Refresh Token 자동 갱신
- 에러 처리

---

## 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint

# 코드 포맷팅
npm run format

# 포맷팅 검사
npm run format:check

# 테마 프리셋 생성
npm run generate:presets
```

---

## 추가 정보

### 코드 스타일

- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **Husky**: Git hooks를 통한 자동 검사
- **lint-staged**: 커밋 전 자동 린트 실행

### 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)


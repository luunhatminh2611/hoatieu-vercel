# Setup Guide - Redux & API Integration

## 📁 Cấu trúc Folder

```
src/
├── config/
│   └── env.ts              # Cấu hình API URL
├── store/
│   ├── index.ts            # Redux store với persist
│   ├── hooks.ts            # Typed hooks (useAppDispatch, useAppSelector)
│   └── slices/
│       └── authSlice.ts    # Auth state management
├── services/
│   ├── axios.ts            # Axios instance với interceptors
│   └── api/
│       ├── index.ts        # Export tất cả API services
│       └── auth.ts         # Auth API endpoints
└── hooks/
    └── useAuth.tsx         # Custom hook cho authentication
```

## 🚀 Cách sử dụng

### 1. Cấu hình API URL

Chỉnh sửa file `src/config/env.ts`:

```typescript
export const ENV = {
  API_BASE_URL: 'https://your-actual-api-url.com/api',
} as const;
```

**Lưu ý:** Lovable không sử dụng file `.env` truyền thống. Bạn có thể:
- Lưu API URL trực tiếp trong `env.ts` nếu là public API
- Sử dụng Lovable Cloud để lưu secret keys an toàn

### 2. Sử dụng Authentication trong Component

```tsx
import { useAuth } from '@/hooks/useAuth';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123'
      });
      // Tự động điều hướng sau khi login thành công
    } catch (error) {
      // Lỗi đã được xử lý trong hook
    }
  };

  return (
    <button onClick={handleLogin}>
      Đăng nhập
    </button>
  );
}
```

### 3. Truy cập Auth State

```tsx
import { useAppSelector } from '@/store/hooks';

function ProfilePage() {
  const { user, token } = useAppSelector((state) => state.auth);

  return (
    <div>
      <h1>Xin chào, {user?.name}</h1>
      <p>Role: {user?.role}</p>
    </div>
  );
}
```

### 4. Thêm API Service mới

Tạo file mới trong `src/services/api/`, ví dụ `orders.ts`:

```typescript
import axiosInstance from '../axios';

export const ordersApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await axiosInstance.post('/orders', data);
    return response.data;
  },
};
```

Sau đó export trong `src/services/api/index.ts`:

```typescript
export * from './auth';
export * from './orders';
```

### 5. Tạo Slice mới trong Redux

Tạo file trong `src/store/slices/`, ví dụ `ordersSlice.ts`:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrdersState {
  orders: any[];
  loading: boolean;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<any[]>) => {
      state.orders = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setOrders, setLoading } = ordersSlice.actions;
export default ordersSlice.reducer;
```

Thêm vào store (`src/store/index.ts`):

```typescript
import ordersReducer from './slices/ordersSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  orders: ordersReducer, // Thêm dòng này
});
```

## 🔒 Token Management

- Token được lưu tự động vào localStorage thông qua Redux Persist
- Token được tự động thêm vào header của mỗi request thông qua axios interceptor
- Khi token hết hạn (401), user sẽ tự động logout và chuyển về trang login

## 🎯 Các tính năng đã setup

✅ Redux Toolkit với TypeScript
✅ Redux Persist - lưu auth state vào localStorage
✅ Axios instance với interceptors
✅ Tự động thêm Bearer token vào requests
✅ Tự động logout khi token hết hạn (401)
✅ Type-safe hooks (useAppDispatch, useAppSelector)
✅ Custom useAuth hook với login/signup/logout
✅ Toast notifications cho auth actions
✅ Auto-redirect dựa trên user role

## 📝 Next Steps

1. Thay đổi `API_BASE_URL` trong `src/config/env.ts`
2. Cập nhật interface `User` trong `authSlice.ts` theo API của bạn
3. Thêm các API endpoints khác trong folder `src/services/api/`
4. Tạo các slices mới nếu cần state management thêm
5. Sử dụng `useAuth` hook trong các component cần authentication

## 🛠️ Production Ready

Project đã được setup với:
- TypeScript cho type safety
- Redux DevTools (development only)
- Axios error handling
- Loading states
- Toast notifications
- Auto token refresh (có thể mở rộng)
- Persistent authentication

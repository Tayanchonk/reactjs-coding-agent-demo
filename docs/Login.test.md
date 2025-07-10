# เอกสารอธิบายการทำงานของ Login.test.tsx

## ภาพรวม
ไฟล์ `Login.test.tsx` เป็นไฟล์สำหรับทดสอบคอมโพเนนต์ `Login` โดยใช้ Vitest เป็น testing framework ร่วมกับ React Testing Library เพื่อทดสอบการทำงานของฟอร์มล็อกอิน ตั้งแต่การแสดงผลไปจนถึงการทำงานของฟังก์ชันต่างๆ

## โครงสร้างการทดสอบ

### การ Import และการเตรียมการทดสอบ
```tsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Auth/Login';
```

- `vitest`: ใช้ฟังก์ชันสำหรับการเขียนเทส
- `@testing-library/react`: ใช้สำหรับการ render และจัดการคอมโพเนนต์ React ใน test environment
- `MemoryRouter`: ใช้เพื่อจำลองสภาพแวดล้อมของ React Router

### การจำลอง localStorage
```tsx
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
```
- สร้าง mock สำหรับ localStorage เพื่อให้สามารถทดสอบการบันทึกสถานะการล็อกอินได้
- เป็นการจำลอง localStorage โดยใช้ JavaScript object
- ทำให้สามารถตรวจสอบค่าที่ถูกเก็บใน localStorage ได้โดยไม่ต้องใช้ localStorage จริงของเบราว์เซอร์

## กลุ่มการทดสอบ (Test Suites)
```tsx
describe('Login Component', () => {
  const mockLoginSuccess = vi.fn();
  
  afterEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });
  
  // Test cases here...
});
```
- `mockLoginSuccess`: เป็น mock function ที่จะถูกส่งเข้าไปเป็น prop `onLoginSuccess` ของคอมโพเนนต์ Login
- `afterEach`: ใช้สำหรับล้างค่าต่างๆ หลังจากรันแต่ละเทสเคส เพื่อให้แต่ละเทสเป็นอิสระจากกัน

## กรณีทดสอบ (Test Cases)

### 1. ทดสอบการแสดงผล UI ของฟอร์มล็อกอิน
```tsx
it('renders login form correctly', () => {
  render(
    <MemoryRouter>
      <Login onLoginSuccess={mockLoginSuccess} />
    </MemoryRouter>
  );
  
  expect(screen.getByText(/Login to Product Management/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
});
```
- ทดสอบว่าคอมโพเนนต์แสดงองค์ประกอบที่สำคัญครบถ้วน
- ใช้ `screen.getByText` และ `screen.getByLabelText` เพื่อค้นหา elements ต่างๆ บนหน้าจอ
- ตรวจสอบว่าหัวข้อ, ฟิลด์ username, ฟิลด์ password และปุ่ม login มีการแสดงผลอย่างถูกต้อง

### 2. ทดสอบการ validate ฟอร์มเมื่อฟิลด์ว่าง
```tsx
it('shows validation errors when fields are empty', async () => {
  render(
    <MemoryRouter>
      <Login onLoginSuccess={mockLoginSuccess} />
    </MemoryRouter>
  );
  
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  
  expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
  
  // Fill in username but leave password empty
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'admin' } });
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  
  expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
});
```
- ทดสอบการ validate form เมื่อมีการกด submit โดยที่ฟิลด์ยังว่างอยู่
- ใช้ `fireEvent.click` เพื่อจำลองการคลิกปุ่ม login
- ตรวจสอบว่ามีข้อความแจ้งเตือนว่า "username is required" เมื่อไม่กรอก username
- ใช้ `fireEvent.change` เพื่อจำลองการกรอก username แต่ปล่อย password ว่าง
- ตรวจสอบว่ามีข้อความแจ้งเตือนว่า "password is required" เมื่อไม่กรอก password

### 3. ทดสอบการแสดงข้อความผิดพลาดเมื่อล็อกอินด้วยข้อมูลไม่ถูกต้อง
```tsx
it('shows error message for invalid credentials', async () => {
  render(
    <MemoryRouter>
      <Login onLoginSuccess={mockLoginSuccess} />
    </MemoryRouter>
  );
  
  // Fill in invalid credentials
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wrong' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  
  // Wait for the simulated API call to complete
  await waitFor(() => {
    expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
  });
  
  expect(mockLoginSuccess).not.toHaveBeenCalled();
  expect(localStorageMock.getItem('isAuthenticated')).toBeNull();
});
```
- ทดสอบการล็อกอินด้วยข้อมูลที่ไม่ถูกต้อง
- จำลองการกรอกข้อมูลที่ไม่ถูกต้องและกดปุ่ม login
- ใช้ `waitFor` เพื่อรอให้การจำลอง API call เสร็จสิ้น
- ตรวจสอบว่ามีข้อความแจ้งเตือน "invalid username or password"
- ตรวจสอบว่าไม่มีการเรียกใช้ฟังก์ชัน `mockLoginSuccess`
- ตรวจสอบว่าไม่มีการบันทึกค่า 'isAuthenticated' ใน localStorage

### 4. ทดสอบการล็อกอินสำเร็จด้วยข้อมูลที่ถูกต้อง
```tsx
it('successfully logs in with correct credentials', async () => {
  render(
    <MemoryRouter>
      <Login onLoginSuccess={mockLoginSuccess} />
    </MemoryRouter>
  );
  
  // Fill in correct credentials
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'admin' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'P@ssw0rd' } });
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  
  // Wait for the simulated API call to complete
  await waitFor(() => {
    expect(mockLoginSuccess).toHaveBeenCalledTimes(1);
  });
  
  expect(localStorageMock.getItem('isAuthenticated')).toBe('true');
});
```
- ทดสอบการล็อกอินด้วยข้อมูลที่ถูกต้อง
- จำลองการกรอก username "admin" และ password "P@ssw0rd" ซึ่งเป็นค่าที่ถูกต้อง
- ตรวจสอบว่ามีการเรียกฟังก์ชัน `mockLoginSuccess` 1 ครั้ง
- ตรวจสอบว่ามีการบันทึกค่า 'isAuthenticated' เป็น 'true' ใน localStorage

### 5. ทดสอบการแสดงสถานะ Loading ระหว่างการส่งข้อมูล
```tsx
it('shows loading state while submitting', async () => {
  render(
    <MemoryRouter>
      <Login onLoginSuccess={mockLoginSuccess} />
    </MemoryRouter>
  );
  
  // Fill in correct credentials
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'admin' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'P@ssw0rd' } });
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  
  // Button should show loading state
  expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
  expect(screen.getByRole('button')).toBeDisabled();
  
  // Wait for the simulated API call to complete
  await waitFor(() => {
    expect(mockLoginSuccess).toHaveBeenCalledTimes(1);
  });
});
```
- ทดสอบการแสดงสถานะ loading ระหว่างที่กำลังล็อกอิน
- จำลองการกรอกข้อมูลที่ถูกต้องและกดปุ่ม login
- ตรวจสอบว่าปุ่ม login เปลี่ยนข้อความเป็น "Logging in..." และถูก disabled
- รอให้การจำลอง API call เสร็จสิ้น

## สรุปประเด็นสำคัญในการเขียนเทส
1. **การแยกเทส**: แต่ละเทสเคสควรทดสอบเพียงหนึ่งฟังก์ชันหรือพฤติกรรมเท่านั้น
2. **การทำความสะอาดหลังเทส**: ใช้ `afterEach` เพื่อล้างสถานะและ mock ต่างๆ หลังจากรันแต่ละเทสเคส
3. **การจำลองสภาพแวดล้อม**: จำลอง localStorage และฟังก์ชัน callback เพื่อให้สามารถทดสอบได้โดยไม่ต้องพึ่งพาสภาพแวดล้อมจริง
4. **การใช้ Async/Await**: ใช้ async/await และ waitFor เพื่อรอให้การทำงานที่ไม่เป็นแบบ synchronous เสร็จสิ้น
5. **การตรวจสอบ UI**: ใช้ React Testing Library เพื่อตรวจสอบว่า UI มีการแสดงผลตามที่คาดหวัง

## คำแนะนำเพิ่มเติม
- ควรเพิ่มเทสกรณีอื่นๆ เช่น การตรวจสอบรูปแบบอีเมลหรือความยาวของรหัสผ่าน หากมีการเพิ่มการ validate เพิ่มเติม
- ควรพิจารณาเพิ่มการทดสอบการจัดการข้อผิดพลาดจากการเรียก API หากในอนาคตมีการปรับเปลี่ยนการล็อกอินให้เป็นการเรียกใช้ API จริง
- อาจเพิ่มการทดสอบ end-to-end ด้วย tools เช่น Cypress เพื่อทดสอบการทำงานของระบบล็อกอินทั้งระบบ

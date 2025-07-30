import React, { useState, useEffect } from 'react';

// Security vulnerability: Hard-coded credentials
const API_KEY = "1234567890abcdef";
const DATABASE_PASSWORD = "admin123";

// Code smell: Unused variable
const unusedVariable = "This variable is never used";

// Bug: Null dereference
function nullDereference(obj: any) {
  // This might cause a null pointer exception
  return obj.property.nestedProperty;
}

// Bug: Array out of bounds
function outOfBounds(arr: number[]) {
  // This will throw an error if array is empty
  return arr[arr.length];  // Should be arr.length - 1 for last element
}

// Code smell: Duplicate code
function duplicate1(a: number, b: number) {
  let result = 0;
  for (let i = 0; i < 10; i++) {
    result += a * b;
    console.log("Processing iteration: " + i);
  }
  return result;
}

function duplicate2(x: number, y: number) {
  let output = 0;
  for (let i = 0; i < 10; i++) {
    output += x * y;
    console.log("Processing iteration: " + i);
  }
  return output;
}

// Bug: Infinite loop
function infiniteLoop() {
  let i = 0;
  while (i < 10) {
    console.log(i);
    // No increment, will run forever
  }
}

// Security vulnerability: SQL Injection
function unsafeSqlQuery(userId: string) {
  // This is vulnerable to SQL injection
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  return query;
}

// Bug: Unreachable code
function unreachableCode() {
  return "Result";
  // This code will never run
}

// Code smell: Too many parameters
function tooManyParams(
  a: string,
  b: string,
  c: string,
  d: string,
  e: string,
  f: string,
  g: string,
  h: string,
  i: string,
  j: string,
  k: string
) {
  return a + b + c + d + e + f + g + h + i + j + k;
}

// React component with bugs
const BuggyComponent: React.FC = () => {
  // Bug: State variable declared but never used
  const [unusedState, setUnusedState] = useState<string>('unused');
  
  // Bug: Empty dependency array but using variable that should be a dependency
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log(`Count changed to ${count}`);
    // Should have [count] as dependency
  }, []);
  
  // Bug: Function called during render that modifies state
  if (count < 5) {
    setCount(count + 1); // This will cause an infinite loop in React
  }
  
  return (
    <div>
      <h1>Buggy Component</h1>
      <p onClick={() => {
        // Security vulnerability: Using eval
        eval("console.log('This is unsafe')");
      }}>Click me for unsafe code execution</p>
      
      {/* Bug: Accessibility issue - missing alt attribute */}
      <img src="https://example.com/image.jpg" />
      
      {/* Bug: Potential XSS vulnerability */}
      <div dangerouslySetInnerHTML={{ __html: '<script>alert("XSS")</script>' }} />
    </div>
  );
};

export default BuggyComponent;
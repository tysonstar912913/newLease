# lease_management
Monorepo for Lease Management System

Based from https://github.com/Bikranshu/express-react-boilerplate.git

### 2. Installation

On the command prompt run the following commands:

``` 
 $ cp .env.example .env (edit it with your secret key and database information)
 $ npm install
 $ npm run migrate
 ```
 Finally, start and build the application:
 
 ```
 $ npm run build (For development)
 $ npm run build:prod (For production)
```

List of NPM Commands:
 
  ```
  $ npm run lint       # linting
  $ npm run clean      # remove dist and node_modules folder and install dependencies
 ```

### 3. Usage

URL : http://localhost:3000/

Navigate to http://localhost:3000/swagger for the API documentation.

### 4. Warning
```
node-gyp error : https://stackoverflow.com/questions/51222536/error-while-installing-bycrpt-in-nodejs-whenever-i-run-npm-install-install-sa

npm install --global --production windows-build-tools
```

```
dynamic error : https://github.com/styleguidist/react-styleguidist/issues/987
npm install @babel/plugin-syntax-dynamic-import
```
## Publishing to npm

We are finally ready to publish our component to npm. Here is our publishing checklist:

1. **Check Version Number**

   - Ensure that the version number in your `package.json` file is correct and follows semantic versioning rules. Each time you publish to npm, you must use a new version number.

2. **Run Tests**

   - Ensure all tests pass:
     ```sh
     $ npm test
     ```

3. **Create Build Files**

   - Create the build files:
     ```sh
     $ npm run build
     ```
   - Both UMD and ESM module formats are created and placed in the `/dist` folder. Note that React is not bundled alongside your component. Only your component code and any dependencies are included.

4. **Log into npm**

   - Ensure you are logged into npm. If not, type:
     ```sh
     $ npm login
     ```

5. **Publish Your Component**
   - Publish your component:
     ```sh
     $ npm publish
     ```

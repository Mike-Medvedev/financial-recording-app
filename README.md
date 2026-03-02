# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## TestFlight distribution (iOS)

To ship a build to TestFlight so others (e.g. your girlfriend) can install the app on their iPhone:

1. **Install EAS CLI and log in**
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Configure the project** (first time only)
   ```bash
   eas build:configure
   ```
   Ensure you have an [Apple Developer account](https://developer.apple.com) and that the app exists in [App Store Connect](https://appstoreconnect.apple.com) (create it if needed; the bundle ID must match your `app.json` / Expo config).

3. **Build and submit to TestFlight**
   ```bash
   eas build -p ios --profile production --submit
   ```
   Or use the shortcut (if configured): `npx testflight`

4. **Optional: skip prompts** by setting env vars:
   ```bash
   export EXPO_APPLE_ID=your@email.com
   export EXPO_APPLE_TEAM_ID=XXXXXXXXXX
   ```

5. After the build finishes, it will appear in App Store Connect → TestFlight. Add testers (internal or external); they can install the app via the TestFlight app on their iPhone.

---

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

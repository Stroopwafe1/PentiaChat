# Pentia Chat

I've been tasked by Pentia Mobile to make a simple chat application using the Firebase platform and React Native.

## Directory Structure

PentiaChat: The main application

- .bundle: The configuration needed for IOS (I think)
- \_\_tests__: The unit tests for React
- android: The generated Android project for use in Android Studio
- components: Reusable components for potentially other projects
- ios: The generated IOS project to build in XCode
- models: Data models for type hints inside the project
- screens: The screens used in the application, these are not meant to be used in other projects

Admin: A small NodeJS project to circumvent Firebase's tier upgrade (I want to stay on the free tier without putting in payment details but still need some of the features)

## Requirements / Dependencies

- NodeJS >= 22.0
- Git
- Android SDK >= 34 (I only tested with 34 and 35)
- JDK >= 17

## Setting up your environment
Follow the guide on [React Native's guide](https://reactnative.dev/docs/set-up-your-environment)

- Make sure that the environment variable `ANDROID_HOME`, and `ANDROID_NDK_ROOT` are set to a writable location
- Download Android SDK >= 34 inside the `ANDROID_HOME` directory
- Modify your `PATH` environment variable to include the binaries from the Android SDK

## Setup

1. Clone this repository

```bash
$ git clone https://github.com/Stroopwafe1/PentiaChat.git
```

2. Install node modules

```bash
$ cd PentiaChat/PentiaChat
$ npm i
```

3. Start dev script

```bash
$ npm run start
```

4. Start app

```bash
$ npm run android
```

## Troubleshooting

1. It doesn't want to connect to ADB
	- Make sure you have the ADB server/daemon started
	- Make sure USB debugging is enabled on your device
		- Settings -> System -> Developer Options -> USB debugging
	- List devices with `adb devices`
	- Pass through the port connection with `adb reverse tcp:8081 tcp:8081`
	- Maybe replug your device a couple times

2. The phone has an error that it cannot load the bundle
	- Pass through the port connection with `adb reverse tcp:8081 tcp:8081`
	- Shake your phone (yes, really)
	- Tap on Settings -> Debug server host & port for device
	- Use localhost:8081

3. The phone has a blank screen/white screen
	- Rerun the `npm run android` command from a separate terminal window

4. Android Studio cannot build the project
	- Make sure you open the `PentiaChat/android` folder. This is very important. Android Studio will not recognise it as an Android project otherwise

5. Android Studio complains that the AGP version of the project is incompatible with Android Studio
	- Use AGP Update Assistant
		- In case it doesn't want to load or start up, Android Studio did not recognise your project as an Android project. Try to clear cache and reload (making sure that the top-level folder in Android Studio is `android`)
	- Modify the `PentiaChat/android/build.gradle` from `classpath("com.android.tools.build:gradle")` to `classpath("com.android.tools.build:gradle:8.7.0")`
	- If none of these work, install the newer version of Android Studio

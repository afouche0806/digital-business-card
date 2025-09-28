# How to Build a Native Android APK

This document provides high-level instructions on how to take this web application project and compile it into a native Android package (`.apk`).

**Disclaimer:** This process cannot be done within the Termux environment. It requires a standard desktop computer (Windows, macOS, or Linux) with a full Android development environment installed.

---

## 1. Prerequisites

Before you begin, you must have the following software installed on your computer:

1.  **Node.js and npm:** Required for installing the build tools. You can get it from [nodejs.org](https://nodejs.org/).
2.  **Java Development Kit (JDK):** A specific version may be required depending on the build tools. (e.g., JDK 11).
3.  **Android Studio:** This is the official Android IDE. Most importantly, it includes the **Android SDK**, which contains the necessary libraries and tools to build Android apps. You can get it from the [Android Developer website](https://developer.android.com/studio).
4.  **Apache Cordova:** This is the framework that will wrap the web app in a native shell. Install it globally using npm:
    ```bash
    npm install -g cordova
    ```

---

## 2. Step-by-Step Instructions

### Step 2.1: Create a New Cordova Project

On your computer, open a terminal or command prompt and run the following commands. This will create a new blank project.

```bash
# Create the project directory
cordova create MyBusinessCard com.example.mycard "My Business Card"

# Navigate into the new directory
cd MyBusinessCard

# Add the Android platform
cordova platform add android
```

### Step 2.2: Copy Your Web App Files

The Cordova project has a `www` folder which contains the web content. You need to replace the contents of this folder with our project files.

1.  Delete everything inside the `MyBusinessCard/www` directory.
2.  Copy all the files from this `digital-business-card` project (e.g., `index.html`, `style.css`, `card.js`, `quoting-app/`, etc.) into the `MyBusinessCard/www` directory.

### Step 2.3: Configure the Project

Open the `config.xml` file located in the root of your `MyBusinessCard` project. Here you can:

*   Change the app name and description.
*   Set the author information.
*   Define icons and splash screens.
*   **Important for `localStorage`:** You may need to add the following preference to ensure `localStorage` data persists correctly:
    ```xml
    <preference name="AndroidPersistentFileLocation" value="Compatibility" />
    ```

### Step 2.4: Build the APK

Now, you can build the `.apk` file. Run the following command from the root of your `MyBusinessCard` project:

```bash
cordova build android
```

If the build is successful, you will find your unsigned debug APK file in:
`platforms/android/app/build/outputs/apk/debug/app-debug.apk`

This file can be installed on an Android device for testing.

---

## 3. Next Steps (for Release)

To distribute your app (e.g., on the Google Play Store), you must create a **release build**. This involves:

1.  Building with the `--release` flag: `cordova build android --release`.
2.  **Signing** the APK with a private key that you generate.
3.  **Aligning** the APK with `zipalign`.

This process is more detailed and security-sensitive. For this, you should follow the official Cordova and Android documentation on signing applications.
